<div align="center">

<a href="https://github.com/nodefony/nodefony-core"><img src="https://raw.githubusercontent.com/nodefony/nodefony-core/main/docs/assets/nodefony-logo.png" alt="Nodefony" height="72"></a>

# nodefony

**HTTP et WebSocket dans le même contrôleur, une base qui persiste, un pare-feu
applicatif et une console d'administration** — engendrée par
[`nodefony create app`](https://github.com/nodefony/nodefony-core), câblée et prête à tourner.

[![Nodefony](https://img.shields.io/badge/Nodefony-10.0.0--beta.4-1f6feb?style=flat-square)](https://github.com/nodefony/nodefony-core)
[![Node ≥ 24.14](https://img.shields.io/badge/Node.js-%E2%89%A5%2024.14-green?style=flat-square)](package.json)
[![TypeScript strict](https://img.shields.io/badge/TypeScript-strict-blue?style=flat-square)](tsconfig.json)

</div>

## Ce dépôt, et le framework

**Ce dépôt est une application.** Il ne contient pas Nodefony : il l'utilise, comme une
application React ne contient pas React. Le framework vit ailleurs, et c'est une distinction
qui évite beaucoup de temps perdu.

- **Comprendre ce que fait le framework** → [la documentation](https://nodefony.github.io/nodefony-core/docs/), en
  commençant par [Par où commencer](https://nodefony.github.io/nodefony-core/docs/demarrer/).
- **Ce qu'est Nodefony, et ce que ses partis pris coûtent** →
  [l'architecture en vue d'ensemble](https://nodefony.github.io/nodefony-core/docs/architecture/vue-ensemble/).
- **Le code d'un paquet que cette app importe** → [`nodefony/nodefony-core`](https://github.com/nodefony/nodefony-core),
  dans `src/packages/@nodefony/<nom>`.
- **Brancher VOTRE implémentation** — authentification, stockage, bus temps réel →
  [Étendre le framework](https://nodefony.github.io/nodefony-core/docs/guides/etendre/), quatorze points d'accroche.
- **Signaler un défaut, demander une évolution** → [les issues de `nodefony-core`](https://github.com/nodefony/nodefony-core/issues).
- **Qui décide, et comment** → [la gouvernance](https://github.com/nodefony/nodefony-core/blob/main/GOVERNANCE.md).

⚠️ **Ce que vous n'héritez PAS.** `nodefony-core` est un monorepo de développement : il porte les
paquets du framework, mais aussi ses bancs de mesure, ses gabarits, ses suites de test et son
outillage d'agent. **Rien de tout cela n'entre dans cette application** — le lire donne
l'implémentation du framework, jamais ce que votre application embarque. Ce qu'elle embarque
vraiment se lit dans **son** `package.json`, ici même.

## Démarrer

```bash
npm install
npm run build
npm run dev
```

- `http://127.0.0.1:5151/api/hello` — ta première route, celle que tu iras lire en premier.
- `http://127.0.0.1:5151/` — ton application react, rechargée à chaud pendant que tu écris.
- `http://127.0.0.1:5151/nodefony` — **Studio**, la console d'administration.

> **Le compte d'administration existe déjà** : `admin` / `nodefony-dev-42`. Il
> est semé au PREMIER démarrage, et le journal te le redit alors en clair. Pour
> en changer, décommente `NF_ADMIN_PASSWORD` dans `.env`.
>
> 🔴 **Ce mot de passe par défaut n'existe qu'en développement.** En production,
> `NF_ADMIN_PASSWORD` est OBLIGATOIRE : sans elle, aucun compte n'est créé —
> rien n'est semé en silence avec un secret que le monde entier connaît. Le
> démarrage le dit et nomme le geste :
> `npx nodefony security:user:add admin --admin`.

> L'app **persiste déjà** : sans aucune base déclarée, l'ORM Drizzle crée une sqlite locale
> (`var/databases/`) — comptes, sessions et jetons survivent aux redémarrages.

### Ce que la console montre

Elle n'est pas un tableau de bord décoratif : elle lit le runtime en marche.

<img src="https://raw.githubusercontent.com/nodefony/nodefony-core/main/docs/assets/studio-supervision.png" alt="Supervision du runtime dans la console d'administration" width="100%">

_Les modules chargés, les services du conteneur d'injection, les routes montées, la mémoire et les
connexions — l'état réel du processus, pas une configuration relue._

<img src="https://raw.githubusercontent.com/nodefony/nodefony-core/main/docs/assets/studio-request.png" alt="Suivi d'une requête de bout en bout par son identifiant" width="100%">

_Une requête suivie de bout en bout par son identifiant : les étapes traversées, leur durée, les
requêtes SQL déclenchées et les journaux corrélés. C'est ce qu'on regarde quand quelque chose est
lent, et qu'on ne sait pas encore où._

---

## 1. Visite guidée — ce que l'app démontre

- **Route HTTP** — `curl http://127.0.0.1:5151/api/hello`
- **WebSocket, _même controller_** — `npx wscat -c ws://127.0.0.1:5151/api/echo` puis tape un message
- **Frontend react (Vite + HMR)** — http://127.0.0.1:5151/ — l'app fetch le backend via `/api`
- **Studio (console admin, dev)** — http://127.0.0.1:5151/nodefony — config, sessions, logs, routes
- **ORM + persistance** — Drizzle : sans `NF_DATABASE_URL`, sqlite locale automatique
- **Firewall + audit** — chaque requête traverse le pipeline sécurité (logs `audit`)
- **Temps réel — socket Nodefony** — `nodefony/controllers/LiveController.ts` : canal `live:events` (alimenté par `live:say`, jamais par une horloge) + RPC `live:ping` — la carte « Temps réel » de la page d'accueil le consomme par la façade client
- **Redis (opt-in)** — `NF_REDIS_URL` présente ⇔ module chargé, stores basculent dessus
- **Probes cloud-native** — `curl http://127.0.0.1:5151/livez` (liveness k8s)

Le différenciateur Nodefony tient dans `nodefony/controllers/HelloController.ts` :
**une route GET et une route WEBSOCKET dans la même classe** — même pipeline,
pas deux mondes séparés.

## 2. Structure du projet

- `nodefony.config.ts` — LA config de l'app : uniquement les ÉCARTS aux défauts du framework.
  Pour savoir ce qu'on a le droit d'y écrire : `npx nodefony inspect schema <module>` —
  chaque clé, son type, son défaut, sa valeur actuelle et ce qu'elle fait.
- `env.ts` — catalogue **typé** des variables d'environnement (seul lecteur de `process.env`, validé au boot)
- `.env` — TES valeurs de poste (clés de dev, URL de la base) — **jamais commité**. Sa notice,
  commitée, est `.env.example`. Un coéquipier qui clone : `cp .env.example .env`, décommente
  ce qu'il lui faut, puis `npx nodefony security:secrets --write` pour ses propres clés.
  En production, aucun fichier : l'orchestrateur ou le gestionnaire de secrets fournit tout.
- `index.ts` — point d'entrée : la classe `App` (module racine) + ses controllers + l'entry frontend (`registerEntry`)
- `nodefony/controllers/` — tes controllers (`@controller` + `@route`, HTTP **et** WS)
- `frontend/src/` — ton app react, servie par Vite (HMR dev, build prod)
- `tests/` — tests vitest : unitaires (`npm test`) + e2e réel (`npm run test:e2e`)
- `AGENTS.md` — instructions pour un agent IA, 100 % généré (régénéré par `create`) ; tes notes vivent dans sa zone préservée
- `compose.yaml` — infra de dev docker : Redis, Loki/Grafana (profil)
- `rolldown.config.ts` — build : 3 lignes, délègue tout au socle publié `nodefony/bundler`
- `.oxlintrc.json` — lint non-intrusif (warn) ; le style est délégué à Prettier
- `vitest.config.ts` — tests unitaires ; porte le bloc `oxc` décorateurs (OBLIGATOIRE, commenté)
- `vitest.e2e.config.ts` — tests e2e, config séparée : `npm test` ne montre que ce qu'il exécute
- `var/` — données locales (sqlite, logs fichiers), gitignoré

## 3. Infra de développement (docker)

L'app démarre **sans docker** : la base est une **sqlite locale** (`var/databases/`),
retenue à la création. Le `compose.yaml` fournit le cran au-dessus :

```bash
npm run infra:up                          # Redis (sessions partagées, realtime multi-process)
docker compose --profile loki up -d       # + Loki + Grafana (logs centralisés)
npm run infra:down                        # arrêt (les volumes survivent)
```

### Éprouver la topologie de PRODUCTION — l'app derrière son frontal

En production ton application vit derrière un proxy, et c'est lui qui décide de
l'adresse cliente retenue, du protocole annoncé et du sort d'une WebSocket
silencieuse. Le profil `edge` monte cette topologie en local — l'application en
image, **sans aucun port publié**, et un frontal nginx devant :

```bash
npx nodefony http:certificates            # une fois — le certificat de développement
docker compose --profile edge up -d --build
curl -k https://localhost:8443/api/hello
```

La configuration du frontal n'est pas écrite : elle est **dérivée de ton
application** à la construction de l'image (`nodefony proxy:generate nginx`),
avec tes hôtes de confiance, tes fichiers statiques, ta taille de corps acceptée
et le battement de tes WebSockets. Tu changes l'application, tu reconstruis : la
configuration suit.

Rejouer ta suite de bout en bout **à travers le proxy**, sans la modifier :

```bash
NF_E2E_BASE_URL=https://localhost:8443 \
NODE_EXTRA_CA_CERTS=nodefony/config/certificates/ca/nodefony-root-ca.crt.pem \
  npm run test:e2e
```

> Le certificat est **monté**, jamais gravé dans l'image : une clé privée dans
> une image reste lisible par qui la télécharge, même effacée par une couche
> suivante. En production, c'est ton hébergeur ou ton ingress qui le fournit.

Câblage côté app — une variable, tout le reste se dérive (`store: "auto"`) :

```bash
NF_REDIS_URL="redis://:nodefony-dev@127.0.0.1:6379"   # dans .env
```

Pour passer sur une vraie base SQL : déclare `NF_DATABASE_URL`. Le dialecte est
déduit du **scheme de l'URL** (`postgres://`, `mysql://`, `sqlite:`) — changer de
base ne change **rien d'autre** dans l'app. Le service docker correspondant n'est
pas dans ce `compose.yaml` (une app y retient un seul dialecte) : ajoute-le, ou
recrée une app avec `nodefony create app <nom> --database postgres`.

## 4. Tests — `npm test` est ton PREMIER diagnostic

```bash
npm test             # unitaires : l'app se CHARGE (imports, décorateurs, config) — < 1 s
npm run test:e2e     # build + boot RÉEL (production --detach --wait) + HTTP + WS + probes
```

**Réflexe** : quelque chose semble cassé → `npm test` AVANT de relire du code ou
de redémarrer. En une seconde il prouve que l'app s'importe, que les décorateurs
compilent et que la config valide — ou te donne le fichier exact qui casse.

Le rapport est **franc** : les e2e ont leur propre config (`vitest.e2e.config.ts`),
`npm test` n'affiche jamais de tests « skipped » qui semblent verts sans avoir
rien prouvé. Le test e2e utilise le lancement détaché natif du framework :
`--wait` ne rend la main que quand la readiness est sondée (aucun `sleep`
arbitraire), et `nodefony stop` arrête proprement. Le client WebSocket est le
`WebSocket` **natif** de Node — zéro dépendance de test.

## 5. Qualité du code

```bash
npm run typecheck    # tsgo — le bundler ne type-check PAS : gate séparé, obligatoire
npm run doctor        # cohérence du projet : config, modules déclarés, wiring
npm run lint         # oxlint — garde-fous en warn, non-intrusif
npm run format       # prettier — le style, c'est lui qui décide
```

Le lint et le typecheck sont **deux gates distincts**, et c'est volontaire :
`tsgo` juge les TYPES, `oxlint` juge tout ce qu'un type ne dit pas — code mort,
promesse mal formée, import Node sans son préfixe. Aucun des deux ne remplace
l'autre.

`oxlint` s'appuie sur le même analyseur que le bundler (`rolldown`) : un seul
lecteur de ta syntaxe, donc aucun risque que l'un accepte ce que l'autre refuse.
Il n'a **pas** besoin du paquet `typescript` — celui-ci ne reste dans les
dépendances que pour ton éditeur.

Les règles sont dans `.oxlintrc.json`, commentées par leur intention. Deux
familles ne pardonnent pas : le code mort (il finit par mentir) et le préfixe
`node:` sur les modules du runtime (sans lui, un paquet npm homonyme peut prendre
la place d'un module natif). Le reste avertit sans bloquer.

## 6. Quand ça casse (troubleshooting)

Dans l'ordre — chaque étape isole un étage, du moins cher au plus cher :

1. **`npm test`** — l'app se charge-t-elle ? Import cassé, décorateur, config
   invalide : le fichier fautif est nommé.
2. **`npm run typecheck`** — un vert vitest ne type-check RIEN (les types sont
   effacés à la transpilation) ; `tsgo` attrape ce que le build laisse passer.
3. **`npx nodefony status`** — un serveur tourne-t-il déjà ? (port occupé,
   vieux process détaché). `npx nodefony stop` arrête proprement. Si le port est
   tenu par une AUTRE application Nodefony, `status` la nomme :
   `npx nodefony stop <nom>` l'arrête sans changer de dossier.
4. **Rebuild** — comportement fantôme après un gros changement : `npm run build`
   puis relance (le serveur charge `dist/`, pas tes sources).

### `npm install` s'arrête sur « gyp ERR! find Python »

Ton manifeste porte ceci, et il faut l'y laisser :

```json
"allowScripts": { "better-sqlite3": false }
```

`better-sqlite3` (le pilote SQLite, tiré par `@nodefony/drizzle`) livre ses
binaires **déjà compilés** et demande à npm de ne pas le recompiler. npm oublie
cette demande dès qu'un `package-lock.json` existe — donc dès ton premier
`npm install` — et lance alors `node-gyp rebuild`, qui exige Python et un
compilateur C++ ([npm/cli#9837](https://github.com/npm/cli/issues/9837)). La
ligne ci-dessus le lui interdit explicitement, ce qu'il respecte dans toutes
les versions.

Si tu l'as retirée et que l'installation casse : remets-la, supprime
`node_modules`, relance `npm install`. Rien à compiler, SQLite fonctionne.

## 7. Production (cloud-native)

```bash
npm run build        # backend (rolldown) + frontend (vite → public/dist, fingerprinté)
npm start            # nodefony production — bind 0.0.0.0, logs stdout, probes /livez /readyz
```

**Plusieurs processus.** Par défaut, un seul process Node par pod : la mise à
l'échelle est le travail de l'orchestrateur. Sur une machine dédiée, trois voies
règlent le nombre de workers, de la plus forte à la plus faible :
`npx nodefony production --workers <n|auto>` (ou `npx nodefony cluster`) >
`NF_WORKERS=<n|auto>` (déclarée dans `env.ts`) >
`nodefony/config/cluster/cluster.config.ts`. Ce fichier n'est **pas généré** : sa
valeur serait le défaut (`workers: 1`), et chaque application porterait un
fichier qui ne dit rien. Crée-le si la topologie doit vivre en git :

```ts
// nodefony/config/cluster/cluster.config.ts — lu par le maître AVANT le boot,
// donc sans le moindre import du kernel.
import type { IClusterConfig } from "nodefony";
export default { workers: "auto" } satisfies IClusterConfig;
```

`auto` = un worker par cœur **alloué** (quota cgroup du conteneur), jamais
`os.cpus()`. `npm run dev` ignore ce réglage : le développement est toujours
mono-process.

> Le front de production est un build Vite figé (`public/dist/`), servi en
> statics par Nodefony — `npm run build` le produit (il chaîne
> `nodefony frontend:build`). Si tu lances `npm start` sans build, le boot le
> construit une fois pour toi quand Vite est installé (poste de dev) et le DIT
> dans les logs ; dans une image de production sans devDependencies, builde à
> l'image — sinon la page est servie sans interface et le boot le signale en
> ERROR.

### Image de container

`Dockerfile` et `.dockerignore` sont générés avec l'app ; la doctrine y est
commentée ligne à ligne (multi-stage, `USER 1000:1000`, sonde sur `/readyz`,
forme exec du `CMD`).

```bash
docker build -t nodefony .
docker run -p 5151:5151 -v nodefony-var:/app/var nodefony
docker stop -t 20 <container>   # SIGTERM → drain → exit 0
```

> 🔴 **Le `-v` n'est pas optionnel si tu veux garder tes données.** L'app
> persiste par défaut en sqlite, dans `var/databases/` : sans volume, comptes,
> sessions, jetons et passkeys disparaissent au premier `docker rm`, **sans
> aucun message**. Le volume nommé les met hors du conteneur.
>
> Et tant que la base est sqlite, **une seule réplique** : c'est un fichier, pas
> un serveur. Deux conteneurs sur le même volume se corrompent mutuellement ;
> deux conteneurs sur deux volumes travaillent sur deux bases divergentes, ce
> que rien ne signale. Pour répliquer, passer à PostgreSQL ou MySQL — il suffit
> de poser `NF_DATABASE_URL`, l'ORM déduit le dialecte du scheme et rien d'autre
> ne change dans l'app.

> ⚠️ **La période de grâce doit rester au-dessus de `shutdownDeadline`** (15 s
> par défaut) : `docker stop` n'attend que 10 s sans `-t`, et k8s 30 s. En
> dessous, le drain est coupé par un SIGKILL et les requêtes en vol meurent —
> sans erreur ni trace, à chaque déploiement.

Le code de l'image appartient à `root` et le processus tourne en `1000:1000` :
l'application ne peut pas réécrire son propre `dist/`. Seuls `tmp/` et `var/`
lui appartiennent, ce qui est exactement ce dont elle a besoin pour écrire.

#### Sur quelle base l'image est construite

`node:24-alpine`, et c'est un choix **mesuré** — les trois candidates ont été
construites avec un contenu identique, scannées, puis **démarrées** :

| Base                                  | Image finale | Critiques | Hautes | Node  | libc  | Shell dedans |
| ------------------------------------- | -----------: | --------: | -----: | ----- | ----- | ------------ |
| **`node:24-alpine`** — actuelle       |   **438 Mo** |     **0** |  **4** | 24.21 | musl  | oui (`sh`)   |
| `node:24-slim`                        |       519 Mo |         2 |     14 | 24.18 | glibc | oui (`bash`) |
| `gcr.io/distroless/nodejs24-debian12` |       400 Mo |         0 |      8 | 24.14 | glibc | **non**      |

Distroless est la plus légère et perd quand même : elle embarque un Node plus
ANCIEN et le suivra toujours avec du retard — ce qui l'expose aux CVE déjà
corrigées en amont **et** aux API récentes que ton code appelle. Et l'objection
historique contre Alpine est tombée : `better-sqlite3` et `@node-rs/argon2`
publient leurs binaires musl et s'exécutent après une installation
`--ignore-scripts`.

**Pour en changer**, le `Dockerfile` porte deux lignes `FROM` — elles se changent
**ensemble**, les deux étages devant partager la même libc :

```dockerfile
FROM node:24-slim AS build   # glibc : si un paquet natif n'a pas de binaire musl
FROM node:24-slim            # le symptôme est au DÉMARRAGE, pas à l'installation
```

Le détail de chaque candidate, et ce que distroless impose en plus (réécrire
`CMD` et `HEALTHCHECK` en `/nodejs/bin/node`), est commenté en tête du
`Dockerfile`.

#### Si tu PUBLIES cette image

L'image emporte `node_modules` élagué : la **publier** — sur un registre public,
ou en la livrant à un tiers — te rend distributeur du code de tes dépendances.
MIT, BSD, ISC et Apache-2.0 demandent alors que leur texte et leur copyright
accompagnent le code. C'est déjà le cas matériellement : chaque paquet porte son
propre fichier de licence dans `node_modules`, et l'image les emporte avec lui.

Ce qui manque, c'est l'inventaire — npm le produit sans rien installer :

```bash
npm sbom --sbom-format spdx --omit=dev > sbom.spdx.json
```

> Un **déploiement interne** (ton propre registre, ton cluster) n'est pas une
> distribution : ces obligations ne s'y appliquent pas. Et un inventaire écrit à
> la main serait faux dès le premier `npm install` — c'est pourquoi il se
> régénère plutôt qu'il ne se commite.

Un process Node = un pod/container ; le scaling horizontal vient de
l'orchestrateur (k8s, Swarm, Cloud Run…). Studio est chargé en dev seulement
(`policy: "dev"`) — pour l'exposer en production, protège `/nodefony` par une
zone firewall puis passe la policy à `"mandatory"` (la recette est commentée
dans `nodefony.config.ts`).

## 8. Développer le framework lui-même (`--link`)

Si cette app a été générée avec `--link`, les dépendances `nodefony`/`@nodefony/*`
pointent en `file:` vers un checkout local de `nodefony-core` : tu modifies le
framework, tu rebuilds le checkout, ton app le voit. Ne publie pas ce
`package.json` tel quel — après la release npm, régénère sans `--link`
(versions `^10.0.0-beta.4`).

## 9. Aller plus loin

- **Ajouter une route** : une méthode décorée `@route` dans un controller — c'est tout.
- **Un état propre à chaque requête** : chaque requête a son propre conteneur de services
  (un scope, posé comme un calque sur celui de l'application et jeté à la fin — en WebSocket,
  à la fin de la connexion). `RequestContext.getScope()` le rend depuis n'importe quel code de
  la requête ; `@injectable({ name: "tenant", scope: "request" })` y crée un service par
  requête, nettoyé (`clean()`) à sa fermeture — son constructeur reçoit le scope :
  `super("tenant", scope, false)`. Détail : `node_modules/nodefony/docs/service.md`.
- **Régler un module sans deviner** : `npx nodefony inspect schema <module>` liste les clés
  configurables avec leur description ; `npx nodefony inspect config` montre ce qui est
  posé aujourd'hui et d'où ça vient. Une clé inconnue est REFUSÉE au démarrage, en la nommant.
- **Régénérer autrement** : `nodefony create app` (interactif) ou
  `--preset <complete|minimal> --frontend <none|react|vue|angular|svelte>`
  `--database <sqlite|postgres|mariadb|mysql>` (scriptable).
- **Protéger une zone** : `use("@nodefony/security", { firewalls: { … } })` dans
  `nodefony.config.ts` (validée Zod au boot, config invalide = échec franc).
- **Canaux temps réel** : le module realtime multiplexe N canaux duplex sur une
  seule socket — voir la doc du framework.
- **Studio** est ta carte du territoire : modules chargés, routes, config
  résolue, sessions, logs — tout ce que le framework sait, il te le montre.
