import { Service, Module, Container, injectable, inject } from "nodefony";

import AppInfoService from "./AppInfoService";

/**
 * Un service qui en CONSOMME un autre — l'exemplaire à imiter dès que ta
 * logique a besoin d'une brique déjà écrite.
 *
 * ⚡ **Tu veux un service ? Ne recopie pas ce fichier — génère-le :**
 *
 * ```bash
 * npx nodefony create service <Nom>                  # la classe + sa déclaration
 * npx nodefony create service <Nom> --inject <Autre> # + la dépendance écrite
 * ```
 *
 * Le générateur écrit la version COURANTE du framework et déclare le service sur
 * le module ; recopié à la main, il naît déjà décalé et personne ne le signale.
 * Ce fichier reste là pour se LIRE — comprendre ce qu'est un service — pas pour
 * se dupliquer.
 *
 * `AppInfoService`, à côté, montre à quoi ressemble un service. Il ne montrait
 * pas le geste le plus fréquent, et de loin : **s'en servir depuis ailleurs**.
 * Sans un exemplaire sous les yeux, ce geste se réinvente — et il se réinvente
 * mal. Les deux erreurs qui reviennent, toutes deux compilables :
 *
 *   `new AppInfoService(module)`      un SECOND exemplaire, qui n'est pas celui
 *                                     du conteneur : sa configuration, son
 *                                     `init()` et son état ne sont pas les siens
 *   un import direct, appelé en statique
 *                                     plus de conteneur du tout, donc plus rien
 *                                     à remplacer en test
 *
 * La bonne voie est ci-dessous, et il y en a deux :
 *
 * 1. **Par le CONSTRUCTEUR** (`@inject`) — la dépendance est DÉCLARÉE, donc le
 *    conteneur construit `AppInfoService` AVANT celui-ci et passe l'exemplaire
 *    unique. C'est la voie par défaut. `@inject` prend le nom de la **CLASSE**
 *    (`AppInfoService`), jamais la clé d'instance.
 * 2. **Par le CONTENEUR** (`this.container.get("appInfo")`) — utile quand la
 *    dépendance est tardive ou optionnelle. Ici c'est la clé d'**INSTANCE**,
 *    celle que l'autre fichier passe en premier argument à son constructeur
 *    parent — pas le nom de sa classe.
 *
 * Tu en veux un nouveau ? Ne recopie pas ce fichier :
 * `npx nodefony create service <Nom> --inject AppInfoService` écrit ce
 * constructeur pour toi, à la version courante du framework.
 */
@injectable()
class AppBannerService extends Service {
  module: Module;

  constructor(
    module: Module,
    // La dépendance passe par le CONSTRUCTEUR : le conteneur la construit avant
    // celui-ci et l'ordonnance. `@inject` prend le nom de la CLASSE — la clé
    // d'instance (`"appInfo"`) ne sert qu'à `container.get`.
    @inject("AppInfoService") private readonly appInfo: AppInfoService,
  ) {
    super(
      "appBanner",
      module.container as Container,
      module.notificationsCenter,
    );
    this.module = module;
  }

  /**
   * Hook de démarrage, appelé UNE fois par le kernel après la construction.
   *
   * ⚠️ `init`, pas `initialize` — le kernel ne cherche que `init`.
   */
  async init(): Promise<this> {
    this.log("service appBanner initialisé", "DEBUG");
    return this;
  }

  /**
   * Compose une ligne lisible à partir du service injecté — remplace ce corps
   * par ta logique.
   *
   * Noter qu'on n'a rien reconstruit : `this.appInfo` EST l'exemplaire du
   * conteneur, avec sa configuration et son `init()` déjà passés.
   */
  banner(): string {
    const { app, env } = this.appInfo.identity();
    return `${app} — ${env}`;
  }
}

export default AppBannerService;
