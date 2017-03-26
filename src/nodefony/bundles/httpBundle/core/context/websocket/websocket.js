/*
 *
 *
 *
 *
 *
 */

nodefony.register.call(nodefony.context, "websocket", function(){


	var onClose = function(reasonCode, description){
		if ( ! this.request ){
			this.logger( new Date() + ' Connection Websocket CLOSE : ' + this.connection.remoteAddress +" PID :" +process.pid + " " +reasonCode +" " + description , "INFO");
		
		}else{
			this.logger( new Date() + ' Connection Websocket CLOSE : ' + this.connection.remoteAddress +" PID :" +process.pid + " ORIGIN : "+this.request.origin  +" " +reasonCode +" " + description , "INFO");
		}
		if (this.connection.state !== "closed"){
			try {
				this.fire("onClose", reasonCode, description, this.connection);
				this.connection.close();
			}catch(e){
				this.logger( new Date() + ' ERROR  Websocket CLOSE : ' + this.connection.remoteAddress +" PID :" +process.pid + " ORIGIN : "+this.request.origin  +" " +e , "ERROR");
			}
		}else{
			this.fire("onClose", reasonCode, description, this.connection);	
		}	
		this.kernel.container.leaveScope(this.container);
	};


	var websocket = class websocket extends nodefony.Service {

		constructor (container, request, response ,type){

			super ("websocketContext", container);
			this.type = type ;
			this.protocol = ( type === "WEBSOCKET SECURE" ) ? "wss" : "ws" ;

			//I18n
			this.translation = new nodefony.services.translation( container, type );
			this.set("translation", this.translation );
			
			//this.container = container;
			this.kernel = this.container.get("kernel") ;
			if ( this.kernel.environment === "dev" ){
				this.autoloadCache = {
					bundles:{}
				} ;
			}	
			this.kernelHttp = this.container.get("httpKernel");
			this.request = request ; 
			this.method = "WEBSOCKET";
			this.request.method = "WEBSOCKET";

			this.remoteAddress = this.request.remoteAddress ;
			this.origin = request.origin;
			//TODO acceptProtocol header sec-websocket-protocol   
			this.connection = request.accept(null, this.origin);
			this.response = new nodefony.wsResponse( this.connection ,container , type);

			this.request.url = url.parse( this.protocol+"://" + this.request.host ) ;
			this.request.url.hash = this.request.resourceURL.hash ;
			this.request.url.search = this.request.resourceURL.search;
			this.request.url.query = this.request.resourceURL.query;
			this.request.url.pathname = this.request.resourceURL.pathname;
			this.request.url.path = this.request.resourceURL.path;

			this.url =  url.format( this.request.url ) ; 
			this.port = this.request.url.port ; 
			this.domain = this.request.url.hostname ; 
			this.router = this.get("router");
			
			try{
				this.originUrl = url.parse( request.origin ); 
			}catch(e){
				this.originUrl = url.parse( this.url );	
			}

			this.secureArea = null ;
			this.domain =  this.getHostName();
			this.validDomain = this.isValidDomain() ;

			this.logger(  "REQUEST " +request.method +" FROM : "+ this.remoteAddress +" HOST : "+this.domain+" URL : "+this.url, "INFO");

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

			this.resolver = null ;
			this.nbCallController = 0 ;

			// LISTEN EVENTS  
			this.listen(this, "onView", (result) => {
				if ( this.response ){
					this.response.body = result;
				}
			});
			this.listen(this, "onResponse", this.send);
			this.listen(this, "onRequest", this.handle);
			this.listen(this, "onError", this.handleError);

			// LISTEN EVENTS SOCKET	

			this.connection.on('message', this.handleMessage.bind(this) );

			this.connection.on('close', onClose.bind(this) ); 

			//case proxy 
			this.proxy = null ; 
                        if ( this.request.httpRequest.headers["x-forwarded-for"] ){
                                this.proxy = {
                                        proxyServer     : this.request.httpRequest.headers["x-forwarded-server"],
                                        proxyProto      : this.request.httpRequest.headers["x-forwarded-proto"],
                                        proxyPort       : this.request.httpRequest.headers["x-forwarded-port"],
                                        proxyFor        : this.request.httpRequest.headers["x-forwarded-for"],
                                        proxyHost       : this.request.httpRequest.headers["x-forwarded-host"],
                                        proxyVia        : this.request.httpRequest.headers.via
                                };
                                this.logger( "PROXY WEBSOCKET REQUEST x-forwarded VIA : " + this.proxy.proxyVia , "DEBUG");
                        }
			this.crossDomain = this.isCrossDomain() ;

			/* // assembleFragments:false 
 		 	* this.connection.on('frame', function(webSocketFrame) {
				console.log(webSocketFrame.binaryPayload.toString())
			}.bind(this));*/
		}
		
		getCookieSession ( name){
			if (this.cookies[name] ){
				return this.cookies[name];
			}
			return null;	
		}

		isValidDomain (){
			return  this.kernelHttp.isValidDomain(   this );
		}

		isCrossDomain (){
			return  this.kernelHttp.isCrossDomain( this );
		}

		getRemoteAddress (){
			return this.remoteAddress ;
		}

		getHost (){
			return this.request.httpRequest.headers.host ;
		}

		getHostName (){
			return this.domain ; 
			//return this.originUrl.hostname ;
		}

		getUserAgent (){
			return this.request.httpRequest.headers['user-agent'] ;
		}

		getMethod (){
			return "WEBSOCKET" ;
		}

		getUser (){
			return this.user || null ; 	
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

		clean (){
			//delete this.request ;
			this.request = null ;
			this.response.clean();
			//delete	this.response ;
			this.response = null ;
			//delete 	this.notificationsCenter ;
			this.notificationsCenter = null ;
			//delete this.cookies ;
			this.cookies = null ;
			if (this.translation ) { delete this.translation; }
			if (this.cookieSession){ delete this.cookieSession }
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

		handleMessage (message){
			this.response.body = message ;
			try {
				if ( ! this.resolver ){
					this.resolver = this.router.resolve(this.container,  this);
				}else{
					try {
						this.resolver.match(this.resolver.route,  this)	;
					}catch(e){
						this.request.reject();
						this.fire("onError", this.container, e);	
						return ;
					}
				}
				this.fire("onMessage", message, this, "RECEIVE") ;
				if (this.resolver.resolve) {
					return this.resolver.callController(message);
				}else{
					this.request.reject();
				}
			}catch(e){
				this.fire("onError", this.container, e);	
			}	
		}

		handle (data){
			this.translation.handle( this );
			try {
				if ( ! this.resolver ){
					this.resolver  = this.router.resolve(this.container,  this);
				}else{
					try {
						this.resolver.match(this.resolver.route,  this)	;
					}catch(e){
						this.request.reject();
						this.fire("onError", this.container, e);
						return ;	
					}
					//this.resolver.match(this.resolver.route,  this);	
				}
				//WARNING EVENT KERNEL
				this.kernel.fire("onRequest", this, this.resolver);
				if (this.resolver.resolve) {
					return this.resolver.callController(data || null);
				}else{
					this.request.reject();
				}
			}catch(e){
				this.fire("onError", this.container, e);	
			}		
		}

		handleError (container, error){
			this.logger("Message : "+error.message, "ERROR");
			//return onClose.call(this, error.status, error.message );
		} 

		logger (pci, severity, msgid,  msg){
			if (! msgid) { msgid = "REQUEST "+this.type ;}
			return this.syslog.logger(pci, severity, msgid,  msg);

		}

		send (data, type){
			var myData = null ;
			if ( this.response ){
				if ( data instanceof nodefony.wsResponse ){
					myData = this.response.body ;
				}else{
					myData = data ;
				}
				this.fire("onMessage", myData, this, "SEND") ;
				return this.response.send(myData, type );
			}
			return null ;
		}
	
		close (reasonCode, description ){
			if ( this.connection ){
				this.connection.close(reasonCode, description);
			}
		}
	};

	return websocket;
});
