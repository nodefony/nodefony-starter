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
"use strict;"
nodefony.register("appKernel",function(){

	var appKernel = class appKernel extends nodefony.kernel {

		constructor (type, environment, debug, loader, settings){
			
			// kernel constructor
			super(environment, debug, loader, type, settings)

			/*
	 		*	Bundles to register in Application
	 		*/
			this.registerBundles([
				"./src/nodefony/bundles/sequelizeBundle",
				"./src/nodefony/bundles/documentationBundle",
				"./src/nodefony/bundles/unitTestBundle",
				"./src/bundles/demoBundle"
			]);

			/*
 		 	*
 		 	*	CREATE SERVERS HTTP / HTTPS / WEBSOCKET
 		 	*/
			if (type === "SERVER"){
				this.listen(this,"onPostReady", () => {
					// create HTTP server 
					var http = this.get("httpServer").createServer();

					// create HTTPS server
					var https = this.get("httpsServer").createServer();

					// create WEBSOCKET server
					var ws = this.get("websocketServer").createServer(http);

					// create WEBSOCKET SECURE server
					var wss = this.get("websocketServerSecure").createServer(https);
				});
			};
		};
	};

	return appKernel;
})
