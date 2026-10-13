import type { Module } from "nodefony";
import { ormRegistry } from "@nodefony/orm-core";
import {
  describeSeedFailure,
  InMemoryUserRepository,
  UserService,
} from "@nodefony/user";
import type { IPasswordEncoder } from "@nodefony/user";
import { DrizzleUserRepository } from "@nodefony/drizzle";
import type { DrizzleOrm } from "@nodefony/drizzle";
import { env } from "../../env";

const LOG_CTX = "USERS";

/** Identifiant (login) du compte administrateur seedé au premier boot. */
export const ADMIN_IDENTIFIER = "admin";

/**
 * Rôles du compte admin — donnés À PLAT (en plus de la hiérarchie déclarée dans
 * `nodefony.config.ts`) : `ROLE_NODEFONY_ADMIN` ouvre la console Studio
 * (`/nodefony`), `ROLE_ADMIN` la gestion applicative des utilisateurs.
 */
export const ADMIN_ROLES = ["ROLE_ADMIN", "ROLE_NODEFONY_ADMIN"];

/**
 * Mot de passe du compte admin en DÉVELOPPEMENT, quand `NF_ADMIN_PASSWORD` n'est
 * pas posée. Jamais utilisé en production (voir {@link seedAdmin}).
 *
 * Il doit passer la politique de mots de passe posée par `@nodefony/user`,
 * sinon AUCUNE application générée ne sème son propre compte : c'est arrivé
 * avec `admin`, refusé parce qu'il contient l'identifiant du compte.
 */
export const DEV_ADMIN_PASSWORD = "nodefony-dev-42";

/**
 * Pose le service applicatif `"users"` (la source d'identité du firewall) au
 * démarrage de l'app, puis seed le compte admin s'il n'existe pas.
 *
 * **C'est la responsabilité de TON application, pas du framework** :
 * `@nodefony/security` sait *authentifier*, mais c'est l'app qui décide *qui*
 * sont ses utilisateurs et *où* ils sont stockés. Sans ce service, toutes les
 * méthodes d'auth (mot de passe, JWT, social) échouent avec
 * « aucun service users ».
 *
 * Dépôt : Drizzle (SQL — sqlite local par défaut, `NF_DATABASE_URL` pour une
 * vraie base). Si l'ORM n'est pas chargé (module retiré du manifeste), repli
 * ANNONCÉ sur un annuaire mémoire volatil — l'auth marche, mais les comptes ne
 * survivent pas au redémarrage.
 *
 * Mot de passe admin :
 * - DÉVELOPPEMENT : `admin` / `nodefony-dev-42` par défaut (local uniquement —
 *   même esprit que Grafana). Surcharge : `NF_ADMIN_PASSWORD` dans `.env`.
 * - PRODUCTION : `NF_ADMIN_PASSWORD` OBLIGATOIRE (secret-manager) — sans lui,
 *   AUCUN compte n'est créé (jamais de mot de passe par défaut en prod) et un
 *   WARNING explique quoi faire (`nodefony security:user:add`).
 *
 * Idempotent et non destructif : ne remplace jamais un annuaire déjà posé, ne
 * recrée jamais un compte existant.
 *
 * @param module - le module applicatif (`App`) — fournit container, kernel, log.
 */
export async function provisionUsers(module: Module): Promise<void> {
  const container = module.container;
  if (!container || container.has("users")) {
    return;
  }

  // L'encodeur (Argon2id par défaut) est posé par le firewall (@nodefony/security).
  // Son absence = module security non chargé → échec franc, pas de fallback muet.
  const encoder = container.get<IPasswordEncoder>("passwordEncoder");
  if (!encoder) {
    throw new Error(
      `provisionUsers: service "passwordEncoder" absent — le module ` +
        `@nodefony/security est-il chargé dans nodefony.config.ts ?`,
    );
  }

  // 🔴 DEUX conditions, et deux causes DISTINCTES à nommer.
  //
  // 1. `get()` LÈVE sur un nom inconnu : interroger AVANT, sinon ce repli
  //    fail-soft — tout l'objet du bloc qui suit — ne s'exécute jamais et le
  //    boot casse là où il devait dégrader.
  // 2. L'ORM peut EXISTER sans être CONNECTÉ : une commande en ligne
  //    (`nodefony inspect`, `nodefony build`) ne déclare pas `externalServices`,
  //    donc le framework enregistre l'ORM sans composer le numéro de la base.
  //    Construire un dépôt sur cet ORM lève « no entity table registered » — les
  //    tables ne sont peuplées qu'à la connexion — et tue le démarrage d'une
  //    commande qui n'avait aucun besoin de la base.
  const registered = ormRegistry.has("default")
    ? (ormRegistry.get("default") as DrizzleOrm)
    : undefined;

  const orm = registered?.isConnected() ? registered : undefined;
  if (!orm) {
    // Repli ANNONCÉ (jamais silencieux), et le message nomme la cause RÉELLE :
    // envoyer réinstaller un module présent ferait chercher là où il n'y a rien.
    module.log(
      registered
        ? `ORM "default" enregistré mais NON CONNECTÉ — ce run n'a pas déclaré ` +
            `\`externalServices\` (une commande qui lit ou écrit des données le ` +
            `déclare via CONSOLE_DATA_RUN_PROFILE) → annuaire utilisateurs EN ` +
            `MÉMOIRE le temps de ce run.`
        : `ORM "default" absent (module @nodefony/drizzle retiré ?) → annuaire ` +
            `utilisateurs EN MÉMOIRE : les comptes ne survivront pas au redémarrage.`,
      "WARNING",
      LOG_CTX,
    );
    const users = new UserService(
      new InMemoryUserRepository([]),
      encoder,
      container,
    );
    container.set("users", users);
    await seedAdmin(users, module);
    return;
  }

  const users = new UserService(
    DrizzleUserRepository.from(orm),
    encoder,
    container,
  );
  container.set("users", users);
  await seedAdmin(users, module);
}

