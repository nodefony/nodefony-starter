/*
 *
 *
 *
 *
 *
 */
var fs = require("fs");
var url = require("url");

nodefony.register.call(nodefony.io.transports, "http", function(){

	/*
 	 *
 	 *
 	 *
 	 *
 	 */
	var Http = function(container, request, response, type){
		this.type = type;
		this.container = container; 
		

		//  manage EVENTS
		this.notificationsCenter = nodefony.notificationsCenter.create();
		this.container.set("notificationsCenter", this.notificationsCenter);

		this.resolver = null ;
		this.request = new nodefony.Request( request, container, type);
		this.response = new nodefony.Response( response, container, type);
		this.session = null;
		this.sessionService = this.get("sessions");
		this.sessionAutoStart = this.sessionService.settings.start ; 
		this.cookies = {};
		this.isAjax = this.request.isAjax() ;
		this.secureArea = null ;
		this.showDebugBar = true ;
		this.kernel = this.container.get("kernel") ;
		if ( this.kernel.environment === "dev" ){
			this.autoloadCache = {
				bundles:{}
			} ;
		}
		this.kernelHttp = this.container.get("httpKernel");
		this.domain =  this.request.domain ; 
		this.validDomain = this.isValidDomain() ;

		this.logger("REQUEST "+request.method +" FROM : "+ this.request.remoteAdress +" HOST : "+request.headers.host+" URL :"+request.url, "INFO");

		//parse cookies
		this.parseCookies();
		
		this.security = null ;
		this.user = null ;

		this.url =url.format(this.request.url);
		this.remoteAddress = this.request.remoteAdress ; 

		// LISTEN EVENTS KERNEL 
		this.notificationsCenter.listen(this, "onView", function(result, context, view, param){
			this.response.body = result;
		}.bind(this));
		this.notificationsCenter.listen(this, "onResponse", this.send);
		this.notificationsCenter.listen( this, "onRequest" , this.handle );
		this.notificationsCenter.listen( this, "onTimeout" , function(context){
			this.notificationsCenter.fire("onError", this.container, {
				status:408,
				message:new Error("Timeout :" + this.url)
			} );	
			//context.clean();
		} );
	};

	Http.prototype.isValidDomain = function(){
		return this.kernelHttp.isDomainAlias(  this.getHostName() );
	}

	Http.prototype.getRemoteAdress = function(){
		return this.request.getRemoteAdress() ;
	};

	Http.prototype.getHost = function(){
		return this.request.getHost() ;
	};

	Http.prototype.getHostName = function(){
		return this.request.getHostName() ;
	};


	Http.prototype.getUserAgent = function(){
		return this.request.getUserAgent();
	};

	Http.prototype.getMethod = function(){
		return this.request.getMethod() ;
	};


	Http.prototype.handle = function(container, request , response, data){
		var get = this.container.setParameters("query.get", this.request.queryGet );
		if (this.request.queryPost  )
			var post = this.container.setParameters("query.post", this.request.queryPost );
		if (this.request.queryFile  )
			var post = this.container.setParameters("query.files", this.request.queryFile );
		this.container.setParameters("query.request", this.request.query );

		/*
 		 *	TRANSLATION
 		 */
		this.container.get("translation").handle( this);

		/*
 		 *	TRY resolve
 		 */
		try {
			if (!  this.resolver ){
				this.resolver = this.get("router").resolve(this.container, this.request);
			}
			//WARNING EVENT KERNEL
			this.kernel.fire("onRequest", this, this.resolver);	
			if (this.resolver.resolve) {
				// timeout response 
				this.response.response.setTimeout(this.response.timeout, function(){
					this.notificationsCenter.fire("onTimeout", this);
				}.bind(this))
				var ret = this.resolver.callController(data);
				return ret ;
			}
			/*
 			 *	NOT FOUND
 			 */
			this.notificationsCenter.fire("onError", this.container, {
						status:404,
						error:"URI :" + request.url,
						message:"not Found"
			});
		}catch(e){
			/*
 			 *	ERROR IN CONTROLLER 
 			 */
			this.notificationsCenter.fire("onError", this.container, e);		
		}
	}


	Http.prototype.clean = function(){
		this.request.clean();
		delete 	this.request ;
		this.response.clean();
		delete 	this.response ;
		delete  this.notificationsCenter ;
		delete  this.session ;
		delete  this.cookies ;
		if (this.proxy) delete this.proxy ;
		if (this.user)  delete this.user
		if (this.security ) delete this.security ;
		delete this.container ;
		//if (this.profiling) delete context.profiling ;
	}

	Http.prototype.getUser = function(){
		return this.user || null ; 	
	};


	Http.prototype.send = function(response, context){
		if (response.response.headersSent )
			return this.close();
		switch (true){
			case response instanceof  http.ServerResponse :
				this.response = response;
			break ;
			//case response instanceof nodefony.Response :
			//break ;
		}
		// cookies
		this.response.setCookies();
		/*
 		* HTTP WRITE HEAD  
 		*/
		this.response.writeHead();

		this.notificationsCenter.fire("onSend", response, context);
		if ( ! context.profiling ){
			/*
 	 		* WRITE RESPONSE
 	 		*/  
			this.response.write();
			// END REQUEST
			return this.close();
		}
		this.notificationsCenter.fire("onSendMonitoring", response, context);
	};

	Http.prototype.flush = function(data, encoding){
		return this.response.flush(data, encoding);	
	}

	Http.prototype.close = function(){
		//console.log("CLOSE CONTEXT")
		this.notificationsCenter.fire("onClose", this);
		// END REQUEST
		return this.response.end();
	};
	
	Http.prototype.logger = function(pci, severity, msgid,  msg){
		var syslog = this.container.get("syslog");
		if (! msgid) msgid = this.type + " REQUEST";
		return syslog.logger(pci, severity, msgid,  msg);
	};

	Http.prototype.listen = function(){
		return this.notificationsCenter.listen.apply(this.notificationsCenter, arguments);
	};
	Http.prototype.fire = function(){
		return this.notificationsCenter.fire.apply(this.notificationsCenter, arguments);
	};


	Http.prototype.getRequest = function(){
		return this.request;	
	};

	Http.prototype.getResponse = function(){
		return this.response;	
	};

	Http.prototype.get = function(name){
		if (this.container)
			return this.container.get(name);
		return null;
	};

	Http.prototype.set = function(name, obj){
		if (this.container)
			return this.container.set(name, obj);
		return null;
	};

	Http.prototype.redirect = function(Url, status){
		if (typeof Url === "object")
			this.response.redirect(url.format(Url), status)
		else	
			this.response.redirect(Url, status)
		this.notificationsCenter.fire("onResponse", this.response, this);
	};

	Http.prototype.redirectHttps = function( status ){
		if( this.proxy ){
			var port = ""  ;
		}else{
			var port = this.kernelHttp.httpsPort || 443 ;
		}
		var urlChange = nodefony.extend({}, this.request.url , {
			protocol:	"https",
			port:		port ,
			href:		"",
			host:		""
		})
		var newUrl  = url.format(urlChange);
		this.response.redirect( newUrl, status );
		this.notificationsCenter.fire("onResponse", this.response, this);
	};

	Http.prototype.setXjson  = function( xjson){
		switch ( nodefony.typeOf(xjson) ){
			case "object":
				this.response.headers["X-Json"] = JSON.stringify(xjson);
				return xjson;
			break;
			case "string":
				this.response.headers["X-Json"] = xjson;
				return JSON.parse(xjson);
			break;
			case "Error":
				if ( typeof xjson.message === "Object" ){
					this.response.headers["X-Json"] = JSON.stringify(xjson.message);
					return xjson.message;	
				}else{
					this.response.headers["X-Json"] = xjson.message;
					return {error:xjson.message};	
				}
			break;
		}
	};

	// connect intrusif in prototype response.on('header') https://github.com/visionmedia/express/wiki/Migrating-from-3.x-to-4.x
	/*Http.prototype.setCookie = function(cookie){
		if ( cookie instanceof nodefony.cookies.cookie ){
			this.response.response.on('header', function(){
				this.logger("ADD COOKIE ==> " + cookie.serialize(), "DEBUG")	
				this.response.setHeader('Set-Cookie', cookie.serialize());
			}.bind(this))

		}else{
			throw {
				message:"",
				error:"Context HTTP setCookie not valid cookies"
			}
		}
	};*/

	Http.prototype.addCookie = function(cookie){
		if ( cookie instanceof nodefony.cookies.cookie ){
			this.cookies[cookie.name] = cookie;
		}else{
			throw {
				message:"",
				error:"Response addCookies not valid cookies"
			}
		}	
	};

	Http.prototype.parseCookies = function(){
		return  nodefony.cookies.cookiesParser(this);
	};

	return Http 
});
