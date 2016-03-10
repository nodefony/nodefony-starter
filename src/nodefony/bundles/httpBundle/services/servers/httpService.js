/*
 * New node file
 */

var http = require('http');
var nodedomain = require('domain');

nodefony.registerService("http", function(){
	
	var Http = function(httpKernel , security, options){
		this.httpKernel = httpKernel ;
		this.port = this.httpKernel.kernel.httpPort ;
		this.domain = this.httpKernel.kernel.settings.system.domain ;
		this.firewall =  security ;
		this.kernel = this.httpKernel.kernel ;
		this.ready = false ;

	};
	
	Http.prototype.createServer = function(port, domain){
		this.settings = this.get("container").getParameters("bundles.http").http || null ;

		


		var logString ="HTTP";
		this.server = http.createServer(function(request, response){
			response.setHeader("Server", "nodefony");
			if ( this.kernel.settings.system.statics ){
				this.httpKernel.serverStatic.handle(request, response , function(){
					var d = nodedomain.create();
					d.on('error', function(er) {
						if ( d.container ){
							this.httpKernel.onError( d.container, er.stack)	
						}else{
							this.httpKernel.logger(er.stack);
						}
					}.bind(this));
					d.add(request);
					d.add(response);
					d.run(function() {
						this.kernel.fire("onServerRequest", request, response, logString, d)
					}.bind(this));
				}.bind(this));
			}else{
				var d = nodedomain.create();
				d.on('error', function(er) {
					if ( d.container ){
						this.httpKernel.onError( d.container, er.stack)	
					}else{
						this.httpKernel.logger(er.stack);
					}
				}.bind(this));
				d.add(request);
				d.add(response);
				d.run(function() {
					this.kernel.fire("onServerRequest", request, response, logString, d)
				}.bind(this));	
			}
		}.bind(this))

		
		if (this.settings.timeout){
			this.server.timeout = this.settings.timeout;
		}

		if (this.settings.maxHeadersCount ){
			this.server.maxHeadersCount = this.settings.maxHeadersCount;
		}

		// LISTEN ON PORT 
		this.server.listen(this.port, this.domain, function() {
			this.httpKernel.logger(logString+"  Server is listening on DOMAIN : "+this.domain+"    PORT : "+this.port , "INFO", "SERVER HTTP", "LISTEN");
			this.ready = true ;
		}.bind(this));

		this.server.on("error",function(error){
			var httpError = "server HTTP Error : "+error.errno;
			switch (error.errno){
				case "ENOTFOUND":
					this.httpKernel.logger( new Error(httpError+" CHECK DOMAIN IN /etc/hosts unable to connect to : "+this.domain));
				break;
				case "EADDRINUSE":
					this.httpKernel.logger( new Error(httpError+" port HTTP in use check other servers : ")) ;
				break;
				default :
					this.httpKernel.logger( new Error(httpError) );	
			}	
		}.bind(this));


		this.kernel.listen(this, "onTerminate",function(){
			if (this.server){
				this.server.close(function(){
					this.httpKernel.logger(" SHUTDOWN HTTP  Server is listening on DOMAIN : "+this.domain+"    PORT : "+this.port , "INFO");
				}.bind(this));
			}
		}.bind(this));

		this.server.on("clientError",function(e, socket){
			this.kernel.fire("onClientError", e, socket);
		}.bind(this));


		return this.server;

	};
	
	return Http;
});
