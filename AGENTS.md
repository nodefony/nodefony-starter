# AGENTS.md — nodefony

<!-- nodefony:start -->

> **N'invente jamais du code Nodefony : génère-le, imite-le, vérifie-le.**
> Trois actes pour toute tâche : **LIRE** (ce fichier, puis la doc pointée) →
> **GÉNÉRER** (`npx nodefony create …` produit du vrai code, à imiter) →
> **VÉRIFIER** (`npm run verify` — UNE commande : types, style, tests, build, câblage).
>
> **Le réflexe, avant d'écrire le MOINDRE fichier** : un générateur le
> produit-il ? Écrire à la main un CRUD, un controller, une entité ou un
> squelette de module, c'est le signal que tu as raté une commande de la
> table ci-dessous — arrête-toi et lance-la.
>
> 🔴 **Charge le skill `nodefony-dev` AVANT ta première modification**, quelle
> que soit la tâche : il porte la conduite complète et dit quel skill
> spécialisé prendre. Et sache ceci dès maintenant — **la référence est
> INSTALLÉE, mais `rg` ne descend pas dans `node_modules`** : 70 pages
> paraissent absentes. Une commande les lit, avec la ligne exacte :
> `node node_modules/@nodefony/devkit/skills/nodefony-dev/scripts/docs.mjs <termes>`.
>
> **Tu RENDS une réponse ?** `return this.renderJson(obj)` pour du JSON ;
> `this.setContextHtml()` puis `return this.render(html)` pour une PAGE — le nonce
> CSP de la requête s'écrit **`this.context?.cspNonce`** (le `?.` n'est pas
> optionnel : `context` est `ContextType | undefined`, sans lui le code ne
> compile pas), à recopier dans tout `<script>` en ligne. Ne touche JAMAIS
> `this.response` à la main : poser `Content-Type` toi-même court-circuite la
> négociation, et un `this.response as any` est le signal que tu as raté la façade.
> Un flux d'événements aussi : `this.renderSse()` (skill `nodefony-add-realtime-channel`),
> jamais `text/event-stream` écrit à la main.
>
> **Tu LIS une liste ?** Elle se BORNE, toujours. Le service d'une entité hérite
> `findPage({ limit: 25 })` — il ne charge que `limit + 1` lignes et rend
> `{ items, hasNext }` ; sinon `find(criteria, { limit })`. Un `find` sans borne
> matérialise la table ENTIÈRE : indolore sur les quelques lignes du poste de
> développement, fatal sur les dizaines de milliers de la production. Il te faut
> une projection de colonnes, une CTE, une agrégation ? Descends au natif **avec
> son type** — `import type { DrizzleDb } from "@nodefony/drizzle"` puis
> `orm.getNativeConnection<DrizzleDb>()`. Sans le paramètre de type tu reçois
> `unknown`, et il ne te reste qu'un `as any` que le contrôle refuse.
>
> **Tu SERS un fichier ?** Trois façades, jamais `createReadStream` à la main :
> `this.renderMediaStream(f)` pour un média qu'on parcourt (`Range` → 206),
> `this.streamFile(f)` pour le fichier entier, `this.renderFileDownload(f)` pour
> forcer le téléchargement. Le faire soi-même rend une réponse que le client ne
> peut pas lire — le détail, plus bas, est MESURÉ.

## Générateurs — appelle-les, ne recompose jamais leur sortie de mémoire

