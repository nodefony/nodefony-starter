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
	var httpKernel = function(container, serverStatic ){
		this.container = container ;
		this.kernel = this.container.get("kernel");
		this.reader = this.container.get("reader");
		this.serverStatic = serverStatic;
		this.engineTemplate = this.container.get("templating");

		this.container.addScope("request");
		this.kernel.listen(this, "onServerRequest" , function(request, response, type, domain){
			try {
				this.handle(request, response, type, domain);
			}catch(e){
				throw e
			}
		});
		this.firewall = null ;
		this.kernel.listen(this, "onReady", function(){
			this.firewall = this.get("security") ;
		});

		this.kernel.listen(this, "onClientError", function(e, socket){
			this.logger(e, "ERROR", "HTTP KERNEL CLIENT ERROR")
		});
	};
	
	httpKernel.prototype.boot = function(){
		// Manage statics files
		 this.kernel.listen(this, "onBoot", function(){
			this.initStaticFiles();
		 });
	};
	
	httpKernel.prototype.getTemplate = function(name){
		return nodefony.templatings[name];
	};

	httpKernel.prototype.getView = function(name){
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

	httpKernel.prototype.initStaticFiles = function(){
		var settings = this.container.getParameters("bundles.http").statics ;
		var defaultCache = settings.settings.cache ;
		var defaultAge = settings.settings.maxAge ;
		for(var static in settings ){
			if ( static === "settings" ) continue ;
			var path = this.kernel.rootDir + settings[static].path ;
			var age = settings[static].maxage;
			this.logger("Add static route ===> " + path ,"DEBUG");
			this.serverStatic.addDirectory(path ,{
				maxAge: eval ( age )
			});
		}
	};

	httpKernel.prototype.initTemplate = function(){
		var classTemplate = this.getTemplate(this.settings.templating);
		this.templating = new classTemplate(this.container, this.settings[this.settings.templating]);
		this.set("templating", this.templating );
	};

	httpKernel.prototype.logger = function(pci, severity, msgid,  msg){
		var syslog = this.container.get("syslog");
		if (! msgid) msgid = "HTTP KERNEL ";
		return syslog.logger(pci, severity, msgid,  msg);
	};

	httpKernel.prototype.onError = function(container, error){
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
			controller: container.get("controller") ? container.get("controller").name : null,
			bundle:container.get("bundle") ? container.get("bundle").name : null
		} );
	};


	var render = function(pattern, data){
		try {
			var router = this.get("router");
			var resolver = router.resolveName(this, pattern) ;
			return resolver.callController(data) ;
		}catch(e){
			this.logger(e)
			throw e.error
		}	
	};

	//  build response
	httpKernel.prototype.handle = function(request, response, type, domain){

		// SCOPE REQUEST ;
		var container = this.container.enterScope("request");	
		if ( domain ) domain.container = container ;

		//I18n
		var translation = new nodefony.services.translation( container, type );
		container.set("translation", translation );

		this.engineTemplate.extendFunction("render", render.bind(container));
		this.engineTemplate.extendFunction("controller", render.bind(container));

		switch (type){
			case "HTTP" :
			case "HTTPS" :
				var context = new nodefony.io.transports.http(container, request, response, type);
				container.set("context", context);
				//request events	
				context.notificationsCenter.listen(this, "onError", this.onError);
				var port = ( type === "HTTP" ) ? this.kernel.httpPort : this.kernel.httpsPort ;
				var serverHost = this.kernel.domain + ":" +port ; ;
				var URL = Url.parse(request.headers.referer || request.headers.origin || context.type+"://"+request.headers.host ) ;
				var cross = ! ( URL.protocol+"//"+URL.host  === context.type.toLowerCase()+"://"+serverHost ) ;
				//context.serverHost = serverHost ;
				context.crossDomain = cross ;
				context.crossURL = URL ;
				this.kernel.fire("onHttpRequest", container, context, type);
				if (! this.firewall){
					request.on('end', function(){
						context.notificationsCenter.fire("onRequest",container, request, response );	
					});
					return ;	
				}
			break;
			case "WEBSOCKET" :
			case "WEBSOCKET SECURE" :
				var context = new nodefony.io.transports.websocket(container, request, response, type);
				container.set("context", context);
				//request events	
				context.notificationsCenter.listen(this, "onError", this.onError);
				this.kernel.fire("onWebsocketRequest", container, context, type);
				if (! this.firewall){
					context.notificationsCenter.fire("onRequest",container, request, response );
					return ;	
				}
			break;
		}
		this.kernel.fire("onSecurity", context);
	};

	return httpKernel ;
});
