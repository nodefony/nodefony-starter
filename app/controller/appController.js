module.exports = class appController extends nodefony.controller {

  constructor(container, context) {
    super(container, context);
    // start session
    this.startSession();
  }

  /**
   *  @see Route home in routing.js
   */
  indexAction() {
    return this.render("app::index.html.twig", {
      user: this.getUser(),
      description: this.kernel.package.description
    });
  }

  /**
   *
   */
  headerAction() {
    return this.render("app::header.html.twig", {
      langs: this.get("translation").getLangs(),
      locale: this.getLocale(),
      version: nodefony.version
    });
  }

  /**
   *
   */
  footerAction() {
    let version = this.kernel.settings.version;
    return this.render("app::footer.html.twig", {
      version: version,
      year: new Date().getFullYear()
    });
  }

  /**
   *	Documentation
   *  @see Route documentation in routing.js
   */
  documentationAction() {
    let docBundle = this.kernel.getBundles("documentation");
    if (docBundle) {
      return this.forward("documentation:default:index");
    }
    try {
      let file = new nodefony.fileClass(path.resolve(this.kernel.rootDir, "README.md"));
      if (file) {
        let res = this.htmlMdParser(file.content(file.encoding), {
          linkify: true,
          typographer: true
        });
        return this.render("app:documentation:documentation.html.twig", {
          readme: res,
        });
      }
    } catch (e) {
      throw e;
    }
    return this.render('app:documentation:documentation.html.twig');
  }

  /**
   *    @see Route by Annotaion
   *    @Method ({ "GET"})
   *    @Route ("/lang", name="lang")
   */
  langAction() {
    if (this.query.language) {
      if (this.session) {
        this.session.set("lang", this.query.language);
        let route = this.session.getMetaBag("lastRoute");
        if (route) {
          return this.redirect(this.url(route));
        }
      }
    }
    let referer = this.request.getHeader("referer");
    if (referer) {
      return this.redirect(referer);
    }
    return this.redirect("/");
  }

};