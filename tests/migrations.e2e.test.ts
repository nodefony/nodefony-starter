import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import {
  appendFileSync,
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
} from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { nodefonyBin, runningAppPort, startSpareApp } from "nodefony/testing";
// Une application générée importe ses primitives de test EXPLICITEMENT : sa
// configuration Vitest ne pose pas `globals`, contrairement à celle du dépôt du
// framework. Un fichier écrit avec la convention du dépôt échoue ici sur un
// `beforeAll is not defined` — mesuré, pas déduit.
import { afterAll, beforeAll, describe, it } from "vitest";
import { E2E_BASE_URL } from "./e2e.setup";

/**
 * Ces épreuves interrogent la base LOCALE par la ligne de commande, et lancent
 * des exemplaires de rechange sur cette machine. Quand la suite vise une
 * application servie AILLEURS (`NF_E2E_BASE_URL` — derrière son frontal, sur une
 * recette), elles ne mesurent plus la cible : elles mesurent le poste qui teste.
 *
 * Un test qui change d'objet sans le dire est pire qu'un test absent — il rend
 * un verdict sur autre chose que ce qu'on croit lire. On les saute donc, et la
 * raison s'affiche : un saut muet se lit comme un vert.
 */
const EXTERNAL_TARGET = Boolean(process.env.NF_E2E_BASE_URL);
/**
 * Le `describe` de ces suites — sauté quand la cible est externe.
 *
 * Court à dessein : `describe.skipIf(…)("titre…", …)` dépasse la largeur du
 * formateur, qui casse alors l'appel et ré-indente TOUT le corps. Un alias
 * garde le fichier lisible en diff.
 */
const dbSuite = EXTERNAL_TARGET ? describe.skip : describe;
if (EXTERNAL_TARGET) {
  process.stdout.write(
    "migrations : SAUTÉES — `NF_E2E_BASE_URL` vise une application externe, " +
      "et ces épreuves portent sur la base locale de cette machine.\n",
  );
}

const run = promisify(execFile);
const bin = nodefonyBin();

/**
 * Les migrations de CETTE application, éprouvées là où elles tourneront.
 *
 * ## Pourquoi cette suite existe
 *
 * Le framework éprouve ses migrations dans son propre dépôt, avec son décor,
 * ses variables et ses conteneurs. Mais l'endroit où elles tournent vraiment,
 * c'est ICI — une application installée, avec ses entités, sa configuration et
 * son environnement. Une chaîne de migration qui marche chez le framework et
 * casse chez vous revient au même que ne rien avoir livré.
 *
 * Ce qui est vérifié tient en une phrase : **le schéma est en place, la
 * commande le dit, et l'application sert**. Chacun de ces trois faits a déjà
 * été faux séparément pendant que les deux autres étaient vrais.
 *
 * ## Ce que ces cas vous donnent
 *
 * Le code de sortie de `orm:migrate:status` est votre **barrière de
 * déploiement** : `0` quand la base est à jour, `1` quand elle est en retard.
 * Un travail d'intégration continue s'arrête dessus, et cette suite prouve que
 * les deux valeurs arrivent — un code de sortie qui ne distinguerait rien
 * laisserait passer un déploiement sur une base non migrée.
 *
 * ## Comment l'étendre
 *
 * Ajoutez vos propres cas ici quand une migration porte une transformation de
 * données : c'est le seul endroit où vous pouvez vérifier que la donnée est
 * arrivée telle que vous l'attendiez, sur la base réelle.
 */

/** Résultat d'un appel à la ligne de commande. */
interface IRun {
  code: number;
  stdout: string;
  stderr: string;
}

/**
 * Lance une commande de l'application et rend ce que le PROCESSUS a produit.
 *
 * Le code de sortie se lit sur le processus, jamais sur une valeur de retour :
 * c'est exactement là qu'il se perd, et c'est lui qui part dans votre chaîne de
 * déploiement.
 *
 * @param args - arguments de la commande.
 * @param env - variables à ajouter à l'environnement.
 * @returns le code de sortie et les deux flux.
 */
