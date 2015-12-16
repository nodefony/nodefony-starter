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
		this.kernel = this.container.get("kernel") ;
		this.type = this.kernel.type;
		if( ! this.kernel.settings.system.statics ) return null ;
		if( this.type !== "SERVER") return  null ;
		this.connect = require("connect");
		this.syslog = this.container.get("syslog");
		this.server = this.connect();

		this.settingsAssetic = this.container.getParameters("bundles.assetic");

		this.mime = this.connect.static.mime;
		this.kernel.listen(this, "onBoot",function(){
			this.settings = nodefony.extend({}, defaultStatic ,this.container.getParameters("bundles.http").statics.settings, options);
			if (this.settings.cache)
				this.server.use(this.connect.staticCache());	
			this.initStaticFiles()
		});

		this.environment = this.kernel.environment ;
		this.kernel.listen(this, "onReady", function(){
			this.serviceLess = this.container.get("less");
		})
	
	};

	static.prototype.initStaticFiles = function(){
		var settings = this.container.getParameters("bundles.http").statics ;
		for(var static in settings ){
			if ( static === "settings" ) continue ;
			var path = this.kernel.rootDir + settings[static].path ;
			var age = settings[static].maxage;
			this.logger("Add static route ===> " + path ,"DEBUG");
			this.addDirectory(path ,{
				maxAge: eval ( age )
			});
		}
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
				var res = this.serviceLess.handle(request, response, type, function(err, dest){
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

