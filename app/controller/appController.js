

module.exports = nodefony.registerController("app", function(){

		/**
		 *	The class appController .
		 *	@main nodefony
		 *	@constructor
		 *	@param {class} container
		 *	@param {class} context
		 *
		 */
		var appController = class appController extends nodefony.controller {

			constructor (container, context){
				super(container, context);
			}

			/**
		 	*
		 	*	@method indexAction
		 	*
		 	*/
			indexAction (){
				let core = this.kernel.isCore ? "CORE" : version ;
				return this.render("AppBundle::index.html.twig" , {
					core	: core
				});
			}

			footerAction (){
				let translateService = this.get("translation");
				let version =  this.kernel.settings.version ;
				let year = new Date().getFullYear();
				let langs = translateService.getLangs();
				let locale = translateService.getLocale();
			 	return this.render( "AppBundle::footer.html.twig", {
					langs	: langs,
					version	: version,
					year	: year,
					locale	: locale,
				});
			}
		};
		return appController;
});
