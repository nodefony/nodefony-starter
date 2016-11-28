/*
 * New node file
 */


var WebSocketServer = require('websocket');
var nodedomain = require('domain');


nodefony.registerService("websocketSecure", function(){
	
	// https://github.com/Worlize/WebSocket-Node/wiki/Documentation

	var websocket = class websocket {
		constructor ( httpKernel, security, options ){
			this.httpKernel = httpKernel;
			this.port = this.httpKernel.kernel.httpsPort ;
			this.domain = this.httpKernel.kernel.settings.system.domain ;
			this.firewall =  security ;
			this.kernel = this.httpKernel.kernel ;
			this.ready = false ;
			this.type = "WEBSOCKET SECURE";
			this.kernel.listen(this, "onBoot",() => {
				this.bundle = this.kernel.getBundles("http") ;
				
			});
		};
	
		createServer (http, settings){

			this.bundle.listen(this, "onServersReady", function(type, service){
				if ( type === "HTTPS"){
					try {
						this.settings = this.get("container").getParameters("bundles.http").websocketSecure || {} ;

						this.websocketServer =  new WebSocketServer.server(nodefony.extend({}, this.settings, {
							httpServer: http
						}));
							
						
						this.websocketServer.on('request', (request) => {
							var d = nodedomain.create();
								d.on('error', (er) => {
									if ( d.container ){
										this.httpKernel.onErrorWebsoket( d.container, er.stack)	
									}else{
										this.httpKernel.logger(er.stack, "ERROR", "SERVICE WEBSOCKET SECURE");
									}
								});
								d.add(request);
								d.run( () => {
									this.kernel.fire("onServerRequest", request, null, this.type, d)
								});
						});

						this.kernel.listen(this, "onTerminate", () =>{
							if ( this.websocketServer && this.ready ){
								this.websocketServer.shutDown();
								this.httpKernel.logger(" SHUTDOWN WEBSOCKET SECURE Server is listening on DOMAIN : "+this.domain+"    PORT : "+this.port , "INFO", "SERVICE WEBSOCKET SECURE");
							}
						});


						if ( this.websocketServer ){
							this.ready = true ;
							this.httpKernel.logger(" Server  is listening on DOMAIN : wss://"+this.domain+":"+this.port , "INFO", "SERVICE WEBSOCKET SECURE");
						}

						return this.websocketServer;
					}catch(e){
						this.kernel.logger(e);
						throw e ;	
					}
				}
			})
		};
	};
	
	return websocket;
});
