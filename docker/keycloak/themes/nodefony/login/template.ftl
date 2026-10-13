<#import "field.ftl" as field>
<#import "footer.ftl" as loginFooter>
<#import "theme-resources.ftl" as themeResourceTags>
<#macro username>
  <#assign label>
    <#if !realm.loginWithEmailAllowed>${msg("username")}<#elseif !realm.registrationEmailAsUsername>${msg("usernameOrEmail")}<#else>${msg("email")}</#if>
  </#assign>
  <@field.group name="username" label=label>
    <div class="${properties.kcInputGroup}">
      <div class="${properties.kcInputGroupItemClass} ${properties.kcFill}">
        <span class="${properties.kcInputClass} ${properties.kcFormReadOnlyClass}">
          <input id="kc-attempted-username" value="${auth.attemptedUsername}" readonly>
        </span>
      </div>
      <div class="${properties.kcInputGroupItemClass}">
        <button id="reset-login" class="${properties.kcFormPasswordVisibilityButtonClass} kc-login-tooltip" type="button" 
              aria-label="${msg('restartLoginTooltip')}" onclick="location.href='${url.loginRestartFlowUrl}'">
            <i class="fa-sync-alt fas" aria-hidden="true"></i>
            <span class="kc-tooltip-text">${msg("restartLoginTooltip")}</span>
        </button>
      </div>
    </div>
  </@field.group>
</#macro>

<#macro registrationLayout bodyClass="" displayInfo=false displayMessage=true displayRequiredFields=false>
<!DOCTYPE html>
<#-- NODEFONY : `data-theme` dit à login.css le thème que KEYCLOAK a choisi — le
     domaine peut refuser le sombre (`darkMode`), et la feuille partagée ne doit
     jamais suivre le système contre lui. -->
<html class="${properties.kcHtmlClass!}"<#if !darkMode> data-theme="light"</#if> lang="${lang}"<#if realm.internationalizationEnabled> dir="${(locale.rtl)?then('rtl','ltr')}"</#if>>

