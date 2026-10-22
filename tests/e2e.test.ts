import {
  ADMIN_PASSWORD,
  appBaseUrl,
  isExternalTarget,
  isTlsTarget,
} from "./e2e.setup";
import { AUTH_LOGIN_PATH, readRuntimeState } from "nodefony";
// La façade temps réel isomorphe — côté Node, subpath `nodefony/client`.
import { NodefonySocket } from "nodefony/client";
import { describe, it, expect, beforeAll } from "vitest";
import { z } from "zod";

// Ce que l'application PROMET de répondre. `parse` vérifie la forme reçue : une
// réponse qui dévie fait échouer le test en nommant le champ fautif, là où une
// conversion de type aurait laissé passer n'importe quoi jusqu'à l'assertion.
const HelloBody = z.object({ hello: z.string(), pid: z.number() });
const EchoFrame = z.object({ echo: z.string().optional() });
const PongBody = z.object({ pong: z.boolean() });
const LiveMessage = z.object({ text: z.string(), pid: z.number() });

/**
 * Test E2E — parle en HTTP + WebSocket à l'application RÉELLE (mode production).
 *
 * Seule porte d'entrée : `npm run test:e2e` (build d'abord : un serveur spawné
 * valide le DIST, pas le source). Ce fichier est EXCLU de `vitest.config.ts` et
 * ciblé par `vitest.e2e.config.ts` — invoqué, il tourne TOUJOURS : pas de gate
 * d'environnement qui l'afficherait « skipped » dans un rapport vert.
 *
 * Le démarrage et l'arrêt de l'application vivent dans `tests/e2e.setup.ts`
 * (une fois pour toute la suite), pas ici.
 * Client WebSocket = `WebSocket` NATIF Node (≥ 22) — zéro dépendance de test.
 *
 * Le port n'est PAS écrit en dur : le serveur publie ses ports effectifs
 * (`runningAppPort`) — un test qui suppose 5151 casse dès que l'app déclare son
 * port (`NF_PORT`, `PORT` en PaaS) ou qu'un port occupé l'a fait glisser en dev.
 */
let BASE = "http://127.0.0.1:5151";
let WS_BASE = "ws://127.0.0.1:5151";