| Besoin                                                                                                  | Commande                                                                                         |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Module applicatif (workspace npm)                                                                       | `npx nodefony create module <nom>`                                                               |
| Controller HTTP **et** WebSocket (même classe)                                                          | `npx nodefony create controller <nom> --kind hello\|rest\|realtime\|duplex\|example`             |
| Controller **réservé à une habilitation** — garde de classe + rôle déclaré dans la hiérarchie           | `npx nodefony create controller <nom> --role ROLE_X`                                             |
| Ressource REST **complète** — entité + service + controller CRUD + tests (ne JAMAIS l'écrire à la main) | `npx nodefony create entity <Nom> --fields "sku:string:unique price:float"`                      |
| Service métier seul — la logique réutilisable, hors de tout controller                                  | `npx nodefony create service <Nom> [--inject <AutreService>] [--module <m>]`                     |
| Frontend Vite — page, bouton de connexion (vers `/login`) et temps réel LIVRÉS                          | `npx nodefony create front <nom> --frontend <react\|vue\|angular\|svelte> [--module <m>]`        |
| Commande CLI `nodefony <module>:<action>`                                                               | `npx nodefony create command <action> [--module <m>] [--phase onReady\|onRegister\|onPostReady]` |

**Ces dossiers ne s'écrivent JAMAIS à la main** — y déposer un fichier signifie
que tu as raté une commande de la table ci-dessus :

| Tu t'apprêtes à écrire dans…     | Lance plutôt                                                             |
| -------------------------------- | ------------------------------------------------------------------------ |
| `nodefony/entity/`               | `npx nodefony create entity <Nom> --fields "…"`                          |
| `nodefony/controllers/`          | `npx nodefony create controller <nom> --kind …`                          |
| `nodefony/service/`              | `npx nodefony create service <Nom>` (ou `create entity`, qui en pose un) |
| `nodefony/command/`              | `npx nodefony create command <action> [--module <m>]`                    |
| `modules/<nom>/` (module entier) | `npx nodefony create module <nom>`                                       |

Le code écrit à la main compile souvent — c'est tout le piège. Il diverge du
gabarit courant, et cette divergence ne se voit qu'à la première montée de
version. `npx nodefony create --help` liste les générateurs de CETTE version : la
liste s'allonge, ne te fie pas à ta mémoire.

Chaque commande se décrit à une machine : `--describe-json` (questions + options
en JSON), `--answers-json <fichier|->` (réponses en JSON), `--dry-run` (plan et
diffs, zéro écriture). Un refus n'écrit jamais rien (transaction).

Les champs d'une entité se déclarent en positionnels :
`npx nodefony create entity Post title:string views:int=0 status:enum(draft,published) slug:string:unique author:ref:User`.
Un champ est NON NUL par défaut ; le `?` l'autorise (le `!` est REFUSÉ, jamais
ignoré), `:index` pose l'index, `:unique` l'unicité, `=<valeur>` fixe
la valeur par défaut, `enum(a,b)` borne les valeurs admises, et
`ref:<Entité>` crée la colonne de jointure **avec** son index. Les types portent
leur taille (`string(120)`, `char(2)`, `decimal(10,2)`). Un index de TABLE couvre
plusieurs colonnes et se répète : `--index "siteId,createdAt"`, `--unique "a,b"`.
Un `enum` rend la MÊME colonne sur les trois moteurs (pas de type SQL nommé, qui
exigerait une migration) : c'est le type TypeScript et le schéma Zod qui la
bornent — donc sur TOUS les transports, REST comme socket.

Si la table EXISTE DÉJÀ en base, trois options lui font épouser ses noms sans
rien renommer à la main : `--table <nom_sql>` (au lieu du pluriel),
`--column-case snake` (colonne `site_id`, propriété toujours `siteId`) et
`--id-name <colonne>` (clé primaire `website_id`, propriété toujours `id`). Le
code TypeScript ne change dans aucun des trois cas — seul le SQL suit.

`npx nodefony create entity --help` porte la grammaire de CETTE version — elle
s'enrichit, ta mémoire non.

## Vérités du framework (anti-préjugés — ce que tu crois savoir est faux ici)

- **Le cœur `nodefony` est ISOMORPHE** : le même paquet se charge côté Node
  ET navigateur. La porte client EXPLICITE est le subpath `nodefony/client`
  (`NodefonySocket`, notices, rôles — résolu à l'identique par Vite, Node et
  le typecheck), et le moteur front de CE projet a la sienne :
  `nodefony/react`. Ne réécris
  JAMAIS un client WebSocket/JSON-RPC, ne duplique JAMAIS un type entre front
  et back : un seul contrat, vérifié par le compilateur des deux bouts.

