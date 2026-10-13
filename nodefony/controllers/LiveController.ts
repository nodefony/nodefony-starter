import { route, controller, CurrentUser } from "@nodefony/framework";

import {
  RealtimeController,
  RealtimeChannel,
  RealtimeAction,
  RealtimeInbound,
} from "@nodefony/realtime";
import type { RealtimePublish } from "@nodefony/realtime";
import type { ContextType } from "@nodefony/http";
import type { IUser } from "@nodefony/user";

/**
 * La diffusion du canal, tant qu'au moins un client écoute. `null` dès le départ
 * du dernier abonné : un pod sans spectateur ne retient rien, et ne publie rien.
 *
 * Hors de la classe, parce qu'un controller est instancié PAR CONNEXION alors
 * que le canal est unique pour le pod — c'est ce décalage qui permet à ce qu'une
 * connexion envoie d'atteindre toutes les autres. (Un champ `static #` ferait le
 * même travail, mais TypeScript refuse un identifiant privé statique dans une
 * classe décorée : TS18036.)
 */
let publishToChannel: RealtimePublish | null = null;

/**
 * LiveController — endpoint temps réel de la socket Nodefony (JSON-RPC
 * 2.0). La base {@link RealtimeController} porte TOUT le protocole (handshake,
 * pub/sub par canal, actions requête→réponse, cleanup, fan-out par le hub) :
 * cette classe ne déclare QUE son métier — ses canaux et ses actions, par
 * DÉCORATEURS ({@link RealtimeChannel} / {@link RealtimeAction}) qui posent au
 * passage la politique d'autorisation de chaque nom.
 *
 * Généré par `nodefony create controller --kind realtime`.
 *
 * Côté client (navigateur OU script Node — la façade est isomorphe, le
 * subpath `nodefony/client` est sa porte explicite) :
 * ```ts
 * import { NodefonySocket } from "nodefony/client";
 * // URL RELATIVE, résolue contre la page (https → wss automatique) ;
 * // `.shared()` = UNE socket par URL, partagée par toute la page.
 * const socket = NodefonySocket.shared({ url: "/api/live/realtime" });
 * socket.on("live:events", (msg) => console.log("reçu", msg));
 * await socket.connect();
 * socket.subscribe("live:events");        // flux serveur → client
 * socket.emit("live:say", { text: "bonjour" }); // client → TOUS
 * const pong = await socket.request("live:ping", {}); // RPC aller-retour
 * ```
 * (React : `NodefonyProvider` + hooks `nodefony/react` — `useNodefony()`,
 * `useNodefonyChannelData()` — cf la vitrine `frontend/src/` d'une app complete.)
 */
@controller("/api/live")
class LiveController extends RealtimeController {
  constructor(context: ContextType) {
    super("live", context);
  }

  /** Handshake de la socket Nodefony — toutes les frames passent par ici. */
  @route("live-realtime", {
    path: "/realtime",
    requirements: { methods: ["WEBSOCKET"] },
  })
  async realtime(message: string | Buffer | null): Promise<void> {
    this.handleRealtime(message);
  }

  /**
   * Action RPC (requête→réponse) — liveness + round-trip mesurable client.
   *
   * ⚠ Une action SANS `policy` est FERMÉE par défaut (connexion authentifiée
   * exigée) : une action est une méthode que le pair APPELLE et qui AGIT.
   * Celle-ci est en LECTURE pure → ouverte à l'anonyme, et on l'ÉCRIT
   * (`authenticated: false`) pour que l'ouverture soit un choix visible.
   */
  @RealtimeAction("live:ping", { authenticated: false })
  ping() {
    return { pong: true, ts: Date.now(), pid: process.pid };
  }

  /**
   * Action PROTÉGÉE par rôle (policy inline) : vue d'exploitation réservée —
   * sans `ROLE_ADMIN`, le voter refuse la frame AVANT d'entrer ici et
   * l'appelant reçoit une erreur JSON-RPC générique, jamais le détail
   * (Zero Trust). En dev, le compte seedé `admin/nodefony-dev-42` a le rôle.
   */
  @RealtimeAction("live:snapshot", { roles: ["ROLE_ADMIN"] })
  snapshot() {
    return {
      pid: process.pid,
      rssBytes: process.memoryUsage().rss,
      ts: Date.now(),
    };
  }

  /**
   * Action AUTHENTIFIÉE (défaut d'une action) qui sait QUI l'appelle :
   * `@CurrentUser()` reçoit l'utilisateur de la connexion, comme sur une route.
   * L'identité vient du serveur — jamais un champ que le client déclare.
   * C'est la forme à reprendre pour toute action qui écrit au nom de quelqu'un.
   */
  @RealtimeAction("live:whoami")
  whoami(@CurrentUser() user: IUser) {
    return { identifier: user.identifier };
  }

  /**
   * Le canal de démonstration. Annoncé au `realtime:welcome` par le décorateur
   * (rien d'autre à déclarer). Son fournisseur est créé au 1ᵉʳ `subscribe` et son
   * nettoyage est GARANTI au dernier `unsubscribe`/close (1 fournisseur par canal
   * par pod, fan-out par le hub) — zéro coût quand personne n'écoute.
   *
   * Il ne produit RIEN tout seul : il retient de quoi diffuser, et c'est
   * {@link say} qui alimente. Un battement périodique — une trame par seconde et
   * par client, pour ne rien dire — coûterait du réseau et du processeur en
   * permanence, et enseignerait l'inverse de ce que cette socket défend : une
   * socket qui se tait quand il ne se passe rien n'est pas endormie, elle est
   * bien élevée. L'état de la connexion suffit à prouver qu'elle est vivante.
   *
   * Sans `policy`, un CANAL reste LIBRE (contrairement à une action) : un flux
   * se lit, une action agit. Pour le fermer : `@RealtimeChannel(name, { roles })`.
   */
  @RealtimeChannel("live:events")
  events(_channel: string, publish: RealtimePublish): () => void {
    publishToChannel = publish;
    return () => {
      publishToChannel = null;
    };
  }

  /**
   * Ce qu'une page envoie, et que TOUTES reçoivent (canal FULL-DUPLEX entrant) —
   * la démonstration tient en deux onglets ouverts côte à côte.
   *
   * `params` vient du réseau : il n'est pas fiable. On borne la longueur et on ne
   * garde que ce qu'on sait typer ; le reste est jeté sans réponse. Affiché comme
   * du TEXTE côté page (jamais injecté en HTML), ce salon est inoffensif.
   */
  @RealtimeInbound("live:say")
  say(params: unknown): void {
    const p = params as { text?: unknown } | null;
    const text = typeof p?.text === "string" ? p.text.trim().slice(0, 140) : "";
    if (!text) return;
    publishToChannel?.("live:events", {
      text,
      ts: Date.now(),
      pid: process.pid,
    });
  }
}

export default LiveController;
