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
	};
	
	httpKernel.prototype.boot = function(){
				
		// Manage Templating	
		//this.initTemplate();	
				
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

	httpKernel.prototype.getRequestType = function(type){
		switch (type){
			case "HTTP" :
			case "HTTPS" :
				return nodefony.io.transports.http;
			break;
			case "WEBSOCKET" :
			case "WEBSOCKET_SECURE" :
			case "WEBSOCKET SECURE" :
				return nodefony.io.transports.websocket;
			break
		}
		return null;
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
	httpKernel.prototype.handle = function(container, request, response, type){
		//  manage EVENTS
		var notificationsCenter = container.get("notificationsCenter");
		//request events	
		notificationsCenter.listen(this, "onError", this.onError)

		var Class  = this.getRequestType(type);
		var context = new Class(container, request, response, type);
		container.set("context", context); 

		if (type === "HTTP" || type === "HTTPS"){
			container.setParameters("request.protocol" , type);
			var port = (type === "HTTP") ? this.kernel.httpPort : this.kernel.httpsPort ;
			container.setParameters("request.host" , this.kernel.domain + ":" +port );
			//Parse cookies request
			context.parseCookies();
		}


		//I18n
		var translation = new nodefony.services.translation( container, type );
		//var classTranslation = this.container.getParameters("services.translation").class 
		//var translation = new classTranslation( container, type );
		container.set("translation", translation );
		
		return 	context ;
	};

	return httpKernel ;
})