describe("e2e — l'app boote et répond (HTTP + WS)", () => {
  beforeAll(() => {
    // Le serveur est PRÊT (le setup global n'est sorti qu'après la readiness) :
    // ses ports sont publiés. Le premier est celui du serveur en clair (une app
    // TLS-only adaptera ces deux lignes).
    // Une seule règle d'adresse, portée par le décor (`appBaseUrl`) : la
    // recomposer ici ferait interroger le serveur local pendant qu'on croit
    // mesurer le déploiement visé.
    BASE = appBaseUrl();
    // `ws`/`wss` se DÉRIVE du scheme : viser `ws://` sur un frontal en TLS
    // échoue à la poignée de main, et l'erreur accuse la route.
    WS_BASE = BASE.replace(/^http/u, "ws");
  });

  it("GET /api/hello → 200 + payload JSON", async () => {
    const res = await fetch(`${BASE}/api/hello`);
    expect(res.status).toBe(200);
    const body = HelloBody.parse(await res.json());
    expect(body.hello).toBe("nodefony");
    expect(body.pid).toBeGreaterThan(0);
  });

  it("WS /api/echo → echo du message (même controller que le HTTP)", async () => {
    const ws = new WebSocket(`${WS_BASE}/api/echo`);
    const echoed = await new Promise<unknown>((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error("timeout WS 10s")),
        10_000,
      );
      ws.addEventListener("open", () => ws.send("ping-e2e"));
      ws.addEventListener("message", (event) => {
        const frame = EchoFrame.safeParse(JSON.parse(String(event.data)));
        // Le handshake du controller peut répondre d'abord — on attend l'echo.
        if (frame.success && frame.data.echo !== undefined) {
          clearTimeout(timer);
          resolve(frame.data);
        }
      });
      ws.addEventListener("error", () => reject(new Error("erreur WS")));
    });
    ws.close();
    expect(echoed).toEqual({ echo: "ping-e2e" });
  });

  it("probe cloud-native /livez → 200 (celle qu'interroge k8s)", async () => {
    const res = await fetch(`${BASE}/livez`);
    expect(res.status).toBe(200);
  });

  it("realtime — RPC live:ping + aller-retour sur le canal live:events", async () => {
    // La MÊME façade que les vitrines navigateur — zéro `ws` à la main.
    const live = new NodefonySocket({ url: `${WS_BASE}/api/live/realtime` });
    try {
      // Listener posé AVANT subscribe : le fournisseur démarre au 1ᵉʳ abonné.
      const receivedP = new Promise<unknown>((resolve, reject) => {
        const timer = setTimeout(
          () => reject(new Error("timeout canal 10s")),
          10_000,
        );
        live.on("live:events", (msg) => {
          clearTimeout(timer);
          resolve(msg);
        });
      });
      await live.connect();
      // Action OUVERTE ({ authenticated: false }) — répond même anonyme.
      const pong = PongBody.parse(await live.request("live:ping", {}));
      expect(pong.pong).toBe(true);
      // Canal libre. Il ne bat PAS tout seul : il parle quand il se passe
      // quelque chose — ici, ce que cette connexion envoie et que toutes
      // reçoivent. C'est ce partage qui fait l'intérêt d'une socket, pas un
      // battement qui coûterait une trame par seconde et par client.
      live.subscribe("live:events");
      live.emit("live:say", { text: "bonjour e2e" });
      const received = LiveMessage.parse(await receivedP);
      expect(received.text).toBe("bonjour e2e");
      expect(received.pid).toBeGreaterThan(0);
    } finally {
      // Le nettoyage vit dans le `finally` : une assertion qui tombe ne doit
      // jamais laisser une socket ouverte derrière le run.
      live.disconnect();
    }
  }, 15_000);

  // Un saut MUET se lit comme un vert : la raison s'affiche, comme le fait la
  // suite des migrations quand la cible devient externe.
  if (isExternalTarget && !isTlsTarget) {
    process.stdout.write(
      `cookie \`__Host-\` : SAUTÉ — la cible externe (${appBaseUrl()}) est servie ` +
        "en CLAIR, il n'y a donc aucun frontal TLS à croire.\n",
    );
  }

  // ── Derrière un frontal TLS SEULEMENT ──────────────────────────────────────
  // Ce que ce cas éprouve n'existe pas en direct : il faut un proxy qui termine
  // le TLS et annonce `X-Forwarded-Proto`, et un serveur qui le CROIT
  // (`trustProxy`). Sauté sinon — sauter ici est juste ; le taire ne le serait pas.
  //
  // 🔴 La condition porte sur le TLS, pas sur « externe » : une application
  // jointe par son nom de service (compose, cluster) est externe ET servie en
  // clair. Y exiger `__Host-` faisait échouer un serveur parfaitement correct —
  // le préfixe DÉRIVE du schéma constaté, et en clair il doit être absent.
  it.skipIf(!isTlsTarget)(
    "derrière le frontal : le cookie de session porte `__Host-`, donc le scheme du CLIENT",
    async () => {
      // 🔴 LE piège de la mise derrière un proxy, et il ne se voit pas en direct :
      // le serveur parle en CLAIR au frontal. S'il en déduisait le scheme, il se
      // croirait en http alors que le navigateur est en https — et le préfixe
      // `__Host-` (RFC 6265bis §4.1.3, anti session-fixation cross-subdomain)
      // serait omis SANS UN MOT. C'est `X-Forwarded-Proto`, cru parce que le
      // socket vient d'un pair de confiance (`trustProxy`), qui rétablit la
      // vérité.
      //
      // Pourquoi le préfixe et non l'attribut `Secure` : `Secure` vaut `true`
      // par défaut en configuration, il est donc posé MÊME quand le serveur se
      // croit en clair — un cas bâti dessus resterait vert sans `trustProxy` et
      // ne prouverait rien (mesuré). Le préfixe, lui, se DÉRIVE du scheme
      // constaté : il tombe dès que la confiance au proxy est retirée.
      const res = await fetch(`${appBaseUrl()}${AUTH_LOGIN_PATH}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          username: "admin",
          // La constante du DÉCOR, pas `process.env` : c'est elle que le
          // décor pose sur le serveur (`NF_ADMIN_PASSWORD`), et le serveur
          // tourne AILLEURS — dans un conteneur, ou sur une autre machine.
          // Lire l'environnement du RUNNER rendait la chaîne vide, donc un
          // `401` que ce cas imputait au cookie qu'il mesure. Une seule
          // source pour l'identité, et elle vit dans `e2e.setup`.
          password: ADMIN_PASSWORD,
        }),
      });
      expect(res.status).toBe(200);
      const cookies = res.headers.getSetCookie?.() ?? [];
      expect(cookies.length).toBeGreaterThan(0);
      const session =
        cookies.find((c) => /^(__Host-)?nodefony=/u.test(c)) ?? cookies[0];
      expect(session).toMatch(/^__Host-/u);
      expect(session).toMatch(/;\s*Secure/iu);
    },
  );
});
