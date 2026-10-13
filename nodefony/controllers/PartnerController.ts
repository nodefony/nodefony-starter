import { RequestContext } from "nodefony";
import { route, controller, Controller } from "@nodefony/framework";
import type { ContextType } from "@nodefony/http";
import type { IToken } from "@nodefony/security";

/**
 * L'API d'un PROGRAMME — service partenaire, script, agent — qui se présente
 * avec un jeton d'accès (`Authorization: Bearer …`), jamais avec un cookie.
 *
 * Tout `/api/partner` tombe dans la zone `partner` de
 * `nodefony/config/security.ts` : le firewall y a vérifié le jeton (signature,
 * expiration, audience) AVANT d'entrer ici, et répond 401 sinon. Aucune ligne
 * de contrôle d'accès n'a donc sa place dans ces actions.
 *
 * Essai de bout en bout, jeton compris : `npx nodefony app:partner:call`
 * (`nodefony/command/PartnerCallCommand.ts`).
 */
@controller("/api/partner")
class PartnerController extends Controller {
  constructor(context: ContextType) {
    super("partner", context);
  }

  /**
   * Qui appelle, et qui l'a dit : l'identité que le firewall a établie, et
   * l'émetteur du jeton qui l'a prouvée.
   *
   * Les deux émetteurs de la zone ne donnent pas la même identité, et c'est ce
   * que cette route rend visible :
   *  • jeton signé par CETTE application → un compte existant d'ici, ses rôles ;
   *  • jeton Keycloak (`client_credentials`) → un appelant SANS compte local,
   *    nommé d'après son émetteur, avec les seuls rôles `ephemeralRoles` de la
   *    zone (`ROLE_PARTNER`).
   *
   * Réserver une action aux partenaires : `@IsGranted("ROLE_PARTNER")` sur
   * l'action (`import { IsGranted } from "@nodefony/framework"`). Un compte
   * d'ici n'a pas ce rôle tant que `roleHierarchy` ne le lui donne pas.
   */
  @route("partner-whoami", { path: "/whoami", method: "GET" })
  whoami() {
    // `this.user` : l'identité, sans appel de plus. Le jeton lui-même est
    // dans le contexte de la requête ; chaque authenticator y pose l'attribut
    // `issuer`.
    const token = RequestContext.get()?.token as IToken | undefined;
    return this.renderJson({
      identifier: this.user?.identifier ?? null,
      roles: this.user?.roles ?? [],
      issuer: token?.getAttribute<string>("issuer") ?? null,
    });
  }
}

export default PartnerController;