- **Le geste concret avec `nodefony/react`** — les hooks React du
  paquet `nodefony`, résolus à l'identique par Vite, Node et le typecheck. Le
  fournisseur est monté une fois ; un composant s'abonne ensuite sans jamais
  toucher à la socket, et l'abonnement se libère au démontage :

```tsx
// frontend/src/App.tsx — ce que l'écran d'accueil généré fait déjà
import { NodefonyProvider, useNodefonyChannelData } from "nodefony/react";

function Live() {
  const last = useNodefonyChannelData<{ message: string }>("live:events");
  return <p>{last?.message ?? "en attente…"}</p>;
}

export function App() {
  return (
    <NodefonyProvider url="/api/live/realtime">
      <Live />
    </NodefonyProvider>
  );
}
```

Les autres hooks (`useNodefony`, `useNodefonyState`, `useNodefonyIdentity`,
`useNodefonyChannel`), le comptage de références et les notices :
`node_modules/nodefony/docs/react-hooks.md`.

- **Une commande ne tourne PAS dans le mode du serveur que tu as lancé — DEMANDE-le.**
  Chaque commande démarre son propre noyau. Sans `NODE_ENV` dans ton shell, elle
  part en `development` ; avec `NODE_ENV=production`, elle lit une AUTRE
  configuration et une AUTRE base de données — sans rien dire de plus. Ne le
  suppose jamais avant d'écrire ou de migrer quoi que ce soit :

  ```bash
  npx nodefony env              # le mode, et d'où vient chaque variable
  npx nodefony inspect config   # la configuration EFFECTIVE, et sa provenance
  ```

  Pour forcer : `NODE_ENV=production npx nodefony <commande>`. La règle complète
  (absent, posé, valeur non-moteur) est dans
  `node_modules/nodefony/docs/environnement.md`.

- **Une initialisation s'ACCROCHE à une phase du démarrage — il n'y a pas de
  `app.use()`.** Nodefony n'est pas un framework à middlewares chaînés : du code
  posé au chargement d'un fichier s'exécute AVANT que la configuration existe, et
  il n'y a rien à quoi « ajouter » un traitement global. Ce qui doit tourner au
  démarrage se déclare depuis un module ou un service :
  `this.module?.hookKernel("onBoot", async () => { … })` — l'étiquette porte alors
  le nom et la criticité du module, ce qu'un `kernel.once(…)` posé à la main
  perdrait. Les phases, dans l'ordre : `onRegister` (les modules se déclarent),
  `onBoot` (tout est chargé, les connexions s'ouvrent), `onReady` (juste AVANT que
  les serveurs se mettent à écouter), `onPostReady` (ils écoutent), `onTerminate`
  (fermeture). Une commande CLI se pose sur la
  même échelle : `npx nodefony create command <action> --phase onReady`.
  ⚠️ Si tu t'apprêtes à écrire `as any` sur le kernel pour atteindre une méthode,
  arrête-toi : c'est le signe que tu cherches une API d'un AUTRE framework. Les
  phases, le conteneur et les connecteurs sont typés — la référence est dans
  `node_modules/nodefony/docs/kernel.md`, et `npx nodefony inspect services`
  montre ce qui existe RÉELLEMENT dans cette application.

- **Un service n'est pas une classe utilitaire.** Une classe à méthodes `static`,
  ou un objet exporté, COMPILE et marche — et reste invisible au framework. Un
  service Nodefony est une classe `@injectable()` qui `extends Service` : c'est
  de là que lui viennent sa config fusionnée, son journal (`this.log`), les
  événements, et sa place dans le conteneur. Il porte DEUX noms sans que ce soit
  une redondance : le décorateur nomme la CLASSE (ce qu'on écrit dans
  `@inject("…")`), le `super("nom", …)` nomme l'INSTANCE (sa clé pour
  `container.get("…")`). Ne l'écris pas de mémoire :
  `npx nodefony create service <Nom>` en pose un complet, commenté, à imiter ;
  la référence est dans
  `node_modules/nodefony/docs/service.md`.
  **Un service qui en appelle un autre le déclare au CONSTRUCTEUR** :
  `npx nodefony create service <Nom> --inject <AutreService>` écrit le
  `@inject("AutreService")` et l'appel qui va avec. La dépendance est alors
  ordonnée par le conteneur et visible dans la signature — là où
  `container.get("…")` cherche à l'exécution et rend `null` en silence si
  le service n'est pas enregistré.