async function cli(args: string[], env: NodeJS.ProcessEnv = {}): Promise<IRun> {
  try {
    const { stdout, stderr } = await run(process.execPath, [bin, ...args], {
      env: {
        ...process.env,
        NODE_ENV: "production",
        // La base de la SUITE, jamais celle du développement. Sans cette
        // ligne, la commande inspecte une base que le décor n'a pas migrée et
        // rend « en retard » — un verdict juste, sur la mauvaise base.
        NF_DATABASE_URL: E2E_BASE_URL,
        ...env,
      },
      maxBuffer: 16 * 1024 * 1024,
    });
    return { code: 0, stdout, stderr };
  } catch (e) {
    const err = e as { code?: number; stdout?: string; stderr?: string };
    return {
      code: typeof err.code === "number" ? err.code : -1,
      stdout: err.stdout ?? "",
      stderr: err.stderr ?? "",
    };
  }
}

/**
 * Lit l'objet JSON d'une sortie standard.
 *
 * La sortie ENTIÈRE doit se parser : c'est ce que veut dire « flux pur ». Aller
 * chercher « la ligne qui ressemble à du JSON » reviendrait à accepter la
 * pollution que l'on prétend interdire, et votre `| jq` casserait quand même.
 *
 * @param stdout - sortie standard de la commande.
 * @returns l'objet rendu.
 */
function json(stdout: string): Record<string, unknown> {
  return JSON.parse(stdout.trim()) as Record<string, unknown>;
}

/**
 * Une base jetable VIERGE, prête à recevoir des migrations.
 *
 * Un fichier neuf par appel : rien à nettoyer, rien à partager.
 *
 * @param dir - dossier de travail du cas appelant.
 * @returns l'URL de la base.
 */
function freshDatabase(dir: string): string {
  return `sqlite:${path.join(dir, "base.db")}`;
}

/** Base jetable, pour éprouver le cas « en retard » sans toucher à celle des tests. */
let spareDatabase: { dir: string; url: string };

beforeAll(() => {
  const dir = mkdtempSync(path.join(os.tmpdir(), "e2e-migrations-"));
  spareDatabase = { dir, url: freshDatabase(dir) };
});

afterAll(() => {
  rmSync(spareDatabase.dir, { recursive: true, force: true });
});

