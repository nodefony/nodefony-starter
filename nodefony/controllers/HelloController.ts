import {
  route,
  controller,
  Controller,
  CurrentUser,
  Param,
} from "@nodefony/framework";
import type { ContextType } from "@nodefony/http";
import type { IUser } from "@nodefony/user";

/**
 * HelloController — UN controller, DEUX protocoles (le différenciateur
 * Nodefony) : HTTP et WebSocket sont co-citoyens du même contexte controller,
 * même pipeline (firewall, audit, logs).
 *
 * Routes montées sous `/api` (couvertes par la zone firewall `^/api`
 * si tu as gardé le manifeste par défaut : identité résolue, jamais bloquante).
 *
 * C'est le MÊME gabarit qui sert le controller d'accueil d'une app neuve et
 * `nodefony create controller --kind hello` : le premier exemple que tu lis est
 * donc exactement celui que la commande te régénérera.
 */
@controller("/api")
class HelloController extends Controller {
  constructor(context: ContextType) {
    super("hello", context);
  }

  // ── Portée : UNE instance pour TOUTES les requêtes ─────────────────────────
  // Un controller est un SINGLETON (le défaut) : construit à sa première
  // requête, puis partagé par toutes les suivantes, concurrentes comprises. Il
  // ne porte que du CODE. L'état d'une requête arrive par les arguments décorés
  // (`@Param`, `@Query`, `@Body`, `@CurrentUser`…) et par les helpers
  // (`this.context`, `this.renderJson`…), qui retrouvent la requête EN COURS.
  // N'écris jamais un état de requête sur `this` (`this.user = …`) : il fuirait
  // vers la requête suivante — en développement, le framework le refuse.
  //
  // ── `initialize()` — la mise en place, UNE fois ────────────────────────────
  // Un `constructor` ne peut pas être `async` : ce qui demande un `await` avant
  // la première requête se fait ici (un cache, une table de référence). Le hook
  // est optionnel, et il tourne UNE fois, à la création — jamais par requête.
  //
  //   labels: Map<string, string> | null = null;
  //   async initialize(): Promise<this> {
  //     this.labels = await this.get("labels").loadAll();  // état de démarrage
  //     return this;
  //   }
  //
  // Besoin de préparer CHAQUE requête (un cookie, un format de sortie), ou
  // d'injecter au constructeur un service de portée `request` ? Déclare
  // `@Scope("request")` sur la classe : une instance par requête — par
  // connexion en WebSocket —, et `initialize()` tourne alors à chacune :
  //  • en HTTP — APRÈS le firewall et la garde `@IsGranted` : l'identité est
  //    résolue, et rien ne s'exécute pour un appelant qui sera rejeté ;
  //  • en WebSocket — AVANT l'accept du handshake, donc avant le firewall :
  //    l'identité n'y est PAS encore résolue. C'est en revanche la dernière
  //    fenêtre pour poser un cookie ou un en-tête sur la réponse de handshake.
  //    Pour de la mise en place par connexion AUTHENTIFIÉE, fais-la au
  //    handshake (`echo(null)` ci-dessous), qui lui est post-firewall.
  //
  // À ne pas y mettre : une décision d'autorisation (c'est `@IsGranted`, qui
  // s'évalue avant), ni un travail qu'une seule action sur cinq utilise — il
  // serait payé par toutes.

  @route("hello-index", { path: "/hello", method: "GET" })
  // `@CurrentUser()` injecte l'utilisateur posé dans l'ALS par le firewall.
  // `identifier` = identifiant fonctionnel ; un visiteur NON authentifié
  // (anonyme compris) donne `undefined` — même règle que `this.user`.
  async index(@CurrentUser() user?: IUser) {
    const identifier = user?.identifier;
    // Condition nommée : TypeScript en garde le rétrécissement, `identifier`
    // est une chaîne dans la branche vraie — aucun `!` à affirmer.
    const authenticated = !!identifier;
    return this.renderJson({
      hello: "nodefony",
      pid: process.pid,
      who: authenticated ? identifier : "anonyme",
    });
  }

  /**
   * Une valeur PORTÉE PAR LE CHEMIN — et c'est la seule syntaxe de Nodefony qui
   * diffère de ce que tu connais ailleurs.
   *
   * Le segment variable s'écrit **`{name}`**, entre accolades. `:name` — la
   * forme d'Express, de Nest et de Fastify — compile, se monte, s'affiche dans
   * `nodefony inspect routes`… et ne correspond à AUCUNE URL réelle : il est
   * pris pour un segment littéral. Le symptôme est un 404 sur une route qu'on
   * VOIT dans le code. (`nodefony doctor` nomme ce cas et rend le chemin
   * corrigé.)
   *
   * La valeur se lit avec `@Param("name")`. Elle arrive aussi en argument
   * positionnel, dans l'ordre des variables du chemin, mais le décorateur
   * nomme ce qu'il injecte : il survit à un segment ajouté devant.
   *
   * Contraindre le format se fait dans le chemin : `{id}(\d+)` n'accepte que
   * des chiffres, et `/{slug}?` rend le segment optionnel.
   */
  @route("hello-greet", { path: "/hello/{name}", method: "GET" })
  async greet(@Param("name") name: string) {
    return this.renderJson({ hello: name, pid: process.pid });
  }

  /**
   * Route PROTÉGÉE par la zone `secure` (`^/api/secure`, session SEULE — cf
   * nodefony.config.ts) : sans session, le firewall répond 401 AVANT d'entrer
   * ici. Le controller peut donc supposer un utilisateur authentifié.
   *
   * Elle n'est générée que pour l'app, parce qu'une route protégée n'a de sens
   * que si une ZONE la couvre — et c'est le manifeste de l'app qui la déclare.
   * Sous un autre préfixe (`/api/blog/secure/…`), la même méthode serait
   * ouverte à tous : un exemple qui enseigne le contraire de ce qu'il montre.
   */
  @route("hello-secure", { path: "/secure/hello", method: "GET" })
  async secureHello(@CurrentUser() user: IUser) {
    return this.renderJson({
      message: `Bonjour ${user.identifier}`,
      zone: "secure",
      pid: process.pid,
    });
  }

  /**
   * WebSocket natif : `wscat -c wss://127.0.0.1:5152/api/echo`
   * puis tape un message — la réponse repasse par le MÊME pipeline.
   *
   * ⚠ Cet echo BRUT est une DÉMO du pipeline HTTP/WS partagé, pas un modèle :
   * pour du WS métier (canaux pub/sub, actions RPC, reconnexion, policies),
   * génère la bonne couche — `nodefony create controller <nom> --kind realtime`
   * (socket Nodefony JSON-RPC, côté client `NodefonySocket`/hooks React).
   */
  @route("hello-echo", {
    path: "/echo",
    requirements: { methods: ["WEBSOCKET"] },
  })
  async echo(message: string | Buffer | null) {
    if (!message) {
      return this.renderJson({ handshake: true });
    }
    return this.renderJson({ echo: message.toString() });
  }
}

export default HelloController;
