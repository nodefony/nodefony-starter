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
		this.type = "HTTP";
		this.address = null ;
		this.family = null ;

		this.kernel.listen(this, "onBoot",function(){
			this.bundle = this.kernel.getBundles("http") ;
			this.bundle.listen(this, "onServersReady", function(type, service){
				if ( type === this.type){
					dns.lookup(this.domain,function(err, addresses, family){
						this.address = addresses ;
						this.family = family ;
					}.bind(this))
				}
			})
		});
	};

	Http.prototype.createZone = function(request, response){

		require("zone").enable();
		zone.create(function httpZone() {
			this.kernel.fire("onServerRequest", request, response, this.type, zone)
		}.bind(this))
		.then(function(result) {
			// Runs when succesful
			this.httpKernel.logger("ZONE SUCCES","INFO");
		}.bind(this))
		.catch(function(err) {
			this.httpKernel.logger(err);
		}.bind(this));
	}
	
	Http.prototype.createServer = function(port, domain){
		this.settings = this.get("container").getParameters("bundles.http").http || null ;

		this.server = http.createServer(function(request, response){
			response.setHeader("Server", "nodefony");
			if ( this.kernel.settings.system.statics ){
				this.httpKernel.serverStatic.handle(request, response , function(){
					//this.createZone(request, response);
					var d = nodedomain.create();
					d.on('error', function(er) {
						if ( d.container ){
							this.httpKernel.onError( d.container, er.stack,  "ERROR", "SERVICE HTTP")	
						}else{
							this.httpKernel.logger(er.stack, "ERROR", "SERVICE HTTP");
						}
					}.bind(this));
					d.add(request);
					d.add(response);
					d.run(function() {
						this.kernel.fire("onServerRequest", request, response, this.type, d)
					}.bind(this));
				}.bind(this));
			}else{
				var d = nodedomain.create();
				d.on('error', function(er) {
					if ( d.container ){
						this.httpKernel.onError( d.container, er.stack)	
					}else{
						this.httpKernel.logger(er.stack, "ERROR", "SERVICE HTTP");
					}
				}.bind(this));
				d.add(request);
				d.add(response);
				d.run(function() {
					this.kernel.fire("onServerRequest", request, response, this.type, d)
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
			this.httpKernel.logger(this.type+"  Server is listening on DOMAIN : http://"+this.domain+":"+this.port , "INFO", "SERVICE HTTP", "LISTEN");
			this.ready = true ;
			this.bundle.fire("onServersReady", this.type, this);
		}.bind(this));

		this.server.on("error",function(error){
			var httpError = "server HTTP Error : "+error.errno;
			switch (error.errno){
				case "ENOTFOUND":
					this.httpKernel.logger( new Error(httpError+" CHECK DOMAIN IN /etc/hosts unable to connect to : "+this.domain), "CRITIC", "SERVICE HTTPS");
				break;
				case "EADDRINUSE":
					this.httpKernel.logger( new Error(httpError+" port HTTP in use check other servers : "), "CRITIC", "SERVICE HTTPS") ;
				break;
				default :
					this.httpKernel.logger( new Error(httpError) ,"CRITIC", "SERVICE HTTPS");	
			}	
		}.bind(this));


		this.kernel.listen(this, "onTerminate",function(){
			if (this.server){
				this.server.close(function(){
					this.httpKernel.logger(" SHUTDOWN HTTP Server is listening on DOMAIN : "+this.domain+"    PORT : "+this.port , "INFO");
				}.bind(this));
			}
		}.bind(this));

		this.server.on("clientError",function(e, socket){
			this.kernel.fire("onClientError", e, socket);
			socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
		}.bind(this));


		return this.server;

	};
	
	return Http;
});
