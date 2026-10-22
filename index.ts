import { Module, appConfigJsonSchema, services } from "nodefony";
import type { Kernel } from "nodefony";
import { controllers } from "@nodefony/framework";
import AppInfoService from "./nodefony/service/AppInfoService";
import AppBannerService from "./nodefony/service/AppBannerService";

import { registerNodefonyEntry } from "./nodefony/frontend/registerNodefonyEntry";
import config from "./nodefony.config";
import HelloController from "./nodefony/controllers/HelloController";
import LiveController from "./nodefony/controllers/LiveController";
import PartnerController from "./nodefony/controllers/PartnerController";
import PartnerCallCommand from "./nodefony/command/PartnerCallCommand";
import AppController from "./nodefony/controllers/AppController";
import { entities } from "@nodefony/orm-core";
import { UserEntity } from "./nodefony/entity/User";
import { provisionUsers } from "./nodefony/security/provisionUsers";

/**
 * Catalogue d'env typé, lu par le Kernel au boot pour alimenter `ctx.env`
 * du descripteur `defineConfig`.
 */
export { env } from "./env";

/**
 * Point d'entrée de l'application (chargé par le Kernel : `dist/index.js`).
 * L'app ne déclare ici que ce qui lui est INTRINSÈQUE : ses controllers et ses
 * services. Les modules chargés vivent dans `nodefony.config.ts` (manifeste
 * `modules`).
 *
 *
 * ⚠️ `@services([…])` est ce qui fait EXISTER un service : écrire une classe
 * `@injectable()` sans l'ajouter ici la laisse invisible au conteneur. Tout
 * service que tu ajoutes — le tien, ou celui que `nodefony create service`
 * génère — se déclare dans cette liste.
 */
@entities([UserEntity])
@services([AppInfoService, AppBannerService])
@controllers([
  HelloController,
  LiveController,
  PartnerController,
  AppController,
])
class App extends Module {
  constructor(kernel: Kernel) {
    super("app", kernel, import.meta.url, config);
    // Commande d'exemple : un programme qui appelle l'API avec un jeton.
    // Une commande se déclare ICI, après `super` — comme celles que
    // `npx nodefony create command` ajoute.
    this.addCommand(PartnerCallCommand);
  }

  /**
   * Publie le schéma de la configuration de l'application : c'est ce qui rend
   * `npx nodefony inspect schema app` capable d'en donner le catalogue —
   * `servers`, `domain`, `log`… avec défauts et descriptions. Sans lui, les
   * clés de l'application sont indécouvrables là où elles servent.
   */
  override configSchema(): unknown {
    return appConfigJsonSchema();
  }

  /**
   * Pose l'annuaire utilisateurs de l'app + seed le compte admin (idempotent).
   * L'identité est la responsabilité de l'APPLICATION — le firewall
   * (@nodefony/security) authentifie, mais c'est ici qu'on décide QUI sont les
   * utilisateurs et OÙ ils vivent. Détails : nodefony/security/provisionUsers.ts
   */
  override async onKernelReady(): Promise<this> {
    await provisionUsers(this);
    return this;
  }

  /**
   * Déclare l'entry frontend react auprès du FrontendService —
   * AVANT `onKernelReady` pour que le superviseur Vite démarre avec elle.
   * En dev : HMR ; en prod : build pré-compilé servi en statics.
   *
   * Le DÉTAIL de l'entry (type, racine Vite, proxy d'API) vit dans
   * `nodefony/frontend/registerNodefonyEntry.ts` — même fichier, même
   * forme que pour un module créé par `nodefony create front`.
   */
  override async onKernelBoot(): Promise<this> {
    registerNodefonyEntry(this);
    return this;
  }
}

export default App;
