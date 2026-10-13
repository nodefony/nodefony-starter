import { execFileSync } from "node:child_process";
import { rmSync } from "node:fs";
import path from "node:path";
import {
  adminLogin as loginAdmin,
  E2E_ADMIN_PASSWORD,
  nodefonyBin,
  runningAppPort,
} from "nodefony/testing";
/**
 * Démarre l'application UNE fois pour toute la suite E2E, et l'arrête à la fin.
 *
 * Pourquoi ici et pas dans chaque fichier de test : chaque entité générée apporte
 * son propre fichier `*.e2e.test.ts`, et un `beforeAll` par fichier signifierait
 * un démarrage complet par fichier — la suite se paierait en minutes, et deux
 * fichiers qui démarrent la même application se marcheraient dessus.
 *
 * La mécanique est 100 % native Nodefony :
 *   - `nodefony production --detach --wait` : lancement détaché, exit 0 seulement
 *     quand la readiness est sondée (ports ouverts) — aucun sleep arbitraire ;
 *   - `nodefony stop` : arrêt propre de tout runtime de l'application.
 *
 * Les tests ne reçoivent pas le port par ce fichier : ils le lisent eux-mêmes
 * avec `runningAppPort()`. Un port écrit en dur casse dès que l'application
 * déclare le sien (`NF_PORT`, `PORT` en PaaS) ou qu'un port occupé l'a fait
 * glisser — et un port de REPLI est pire encore, il fait interroger le premier
 * serveur venu sur la machine.
 */

/**
 * Le lanceur du framework — RÉSOLU par le framework lui-même.
 *
 * Aucun chemin n'est écrit ici, et c'est le point : `node_modules/.bin/nodefony`
 * n'existe pas sous Windows (npm y écrit un `.cmd`, que Node refuse d'exécuter
 * sans shell), et l'emplacement du paquet dépend du hoisting, des espaces de
 * travail, du gestionnaire utilisé. `nodefonyBin()` demande à Node de localiser
 * le paquet et lit son champ `bin` : une seule implémentation, dans le
 * framework, qui suit ses propres déménagements.
 *
 * Le résultat se donne à `node`, jamais au système : c'est un script.
 */
const bin = nodefonyBin();

/**
 * Base de données de la suite E2E — jetable, et surtout SÉPARÉE de celle du
 * développement.
 *
 * Une suite qui écrit dans la base de dev ne fait pas que la salir : elle y
 * sème un compte `admin` dont le mot de passe est celui, écrit en clair dans ce
 * fichier. Le seed étant idempotent, `admin` / `admin` — le couple annoncé par
 * le `.env` et le README — cesse alors de fonctionner pour toujours, sans le
 * moindre message. Symétriquement, un `admin` déjà semé en développement fait
 * échouer `adminLogin()`, et la suite accuse la route qu'elle mesure au
 * lieu de son décor. Un fichier à part supprime les deux pannes d'un coup, et
 * rend la suite reproductible.
 *
 * Surcharge : `NF_E2E_DATABASE_URL` — pour éprouver la suite sur un AUTRE
 * serveur que celui du développement (une instance PostgreSQL de recette, par
 * exemple).
 *
 * ⚠️ **Elle ne change pas le DIALECTE de vos entités.** Elles sont écrites pour
 * celui que vous avez choisi à la création de l'application, et l'ORM refuse de
 * démarrer sur un autre en nommant l'entité fautive. Viser un moteur différent
 * suppose de porter chaque entité (`createXTable("postgres")`) — un chantier,
 * pas une variable.
 */
export const E2E_BASE_URL =
  process.env.NF_E2E_DATABASE_URL ??
  `sqlite:${path.resolve("var/databases/e2e.db")}`;

/**
 * Mot de passe du compte d'administration, POUR LA SUITE DE TESTS UNIQUEMENT.
 *
 * La suite tourne en `production`, où aucun compte n'est semé sans mot de passe
 * explicite — c'est voulu : une application ne doit jamais naître en production
 * avec des identifiants connus. Les tests, eux, ont besoin d'une identité pour
 * éprouver les routes protégées (la suppression, notamment), d'où cette valeur
 * jetable, posée dans l'environnement du serveur de test et nulle part ailleurs.
 *
 * ⚠️ Elle doit passer la POLITIQUE de mot de passe (`PasswordPolicy`) : 10
 * caractères au moins, et surtout **elle ne reprend pas l'identifiant du
 * compte** (`admin`). Un seed refusé n'est pas un test rouge — il fait échouer
 * le BOOT, et la suite entière s'arrête sur « aucun fichier de test trouvé »,
 * message qui n'a aucun rapport avec la cause.
 */
