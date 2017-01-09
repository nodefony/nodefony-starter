/*
 *
 *
 *
 *
 *
 */

nodefony.registerService("httpKernel", function(){

	var myController = function(pattern, data){
		try {
			var router = this.get("router");
			var resolver = router.resolveName(this, pattern) ;

			var control = new resolver.controller( this, resolver.context );
			if ( data ){
				Array.prototype.shift.call( arguments );
				for ( var i = 0 ; i< arguments.length ; i++){
					resolver.variables.push(arguments[i]);	
				}
				//resolver.variables.push(data); 
			}
			return resolver.action.apply(control, resolver.variables);
		}catch(e){
			this.logger(e, "ERROR");
			//throw e.error
		}	
	};

	var render = function(response){
		switch (true){
			case response instanceof nodefony.Response :
				return response.body;
			case response instanceof nodefony.wsResponse :
				return response.body;
			case response instanceof Promise :
				return response;
			case nodefony.typeOf(response) === "object":
				return nodefony.extend(true , this, response);
			default:
				return response ;
		}
	};

	var flashTwig = function(key){
		if ( this.session ){
			return this.session.getFlashBag(key) ;
		}
		return null ;
	};

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
					throw e ;
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

			this.listen(this, "onClientError", (e) => {
				this.logger(e, "ERROR", "HTTP KERNEL SOCKET CLIENT ERROR");
			});
		}

		boot (){
		 	/*this.listen(this, "onBoot", function(){
		 	});*/
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
				if (  typeof this.kernel.domainAlias === "string" ){
					alias = this.kernel.domainAlias.split(" ");
					Array.prototype.unshift.call(alias,  "^"+this.kernel.domain+"$" );
					for ( var i = 0 ; i <alias.length ;i++ ){
						if (i === 0){ 
							str = alias[i];
						}else{
							str += "|"+ alias[i] ;
						}
					}
					if (str){
						this.regAlias = new RegExp(str);
					}
				}else{
					throw new Error ("Config file bad format for domain alias must be a string ");
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

		getView ( name ){
			var tab = name.split(":");
			var bundle = tab[0] ;
			var controller = tab[1] || ".";
			var action = tab[2];
			bundle = this.kernel.getBundle( this.kernel.getBundleName(bundle) );
			if (! bundle ){
				throw new Error("BUNDLE :" + bundle +"NOT exist");
			}
			try {
				return bundle.getView(controller, action);
			}catch (e){
				throw e;	
			}
		}

		getTemplate ( name ){
			var tab = name.split(":");
			var bundle = tab[0] ;
			var controller = tab[1] || ".";
			var action = tab[2];
			bundle = this.kernel.getBundle( this.kernel.getBundleName(bundle) );
			if (! bundle ){
				throw new Error("BUNDLE :" + bundle +"NOT exist");
			}
			try {
				return bundle.getTemplate(controller, action);
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

		onError (container, error){
			var myError = null ;
			if ( ! error ){
 		       		error = {status:500,
					message:"nodefony undefined error "
				};
				console.trace(error);
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
			var context = container.get('context');
			if ( (! context ) ||  ( ! context.response ) ){
 				return 	;
			}
			var resolver= null ;
			if ( typeof error === "object" && ( !  error.status ) ){
				error.status = context.response.getStatusCode() ;
			}
			switch (error.status){
				case 404:
					resolver = container.get("router").resolveName(container, "frameworkBundle:default:404");
				break;
				case 401:
					resolver = container.get("router").resolveName(container, "frameworkBundle:default:401");
				break;
				case 403:
					resolver = container.get("router").resolveName(container, "frameworkBundle:default:403");
				break;
				case 408:
					resolver = container.get("router").resolveName(container, "frameworkBundle:default:timeout");
				break;
				default:
					resolver = container.get("router").resolveName(container, "frameworkBundle:default:exceptions");
			}
			context.response.setStatusCode(error.status || 500 ) ;

			if (error.xjson){
				if ( context.setXjson ){ 
					context.setXjson(error.xjson);
				}
			}
			resolver.callController( {
				exception:myError || error,
				Controller: container.get("controller") ? container.get("controller").name : null,
				bundle:container.get("bundle") ? container.get("bundle").name : null
			} );
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
			//var context = container.get('context');
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

		//  build response
		handle (request, response, type, domain){

			var context = null ;
			var resolver = null ;
			// SCOPE REQUEST ;
			var container = this.container.enterScope("request");	
			if ( domain ) { domain.container = container ; }

			//I18n
			var translation = new nodefony.services.translation( container, type );
			container.set("translation", translation );
			
			switch (type){
				case "HTTP" :
				case "HTTPS" :
					context = new nodefony.context.http(container, request, response, type);
					container.set("context", context);
					//response events	
					context.response.response.on("finish",() => {
						//console.log("FINISH")
						context.fire("onFinish", context);
						this.container.leaveScope(container);
						delete context.extendTwig ;
						if (context.proxy) { delete context.proxy ; }
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
					};
					
					//request events	
					context.notificationsCenter.listen(this, "onError", this.onError);
					
					// FRONT ROUTER 
					try {
						resolver  = this.get("router").resolve(container, context);
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
					 				this.sessionService.start(context, "default", (err) => {
						 				if (err){
											throw err ;
						 				}
										this.logger("AUTOSTART SESSION","DEBUG");
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
					context = new nodefony.context.websocket(container, request, response, type);

					container.set("context", context);

					context.listen(this,"onClose" , (reasonCode, description) => {
						context.fire("onFinish", context, reasonCode, description);
						delete 	context.extendTwig ;
						context.clean();
						context = null ;
						//if (context.profiling) delete context.profiling ;
						request = null ;
						response = null ;
						container = null ;
						translation = null ;
						if (domain) {
							delete domain.container ;
							domain = null ;
						}
					});
					
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
					};

					context.notificationsCenter.listen(this, "onError", this.onErrorWebsoket);	

					resolver  = this.get("router").resolve(container, context);
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
					 			this.sessionService.start(context, "default", (err) => {
						 			if (err){
										throw err ;
						 			}
									//this.logger("AUTOSTART SESSION","DEBUG");
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
		}
	};
	return httpKernel ;
});