- **Le container DI est PROTOTYPAL — chaque requête a le sien** (un scope,
  calque posé par chaîne de prototypes sur celui du kernel) : il VOIT tous les
  services sans copie, et ce qu'on y `set()` MEURT avec la requête — en
  WebSocket, avec la connexion.
  Depuis n'importe quel code : `RequestContext.getScope()` (ou `undefined` hors
  requête). Un objet par requête, nettoyé à la fin :
  `@injectable({ name, scope: "request" })`, même nom dans
  `super(name, scope, false)` ; un singleton qui en dépend est refusé au
  démarrage. Ni cache de services, ni singleton maison.

## Modules du projet

Aucun — `npx nodefony create module <nom>` en pose un (workspace npm sous `modules/`).

## Gates — vérifier avant de dire « fait »

```bash
npm run verify        # ⬅ LA commande. typecheck, lint, format:check, env:check, test, build, doctor
```

**Une seule à retenir, et c'est délibéré.** Les gates ci-dessous existent séparément
pour qu'on puisse en relancer un ; tant qu'ils n'étaient QUE séparés, le premier oublié
était toujours le même — `typecheck`, que rien d'autre ne remplace : **le bundler ne
type-check pas**, ton code peut être bâti, servi, et ne pas compiler. `verify` s'arrête
au premier rouge, et ce rouge est ta tâche suivante.

```bash
npm run typecheck     # types — le seul gate que le build ne fait PAS à ta place
npm run lint          # style et pièges
npm run format:check  # mise en forme — `npm run format` la corrige
npm run env:check     # `.env.example` à jour avec `env.ts` — `npx nodefony env --example` le réécrit
npm test              # unitaires, rapides, zéro serveur
npm run doctor        # diagnostic : câblage, install, + BILAN du dernier démarrage
npm run test:e2e      # boot RÉEL + HTTP/WS (build inclus) — HORS `verify` : c'est le gate LENT
```

### `doctor` — le premier réflexe quand quelque chose ne va pas

**Avant de chercher, demande.** `npx nodefony doctor` (ou `npm run doctor`) LIT ton
app sans rien en exécuter — donc il répond même quand elle ne démarre plus — depuis
n'importe quel sous-dossier, et `--json` le rend exploitable par un script. `check`
en est un alias historique ; le nom à retenir est `doctor`.

Il imprime ses familles de contrôles, ce qu'il n'a **pas** contrôlé et le geste à taper
ensuite : lis sa sortie, ne la paraphrase pas. Il nomme la **classe que rien ne déclare**
(entité hors `@entities([…])`, controller hors `@controllers([…])`) — elle compile, ses
tests passent, et la panne n'arrive qu'au démarrage suivant — et relit le bilan du
**dernier démarrage** (`var/last-boot.json`), seule façon d'apprendre APRÈS COUP qu'une
app a démarré **amputée**. `--live` ajoute ce qui exige une app qui tourne, `--deep`
LANCE les gardes : sans eux, ces lignes sortent en « non demandé », pas en « bon ».

Quelque chose qui marchait ne marche plus et `doctor` ne suffit pas — route en `404`,
refus inattendu, erreur au journal, tests rouges d'un coup : 🔴 **charge le skill
`nodefony-troubleshoot`** AVANT de lire les sources. Il part du symptôme, donne le geste
qui le constate, et extrait les erreurs du journal par un script.

## Voir un écran toi-même — un navigateur, pas un `curl`