// La valeur vit dans `nodefony/testing` : les tests d'un MODULE, qui ne peuvent
// pas importer ce fichier (leur `rootDir` est le module), en ont besoin aussi.
export const ADMIN_PASSWORD = E2E_ADMIN_PASSWORD;

/**
 * Ouvre une session d'administration et rend l'en-tête `Cookie` à rejouer.
 *
 * C'est ainsi qu'un client réel s'authentifie auprès de l'application : un POST
 * sur la route de connexion du framework, puis le cookie de session sur chaque
 * requête suivante. Les tests d'une route protégée s'en servent ; les autres
 * l'ignorent.
 *
 * @returns L'en-tête `Cookie` complet, à passer tel quel à `fetch`.
 * @throws Si la connexion échoue — mieux vaut un test qui dit « je n'ai pas pu
 * m'authentifier » qu'un test qui conclut « accès refusé » sur un décor cassé.
 */
export async function adminLogin(): Promise<string> {
  return loginAdmin(appBaseUrl(), ADMIN_PASSWORD);
}

/**
 * Adresse EXTERNE à laquelle l'application est déjà servie, s'il y en a une.
 *
 * Posée (`NF_E2E_BASE_URL=https://localhost:8443`), elle change la NATURE du
 * run : l'application ne tourne plus ici, elle tourne derrière son frontal — le
 * profil `edge` du compose, un déploiement de recette, une chaîne d'intégration.
 * Ce fichier ne démarre alors rien, n'arrête rien et ne touche à aucune base :
 * ce serait agir sur une machine qui n'est pas celle qui sert. C'est à qui pose
 * la variable d'avoir préparé le décor.
 *
 * Ce que cela achète : les MÊMES tests, joués à travers le proxy. C'est le seul
 * moment où l'on constate ce qu'un `fetch` direct ne peut pas voir — l'adresse
 * réelle du client dans l'audit, le cookie `Secure` posé alors que le lien
 * interne est en clair, la barrière `Host`, la montée WebSocket au travers.
 *
 * ⚠️ Certificat auto-signé (celui du développement) : le donner à Node une fois
 * pour toutes plutôt que de désarmer la validation —
 * `NODE_EXTRA_CA_CERTS=nodefony/config/certificates/ca/nodefony-root-ca.crt.pem`.
 * L'ignorer ferait passer la suite contre n'importe quel certificat, y compris
 * celui d'un autre.
 */
const EXTERNAL_BASE_URL = process.env.NF_E2E_BASE_URL ?? "";

/**
 * L'adresse de base de l'application POUR CE RUN — une seule règle, un seul
 * endroit. Chaque fichier de test la demande ici plutôt que de la recomposer :
 * deux recompositions divergeraient, et l'une des deux interrogerait le serveur
 * local pendant qu'on croit mesurer le déploiement visé.
 */
export function appBaseUrl(): string {
  if (EXTERNAL_BASE_URL) return EXTERNAL_BASE_URL.replace(/\/+$/u, "");
  return `http://127.0.0.1:${runningAppPort()}`;
}

/** Vrai quand l'application visée est servie ailleurs (typiquement : un frontal). */
export const isExternalTarget = Boolean(EXTERNAL_BASE_URL);

/**
 * Vrai quand cette cible externe est servie en **TLS**.
 *
 * 🔴 « Externe » et « derrière un frontal TLS » ne sont PAS la même chose, et
 * les confondre fabrique un rouge qui n'appartient à personne. Une application
 * jointe par son nom de service sur le réseau d'un compose ou d'un cluster est
 * bien externe, et pourtant servie en clair : tout ce qui DÉRIVE du schéma
 * constaté — le préfixe `__Host-` en tête — y est légitimement absent.
 *
 * Mesuré : un banc qui joue cette suite contre `http://app:5151` obtenait un
 * échec sur le cookie, alors que le serveur se comportait exactement comme il
 * le doit. Le cas mesure la CONFIANCE AU PROXY ; sans TLS au bout, il n'y a
 * pas de proxy à croire.
 */
export const isTlsTarget =
  isExternalTarget && appBaseUrl().startsWith("https:");

