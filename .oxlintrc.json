{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["typescript", "unicorn", "oxc", "promise", "import"],
  // Lint TYPÉ (paquet `oxlint-tsgolint`, en devDependency) : ces règles lisent
  // les types du compilateur, là où les autres ne voient que la syntaxe. C'est
  // la même rigueur que le framework s'impose à lui-même — un test du
  // framework compare les deux grilles.
  "options": {
    "typeAware": true,
    "reportUnusedDisableDirectives": "warn"
  },
  "categories": {
    "correctness": "error",
    "suspicious": "warn",
    "perf": "warn"
  },
  "env": { "node": true, "es2024": true },
  "ignorePatterns": ["node_modules/**", "dist/**", "var/**", "*.log"],
  "rules": {
    "no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrors": "none"
      }
    ],
    "no-restricted-imports": [
      "error",
      {
        "paths": [
          {
            "name": "assert",
            "message": "Préfixe Node obligatoire : importe \"node:assert\"."
          },
          {
            "name": "buffer",
            "message": "Préfixe Node obligatoire : importe \"node:buffer\"."
          },
          {
            "name": "child_process",
            "message": "Préfixe Node obligatoire : importe \"node:child_process\"."
          },
          {
            "name": "crypto",
            "message": "Préfixe Node obligatoire : importe \"node:crypto\"."
          },
          {
            "name": "events",
            "message": "Préfixe Node obligatoire : importe \"node:events\"."
          },
          {
            "name": "fs",
            "message": "Préfixe Node obligatoire : importe \"node:fs\"."
          },
          {
            "name": "fs/promises",
            "message": "Préfixe Node obligatoire : importe \"node:fs/promises\"."
          },
          {
            "name": "http",
            "message": "Préfixe Node obligatoire : importe \"node:http\"."
          },
          {
            "name": "http2",
            "message": "Préfixe Node obligatoire : importe \"node:http2\"."
          },
          {
            "name": "https",
            "message": "Préfixe Node obligatoire : importe \"node:https\"."
          },
          {
            "name": "net",
            "message": "Préfixe Node obligatoire : importe \"node:net\"."
          },
          {
            "name": "os",
            "message": "Préfixe Node obligatoire : importe \"node:os\"."
          },
          {
            "name": "path",
            "message": "Préfixe Node obligatoire : importe \"node:path\"."
          },
          {
            "name": "process",
            "message": "Préfixe Node obligatoire : importe \"node:process\"."
          },
          {
            "name": "stream",
            "message": "Préfixe Node obligatoire : importe \"node:stream\"."
          },
          {
            "name": "timers",
            "message": "Préfixe Node obligatoire : importe \"node:timers\"."
          },
          {
            "name": "url",
            "message": "Préfixe Node obligatoire : importe \"node:url\"."
          },
          {
            "name": "util",
            "message": "Préfixe Node obligatoire : importe \"node:util\"."
          },
          {
            "name": "worker_threads",
            "message": "Préfixe Node obligatoire : importe \"node:worker_threads\"."
          }
        ]
      }
    ],
    // Une feuille de style s'importe POUR SON EFFET, sans rien affecter : c'est
    // la seule forme qu'un bundler accepte. La règle reste utile ailleurs (un
    // module importé pour effet de bord et oublié), d'où l'exception ciblée
    // plutôt que l'extinction.
    "import/no-unassigned-import": [
      "warn",
      { "allow": ["**/*.css", "**/*.scss", "**/*.sass", "**/*.less"] }
    ],
    "typescript/no-explicit-any": "warn",
    "typescript/ban-ts-comment": "warn",
    // ESM strict : une application Nodefony n'écrit jamais `require`.
    "typescript/no-require-imports": "warn",
    // Préréglage `strict-type-checked` de typescript-eslint : un `any` ne se
    // propage pas en silence — le lire, l'appeler, l'affecter ou le rendre
    // exige de l'avoir d'abord rétréci. Et `x!` affirme au compilateur une
    // absence de `null` qu'il ne peut pas vérifier.
    "typescript/no-unsafe-assignment": "warn",
    "typescript/no-unsafe-member-access": "warn",
    "typescript/no-unsafe-argument": "warn",
    "typescript/no-unsafe-return": "warn",
    "typescript/no-unsafe-call": "warn",
    "typescript/no-unnecessary-type-assertion": "warn",
    "typescript/no-non-null-assertion": "warn",
    // Les règles qui attrapent des DÉFAUTS : promesse lancée sans être
    // attendue ni gardée, callback async passé là où l'on attend du
    // synchrone, `return` sans `await` dans un `try` qui saute le `catch`,
    // rejet ou throw d'autre chose qu'une `Error`, `case` oublié quand une
    // union grandit.
    "typescript/no-misused-promises": "error",
    "typescript/return-await": "error",
    "typescript/prefer-promise-reject-errors": "error",
    "typescript/only-throw-error": "error",
    "typescript/use-unknown-in-catch-callback-variable": "error",
    "typescript/no-deprecated": "error",
    "typescript/consistent-type-exports": "error",
    "typescript/restrict-plus-operands": "error",
    "typescript/switch-exhaustiveness-check": "error",
    // `a && a.b` → `a?.b`. Le correctif automatique n'est pas sûr hors
    // condition : `a && a.b` rend `a` (`""`, `0`, `null`), `a?.b` rend `undefined`.
    "typescript/prefer-optional-chain": "error",
    // `??` sur un objet ou un tableau. Primitifs exclus : sur une chaîne, un
    // nombre ou un booléen, `||` est souvent voulu (une variable
    // d'environnement vide vaut « absente », `a || b` entre booléens est un OU).
    "typescript/prefer-nullish-coalescing": [
      "error",
      {
        "ignorePrimitives": {
          "string": true,
          "number": true,
          "boolean": true,
          "bigint": true
        }
      }
    ],
    // Une expression `void` là où l'on attend une valeur : une fonction au type
    // de retour inféré qui mêle une valeur et un `return fnVoid()` fait voir
    // `X | void` à l'appelant. Les flèches courtes `() => fnVoid()` et les
    // `return resolve(x)` d'une fonction `void` sont lisibles, donc exemptés.
    "typescript/no-confusing-void-expression": [
      "error",
      { "ignoreArrowShorthand": true, "ignoreVoidReturningFunctions": true }
    ],
    // `describe`/`it`/`test` de `node:test` rendent une promesse que le runner
    // suit lui-même : déclarés sûrs ici, une fois.
    "typescript/no-floating-promises": [
      "error",
      {
        "allowForKnownSafeCalls": [
          {
            "from": "package",
            "package": "node:test",
            "name": ["describe", "it", "test", "suite"]
          }
        ]
      }
    ],
    // Une garde que le type déclare inutile (#498). Chaque site se JUGE : une
    // donnée venue du réseau, du disque, d'une config non validée ou d'un
    // appelant JavaScript justifie sa garde — c'est alors le TYPE qu'on rend
    // honnête (`| undefined`, `Partial`, `unknown`), pas la garde qu'on retire.
    // Élargir par `as T | undefined` sur une `const` sans annotation (une
    // annotation se fait rétrécir au type affecté) ; un indexé s'écrit
    // `arr.at(0)`, qui dit le vrai.
    "typescript/no-unnecessary-condition": "error",
    // Chaque règle typée hors catégorie est tranchée. Allumées : chacune dit
    // une intention (champ jamais réaffecté → `readonly`, enum mêlant nombres
    // et chaînes, accesseurs de types divergents).
    "typescript/no-mixed-enums": "error",
    "typescript/related-getter-setter-pairs": "error",
    "typescript/no-unnecessary-qualifier": "error",
    "typescript/prefer-find": "error",
    "typescript/prefer-reduce-type-parameter": "error",
    "typescript/prefer-return-this-type": "error",
    "typescript/prefer-includes": "error",
    "typescript/prefer-string-starts-ends-with": "error",
    "typescript/prefer-readonly": "error",
    // Coupées : `strict-boolean-expressions` refuse `||` sur un primitif (une
    // chaîne vide vaut « absente ») ; `prefer-readonly-parameter-types` bute
    // sur les types mutables de Node ; `promise-function-async` ajoute une
    // microtâche par appel ; `strict-void-return` double
    // `no-confusing-void-expression` ; `non-nullable-type-assertion-style`
    // réclame le `x!` que `no-non-null-assertion` interdit ; `dot-notation`
    // efface le crochet qui marque une clé pouvant manquer ;
    // `prefer-regexp-exec` n'est que du style.
    "typescript/strict-boolean-expressions": "off",
    "typescript/prefer-readonly-parameter-types": "off",
    "typescript/promise-function-async": "off",
    "typescript/strict-void-return": "off",
    "typescript/non-nullable-type-assertion-style": "off",
    "typescript/dot-notation": "off",
    "typescript/prefer-regexp-exec": "off",
    // Allumées par les catégories mais hors du préréglage : `no-unsafe-type-
    // assertion` interdirait tout `as` qui rétrécit, y compris après une
    // validation ; `require-array-sort-compare` refuse un `sort()` de chaînes,
    // correct par défaut.
    "typescript/no-unsafe-type-assertion": "off",
    "typescript/require-array-sort-compare": "off",
    // `async` sans `await` est juste quand la signature promet une `Promise` :
    // une exception du corps devient un rejet. Une promesse oubliée reste
    // signalée par `no-floating-promises`.
    "typescript/require-await": "off",
    "typescript/no-empty-object-type": "off",
    "typescript/no-this-alias": "off",
    "no-eval": "error",
    "no-new-func": "error",
    "no-await-in-loop": "off",
    "no-console": "off",
    "unicorn/no-array-reverse": "off",
    "unicorn/consistent-function-scoping": "off",
    "typescript/no-extraneous-class": "off"
  },
  "overrides": [
    {
      "files": ["**/*.test.ts", "**/*.spec.ts", "tests/**/*.ts"],
      "rules": {
        "typescript/no-explicit-any": "off",
        // Un test garde ce que le type promet pour le PROUVER : la garde y est
        // l'assertion.
        "typescript/no-unnecessary-condition": "off",
        // Un double de test manipule des formes partielles : les propagations
        // d'`any` et les `x!` sur un décor connu y sont admis. Et
        // `expect(mock.fn).toHaveBeenCalled()` référence une méthode sans la
        // lier : l'idiome du runner, pas un `this` perdu.
        "typescript/no-unsafe-assignment": "off",
        "typescript/no-unsafe-member-access": "off",
        "typescript/no-unsafe-argument": "off",
        "typescript/no-unsafe-return": "off",
        "typescript/no-unsafe-call": "off",
        "typescript/no-unnecessary-type-assertion": "off",
        "typescript/no-non-null-assertion": "off",
        "typescript/unbound-method": "off",
        "typescript/no-implied-eval": "off",
        "typescript/no-confusing-void-expression": "off",
        "no-unused-vars": "off",
        "no-unused-expressions": "off",
        "no-restricted-imports": "off",
        "promise/no-callback-in-promise": "off"
      }
    },
    {
      // JavaScript non typé : tout y est `any` par nature, les règles qui
      // suivent la propagation d'un `any` n'y ont aucun sens.
      "files": ["**/*.js", "**/*.mjs", "**/*.cjs"],
      "rules": {
        "typescript/no-unsafe-assignment": "off",
        "typescript/no-unsafe-member-access": "off",
        "typescript/no-unsafe-argument": "off",
        "typescript/no-unsafe-return": "off",
        "typescript/no-unsafe-call": "off",
        "typescript/no-unnecessary-type-assertion": "off",
        // Types INFÉRÉS, jamais déclarés : `process.argv[2]` y est `string`,
        // et la garde qui protège d'un argument absent passerait pour inutile.
        "typescript/no-unnecessary-condition": "off",
        // `readonly` est un mot de TypeScript : JavaScript n'a pas de quoi le poser.
        "typescript/prefer-readonly": "off"
      }
    }
  ]
}
