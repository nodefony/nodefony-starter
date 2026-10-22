/**
 * Firewall applicatif, jetons, audit — la configuration de la sécurité.
 *
 * Fragment du manifeste : `nodefony.config.ts` l'importe et passe le résultat à
 * `use("@nodefony/security", …)`. Rien ne charge ce dossier tout seul — c'est
 * l'import du manifeste qui monte ce fichier, et lui seul.
 *
 * 🔴 `satisfies` n'est PAS décoratif. Écrit dans le manifeste, ce littéral était
 * vérifié au point d'appel : une clé inconnue y était refusée. Rendu par une
 * fonction, il ne l'est plus — la clé compile, et seul le démarrage la refuse
 * (code 78). `satisfies` rétablit ce contrôle dans l'éditeur,
 * et `npx nodefony doctor` refuse un fragment qui s'en passe.
 *
 * C'est ici que se pose la configuration d'un module quand elle porte plus
 * qu'un réglage. Un module de plus à configurer = un fichier de plus ici ; le
 * manifeste, lui, reste l'INDEX : quels modules, dans quel ordre.
 *
 * @module
 */
import type { ConfigContext } from "nodefony";
import type { ISecurityConfigInput } from "@nodefony/security";
import type { env } from "../../env";

/** Les variables dont dépendent les adresses publiques ci-dessous. */
type IPublicUrlEnv = Pick<typeof env, "NF_JWT_ISSUER" | "NF_PORT_HTTPS">;

/**
 * L'adresse publique de l'application : `NF_JWT_ISSUER` quand il est posé
 * (en production, l'URL que voient les clients), sinon le serveur local.
 */
export const publicBaseUrl = (e: IPublicUrlEnv): string =>
  e.NF_JWT_ISSUER ?? `https://localhost:${e.NF_PORT_HTTPS ?? 5152}`;

/**
 * La ressource de l'API partenaire (RFC 8707) : l'audience que doit porter un
 * jeton présenté sur `/api/partner`, qu'il vienne de cette application ou de
 * Keycloak. UNE définition, lue par la zone `partner` ci-dessous ET par la
 * commande `app:partner:call` : une audience recopiée finit par différer, et
 * le seul symptôme est un 401.
 */
export const partnerResource = (e: IPublicUrlEnv): string =>
  `${publicBaseUrl(e)}/api/partner`;

