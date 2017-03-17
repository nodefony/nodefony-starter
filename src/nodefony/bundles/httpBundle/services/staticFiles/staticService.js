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
	
	var Static = class Static extends nodefony.Service {

		constructor ( container, options){

			var kernel = container.get("kernel");
			super( "statics", container, kernel.notificationsCenter   );

			this.kernel = kernel;
			this.type = this.kernel.type;
			if( ! this.kernel.settings.system.statics ) { return  ; }
			if( this.type !== "SERVER") { return ; }
			this.connect = require("connect");
			//this.syslog = this.container.get("syslog");
			this.server = this.connect();

			this.settingsAssetic = this.container.getParameters("bundles.assetic");

			this.mime = this.connect.static.mime;
			this.listen(this, "onBoot",() => {
				this.settings = nodefony.extend({}, defaultStatic ,this.container.getParameters("bundles.http").statics.settings, options);
				if (this.settings.cache){
					this.server.use(this.connect.staticCache());	
				}
				this.initStaticFiles();
			});

			this.environment = this.kernel.environment ;
			this.listen(this, "onReady", () => {
				this.serviceLess = this.container.get("less");
			});
		}

		initStaticFiles (){
			var settings = this.container.getParameters("bundles.http").statics ;
			for(var myStatic in settings ){
				if ( myStatic === "settings" ){ continue ;}
				var path = this.kernel.rootDir + settings[myStatic].path ;
				var age = settings[myStatic].maxage;
				this.logger("Add static route ===> " + path ,"DEBUG");
				this.addDirectory(path ,{
					maxAge: eval ( age )
				});
			}
		}

		logger (pci, severity, msgid,  msg){
			if (! msgid) {msgid = "SERVER STATIC FILE ";}
			return this.syslog.logger(pci, severity, msgid,  msg);
		}

		addDirectory (path, options){
			var settings = nodefony.extend({}, this.settings, options);
			return this.server.use ( this.connect.static(path, settings) );
		}

		serve (request, response, callback){
			/*if (this.environment === "dev" && this.kernel.debug){
				this.logger("URL : "+request.url , "DEBUG")
			}*/
			var type  = this.mime.lookup(request.url);
			response.setHeader("Content-Type", type);
			// LESS IN THE FLY
			/*if ( this.environment === "dev" && this.serviceLess && this.serviceLess.hasLess && type === "text/css"  ){
				try {
					var res = this.serviceLess.handle(request, response, type, (err, dest) => {
						this.server.handle(request, response, () => {
							response.setHeader("Content-Type", "text/html");
							callback.apply(this, arguments);	
						});	
					});
					if (res) {return ;} 
				}catch(e){
					this.logger(e, "ERROR");	
				}
			}*/
			this.server.handle(request, response, () => {
				callback.apply(this, arguments);	
			});
		}
		
		handle (request, response, callback){
			request.path = request.url;
			this.serve(request, response, callback );
		}
	};
	return Static;
});

