import { existsSync, readdirSync } from "node:fs";
import { defineConfig } from "vitest/config";

/**
 * Dit, à la fin d'un run, ce que ce run n'a PAS exercé.
 *
 * Sortir les e2e du glob évite un rapport « skipped » qui ferait croire qu'ils
 * ont prouvé quelque chose — mais un rapport tout vert fait croire, tout autant,
 * qu'il n'y avait rien d'autre à lancer. C'est arrivé, et ça a coûté cher : des
 * tests e2e justes, écrits pour une route cassée, laissés dans le fichier que
 * `npm test` exclut ; `npm test` vert ; « les tests passent » ; la route rendait
 * 500 et ne répondait jamais.
 *
 * Le rappel s'affiche donc là où la personne — ou l'agent — regarde déjà : la
 * sortie de la commande qu'elle vient de lancer. Il n'échoue pas : `npm test`
 * doit rester le geste rapide. Il énonce.
 */
const direCeQuiNaPasTourné = {
  // `onTestRunEnd` — et NON `onFinished`, qui subsiste dans les types de
  // vitest 4 sans plus jamais être appelé : le rappel serait resté muet en
  // passant le typecheck.
  onTestRunEnd() {
    if (!existsSync("tests")) {
      return;
    }
    // Filtrer sur le NOM, jamais sur le chemin : `recursive` rend des chemins au
    // séparateur natif, et un motif écrit en `/` ne mordrait pas sous Windows.
    const nonExercés = readdirSync("tests", {
      withFileTypes: true,
      recursive: true,
    })
      .filter((e) => e.isFile() && /(^|\.)e2e\.test\.ts$/.test(e.name))
      .map((e) => e.name)
      // `toSorted` et non `sort` : le lint de l'application refuse les
      // avertissements (`--deny-warnings`), et une app fraîche doit passer ses
      // propres portes dès la première minute.
      .toSorted();
    if (nonExercés.length === 0) {
      return;
    }
    console.log(
      `\n⚠  npm test n'exécute PAS les tests de bout en bout — ` +
        `${nonExercés.length} fichier(s) non exercé(s) :\n` +
        `   ${nonExercés.join(", ")}\n` +
        `   → npm run test:e2e   (build, puis boot RÉEL de l'app)\n` +
        `   Ce run ne dit donc rien de ce que ces fichiers vérifient.\n`,
    );
  },
};

/**
 * Config Vitest de l'app.
 *
 * ⚠️ Le bloc `oxc` est OBLIGATOIRE : Vitest transforme les tests via oxc/rolldown,
 * qui ne lit PAS le `experimentalDecorators` du tsconfig. Sans lui, les décorateurs
 * (@controller, @route, DI) sortiraient bruts et Node lèverait `SyntaxError` au
 * chargement. `emitDecoratorMetadata` est requis par l'injection de dépendances
 * (résolution des types constructeur via `design:paramtypes`).
 *
 * Deux suites, deux configs :
 *   npm test          → tests unitaires (rapides, zéro serveur) — CETTE config
 *   npm run test:e2e  → build + boot RÉEL de l'app + HTTP/WS (vitest.e2e.config.ts)
 *
 * Les e2e sont SORTIS du glob par défaut, pas « skippés » : un rapport qui
 * affiche des tests skipped et sort vert fait croire qu'ils ont prouvé quelque
 * chose. Ici `npm test` ne montre QUE ce qu'il a réellement exécuté — et le
 * rappelle en fin de run, plutôt que de laisser son vert parler pour les suites
 * qu'il n'a pas lancées (cf {@link direCeQuiNaPasTourné}).
 */
export default defineConfig({
  test: {
    reporters: ["default", direCeQuiNaPasTourné],
    include: ["tests/**/*.test.ts"],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "tests/e2e.test.ts",
      // Tout fichier `*.e2e.test.ts` — `create entity` en ajoute un par
      // ressource. Sans cette ligne, `npm test` les lancerait sans serveur et
      // échouerait sur des `fetch` refusés, pour une raison sans rapport avec
      // le code testé.
      "tests/**/*.e2e.test.ts",
    ],
  },
  oxc: {
    decorator: { legacy: true, emitDecoratorMetadata: true },
  },
});
