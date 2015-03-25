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
		this.request = new nodefony.Request( request , container);
		this.response = new nodefony.Response( response , container);
		this.session = null;
		this.cookies = {};
		this.secureArea = null ;
		this.kernel = this.container.get("kernel") ;
		this.domain =  this.container.getParameters("kernel").system.domain;

		this.logger("request from :"+request.headers.host+" METHOD : "+request.method+" URL :"+request.url, "INFO", null, {
			host:request.headers.host ,
			domain:this.domain,
			url:request.url,
			method:request.method,
			protocol:this.type
		});

		//parse cookies
		this.parseCookies();
		
		this.security = null ;
		this.user = null ;

		//  manage EVENTS
		this.notificationsCenter = nodefony.notificationsCenter.create();
		this.container.set("notificationsCenter", this.notificationsCenter);

		this.url = this.request.url.href;
		this.remoteAddress = this.request.remoteAdress ; 

		// LISTEN EVENTS KERNEL 
		this.notificationsCenter.listen(this, "onView", function(result, context){
			this.response.body = result;
		}.bind(this));
		this.notificationsCenter.listen(this, "onResponse", this.send);
		this.notificationsCenter.listen( this, "onRequest" , this.handle );

	};

	Http.prototype.handle = function(container, request , response, data){
		var get = this.container.setParameters("query.get", this.request.queryGet );
		if (this.request.queryPost  )
			var post = this.container.setParameters("query.post", this.request.queryPost );
		if (this.request.queryPost  )
			var post = this.container.setParameters("query.files", this.request.queryFile );
		this.container.setParameters("query.request", this.request.query );

		/*
 		 *	TRANSLATION
 		 */
		this.container.get("translation").handle( request , response);

		/*
 		 *	TRY resolve
 		 */
		try {
			this.resolver = this.get("router").resolve(this.container, this.request);
			//WARNING EVENT KERNEL
			this.kernel.fire("onRequest", this, this.resolver);	
			if (this.resolver.resolve) {
				return  this.resolver.callController(data);
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
		/*
 	 	* WRITE RESPONSE
 	 	*/  
		this.response.write();
		// END REQUEST
		return this.close();
	};

	Http.prototype.flush = function(data, encoding){
		return this.response.flush(data, encoding);	
	}

	Http.prototype.close = function(){
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
		this.notificationsCenter.fire("onResponse", this.response, this.context);
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
