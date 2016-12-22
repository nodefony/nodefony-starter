/*
 * New node file
 */


//var WebSocketServer = require('websocket');
//var nodedomain = require('domain');

nodefony.registerService("websocketSecure", function(){
	
	// https://github.com/Worlize/WebSocket-Node/wiki/Documentation

	var websocket = class websocket extends nodefony.Service {

		constructor ( httpKernel, security, options ){

			super( "websocketSecure", httpKernel.container, httpKernel.notificationsCenter , options  );

			this.httpKernel = httpKernel;
			this.port = this.httpKernel.kernel.httpsPort ;
			this.domain = this.httpKernel.kernel.settings.system.domain ;
			this.firewall =  security ;
			this.kernel = this.httpKernel.kernel ;
			this.ready = false ;
			this.type = "WEBSOCKET SECURE";
			this.listen(this, "onBoot",() => {
				this.bundle = this.kernel.getBundles("http") ;
				
			});
		}

		logger (pci, severity, msgid,  msg){
			if (! msgid) {msgid = "SERVICE WEBSOCKET SECURE ";}
			return this.syslog.logger(pci, severity, msgid,  msg);
		}
	
		createServer (http/*, settings*/){

			this.bundle.listen(this, "onServersReady", function(type){
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
										this.httpKernel.onErrorWebsoket( d.container, er.stack);	
									}else{
										this.logger(er.stack, "ERROR");
									}
								});
								d.add(request);
								d.run( () => {
									this.fire("onServerRequest", request, null, this.type, d);
								});
						});

						this.listen(this, "onTerminate", () =>{
							if ( this.websocketServer && this.ready ){
								this.websocketServer.shutDown();
								this.logger(" SHUTDOWN WEBSOCKET SECURE Server is listening on DOMAIN : "+this.domain+"    PORT : "+this.port , "INFO");
							}
						});


						if ( this.websocketServer ){
							this.ready = true ;
							this.logger(" Server  is listening on DOMAIN : wss://"+this.domain+":"+this.port , "INFO");
						}

						return this.websocketServer;
					}catch(e){
						this.logger(e);
						throw e ;	
					}
				}
			});
		}
	};
	return websocket;
});
