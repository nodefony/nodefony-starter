import { defineEnv, envBoolean, envEnum, envNumber, envString } from "nodefony";

/**
 * Catalogue typé des variables d'environnement — SEUL lecteur de `process.env`.
 * Validé au boot (fail-fast), exposé au descripteur de config via `ctx.env`.
 *
 * 💾 PERSISTANCE (infra déclarée) : tu déclares une ou deux URLs, le framework
 * DÉRIVE les stores (users, sessions, jetons, idempotence…) — `store: "auto"`.
 */
export const env = defineEnv({
  /**
   * Port d'écoute HTTP. Absent = défaut du framework (5151). Le déclarer est le
   * cas du DÉPLOIEMENT : le port y est un contrat (service k8s, ingress, sonde).
   * En dev, ne rien mettre : si 5151 est déjà pris (une autre app Nodefony),
   * le framework prend le port libre suivant et l'ANNONCE (`portPolicy: "auto"`,
   * défaut hors production) — en production il échoue franchement (`strict`),
   * car un pod qui écoute ailleurs en silence est un pod injoignable.
   */
  NF_PORT: envNumber({
    optional: true,
    section: "Réseau et processus",
    title: "Port HTTP",
    description:
      "Le port sur lequel l'application répond en HTTP (sans chiffrement).\nEn développement, laisse vide : si le port est déjà pris par une autre application, le suivant est choisi et annoncé au démarrage. En production, fixe-le : c'est le port qu'attendent l'hébergeur et ses sondes de santé — s'il est occupé, le démarrage échoue.",
    example: "8080",
    defaultNote: "5151",
  }),

  /**
   * Alias PLATEFORME : Cloud Run, Heroku, Railway et Fly injectent `PORT` et
   * exigent que le process écoute dessus. On l'accepte tel quel — zéro glue de
   * déploiement. `NF_PORT` l'emporte si les deux sont présents.
   */
  PORT: envNumber({
    optional: true,
    section: "Réseau et processus",
    title: "Port HTTP fourni par l'hébergeur",
    description:
      "Cloud Run, Heroku, Railway ou Fly posent eux-mêmes cette variable et attendent que l'application écoute dessus : tu n'as rien à écrire. Si NF_PORT est aussi posée, c'est NF_PORT qui l'emporte.",
  }),

  /**
   * Port d'écoute HTTPS/HTTP2 (défaut framework 5152). Pas d'alias plateforme :
   * en cloud, le TLS est terminé à l'ingress et le pod sert en clair.
   */
  NF_PORT_HTTPS: envNumber({
    optional: true,
    section: "Réseau et processus",
    title: "Port HTTPS",
    description:
      "Le port sur lequel l'application répond en HTTPS (chiffré, HTTP/2).\nEn développement, laisse vide. Dans le cloud, le chiffrement se fait souvent devant l'application (ingress, répartiteur de charge) : ce port ne sert alors pas.",
    example: "8443",
    defaultNote: "5152",
  }),

  /**
   * DEV — écoute sur TOUTES les interfaces (`0.0.0.0`) au lieu de la seule
   * boucle locale, pour ouvrir l'application depuis un téléphone, une tablette
   * ou un autre poste du réseau local (`https://<IP-de-la-machine>:5152`).
   * Page, scripts Vite et rechargement à chaud passent par le MÊME port :
   * une seule exception de certificat à accepter sur l'appareil. Absente =
   * boucle locale seule — le serveur de développement expose ses outils
   * d'administration, il ne s'ouvre pas au réseau sans qu'on le demande.
   * En production l'écoute est déjà sur toutes les interfaces.
   */
  NF_BIND_ALL: envBoolean({
    default: false,
    section: "Réseau et processus",
    title: "Ouvrir au réseau local (développement)",
    description:
      "En développement, l'application n'écoute que ta propre machine. true l'ouvre à toutes les interfaces, pour l'essayer depuis un téléphone ou un autre poste : https://<IP-de-ta-machine>:5152. Une seule exception de certificat à accepter sur l'appareil.\nLaisse false sinon : le serveur de développement expose des outils d'administration. Sans effet en production, qui écoute déjà partout.",
  }),
  /**
   * Autorité de certification que l'application ajoute aux siennes pour ses
   * appels SORTANTS (`http.certificates.extraCaFiles`).
   */
  NF_TLS_CA_FILE: envString({
    optional: true,
    section: "Réseau et processus",
    title: "Autorité de certification à reconnaître",
    description:
      "Le fichier PEM d'une autorité de certification que l'application doit reconnaître pour ses appels sortants : celle de ton entreprise, ou celle qui a signé le certificat d'un Keycloak interne. Chemin absolu, ou relatif à la racine de l'application ; un fichier peut contenir toute une chaîne.\nInutile pour l'autorité de développement de Nodefony, reconnue d'office. Remplace NODE_EXTRA_CA_CERTS, et s'écrit pareil sous Windows. Fichier introuvable = l'application refuse de démarrer.",
    example: "certs/autorite-entreprise.pem",
    sensitive: false,
  }),

  NF_LOG_DRIVER: envEnum(["stdout", "file", "null"] as const, {
    default: "stdout",
    section: "Journaux",
    title: "Destination des journaux",
    description:
      "Où partent les journaux de l'application : stdout (la sortie standard — le bon choix dans un conteneur, l'hébergeur les collecte), file (des fichiers dans logs/), ou null (nulle part, pour un banc de mesure).",
  }),

  /**
   * Driver de RELECTURE du log backplane (≠ sink d'écriture). `auto` (défaut) :
   * une URL de destination déclarée (NF_LOKI_URL/NF_OPENSEARCH_URL) impose son
   * driver — l'URL ⇒ le driver, un seul knob (les DEUX URLs sans choix explicite =
   * échec au boot) ; sinon s'adapte au mode (mono → `memory`, cluster →
   * `cluster-file`). Valeurs explicites : `memory` | `file` | `cluster-file` |
   * `loki` | `opensearch` (surcharge d'expert, jamais réécrite).
   */
  NF_LOG_QUERY_DRIVER: envString({
    default: "auto",
    section: "Journaux",
    title: "Relecture des journaux (console d'administration)",
    description:
      "D'où la console d'administration relit les journaux. auto choisit seul : Loki ou OpenSearch si leur adresse est posée, sinon la mémoire (un process) ou des fichiers (cluster). Valeurs possibles : auto, memory, file, cluster-file, loki, opensearch. À ne changer qu'en connaissance de cause.",
  }),

  /**
   * Infra `logs`, destination Loki. Sa présence dérive le driver de relecture
   * (`NF_LOG_QUERY_DRIVER=auto` → `loki`). Optionnelle (destination KO au
   * runtime → repli `memory`, jamais de crash).
   */
  NF_LOKI_URL: envString({
    optional: true,
    section: "Journaux",
    title: "Loki (journaux centralisés)",
    description:
      "L'adresse d'un serveur Grafana Loki. Posée, l'application y envoie ses journaux et la console d'administration les y relit. Si Loki ne répond pas, rien ne plante : la relecture repasse en mémoire.\nNe pose pas Loki ET OpenSearch sans choisir NF_LOG_QUERY_DRIVER : le démarrage refuserait.",
    example: "http://localhost:3100",
  }),

  /**
   * Infra `logs`, destination OpenSearch. Sa présence dérive le driver de
   * relecture (`NF_LOG_QUERY_DRIVER=auto` → `opensearch`). Optionnelle.
   */
  NF_OPENSEARCH_URL: envString({
    optional: true,
    section: "Journaux",
    title: "OpenSearch (journaux centralisés)",
    description:
      "L'adresse d'un serveur OpenSearch. Posée, l'application y envoie ses journaux et la console d'administration les y relit.\nNe pose pas OpenSearch ET Loki sans choisir NF_LOG_QUERY_DRIVER : le démarrage refuserait.",
    example: "http://localhost:9200",
  }),

  /**
   * Nombre de processus Node lancés par `nodefony production` / `cluster`.
   * Trois formes : `1` — le défaut, un process par pod, la mise à l'échelle
   * est le travail de l'orchestrateur ; `"auto"` — un worker par cœur ALLOUÉ
   * (quota cgroup du conteneur, jamais `os.cpus()`) ; ou un nombre explicite.
   * Trois voies, de la plus forte à la plus faible : `--workers <n|auto>` sur
   * la ligne de commande > cette variable > le fichier
   * `nodefony/config/cluster/cluster.config.ts` (non généré : sa valeur serait
   * le défaut — à créer si la topologie doit vivre en git, voir le README).
   * Lue par le maître AVANT le boot : déclarée ici pour le catalogue
   * (`npx nodefony env`), pas pour être lue par l'application. `npm run dev`
   * l'ignore — le développement est toujours mono-process.
   */
  NF_WORKERS: envString({
    optional: true,
    section: "Réseau et processus",
    title: "Nombre de processus en production",
    description:
      "Combien de processus Node lance nodefony production : 1 (un par conteneur, l'hébergeur multiplie les conteneurs), auto (un par cœur alloué au conteneur), ou un nombre. L'option --workers l'emporte. Sans effet en développement.",
    example: "auto",
    defaultNote: "1",
  }),

  /**
   * Infra `database` : URL unique, dialecte déduit du scheme
   * (`sqlite:./var/app.db` | `postgres://…` | `mysql://…` | `mongodb://…`).
   * ABSENTE = profil solo : sqlite local (l'app persiste quand même).
   * Alias plateforme accepté : `DATABASE_URL`. Secret → jamais loggée brute.
   */
  NF_DATABASE_URL: envString({
    optional: true,
    // L'URL porte le mot de passe : sa place est le gestionnaire de secrets.
    placement: "secrets",
    section: "Base de données et cache",
    title: "Base de données",
    description:
      "L'adresse de ta base de données, en une seule URL : son début dit de quelle base il s'agit (sqlite:, postgres://, mysql://, mongodb://).\nSans elle, l'application utilise une base SQLite dans var/databases/ — rien à installer, et les données survivent au redémarrage. Elle contient un mot de passe : jamais commitée. DATABASE_URL (Heroku, Railway) est aussi acceptée.",
    example: "postgres://app:motdepasse@localhost:5432/app",
  }),

  /**
   * Infra `cache` (éphémère partagé) : URL Redis. Sa présence CHARGE le module
   * `@nodefony/redis` et aiguille les briques éphémères (sessions, idempotence)
   * vers Redis. Alias plateforme accepté : `REDIS_URL`.
   */
  NF_REDIS_URL: envString({
    optional: true,
    // L'URL porte le mot de passe : sa place est le gestionnaire de secrets.
    placement: "secrets",
    section: "Base de données et cache",
    title: "Redis (cache partagé)",
    description:
      "L'adresse d'un serveur Redis. Sa seule présence branche Redis : les sessions et l'anti-double-envoi des formulaires sont alors partagés entre plusieurs exemplaires de l'application.\nSans elle, tout reste en mémoire — parfait pour un seul exemplaire. REDIS_URL est aussi acceptée.",
    example: "redis://:motdepasse@localhost:6379",
  }),

  /**
   * Mot de passe du compte admin seedé au premier boot (voir
   * `nodefony/security/users.ts`). DEV : défaut `nodefony-dev-42` (compte admin/nodefony-dev-42,
   * comme Grafana — pratique, LOCAL uniquement). PROD : OBLIGATOIRE — sans lui
   * le seed refuse (jamais de mot de passe par défaut en production).
   *
   * Pas de `requiredIn` : l'exigence ne vaut qu'au PREMIER démarrage. Une fois
   * le compte créé, la variable ne sert plus — la rendre requise ferait refuser
   * de démarrer un déploiement qui tourne depuis des mois.
   */
  NF_ADMIN_PASSWORD: envString({
    optional: true,
    section: "Comptes créés au démarrage",
    title: "Mot de passe administrateur",
    description:
      "Le compte « admin » est créé au premier démarrage avec ce mot de passe. En développement, un mot de passe connu s'applique si tu ne mets rien. En production, aucun : sans cette variable, aucun compte n'est créé. Une fois le compte créé, la variable ne sert plus.",
    defaultNote: "nodefony-dev-42 en développement ; aucun en production",
  }),

  /**
   * 🔐 Clés de chiffrement au repos (module security) — les VALEURS vivent dans
   * `.env` (gitignoré), générées à la création de l'app. Rotation ou
   * rattrapage : `npx nodefony security:secrets --write`. En production :
   * Secret k8s / vault — jamais en git.
   *
   * Les deux PREMIÈRES sont `optional` À DESSEIN : absentes, la brique
   * concernée se désactive en fail-safe (2FA, webhooks) avec un log CRITIC —
   * une application qui n'en use pas doit pouvoir démarrer sans elles. Ne pas
   * leur ajouter `requiredIn` par symétrie : ce serait refuser de démarrer une
   * application qui ne s'en sert pas.
   */
  NF_TOTP_KEY: envString({
    optional: true,
    section: "Clés et secrets",
    title: "Clé de chiffrement de la double authentification",
    description:
      "Chiffre, dans la base, le secret de double authentification (le code à six chiffres) de chaque compte. Générée à la création de l'application.\nEn production, sans elle, la double authentification est désactivée.",
    defaultNote: "clé éphémère en développement ; 2FA désactivée en production",
  }),
  NF_WEBHOOK_KEY: envString({
    optional: true,
    section: "Clés et secrets",
    title: "Clé de chiffrement des webhooks",
    description:
      "Chiffre, dans la base, les secrets qui signent les webhooks. Générée à la création de l'application (npx nodefony security:secrets --write).\nEn production, sans elle, les webhooks sont désactivés : une clé qui change à chaque démarrage rendrait les secrets illisibles.",
    defaultNote:
      "clé éphémère en développement ; webhooks désactivés en production",
  }),
  /**
   * Celle-ci n'a PAS de repli acceptable. Absente, un secret est tiré au
   * démarrage : chaque exemplaire en tire un différent, et chaque redémarrage
   * en change — un pod refuse alors le jeton anti-CSRF qu'un autre vient
   * d'émettre, et l'utilisateur voit un formulaire rejeté au hasard, sans la
   * moindre erreur dans les journaux. `requiredIn` fait échouer le démarrage
   * là où ça compte, et `nodefony doctor --env production` le dit AVANT.
   */
  NF_CSRF_SECRET: envString({
    optional: true,
    requiredIn: ["production"],
    section: "Clés et secrets",
    title: "Secret anti-falsification des formulaires",
    description:
      "Signe les jetons qui protègent les formulaires contre les envois forgés depuis un autre site (CSRF). Généré à la création de l'application.\nAvec plusieurs exemplaires, il doit être le même partout — sinon un formulaire est refusé au hasard. Obligatoire en production : sans lui, le démarrage refuse.",
    defaultNote: "tiré au démarrage (un par process)",
  }),

  /**
   * URL PUBLIQUE de l'application en tant qu'ÉMETTEUR de jetons (claim `iss`,
   * RFC 8414 §2 : https, ni requête ni fragment). Elle ne se devine pas —
   * derrière un relais, `Host` et `X-Forwarded-*` viennent du client : c'est
   * l'exploitant qui l'écrit. **Absente ⇒** en développement l'adresse locale ;
   * en production `"nodefony"` : les jetons fonctionnent, mais rien n'est
   * publié et aucun tiers ne peut vérifier une signature émise ici.
   * **STABLE** : gravée dans chaque jeton, la changer les invalide.
   */
  NF_JWT_ISSUER: envString({
    optional: true,
    section: "Jetons (JWT)",
    title: "Adresse publique de l'émetteur de jetons",
    description:
      "L'adresse publique de l'application, gravée dans chaque jeton qu'elle émet. Posée, elle permet à d'autres services de vérifier ces jetons. Sans elle, les jetons marchent pour l'application elle-même, mais personne d'autre ne peut les vérifier.\nNe la change plus ensuite : les jetons déjà émis seraient refusés.",
    example: "https://app.example.com",
    defaultNote:
      "https://localhost:5152 en développement ; aucune en production",
  }),

  /**
   * 🔐 Clé de SIGNATURE des jetons JWT, PARTAGÉE par tous les process qui
   * servent l'application — pods derrière un répartiteur, workers de
   * `nodefony cluster`. Elle est câblée dans `jwt.keystore.keySetJson`.
   *
   * **Pourquoi elle existe.** Chaque jeton porte le `kid` de la clé qui l'a
   * signé. Deux process qui ont chacun leur clé refusent les jetons l'un de
   * l'autre : l'utilisateur est déconnecté au hasard de la répartition (401).
   *
   * **Absente ⇒** développement : rien à faire, la clé vit dans `var/keys/`
   * (persistée, créée par un seul worker). Production : un process qui SERT
   * refuse de démarrer (`jwt.keystore`) — une clé propre à chaque process
   * déconnecterait au hasard, et perdrait tous les jetons au redémarrage. Elle
   * reste `optional` dans ce catalogue pour la même raison que `NF_TOTP_KEY` :
   * une application qui n'émet aucun jeton (`jwt.enabled: false`) doit pouvoir
   * démarrer sans elle ; `requiredWhen` le dit dans la notice.
   *
   * **Valeur** : un jeu de clés Ed25519 en JSON, sur UNE ligne —
   * `npx nodefony security:secrets --jwt-keyset`. Elle contient la clé PRIVÉE :
   * gestionnaire de secrets (Secret k8s, vault), jamais un fichier du poste, jamais
   * git. En développement rien à poser : la clé vit dans `var/keys/`.
   * **Illisible ⇒** la configuration security est refusée au démarrage, le
   * chemin nommé, la valeur jamais recopiée.
   *
   * **STABLE** : la remplacer refuse les jetons en vol. Rotation : ajouter la
   * nouvelle clé au tableau `keys`, la désigner dans `active`, garder l'ancienne
   * le temps que ses jetons expirent.
   */
  NF_JWT_KEYSET: envString({
    optional: true,
    section: "Jetons (JWT)",
    title: "Clé de signature des jetons (production)",
    description:
      "En développement, rien à poser : la clé est créée dans var/keys/.\nEn production, tous les exemplaires de l'application doivent signer avec la MÊME clé — sinon un utilisateur est déconnecté au hasard. Génère-la une fois (npx nodefony security:secrets --jwt-keyset) et range-la dans le gestionnaire de secrets de ton hébergeur, jamais dans un fichier.",
    defaultNote: "var/keys/ en développement ; aucune en production",
    requiredWhen:
      "en production, si l'application émet des jetons — sinon refus de démarrer",
  }),

  /**
   * Connexion par Keycloak (OpenID Connect). Le fournisseur n'est monté que si
   * les TROIS sont posées (`nodefony/config/security.ts`) : absentes, l'app
   * démarre sans bouton ni avertissement. Le décor de développement — profil
   * `keycloak` du `compose.yaml`, realm `docker/keycloak/import/` — en donne les
   * valeurs, actives dans le `.env` généré.
   *
   * Préfixées `NF_` : Keycloak est AUTO-HÉBERGÉ, ces valeurs sont émises par TON
   * serveur et aucun écosystème n'en fixe le nom.
   */
  NF_KEYCLOAK_ISSUER: envString({
    optional: true,
    section: "Connexion Keycloak",
    title: "Keycloak : adresse du realm",
    description:
      "Pour se connecter avec un serveur Keycloak (OpenID Connect) : l'adresse du realm, en https. Le bouton « Keycloak » n'apparaît que si les trois variables NF_KEYCLOAK_* sont posées.",
    example: "https://localhost:8444/realms/nodefony",
    sensitive: false,
  }),
  NF_KEYCLOAK_DISCOVERY_URL: envString({
    optional: true,
    section: "Connexion Keycloak",
    title: "Keycloak : adresse interne",
    description:
      "Seulement si l'application ne joint pas Keycloak par l'adresse du realm (NF_KEYCLOAK_ISSUER) — en Kubernetes, par son service interne. L'adresse COMPLÈTE du document de configuration du realm, en http ou https.\nLe navigateur part toujours vers NF_KEYCLOAK_ISSUER, et Keycloak doit toujours s'annoncer sous ce nom : seul le chemin du serveur vers Keycloak change. Côté Keycloak : --hostname-backchannel-dynamic=true.",
    example:
      "http://keycloak.sso:8080/realms/nodefony/.well-known/openid-configuration",
    sensitive: false,
  }),
  NF_KEYCLOAK_CLIENT_ID: envString({
    optional: true,
    section: "Connexion Keycloak",
    title: "Keycloak : identifiant du client",
    description:
      "Le nom du client déclaré pour cette application dans le realm Keycloak.",
    example: "nodefony",
    sensitive: false,
  }),
  NF_KEYCLOAK_CLIENT_SECRET: envString({
    optional: true,
    section: "Connexion Keycloak",
    title: "Keycloak : secret du client",
    description:
      "Le secret de ce client, copié depuis la console Keycloak (onglet « Credentials » du client).",
  }),
  /**
   * Secret de l'appelant MACHINE (`nodefony-machine`, compte de service,
   * flux `client_credentials`). Lu par la seule commande `app:partner:call` —
   * jamais par le serveur, qui VÉRIFIE les jetons sans connaître ce secret.
   */
  NF_KEYCLOAK_MACHINE_SECRET: envString({
    optional: true,
    section: "Connexion Keycloak",
    title: "Keycloak : secret de l'appelant machine",
    description:
      "Le secret du client nodefony-machine, qui obtient un jeton au nom d'un programme (script, service partenaire), sans utilisateur. Lu par la commande app:partner:call, jamais par le serveur.",
  }),
  /**
   * Compte ADMINISTRATEUR du Keycloak de développement (realm `master`) : il
   * sert seulement à poser le thème de connexion qui suit `loginPage.skin`
   * (`nodefony security:keycloak:realm --apply`). La config ne le passe qu'en
   * développement ; les défauts sont ceux du compose.
   */
  NF_KEYCLOAK_ADMIN_USERNAME: envString({
    default: "admin",
    section: "Connexion Keycloak",
    title: "Keycloak : administrateur (développement)",
    description:
      "Identifiant de l'administrateur du Keycloak de DÉVELOPPEMENT, pour que sa page de connexion suive l'habillage choisi. Jamais lu en production.",
    sensitive: false,
  }),
  NF_KEYCLOAK_ADMIN_PASSWORD: envString({
    default: "nodefony-dev",
    section: "Connexion Keycloak",
    title: "Keycloak : mot de passe administrateur (développement)",
    description:
      "Mot de passe de cet administrateur — celui du compose de développement par défaut. Jamais lu en production.",
  }),
  /**
   * Base d'URL des retours OAuth : l'URL PUBLIQUE de l'application, que le
   * fournisseur compare au caractère près à celle qu'il a enregistrée (RFC 9700).
   * Absente = `https://localhost:<NF_PORT_HTTPS>`, l'adresse de développement —
   * à poser en production. `localhost`, jamais `127.0.0.1` : cookies et passkeys
   * exigent un nom.
   */
  NF_OAUTH_REDIRECT_BASE: envString({
    optional: true,
    section: "Connexion externe : réglage commun",
    title: "Adresse publique pour les retours de connexion",
    description:
      "Google, GitHub ou Keycloak renvoient l'utilisateur vers l'application après la connexion, à une adresse qu'ils comparent au caractère près à celle enregistrée chez eux :\n    <NF_OAUTH_REDIRECT_BASE>/nodefony/security/api/oauth2/<fournisseur>/callback\nEn production, mets l'URL publique de l'application. En développement, garde localhost — jamais 127.0.0.1 : les passkeys refusent une adresse IP. Si Google refuse https://localhost, utilise http://localhost:5151.",
    example: "https://app.example.com",
    defaultNote: "https://localhost:5152",
  }),

  // Le dev-server Vite n'a AUCUNE variable d'environnement : il reste sur la
  // boucle locale et Nodefony le relaie sur l'origine de la page — ton poste,
  // un navigateur en conteneur et un téléphone du réseau local chargent la
  // même page en même temps, sans rien à poser.
});
