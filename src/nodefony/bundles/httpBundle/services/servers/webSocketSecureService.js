/*
 * New node file
 */


var WebSocketServer = require('websocket');
var nodedomain = require('domain');


nodefony.registerService("websocketSecure", function(){
	
	// https://github.com/Worlize/WebSocket-Node/wiki/Documentation

	var websocket = function(httpKernel, security, options){
		this.httpKernel = httpKernel;
		this.port = this.httpKernel.kernel.httpsPort ;
		this.domain = this.httpKernel.kernel.settings.system.domain ;
		this.firewall =  security ;
		this.kernel = this.httpKernel.kernel ;
		this.ready = false ;
	};
	
	websocket.prototype.createServer = function(http, settings){

		this.settings = this.get("container").getParameters("bundles.http").websocketSecure || {} ;

		this.websocketServer =  new WebSocketServer.server(nodefony.extend({}, this.settings, {
			httpServer: http
		}));
			
		if ( this.websocketServer ){
			this.ready = true ;
			this.httpKernel.logger(" Server  is listening on DOMAIN : wss://"+this.domain+":"+this.port , "INFO", "SERVICE WEBSOCKET SECURE");
		}

		var logString =  "WEBSOCKET SECURE";
		this.websocketServer.on('request', function(request) {
			var d = nodedomain.create();
				d.on('error', function(er) {
					if ( d.container ){
						this.httpKernel.onErrorWebsoket( d.container, er.stack)	
					}else{
						this.httpKernel.logger(er.stack, "ERROR", "SERVICE WEBSOCKET SECURE");
					}
				}.bind(this));
				d.add(request);
				d.run(function() {
					this.kernel.fire("onServerRequest", request, null, logString, d)
				}.bind(this));
		}.bind(this));

		this.kernel.listen(this, "onTerminate",function(){
			if ( this.websocketServer && this.ready ){
				this.websocketServer.shutDown();
				this.httpKernel.logger(" SHUTDOWN WEBSOCKET SECURE Server is listening on DOMAIN : "+this.domain+"    PORT : "+this.port , "INFO", "SERVICE WEBSOCKET SECURE");
			}
		}.bind(this));

		return this.websocketServer;
	};
	
	return websocket;
});