<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="color-scheme" content="light${darkMode?then(' dark', '')}">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <#if properties.meta?has_content>
        <#list properties.meta?split(' ') as meta>
            <meta name="${meta?split('==')[0]}" content="${meta?split('==')[1]}"/>
        </#list>
    </#if>
    <title>${title!}</title>
    <#-- NODEFONY : la page est `noindex` (Keycloak), mais un agent ou un lecteur
         d'onglets lit encore sa description. -->
    <meta name="description" content="${msg("nfMetaDescription", (realm.displayName!realm.name))}">
    <#if themeResources?? && themeResources.favicons?has_content>
        <@themeResourceTags.renderFavicons themeResources.favicons url.resourcesPath />
    <#else>
        <link rel="icon" href="${url.resourcesPath}/img/favicon.ico" />
    </#if>
    <#if themeResources?? && themeResources.stylesCommon?has_content>
        <@themeResourceTags.renderStyles themeResources.stylesCommon url.resourcesCommonPath />
    <#elseif properties.stylesCommon?has_content>
        <#list properties.stylesCommon?split(' ') as style>
            <link href="${url.resourcesCommonPath}/${style}" rel="stylesheet" />
        </#list>
    </#if>
    <#if themeResources?? && themeResources.styles?has_content>
        <@themeResourceTags.renderStyles themeResources.styles url.resourcesPath />
    <#elseif properties.styles?has_content>
        <#list properties.styles?split(' ') as style>
            <link href="${url.resourcesPath}/${style}" rel="stylesheet" />
        </#list>
    </#if>
    <script type="importmap">
        {
            "imports": {
                "rfc4648": "${url.resourcesCommonPath}/vendor/rfc4648/rfc4648.js"
            }
        }
    </script>
    <#if darkMode>
      <script type="module" async blocking="render">
          <#outputformat "JavaScript">
          const DARK_MODE_CLASS = ${properties.kcDarkModeClass?c};
          const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

          // NODEFONY : l'application transmet le thème qu'elle a RENDU (`nf_theme`,
          // posé par @nodefony/security sur la demande d'autorisation). Il vaut pour
          // tout le flux : retenu en session d'onglet, puisque les pages suivantes
          // (mot de passe erroné, second facteur) n'ont plus ce paramètre. Liste
          // fermée ; sans lui, le système décide, comme avant.
          const NF_THEME_KEY = "nf.theme";
          let nfForced = null;
          try {
            const asked = new URLSearchParams(window.location.search).get("nf_theme");
            if (asked === "light" || asked === "dark") sessionStorage.setItem(NF_THEME_KEY, asked);
            const kept = sessionStorage.getItem(NF_THEME_KEY);
            if (kept === "light" || kept === "dark") nfForced = kept;
          } catch {
            // Stockage refusé (navigation privée stricte) : le système décide.
          }

          updateDarkMode(nfForced ? nfForced === "dark" : mediaQuery.matches);
          mediaQuery.addEventListener("change", (event) => {
            if (!nfForced) updateDarkMode(event.matches);
          });

          function updateDarkMode(isEnabled) {
            const { classList, dataset } = document.documentElement;
            // NODEFONY : login.css suit la même décision que PatternFly.
            dataset.theme = isEnabled ? "dark" : "light";

            if (isEnabled) {
              classList.add(DARK_MODE_CLASS);
            } else {
              classList.remove(DARK_MODE_CLASS);
            }
          }
          </#outputformat>
      </script>
    </#if>
    <#if themeResources?? && themeResources.scripts?has_content>
        <@themeResourceTags.renderScripts themeResources.scripts url.resourcesPath "text/javascript" />
    <#elseif properties.scripts?has_content>
        <#list properties.scripts?split(' ') as script>
            <script src="${url.resourcesPath}/${script}" type="text/javascript"></script>
        </#list>
    </#if>
    <#if scripts??>
        <#list scripts as script>
            <script src="${script}" type="text/javascript"></script>
        </#list>
    </#if>
    <script type="module" src="${url.resourcesPath}/js/passwordVisibility.js"></script>
    <script type="module">
        <#outputformat "JavaScript">
        import { startSessionPolling } from ${(url.resourcesPath + "/js/authChecker.js")?c};

        startSessionPolling(
            ${url.ssoLoginInOtherTabsUrl?c}
        );
        </#outputformat>
    </script>
    <script type="module">
        document.addEventListener("click", (event) => {
            const link = event.target.closest("a[data-once-link]");

            if (!link) {
                return;
            }

            if (link.getAttribute("aria-disabled") === "true") {
                event.preventDefault();
                return;
            }

            const { disabledClass } = link.dataset;

            if (disabledClass) {
                link.classList.add(...disabledClass.trim().split(/\s+/));
            }

            link.setAttribute("role", "link");
            link.setAttribute("aria-disabled", "true");
        });
    </script>
    <#if authenticationSession??>
        <script type="module">
             <#outputformat "JavaScript">
            import { checkAuthSession } from ${(url.resourcesPath + "/js/authChecker.js")?c};

            checkAuthSession(
                ${authenticationSession.authSessionIdHash?c}
            );
            </#outputformat>
        </script>
    </#if>
    <script>
      // Workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=1404468
      const isFirefox = true;
    </script>
</head>

<#-- ── NODEFONY : le balisage de la page /login du framework ─────────────────
     `nf-layout` · `nf-hero` · `nf-stage` · `nf-card` : les classes de
     `nodefony/login.css`, dont `css/login.css` est la copie conforme. La mise en
     page suit `nfLayout` (theme.properties : split | card | bare) et l'habillage
     `nfSkin` : les thèmes enfants `nodefony-<habillage>` posent les deux, comme
     `loginPage.skin` sur la page /login — un thème de l'application peut aussi
     les surcharger.
     Seuls ce bloc d'ouverture et sa fermeture diffèrent du cadre `keycloak.v2` :
     messages, choix de langue, scripts de session et formulaires imbriqués
     restent ceux de Keycloak. -->
