/*
 * Feuille de style de la page de démonstration — PARTAGÉE par les trois
 * vitrines (React, Vue, Angular).
 *
 * Pourquoi un fichier CSS et non le bloc de styles de chaque framework : la
 * mise en page, la palette et les composants (`.nf-card`, `.nf-hero`…) sont les
 * mêmes dans les trois ; seul l'ACCENT change (la couleur du framework et
 * l'animation de son logo). Tenir trois copies faisait qu'une retouche
 * n'atteignait qu'une vitrine — et les trois avaient déjà commencé à diverger.
 *
 * L'accent se déclare en VARIABLES, posées par la vitrine qui importe ce
 * fichier : `--nf-accent`, `--nf-accent-glow`, `--nf-accent-wash`,
 * `--nf-accent-line`, `--nf-logo-anim` (plus le `@keyframes` qu'elle nomme).
 *
 * C'est TA page : supprime ce fichier et l'import qui le charge dès que la
 * démonstration ne te sert plus.
 */

:root {
  --nf-bg: #f7f9fc;
  --nf-fg: #1a1f26;
  --nf-card: #fff;
  --nf-border: #e2e8f0;
  --nf-dim: #5b6472;
}
@media (prefers-color-scheme: dark) {
  :root {
    --nf-bg: #12161c;
    --nf-fg: #e8ecf1;
    --nf-card: #1a2028;
    --nf-border: #2a3340;
    --nf-dim: #98a2b3;
  }
}

body {
  margin: 0;
}
app-root {
  display: block;
}

.nf-split {
  display: flex;
  min-height: 100vh;
  font-family: system-ui, sans-serif;
  background: var(--nf-bg);
  color: var(--nf-fg);
}
.nf-hero {
  flex: 1.05;
  position: relative;
  overflow: hidden;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 48px;
  box-sizing: border-box;
  background: linear-gradient(140deg, #022c4e 0%, #004d8c 45%, #0067ba 100%);
}
.nf-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(
      circle at 26% 16%,
      rgba(255, 255, 255, 0.16),
      transparent 46%
    ),
    radial-gradient(
      circle at 88% 92%,
      rgba(255, 255, 255, 0.08),
      transparent 42%
    );
}
/* `h2` et non `h1` : le titre de la PAGE est celui du contenu principal, et il
   ne peut y en avoir qu'un. Cette bannière annonce, elle ne titre pas — sa
   taille vient du style, jamais du niveau de titre. */
.nf-hero h2 {
  font-size: clamp(30px, 3.4vw, 42px);
  font-weight: 800;
  line-height: 1.12;
  margin: 0;
}
.nf-hero .nf-sub {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.82);
  margin: 10px 0 0;
}
.nf-feature {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  margin-top: 22px;
}
.nf-ficon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  flex: none;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
.nf-ficon svg {
  width: 22px;
  height: 22px;
  fill: #fff;
  stroke: #fff;
}
.nf-fdesc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.78);
}

.nf-main {
  flex: 1;
  padding: 48px 40px;
  box-sizing: border-box;
  overflow-y: auto;
}
.nf-card {
  background: var(--nf-card);
  border: 1px solid var(--nf-border);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 18px;
}
.nf-card h2 {
  margin: 0 0 10px;
  font-size: 17px;
}
.nf-card pre {
  background: rgba(127, 127, 127, 0.08);
  padding: 10px;
  border-radius: 6px;
  overflow-x: auto;
}
.nf-card input {
  padding: 7px 10px;
  border-radius: 6px;
  border: 1px solid var(--nf-border);
  background: var(--nf-bg);
  color: var(--nf-fg);
  margin-right: 6px;
}
.nf-card button {
  padding: 7px 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background: #0067ba;
  color: #fff;
  font-weight: 600;
}
.nf-card button:hover {
  background: #0a79d6;
}
/* Un lien qui AGIT (aller se connecter) a l'allure du bouton : plus spécifique
   que la règle `a` plus bas, il garde son blanc sur bleu (5,75:1) dans les
   deux thèmes. */
.nf-card a.nf-action {
  display: inline-block;
  padding: 7px 14px;
  border-radius: 6px;
  background: #0067ba;
  color: #fff;
  font-weight: 600;
  text-decoration: none;
}
.nf-card a.nf-action:hover {
  background: #0a79d6;
}
/* Pastille de session : l'état que tient la liaison du front. Le point dit
   ouvert ou non ; le texte le dit aussi, la couleur n'est jamais seule. */
.nf-session {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-right: 8px;
  padding: 4px 12px;
  border-radius: 999px;
  border: 1px solid var(--nf-border);
  font-size: 14px;
}
.nf-session::before {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--nf-dim);
}
.nf-session[data-open]::before {
  background: #2ea043;
}
.nf-dim {
  color: var(--nf-dim);
  font-size: 14px;
}

.nf-fwhead {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}
.nf-fwhead h1 {
  margin: 0;
}
/* Logo et badge du framework — l'accent vient des variables ci-dessus. */
.nf-fwlogo {
  width: 52px;
  height: auto;
  flex: none;
  filter: drop-shadow(0 6px 14px var(--nf-accent-glow));
  animation: var(--nf-logo-anim);
}
/* Le texte prend l'ENCRE, pas la couleur de marque : celle-ci, posée sur son
   propre lavis, tombait à 2,78:1 — sous le seuil AA de 4,5:1. Même teinte,
   luminosité abaissée ; le repli garde la marque si l'encre n'est pas définie. */
.nf-fwbadge {
  display: inline-block;
  margin-top: 4px;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--nf-accent-ink, var(--nf-accent));
  background: var(--nf-accent-wash);
  border: 1px solid var(--nf-accent-line);
}
.nf-hello {
  margin-left: auto;
  padding: 7px 16px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 15px;
  color: #2ea043;
  white-space: nowrap;
  background: rgba(46, 160, 67, 0.12);
  border: 1px solid rgba(46, 160, 67, 0.35);
}

/* Un cran plus foncé que le bleu de lien habituel : sur le gris très clair des
   cartes, celui-ci tombait à 4,21:1 — sous les 4,5:1 exigés pour du texte de
   14 px. Mesuré, pas estimé. */
a {
  color: #0a6ec2;
}
/* 🔴 Et le MÊME lien en thème SOMBRE, où #0a6ec2 tombe à 3,48:1 sur le fond
   #12161c. La correction précédente n'avait regardé que le thème clair : c'est
   la même faute que pour l'encre de la pastille, au même endroit du fichier.
   Un bleu plus clair, mesuré : 4,80:1. */
@media (prefers-color-scheme: dark) {
  a {
    color: #3688cd;
  }
}

@media (max-width: 920px) {
  .nf-split {
    flex-direction: column;
  }
  .nf-hero {
    padding: 32px 24px;
  }
}
