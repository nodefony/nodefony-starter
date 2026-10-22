import { defineConfig, use } from "nodefony";
import type { env } from "./env";
// ── La config des modules — un fichier par module, sous `nodefony/config/` ───
// C'est LÀ que se pose la configuration d'un module dès qu'elle porte plus
// qu'un réglage : ce dossier est déjà dans l'`include` du tsconfig et dans le
// glob du bundler, donc un fichier oublié y reste au moins typechecké — à la
// racine, il serait invisible tant que personne ne l'importe.
//
// La forme est imposée : `(ctx) => ({ … }) satisfies I<Module>ConfigInput`. Le
// `satisfies` n'est pas décoratif — sans lui une clé inconnue compile, et seul le
// démarrage la refuse (code 78) ; `npx nodefony doctor` refuse un fragment qui
// s'en passe. Ce fichier-ci reste l'INDEX : quels modules, dans quel ordre.
import { devkitConfig } from "./nodefony/config/devkit";
import { securityConfig } from "./nodefony/config/security";
import { drizzleConfig } from "./nodefony/config/drizzle";

// ── Registre de config des modules — À GARDER ────────────────────────────────
// Ces ré-exports n'existent QUE pour faire entrer dans le programme TypeScript
// l'augmentation `declare module "nodefony"` que chaque module publie dans ses
// types. Sans elles, `use("@nodefony/x", { … })` retombe sur
// `Record<string, unknown>` : une clé mal orthographiée COMPILE, et la faute ne
// se découvre qu'au démarrage suivant, qui la refuse (code 78) — au lieu de
// l'éditeur, au moment où on l'écrit.
//
// Un ré-export plutôt qu'un `import type { … }` : il compte comme une
// UTILISATION du type, donc il traverse `noUnusedLocals` (TS6133) si l'app
// active ce réglage un jour.
//
// Y AJOUTER une ligne en montant un module dont on configure les clés.
export type { IHttpConfigInput } from "@nodefony/http";
export type { IFrameworkConfigInput } from "@nodefony/framework";
export type { IAiConfigInput } from "@nodefony/ai";
export type { IDrizzleConfigInput } from "@nodefony/drizzle";
export type { IRealtimeConfigInput } from "@nodefony/realtime";
export type { ISecurityConfigInput } from "@nodefony/security";
export type { IFrontendConfigInput } from "@nodefony/frontend";
export type { IDocumentationConfigInput } from "@nodefony/documentation";
export type { IStudioConfigInput } from "@nodefony/studio";
export type { IRedisConfigInput } from "@nodefony/redis";
export type { IDevkitConfigInput } from "@nodefony/devkit";

/**
 * Configuration de l'application — seulement les ÉCARTS aux défauts du
 * framework (deep-merge au boot). Le par-environnement passe par `ctx`
 * (isProd/isDev/env typé), jamais par un fichier parallèle.
 *
 * Ce fichier est l'INDEX ORDONNÉ des modules : ce qui est monté, dans quel
 * ordre, sous quelle politique. La configuration d'un module, elle, vit dans
 * `nodefony/config/<module>.ts` dès qu'elle porte plus qu'un réglage — les
 * fichiers importés ci-dessus en sont l'exemple.
 *
 * Voir la config RÉSOLUE, valeur ET provenance : `npx nodefony inspect config`,
 * ou la console Studio. Guide complet : `docs/guides/configuration.md`.
 */
