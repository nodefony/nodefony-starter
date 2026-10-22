/*
 * Accent React — sa couleur et l'animation de son logo.
 *
 * La mise en page et la palette de la démonstration vivent dans
 * `showcase.css`, PARTAGÉE par les trois vitrines : seules ces variables
 * changent d'un framework à l'autre.
 *
 * Pourquoi un fichier CSS et non le bloc de styles du composant : Angular
 * renomme les `@keyframes` déclarés dans `styles: [...]` (encapsulation de
 * vue) — l'animation nommée par la variable ne serait alors plus trouvée.
 * Les trois vitrines utilisent donc le même mécanisme, un import CSS que
 * Vite injecte globalement.
 */

:root {
  --nf-accent: #149eca;
  /* Encre : la MÊME teinte, assez foncée pour être lue SUR le lavis.
     La couleur de marque ne se négocie pas ; sa luminosité, si — écrire
     `--nf-accent` sur `--nf-accent-wash` donnait 2,78:1, sous le seuil AA. */
  --nf-accent-ink: #0b6a8a;
  --nf-accent-glow: rgba(97, 218, 251, 0.35);
  --nf-accent-wash: rgba(97, 218, 251, 0.14);
  --nf-accent-line: rgba(97, 218, 251, 0.35);
  --nf-logo-anim: nf-spin 16s linear infinite;
}
/* 🔴 L'encre du THÈME SOMBRE. La correction d'origine n'avait couvert qu'un
   seul des deux thèmes : sur fond sombre, le lavis devient foncé et cette
   encre-là, choisie pour être lue sur du clair, tombait à 2,21:1 — bien
   plus bas que le 2,78:1 qui avait motivé sa création. Mesuré par `axe-core`
   sur une application générée, pas déduit du CSS.
   Sur un fond sombre il faut une encre CLAIRE : #29a7cf → 4,84:1. */
@media (prefers-color-scheme: dark) {
  :root {
    --nf-accent-ink: #29a7cf;
  }
}
@keyframes nf-spin {
  to {
    transform: rotate(360deg);
  }
}
