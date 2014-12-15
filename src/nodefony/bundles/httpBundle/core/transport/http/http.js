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
	var Http = function(container, request, response){
		this.type = "HTTP";
		this.container = container; 
		this.request = new nodefony.Request( request , this.container);
		this.response = new nodefony.Response( response , this.container);
		this.session = null;
		this.cookies = [];
		this.secureArea = null ;
		this.domain =  this.container.getParameters("kernel").system.domain;
		
		//this.Authenticate = this.get("Authenticate");
		this.notificationsCenter = this.get("notificationsCenter");
		this.url = this.request.url.href;
		// LISTEN EVENTS KERNEL 
		this.notificationsCenter.listen(this, "onView", function(result){
			this.response.body = result;
		}.bind(this));
		this.notificationsCenter.listen(this, "onResponse", this.send);
		this.notificationsCenter.listen( this, "onRequest" , this.handle );
		this.remoteAddress = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
	};

	Http.prototype.handle = function(container, request , response, data){
		var get, post ;
		get = this.container.setParameters("query.get", this.request.queryGet );
		if (this.request.queryPost  )
			post = this.container.setParameters("query.post", this.request.queryPost );
		this.container.setParameters("query.request", this.request.query );

		/*
 		 *	TRANSLATION
 		 */
		this.container.get("translation").handle( request , response);

		/*
 		 *	TRY resolve
 		 */
		try {
			var resolver = this.get("router").resolve(this.container, this.request);
			if (resolver.resolve) {
				return resolver.callController(data);
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

	Http.prototype.send = function(response){
		if ( response instanceof  http.ServerResponse ){
			this.response = response;	
		}
		/*
 		* HTTP HEAD  
 		*/
		this.response.writeHead();
		/*
 	 	* GENERATE RESPONSE
 	 	*/  
		this.response.write();
		// FLUSH
		return this.close();
	}

	Http.prototype.close = function(){
		// FLUSH
		return this.response.flush();
	}
	
	Http.prototype.logger = function(pci, severity, msgid,  msg){
		var syslog = this.container.get("syslog");
		if (! msgid) msgid = this.container.getParameters("request.protocol") + " REQUEST ";
		return syslog.logger(pci, severity, msgid,  msg);
	}

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
		this.notificationsCenter.fire("onResponse");
	};

	// FIXME COOKIES SESSION
	// connect intrusif in prototype response.on('header') https://github.com/visionmedia/express/wiki/Migrating-from-3.x-to-4.x
	Http.prototype.setCookie = function(cookie){
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
	};

	Http.prototype.addCookie = function(cookie){
		if ( cookie instanceof nodefony.cookies.cookie ){
			this.cookies.push(cookie);	
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
