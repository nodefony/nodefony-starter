/*
 *
 *
 *
 *
 *
 *
 *
 *
 */

nodefony.register("appKernel",function(){

	var appKernel = function(type, environment, debug, loader){
		
		// Kernel constructor
		var kernel = this.$super;
		
		// kernel constructor
		kernel.constructor(environment, debug, loader, type)

		/*
	 	*	Bundle to register in Application
	 	*/
		this.registerBundles([
			"./vendors/nodefony/bundles/securityBundle",
			"./vendors/nodefony/bundles/orm2Bundle"
		]);

		/*
 		 *
 		 *	SERVERS
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
