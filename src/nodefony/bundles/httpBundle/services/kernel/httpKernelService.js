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
				var myError =  util.inspect(error);
				this.logger(myError);
			}
		}
		var context = container.get('context');
		switch (error.status){
			case 404:
				context.response.statusCode = error.status;
				var resolver = container.get("router").resolveName(container, "frameworkBundle:default:404");
			break;
			case 401:
				context.response.statusCode = error.status;
				var resolver = container.get("router").resolveName(container, "frameworkBundle:default:401");
			break;
			default:
				context.response.statusCode = 500;
				var resolver = container.get("router").resolveName(container, "frameworkBundle:default:exceptions");
		}
		if (error.xjson){
			if ( context.setXjson ) 
				context.setXjson(error.xjson);
		}
		resolver.callController( {
			exception:myError,
			controller: container.get("controller") ? container.get("controller").name : null,
			bundle:container.get("bundle") ? container.get("bundle").name : null
		} );
	};


	//  build response
	httpKernel.prototype.handle = function(request, response, type, domain){

		// SCOPE REQUEST ;
		var container = this.container.enterScope("request");	
		if ( domain ) domain.container = container ;

		//I18n
		var translation = new nodefony.services.translation( container, type );
		container.set("translation", translation );

		container.setParameters("request.protocol" , type);
		switch (type){
			case "HTTP" :
				var context = new nodefony.io.transports.http(container, request, response, type);
				container.set("context", context);
				//request events	
				context.notificationsCenter.listen(this, "onError", this.onError);
				var port = this.kernel.httpPort ;
				container.setParameters("request.host" , this.kernel.domain + ":" +port );
				//Parse cookies request
				context.parseCookies();
				this.kernel.fire("onHttpRequest", container, context, type);
			break;
			case "HTTPS" :
				var context = new nodefony.io.transports.http(container, request, response, type);
				container.set("context", context);
				//request events	
				context.notificationsCenter.listen(this, "onError", this.onError);
				var port = this.kernel.httpsPort ;
				container.setParameters("request.host" , this.kernel.domain + ":" +port );
				//Parse cookies request
				context.parseCookies();
				this.kernel.fire("onHttpRequest", container, context, type);
			break;
			case "WEBSOCKET" :
				var context = new nodefony.io.transports.websocket(container, request, response, type);
				container.set("context", context);
				//request events	
				context.notificationsCenter.listen(this, "onError", this.onError);
				this.kernel.fire("onWebsocketRequest", container, context, type);
			break;
			case "WEBSOCKET SECURE" :
				var context = new nodefony.io.transports.websocket(container, request, response, type);
				container.set("context", context);
				//request events	
				context.notificationsCenter.listen(this, "onError", this.onError);
				this.kernel.fire("onWebSocketRequest", container, context, type);
			break;
		}

		if( ! this.firewall){
			if (type === "HTTP" || type === "HTTPS"){
				request.on('end', function(){
					context.notificationsCenter.fire("onRequest",container, request, response );	
				});
			}
			if (type === "WEBSOCKET" || type === "WEBSOCKET SECURE"){
				context.notificationsCenter.fire("onRequest",container, request, response );
			}
		}
	};

	return httpKernel ;
});
