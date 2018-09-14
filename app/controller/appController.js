module.exports = class appController extends nodefony.controller {

  constructor(container, context) {
    super(container, context);
  }

  indexAction() {
    let demo = this.kernel.getBundle("demo");
    return this.render("app::index.html.twig", {
      demo: demo ? true : false,
      user: this.context.user,
      name: this.kernel.projectName
    });
  }

  footerAction() {
    let version = this.kernel.settings.version;
    return this.render("app::footer.html.twig", {
      langs: this.get("translation").getLangs(),
      version: version,
      year: new Date().getFullYear(),
      locale: this.getLocale()
    });
  }
};
