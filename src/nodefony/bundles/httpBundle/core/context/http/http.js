/*
 *
 *
 *
 *
 *
 */

nodefony.register.call(nodefony.context, "http", function(){

	/*
 	 *
 	 *
 	 *
 	 *
 	 */
	var Http = class Http extends nodefony.Service {

		constructor (container, request, response, type){

			super ("httpContext", container);
			this.type = type;
			//I18n
			this.translation = new nodefony.services.translation( container, type );
			this.set("translation", this.translation );
			this.protocol = ( type === "HTTPS" ) ? "https" : "http" ;
			this.resolver = null ;
			this.nbCallController = 0 ;
			this.request = new nodefony.Request( request, container, type);
			this.response = new nodefony.Response( response, container, type);
			this.isRedirect = false ;
			this.sended = false ; 
			this.method = this.request.getMethod() ;
			this.isAjax = this.request.isAjax() ;
			this.secureArea = null ;
			this.showDebugBar = true ;
			this.timeoutExpired = false ;
			this.kernel = this.container.get("kernel") ;
			if ( this.kernel.environment === "dev" ){
				this.autoloadCache = {
					bundles:{}
				} ;
			}
			this.kernelHttp = this.container.get("httpKernel");
			this.domain =  this.getHostName();  
			this.router = this.get("router");
		  	
			this.url =url.format(this.request.url);
			if ( this.request.url.port ){
				this.port =  this.request.url.port;
			}else{
				this.port = this.protocol === "https" ?  443 : 80 ;    
			}

			try {
				this.originUrl = url.parse( this.request.headers.origin || this.request.headers.referer ) ;
			}catch(e){
				this.originUrl = url.parse( this.url );
			}
			
			this.validDomain = this.isValidDomain() ;
			this.crossDomain = null; 

			this.logger( ( this.isAjax ? " AJAX REQUEST " : "REQUEST ") +request.method +" FROM : "+ this.request.remoteAddress +" HOST : "+request.headers.host+" URL :"+request.url, "INFO");

			// session 
			this.session = null;
			this.sessionService = this.get("sessions");
			this.sessionAutoStart = this.sessionService.settings.start ; 

			//parse cookies
			this.cookies = {};
			this.parseCookies();
			this.cookieSession = this.getCookieSession( this.sessionService.settings.name );
			
			this.security = null ;
			this.user = null ;
			
			this.remoteAddress = this.request.remoteAddress ; 

			this.promise = null ;

			// LISTEN EVENTS KERNEL 
			this.listen(this, "onView", (result/*, context, view, param*/) => {
				this.response.body = result;
			});
			this.listen(this, "onSaveSession");
			this.once(this, "onResponse", this.send);
			this.listen( this, "onRequest" , this.handle );
			this.listen( this, "onTimeout" , (/*context*/) => {
				this.fire("onError", this.container, {
					status:408,
					message:new Error("Timeout :" + this.url)
				} );	
				//context.clean();
			} );

			//case proxy
			this.proxy = null ;
			if ( request.headers["x-forwarded-for"] ){
				if ( request.headers["x-forwarded-proto"] ){
					this.type = request.headers["x-forwarded-proto"].toUpperCase();
				}
				this.proxy = {
					proxyServer	: request.headers["x-forwarded-server"],	
					proxyProto	: request.headers["x-forwarded-proto"],
					proxyPort	: request.headers["x-forwarded-port"],
					proxyFor	: request.headers["x-forwarded-for"],
					proxyHost	: request.headers["x-forwarded-host"],	
					proxyVia	: request.headers.via 
				};
				this.logger( "PROXY REQUEST x-forwarded VIA : " + this.proxy.proxyVia , "DEBUG");
			}
			this.crossDomain = this.isCrossDomain() ;
		}

		getCookieSession ( name){
			if (this.cookies[name] ){
				return this.cookies[name];
			}
			return null;	
		}

		isValidDomain (){
			return   this.kernelHttp.isValidDomain( this );
		}

		isCrossDomain (){
			return  this.kernelHttp.isCrossDomain( this );
		}

		getRemoteAddress (){
			return this.request.getRemoteAddress() ;
		}

		getHost (){
			return this.request.getHost() ;
		}

		getHostName (){
			return this.request.getHostName() ;
		}

		getUserAgent (){
			return this.request.getUserAgent();
		}

		getMethod (){
			return this.request.getMethod() ;
		}

		flashTwig (key){
			if ( this.session ){
				return this.session.getFlashBag(key) ;
			}
			return null ;
		}

		extendTwig ( param ){
			return nodefony.extend( {}, param, {
				nodefony:{
					url:this.request.url
				},
				getFlashBag:	this.flashTwig.bind(this),
				render:		this.render.bind(this),
				controller:	this.controller.bind(this),
				trans:		this.translation.trans.bind(this.translation),
				getLocale:	this.translation.getLocale.bind(this.translation),
				trans_default_domain:function(){
						this.translation.trans_default_domain.apply(this.translation, arguments) ;
				}.bind(this),
				getTransDefaultDomain:this.translation.getTransDefaultDomain.bind(this.translation)	
			})
		}

		controller (pattern, data){
			try {
				this.resolver = this.router.resolveName(this.container, pattern) ;

				var control = new this.resolver.controller( this.container, this.resolver.context );
				if ( data ){
					Array.prototype.shift.call( arguments );
					for ( var i = 0 ; i< arguments.length ; i++){
						this.resolver.variables.push(arguments[i]);	
					}
				}
				return this.resolver.action.apply(control, this.resolver.variables);
			}catch(e){
				this.logger(e, "ERROR");
				//throw e.error
			}	
		}

		render (response){
			switch (true){
				case response instanceof nodefony.wsResponse :
				case response instanceof nodefony.Response :
					return response.body;
				case response instanceof Promise :
				case response instanceof BlueBird :
					return this.response.body ;
				case nodefony.typeOf(response) === "object":
					if ( this.resolver.defaultView ){
						 return this.render( this.resolver.get("controller").render(this.resolver.defaultView, response ) );
					}else{
						throw {
							status:500,
							message:"default view not exist"
						};
					}
				case typeof response === "string" :
					return response ;
				default:
					this.logger("nodefony TWIG function render can't resolve async Call in Twig Template ","WARNING");
					return this.response.body ;
			}
		}

		handle (container, request , response, data){

			this.container.setParameters("query.get", this.request.queryGet );
			if (this.request.queryPost  ){
				this.container.setParameters("query.post", this.request.queryPost );
			}
			if (this.request.queryFile  ){
				this.container.setParameters("query.files", this.request.queryFile );
			}
			this.container.setParameters("query.request", this.request.query );

			/*
 		 	*	TRANSLATION
 		 	*/
			this.translation.handle( this);

			/*
 		 	*	TRY resolve
 		 	*/
			try {
				if (!  this.resolver ){
					this.resolver = this.router.resolve(this.container,  this);
				}
				//WARNING EVENT KERNEL
				this.kernel.fire("onRequest", this, this.resolver);	
				if (this.resolver.resolve) {
					var ret = this.resolver.callController(data);
					// timeout response after  callController (to change timeout in action )
					this.response.response.setTimeout(this.response.timeout, () => {
						this.timeoutExpired = true ;
						this.fire("onTimeout", this);
					});
					return ret ;
				}
				/*
 			 	*	NOT FOUND
 			 	*/
				this.fire("onError", this.container, {
					status:404,
					error:"URI :" + request.url,
					message:"not Found"
				});
			}catch(e){
				/*
 			 	*	ERROR IN CONTROLLER 
 			 	*/
				this.fire("onError", this.container, e);		
			}
		}


		clean (){
			this.request.clean();
			delete 	this.request ;
			this.response.clean();
			delete 	this.response ;
			//delete  this.notificationsCenter ;
			delete  this.session ;
			delete  this.cookies ;
			if (this.proxy) {delete this.proxy ;}
			if (this.user)  {delete this.user;}
			if (this.security ) {delete this.security ;}
			if (this.promise) {delete this.promise;}
			if (this.translation ) { delete this.translation; }
			this.cookies = null ;
			if (this.cookieSession){ delete this.cookieSession }
			//delete this.container ;
			super.clean();
			//if (this.profiling) delete context.profiling ;
		}

		getUser (){
			return this.user || null ; 	
		}

		send (/*response, context*/){
			
			if ( this.sended ){
				return ;
			}
			this.sended = true ;
			// cookies
			this.response.setCookies();
			/*
 			* HTTP WRITE HEAD  
 			*/
			this.response.writeHead();

			this.fire("onSend", this.response, this);
			if ( this.session ){
				this.listen(this, "onSaveSession" , ( session ) => {
					//console.log("FIRE onSaveSession")
					if (  ! this.storage ){
						if ( this.profiling ){
							this.fire("onSendMonitoring", this.response, this);	
						}
						/*
 	 					* WRITE RESPONSE
 	 					*/  
						this.response.write();
						// END REQUEST
						return this.close();
					}
					this.fire("onSendMonitoring", this.response, this);
				});
				return ;
			}

			if (  ! this.storage ){
				if ( this.profiling ){
					this.fire("onSendMonitoring", this.response, this);	
				}
				/*
 	 			* WRITE RESPONSE
 	 			*/  
				this.response.write();
				// END REQUEST
				return this.close();
			}
			this.fire("onSendMonitoring", this.response, this);
		}

		flush (data, encoding){
			return this.response.flush(data, encoding);	
		}

		close (){
			//console.trace("CLOSE")
			this.fire("onClose", this);
			// END REQUEST
			this.response.end();
		}
	
		logger (pci, severity, msgid,  msg){
			if (! msgid) {msgid = this.type + " REQUEST";}
			return this.syslog.logger(pci, severity, msgid,  msg);
		}

		getRequest (){
			return this.request;	
		}

		getResponse (){
			return this.response;	
		}

		redirect (Url, status, headers){
			var res = null ;
			if (typeof Url === "object"){
				res = this.response.redirect(url.format(Url), status, headers);
			}else{	
				res = this.response.redirect(Url, status, headers );
			}
			//this.logger("REDIRECT : "+Url,"DEBUG");
			this.isRedirect = true ;
			this.send(res, this);
		}

		redirectHttps ( status, headers){
			
			if ( this.session ){
				this.session.setFlashBag("redirect" , "HTTPS" );
			}
			var urlExtend = null ;
			if( this.proxy ){
				urlExtend = {
					protocol:	"https",
					href:		"",
					host:		""
				}  ;
			}else{
				urlExtend = {
					protocol:	"https",
					port:		this.kernelHttp.httpsPort || 443 ,	
					href:		"",
					host:		""
				}  ;
			}
			var urlChange = nodefony.extend({}, this.request.url , urlExtend );
			var newUrl  = url.format(urlChange);
			return this.redirect( newUrl, status , headers);
		}

		setXjson ( xjson){
			switch ( nodefony.typeOf(xjson) ){
				case "object":
					this.response.headers["X-Json"] = JSON.stringify(xjson);
					return xjson;
				case "string":
					this.response.headers["X-Json"] = xjson;
					return JSON.parse(xjson);
				case "Error":
					if ( typeof xjson.message === "object" ){
						this.response.headers["X-Json"] = JSON.stringify(xjson.message);
						return xjson.message;	
					}else{
						this.response.headers["X-Json"] = xjson.message;
						return {error:xjson.message};	
					}
				break;
			}
		}
		
		addCookie (cookie){
			if ( cookie instanceof nodefony.cookies.cookie ){
				this.cookies[cookie.name] = cookie;
			}else{
				throw {
					message:"",
					error:"Response addCookies not valid cookies"
				};
			}	
		}

		parseCookies (){
			return  nodefony.cookies.cookiesParser(this);
		}
	};
	return Http; 
});
