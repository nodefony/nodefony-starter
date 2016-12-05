/*
 * New node file
 */

var WebSocketServer = require('websocket');
var nodedomain = require('domain');


nodefony.registerService("websocket", function(){
	
	// https://github.com/Worlize/WebSocket-Node/wiki/Documentation
	
	var websocket = class websocket extends nodefony.Service {

		constructor (httpKernel, security, options){

			super( "websocket", httpKernel.container, httpKernel.notificationsCenter , options  );

			this.httpKernel = httpKernel;
			this.port = this.httpKernel.kernel.httpPort ;
			this.domain = this.httpKernel.kernel.settings.system.domain ;
			this.firewall =  security ;
			this.kernel = this.httpKernel.kernel ;
			this.ready = false ;
			this.type = "WEBSOCKET";
		};
	
		logger (pci, severity, msgid,  msg){
			if (! msgid) msgid = "SERVICE WEBSOCKET ";
			return this.syslog.logger(pci, severity, msgid,  msg);
		};

		createServer (http){

			this.bundle.listen(this, "onServersReady", function(type, service){
				if ( type === "HTTP"){
					try {
						this.settings = this.get("container").getParameters("bundles.http").websocket || {} ;

						this.websocketServer =  new WebSocketServer.server(nodefony.extend({}, this.settings, {
							httpServer: http
						}));

											
						this.websocketServer.on('request', (request) => {
							var d = nodedomain.create();
								d.on('error', (er) => {
									if ( d.container ){
										this.httpKernel.onErrorWebsoket( d.container, er.stack)	
									}else{
										this.logger(er.stack, "ERROR");
									}
								});
								d.add(request);
								d.run( () => {
									this.fire("onServerRequest", request, null, this.type, d)
								});
						} );

						this.kernel.listen(this, "onTerminate",() => {
							if (this.websocketServer && this.ready){
								this.websocketServer.shutDown();
								this.logger(" SHUTDOWN WEBSOCKET Server is listening on DOMAIN : "+this.domain+"    PORT : "+this.port , "INFO");
							}
						});

						if ( this.websocketServer ){
							this.ready = true ;
							this.logger(" Server is listening on DOMAIN : ws://"+this.domain+":"+this.port , "INFO");
						}

						return this.websocketServer;
					}catch(e){
						this.logger(e);
						throw e ;	
					}
				}
			})
		};
	};
	
	return websocket;
});
