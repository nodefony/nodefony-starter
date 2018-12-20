module.exports = class appController extends nodefony.controller {

  constructor(container, context) {
    super(container, context);
    // start session
    this.startSession();
  }

  /**
   *
   */
  indexAction() {
    return this.render("app::index.html.twig", {
      user: this.getUser(),
      name: this.kernel.projectName
    });
  }

  /**
   *
   */
  headerAction() {
    return this.render("app::header.html.twig");
  }

  /**
   *
   */
  footerAction() {
    let version = this.kernel.settings.version;
    return this.render("app::footer.html.twig", {
      langs: this.get("translation").getLangs(),
      version: version,
      year: new Date().getFullYear(),
      locale: this.getLocale(),
      description: this.kernel.app.settings.App.description
    });
  }

  /**
   *
   */
  langAction() {
    let referer = this.request.getHeader("referer");
    if (this.query.lang) {
      if (this.context.session) {
        this.context.session.set("lang", this.query.lang);
        let route = this.context.session.getMetaBag("lastRoute");
        if (route) {
          return this.redirect(this.url(route));
        }
      }
    }
    if (referer) {
      return this.redirect(referer);
    }
    return this.redirect("/");
  }

};