/** La configuration de `@nodefony/security` pour cette application. */
export const securityConfig = (ctx: ConfigContext<typeof env>) =>
  ({
    /**
     * Jetons signés par CETTE application — le décor de DÉVELOPPEMENT.
     *
     * 🔴 Deux réglages sans lesquels `nodefony security:mcp:token` produit un
     * jeton inutilisable, chacun pour une raison différente :
     *
     * - **`audiences`** est une liste BLANCHE de ressources qu'un client peut
     *   NOMMER (`resource`, RFC 8707). L'URI de la porte MCP doit y figurer,
     *   sinon l'émetteur REFUSE de l'inscrire (`invalid_target`) — et l'on se
     *   retrouve avec une porte que rien ne sait ouvrir. Les deux adresses
     *   sont là parce que la porte répond en clair ET en TLS : un jeton
     *   demandé pour l'une était refusé sur l'autre, la liaison d'audience
     *   faisant, à juste titre, son travail. Ces valeurs s'ÉCRIVENT, jamais
     *   ne se dérivent du `Host` — un en-tête forgé obtiendrait sinon un
     *   jeton d'audience arbitraire. En production : l'URL publique en https.
     *
     * - **`keystore.dir`** rend la clé de signature PERSISTANTE. Sans lui,
     *   chaque process génère la sienne au démarrage : un jeton émis par la
     *   CLI porte un `kid` que le serveur en marche ne connaît pas, et il est
     *   refusé en « autorisation requise » — sans que rien ne dise pourquoi.
     *
     * - **`keystore.keySetJson`** — en production, le système de fichiers d'un
     *   pod est jetable : la clé vient de `NF_JWT_KEYSET`, la MÊME pour tous
     *   les pods et workers (`npx nodefony security:secrets --jwt-keyset`).
     *   Présente, elle l'emporte sur le dossier dans tous les environnements.
     *
     * - **`issuer`** — l'URL publique de l'application (`NF_JWT_ISSUER`). Elle
     *   ne se devine pas derrière un relais : c'est l'exploitant qui l'écrit.
     */
    jwt: {
      issuer:
        ctx.env.NF_JWT_ISSUER ??
        (ctx.isProd
          ? undefined
          : `https://localhost:${ctx.env.NF_PORT_HTTPS ?? 5152}`),
      audiences: ctx.isProd
        ? []
        : [
            `https://localhost:${ctx.env.NF_PORT_HTTPS ?? 5152}`,
            `http://localhost:${ctx.env.NF_PORT ?? 5151}/nodefony/mcp`,
            `https://localhost:${ctx.env.NF_PORT_HTTPS ?? 5152}/nodefony/mcp`,
            // L'API partenaire (zone `partner`) : sans elle, `app:partner:call
            // --issuer nodefony` se voit refuser son jeton (`invalid_target`).
            // En production, l'ajouter à la liste si l'application émet
            // elle-même les jetons de ses partenaires.
            partnerResource(ctx.env),
          ],
      keystore: {
        keySetJson: ctx.env.NF_JWT_KEYSET,
        dir: ctx.isProd ? undefined : "var/keys",
      },
    },
    /**
     * Connexion par un fournisseur d'identité (OpenID Connect) — ici Keycloak.
     * Le fournisseur n'est monté que si ses TROIS variables sont posées : sans
     * elles, aucun bouton et aucun avertissement. Le `.env` généré les porte,
     * actives : l'essai local tient en `docker compose --profile keycloak up -d
     * keycloak`. Keycloak éteint, le bouton est retiré et revient tout seul.
     *
     * L'émetteur (URL du realm) sert à DÉCOUVRIR les points d'entrée ET à
     * valider l'`iss` reçu : il est en https, même en développement.
     * Connexion = AUTHENTIFICATION, jamais autorisation : le compte créé au
     * premier login reçoit `ROLE_USER`, rien de plus.
     * Pas à pas, pièges compris : doc `@nodefony/security`, page `keycloak.md`.
     */
    // Un fournisseur de plus (Google, GitHub, un autre OIDC) : sortir
    // `providers` en `{ ...(a ? { keycloak } : {}), ...(b ? { google } : {}) }`.
    ...(ctx.env.NF_KEYCLOAK_ISSUER &&
    ctx.env.NF_KEYCLOAK_CLIENT_ID &&
    ctx.env.NF_KEYCLOAK_CLIENT_SECRET
      ? {
          oauth2: {
            failureRedirect: "/?error=oauth",
            providers: {
              keycloak: {
                issuer: ctx.env.NF_KEYCLOAK_ISSUER,
                // Kubernetes : adresse INTERNE où lire les métadonnées ; le
                // navigateur et l'`iss` restent sur NF_KEYCLOAK_ISSUER.
                discoveryUrl: ctx.env.NF_KEYCLOAK_DISCOVERY_URL,
                clientId: ctx.env.NF_KEYCLOAK_CLIENT_ID,
                clientSecret: ctx.env.NF_KEYCLOAK_CLIENT_SECRET,
                redirectUri: `${ctx.env.NF_OAUTH_REDIRECT_BASE ?? `https://localhost:${ctx.env.NF_PORT_HTTPS ?? 5152}`}/nodefony/security/api/oauth2/keycloak/callback`,
                // Rôles gérés dans Keycloak : le rôle CLIENT `admin` devient
                // ROLE_ADMIN, recalculé à chaque connexion et à chaque jeton.
                // Les rôles donnés ici à la main survivent ; un rôle Keycloak
                // absent de la table est ignoré.
                roleMapping: { admin: "ROLE_ADMIN" },
                // Compte administrateur du Keycloak de DÉVELOPPEMENT : sa page
                // de connexion suit `loginPage.skin` par
                // `nodefony security:keycloak:realm --apply`.
                ...(ctx.isDev
                  ? {
                      admin: {
                        username: ctx.env.NF_KEYCLOAK_ADMIN_USERNAME,
                        password: ctx.env.NF_KEYCLOAK_ADMIN_PASSWORD,
                      },
                    }
                  : {}),
              },
            },
          },
          // Les jetons de Keycloak ouvrent aussi l'API : le realm devient un
          // émetteur de CONFIANCE pour les zones `external-jwt` (ici `partner`).
          // Se connecter par Keycloak et lui confier l'accès à l'API sont deux
          // décisions distinctes — la seconde s'écrit ici, jamais par défaut.
          resourceServer: {
            issuers: [
              {
                issuer: ctx.env.NF_KEYCLOAK_ISSUER,
                discoveryUrl: ctx.env.NF_KEYCLOAK_DISCOVERY_URL,
                algorithms: ["RS256"],
              },
            ],
          },
        }
      : {}),
    /**
     * Zones firewall de TES routes. `main` essaie `session` (cookie BFF →
     * `context.user` rempli) puis `anonymous` : rien n'est bloqué tel quel.
     * Hors zone, l'identité n'est JAMAIS résolue.
     *
     * - EXIGER le login sur `/api` : retire `"anonymous"` de `main`.
     *   ⚠️ **Ce geste ferme AUSSI la démonstration livrée avec l'application**,
     *   et rien ne fera le lien à ta place — `nodefony doctor` comptera même
     *   « rien d'ouvert sans authentification » comme un ✓. Ce qui tombe :
     *     · `GET /api/hello` et le WebSocket `/api/echo` (`HelloController`) ;
     *     · le canal temps réel `/api/live/realtime` (`LiveController`), d'où
     *       les vitrines frontend tirent leur flux ;
     *     · **les tests de bout en bout FOURNIS** — `tests/e2e.test.ts` appelle
     *       ces trois surfaces SANS identité. `npm run test:e2e` passe alors au
     *       rouge sur des cas que tu n'as pas écrits : `expected 401 to be 200`
     *       sur `/api/hello`, et un DÉLAI DÉPASSÉ sur chaque WebSocket — un
     *       refus d'ouverture ne lève pas d'erreur côté client, il ne répond
     *       jamais. Une entité générée (`nodefony create entity`) livre ses
     *       propres cas e2e sous `/api/<entité>` : eux aussi tombent, en 401
     *       sur la lecture et 403 sur l'écriture.
     *   Si tu fermes quand même, c'est assumé : supprime les cas de
     *   démonstration de `tests/` au lieu de les laisser rouges — un banc rouge
     *   qu'on apprend à ignorer emporte le prochain vrai rouge avec lui.
     *
     * - **GARDER la démonstration joignable ET fermer le reste** — le geste à
     *   préférer, parce qu'il n'exige de renoncer à rien. Laisse `main` FERMÉE
     *   (sans `"anonymous"`) et rends publiques les seules routes qui doivent
     *   l'être, par une zone au pattern ÉNUMÉRÉ : le firewall trie par longueur
     *   de pattern, donc `^/api/(hello|echo|live)` l'emporte sur `^/api`.
     *
     *   ```ts
     *   main: { pattern: "^/api", authenticators: ["session"] },
     *   demo: {
     *     pattern: "^/api/(hello|echo|live)(/|$)",
     *     authenticators: ["session", "anonymous"],
     *   },
     *   ```
     *
     *   Énumérer est le point : `"anonymous"` sur une zone ouvre TOUTES ses
     *   routes, et une zone au pattern large redeviendrait le trou qu'on vient
     *   de fermer. Le `(/|$)` final n'est pas une coquetterie — un pattern est
     *   un PRÉFIXE : sans lui, `^/api/(hello|echo|live)` ouvrirait aussi
     *   `/api/hellofacture`, et la prochaine route dont le nom commence par
     *   `hello` naîtrait publique sans que personne l'ait voulu.
     *   Quand tu retires la démonstration, retire la zone avec elle.
     *
     * - Protéger plus large : élargis le pattern (ex. `"^/(api|compte)"`).
     *
     * - Protéger des PAGES vues dans un navigateur : une zone à part, avec
     *   `entryPoint`. Un visiteur anonyme qui OUVRE la page est conduit à la page
     *   de connexion (302 vers `/login?from=/compte`, qui le ramène ici une fois
     *   connecté) ; un appel d'API, un POST ou un WebSocket gardent leur 401 — un
     *   client qui attend du JSON casserait sur une page HTML.
     *
     *   ```ts
     *   pages: {
     *     pattern: "^/compte(/|$)",
     *     authenticators: ["session"],
     *     entryPoint: "/login",
     *   },
     *   ```
     *
     * Le firewall trie par longueur de pattern : `/api/secure/*` tombe donc
     * dans `secure`, sans `anonymous` → 401 avant ton controller. Essaie
     * `GET /api/secure/hello`.
     *
     * `main` et `secure` sont STATEFUL : l'identité tient dans une session
     * serveur, portée par un cookie opaque et révocable — le bon modèle pour
     * un NAVIGATEUR. `machine`, plus bas, montre l'autre cas : un appelant
     * qui ne stocke pas de cookie ne doit RIEN recevoir qu'il faille stocker.
     *
     * ⚠️ `stateless: false` (le défaut) sur une zone de service NE FAIT PAS
     * ÉCHOUER l'essai — et c'est le piège. Depuis un navigateur, ou avec un
     * `curl -c`, le cookie posé est renvoyé aux appels suivants et tout
     * marche ; le vrai client, lui, ne stocke rien. Ce qu'il en coûte n'est
     * pas un refus mais un REGISTRE : chaque appel porteur d'un cookie
     * inconnu fait reprendre, puis réécrire une session serveur — et
     * renvoyer un `Set-Cookie` — pour un appelant qui ne la relira jamais.
     *
     * `stateless: true` ferme cela : la zone n'ouvre ni ne reprend de
     * session, le cookie entrant est ignoré, et l'identité tient tout
     * entière dans la preuve portée par la requête. Corollaire, appliqué au
     * DÉMARRAGE : lister `"session"` dans une zone stateless est une
     * contradiction, et l'application REFUSE de démarrer en nommant la zone.
     * Une zone sert un navigateur (session) ou un porteur de preuve (clé,
     * jeton) — jamais les deux sous le même drapeau.
     */
    /**
     * ⚠️ Un `pattern` couvre un PRÉFIXE, pas les routes qu'on a en tête —
     * et c'est TOUT l'intérêt : les routes ajoutées demain sous ce préfixe
     * naissent protégées, sans que personne ait à y penser.
     *
     * D'où le piège, mesuré : pour fermer `/api/account/profile` et
     * `/api/account/invoices`, on écrit
     * `pattern: "^/api/account/(profile|invoices)"`. Les deux routes
     * refusent bien l'anonyme, l'essai est vert, la revue passe — et la
     * TROISIÈME route du compte, ajoutée un mois plus tard, est PUBLIQUE.
     * Rien ne le signale : la zone existe, elle a l'air de couvrir l'espace.
     * Le bon pattern est `"^/api/account"`.
     *
     * La zone retenue est celle dont le pattern est le plus LONG parmi
     * celles qui correspondent (`firewall.ts:257`) — pas la première
     * déclarée. C'est ainsi que `^/api/secure` l'emporte sur `^/api`
     * ci-dessous. Un pattern énuméré gagne donc lui aussi sur ses propres
     * routes, ce qui rend l'erreur silencieuse : ce qu'on teste marche.
     */
    areas: {
      main: {
        pattern: "^/api",
        authenticators: ["session", "anonymous"],
      },
      // AJOUTER une route ici ne demande RIEN de plus : le préfixe est déjà
      // couvert, la zone authentifie, et `context.user` est garanti dans le
      // controller. Une route neuve sous `/api/secure` naît protégée.
      //
      // ⚠️ Un appelant qui reçoit 401 sur une route de cette zone ne dit PAS
      // que la zone est mal réglée : il dit qu'il ne s'authentifie pas. Les
      // deux réflexes qui suivent affaiblissent l'application ENTIÈRE pour un
      // seul appelant, et rien ne le signalera :
      //   · ajouter `"anonymous"` ici — toutes les routes de la zone
      //     deviennent publiques, pas seulement la nouvelle ;
      //   · poser `@BypassFirewall`/`@Anonymous` sur l'action — même effet,
      //     en plus discret, puisque la zone a toujours l'air fermée.
      // Fais plutôt s'authentifier l'appelant (session pour un navigateur,
      // zone `machine` ci-dessous pour un service), ou donne-lui sa propre
      // zone. Restreindre DAVANTAGE reste possible sans rien ouvrir :
      // `@IsGranted(["ROLE_ADMIN"])` sur l'action.
      secure: {
        pattern: "^/api/secure",
        authenticators: ["session"],
        // Tout compte connecté — et quand la connexion OAuth crée les comptes
        // à la volée (`oauth2.allowSignup`, vrai par défaut), cela veut dire
        // tout compte que le fournisseur délivre. Ce rôle ne change rien au
        // comportement (un compte créé le reçoit) : il ÉCRIT l'intention, et
        // le démarrage cesse de le signaler. Pour réserver la zone, nommer un
        // autre rôle ; pour exiger un compte préexistant, `allowSignup: false`.
        roles: ["ROLE_USER"],
      },
      // Appelant qui n'est PAS un navigateur — service partenaire, script,
      // agent. Zone ACTIVE, et non un exemple en commentaire : c'est le code
      // qu'on a sous les yeux qu'on recopie, jamais celui qu'on lit à côté.
      // Rien ne tombe ici tant qu'aucune route ne commence par `/api/machine`.
      machine: {
        pattern: "^/api/machine",
        authenticators: ["apikey"], // PAS "session" — ce client n'a pas de cookie
        stateless: true, // false ⇒ l'app ouvre une session qu'il ne renverra jamais
      },
      // Programme qui présente un JETON d'accès — signé par cette application
      // OU par Keycloak (flux `client_credentials`). Essai de bout en bout :
      // `npx nodefony app:partner:call` (nodefony/command/PartnerCallCommand.ts).
      //
      // Les deux authenticators s'aiguillent sur l'émetteur du jeton (`iss`) :
      // leur ordre ne décide de rien. Chacun contrôle l'audience à sa façon —
      // `jwt` contre `jwt.audiences`, `external-jwt` contre `resource` —, d'où
      // la même valeur aux deux endroits, tirée de `partnerResource`.
      partner: {
        pattern: "^/api/partner",
        authenticators: ["jwt", "external-jwt"],
        stateless: true,
        resource: partnerResource(ctx.env),
        // L'appelant Keycloak n'a PAS de compte ici : son `sub` est le compte
        // de service du realm, tiré à l'import. `ephemeral` l'accepte le temps
        // de la requête, avec les seuls rôles ci-dessous. La politique vaut
        // pour CETTE zone : ailleurs, un jeton tiers exige toujours un compte
        // local (`require`, le défaut). Un jeton signé par l'application, lui,
        // désigne toujours un compte existant.
        subjectPolicy: "ephemeral",
        ephemeralRoles: ["ROLE_PARTNER"],
      },
    },

    /**
     * Clés de chiffrement au repos — les VALEURS vivent dans `.env`
     * (gitignoré), générées à la création de l'app. Rotation ou rattrapage :
     * `npx nodefony security:secrets --write`.
     */
    totp: { encryptionKey: ctx.env.NF_TOTP_KEY },
    webhooks: { encryptionKey: ctx.env.NF_WEBHOOK_KEY },
    csrf: { secret: ctx.env.NF_CSRF_SECRET },

    /**
     * Page de connexion `/login`, servie par le framework — rien à écrire
     * pour l'avoir. Son apparence se choisit parmi neuf habillages :
     *
     *   frontispiece (défaut) · ledger · horizon · console · blueprint
     *   dots · minimal · enterprise · photo-card
     *
     * L'éditeur les complète (la valeur est typée) ; en développement,
     * `/login?skin=horizon` (puis `&layout=card|split|bare`) en montre un sans
     * redémarrer. Le framework ne fournit AUCUNE photo : la vôtre se pose dans
     * une feuille servie par l'application, chargée en dernier —
     *
     *   stylesheet: "/brand/login.css",
     *   // public/brand/login.css :
     *   //   :root { --nf-login-hero-image: url("/brand/login-hero.webp"); }
     *
     * Chaque habillage place la photo à son endroit (panneau, bandeau, fond)
     * et la remplace par une couleur pleine en son absence.
     */
    loginPage: {
      skin: "frontispiece",
    },

    /**
     * Qui peut OBTENIR un scope d'application, dans un jeton ou une clé API.
     * Clé : un scope exact (`vitrine:write`) ou une famille (`shop:*`) ;
     * valeur : les rôles dont UN suffit, hiérarchie ci-dessous comprise.
     * Un scope absent d'ici est accordé à tout compte connecté qui le demande :
     * `@RequireScope` et les `scopes` d'un outil MCP contrôlent le scope à
     * l'USAGE, cette section décide qui le REÇOIT.
     * `create controller --kind mcp --expose mixte` y déclare le scope de son
     * outil réservé.
     */
    grantableScopes: {},

    /**
     * Hiérarchie de rôles — un rôle COUVRE ceux qu'il liste, transitivement.
     * `ROLE_NODEFONY_*` = plateforme (console Studio) ; `ROLE_*` = applicatif.
     * Le compte admin semé par `nodefony/security/provisionUsers.ts` les porte.
     */
    roleHierarchy: {
      ROLE_NODEFONY_ADMIN: ["ROLE_ADMIN", "ROLE_SUPERVISOR", "ROLE_DEV"],
      ROLE_ADMIN: ["ROLE_USER"],
    },
  }) satisfies ISecurityConfigInput;
