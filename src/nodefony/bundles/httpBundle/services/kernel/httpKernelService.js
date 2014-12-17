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
			this.handle(request, response, type, domain);
		}.bind(this))
	};
	
	httpKernel.prototype.boot = function(){
				
		// Manage statics files
		 this.kernel.listen(this, "onBoot", function(){
			this.initStaticFiles();
		 }.bind(this));
			
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
		if ( error.stack ){
			var myError =  error.stack;
			this.logger(myError);
			myError = myError.split('\n').map(function(v){ return ' -- ' + v +"</br>"; }).join('');
            			
		}else{
			var myError =  util.inspect(error);
			this.logger(myError);
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
			this.setXJSON(context, error.xjson);
		}
		resolver.callController( {
			exception:myError,
			controller: container.get("controller") ? container.get("controller").name : null,
			bundle:container.get("bundle") ? container.get("bundle").name : null
		} );
	};

	httpKernel.prototype.setXJSON  = function(context, xjson){
		switch ( nodefony.typeOf(xjson) ){
			case "object":
				context.response.headers["X-Json"] = JSON.stringify(xjson);
				return xjson;
			break;
			case "string":
				context.response.headers["X-Json"] = xjson;
				return JSON.parse(xjson);
			break;
			case "Error":
				if ( typeof xjson.message === "Object" ){
					context.response.headers["X-Json"] = JSON.stringify(xjson.message);
					return xjson.message;	
				}else{
					context.response.headers["X-Json"] = xjson.message;
					return {error:xjson.message};	
				}
			break;
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

		container.setParameters("request.protocol" , type);

		switch (type){
			case "HTTP" :
				var context = new nodefony.io.transports.http(container, request, response, type);
				container.set("context", context);
				var port = this.kernel.httpPort ;
				container.setParameters("request.host" , this.kernel.domain + ":" +port );
				//Parse cookies request
				context.parseCookies();
				this.kernel.fire("onHttpRequest", container, context, type);
			break;
			case "HTTPS" :
				var context = new nodefony.io.transports.http(container, request, response, type);
				container.set("context", context);
				var port = this.kernel.httpsPort ;
				container.setParameters("request.host" , this.kernel.domain + ":" +port );
				//Parse cookies request
				context.parseCookies();
				this.kernel.fire("onHttpsRequest", container, context, type);
			break;
			case "WEBSOCKET" :
				var context = new nodefony.io.transports.websocket(container, request, response, type);
				container.set("context", context);
				this.kernel.fire("onWebsocketRequest", container, context, type);
			break;
			case "WEBSOCKET SECURE" :
				var context = new nodefony.io.transports.websocket(container, request, response, type);
				container.set("context", context);
				this.kernel.fire("onWebSocketSecureRequest", container, context, type);
			break;
		}

		//request events	
		context.notificationsCenter.listen(this, "onError", this.onError);

		var firewall = this.get("security");
		if( ! firewall){
			request.on('end', function(){
				context.notificationsCenter.fire("onRequest",container, request, response ); 
			});
		}
	};

	return httpKernel ;
});
