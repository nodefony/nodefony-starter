module.exports = class loginController extends nodefony.controller {

  constructor(container, context) {
    super(container, context);
    this.security = this.get("security");
    this.startSession();
  }

  /**
   *    @Method ({ "GET"})
   *    @Route (
   *      "/login/{type}",
   *      name="login",
   *      defaults={"type" = "nodefony"},
   *      requirements={"type" = "\w+"}
   *    )
   */
  loginAction(type) {
    let token = this.getToken();
    if (this.session && token) {
      return this.redirectToRoute("home");
    }
    let area = this.security.getSecuredArea(type);
    let action = "/" + type;
    if (area && area.checkLogin) {
      action = area.checkLogin;
    }
    let google = this.security.getSecuredArea("google_area") ? true : false;
    let github = this.security.getSecuredArea("github_area") ? true : false;
    return this.render("users:login:login.html.twig", {
      type: type,
      action: action,
      google: google,
      github: github
    });
  }

  /**
   *    @Method ({ "POST"})
   *    @Route (
   *      "/login/check",
   *      name="login-check"
   *    )
   */
  loginCheckAction(lastUrl) {
    try {
      let token = this.getToken();
      if (token.user && token.user.enabled) {
        if (lastUrl) {
          return this.redirect(lastUrl);
        }
        return this.redirectToRoute("home");
      } else {
        this.context.session.invalidate();
        let error = new nodefony.securityError(
          `User ${token.user.username}  Désactivé `,
          401,
          this.context.security,
          this.context
        );
        this.logger(error, "ERROR");
        this.setFlashBag("error", error.message);
        return this.redirectToRoute("login");
      }
    } catch (e) {
      throw e;
    }
  }

  /**
   *    @Method ({ "GET"})
   *    @Route ("/logout", name="logout")
   */
  logoutAction() {
    if (this.security) {
      return this.security.logout(this.context)
        .catch((e) => {
          throw e;
        });
    }
    if (this.context.session) {
      return this.context.session.destroy(true)
        .then(() => {
          return this.redirectToRoute("login");
        }).catch(e => {
          this.logger(e, "ERROR");
        });
    }
    return this.redirectToRoute("login");
  }

};
