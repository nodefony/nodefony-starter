# Politique de sécurité — nodefony

Merci de prendre le temps de signaler un problème de sécurité sur cette application.

## 📮 À REMPLIR — où vous écrire

> **Remplacez ce bloc avant de publier ce dépôt.** Tant qu'il est là, personne ne sait à qui
> signaler une faille — et un rapporteur qui ne trouve pas de canal privé finit par ouvrir une
> issue publique, ce qui est exactement ce qu'on veut éviter.

- **Courriel de sécurité** : `security@exemple.tld` ← _à remplacer_
- **Délai de première réponse** que vous vous engagez à tenir : `72 heures` ← _à ajuster_

## Signaler une faille

**N'ouvrez pas d'issue publique, de discussion ni de demande de fusion pour une faille.** Une issue
est indexée en quelques minutes : la publier, c'est armer tout le monde avant que le correctif
existe.

Écrivez à l'adresse ci-dessus, avec `[SECURITY]` en objet. Si le dépôt est hébergé sur GitHub et
que le signalement privé y est activé (onglet **Security** → _Report a vulnerability_), ce canal
convient aussi — l'échange y reste privé.

Ce qui aide à traiter vite, dans l'ordre :

1. **Ce qu'on obtient** — lecture de données d'autrui, exécution de code, contournement d'un droit.
2. **Comment le reproduire** — la requête exacte, le rôle du compte utilisé, le mode (`development`
   ou `production` : les deux ne rendent pas les mêmes erreurs).
3. **La version** — `npx nodefony --version` et le commit déployé.

Merci de ne pas exfiltrer de données, de ne pas dégrader le service, et de ne rien divulguer avant
qu'un correctif soit disponible.

## Versions couvertes

| Version                     | Correctifs de sécurité |
| --------------------------- | ---------------------- |
| la dernière version publiée | ✅                     |
| les précédentes             | ❌                     |

## Ce qui relève du framework, pas de cette application

Une faille dans Nodefony lui-même (pipeline HTTP, firewall, jetons, temps réel) se signale au
framework : <https://github.com/nodefony/nodefony-core/security>. Dans le doute, écrivez-nous
quand même — nous transmettrons.

## Avant de déployer, les gardes que cette application possède déjà

Elles ne remplacent pas une revue, mais un rapport qui les mentionne fait gagner un aller-retour :

```bash
npx nodefony doctor --live   # configuration, migrations, zones du firewall
npx nodefony env             # d'où vient chaque variable, et lesquelles manquent
npx nodefony inspect config  # la configuration EFFECTIVE, secrets masqués
```