/**
 * Crée le compte admin s'il n'existe pas (idempotent). Le hash Argon2id est
 * fait par `UserService.createUser` — jamais de mot de passe en clair stocké.
 *
 * **Un semis raté n'interrompt JAMAIS le démarrage — c'est tranché ici, pas
 * laissé au hasard d'un `try`.** Amorcer un compte est un confort de première
 * minute : une application sans compte démarre parfaitement, et l'exploitant en
 * crée un par `nodefony security:user:add`. Faire mourir toute l'application
 * parce qu'un mot de passe déplaît à la politique ferait payer le service au
 * prix de la commodité. La dégradation, elle, est BRUYANTE : un `ERROR` au boot
 * est compté par le bilan du dernier démarrage (`var/last-boot.json`), donc
 * relisible par `nodefony doctor` longtemps après la fermeture du terminal qui
 * l'a vu passer.
 *
 * @param users - service utilisateur branché sur son dépôt.
 * @param module - module applicatif (logs + environnement).
 */
async function seedAdmin(users: UserService, module: Module): Promise<void> {
  if (await users.findByIdentifier(ADMIN_IDENTIFIER)) {
    return;
  }
  const isProd = module.kernel?.environment === "production";
  const fromEnv = env.NF_ADMIN_PASSWORD;
  const password = fromEnv ?? (isProd ? null : DEV_ADMIN_PASSWORD);
  if (!password) {
    module.log(
      `Aucun admin et NF_ADMIN_PASSWORD non défini → aucun compte seedé en ` +
        `production. Définis NF_ADMIN_PASSWORD (secret-manager) ou crée un ` +
        `compte : \`npx nodefony security:user:add admin --admin\`.`,
      "WARNING",
      LOG_CTX,
    );
    return;
  }
  try {
    await users.createUser({
      identifier: ADMIN_IDENTIFIER,
      plainPassword: password,
      roles: ADMIN_ROLES,
    });
  } catch (e) {
    // Le message vient du PAQUET, pas de ce fichier : ce fichier-ci est copié
    // chez toi au moment de la génération, et une copie ne se corrige plus. Le
    // semis est un confort ; l'expliquer est un service, et celui-là se met à
    // jour avec `@nodefony/user`.
    //
    // `describeSeedFailure` réunit les deux moitiés du message : ce que
    // l'erreur sait (la règle enfreinte) et ce que toi seul sais (quel compte,
    // d'où vient le mot de passe, quel geste). Recopier cette rédaction ici la
    // ferait diverger en silence au premier changement — et c'est le message,
    // pas le code, qui fait la différence entre dix secondes et une demi-heure.
    //
    // `fromEnv` décide du remède : envoyer corriger une variable que personne
    // n'a posée ferait chercher là où il n'y a rien.
    module.log(
      describeSeedFailure(e, {
        identifier: ADMIN_IDENTIFIER,
        envVar: "NF_ADMIN_PASSWORD",
        fromEnv: fromEnv != null,
        admin: true,
      }),
      "ERROR",
      LOG_CTX,
    );
    return;
  }
  module.log(
    isProd
      ? `Compte admin seedé (mot de passe : NF_ADMIN_PASSWORD).`
      : `Compte admin seedé — connexion : admin / ${fromEnv ? "(NF_ADMIN_PASSWORD)" : DEV_ADMIN_PASSWORD} (Studio : /nodefony).`,
    "INFO",
    LOG_CTX,
  );
}