export default defineConfig<typeof env>((ctx) => ({
  /**
   * Interface d'écoute. En container, écouter TOUTES les interfaces : le port
   * mapping Docker/k8s n'atteint jamais un bind sur 127.0.0.1. En dev, la
   * boucle locale seule, sauf `NF_BIND_ALL=true` (ouvrir l'app depuis un
   * téléphone du réseau local — cf `env.ts`).
   */
  domain: ctx.isProd || ctx.env.NF_BIND_ALL ? "0.0.0.0" : "127.0.0.1",

  /**
   * Écoute HTTP et HTTPS. Rien ici ⇒ défauts du framework (5151, et 5152 en
   * HTTP/2) ; un port est une propriété du DÉPLOIEMENT et se déclare par
   * l'environnement — cf `.env`.
   *
   * HTTPS est actif même en dev parce que les API navigateur modernes exigent
   * un contexte sécurisé (WebRTC/getUserMedia, presse-papiers, service workers,
   * notifications). Le certificat de développement est généré au premier boot —
   * via **mkcert** s'il est installé (autorité locale de confiance, zéro
   * avertissement navigateur), sinon auto-signé.
   *
   * 🔴 En PRODUCTION, l'écoute TLS est COUPÉE tant qu'aucun port HTTPS n'est
   * demandé — et ce n'est pas un raccourci de configuration. Sans cela, le
   * défaut du framework (5152) s'applique dans le conteneur : la stratégie
   * `auto` retombe sur l'auto-signé, une clé RSA est FABRIQUÉE À CHAQUE
   * DÉMARRAGE de chaque exemplaire, écrite sous `nodefony/config/certificates`,
   * pour un certificat que rien ne reconnaît (`CN=0.0.0.0`, SAN `localhost`).
   * Trois conséquences : du TLS qui ne protège rien mais en a l'air, une
   * écriture disque qui interdit `readOnlyRootFilesystem` en Kubernetes, et un
   * port que le `EXPOSE` de l'image ne publie même pas.
   * En cloud-native le TLS se termine à l'ingress ou au proxy frontal. Qui en
   * veut vraiment DANS le conteneur pose `NF_PORT_HTTPS` et fournit un vrai
   * certificat (`certificates.strategy: "explicit"`), il n'est pas empêché.
   * - Inspecter ou regénérer le certificat : `npx nodefony http:certificates`.
   */
  servers: {
    // `!== undefined`, jamais un test de vérité : `0` est un port LÉGITIME — il
    // demande au noyau d'en attribuer un libre, et c'est la seule façon de
    // démarrer sans risquer la moindre collision (ce que fait la suite de bout
    // en bout). Un `NF_PORT=0` avalé par un test truthy retomberait sur 5151 en
    // silence, c'est-à-dire exactement le port qu'on cherchait à éviter.
    ...(ctx.env.NF_PORT !== undefined || ctx.env.PORT !== undefined
      ? { http: { port: ctx.env.NF_PORT ?? ctx.env.PORT } }
      : {}),
    ...(ctx.env.NF_PORT_HTTPS !== undefined
      ? { https: { port: ctx.env.NF_PORT_HTTPS } }
      : ctx.isProd
        ? { https: false as const }
        : {}),
  },

  log: {
    debug: ctx.isProd ? [] : "*",
    /** stdout = contrat cloud-native (collecteur de logs de l'orchestrateur). */
    driver: ctx.env.NF_LOG_DRIVER,
    // Relecture du backplane (console d'administration) : `auto` suit l'URL
    // déclarée ci-dessous, sinon la mémoire. Loki ou OpenSearch ne sont montés
    // que si leur adresse est fournie ; injoignables, la relecture repasse en
    // mémoire, jamais de crash.
    queryDriver: ctx.env.NF_LOG_QUERY_DRIVER,
    ...(ctx.env.NF_LOKI_URL ? { loki: { url: ctx.env.NF_LOKI_URL } } : {}),
    ...(ctx.env.NF_OPENSEARCH_URL
      ? { opensearch: { url: ctx.env.NF_OPENSEARCH_URL } }
      : {}),
  },

  /**
   * Manifeste ORDONNÉ des modules — l'ordre du tableau = l'ordre de chargement.
   * La `policy` d'une entrée FILTRE, elle ne réordonne jamais :
   *
   * - `"mandatory"` → socle de l'app : toujours chargé, non filtrable
   *   (déclare l'intention « sans lui, cette app n'a pas de sens ») ;
   * - `"optional"` → défaut : chargé, sauf si sa GARDE `when` dit non ;
   * - `"dev"` → chargé UNIQUEMENT hors production : outillage, démo, consoles
   *   (0 coût prod — un module non listé n'est même pas importé).
   *
   * La garde `when` rend un booléen : `false` ⇒ le module n'est pas chargé du
   * tout. Elle reçoit la config résolue — `when: (config) => …` — mais peut
   * l'ignorer et fermer sur `ctx`, ce que fait redis plus bas
   * (`when: () => !!ctx.infra.cache`) : la question qu'il pose porte sur
   * l'ENVIRONNEMENT (une URL Redis est-elle déclarée ?), pas sur sa propre
   * configuration. Décider d'après `config` sert quand la réponse dépend d'une
   * clé du module lui-même.
   */
  modules: [
    /**
     * ORM Drizzle (SQL). Sans `NF_DATABASE_URL` : sqlite LOCAL, et l'app
     * persiste out-of-the-box (users, sessions, jetons). Déclare
     * `NF_DATABASE_URL` (postgres://…) pour pointer une vraie base. Les
     * connecteurs se DÉCLARENT dans `nodefony/config/drizzle.ts`.
     */
    use("@nodefony/drizzle", drizzleConfig()),

    /**
     * Socle serveur : HTTP/WS natifs + probes /livez /readyz.
     *
     * En développement, `host.docker.internal` est un hôte de confiance : c'est
     * la boucle locale VUE D'UN CONTENEUR (navigateur piloté, `npx nodefony see`).
     * La liste ne compte que si `domainCheck` est activé : elle ouvre alors la
     * barrière Host ET le relais des assets Vite (`/_vite/`). Sans `domainCheck`
     * (le défaut), tout `Host` passe — la page, ses scripts et le rechargement à
     * chaud suivent l'origine de la requête, quel que soit le nom. Avec lui, un
     * appareil du réseau local (`NF_BIND_ALL`) s'ajoute ici par l'IP de la
     * machine. Jamais en production.
     */
    use("@nodefony/http", {
      ...(ctx.isDev ? { trustedHosts: ["host.docker.internal"] } : {}),
      // Autorité à reconnaître pour les appels SORTANTS (Keycloak interne,
      // autorité d'entreprise) — `NF_TLS_CA_FILE` dans `.env`. Celle de
      // développement, que Nodefony fabrique, est reconnue d'office.
      ...(ctx.env.NF_TLS_CA_FILE
        ? { certificates: { extraCaFiles: [ctx.env.NF_TLS_CA_FILE] } }
        : {}),
    }),

    /** Router + controllers + décorateurs (`@controller`, `@route`). */
    "@nodefony/framework",

    /**
     * Socle IA — la MÉCANIQUE MCP (catalogue d'outils, protocole, porte à
     * déclarer). Il ne monte AUCUNE route : une porte MCP naît d'un controller
     * qui l'écrit (`defineMcpGate`) — `node_modules/@nodefony/ai/docs/mcp.md`.
     * `mandatory`, comme http et framework : tout module qui déclare des outils
     * (`getMcpTools()`) en dépend, et devkit, plus bas, le consomme.
     */
    use("@nodefony/ai", undefined, { policy: "mandatory" }),

    /**
     * Socket Nodefony (canaux duplex multiplexés). Backplane `cluster` = IPC
     * intra-pod, 0 dépendance externe ; `redis` = opt-in cross-pod.
     */
    use("@nodefony/realtime", { backplane: { driver: "cluster" } }),

    /**
     * Firewall applicatif + audit — chaque requête passe le pipeline sécurité.
     * Les zones sont validées Zod au boot (config invalide = fail-closed).
     */
    use("@nodefony/security", securityConfig(ctx)),

    /**
     * Builder Vite + statics : sert le frontend de l'app (HMR en dev).
     *
     * En développement, Vite reste sur la boucle locale et Nodefony le relaie
     * sur l'origine de la page (`/_vite/…`) : la page, ses scripts et le
     * rechargement à chaud partagent UNE origine et UN certificat. Rien à
     * configurer pour développer depuis un téléphone, une IP de réseau local,
     * un conteneur ou Codespaces — ouvrir l'application en HTTPS suffit pour
     * les API réservées aux contextes sécurisés (caméra, WebAuthn…).
     */
    use("@nodefony/frontend", {}),

    /**
     * Portail de documentation de la console → `/nodefony/documentation` : les
     * pages livrées par chaque paquet `@nodefony/*` installé, avec recherche
     * plein texte. Son plan de données vit sous la zone `nodefony-admin`
     * (session exigée).
     *
     * `policy: "dev"` — c'est la doc du FRAMEWORK, un outil pour qui développe :
     * en production le module n'est pas chargé (moins de routes, aucun scan au
     * démarrage), et la console ne propose plus l'entrée. La doc de chaque
     * module reste lisible dans son onglet Docs.
     */
    use("@nodefony/documentation", undefined, { policy: "dev" }),

    /**
     * Console d'administration → `/nodefony` : modules chargés, routes, config
     * résolue, sessions, logs.
     *
     * `policy: "mandatory"` — la console EXISTE en production. C'est un choix :
     * une application qu'on exploite a besoin de son tableau de bord là où elle
     * tourne, pas seulement sur le poste de son auteur. Un `policy: "dev"` la
     * ferait disparaître en production SANS un mot, et l'exploitant chercherait
     * un 404 dont rien ne donne la cause.
     *
     * ⚠️ CE QUI EST CLOS, ET CE QUI NE L'EST PAS — à savoir avant d'exposer
     * cette application sur un réseau public :
     *
     * - Le DATA PLANE (`/nodefony/<module>/api/...`) exige une SESSION : la
     *   zone `nodefony-admin` est posée par `@nodefony/framework`, pas par
     *   toi. Aucune donnée d'administration ne sort sans authentification.
     * - L'UI hors `/api` (la page elle-même, ses fichiers) n'a PAS encore de
     *   zone : un anonyme peut l'afficher. Elle ne lui montrera rien — tous
     *   ses appels reçoivent 401 — mais elle révèle que la console est là.
     * - Le RBAC par rôle sur toute la surface arrive ; aujourd'hui,
     *   `ROLE_NODEFONY_ADMIN` ne garde que `/nodefony/studio/api/create/*`.
     *
     * Pour fermer l'UI dès maintenant, ajoute une zone dans
     * `nodefony/config/security.ts` :
     *
     *   nodefonyUi: { pattern: "^/nodefony(/|$)", authenticators: ["session"] },
     *
     * Le firewall retient la zone au pattern le plus LONG : le data plane et
     * la sonde de vivacité gardent donc les leurs.
     *
     * `ui: "static"` sert les assets pré-buildés du paquet npm (rien à
     * recompiler). `"auto"`/`"vite"` feraient passer l'UI Studio par TON serveur
     * Vite — pour développer Studio lui-même — et exigeraient ses plugins dans
     * TES devDependencies (une app Vue/Angular n'a pas `@vitejs/plugin-react`).
     */
    use("@nodefony/studio", { ui: "static" }, { policy: "mandatory" }),

    /**
     * Accès Redis générique — chargé par la DÉCLARATION de l'infra cache :
     * `NF_REDIS_URL` présente ⇔ module chargé (un seul signal, pas de magie
     * localhost). Consommateurs : backplane realtime `redis`, sessions,
     * idempotence.
     */
    use("@nodefony/redis", undefined, {
      when: () => !!ctx.infra.cache,
    }),

    /**
     * Outillage de DÉVELOPPEMENT — la porte HTTP de la carte de visite de cette
     * application (`/nodefony/devkit`). La même carte au terminal ne dépend PAS
     * de ce module : `npx nodefony card` est servie par le cœur et répond même
     * ici retiré, application non construite ou environnement non posé.
     *
     * `policy: "dev"` : ce qu'il expose (modules chargés, chemins de
     * documentation, commandes à lancer) aide pendant le développement et n'est,
     * en production, qu'une divulgation de ton architecture. Un module non chargé
     * n'est même pas importé — le coût en production est nul, pas « faible ».
     *
     * Il est en `devDependencies` : `npm ci --omit=dev` ne l'installe pas.
     */
    use("@nodefony/devkit", devkitConfig(ctx), { policy: "dev" }),
  ],
}));
