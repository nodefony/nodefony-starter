
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
		var defaultController = class defaultController extends nodefony.controller {

			constructor (container, context){
				super(container, context);
			}

			/**
		 	*
		 	*	 index 
		 	*
		 	*/
			indexAction (module){
				var kernel = this.get("kernel") ;
				if (module){
					this.getResponse().setHeader('Content-Type' , "application/xml"); 
					if (module === "app"){
						var bundles = function(){
							var obj = {};
							for (var bundle in kernel.bundles ){
								obj[bundle] = {
									name:kernel.bundles[bundle].name,
									version:kernel.bundles[bundle].settings.version,
									config:this.container.getParameters("bundles."+bundle)
								};	
							}
							return obj;
						}.call(this);

						return this.render('monitoringBundle::'+module+'.xml.twig', {
							bundles:bundles,
							user:this.context.user
						});
					}
					return this.render('monitoringBundle::'+module+'.xml.twig');	
				}else{
					return this.render('monitoringBundle::index.html.twig', {environment:kernel.environment,debug:kernel.debug});
				}
			}

			/**
 			* 
 			*
 			*
 			*
 			**/
			realTimeAction (message){
				var realtime = this.get("realTime");
				var context = this.getContext();
				switch( this.getRequest().method ){
					case "GET" :
						return this.getResponse("PING");
					case "POST" :
						return realtime.handleConnection(this.getParameters("query").request, context );	
					case "WEBSOCKET" :
						if (message){
							realtime.handleConnection(message.utf8Data, context );
						}
					break;
					default :
						throw new Error("REALTIME METHOD NOT ALLOWED");
				}
			}

			/**
 		 	* 
 		 	*
 		 	*
 		 	*
 		 	**/
			testLoadAction (message){
				var context = this.getContext();
				var serverLoad = this.get("serverLoad");
				switch( this.getRequest().method ){
					case "WEBSOCKET" :
						if (message){
							serverLoad.handleConnection( JSON.parse( message.utf8Data ), context );
						}
					break;
					default :
						throw new Error("REALTIME METHOD NOT ALLOWED");
				}
			}
		};
		
		return defaultController;
});
