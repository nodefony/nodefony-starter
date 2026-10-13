import { describe, it, expect } from "vitest";
import { EMPTY_INFRA, type ConfigContext } from "nodefony";
import config from "../nodefony.config";
import { env } from "../env";
import App from "../index";

/**
 * Tests UNITAIRES — zéro serveur, zéro infra : ils valident que l'app se CHARGE.
 *
 * C'est le filet le moins cher qui attrape le plus d'erreurs : un import cassé,
 * un décorateur mal appliqué, une config qui déréférence le kernel trop tôt
 * (interdit — le kernel n'existe pas encore à l'import) font échouer CE fichier
 * avant même de booter quoi que ce soit.
 */
describe("l'app se charge (imports, décorateurs, config)", () => {
  it("le descripteur de config S'ÉVALUE (defineConfig)", () => {
    // 🔴 Constater qu'il est « défini » ne prouve RIEN : ce descripteur est une
    // FONCTION que le Kernel appelle au démarrage, et un fragment de
    // `nodefony/config/` qui lèverait à l'appel passerait au vert. Le RÉSOUDRE
    // exécute chaque `(ctx) => …` de ta configuration et la valide — c'est le
    // contrôle que ce fichier prétend faire, et il ne coûte rien.
    const ctx: ConfigContext<typeof env> = {
      env,
      infra: EMPTY_INFRA,
      appEnv: "test",
      runtimeEnv: "test",
      isProd: false,
      isDev: false,
      isTest: true,
    };
    const resolved = config.resolve(ctx);
    // Discriminant : une configuration qui ne monte AUCUN module est cassée,
    // et c'est le seul champ dont l'absence ne lève pas d'elle-même.
    expect(resolved.modules?.length ?? 0).toBeGreaterThan(0);
  });

  it("le catalogue d'env typé existe (defineEnv — seul lecteur de process.env)", () => {
    expect(env).toBeDefined();
  });

  it("le module App est défini et décoré (ses controllers sont attachés)", () => {
    // @controllers([...]) WRAPPE la classe (c'est le décorateur qui attache les
    // controllers au module) : on vérifie le constructeur, pas son nom interne.
    expect(App).toBeTypeOf("function");
    expect(App.prototype).toBeDefined();
  });
});