<body id="keycloak-bg" class="${properties.kcBodyClass!} nf-kc" data-skin="${properties.nfSkin!'frontispiece'}" data-layout="${properties.nfLayout!'split'}" data-page-id="login-${pageId}">
<div class="nf-layout">
  <#-- NODEFONY : le panneau de gauche montre le REALM et l'APPLICATION qui
       demande la connexion — uniquement avec ce que Keycloak expose aux
       gabarits, donc réglable depuis SA console, sans toucher au thème :
         · realm.displayName / name (Realm settings › General) — jamais
           `displayNameHtml` : il porte le logo d'un thème qui n'en a pas (le
           realm `master` y met celui de Keycloak, qui chevauchait le nôtre)
         · client.name / client.description          (Clients › Settings)
         · capacités du realm, lues et non décrites (Realm settings › Login)
         · textes `nf*` surchargeables par realm et par langue
           (Realm settings › Localization › Realm overrides). -->
  <#assign nfRealmLabel = (realm.displayName?has_content)?then(realm.displayName, realm.name)>
  <aside class="nf-hero">
    <div class="nf-hero-brand">
      <img src="${url.resourcesPath}/img/logo.png" alt="" class="nf-logo" width="26" height="42"/>
      <span class="nf-hero-name">${nfRealmLabel}</span>
    </div>
    <div class="nf-hero-body">
      <span class="nf-pill">${msg("nfRealmPill", realm.name)}</span>
      <#if client?? && (client.name?has_content || client.clientId?has_content)>
        <p class="nf-hero-title">${msg("nfLoginTo", (client.name?has_content)?then(advancedMsg(client.name), client.clientId))}</p>
        <#if client.description?has_content>
          <p class="nf-hero-lead">${advancedMsg(client.description)}</p>
        <#elseif msg("nfRealmDescription")?has_content && msg("nfRealmDescription") != "nfRealmDescription">
          <p class="nf-hero-lead">${msg("nfRealmDescription")}</p>
        </#if>
      <#else>
        <p class="nf-hero-title">${nfRealmLabel}</p>
      </#if>
      <p class="nf-caps-title">${msg("nfCapsTitle", nfRealmLabel)}</p>
      <ul class="nf-caps">
        <li><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nf-icon" aria-hidden="true" > <path stroke="none" d="M0 0h24v24H0z" fill="none" /> <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /> <path d="M9 12l2 2l4 -4" /> </svg><span>${msg("nfCapSso")}</span></li>
        <#if realm.identityFederationEnabled><li><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nf-icon" aria-hidden="true" > <path stroke="none" d="M0 0h24v24H0z" fill="none" /> <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /> <path d="M9 12l2 2l4 -4" /> </svg><span>${msg("nfCapFederation")}</span></li></#if>
        <#if realm.resetPasswordAllowed><li><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nf-icon" aria-hidden="true" > <path stroke="none" d="M0 0h24v24H0z" fill="none" /> <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /> <path d="M9 12l2 2l4 -4" /> </svg><span>${msg("nfCapReset")}</span></li></#if>
        <#if realm.registrationAllowed><li><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nf-icon" aria-hidden="true" > <path stroke="none" d="M0 0h24v24H0z" fill="none" /> <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /> <path d="M9 12l2 2l4 -4" /> </svg><span>${msg("nfCapRegister")}</span></li><#else><li><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nf-icon" aria-hidden="true" > <path stroke="none" d="M0 0h24v24H0z" fill="none" /> <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /> <path d="M9 12l2 2l4 -4" /> </svg><span>${msg("nfCapManaged")}</span></li></#if>
        <#if realm.rememberMe><li><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nf-icon" aria-hidden="true" > <path stroke="none" d="M0 0h24v24H0z" fill="none" /> <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /> <path d="M9 12l2 2l4 -4" /> </svg><span>${msg("nfCapRemember")}</span></li></#if>
      </ul>
    </div>
    <div class="nf-hero-footer">
      <span>${msg("nfRealmFooter", realm.name)}</span>
      <span>${msg("nfThemeCredit")}</span>
    </div>
  </aside>
  <div class="nf-stage">
    <#-- NODEFONY : revenir à l'application qui a demandé la connexion — pour
         choisir une autre méthode (mot de passe local, passkey, autre
         fournisseur). GÉNÉRIQUE : aucune adresse n'est écrite ni configurée.
         Le bouton ANNULE la connexion (champ `cancel`, que traite le
         formulaire identifiant/mot de passe de Keycloak) : Keycloak renvoie
         alors vers le `redirect_uri` DE LA REQUÊTE EN COURS avec
         `error=access_denied` + `state` (OAuth 2.0, RFC 6749 §4.1.2.1) — c'est
         l'application appelante, quelle qu'elle soit, qui décide où atterrir.
         Seule la page identifiant/mot de passe connaît `cancel` : ailleurs,
         pas de bouton plutôt qu'un bouton sans effet.
         Jamais sur les consoles de Keycloak lui-même (administration,
         compte) : elles n'ont pas d'autre méthode vers laquelle revenir, et
         reçoivent `access_denied` en affichant « Something went wrong ». -->
    <#assign nfKeycloakConsole = client?? && ["security-admin-console", "account-console"]?seq_contains(client.clientId!"")>
    <#if pageId == "login" && url.loginAction?has_content && !nfKeycloakConsole>
    <form class="nf-back-form" action="${url.loginAction}" method="post" novalidate="novalidate">
      <input type="hidden" name="cancel" value="on"/>
      <button type="submit" class="nf-back">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nf-icon" aria-hidden="true" > <path stroke="none" d="M0 0h24v24H0z" fill="none" /> <path d="M5 12l14 0" /> <path d="M5 12l6 6" /> <path d="M5 12l6 -6" /> </svg>
        <span>
          <strong>${msg("nfBackTo", (client?? && client.name?has_content)?then(advancedMsg(client.name), (client.clientId)!""))}</strong>
          <small>${msg("nfBackHint")}</small>
        </span>
      </button>
    </form>
    </#if>
