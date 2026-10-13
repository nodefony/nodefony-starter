import type { Module } from "nodefony";
import type { FrontendService } from "@nodefony/frontend";

/**
 * Déclare l'entry Vite « nodefony » auprès de `@nodefony/frontend`.
 *
 * À appeler depuis le hook `onKernelBoot()` du module propriétaire — AVANT
 * `onKernelReady` : le superviseur Vite démarre avec la liste COMPLÈTE des
 * entries (en dev il compile toutes les pages du process dans UN serveur Vite ;
 * en prod chaque entry a son bundle fingerprinté, servi en statique).
 *
 * Champs de l'entry :
 *  - `type`   : pilote du framework (`react19` | `vue3` | `angular`) — choisit
 *    le plugin Vite injecté dans la config GÉNÉRÉE (vite.config.generated.mjs,
 *    régénérée à chaque boot dev — ne jamais l'éditer à la main) ;
 *  - `entry`  : point d'entrée compilé, RELATIF au dossier du module ;
 *  - `root`   : racine Vite du module (contient index.html + src/) ;
 *  - `outDir` : sortie du build prod (montée en statique par le framework) ;
 *  - `name`   : nom de l'entry — le MÊME que celui passé à
 *    `renderDocument("nodefony", nonce, hôte)` par le controller.
 *
 * Aucun proxy d'API à déclarer : la page est rendue par Nodefony et ses
 * modules passent par la même origine (`/_vite/…`), donc un `fetch("/api/…")`
 * atteint directement le controller.
 */
export function registerNodefonyEntry(module: Module): void {
  const svc = module.kernel?.container?.get("frontend") as
    FrontendService | undefined;
  if (!svc) {
    module.log("@nodefony/frontend service not registered", "ERROR");
    return;
  }
  svc.registerEntry(module, {
    type: "react19",
    entry: "./frontend/src/main.tsx",
    root: "./frontend",
    outDir: "./public/dist",
    name: "nodefony",
  });
}