dbSuite("migrations — la base de cette application", () => {
  it("est à jour : `orm:migrate:status` rend 0 et le dit", async () => {
    // Le décor de la suite (`tests/e2e.setup.ts`) a appliqué les migrations
    // avant de démarrer, comme le ferait un orchestrateur avant de lancer vos
    // exemplaires. On vérifie ici que la commande le CONSTATE.
    const r = await cli(["orm:migrate:status", "--json"]);
    assert.equal(r.code, 0, r.stderr.slice(-800));

    const doc = json(r.stdout);
    assert.equal(doc.verdict, "up-to-date");
    assert.equal(
      doc.formatVersion,
      1,
      "la sortie machine doit annoncer sa version de format",
    );
  });

  it("le flux `--json` est PUR — un `| jq` ne casse sur aucune ligne", async () => {
    // Le journal du démarrage part sur la sortie d'erreur. S'il se déversait
    // sur la sortie standard, votre traitement casserait sur la première ligne
    // et vous conclueriez à une panne de la commande.
    const r = await cli(["orm:migrate:status", "--json"]);
    assert.doesNotThrow(() => json(r.stdout));
  });

  it("rejouer `orm:migrate` n'applique rien et reste à 0", async () => {
    // L'idempotence est ce qui rend la commande sûre dans un déploiement : elle
    // peut être lancée par plusieurs exemplaires, ou relancée après un incident.
    const r = await cli(["orm:migrate", "--json"]);
    assert.equal(r.code, 0, r.stderr.slice(-800));
    assert.equal(json(r.stdout).verdict, "up-to-date");
  });

  it("`--dry-run` n'écrit rien et laisse la base à jour", async () => {
    const attempt = await cli(["orm:migrate", "--dry-run", "--json"]);
    assert.equal(attempt.code, 0, attempt.stderr.slice(-800));

    const after = await cli(["orm:migrate:status", "--json"]);
    assert.equal(json(after.stdout).verdict, "up-to-date");
  });

  it("🔴 sur une base VIERGE, le statut rend 1 — votre barrière de déploiement", async () => {
    // C'est le cas qui protège la production : une base en retard doit ARRÊTER
    // un déploiement. Un code de sortie qui ne distinguerait pas « à jour » de
    // « en retard » laisserait passer une mise en service sur un schéma absent.
    const behind = await cli(["orm:migrate:status", "--json"], {
      NF_DATABASE_URL: spareDatabase.url,
    });
    assert.equal(
      behind.code,
      1,
      `une base vierge doit exiger une action :\n${behind.stdout}`,
    );
    assert.notEqual(json(behind.stdout).verdict, "up-to-date");

    // Puis la même base, migrée, redevient verte : le cycle complet, sur une
    // base que cette suite a créée elle-même.
    const migrate = await cli(["orm:migrate", "--json"], {
      NF_DATABASE_URL: spareDatabase.url,
    });
    assert.equal(migrate.code, 0, migrate.stderr.slice(-800));

    const after = await cli(["orm:migrate:status", "--json"], {
      NF_DATABASE_URL: spareDatabase.url,
    });
    assert.equal(after.code, 0);
    assert.equal(json(after.stdout).verdict, "up-to-date");
  });

  it("🔴 `orm:reset` est REFUSÉ hors développement, et dit quoi faire", async () => {
    // La commande qui vide une base ne doit jamais s'exécuter ailleurs qu'en
    // développement, et le refus doit être utilisable : une phrase, et un geste.
    const r = await cli(["orm:reset", "--yes", "--json"]);
    assert.notEqual(
      r.code,
      0,
      "un effacement ne doit PAS réussir en production",
    );

    const doc = json(r.stdout);
    const error = (doc.error ?? {}) as Record<string, unknown>;
    assert.ok(
      typeof error.code === "string" && error.code.length > 0,
      "un refus doit rester un verdict structuré, pas un crash",
    );
    const steps = (error.nextActions ?? []) as { command?: string }[];
    assert.ok(
      steps.some((g) => typeof g.command === "string" && g.command.length > 0),
      "un refus doit proposer au moins un geste",
    );
  });

  it("🔴 le schéma en place, l'application SERT vraiment", async () => {
    // Les trois faits qui vont ensemble : la base est migrée, la commande le
    // dit, et le serveur répond. Le dernier est celui qu'on oublie de vérifier —
    // une application peut très bien porter toutes ses tables et rendre 500 sur
    // chacune de ses routes.
    const port = runningAppPort();
    const res = await fetch(`http://127.0.0.1:${port}/`);
    assert.ok(
      res.status < 500,
      `l'application rend ${res.status} : le schéma est en place mais elle ne sert pas`,
    );
  });
});

/**
 * Un port LIBRE, demandé au système.
 *
 * L'application de la suite tient déjà le sien ; un exemplaire jetable doit en
 * prendre un autre, et un port écrit en dur finit toujours par tomber sur le
 * décor de quelqu'un d'autre.
 */
async function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      server.close(() =>
        port > 0 ? resolve(port) : reject(new Error("aucun port libre")),
      );
    });
  });
}

/**
 * Cite un identifiant pour le moteur visé.
 *
 * MySQL cite à l'accent grave, les deux autres au guillemet droit. Écrire une
 * seule des deux formes rendrait ce fichier juste sur votre machine et faux
 * chez celui qui déploie sur l'autre moteur.
 *
 * @param dialect - moteur, tel que la commande l'annonce (`driver.dialect`).
 * @param name - identifiant à citer.
 * @returns l'identifiant cité.
 */