Un `curl` prouve qu'une route répond ; il ne dit pas si l'écran **se monte**.
`npm run see -- /` mesure l'écran (console, scripts servis, contraste calculé), `--watch`
le surveille. 🔴 **Charge le skill `nodefony-browser` AVANT de conclure** quoi que ce soit
d'un écran : il porte `--install`, `--audit`, les autres sondes et les pièges qui font
conclure FAUX.

## Méthode de travail

1. **Budget tokens = une règle de conception** : lire ciblé via les tables
   ci-dessus ; ne jamais scanner le projet entier.
2. **Une règle = une source** : ce fichier POINTE la doc, il ne la recopie
   pas ; n'y recopie rien non plus.
3. **Batcher les modifs serveur** puis UN SEUL cycle build/restart ; le
   frontend passe en HMR, zéro restart.
4. **`npm run verify`, jamais `npm test` seul** — vitest n'inspecte AUCUN type,
   une app peut être verte et ne pas compiler ; suspecte ton propre diff.
5. **La mémoire de l'app est ci-dessous** : accumule les leçons DURABLES dans
   la zone Notes — pas dans des commentaires éparpillés.

## Demander à cette app — les verbes qui répondent SANS rien démarrer

```bash
npm run dev                          # développement (Ctrl+C pour arrêter)
npx nodefony status                  # que tourne-t-il ? ports, PID — ne boote rien
npx nodefony status --json           # état du démarrage (adresses, points) — jamais l'écran
npx nodefony stop                    # arrêt PROPRE — jamais `… &`, qui meurt sur SIGHUP
npx nodefony production --detach --wait   # boot réel détaché, rend la main ports OUVERTS
npx nodefony card                    # qui répond, ce qui est chargé, où lire, quoi lancer
npx nodefony symbols <Nom>           # définition, TSDoc, parenté — en O(1)
npx nodefony inspect routes --json   # les routes MONTÉES (aussi : services, stores)
npx nodefony inspect config --json   # la config EFFECTIVE, et d'où vient chaque valeur
```

`card` et `symbols` répondent même sur une app pas construite, sans aucune variable
posée ; `inspect` boote sans ouvrir un port.

**Déboguer** : en développement, une pile d'appels pointe vers TON `.ts` — le build
de dev porte ses sourcemaps, `npm run build` n'en émet pas. Point d'arrêt : `npm run debug`
(port 9229 ; détail et pièges : skill `nodefony-dev`).

🔴 **Ce que rend `inspect` ENGLOBE tes sources et les dépasse** : les modules installés
montent leurs propres routes, une app qui en définit une poignée en expose plus d'une
centaine. Un **écart d'un ordre de grandeur** n'est donc PAS une anomalie — compter dans
les sources répond à une AUTRE question que celle posée.

🔴 **Si la commande résiste, répare l'APPEL — ne te rabats pas sur les sources** : les
fichiers répondront toujours quelque chose, mais pas à la question posée.

**Tes modules publient AUSSI leurs outils** — `npx nodefony ai:mcp` écrit `.mcp.json`, et
un module qui implémente `getMcpTools()` expose son métier, pas la plomberie (contrat,
scopes : `node_modules/@nodefony/devkit/docs/index.md`). C'est une ROUTE : démarre l'app
D'ABORD, ta session ENSUITE.

🔴 **La connexion est DÉJÀ servie — n'écris ni page de login, ni controller de compte.**
`/login` (mot de passe, second facteur, fournisseurs), `POST /nodefony/security/api/auth/login`
(`202` = second facteur requis, PAS encore connecté), `GET /nodefony/security/api/auth/me`
(toujours `200` — teste `user`) et `POST /nodefony/security/api/auth/logout` sont montées par
`@nodefony/framework`, sous un chemin qui porte le nom de `security` — c'est le piège. Côté
serveur, qui est connecté = `this.user`. Mesuré : faute de trouver `me`, un agent tiers a refait
un controller `Account` entier. Habillage, front, retour après connexion, second facteur, jeton
d'un script → skill `nodefony-authentication`.

