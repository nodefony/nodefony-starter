# Fins de ligne — LF PARTOUT, y compris dans la copie de travail Windows.
#
# Sans cette règle, git convertit les fichiers texte en CRLF au checkout Windows
# (`core.autocrlf` y vaut `true` par défaut, et sur les runners de forge). Tout
# ce qui compare un fichier à une sortie de générateur échoue alors sur une
# différence invisible à l'œil : `\r\n` contre `\n`. Le message d'erreur, lui,
# parle d'autre chose — d'un fichier « périmé », d'un test qui « ne correspond
# pas » — et envoie chercher là où il n'y a rien.
#
# C'est aussi ce qui garde un diff lisible quand l'équipe mêle Windows, macOS et
# Linux : sans cela, un fichier ouvert sous Windows ressort modifié en entier.
* text=auto eol=lf

# Binaires : jamais convertis, jamais diffés comme du texte.
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.webp binary
*.woff binary
*.woff2 binary
*.ttf binary
*.otf binary
*.pdf binary
*.zip binary
*.gz binary
*.db binary