<div class="${properties.kcLogin!}">
  <div class="${properties.kcLoginContainer!} nf-card">
    <header id="kc-header" class="pf-v5-c-login__header">
      <div id="kc-header-wrapper" class="nf-compact-brand">
        <img src="${url.resourcesPath}/img/logo.png" alt="" class="nf-logo" width="19" height="30"/>
        <span>${msg("nfBrandName")}</span>
      </div>
    </header>
    <main class="${properties.kcLoginMain!}">
      <div class="${properties.kcLoginMainHeader!}">
        <#-- NODEFONY : le badge dit d'emblée qu'on entre par le SSO, pas dans une seule application. -->
        <div class="nf-heading">
          <span class="nf-eyebrow"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nf-icon" aria-hidden="true" > <path stroke="none" d="M0 0h24v24H0z" fill="none" /> <path d="M11.46 20.846a12 12 0 0 1 -7.96 -14.846a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.09 7.06" /> <path d="M15 19l2 2l4 -4" /> </svg>${msg("nfSsoBadge")}</span>
          <h1 class="${properties.kcLoginMainTitle!}" id="kc-page-title"><#nested "header"></h1>
          <#if pageId == "login"><p class="nf-subtitle">${msg("nfSubtitle", (realm.displayName!''))}</p></#if>
        </div>
        <#if realm.internationalizationEnabled  && locale.supported?size gt 1>
        <div class="${properties.kcLoginMainHeaderUtilities!}">
          <div class="${properties.kcInputClass!}">
            <select
              aria-label="${msg("languages")}"
              id="login-select-toggle"
              onchange="if (this.value) window.location.href=this.value"
            >
              <#list locale.supported?sort_by("label") as l>
                <option
                  value="${l.url}"
                  ${(l.languageTag == locale.currentLanguageTag)?then('selected','')}
                >
                  ${l.label}
                </option>
              </#list>
            </select>
            <span class="${properties.kcFormControlUtilClass}">
              <span class="${properties.kcFormControlToggleIcon!}">
                <svg
                  class="pf-v5-svg"
                  viewBox="0 0 320 512"
                  fill="currentColor"
                  aria-hidden="true"
                  role="img"
                  width="1em"
                  height="1em"
                >
                  <path
                    d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"
                  >
                  </path>
                </svg>
              </span>
            </span>
          </div>
        </div>
        </#if>
      </div>
      <div class="${properties.kcLoginMainBody!}">
        <#if !(auth?has_content && auth.showUsername() && !auth.showResetCredentials())>
            <#if displayRequiredFields>
                <div class="${properties.kcContentWrapperClass!}">
                    <div class="${properties.kcLabelWrapperClass!} subtitle">
                        <span class="${properties.kcInputHelperTextItemTextClass!}">
                          <span class="${properties.kcInputRequiredClass!}">*</span> ${msg("requiredFields")}
                        </span>
                    </div>
                </div>
            </#if>
        <#else>
            <#if displayRequiredFields>
                <div class="${properties.kcContentWrapperClass!}">
                    <div class="${properties.kcLabelWrapperClass!} subtitle">
                        <span class="${properties.kcInputHelperTextItemTextClass!}">
                          <span class="${properties.kcInputRequiredClass!}">*</span> ${msg("requiredFields")}
                        </span>
                    </div>
                    <div class="${properties.kcFormClass} ${properties.kcContentWrapperClass}">
                        <#nested "show-username">
                        <@username />
                    </div>
                </div>
            <#else>
                <div class="${properties.kcFormClass} ${properties.kcContentWrapperClass}">
                  <#nested "show-username">
                  <@username />
                </div>
            </#if>
        </#if>

        <#-- App-initiated actions should not see warning messages about the need to complete the action -->
        <#-- during login.                                                                               -->
        <#if displayMessage && message?has_content && (message.type != 'warning' || !isAppInitiatedAction??)>
            <div class="${properties.kcAlertClass!} pf-m-${(message.type = 'error')?then('danger', message.type)}">
                <div class="${properties.kcAlertIconClass!}">
                    <#if message.type = 'success'><span class="${properties.kcFeedbackSuccessIcon!}"></span></#if>
                    <#if message.type = 'warning'><span class="${properties.kcFeedbackWarningIcon!}"></span></#if>
                    <#if message.type = 'error'><span class="${properties.kcFeedbackErrorIcon!}"></span></#if>
                    <#if message.type = 'info'><span class="${properties.kcFeedbackInfoIcon!}"></span></#if>
                </div>
                <span class="${properties.kcAlertTitleClass!} kc-feedback-text">${message.summary}</span>
            </div>
        </#if>

        <#nested "form">

        <#if auth?has_content && auth.showTryAnotherWayLink()>
          <form id="kc-select-try-another-way-form" action="${url.loginAction}" method="post" novalidate="novalidate">
              <input type="hidden" name="tryAnotherWay" value="on"/>
              <a id="try-another-way" href="javascript:document.forms['kc-select-try-another-way-form'].requestSubmit()"
                  class="${properties.kcButtonSecondaryClass} ${properties.kcButtonBlockClass} ${properties.kcMarginTopClass}">
                    ${msg("doTryAnotherWay")}
              </a>
          </form>
        </#if>

        <#if switchOrganizationEnabled?? && switchOrganizationEnabled>
          <form id="kc-switch-organization-form" action="${url.loginAction}" method="post" novalidate="novalidate">
              <input type="hidden" name="switchOrganization" value="true"/>
              <a id="switch-organization" href="javascript:document.forms['kc-switch-organization-form'].requestSubmit()"
                  class="${properties.kcButtonSecondaryClass} ${properties.kcButtonBlockClass} ${properties.kcMarginTopClass}">
                    ${msg("doSwitchOrganization")}
              </a>
          </form>
        </#if>

          <div class="${properties.kcLoginMainFooter!}">
              <#nested "socialProviders">

              <#if displayInfo>
                  <div id="kc-info" class="${properties.kcLoginMainFooterBand!} ${properties.kcFormClass}">
                      <div id="kc-info-wrapper" class="${properties.kcLoginMainFooterBandItem!}">
                          <#nested "info">
                      </div>
                  </div>
              </#if>
          </div>
      </div>

        <div class="${properties.kcLoginMainFooter!}">
            <@loginFooter.content/>
        </div>
    </main>
  </div>
