import { describe, it, expect, afterEach } from "vitest";
import { getRealtimeHub } from "@nodefony/realtime";
import type { IRealtimeToken } from "@nodefony/realtime";
import { createRealtimeHarness } from "@nodefony/realtime/testing";
import LiveController from "../nodefony/controllers/LiveController";

/** Lit un champ d'une valeur reçue du réseau, sans présumer de sa forme. */
function field(value: unknown, key: string): unknown {
  return typeof value === "object" && value !== null && key in value
    ? Reflect.get(value, key)
    : undefined;
}

/**
 * Jeton de session factice : celui que le pare-feu aurait résolu au handshake.
 *
 * `getAttribute` est une signature à surcharge : le contrat `IRealtimeToken` la
 * veut typée par l'APPELANT (`getAttribute<IUser>("user")`), ce qu'aucune
 * implémentation ne peut vérifier — la surcharge le dit, au lieu de le cacher
 * derrière une conversion.
 */
class SessionStubToken implements IRealtimeToken {
  readonly type = "session";

  constructor(
    private readonly identifier: string,
    private readonly attributes: ReadonlyMap<string, unknown>,
  ) {}

  getUserIdentifier = (): string => this.identifier;
  isAuthenticated = (): boolean => true;
  getRoles = (): string[] => ["ROLE_USER"];
  getScopes = (): string[] => [];

  // oxlint-disable-next-line typescript/no-unnecessary-type-parameters -- forme imposée par IRealtimeToken
  getAttribute<T = unknown>(key: string): T | undefined;
  getAttribute(key: string): unknown {
    return this.attributes.get(key);
  }
}

/**
 * Tests de la socket de LiveController, sans serveur ni navigateur.
 *
 * `createRealtimeHarness` monte le controller sur une fausse connexion et
 * parle son protocole : il envoie les frames JSON-RPC qu'un client enverrait
 * et rend celles qui sortent. Tout le décor (faux contexte HTTP, remise à zéro
 * du hub, pose d'une identité) vit dans `@nodefony/realtime/testing` — il n'y a
 * rien à recopier ici.
 *
 * Pour éprouver un canal PROTÉGÉ (`@RealtimeChannel(nom, { roles })`), passer
 * au harnais l'identité ET le verrou de frame :
 *
 * ```ts
 * const h = createRealtimeHarness((ctx) => new LiveController(ctx), {
 *   identity: monToken,                 // ce que l'authenticator aurait résolu
 *   frameAuthorizer: monVerrou,         // buildFrameAuthorizer de @nodefony/security
 * });
 * ```
 *
 * Sans verrou, une politique déclarée n'est appliquée par personne — c'est
 * aussi vrai au runtime : c'est `@nodefony/security` qui la fait respecter.
 */
describe("LiveController — socket", () => {
  afterEach(() => getRealtimeHub().clear());

  it("annonce ses canaux et ses actions au client qui se connecte", async () => {
    const h = createRealtimeHarness((ctx) => new LiveController(ctx));
    const welcome = await h.connect();
    // Lus d’abord, comparés ensuite : la ligne ne dépend plus de la longueur
    // du nom du canal, et le formateur la laisse telle quelle.
    const channels = field(welcome.params, "channels");
    const methods = field(welcome.params, "methods");
    expect(channels).toContain("live:events");
    expect(methods).toContain("live:ping");
    h.dispose();
  });

  it("répond à l'action live:ping", async () => {
    const h = createRealtimeHarness((ctx) => new LiveController(ctx));
    await h.connect();
    const pong = await h.call<{ pong: boolean }>("live:ping");
    expect(pong.pong).toBe(true);
    h.dispose();
  });

  it("accepte l'abonnement au canal libre, et le libère à la fermeture", async () => {
    const h = createRealtimeHarness((ctx) => new LiveController(ctx));
    await h.connect();
    await h.subscribe("live:events");
    expect(h.denials()).toHaveLength(0);
    h.close(); // le fournisseur du canal est disposé — plus rien ne diffuse
    h.dispose();
  });

  it("ce qu'une connexion envoie ressort sur le canal (et rien d'autre)", async () => {
    const h = createRealtimeHarness((ctx) => new LiveController(ctx));
    await h.connect();
    await h.subscribe("live:events");
    await h.notify("live:say", { text: "bonjour" });
    // La lecture est sortie de l'assertion À DESSEIN : sa longueur dépend du
    // nom du canal, donc la forme que le formateur impose en dépendrait aussi.
    // Un gabarit ne peut pas être conforme pour les noms courts SEULEMENT.
    const recus = h.messages("live:events");
    expect(recus).toMatchObject([{ text: "bonjour" }]);
    h.dispose();
  });

  it("un canal qui n'existe pas est REFUSÉ, jamais ignoré en silence", async () => {
    // Un abonnement sans réponse est indiscernable d'un canal calme : on
    // chercherait le bug côté producteur alors qu'il est dans le NOM.
    const h = createRealtimeHarness((ctx) => new LiveController(ctx));
    await h.connect();
    await h.subscribe("live:canal-inexistant");
    expect(h.denials()).toMatchObject([{ reason: "unknown" }]);
    h.dispose();
  });

  it("une action authentifiée reçoit son appelant par @CurrentUser", async () => {
    // L'identité qu'aurait posée le pare-feu au handshake. Une action qui
    // écrit au nom de quelqu'un doit avoir CE test : sans lui, un appelant
    // introuvable ne se voit qu'en production.
    const alice = { identifier: "alice" };
    const identity = new SessionStubToken(
      alice.identifier,
      new Map<string, unknown>([["user", alice]]),
    );
    const h = createRealtimeHarness((ctx) => new LiveController(ctx), {
      identity,
    });
    await h.connect();
    const me = await h.call<{ identifier: string }>("live:whoami");
    expect(me.identifier).toBe("alice");
    h.dispose();
  });
});
