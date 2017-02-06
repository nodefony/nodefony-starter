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
			if ( this.kernel.environment === "dev" ){
				this.autoloadCache = {
					bundles:{}
				} ;
			}
			this.kernelHttp = this.get("httpKernel");
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
			//this.listen(this, "onView", (result/*, context, view, param*/) => {
			//	if ( this.response ){
			//		this.response.body = result;
			//	}
			//});

			this.once( this, "onRequest" , this.handle );
			this.once(this, "onResponse", this.send);
			this.once( this, "onTimeout" , (/*context*/) => {
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
			});
		}

		controller (pattern, data ){
			var container = this.kernelHttp.container.enterScope("subRequest");
			container.set("context", this) ;
			container.set("translation", this.translation );
			var control = null ;
			var resolver = null ;
			try {
				resolver = this.router.resolveName(this.container, pattern);
			}catch(e){
				return this.notificationsCenter.fire("onError", this.container, e );	
			}
			if ( ! resolver.resolve) {
				return this.notificationsCenter.fire("onError", this.container, {
					status:404,
					error:"PATTERN : " + pattern,
					message:"not Found"
				});
			}
			try {
				control = new resolver.controller( container, this );
				control.response = new nodefony.Response( null, container, this.type); 
				if ( data ){
					Array.prototype.shift.call( arguments );
					for ( var i = 0 ; i< arguments.length ; i++){
						resolver.variables.push(arguments[i]);	
					}
				}
			}catch(e){
				return this.notificationsCenter.fire("onError", this.container, e );	
			}
			return {
				resolver:resolver,
				controller:control,	
				response:resolver.action.apply(control, resolver.variables)
			};
		}

		render (subRequest){
			this.removeListener("onView", subRequest.controller.response.setBody);
			this.kernelHttp.container.leaveScope(subRequest.controller.container);
			switch (true){
				case subRequest.response instanceof nodefony.Response :
				case subRequest.response instanceof nodefony.wsResponse :
					return subRequest.response.body;
				case subRequest.response instanceof Promise :
				case subRequest.response instanceof BlueBird :
					if ( subRequest.controller.response.body === ""){
						var txt = "nodefony TWIG function render can't resolve async Call in Twig Template " ;
						this.logger(txt,"ERROR");
						return txt;
					}
					/*subRequest.response.then((result) =>{
						console.log(result)
						subRequest.controller.response.body = result ;
					});*/
					return subRequest.controller.response.body;
				case nodefony.typeOf(subRequest.response) === "object":
					if ( subRequest.resolver.defaultView ){
						 return this.render( {
							resolver:subRequest.resolver,
							controller:subRequest.controller,
							response:subRequest.controller.render(subRequest.resolver.defaultView, subRequest.response )
						 } );
					}else{
						throw {
							status:500,
							message:"default view not exist"
						};
					}
				break;
				case typeof subRequest.response === "string" :
					return subRequest.response ;
				default:
					this.logger("nodefony TWIG function render can't resolve async Call in Twig Template ","WARNING");
					return this.response.body ;
			}
		}

		handle (data){

			this.setParameters("query.get", this.request.queryGet );
			if (this.request.queryPost  ){
				this.setParameters("query.post", this.request.queryPost );
			}
			if (this.request.queryFile  ){
				this.setParameters("query.files", this.request.queryFile );
			}
			this.setParameters("query.request", this.request.query );

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
					if (this.response.response){ 
						this.response.response.setTimeout(this.response.timeout, () => {
							this.timeoutExpired = true ;
							this.fire("onTimeout", this);
						});
					}
					return ret ;
				}
				/*
 			 	*	NOT FOUND
 			 	*/
				this.fire("onError", this.container, {
					status:404,
					error:"URI :" + this.request.url,
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
			this.response.clean();
			this.request = null ;
			this.response = null ;
			delete this.response ;
			delete this.request ;
			this.session = null  ;
			delete this.session ;
			this.proxy = null;
			delete this.proxy ;
			this.user = null ;
			delete this.user ;
			this.security= null ;
			delete this.security ;
			this.promise = null ;
			delete this.promise ;
			this.translation = null ; 
			delete this.translation ;
			this.cookies = null ;
			delete this.cookies ;
			this.cookieSession = null ; 
			delete this.cookieSession ;
			this.resolver = null ;
			delete this.resolver ;
			this.kernelHttp = null ;
			delete this.kernelHttp ;
			this.router = null ;
			delete this.router ;
			this.autoloadCache = null ;
			delete this.autoloadCache ;
			super.clean();
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
				this.once(this, "onSaveSession" , ( /*session*/ ) => {
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
