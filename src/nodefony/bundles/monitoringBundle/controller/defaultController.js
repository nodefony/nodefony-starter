
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
		 *	 index 
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


		/**
 		* 
 		*
 		*
 		*
 		**/
		defaultController.prototype.realTimeAction= function(message){
			var realtime = this.get("realTime");
			var context = this.getContext();
			switch( this.getRequest().method ){
				case "GET" :
					return this.getResponse("PING");
				break;
				case "POST" :
					return realtime.handleConnection(this.getParameters("query").request, context );	
				break;
				case "WEBSOCKET" :
					if (message){
						realtime.handleConnection(message.utf8Data, context );
					}
				break;
				default :
					throw new Error("REALTIME METHOD NOT ALLOWED")
			};
		}

		/**
 		 * 
 		 *
 		 *
 		 *
 		 **/
		defaultController.prototype.testLoadAction= function(message){
			var context = this.getContext();
			var serverLoad = this.get("serverLoad");
			switch( this.getRequest().method ){
				case "WEBSOCKET" :
					if (message){
						serverLoad.handleConnection(JSON.parse( message.utf8Data ), context );
					}
				break;
				default :
					throw new Error("REALTIME METHOD NOT ALLOWED")
			};
		}
		
		return defaultController;
});
