import { defineNodefonyRolldownConfig } from "nodefony/bundler";

/**
 * Build de l'app — tout le socle (preserveModules, treeshake, décorateurs lus
 * du tsconfig) vit dans `nodefony/bundler`. `externalDeps` : le runtime vient
 * de `node_modules`, seul TON code est bundlé.
 *
 * `cleanDir` vide `dist/` juste avant l'écriture (fichiers périmés retirés,
 * dossier jamais absent pendant la compilation). `dist/` appartient donc au
 * seul build backend : ne pas y faire sortir un front (`outDir`, défaut
 * `./public/dist`), chaque rebuild l'effacerait.
 */
export default defineNodefonyRolldownConfig({
  externalDeps: true,
  cleanDir: true,
});