export async function setup(): Promise<void> {
  if (EXTERNAL_BASE_URL) {
    process.stdout.write(
      `e2e : application visée à l'externe (${EXTERNAL_BASE_URL}) — ` +
        "aucun démarrage, aucune base touchée ici.\n",
    );
    return;
  }
  // Repartir d'une base VIERGE : une suite dont le verdict dépend de ce qu'un
  // run précédent a laissé n'est pas reproductible.
  // Les compagnons `-wal` et `-shm` partent avec le fichier, sinon SQLite
  // ressuscite l'état d'avant.
  if (E2E_BASE_URL.startsWith("sqlite:")) {
    const file = E2E_BASE_URL.slice("sqlite:".length);
    for (const suffix of ["", "-wal", "-shm"]) {
      rmSync(`${file}${suffix}`, { force: true });
    }
  }

  // Le schéma AVANT le trafic — le patron de production, appliqué ici tel quel.
  //
  // En production le démarrage ne fabrique JAMAIS le schéma (mode `ddl: none`) :
  // c'est délibéré, parce que plusieurs exemplaires partent en même temps et
  // qu'aucun d'eux ne doit toucher aux tables. C'est un travail d'orchestrateur,
  // qui passe AVANT. Sans cette étape, la base qu'on vient d'effacer reste vide,
  // la mise en service est retenue (`/readyz` rend 503), et `--wait` attend une
  // disponibilité qui ne viendra jamais.
  execFileSync(process.execPath, [bin, "orm:migrate"], {
    stdio: "inherit",
    timeout: 120_000,
    env: {
      ...process.env,
      NODE_ENV: "production",
      NF_DATABASE_URL: E2E_BASE_URL,
    },
  });
  execFileSync(process.execPath, [bin, "production", "--detach", "--wait"], {
    stdio: "inherit",
    timeout: 120_000,
    env: {
      ...process.env,
      // La suite ne touche JAMAIS la base de développement — cf `E2E_BASE_URL`.
      NF_DATABASE_URL: E2E_BASE_URL,
      // Port ATTRIBUÉ PAR LE NOYAU, jamais celui de la convention.
      //
      // Cette suite tourne sur un poste où d'AUTRES choses écoutent — un autre
      // projet, une session de développement, un conteneur. Prendre 5151 y est
      // une loterie, et elle se perd en silence : sur macOS un serveur lié à
      // `127.0.0.1:5151` n'empêche pas cette app de prendre `0.0.0.0:5151` (le
      // `domain` de production), si bien que le bind RÉUSSIT, que rien ne
      // glisse, et que `http://127.0.0.1:5151` continue d'aller chez le voisin.
      // La suite mesure alors un serveur qui n'est pas le sien et rend des 404
      // qui accusent les routes de cette application.
      //
      // `0` supprime la question : le noyau donne un port dont personne d'autre
      // ne dispose, l'application le publie, et `runningAppPort()` le lit. Aucun
      // port n'est écrit nulle part — il n'y a rien à tenir à jour.
      NF_PORT: "0",
      // Sans cette variable, la production ne sème AUCUN compte : les tests des
      // routes protégées n'auraient aucune identité à présenter, et échoueraient
      // en accusant la garde plutôt que le décor.
      NF_ADMIN_PASSWORD: ADMIN_PASSWORD,
      // Un exemplaire de production qui SERT refuse de démarrer sans clé de
      // signature partagée (jwt.keystore). Il tourne seul, sur ce poste : la
      // source « dossier » est la bonne. Un déploiement pose NF_JWT_KEYSET.
      NF__SECURITY__JWT__KEYSTORE__DIR: "var/keys",
      // La production refuse un mot de passe reçu en clair (403 avant toute
      // vérification). Cette suite parle à l'application en HTTP sur la boucle
      // locale, sans proxy TLS devant : le clair est ici un choix de DÉCOR, et il
      // s'écrit. Jouée derrière le frontal (`NF_E2E_BASE_URL`), la suite ne passe
      // pas par ici et la règle s'applique entière.
      NF__SECURITY__ALLOWINSECURECREDENTIALS: "true",
    },
  });
}

export async function teardown(): Promise<void> {
  // Rien à arrêter : cette suite n'a rien démarré (cf `EXTERNAL_BASE_URL`), et
  // un `stop` ici tuerait un runtime local sans rapport avec ce qu'on mesure.
  if (EXTERNAL_BASE_URL) return;
  // Jamais de serveur laissé derrière : un runtime orphelin tient les ports et
  // fait échouer le run suivant sur une erreur qui ne parle pas de lui.
  execFileSync(process.execPath, [bin, "stop"], {
    stdio: "inherit",
    timeout: 30_000,
  });
}
