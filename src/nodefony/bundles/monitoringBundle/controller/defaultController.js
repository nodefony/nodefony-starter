
nodefony.registerController("default", function(){

		/**
		 *	The class is a **`default` CONTROLLER** .
		 *	@module NODEFONY
		 *	@main NODEFONY
		 *	@class default
		 *	@constructor
		 *	@param {class} container   
		 *	@param {class} context
		 *	
		 */
		var defaultController = function(container, context){
			this.mother = this.$super;
			this.mother.constructor(container, context);
		};


		/**
		 *
		 *	DEMO index 
		 *
		 */
		defaultController.prototype.indexAction= function(module){
			if (module){
				this.getResponse().setHeader('Content-Type' , "application/xml"); 
				return this.render('monitoringBundle::'+module+'.xml.twig')	
			}else{
				return this.render('monitoringBundle::index.html.twig')
			}
		};

		
		return defaultController;
});