</div>
    <#-- NODEFONY : rappel du périmètre SSO, comme la ligne d'état de Studio. -->
    <footer class="nf-panel-footer">
      <span class="nf-sso-scope"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nf-icon" aria-hidden="true" > <path stroke="none" d="M0 0h24v24H0z" fill="none" /> <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /> <path d="M3.6 9h16.8" /> <path d="M3.6 15h16.8" /> <path d="M11.5 3a17 17 0 0 0 0 18" /> <path d="M12.5 3a17 17 0 0 1 0 18" /> </svg>${msg("nfSsoFooter", (realm.displayName!realm.name))}</span>
      <span class="nf-provider"><span class="nf-dot" aria-hidden="true"></span>${msg("nfProvidedBy")}</span>
    </footer>
  </div>
</div>
<#-- NODEFONY : un libellé dont la cible `for` n'existe pas est rattaché au champ
     de son groupe. Keycloak 26.8 écrit `for="form-vertical-name"` sur les deux
     libellés de `login-config-totp.ftl` : axe relève deux champs sans nom
     accessible (critique). Réparer ici plutôt que recopier ce gabarit : la copie
     masquerait ses évolutions, et ce geste est inerte quand la cible existe. -->
<script>
  for (const label of document.querySelectorAll("label[for]")) {
    if (document.getElementById(label.htmlFor)) continue;
    const field = label
      .closest(".pf-v5-c-form__group")
      ?.querySelector("input:not([type=hidden]), select, textarea");
    if (field?.id) label.htmlFor = field.id;
  }
</script>
</body>
</html>
</#macro>
