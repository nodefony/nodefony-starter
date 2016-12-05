/*
 *
 *
 *
 *
 *
 */
var Url = require("url");

nodefony.registerService("httpKernel", function(){


	var myController = function(pattern, data){
		try {
			var router = this.get("router");
			var resolver = router.resolveName(this, pattern) ;

			var myController = new resolver.controller( this, resolver.context );
			if ( data ){
				Array.prototype.shift.call( arguments );
				for ( var i = 0 ; i< arguments.length ; i++){
					resolver.variables.push(arguments[i]);	
				}
				//resolver.variables.push(data); 
			}
			return resolver.action.apply(myController, resolver.variables);
		}catch(e){
			this.logger(e, "ERROR")
			//throw e.error
		}	
	};

	var render = function(response){
		switch (true){
			case response instanceof nodefony.Response :
				return response.body;
			break ;
			case response instanceof nodefony.wsResponse :
				return response.body;
			break ;
			case response instanceof Promise :
				return response;
			break ;
			case nodefony.typeOf(response) === "object":
				return nodefony.extend(true , this, response);
			break;
			default:
				return response ;
		}
	}

	var flashTwig = function(key){
		if ( this.session ){
			return this.session.getFlashBag(key) ;
		}
		return null ;
	}

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
			this.listen(this, "onServerRequest" , (request, response, type, domain) => {
				try {
					this.handle(request, response, type, domain);
				}catch(e){
					throw e
				}
			});
			this.firewall = null ;
			this.listen(this, "onReady", () => {
				this.firewall = this.get("security") ;
			});
			// listen KERNEL EVENTS
			this.listen(this, "onBoot",() =>{
				this.sessionService = this.get("sessions");
				this.compileAlias();
			});

			this.listen(this, "onClientError", (e, socket) => {
				this.logger(e, "ERROR", "HTTP KERNEL SOCKET CLIENT ERROR")
			});
		};

		boot (){
		 	/*this.listen(this, "onBoot", function(){
		 	});*/
		};

		compileAlias (){

			if ( ! this.kernel.domainAlias ){
				var str = "^"+this.kernel.domain+"$" ;
				this.regAlias = new RegExp(str);
				return ;	
			}
			try {
				var alias = [] ;
				if (  typeof this.kernel.domainAlias === "string" ){
					var alias = this.kernel.domainAlias.split(" ");
					Array.prototype.unshift.call(alias,  "^"+this.kernel.domain+"$" );
					var str = "";
					for ( var i = 0 ; i <alias.length ;i++ ){
						if (i === 0) 
							str = alias[i];
						else
							str += "|"+ alias[i] ;
					}
					if (str){
						this.regAlias = new RegExp(str);
					}

				}else{
					throw new Error ("Config file bad format for domain alias must be a string ")
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

			if ( context.session ){
				var redirect = 	context.session.getFlashBag("redirect" ) 
				if ( redirect )
					return false  ;
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
			//console.log( context.proxy )
			if (  context.proxy  ){
				requestProto = context.proxy.proxyProto ;	
				requestPort =	context.proxy.proxyPort;	
			}
			
			//console.log( "requestProto : " + requestProto)
			switch  ( requestProto ){
				case "http" :
				case "https" :
					var protocolOrigin = URL.protocol ;
				break;
				case "ws" :
				case "wss" :

					if ( URL.protocol === "http:" )
						var protocolOrigin = "ws:" ;
					if ( URL.protocol === "https:" )
						var protocolOrigin = "wss:" ;
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
		};

		getView ( name ){
			var tab = name.split(":");
			var bundle = tab[0] ;
			var controller = tab[1] || ".";
			var action = tab[2];
			bundle = this.kernel.getBundle( this.kernel.getBundleName(bundle) );
			if (! bundle ){
				throw new Error("BUNDLE :" + bundle +"NOT exist")
			}
			try {
				return bundle.getView(controller, action);
			}catch (e){
				throw e;	
			}
		};

		getTemplate ( name ){
			var tab = name.split(":");
			var bundle = tab[0] ;
			var controller = tab[1] || ".";
			var action = tab[2];
			bundle = this.kernel.getBundle( this.kernel.getBundleName(bundle) );
			if (! bundle ){
				throw new Error("BUNDLE :" + bundle +"NOT exist")
			}
			try {
				return bundle.getTemplate(controller, action);
			}catch (e){
				throw e;	
			}
		};

		initTemplate (){
			var classTemplate = this.getEngineTemplate(this.settings.templating);
			this.templating = new classTemplate(this.container, this.settings[this.settings.templating]);
			this.set("templating", this.templating );
		};

		logger (pci, severity, msgid,  msg){
			var syslog = this.container.get("syslog");
			if (! msgid) msgid = "HTTP KERNEL ";
			return syslog.logger(pci, severity, msgid,  msg);
		};

		onError (container, error){
			if ( ! error ){
 		       		error = {status:500,
					message:"nodefony undefined error "
				}
				console.trace(error);
			}else{
				if ( error.stack ){
					var myError =  error.stack;
					this.logger(myError);
					myError = myError.split('\n').map(function(v){ return ' -- ' + v +"</br>"; }).join('');
            					
				}else{
					var myError =  error;
					this.logger(util.inspect(error));
				}
			}
			var context = container.get('context');
			if ( (! context ) ||  ( ! context.response ) ){
 				return 	;
			}
			switch (error.status){
				case 404:
					var resolver = container.get("router").resolveName(container, "frameworkBundle:default:404");
				break;
				case 401:
					var resolver = container.get("router").resolveName(container, "frameworkBundle:default:401");
				break;
				case 403:
					var resolver = container.get("router").resolveName(container, "frameworkBundle:default:403");
				break;
				case 408:
					var resolver = container.get("router").resolveName(container, "frameworkBundle:default:timeout");
				break;
				default:
					var resolver = container.get("router").resolveName(container, "frameworkBundle:default:exceptions");
			}
			context.response.setStatusCode(error.status || 500 ) ;

			if (error.xjson){
				if ( context.setXjson ) 
					context.setXjson(error.xjson);
			}
			resolver.callController( {
				exception:myError || error,
				Controller: container.get("controller") ? container.get("controller").name : null,
				bundle:container.get("bundle") ? container.get("bundle").name : null
			} );
		};

		onErrorWebsoket (container, error){
			if ( ! error ){
 		       		error = {status:500,
					message:"nodefony undefined error "
				}
			}else{
				if ( error.stack ){
					var myError =  error.stack;
					this.logger(myError);
					myError = myError.split('\n').map(function(v){ return ' -- ' + v +"</br>"; }).join('');
            					
				}else{
					var myError =  error;
					this.logger(util.inspect(error));
				}
			}
			var context = container.get('context');
		};

		checkValidDomain (context){
			if ( context.validDomain ){
				var next =  200 ;
			}else{
				var next = 401 ;
			}
			switch (next){
				case 200 :
					return next ;
				break;
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
			return next  ;	
		}

		//  build response
		handle (request, response, type, domain){

			// SCOPE REQUEST ;
			var container = this.container.enterScope("request");	
			if ( domain ) domain.container = container ;

			//I18n
			var translation = new nodefony.services.translation( container, type );
			container.set("translation", translation );
			
			switch (type){
				case "HTTP" :
				case "HTTPS" :
					var context = new nodefony.context.http(container, request, response, type);
					container.set("context", context);
					//response events	
					context.response.response.on("finish",() => {
						context.fire("onFinish", context);
						this.container.leaveScope(container);
						delete context.extendTwig ;
						if (context.proxy) delete context.proxy ;
						context.clean();
						context = null ;
						request = null ;
						response = null ;
						container = null ;
						translation = null ;
						if (domain) {
							delete domain.container ;
							domain = null ;
						}
					});

					// PROXY
					if ( request.headers["x-forwarded-for"] ){
						if ( request.headers["x-forwarded-proto"] ){
							context.type = request.headers["x-forwarded-proto"].toUpperCase();
						}
						context.proxy = {
							proxyServer	: request.headers["x-forwarded-server"],	
							proxyProto	: request.headers["x-forwarded-proto"],
							proxyPort	: request.headers["x-forwarded-port"],
							proxyFor	: request.headers["x-forwarded-for"],
							proxyHost	: request.headers["x-forwarded-host"],	
							proxyVia	: request.headers["via"] 
						}
						this.logger( "PROXY REQUEST x-forwarded VIA : " + context.proxy.proxyVia , "DEBUG");
					}

					context.crossDomain = context.isCrossDomain() ;

					//twig extend context
					context.extendTwig = {
						nodefony:{
							url:context.request.url
						},
						getFlashBag:flashTwig.bind(context),
						render:render,
						controller:myController.bind(container),
						trans:translation.trans.bind(translation),
						getLocale:translation.getLocale.bind(translation),
						trans_default_domain:function(){
							translation.trans_default_domain.apply(translation, arguments) ;
						},
						getTransDefaultDomain:translation.getTransDefaultDomain.bind(translation)
					}
					
					//request events	
					context.notificationsCenter.listen(this, "onError", this.onError);
					
					// FRONT ROUTER 
					try {
						var resolver  = this.get("router").resolve(container, context);
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

					this.fire("onHttpRequest", container, context, type);
					
					if ( ( ! this.firewall ) || resolver.bypassFirewall ){
						request.on('end', () => {
							try {
								if ( context.sessionAutoStart === "autostart" ){
					 				this.sessionService.start(context, "default", (err, session) => {
						 				if (err){
											throw err ;
						 				}
										this.logger("AUTOSTART SESSION","DEBUG")
										context.notificationsCenter.fire("onRequest",container, request, response );	
					 				});
								}else{
									context.notificationsCenter.fire("onRequest",container, request, response );	
								}
							}catch(e){
								context.notificationsCenter.fire("onError", container, e );	
							}
						});
						return ;	
					}
				break;
				case "WEBSOCKET" :
				case "WEBSOCKET SECURE" :
					var context = new nodefony.context.websocket(container, request, response, type);

					container.set("context", context);

					context.listen(this,"onClose" , (reasonCode, description) => {
						context.fire("onFinish", context, reasonCode, description);
						delete 	context.extendTwig ;
						context.clean();
						//context.destroy() ;
						context = null ;
						//if (context.profiling) delete context.profiling ;
						//request.destroy() ;
						request = null ;
						//response.destroy() ;
						response = null ;
						//container.destroy() ;
						container = null ;
						//translation.destroy() ;
						translation = null ;
						if (domain) {
							delete domain.container ;
							//domain.destroy() ;
							domain = null ;
						}

					});

					context.crossDomain = context.isCrossDomain() ;

					//twig extend context
					context.extendTwig = {
						nodefony:{
							url:context.originUrl
						},
						getFlashBag:flashTwig.bind(context),
						render:render.bind(container),
						controller:myController.bind(container),
						trans:translation.trans.bind(translation),
						getLocale:translation.getLocale.bind(translation),
						trans_default_domain:function(){
							translation.trans_default_domain.apply(translation, arguments) ;
						},
						getTransDefaultDomain:translation.getTransDefaultDomain.bind(translation)
					}

					context.notificationsCenter.listen(this, "onError", this.onErrorWebsoket);	

					var resolver  = this.get("router").resolve(container, context);
					if (resolver.resolve) {
						context.resolver = resolver ;	
					}else{
						//var error = new Error("Not Found", 404);	
						return context.notificationsCenter.fire("onError", container, {
							status:404,
							error:"URI :" + request.url,
							message:"not Found"
						});
					}

					this.fire("onWebsocketRequest", container, context, type);
					
					if ( ( ! this.firewall ) || resolver.bypassFirewall ){
						try {
							if ( context.sessionAutoStart === "autostart" ){
					 			this.sessionService.start(context, "default", (err, session) => {
						 			if (err){
										throw err ;
						 			}
									this.logger("AUTOSTART SESSION","DEBUG")
									context.notificationsCenter.fire("onRequest",container, request, response );	
					 			});
							}else{
								context.notificationsCenter.fire("onRequest",container, request, response );	
							}
						}catch(e){
							context.notificationsCenter.fire("onError", container, e );	
						}
						return ;	
					}
				break;
			}
			this.fire("onSecurity", context);
		};
	};
	
	return httpKernel ;
});
