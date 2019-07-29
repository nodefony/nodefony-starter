
/**
 *	@class defaultController
 *	@constructor
 *	@param {class} container
 *	@param {class} context
 *  @Route ("/vue")
 */
module.exports = class defaultController extends nodefony.controller {

  constructor(container, context) {
    super(container, context);
    // start session
    this.startSession();
  }

/**
 *    @Route ("",
 *      name="route-vue-bundle-vue")
 */
  indexAction() {
    return this.render("vue-bundle::index.html.twig", {
			name: this.bundle.name,
			description: this.bundle.package.description    });

  }
};
