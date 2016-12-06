/*
 *
 *
 *
 *
 *
 */

nodefony.register.call(nodefony.context, "websocket", function(){


	var onClose = function(reasonCode, description){
		this.logger( new Date() + ' Connection Websocket CLOSE : ' + this.connection.remoteAddress +" PID :" +process.pid + " ORIGIN : "+this.request.origin  +" " +reasonCode +" " + description , "INFO");
		if (this.connection.state !== "closed"){
			try {
				this.connection.close();
				this.fire("onClose", reasonCode, description, this.connection);
			}catch(e){
				this.logger( new Date() + ' ERROR  Websocket CLOSE : ' + this.connection.remoteAddress +" PID :" +process.pid + " ORIGIN : "+this.request.origin  +" " +e , "ERROR");
			}
		}else{
			this.fire("onClose", reasonCode, description, this.connection);	
		}	
		this.kernel.container.leaveScope(this.container);
	}


	var websocket = class websocket extends nodefony.Service {

		constructor (container, request, response ,type){

			super ("websocketContext", container);
			this.type = type ;
			this.protocol = ( type === "WEBSOCKET SECURE" ) ? "wss" : "ws" ;
			
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
			
			try{
				this.originUrl = url.parse( request.origin ); 
			}catch(e){
				this.originUrl = url.parse( this.url );	
			}

			this.secureArea = null ;
			this.cookies = {};
			this.domain =  this.getHostName();
			this.validDomain = this.isValidDomain() ;
			this.crossDomain = null ;  

			this.logger(' Connection Websocket Connection from : ' + this.connection.remoteAddress +" PID :" +process.pid + " ORIGIN : "+request.origin , "INFO", null, {
				remoteAddress:this.remoteAddress,
				origin:request.origin
			});

			this.session = null;
			this.sessionService = this.get("sessions");
			this.sessionAutoStart = this.sessionService.settings.start ;

			//parse cookies
			this.parseCookies();

			this.security = null ;
			this.user = null ;

			this.resolver = null ;
			this.nbCallController = 0 ;

			// LISTEN EVENTS  
			this.listen(this, "onView", (result) => {
				this.response.body = result;
			});
			this.listen(this, "onResponse", this.send);
			this.listen(this, "onRequest", this.handle);
			this.listen(this, "onError", this.handleError);

			// LISTEN EVENTS SOCKET	

			this.connection.on('message', this.handleMessage.bind(this) );

			this.connection.on('close', onClose.bind(this) ); 

			/* // assembleFragments:false 
 		 	* this.connection.on('frame', function(webSocketFrame) {
				console.log(webSocketFrame.binaryPayload.toString())
			}.bind(this));*/
		};

		isValidDomain (){
			return  this.kernelHttp.isValidDomain(   this );
		}

		isCrossDomain (){
			return  this.kernelHttp.isCrossDomain( this );
		}

		getRemoteAddress (){
			return this.remoteAddress ;
		};

		getHost (){
			return this.request.httpRequest.headers['host'] ;
		};

		getHostName (){
			return this.domain ; 
			//return this.originUrl.hostname ;
		};

		getUserAgent (){
			return this.request.httpRequest.headers['user-agent'] ;
		};

		getMethod (){
			return "WEBSOCKET" ;
		};

		getUser (){
			return this.user || null ; 	
		};

		addCookie (cookie){
			if ( cookie instanceof nodefony.cookies.cookie ){
				this.cookies[cookie.name] = cookie;
			}else{
				throw {
					message:"",
					error:"Response addCookies not valid cookies"
				}
			}	
		};

		parseCookies (){
			return  nodefony.cookies.cookiesParser(this);
		};

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
		}

		handleMessage (message){
			this.response.body = message ;
			try {
				if ( ! this.resolver ){
					this.resolver = this.get("router").resolve(this.container,  this);
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

		};

		handle (container, request, response, data){
			this.container.get("translation").handle( this );
			try {
				if ( ! this.resolver ){
					this.resolver  = this.get("router").resolve(this.container,  this);
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
					request.reject();
				}
			}catch(e){
				this.fire("onError", this.container, e);	
			}		

		};

		handleError (container, error){
			return 	onClose.call(this, error.status, error.message );
		
		}; 

		logger (pci, severity, msgid,  msg){
			if (! msgid) msgid = "REQUEST "+this.type ;
			return this.syslog.logger(pci, severity, msgid,  msg);

		};

		send (data, type){
			//console.log(this.response)
			if ( this.response ){
				this.fire("onMessage", data, this, "SEND") ;
				return this.response.send(data || this.response.body, type)
			}
			return null ;
		};
	
		close (reasonCode, description ){
			if ( this.connection ){
				this.connection.close(reasonCode, description);
			}
		};
	};

	return websocket 
});
