<#--
  Enveloppe HTML de TOUS les courriels Keycloak (vérification d'adresse, mot de
  passe oublié, actions requises, événements) aux couleurs de Nodefony.

  Seule l'enveloppe est remplacée : chaque courriel garde son gabarit et ses
  textes Keycloak (`html/<courriel>.ftl`, messages traduits), donc juste à
  chaque mise à jour. Le texte brut (`text/`) n'a pas d'enveloppe.

  Écrit pour les clients de messagerie, pas pour un navigateur :
  - mise en page par TABLEAU et styles EN LIGNE (beaucoup de clients retirent
    `<style>` ou ignorent la grille et les variables CSS) ;
  - image en URL ABSOLUE (`url.resourcesUrl`) : un client de messagerie ne
    résout pas un chemin relatif ;
  - le bloc `<style>` ne porte que le mode sombre, pour les clients qui le lisent.
-->
<#macro emailLayout>
<!DOCTYPE html>
<html lang="${locale.language}" dir="${(ltr)?then('ltr','rtl')}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${realmName!""}</title>
<style>
  .nf-content a { color: #0067ba; }
  @media (prefers-color-scheme: dark) {
    .nf-page { background: #1a1b1e !important; }
    .nf-card, .nf-head { background: #242424 !important; border-color: #424242 !important; }
    .nf-head { border-bottom-color: #4792cd !important; }
    .nf-brand { color: #ffffff !important; }
    .nf-content { color: #c9c9c9 !important; }
    .nf-content a { color: #74b3e3 !important; }
    .nf-footer { color: #8f8f8f !important; }
  }
</style>
</head>
<#-- Le fond se pose AUSSI sur le corps : sans lui, une boîte en sombre peint
     sous l'enveloppe le fond par défaut de son moteur, d'une autre teinte. -->
<body class="nf-page" style="margin:0;padding:0;background:#f1f3f5;">
<table role="presentation" class="nf-page" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f1f3f5;">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" class="nf-card" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#ffffff;border:1px solid #dee2e6;border-radius:8px;">
        <tr>
          <td class="nf-head" style="background:#ffffff;border-bottom:3px solid #0067ba;border-radius:8px 8px 0 0;padding:20px 32px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="vertical-align:middle;padding-right:12px;">
                  <img src="${url.resourcesUrl}/img/logo.png" width="25" height="40" alt="" style="display:block;border:0;">
                </td>
                <td class="nf-brand" style="vertical-align:middle;font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;font-size:18px;font-weight:600;color:#212529;">
                  ${realmName!"Nodefony"}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td class="nf-content" style="padding:28px 32px;font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;font-size:15px;line-height:1.6;color:#343a40;">
            <#nested>
          </td>
        </tr>
      </table>
      <p class="nf-footer" style="max-width:560px;margin:16px auto 0;font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;font-size:12px;line-height:1.5;color:#5c636a;">
        ${msg("nfEmailFooter", realmName!"")}
      </p>
    </td>
  </tr>
</table>
</body>
</html>
</#macro>
