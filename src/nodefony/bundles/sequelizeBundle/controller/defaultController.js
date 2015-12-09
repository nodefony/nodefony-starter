


nodefony.registerController("default", function(){

		/**
		 *	The class is a **`default` CONTROLLER** .
		 *	@module App
		 *	@main App
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
		 *	@method indexAction
		 *
		 */
		defaultController.prototype.indexAction = function(){
			// markdown read and parse readme.md
			try {
				var path =  this.get("kernel").rootDir+"/src/experimental//sequelizeBundle/readme.md";	
				var file = new nodefony.fileClass(path);
				var res = this.htmlMdParser(file.content(file.encoding),{
					linkify: true,
					typographer: true	
				});
				return this.render("sequelizeBundle::index.html.twig",{readme:res});
			}catch(e){
				return this.forward("frameworkBundle:default:system",{view: "sequelizeBundle::index.html.twig",bundle:this.getParameters("bundles.sequelize")});
			}
		};

		
		return defaultController;
});
