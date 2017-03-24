/*
 *
 *
 *
 *
 *
 */

nodefony.registerService("httpKernel", function(){

	/*
 	 *
 	 *	HTTP KERNEL
 	 *
 	 *
 	 */
	const httpKernel = class httpKernel extends nodefony.Service {

		constructor (container, serverStatic ){

			var kernel = container.get("kernel");
			super("httpKernel", container, kernel.notificationsCenter );
			this.kernel = kernel;
			this.reader = this.container.get("reader");
			this.serverStatic = serverStatic;
			this.engineTemplate = this.container.get("templating");

			this.domain = this.kernel.domain;
			this.httpPort = this.kernel.httpPort;
			this.httpsPort = this.kernel.httpsPort;

			this.container.addScope("request");
			this.container.addScope("subRequest");
			this.listen(this, "onServerRequest" , (request, response, type, domain) => {
				try {
					this.handle(request, response, type, domain);
				}catch(e){
					throw e ;
				}
			});
			this.firewall = null ;
			this.listen(this, "onReady", () => {
				this.firewall = this.get("security") ;
				this.router = this.container.get("router") ;
				this.cdn = this.setCDN();
			});
			// listen KERNEL EVENTS
			this.listen(this, "onBoot",() =>{
				this.sessionService = this.get("sessions");
				this.compileAlias();
			});

			this.listen(this, "onClientError", (e) => {
				this.logger(e, "ERROR", "HTTP KERNEL SOCKET CLIENT ERROR");
			});

			
		}

		boot (){
		}

		compileAlias (){
			var str = "";
			if ( ! this.kernel.domainAlias ){
				str = "^"+this.kernel.domain+"$" ;
				this.regAlias = new RegExp(str);
				return ;	
			}
			try {
				var alias = [] ;
				switch ( nodefony.typeOf( this.kernel.domainAlias ) ){
					case "string" :
						alias = this.kernel.domainAlias.split(" ");
						Array.prototype.unshift.call(alias,  "^"+this.kernel.domain+"$" );
						for ( var i = 0 ; i <alias.length ;i++ ){
							if (i === 0){ 
								str = alias[i];
							}else{
								str += "|"+ alias[i] ;
							}
						}
					break;
					case "object" :
						var first = true;
						for ( var myAlias in this.kernel.domainAlias ){
							if ( first ){
								var first = false;
								str = this.kernel.domainAlias[myAlias] ;
							}else{
								str += "|"+ this.kernel.domainAlias[myAlias] ;	
							}
						}
					break;
					case "array" :
						str = "^"+this.kernel.domain+"$" ;
						for ( var i = 0 ; i < this.kernel.domainAlias.length ;i++ ){
							str += "|"+ this.kernel.domainAlias[i] ;
						}
					break;
					default:
						throw new Error ("Config file bad format for domain alias must be a string ");
				}
				if (str){
					this.regAlias = new RegExp(str);
				}else{
					str = "^"+this.kernel.domain+"$" ;
					this.regAlias = new RegExp(str);	
				}
			}catch(e){
				throw e ;
			}
		}

		isValidDomain (context){
			return this.regAlias.test(context.domain);
		}

		isCrossDomain (context){
			// request origin 
			var URL = context.originUrl ;
			var hostnameOrigin = URL.hostname ;
			var portOrigin = URL.port ;

			// request server
			var requestProto = context.protocol ; 
			var requestPort = context.port ;
			var protocolOrigin = null ;

			if ( context.session ){
				var redirect = 	context.session.getFlashBag("redirect");
				if ( redirect ){
					return false  ;
				}
			}
			
			//console.log( "prototcol ::::" + URL.protocol )
			if ( ! portOrigin ){
				if (URL.protocol === "http:" ){
					URL.port = 80 ;
					portOrigin = 80 ;
				}
				if ( URL.protocol === "https:" ){
					URL.port = 443 ;
					portOrigin = 443 ;	
				}	
			}
			//console.log( "portOrigin ::::" + portOrigin )
			if (  context.proxy  ){
				requestProto = context.proxy.proxyProto ;	
				requestPort =	context.proxy.proxyPort;	
			}
			
			//console.log( "requestProto : " + requestProto)
			switch  ( requestProto ){
				case "http" :
				case "https" :
					protocolOrigin = URL.protocol ;
				break;
				case "ws" :
				case "wss" :
					if ( URL.protocol === "http:" ){
						protocolOrigin = "ws:" ;
					}
					if ( URL.protocol === "https:" ){
						protocolOrigin = "wss:" ;
					}
				break;
			}

			//console.log( "check domain Request:" + this.regAlias.test( hostnameOrigin ) +" Origin : "+hostnameOrigin)		
			//check domain
			if (  ! this.regAlias.test( hostnameOrigin )  ){
				return true ; 
			}

			//console.log( "check protocol Request:" + requestProto +" Origin : "+protocolOrigin)		
			// check protocol  	
			if (requestProto+":" !== protocolOrigin  ){
				return true ; 
			}

			//console.log( "check port Request:" + requestPort +" Origin : "+portOrigin)		
			// check port
			if (requestPort != portOrigin  ){
				return true ;
			}
			return false ;
		}
			
		getEngineTemplate (name){
			return nodefony.templatings[name];
		}

		parseViewPattern( pattern ){
			if ( pattern && typeof pattern === "string"){
				var tab = pattern.split(":");
				if (tab.length !== 3){
					throw new Error("Not valid Pattern View bundle:directory:filename ==> " + pattern );
				}
				return {
					bundle:	tab[0],
					directory:tab[1] || ".",
					file: tab[2]
				}
			}
			throw new Error("Not valid Pattern View bundle:directory:filename ==> " + pattern );
		}

		getBundleView (objPattern){
			try {
				var myBundle = this.kernel.getBundle( this.kernel.getBundleName(objPattern.bundle) );
				if (! myBundle ){
					throw new Error("BUNDLE :" + bundle +"NOT exist");
				}
				return myBundle.getView(objPattern.directory, objPattern.file);
			}catch (e){
				throw e;	
			}
		}

		getBundleTemplate (objPattern){
			try {
				var myBundle = this.kernel.getBundle( this.kernel.getBundleName(objPattern.bundle) );
				if (! myBundle ){
					throw new Error("BUNDLE :" + bundle +"NOT exist");
				}
				return myBundle.getTemplate(objPattern.directory, objPattern.file);
			}catch (e){
				throw e;	
			}
		}

		getView ( name ){
			try {
				var parse = this.parseViewPattern( name );
				return this.getBundleView(parse);
			}catch (e){
				throw e;	
			}
		}

		getTemplate ( name ){
			try {
				var parse = this.parseViewPattern( name );
				return this.getBundleTemplate(parse);
			}catch (e){
				throw e;	
			}
		}

		initTemplate (){
			var classTemplate = this.getEngineTemplate(this.settings.templating);
			this.templating = new classTemplate(this.container, this.settings[this.settings.templating]);
			this.set("templating", this.templating );
		}

		logger (pci, severity, msgid,  msg){
			if (! msgid) { msgid = "HTTP KERNEL ";}
			return this.syslog.logger(pci, severity, msgid,  msg);
		}

		checkValidDomain (context){
			var next = null ;
			if ( context.validDomain ){
				next =  200 ;
			}else{
				next = 401 ;
			}
			switch (next){
				case 200 :
					return next ;
				default:
					switch ( context.type ){
						case "HTTP":
						case "HTTPS":
							this.logger("\x1b[31m  DOMAIN Unauthorized \x1b[0mREQUEST DOMAIN : " + context.domain ,"ERROR");
							context.notificationsCenter.fire("onError",context.container, {
								status:next,
								message:"Domain : "+context.domain+" Unauthorized "
							});
						break;
						case "WEBSOCKET":
						case "WEBSOCKET SECURE":
							context.close(3001,  "DOMAIN Unauthorized "+ context.domain );
						break;
					}
				break;
			}
			return next ;	
		}

		onError (container, error){
			var myError = null ;
			if ( ! error ){
 		       		error = {
					status:500
				};
				console.trace(error);
			}else{
				if ( error.stack ){
					myError =  error.stack;
					this.logger(error.message, "ERROR");
					this.logger(myError, "ERROR");
					myError = myError.split('\n').map(function(v){ return ' -- ' + v +"</br>"; }).join('');
            					
				}else{
					myError =  error;
					this.logger(util.inspect(error),"ERROR");
				}
			}
			var context = container.get('context');
			if ( (! context ) ||  ( ! context.response ) ){
 				return 	;
			}
			var resolver= null ;
			switch ( nodefony.typeOf(error) ){
				case "object" :
					if ( !  error.status ) {
						error.status = context.response.getStatusCode() ;
					}
				break;
				case "string" :
					console.trace(error);
					error = new Error(error);
					error.status = context.response.getStatusCode() ;
				break;
			}
			switch (error.status){
				case 404:
					resolver = this.router.resolveName(container, "frameworkBundle:default:404");
				break;
				case 401:
					resolver = this.router.resolveName(container, "frameworkBundle:default:401");
				break;
				case 403:
					resolver = this.router.resolveName(container, "frameworkBundle:default:403");
				break;
				case 408:
					resolver = this.router.resolveName(container, "frameworkBundle:default:timeout");
				break;
				default:
					resolver = this.router.resolveName(container, "frameworkBundle:default:exceptions");
					error.status = 500 ;
			}
			context.response.setStatusCode(error.status || 500, error.message ) ;

			if (error.xjson){
				if ( context.setXjson ){ 
					context.setXjson(error.xjson);
				}
			}
			resolver.callController( {
				exception:myError || error,
				Controller: container.get("controller") ? container.get("controller").name : null,
				bundle:container.get("bundle") ? container.get("bundle").name : null
			});
		}

		handle (request, response, type, domain){
			
			// SCOPE REQUEST ;
			var container = this.container.enterScope("request");	
			if ( domain ) { domain.container = container ; }
			switch (type){
				case "HTTP" :
				case "HTTPS" :
					return this.handleHttp(container, request, response, type, domain);
				break;
				case "WEBSOCKET" :
				case "WEBSOCKET SECURE" :
					return this.handleWebsocket(container, request, response, type, domain);	
				break;
			}
		}


		handleHttp (container, request, response, type){
			var context = new nodefony.context.http(container, request, response, type);
			var resolver = null ;
			var next = null ;
			container.set("context", context);
			//response events	
			context.response.response.on("finish",() => {
				//console.log("FINISH")
				context.fire("onFinish", context);
				this.container.leaveScope(container);
				context.clean();
				context = null ;
				request = null ;
				response = null ;
				container = null ;
				resolver = null ;
				type = null ;
				next = null ;
			});
			
			//request events	
			context.notificationsCenter.listen(this, "onError", this.onError);

			// DOMAIN VALID 
			next = this.checkValidDomain(context) ;
			if ( next !== 200){
				return ;
			}
			
			// FRONT ROUTER 
			try {
				resolver  = this.router.resolve(container, context);
			}catch(e){
				return context.notificationsCenter.fire("onError", container, e );	
			}
			if (resolver.resolve) {
				context.resolver = resolver ;	
			}else{
				return context.notificationsCenter.fire("onError", container, {
					status:404,
					error:"URI :" + context.url,
					message:"not Found"
				});
			}

			//this.fire("onHttpRequest", container, context, type);
			
			if ( ( ! this.firewall ) || resolver.bypassFirewall ){
				request.on('end', () => {
					try {
						if ( context.sessionAutoStart === "autostart" ){
							this.sessionService.start(context, "default").then((session) =>{
								if ( ! session instanceof nodefony.Session ){
									throw new Error("SESSION START session storage ERROR");
								}
								this.logger("AUTOSTART SESSION","DEBUG");
								context.notificationsCenter.fire("onRequest");
							}).catch( (error) =>{
								return error;
							});
						}else{
							context.notificationsCenter.fire("onRequest");	
						}
					}catch(e){
						context.notificationsCenter.fire("onError", container, e );	
					}
				});
				return ;	
			}
			this.fire("onSecurity", context);	
		}

		handleWebsocket (container, request, response, type){
			var context = new nodefony.context.websocket(container, request, response, type);
			container.set("context", context);
			var resolver = null ;
			var next = null ;

			context.listen(this,"onClose" , (reasonCode, description) => {
				context.fire("onFinish", context, reasonCode, description);
				context.clean();
				context = null ;
				request = null ;
				response = null ;
				container = null ;
				type = null ;
				next = null ;
				resolver = null ;
			});
			
			//context.notificationsCenter.listen(this, "onError", this.onErrorWebsoket);	

			// DOMAIN VALID 
			var next = this.checkValidDomain(context) ;
			if ( next !== 200){
				return ;
			}

			// FRONT ROUTER 
			try {
				resolver  = this.router.resolve(container, context);
			}catch(e){
				return context.notificationsCenter.fire("onError", container, e );	
			}

			if (resolver.resolve) {
				context.resolver = resolver ;	
			}else{
				return context.notificationsCenter.fire("onError", container, {
					status:404,
					error:"URI :" + request.url,
					message:"not Found"
				});
			}

			//this.fire("onWebsocketRequest", container, context, type);
			
			if ( ( ! this.firewall ) || resolver.bypassFirewall ){
				try {
					if ( context.sessionAutoStart === "autostart" ){
						this.sessionService.start(context, "default").then((session) =>{
							if ( ! session instanceof nodefony.Session ){
								throw new Error("SESSION START session storage ERROR");
							}
							this.logger("AUTOSTART SESSION","DEBUG");
							context.notificationsCenter.fire("onRequest");
						}).catch( (error) =>{
							return error;
						});
					}else{
						context.notificationsCenter.fire("onRequest");	
					}
				}catch(e){
					context.notificationsCenter.fire("onError", container, e );	
				}
				return ;	
			}
			this.fire("onSecurity", context);	
			return ;
		}

		onErrorWebsoket (container, error){
			var myError = null ;
			if ( ! error ){
 		       		error = {status:500,
					message:"nodefony undefined error "
				};
			}else{
				if ( error.stack ){
					myError =  error.stack;
					this.logger(myError);
					myError = myError.split('\n').map(function(v){ return ' -- ' + v +"</br>"; }).join('');
            					
				}else{
					myError =  error;
					this.logger(util.inspect(error));
				}
			}
		}

		setCDN(){
			return  this.kernel.settings.CDN ;	
		}
		getCDN(type, nb){
			var wish = 0 ;
			if ( nb ){
				try {
					wish = parseInt(wish,10);
				}catch(e){
					this.logger("CDN CONFIG ERROR  : ", "ERROR");
					this.logger(e, "ERROR");
				}
			}
			switch ( typeof this.cdn ){
				case "object":
					if ( ! this.cdn ){
						return "";
					} 
					if (this.cdn.global ){
						return this.cdn.global ;
					}
					if ( ! type ){
						var txt = "CDN ERROR getCDN bad argument type  ";
						this.logger(txt, "ERROR");
						throw new Error (txt);	
					}
					if (type in this.cdn ) {
						if ( this.cdn[type][wish] ){
							return this.cdn[type][wish]; 
						}
					}
					return "";
				case "string":
					return this.cdn || "" ;
				break;
				default:
					var txt = "CDN CONFIG ERROR ";
					this.logger(txt, "ERROR");
					throw new Error (txt);

			}
		}
	};
	return httpKernel ;
});
