import { Service, Module, injectable } from "nodefony";

/**
 * Un SERVICE de ton application — l'exemplaire à LIRE quand tu écris de la
 * logique métier.
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
 * Il est là pour une raison précise : ton application naît avec des controllers
 * d'exemple, et un agent — comme un développeur — imite ce qu'il a sous les
 * yeux. Sans un service à copier, la logique finit dans un controller, ou dans
 * une classe ordinaire instanciée à la main. Les deux COMPILENT et passent les
 * tests ; les deux perdent tout ce que le conteneur apporte.
 *
 * **Quand écrire un service plutôt qu'une méthode de controller ?** Dès que le
 * même traitement sert à DEUX endroits — deux routes, une route et une commande
 * CLI, un controller et un canal temps réel. Un controller traduit du HTTP ou du
 * WebSocket ; un service porte le métier, et le même exemplaire sert tous les
 * transports sans être réécrit pour chacun.
 *
 * Trois choses en font un service Nodefony, et aucune n'est décorative :
 *
 *   `@injectable()`          le conteneur peut le construire et l'injecter
 *   `extends Service`        il reçoit `this.log`, les événements, le conteneur
 *   `super("appInfo", …)`    sa clé d'instance — `container.get("appInfo")`
 *
 * Le décorateur nomme la CLASSE (ce qu'on écrit dans `@Inject("AppInfoService")`),
 * le `super()` nomme l'INSTANCE. Les deux mènent au même exemplaire.
 *
 * ⚠️ Écrire cette classe ne suffit PAS : un service doit être DÉCLARÉ sur le
 * module, dans `@services([…])` de l'`index.ts`. Une classe `@injectable()` que
 * personne ne déclare n'existe pour personne — `npx nodefony doctor` le dit
 * (règle `orphan-service`), mais seulement si le décorateur est là.
 */
@injectable()
class AppInfoService extends Service {
  module: Module;

  constructor(module: Module) {
    super("appInfo", module.container ?? undefined, module.notificationsCenter);
    this.module = module;
  }

  /**
   * Hook de démarrage, appelé UNE fois par le kernel après la construction.
   *
   * ⚠️ Il s'appelle `init`, pas `initialize` : le kernel ne cherche que `init`.
   * Une méthode `initialize` sur un service n'est jamais appelée, et rien ne le
   * signale. (`initialize` existe, mais sur un CONTROLLER, où il tourne à CHAQUE
   * requête — deux cycles de vie, deux noms.)
   */
  async init(): Promise<this> {
    this.log("service appInfo initialisé", "DEBUG");
    return this;
  }

  /**
   * La carte d'identité de l'application — remplace ce corps par ta logique.
   *
   * Elle lit la CONFIGURATION plutôt qu'une valeur écrite en dur : c'est ce qui
   * permet de changer le comportement par environnement sans retoucher au code.
   */
  identity(): { app: string; env: string } {
    return {
      app: "nodefony",
      env: this.kernel?.environment ?? "development",
    };
  }
}

export default AppInfoService;
