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
		console.log("		      \033[34m"+this.type+" \033[0mVersion : "+ this.settings.system.version +" PLATFORM : "+this.platform+"  PROCESS PID : "+process.pid+"\n");

		/*
	 	*	Bundle to register in Application
	 	*	onFinish register initializeBundles
	 	*/
		this.registerBundles([
			"./vendors/nodefony/bundles/securityBundle",
			"./vendors/nodefony/bundles/asseticBundle",
			"./vendors/nodefony/bundles/httpBundle",	
			"./vendors/nodefony/bundles/frameworkBundle",
			"./vendors/nodefony/bundles/realTimeBundle",
			"./vendors/nodefony/bundles/orm2Bundle",
			"./vendors/nodefony/bundles/monitoringBundle"
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
				var https = this.get("httpsServer").createServer();

				// create WEBSOCKET server
				var ws = this.get("websocketServer").createServer(http);

				// create WEBSOCKET SECURE server
				var wss = this.get("websocketServerSecure").createServer(https);

			}.bind(this));
		};
				
	}.herite(nodefony.kernel);

	return appKernel;
})