function quote(dialect: string, name: string): string {
  return dialect === "mysql" ? `\`${name}\`` : `"${name}"`;
}

/** Le moteur de CETTE application, tel que la commande l'annonce. */
async function currentDialect(): Promise<string> {
  const r = await cli(["orm:migrate:status", "--json"]);
  const driver = json(r.stdout).driver as { dialect?: string } | undefined;
  assert.ok(driver?.dialect, "la commande n'annonce pas son moteur");
  return driver.dialect;
}

/**
 * Un dossier de migrations JETABLE, et la base qui va avec.
 *
 * Rien n'est écrit dans le dossier `migrations/` de l'application : il est
 * versionné, et un cas de test qui y dépose un fichier laisse derrière lui une
 * migration que quelqu'un finira par appliquer en production.
 *
 * @param withExisting - partir des migrations déjà écrites (défaut), ou d'un
 *   dossier vide pour voir ce que la génération produit SEULE.
 * @returns le dossier, l'URL de la base jetable, et l'environnement à passer.
 */
function spareFixture(withExisting = true): {
  dir: string;
  migrations: string;
  env: NodeJS.ProcessEnv;
} {
  const dir = mkdtempSync(path.join(os.tmpdir(), "e2e-migr-"));
  const migrations = path.join(dir, "migrations");
  if (withExisting) {
    cpSync(path.resolve("migrations"), migrations, { recursive: true });
  } else {
    mkdirSync(migrations, { recursive: true });
  }
  return {
    dir,
    migrations,
    env: {
      NF_DATABASE_URL: freshDatabase(dir),
      NF__DRIZZLE__MIGRATIONS__DIR: migrations,
    },
  };
}

