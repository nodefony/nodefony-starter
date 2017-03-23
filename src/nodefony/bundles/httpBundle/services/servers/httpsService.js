/*
 * New node file
 */

//var https = require('https');
//var nodedomain = require('domain');

nodefony.registerService("https", function(){

	var Https = class Https extends nodefony.Service {

		constructor (httpKernel , security, options){

			super( "https", httpKernel.container, httpKernel.notificationsCenter , options  );

			this.httpKernel = httpKernel;
			this.port = this.httpKernel.kernel.httpsPort ;
			this.domain = this.httpKernel.kernel.settings.system.domain ;
			this.firewall =  security ;
			this.ready = false ;
			this.settings = this.kernel.settings.system.servers || null ;

			this.key = null ;
			this.cert = null ;
			this.ca = null ;
			this.address = null ;
			this.family = null ;

			this.type = "HTTPS";
			this.listen(this, "onBoot",function(){
				this.bundle = this.kernel.getBundles("http") ;
				this.bundle.listen(this, "onServersReady", function(type){
					if ( type === this.type){
						dns.lookup(this.domain,(err, addresses, family) => {
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
			if (! msgid) {msgid = "SERVICE HTTPS ";}
			return this.syslog.logger(pci, severity, msgid,  msg);
		}

		getCertificats (){
			var bundleOptions = this.getParameters("bundles.http").https.certificats || null ;
			var opt = nodefony.extend( true, {
				keyPath: this.kernel.checkPath(this.settings.certificats.key),
				certPath: this.kernel.checkPath(this.settings.certificats.cert),
				caPath: this.kernel.checkPath(this.settings.certificats.ca),
				key: null,
				cert: null,
				ca: null
			},bundleOptions ) ;
			try {
				this.key = fs.readFileSync(opt.keyPath) ;
				opt.key = this.key ;
				this.cert = fs.readFileSync(opt.certPath) ;
				opt.cert = this.cert ;
				if ( opt.caPath ){
					this.ca = fs.readFileSync(opt.caPath) ;
					opt.ca = this.ca;
				}
			}catch(e){
				throw e ;
			}
			return opt ;
		}
	
		createServer (/*port, domain*/){
			try {
				this.options = this.getCertificats();
				for (var ele in this.options ){
					switch ( ele ){
						case "keyPath" :
							this.logger( " READ CERTIFICATE KEY : "+this.options[ele], "DEBUG"); 
						break;
						case "certPath" :
							this.logger( " READ CERTIFICATE CERT : "+this.options[ele], "DEBUG"); 
						break;
						case "caPath" :
							if ( this.options[ele] ){
								this.logger( " READ CERTIFICATE CA : "+this.options[ele], "DEBUG"); 
							}else{
								this.logger( " NO CERTIFICATE CA : "+this.options[ele], "WARNING");	
							}
						break;
					}
				}
			}catch(e){
				this.logger(e);
				throw e ;	
			}

			this.options = nodefony.extend(this.options, this.settings.certificats.options);

			this.server = https.createServer(this.options, (request, response) => {
				response.setHeader("Server", "nodefony");
				if (  this.kernel.settings.system.statics ){
					this.httpKernel.serverStatic.handle(request, response , () => {
						/*var d = nodedomain.create();
						d.on('error', (er) => {
							if ( d.container ){
								this.httpKernel.onError( d.container, er.stack);
							}else{
								this.logger(er.stack , "ERROR", "SERVICE HTTPS");
							}
						});
						d.add(request);
						d.add(response);
						d.run( () => {
							this.fire("onServerRequest", request, response, this.type, d);
						});*/
						this.fire("onServerRequest", request, response, this.type);
					});
				}else{
					/*var d = nodedomain.create();
					d.on('error', (er) => {
						if ( d.container ){
							this.httpKernel.onError( d.container, er.stack);
						}else{
							this.logger(er.stack,"ERROR");
						}
					});
					d.add(request);
					d.add(response);
					d.run( () => {
						this.fire("onServerRequest", request, response, this.type, d);
					});*/	
					this.fire("onServerRequest", request, response, this.type);
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
				this.logger(this.type+"  Server is listening on DOMAIN : https://"+this.domain+":"+this.port , "INFO");
				this.ready = true ;
				this.bundle.fire("onServersReady", this.type, this);
			});

			this.server.on("error",(error) => {
				var httpError = "server HTTPS Error : "+error.errno;
				switch (error.errno){
					case "ENOTFOUND":
						this.logger( new Error(httpError+" CHECK DOMAIN IN /etc/hosts unable to connect to : "+this.domain), "CRITIC");
					break;
					case "EADDRINUSE":
						//this.logger( new Error(httpError+" port HTTPS in use check other servers : "), "CRITIC");
						this.logger( new Error("Domain : " +this.domain+" Port : "+this.port +" ==> " + error) ,"CRITIC");
						setTimeout(() => {
      							this.server.close();
    						}, 1000);
					break;
					default :
						this.logger( new Error(httpError), "CRITIC" );	
				}	
			});

			this.server.on("clientError",(e, socket) => {
				this.fire("onClientError", e, socket);
				socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
			});

			this.listen(this, "onTerminate", () => {
				if (this.server){
					this.server.close( () => {
						this.logger(" SHUTDOWN HTTPS  Server is listening on DOMAIN : "+this.domain+"    PORT : "+this.port , "INFO");
					});
				}
			});

			return this.server;
		}
	};
	return Https;
});
