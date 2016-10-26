/*
 * New node file
 */

var https = require('https');
var nodedomain = require('domain');
var Path = require("path");

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

	var Https = function(httpKernel , security, options){
		this.httpKernel = httpKernel;
		this.port = this.httpKernel.kernel.httpsPort ;
		this.domain = this.httpKernel.kernel.settings.system.domain ;
		this.firewall =  security ;
		this.kernel = this.httpKernel.kernel ;
		this.ready = false ;
		
	};
	
	
	Https.prototype.createServer = function(port, domain){
		this.settings = this.get("container").getParameters("bundles.http").https || null ;
		
		var key = checkPath(this.settings.certificats.key, this.kernel.rootDir );
		var cert = checkPath(this.settings.certificats.cert, this.kernel.rootDir);
		var ca = checkPath(this.settings.certificats.ca, this.kernel.rootDir);
		var opt = {
			key: fs.readFileSync(key),
			cert:fs.readFileSync(cert)
		};
		if ( ca ){
			opt["ca"] = fs.readFileSync(ca);
		}

		this.options = nodefony.extend(opt, this.settings.certificats.options);

		var logString ="HTTPS";
		this.server = https.createServer(this.options, function(request, response){
			response.setHeader("Server", "nodefony");
			if (  this.kernel.settings.system.statics ){
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
		}.bind(this));

		if (this.settings.timeout){
			this.server.timeout = this.settings.timeout;
		}

		if (this.settings.maxHeadersCount ){
			this.server.maxHeadersCount = this.settings.maxHeadersCount;
		}

		// LISTEN ON PORT 
		this.server.listen(this.port, this.domain, function() {
			this.httpKernel.logger(logString+"  Server is listening on DOMAIN : "+this.domain+"    PORT : "+this.port , "INFO", "SERVER HTTPS", "LISTEN");
			this.ready = true ;
		}.bind(this));

		this.server.on("error",function(error){
			var httpError = "server HTTPS Error : "+error.errno;
			switch (error.errno){
				case "ENOTFOUND":
					this.httpKernel.logger( new Error(httpError+" CHECK DOMAIN IN /etc/hosts unable to connect to : "+this.domain));
				break;
				case "EADDRINUSE":
					this.httpKernel.logger( new Error(httpError+" port HTTPS in use check other servers : "));
				break;
				default :
					this.httpKernel.logger( new Error(httpError) );	
			}	
		}.bind(this));

		this.server.on("clientError",function(e, socket){
			this.kernel.fire("onClientError", e, socket);
			socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
		}.bind(this));



		this.kernel.listen(this, "onTerminate",function(){
			if (this.server){
				this.server.close(function(){
					this.httpKernel.logger(" SHUTDOWN HTTPS  Server is listening on DOMAIN : "+this.domain+"    PORT : "+this.port , "INFO");
				}.bind(this));
			}
		}.bind(this));

		return this.server;

	};
	
	return Https;
});