🔴 **La PROVENANCE n'est pas une PREUVE D'INTENTION — une mutation exige `@CsrfProtect`.**
« Le firewall vérifie déjà `Sec-Fetch-Site` » est faux pour un programme : il n'envoie pas ces
en-têtes. Mesuré : un `POST` sans jeton rend `201`. Le jeton : un `GET` sur la route sème le
cookie `csrf-token`, la mutation le rejoue dans `x-csrf-token`, sinon `403`. Une origine tierce
se DÉCLARE (`csrf.trustedOrigins`) ; `@CsrfExempt` ouvrirait à **n'importe quel** site.
🔴 **Et une URL DÉJÀ PUBLIÉE ne se déplace pas — c'est un contrat.** Quand on te demande
de protéger une adresse existante, la déménager sous la zone déjà réglée la fait répondre
`404` à celui-là même qu'on voulait servir : personne n'a prévenu le partenaire, et rien
dans l'app ne signale la rupture. **On adapte la ZONE à l'URL, jamais l'URL à la zone** —
étends son `pattern` : `^/api/(machine|partenaire)`.

Gestes complets (zones, rôles, voters, comptes) → skill `nodefony-protect-route`. Relire la
sécurité d'un diff AVANT de le commiter → skill `nodefony-security-review`.

🔴 **Les violations de contrainte sont DÉJÀ traduites en HTTP — ne les rattrape pas.**
Un doublon sur une colonne unique ressort en **409**, une donnée qui viole le schéma Zod
en **422** : le rendu d'erreur lit le code du pilote (`23505`, `ER_DUP_ENTRY`,
`SQLITE_CONSTRAINT_UNIQUE`, `11000`) et le mappe. N'écris JAMAIS un `throw … 409` pour un
identifiant déjà pris — le vérifier d'abord est plus lent ET **faux sous concurrence**.

Les CLÉS qu'un module accepte sont lisibles à la source :
`node_modules/@nodefony/<module>/dist/nodefony/config/config.js` porte son schéma Zod. Une
clé inconnue **arrête le démarrage** en la nommant (code 78) : ne l'invente pas, lis le schéma.

