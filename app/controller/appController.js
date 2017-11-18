/*
 *
 */
module.exports = class appController extends nodefony.controller {

  constructor(container, context) {
    super(container, context);
  }

  indexAction() {
    let core = this.kernel.isCore ? "CORE" : this.kernel.settings.version;
    let demo = this.kernel.getBundle("demo");
    let readme = null;
    try {
      readme = new nodefony.fileClass(path.resolve(this.kernel.rootDir, "readme.md"));
    } catch (e) {
      readme = false;
    }
    return this.render("AppBundle::index.html.twig", {
      core: core,
      demo: demo ? true : false,
      user: this.context.user,
      readme: readme ? this.htmlMdParser(readme.content()) : false
    });
  }

  footerAction() {
    let translateService = this.get("translation");
    let version = this.kernel.settings.version;
    let year = new Date().getFullYear();
    let langs = translateService.getLangs();
    let locale = translateService.getLocale();
    return this.render("AppBundle::footer.html.twig", {
      langs: langs,
      version: version,
      year: year,
      locale: locale,
    });
  }
};
