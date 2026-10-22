/**
 * Outillage de développement — la porte MCP et son audience.
 *
 * Fragment du manifeste : `nodefony.config.ts` l'importe et passe le résultat à
 * `use("@nodefony/devkit", …)`. Rien ne charge ce dossier tout seul — c'est
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
import type { IDevkitConfigInput } from "@nodefony/devkit";
import type { env } from "../../env";

/** La configuration de `@nodefony/devkit` pour cette application. */
export const devkitConfig = (ctx: ConfigContext<typeof env>) =>
  ({
    mcp: {
      authorization: {
        /**
         * 🔴 L'audience attendue des jetons de la porte MCP — elle
         * s'ÉCRIT, jamais ne se dérive du `Host` : un en-tête forgé
         * obtiendrait sinon un jeton d'audience arbitraire ET passerait la
         * vérification, ce qui viderait la liaison d'audience (RFC 8707) de
         * son unique raison d'être.
         *
         * Sans cette ligne, l'émetteur de cette application REFUSE de
         * signer un jeton pour sa propre porte (`invalid_target`) — et
         * `npx nodefony ai:mcp --auth` livre alors une porte que rien ne
         * peut franchir.
         *
         * Ce sont les adresses de DÉVELOPPEMENT (la porte répond en clair
         * et en TLS). En production, mets ici l'URL publique en https.
         *
         * ⚠️ Le PORT suit ta configuration (`NF_PORT`), il n'est pas figé :
         * une application lancée ailleurs verrait sinon son propre jeton
         * refusé — l'audience désignant une adresse où elle ne répond pas.
         * Lire une variable de configuration n'est PAS dériver du `Host` :
         * l'une t'appartient, l'autre vient du client.
         */
        resource: `http://localhost:${ctx.env.NF_PORT ?? 5151}/nodefony/mcp`,
        additionalResources: [
          `https://localhost:${ctx.env.NF_PORT_HTTPS ?? 5152}/nodefony/mcp`,
        ],
      },
    },
  }) satisfies IDevkitConfigInput;
