/*
 * New node file
 */

//var http = require('http');
//var nodedomain = require('domain');

nodefony.registerService("http", function(){
	
	var Http = class Http extends nodefony.Service {

		constructor (httpKernel , security, options ){

			super( "http", httpKernel.container, httpKernel.notificationsCenter , options  );

			this.httpKernel = httpKernel ;
			this.port = this.httpKernel.kernel.httpPort ;
			this.domain = this.httpKernel.kernel.settings.system.domain ;
			this.firewall =  security ;
			this.kernel = this.httpKernel.kernel ;
			this.ready = false ;
			this.type = "HTTP";
			this.address = null ;
			this.family = null ;

			this.listen(this, "onBoot",function(){
				this.bundle = this.kernel.getBundles("http") ;
				this.bundle.listen(this, "onServersReady", function(type){
					if ( type === this.type){
						dns.lookup(this.domain, (err, addresses, family) => {
							if ( err ){
								throw err ;
							}
							this.address = addresses ;
							this.family = family ;
						});
					}
				});
			});
		}

		logger (pci, severity, msgid,  msg){
			if (! msgid) { msgid = "SERVICE HTTP ";}
			return this.syslog.logger(pci, severity, msgid,  msg);
		}

		createZone (request, response){

			require("zone").enable();
			zone.create( () => {
				this.fire("onServerRequest", request, response, this.type, zone);
			})
			.then(() => {
				// Runs when succesful
				this.logger("ZONE SUCCES","INFO");
			})
			.catch( (err) => {
				this.logger(err);
			});
		}
	
		createServer (/*port, domain*/){
			this.settings = this.get("container").getParameters("bundles.http").http || null ;

			this.server = http.createServer((request, response) => {
				response.setHeader("Server", "nodefony");
				if ( this.kernel.settings.system.statics ){
					this.httpKernel.serverStatic.handle(request, response , () => {
						//this.createZone(request, response);
						var d = nodedomain.create();
						d.on('error', (er) => {
							if ( d.container ){
								this.httpKernel.onError( d.container, er.stack,  "ERROR");
							}else{
								this.logger(er.stack, "ERROR");
							}
						});
						d.add(request);
						d.add(response);
						d.run(() => {
							this.fire("onServerRequest", request, response, this.type, d);
						});
					});
				}else{
					var d = nodedomain.create();
					d.on('error', (er) => {
						if ( d.container ){
							this.httpKernel.onError( d.container, er.stack);
						}else{
							this.logger(er.stack, "ERROR");
						}
					});
					d.add(request);
					d.add(response);
					d.run( () => {
						this.fire("onServerRequest", request, response, this.type, d);
					});	
				}
			});
			
			if (this.settings.timeout){
				this.server.timeout = this.settings.timeout;
			}

			if (this.settings.maxHeadersCount ){
				this.server.maxHeadersCount = this.settings.maxHeadersCount;
			}

			// LISTEN ON PORT 
			this.server.listen(this.port, this.domain, () => {
				this.logger(this.type+"  Server is listening on DOMAIN : http://"+this.domain+":"+this.port , "INFO");
				this.ready = true ;
				this.bundle.fire("onServersReady", this.type, this);
			});

			this.server.on("error",(error) => {
				var httpError = "server HTTP Error : "+error.errno;
				switch (error.errno){
					case "ENOTFOUND":
						this.logger( new Error(httpError+" CHECK DOMAIN IN /etc/hosts unable to connect to : "+this.domain), "CRITIC");
					break;
					case "EADDRINUSE":
						//this.logger( new Error(httpError+" port HTTP in use check other servers : "), "CRITIC") ;
						this.logger( new Error("Domain : " +this.domain+" Port : "+this.port +" ==> " + error) ,"CRITIC");
						setTimeout(() => {
      							this.server.close();
    						}, 1000);
					break;
					default :
						this.logger( new Error(httpError) ,"CRITIC", "SERVICE HTTPS");	
				}	
			});

			this.listen(this, "onTerminate",() => {
				if (this.server){
					this.server.close(() => {
						this.logger(" SHUTDOWN HTTP Server is listening on DOMAIN : "+this.domain+"    PORT : "+this.port , "INFO");
					});
				}
			});

			this.server.on("clientError",(e, socket) =>{
				this.fire("onClientError", e, socket);
				socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
			});

			return this.server;
		}
	};
	return Http;
});
