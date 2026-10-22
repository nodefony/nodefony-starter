/**
 * ORM SQL — les connecteurs Drizzle de l'application, DÉCLARÉS.
 *
 * Fragment du manifeste : `nodefony.config.ts` l'importe et le passe à
 * `use("@nodefony/drizzle", …)`. Rien ne charge ce fichier tout seul.
 *
 * 🔴 Déclarer n'est pas une formalité : tout ce qui lit la configuration SANS
 * démarrer l'application — `nodefony create entity`, la page « Créer » de la
 * console, `orm:migrate`, `nodefony doctor` — ne connaît que les connecteurs
 * écrits ici. Une base de plus = une entrée de plus :
 * `analytics: { dialect: "postgres", url: … }`.
 *
 * @module
 */
import type { IDrizzleConfigInput } from "@nodefony/drizzle";

/**
 * La configuration de `@nodefony/drizzle` pour cette application.
 *
 * `default` : la base applicative. Sans `NF_DATABASE_URL`, un fichier sqlite
 * local (`var/databases/`) ; avec, la base qu'elle désigne — l'infrastructure
 * gagne sur ce fragment.
 */
export const drizzleConfig = () =>
  ({
    connectors: {
      default: {},
    },
  }) satisfies IDrizzleConfigInput;
