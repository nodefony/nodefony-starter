/*
 * New node file
 */

var https = require('https');
var nodedomain = require('domain');
var Path = require("path");

const dns = require('dns');

nodefony.registerService("https", function(){

	var checkPath = function(myPath, rootDir){
		if ( ! myPath ){
			return null ;
		}
		var abs = Path.isAbsolute( myPath ) ;
		if ( abs ){
			return myPath ;
		}else{
			return rootDir+"/"+myPath ;
		}
	}

	var Https = class Https {

		constructor (httpKernel , security, options){
			this.httpKernel = httpKernel;
			this.port = this.httpKernel.kernel.httpsPort ;
			this.domain = this.httpKernel.kernel.settings.system.domain ;
			this.firewall =  security ;
			this.kernel = this.httpKernel.kernel ;
			this.ready = false ;

			this.key = null ;
			this.cert = null ;
			this.ca = null ;
			this.address = null ;
			this.family = null ;

			this.type = "HTTPS";
			this.kernel.listen(this, "onBoot",function(){
				this.bundle = this.kernel.getBundles("http") ;
				this.bundle.listen(this, "onServersReady", function(type, service){
					if ( type === this.type){
						dns.lookup(this.domain,(err, addresses, family) => {
							this.address = addresses ;
							this.family = family ;
						})
					}
				})
			});
		};

		getCertificats (){
			this.settings = this.get("container").getParameters("bundles.http").https || null ;

			var key = checkPath(this.settings.certificats.key, this.kernel.rootDir );
			var cert = checkPath(this.settings.certificats.cert, this.kernel.rootDir);
			var ca = checkPath(this.settings.certificats.ca, this.kernel.rootDir);

			try {
				this.key = fs.readFileSync(key) ;
				this.cert = fs.readFileSync(cert) ;
				if ( ca ){
					this.ca = fs.readFileSync(ca) ;
				}

				var opt = {
					key: this.key,
					cert:this.cert
				};
				if ( this.ca ){
					opt["ca"] = this.ca;
				}
			}catch(e){
				throw e ;
			}
			return opt ;
		};
	
	
		createServer (port, domain){
			
			try {
				var opt = this.getCertificats();
			}catch(e){
				this.httpKernel.logger(e);
				throw e ;	
			}

			this.options = nodefony.extend(opt, this.settings.certificats.options);

			this.server = https.createServer(this.options, (request, response) => {
				response.setHeader("Server", "nodefony");
				if (  this.kernel.settings.system.statics ){
					this.httpKernel.serverStatic.handle(request, response , () => {
						var d = nodedomain.create();
						d.on('error', (er) => {
							if ( d.container ){
								this.httpKernel.onError( d.container, er.stack)	
							}else{
								this.httpKernel.logger(er.stack , "ERROR", "SERVICE HTTPS");
							}
						});
						d.add(request);
						d.add(response);
						d.run( () => {
							this.kernel.fire("onServerRequest", request, response, this.type, d)
						});
					});
				}else{
					var d = nodedomain.create();
					d.on('error', (er) => {
						if ( d.container ){
							this.httpKernel.onError( d.container, er.stack)	
						}else{
							this.httpKernel.logger(er.stack,"ERROR", "SERVICE HTTPS");
						}
					});
					d.add(request);
					d.add(response);
					d.run( () => {
						this.kernel.fire("onServerRequest", request, response, this.type, d)
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
				this.httpKernel.logger(this.type+"  Server is listening on DOMAIN : https://"+this.domain+":"+this.port , "INFO", "SERVICE HTTPS", "LISTEN");
				this.ready = true ;
				this.bundle.fire("onServersReady", this.type, this);
			});

			this.server.on("error",(error) => {
				var httpError = "server HTTPS Error : "+error.errno;
				switch (error.errno){
					case "ENOTFOUND":
						this.httpKernel.logger( new Error(httpError+" CHECK DOMAIN IN /etc/hosts unable to connect to : "+this.domain), "CRITIC", "SERVICE HTTPS");
					break;
					case "EADDRINUSE":
						this.httpKernel.logger( new Error(httpError+" port HTTPS in use check other servers : "), "CRITIC", "SERVICE HTTPS");
					break;
					default :
						this.httpKernel.logger( new Error(httpError), "CRITIC" );	
				}	
			});

			this.server.on("clientError",(e, socket) => {
				this.kernel.fire("onClientError", e, socket);
				socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
			});



			this.kernel.listen(this, "onTerminate", () => {
				if (this.server){
					this.server.close( () => {
						this.httpKernel.logger(" SHUTDOWN HTTPS  Server is listening on DOMAIN : "+this.domain+"    PORT : "+this.port , "INFO", "SERVICE HTTPS");
					});
				}
			});

			return this.server;
		};
	};
	
	return Https;
});