dbSuite("migrations — générer, retenir le trafic, constater une dérive", () => {
  it("🔴 `orm:generate` écrit les migrations des entités de CETTE application", async () => {
    // Le geste du développeur juste après avoir créé une entité. Ce qu'il
    // produit est vérifié sur le MOTEUR de cette application — pas sur SQLite
    // par commodité : c'est la configuration qui décide du dialecte, et le SQL
    // d'un `CREATE TABLE` n'est pas le même d'un moteur à l'autre.
    const fixture = spareFixture(false);
    try {
      const engine = await currentDialect();
      const gen = await cli(
        ["orm:generate", "--name", "schema_de_lapplication", "--json"],
        fixture.env,
      );
      assert.equal(gen.code, 0, gen.stderr.slice(-800));

      const report = json(gen.stdout);
      assert.equal(
        report.generated,
        true,
        "aucune migration écrite : les entités de l'application ne sont pas vues",
      );
      assert.equal(
        (report.driver as { dialect?: string }).dialect,
        engine,
        "la migration est écrite pour un AUTRE moteur que celui configuré",
      );

      // Le fichier existe, et il CRÉE quelque chose. Un rapport qui annonce une
      // migration vide passerait l'assertion précédente sans rien avoir écrit.
      const files = report.files as string[];
      assert.ok(files.length > 0, "le rapport n'annonce aucun fichier");
      const sql = readFileSync(
        path.join(fixture.migrations, engine, `${String(report.tag)}.sql`),
        "utf8",
      );
      assert.match(sql, /CREATE TABLE/i);

      // …et ce qui est écrit S'APPLIQUE : une migration qu'on n'a jamais fait
      // tourner n'est qu'un fichier. Le framework passe d'abord (ses tables
      // sont celles auxquelles les vôtres se réfèrent), puis celle-ci.
      const apply = await cli(["orm:migrate", "--json"], fixture.env);
      assert.equal(apply.code, 0, apply.stderr.slice(-800));
      assert.equal(json(apply.stdout).verdict, "up-to-date");
    } finally {
      rmSync(fixture.dir, { recursive: true, force: true });
    }
  }, 180_000);

  it("🔴 la migration de l'application MANQUE — le produit NOMME les tables, et retient", async () => {
    // Le geste qu'on oublie : générer la migration après avoir créé une entité,
    // ou la commiter. Le schéma du framework se pose alors normalement, les
    // commandes disent « à jour » sur ce qu'elles connaissent… et l'application
    // rend 500 sur chacune de ses routes d'entités.
    //
    // Ce que ce cas exige, c'est que le produit le dise AVANT : les tables
    // absentes sont nommées, et l'exemplaire ne se déclare pas prêt.
    const fixture = spareFixture(false);
    try {
      // Les migrations du framework s'appliquent — elles, elles sont là. C'est
      // le schéma de VOS entités qui manque.
      const apply = await cli(["orm:migrate", "--json"], fixture.env);
      const doc = json(apply.stdout);
      assert.equal(
        doc.verdict,
        "divergent",
        "un schéma applicatif absent est passé pour « à jour »",
      );

      const gap = doc.divergence as { missingTables: string[] } | undefined;
      assert.ok(
        gap && gap.missingTables.length > 0,
        "les tables absentes ne sont pas nommées : il faudrait ouvrir un client SQL",
      );

      // 🔴 Le code de sortie MORD. C'est votre barrière de déploiement — sans
      // elle, la mise en service passerait, et le 500 arriverait chez
      // l'utilisateur au lieu d'ici.
      assert.equal(
        apply.code,
        1,
        `un schéma applicatif absent a laissé passer un déploiement :\n${doc.summary as string}`,
      );

      // …et le geste proposé est celui qui MARCHE : le générateur sait écrire
      // ce que le code déclare.
      const steps = (doc.nextActions as { command: string }[]).map(
        (a) => a.command,
      );
      assert.ok(
        steps.some((g) => g.includes("orm:generate")),
        `aucun geste ne mène au schéma manquant : ${JSON.stringify(steps)}`,
      );
    } finally {
      rmSync(fixture.dir, { recursive: true, force: true });
    }
  }, 180_000);

  it("🔴 un schéma en RETARD retient la mise en service — /readyz 503, /livez 200", async () => {
    // La barrière que voit votre orchestrateur. Elle ne peut s'observer que sur
    // un exemplaire qui DÉMARRE dans cet état : celui de la suite a démarré sur
    // une base migrée, et c'est ce qu'on veut pour tous les autres cas.
    //
    // La distinction entre les deux sondes est le cœur du mécanisme : un schéma
    // en retard est un état EXTERNE, redémarrer le processus ne le répare pas.
    // Un `/livez` qui tomberait provoquerait une cascade de redémarrages
    // inutiles, et le pod n'en sortirait jamais.
    const fixture = spareFixture();
    // Relevé AVANT : un second exemplaire écrase l'état d'exécution du projet,
    // et c'est ce que `stop()` s'engage à rendre. Sans ce contrôle, la panne
    // n'apparaîtrait pas ici mais dans le cas SUIVANT, qui accuserait une route
    // n'ayant rien fait.
    const suitePort = runningAppPort();
    const spare = await startSpareApp({
      port: await freePort(),
      httpsPort: await freePort(),
      env: {
        NODE_ENV: "production",
        // Il SERT en production : sans clé de signature partagée, il refuserait
        // de démarrer (jwt.keystore). Seul sur ce poste — la source « dossier ».
        NF__SECURITY__JWT__KEYSTORE__DIR: "var/keys",
        ...fixture.env,
      },
    });
    try {
      const readyz = await fetch(`http://127.0.0.1:${spare.port}/readyz`);
      assert.equal(
        readyz.status,
        503,
        "un exemplaire dont le schéma est en retard s'est déclaré PRÊT",
      );

      const livez = await fetch(`http://127.0.0.1:${spare.port}/livez`);
      assert.equal(
        livez.status,
        200,
        "le processus se déclare MALADE — un redémarrage ne réparera pas un schéma",
      );

      // 🔴 « et le DIT » : la rétention nomme sa cause et donne le geste. Un 503
      // muet enverrait chercher la panne dans le réseau, le proxy ou l'image.
      const says = spare.output();
      assert.match(says, /migrations? à appliquer/u);
      assert.match(says, /nodefony orm:migrate/u);
    } finally {
      await spare.stop();
      rmSync(fixture.dir, { recursive: true, force: true });
    }

    assert.equal(
      runningAppPort(),
      suitePort,
      "l'exemplaire jetable a emporté l'état d'exécution de l'application",
    );
  }, 180_000);

  it("🔴 une base modifiée HORS migration est vue `divergent`, et l'écart est NOMMÉ", async () => {
    // La troisième source de vérité. Les deux premières — les fichiers et
    // l'historique — s'accordent à dire « tout est appliqué » ; la base, elle,
    // ne correspond plus au code. C'est l'incident qu'aucun outil de migration
    // ne rend en continu, et il arrive banalement : un correctif d'urgence
    // passé à la main, deux environnements qui ont divergé.
    //
    // On le provoque par le seul canal que possède une application : une
    // migration LIBRE, celle que `--custom` sert à écrire.
    const fixture = spareFixture();
    try {
      const engine = await currentDialect();
      const gen = await cli(
        ["orm:generate", "--custom", "--name", "retrait_a_la_main", "--json"],
        fixture.env,
      );
      assert.equal(gen.code, 0, gen.stderr.slice(-800));
      const file = path.join(
        fixture.migrations,
        engine,
        `${String(json(gen.stdout).tag)}.sql`,
      );
      appendFileSync(
        file,
        `ALTER TABLE ${quote(engine, "audit_event")} ` +
          `DROP COLUMN ${quote(engine, "metadata")};\n`,
        "utf8",
      );

      // Premier fait : elle est REFUSÉE tant que personne ne l'assume. Une
      // suppression de colonne ne se rattrape que par une restauration de la
      // base — c'est-à-dire une interruption de service et une décision.
      const refusal = await cli(["orm:migrate", "--json"], fixture.env);
      assert.equal(
        refusal.code,
        1,
        "une migration destructive est passée seule",
      );
      const error = (json(refusal.stdout).error ?? {}) as {
        code?: string;
        nextActions?: { command?: string }[];
      };
      assert.equal(error.code, "NF_MIGRATE_DESTRUCTIVE");
      assert.ok(
        (error.nextActions ?? []).some((a) =>
          a.command?.includes("--allow-destructive"),
        ),
        "le refus ne donne pas la commande qui l'assume",
      );

      // Assumée, elle passe — le garde informe, il n'interdit pas.
      const adopt = await cli(
        ["orm:migrate", "--allow-destructive", "--json"],
        fixture.env,
      );
      assert.equal(adopt.code, 0, adopt.stderr.slice(-800));

      // Second fait, celui qui compte : le verdict n'est PAS « à jour ». La
      // colonne retirée est toujours déclarée par le code, donc la base s'écarte
      // vraiment de lui — et le produit le SAIT.
      const status = await cli(["orm:migrate:status", "--json"], fixture.env);
      const doc = json(status.stdout);
      assert.equal(doc.verdict, "divergent");

      // 🔴 Le verdict dit qu'il y a un écart ; la charge utile doit dire LEQUEL.
      // Sans elle, on ouvre un client SQL et on compare table par table, sur une
      // base de production, au pire moment — pour une réponse déjà calculée.
      const gap = doc.divergence as
        | {
            additive: { table: string; column: string }[];
            blocking: { table: string; column: string }[];
            missingTables: string[];
          }
        | undefined;
      assert.ok(gap, "`divergence` absente du verdict `divergent`");
      assert.ok(
        [...gap.additive, ...gap.blocking].some(
          (g) => g.table === "audit_event" && g.column === "metadata",
        ),
        `la colonne retirée n'est pas nommée : ${JSON.stringify(gap)}`,
      );
      assert.match(String(doc.summary), /audit_event\.metadata/u);
    } finally {
      rmSync(fixture.dir, { recursive: true, force: true });
    }
  }, 240_000);
});
