/*
 *
 *
 *
 *
 */
//var static = require('node-static');


nodefony.registerService("statics", function(){


	var defaultStatic = {
		cache :true,	
		maxAge: 96*60*60
	};
	
	var static = function( container, options){
	
		this.container = container ;
		this.connect = require("connect");
		this.settings = nodefony.extend({}, defaultStatic ,this.container.getParameters("bundles.http").statics.settings, options);		
		this.syslog = this.container.get("syslog");
		this.server = this.connect();

		this.settingsAssetic = this.container.getParameters("bundles.assetic");

		this.mime = this.connect.static.mime;
		if (this.settings.cache)
			this.server.use(this.connect.staticCache());	

		this.kernel = this.container.get("kernel") ;
		this.environment = this.kernel.environment ;
		this.kernel.listen(this, "onReady", function(){
			this.serviceLess = this.container.get("less");
		})
	
	};

	static.prototype.logger = function(pci, severity, msgid,  msg){
		if (! msgid) msgid = "SERVER STATIC FILE ";
		return this.syslog.logger(pci, severity, msgid,  msg);
	};

	static.prototype.addDirectory = function(path, options){
		var settings = nodefony.extend({}, this.settings, options);
		return this.server.use ( this.connect.static(path, settings) );
	};


	static.prototype.serve = function(request, response, callback){
		/*if (this.environment === "dev" && this.kernel.debug){
			this.logger("URL : "+request.url , "DEBUG")
		}*/
		var type  = this.mime.lookup(request.url);
		response.setHeader("Content-Type", type);
		// LESS IN THE FLY
		if ( this.environment === "dev" && this.serviceLess && this.serviceLess.hasLess && type === "text/css"  ){
			try {
				var res = this.serviceLess.handle(request, response, type, function(){
					this.server.handle(request, response, function(){
						response.setHeader("Content-Type", "text/html");
						callback.apply(this, arguments);	
					}.bind(this));	
				}.bind(this));
				if (res) return ; 
			}catch(e){
				this.logger(e, "ERROR");	
			}
		}
		this.server.handle(request, response, function(){
			response.setHeader("Content-Type", "text/html");
			callback.apply(this, arguments);	
		}.bind(this));
	};

	static.prototype.get = function(name){
		if (this.container)
			return this.container.get(name);
		return null;
	};

	static.prototype.set = function(name, obj){
		if (this.container)
			return this.container.set(name, obj);
		return null;
	};

	static.prototype.handle = function(request, response, callback){
		request.path = request.url;
		this.serve(request, response, callback )
	}
	
	return static;

})

