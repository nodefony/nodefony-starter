/*
 *
 *
 *
 *	ENTRY POINT FRAMEWORK APP KERNEL
 *
 *
 *
 *
 */

nodefony.register("appKernel",function(){

	var appKernel = function(type, environment, debug, loader, settings){
		
		// kernel constructor
		var kernel = this.$super;
		kernel.constructor(environment, debug, loader, type, settings)

		/*
	 	*	Bundles to register in Application
	 	*/
		this.registerBundles([
			"./src/nodefony/bundles/sequelizeBundle",
			//"./src/bundles/demoBundle",
		]);

		/*
 		 *
 		 *	CREATE SERVERS HTTP / HTTPS / WEBSOCKET
 		 */
		if (type === "SERVER"){
			this.listen(this,"onReady", function(){
				// create HTTP server 
				var http = this.get("httpServer").createServer();

				// create HTTPS server
				//var https = this.get("httpsServer").createServer();

				// create WEBSOCKET server
				var ws = this.get("websocketServer").createServer(http);

				// create WEBSOCKET SECURE server
				//var wss = this.get("websocketServerSecure").createServer(https);

			}.bind(this));
		};
				
	}.herite(nodefony.kernel);

	return appKernel;
})