**La référence de CHAQUE brique installée ici est dans `node_modules`** — que `rg`
lancé à la racine ne voit pas (git l'ignore, `rg` le suit) : le sujet paraît absent
alors qu'il occupe 70 pages. Trois issues, de la meilleure à la plus brute : l'outil
`nodefony_docs` (serveur démarré, il cherche dans TOUTE la doc chargée et rend des
extraits) ; **désigner le dossier** — `rg "terme" node_modules/@nodefony/*/docs/`,
l'exclusion ne valant que pour le PARCOURS ; ou `rg --no-ignore "terme"`.
⚠️ Si `node_modules/` n'existe pas, la doc n'est pas là : c'est `npm install` qui n'a
pas été lancé, pas « le sujet n'est pas documenté ». DIS-LE, et ne réécris jamais ce que
tu n'as pas pu lire.

- **Kernel, phases, CLI** — `node_modules/nodefony/docs/kernel.md` + `cli.md`
- **Service, injection, container** — `node_modules/nodefony/docs/service.md`
- **Client isomorphe (navigateur)** — `node_modules/nodefony/docs/client.md`
- **Serveurs, sessions, cookies, upload** — `node_modules/@nodefony/http/docs/`
- **Routing, controllers, décorateurs** — `node_modules/@nodefony/framework/docs/`
- **Firewall, CSRF, CORS, rôles, clés d'API** — `node_modules/@nodefony/security/docs/`
- **Entités, repositories, migrations** — `node_modules/@nodefony/orm-core/docs/`
- **Canaux temps réel, actions, protocole WS** — `node_modules/@nodefony/realtime/docs/`
- **Builder Vite, entries, HMR** — `node_modules/@nodefony/frontend/docs/`

## Les commandes de CETTE app — demande la liste, ne la devine pas

```bash
npx nodefony --help              # TOUTES les commandes, celles des modules installés comprises
npx nodefony <commande> --help   # les options exactes de l'une d'elles
```

La liste **dépend des modules installés** : elle s'allonge dès que tu en ajoutes un.
**Toujours `npx`, jamais `nodefony` nu** — le binaire vit dans les `node_modules` de
CETTE app ; une installation globale peut être plus ANCIENNE.

Celles qu'on n'invente pas, faute de savoir qu'elles existent :

- Derrière **nginx ou haproxy** — `npx nodefony proxy:generate <nginx|haproxy>`
- **Statiques vers un CDN** — `npx nodefony assets:publish [--clean]`
- **Certificat TLS de développement** — `npx nodefony http:certificates`
- **Construire le front pour la production** — `npx nodefony frontend:build [-f]`
- **Clés de chiffrement du firewall** — `npx nodefony security:secrets [-w]` (production :
  `--env`, `--jwt-keyset` → skill `nodefony-devops`)
- Créer un **administrateur** — `npx nodefony security:user:add <identifiant> --admin`
- **Écrire les migrations** des entités modifiées — `npx nodefony orm:generate`
- **En développement, écrire ET appliquer d'un geste** — `npx nodefony orm:generate --apply`
- **Appliquer les migrations** (verrou + historique) — `npx nodefony orm:migrate [-n]`
- **La base est-elle à jour ?** — `npx nodefony orm:migrate:status` — **0** = à jour,
  **1** = en retard : ta barrière de déploiement
- **Éprouver une migration SANS toucher à ta base** —
  `NF_MIGRATE_DATABASE_URL="sqlite:/tmp/essai.sqlite" npx nodefony orm:migrate` : elle
  migre AILLEURS. 🔴 C'est ainsi qu'on prouve qu'une migration s'applique — **jamais**
  en refaisant la base.
- `npx nodefony orm:reset` **DÉTRUIT les données** (refusé hors développement) : ce
  n'est ni la façon d'éprouver une migration — voir la ligne ci-dessus —, ni la
  réponse à une migration qui refuse. Avant tout geste sur un schéma déjà en base,
  charge le skill `nodefony-migrate-schema` : il porte les codes de refus et ce que
  chacun appelle.
- **Dépendances en retard**, agrégées — `npx nodefony outdated`
- **Cohérence du projet** — `npx nodefony doctor [--json]`
- **Plusieurs processus** — `npx nodefony production -w <n|auto>` · `NF_WORKERS`
- **Construire l'image** — `docker build -t nodefony .` — le `Dockerfile` est
  DÉJÀ là, ne le réécris pas
- **Complétion au TAB** — `source <(nodefony completion zsh)`

Ce tableau ne remplace pas `--help` : lui seul connaît les modules de CETTE app, et il
fait foi le jour où les deux divergent.

## Le savoir-faire du framework vit dans les skills, pas dans ce fichier

Cette page ne porte que ce qui est propre à CETTE application. Tout le reste —
conduire une tâche, les pièges du serveur et du front, protéger une route, changer
un schéma, regarder un écran — vit dans les **skills** livrés par les paquets :
`ls .agents/skills/` les liste, et leur description dit quand chacun s'applique.

Ce sont des **pointeurs** vers `node_modules`, donc ils suivent la version du
framework de ce projet (`npx nodefony upgrade` après une montée de version). Rien n'est
copié ici : une page copiée se figerait au jour de sa création.

⚠️ Les fichiers que les paquets POSENT dans l'app (décor Keycloak…) sont des copies :
`npx nodefony upgrade` les rafraîchit avec le reste (seules : `scaffold:sync --update`).

<!-- nodefony:end -->

## Notes de cette app

Cette section — et tout ce qui suit le marqueur ci-dessus — **t'appartient**.
Nodefony ne la réécrit jamais : il ne régénère que le bloc délimité plus haut.
Accumule ici les conventions de l'équipe, les décisions de domaine et les leçons
propres à ce projet.
