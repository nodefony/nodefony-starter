/*
 * New node file
 */


var WebSocketServer = require('websocket');
var nodedomain = require('domain');


nodefony.registerService("websocket", function(){
	
	// https://github.com/Worlize/WebSocket-Node/wiki/Documentation
	
	var websocket = function(httpKernel, security, options){
		this.httpKernel = httpKernel;
		this.port = this.httpKernel.kernel.httpPort ;
		this.domain = this.httpKernel.kernel.settings.system.domain ;
		this.firewall =  security ;
		this.kernel = this.httpKernel.kernel ;
	};
	
	websocket.prototype.createServer = function(http){

		this.settings = this.get("container").getParameters("bundles.http").websocket || {} ;

		this.websocketServer =  new WebSocketServer.server(nodefony.extend({}, this.settings, {
			httpServer: http
		}));
			
		this.httpKernel.logger(" Server is listening on DOMAIN : "+this.domain+"    PORT : "+this.port , "INFO", "SERVER WEBSOCKET");

		var logString =  "WEBSOCKET";
		this.websocketServer.on('request', function(request) {
			var d = nodedomain.create();
				d.on('error', function(er) {
					if ( d.container ){
						this.httpKernel.onErrorWebsoket( d.container, er.stack)	
					}else{
						this.httpKernel.logger(er.stack);
					}
				}.bind(this));
				d.add(request);
				d.run(function() {
					this.kernel.fire("onServerRequest", request, null, logString, d)
				}.bind(this));
		}.bind(this));

		this.kernel.listen(this, "onTerminate",function(){
			if (this.websocketServer){
				this.websocketServer.shutDown();
				this.httpKernel.logger(" SHUTDOWN WEBSOCKET Server is listening on DOMAIN : "+this.domain+"    PORT : "+this.port , "INFO", "SERVER WEBSOCKET");
			}
		}.bind(this));

		return this.websocketServer;
	};
	
	return websocket;
});
