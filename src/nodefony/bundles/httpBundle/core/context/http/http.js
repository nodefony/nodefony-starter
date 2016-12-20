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
			this.protocol = ( type === "HTTPS" ) ? "https" : "http" ;
			this.resolver = null ;
			this.nbCallController = 0 ;
			this.request = new nodefony.Request( request, container, type);
			this.response = new nodefony.Response( response, container, type);
			this.session = null;
			this.sessionService = this.get("sessions");
			this.sessionAutoStart = this.sessionService.settings.start ; 
			this.cookies = {};
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

			//parse cookies
			this.parseCookies();
			
			this.security = null ;
			this.user = null ;
			
			this.remoteAddress = this.request.remoteAddress ; 

			// LISTEN EVENTS KERNEL 
			this.listen(this, "onView", (result/*, context, view, param*/) => {
				this.response.body = result;
			});
			this.listen(this, "onResponse", this.send);
			this.listen( this, "onRequest" , this.handle );
			this.listen( this, "onTimeout" , function(/*context*/){
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
			this.container.get("translation").handle( this);

			/*
 		 	*	TRY resolve
 		 	*/
			try {
				if (!  this.resolver ){
					this.resolver = this.get("router").resolve(this.container,  this);
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
			//delete this.container ;
			super.clean();
			//if (this.profiling) delete context.profiling ;
		}

		getUser (){
			return this.user || null ; 	
		}

		send (response, context){
			if (response.response.headersSent ){
				return this.close();
			}
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

			this.fire("onSend", response, context);
			if (  ! context.storage ){
				if ( context.profiling ){
					this.fire("onSendMonitoring", response, context);	
				}
				/*
 	 			* WRITE RESPONSE
 	 			*/  
				this.response.write();
				// END REQUEST
				return this.close();
			}
			this.fire("onSendMonitoring", response, context);
		}

		flush (data, encoding){
			return this.response.flush(data, encoding);	
		}

		close (){
			//console.log("CLOSE CONTEXT")
			this.fire("onClose", this);
			// END REQUEST
			return this.response.end();
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
			if (typeof Url === "object"){
				return this.response.redirect(url.format(Url), status, headers);
			}else{	
				return this.response.redirect(Url, status, headers );
			}
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
