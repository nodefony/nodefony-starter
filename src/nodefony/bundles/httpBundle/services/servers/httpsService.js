/*
 * New node file
 */

var https = require('https');
var nodedomain = require('domain');

const dns = require('dns');

nodefony.registerService("https", function(){

	var checkPath = function(myPath, rootDir){
		if ( ! myPath ){
			return null ;
		}
		var abs = path.isAbsolute( myPath ) ;
		if ( abs ){
			return myPath ;
		}else{
			return rootDir+"/"+myPath ;
		}
	}

	var Https = class Https extends nodefony.Service {

		constructor (httpKernel , security, options){

			super( "https", httpKernel.container, httpKernel.notificationsCenter , options  );

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
			this.listen(this, "onBoot",function(){
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

		logger (pci, severity, msgid,  msg){
			if (! msgid) msgid = "SERVICE HTTPS ";
			return this.syslog.logger(pci, severity, msgid,  msg);
		};

		getCertificats (){
			this.settings = this.get("container").getParameters("bundles.http").https || null ;
			var opt = {
				keyPath:checkPath(this.settings.certificats.key, this.kernel.rootDir ),
				certPath:checkPath(this.settings.certificats.cert, this.kernel.rootDir),
				caPath:checkPath(this.settings.certificats.ca, this.kernel.rootDir),
				key:null,
				cert:null,
				ca:null
			};
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
		};
	
		createServer (port, domain){
			
			try {
				var opt = this.getCertificats();
				for (var ele in opt ){
					switch ( ele ){
						case "keyPath" :
							this.logger( " READ CERTIFICATE KEY : "+opt[ele], "DEBUG"); 
						break;
						case "certPath" :
							this.logger( " READ CERTIFICATE CERT : "+opt[ele], "DEBUG"); 
						break;
						case "caPath" :
							if ( opt[ele] ){
								this.logger( " READ CERTIFICATE CA : "+opt[ele], "DEBUG"); 
							}else{
								this.logger( " NO CERTIFICATE CA : "+opt[ele], "WARNING");	
							}
						break;
					}
				}
			}catch(e){
				this.logger(e);
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
								this.logger(er.stack , "ERROR", "SERVICE HTTPS");
							}
						});
						d.add(request);
						d.add(response);
						d.run( () => {
							this.fire("onServerRequest", request, response, this.type, d)
						});
					});
				}else{
					var d = nodedomain.create();
					d.on('error', (er) => {
						if ( d.container ){
							this.httpKernel.onError( d.container, er.stack)	
						}else{
							this.logger(er.stack,"ERROR");
						}
					});
					d.add(request);
					d.add(response);
					d.run( () => {
						this.fire("onServerRequest", request, response, this.type, d)
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
						this.logger( new Error(httpError+" port HTTPS in use check other servers : "), "CRITIC");
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
		};
	};
	
	return Https;
});
