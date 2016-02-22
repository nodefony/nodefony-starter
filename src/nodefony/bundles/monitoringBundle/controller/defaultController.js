
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
				if (module === "app"){
					var kernel = this.get("kernel");
					var bundles = function(){
						var obj = {};
						for (var bundle in kernel.bundles ){
							obj[bundle] = {
								name:kernel.bundles[bundle].name,
								version:kernel.bundles[bundle].settings.version,
								config:this.container.getParameters("bundles."+bundle)
							}	
						}
						return obj;
					}.call(this);
					return this.render('monitoringBundle::'+module+'.xml.twig', {
						bundles:bundles
					})	
				}
				return this.render('monitoringBundle::'+module+'.xml.twig')	
			}else{
				return this.render('monitoringBundle::index.html.twig')
			}
		};

		
		return defaultController;
});
