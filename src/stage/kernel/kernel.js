/*
 *
 *
 *
 *	KERNEL stage JS
 *
 *
 *
 */

stage.register("kernel",function(){

	var settingsSyslog = {
		//rateLimit:100,
		//burstLimit:10,
		moduleName:"KERNEL",
		defaultSeverity:"INFO"
	};

	var defaultSettings = {
		debug:false,
		location:{
			html5Mode:false,
			hashPrefix:"/"
		}
	};

	var Kernel = function(environment, settings){
		this.container = null; 
		this.modules = {};
		this.settings = stage.extend(true, {}, defaultSettings , settings );
		this.environment = environment;
		this.debug = this.settings.debug ;
		this.booted = false;
		this.container = new stage.Container();
		this.container.set("kernel", this);
		this.isDomReady = false;
		this.uiContainer = null;

		// syslog
		this.syslog = this.initializeLog(settingsSyslog);
		this.container.set("syslog", this.syslog);

		// autoloader
		this.autoloader = new stage.autoload(this, {
			transport:"script"
		});
		this.container.set("autoloader", this.autoloader);

		// notificationsCenter
		this.notificationsCenter =  stage.notificationsCenter.create();
		this.container.set("notificationsCenter", this.notificationsCenter);
		
		// location
		this.initLocation();

		// Router
		this.initRouter();

		// template
		this.initTwig();

		// translation i18n
		this.initTranslation();

		// Service REST
		this.initRest()

		// EVENT NATIF
		$(document).ready(this.listen(this, "onDomReady", this.domReady));
		$(window).resize(this.listen(this,"onResize"));
		$(window).unload(this.listen(this,"onUnLoad"));	

		//BOOT	
		this.listen(this, "onBoot" , this.boot)
		//READY
		this.listen(this, "onReady" , this.ready)

		this.notificationsCenter.settingsToListen(this.settings, this);
	};


	Kernel.prototype.set = function(name, value){
		return this.container.set(name, value);	
	};

	Kernel.prototype.get = function(name, value){
		return this.container.get(name, value);	
	};
		
	Kernel.prototype.setParameters =function(name, value){
		return this.container.setParameters(name, value);	
	};

	Kernel.prototype.getParameters = function(name){
		return this.container.getParameters(name);	
	};

	Kernel.prototype.initRouter = function(){
		this.router = new stage.router(this, this.container);
		this.container.set("router", this.router);
	};


	Kernel.prototype.initLocation = function(){
		this.locationService = new stage.location(this, this.settings.location) ;
		this.container.set("location", this.locationService);
	};


	Kernel.prototype.initRest = function(){
		if (stage.Rest) {
			this.restService = new stage.Rest(this.container);
			this.set("rest", this.restService);
		}
	};

	Kernel.prototype.initTranslation = function(){
		if ( ! stage.i18n ){
 		       	this.logger("you must load transation i18n services js file !!!!!", "ERROR")
			return
		}
		this.i18n = new stage.i18n(this, this.container);

		this.container.set("i18n", this.i18n);
	};

	/*
 	 *	OVERRIDE TWIG IMPORT TEMPLATE
 	 */
	var loadRemoteTwig = function(Twig, location, params, callback, error_callback){
		var id  = params.id,
		method      = params.method,
		async       = params.async,
		precompiled = params.precompiled,
		template    = null;

		// Default to async
		if (async === undefined) async = true;

		// Default to the URL so the template is cached.
		if (id === undefined) {
			id = location;
		}
		params.id = id;

		// Check for existing template
		if (Twig.cache && Twig.Templates.registry.hasOwnProperty(id)) {
			// A template is already saved with the given id.
			if (callback) {
				callback(Twig.Templates.registry[id]);
			}
			return Twig.Templates.registry[id];
		}
		//console.log(params.async)
		$.ajax({
			url:location,
			async:params.async,
			success:function(data, status, xhr){
				var moduleName = this.getModuleName( location )
			        if (precompiled === true) {
					data = JSON.parse(data);
				}
				params.url = location;
				params.data = data;
				template = new Twig.Template(params);
				if (this.modules[moduleName]){
					var module = this.modules[moduleName] ;
					var name = module.getTemplateName(location)
					module.registerTemplate(name, template, "template")
				}
				if (callback) {
					callback(template);
				}
			}.bind(this),
			error: function(xrh, status, message){
				error_callback(xrh, status, message)
			}.bind(this)
		})
		if (async === false) {
			return template;
		} else {
			// placeholder for now, should eventually return a deferred object.
			return true;
		}	
	};
	
	Kernel.prototype.initTwig = function(){
		this.logger("INITIALIZE TWIG SERVICE", "DEBUG");
		if (this.environment === "dev"){
			window.Twig.cache = false ;	
		}
		this.templateEngine = twig ; 
		//extended log error traf
		window.Twig.extend(function(Twig){
			Twig.log.error = function(message){
				this.logger(message, "ERROR");
			}.bind(this)
		}.bind(this));

		window.Twig.extend(function(Twig){
			Twig.Templates.loadRemote = loadRemoteTwig.bind(this, Twig) 
		}.bind(this));

		//extended FUNCTION
		window.Twig.extendFunction("controller", function() {
			var pattern = Array.prototype.shift.call(arguments);
			var sp = pattern.split(":");
			var module = this.getModule(sp[0]);
			if (module){
				var controller = module.getController(sp[1]);
				if (controller){
					var action = sp[2];
					if ( controller[action] ){
						return controller[action].apply(controller, arguments);	
					}
				}
			}
		}.bind(this));
		this.container.set("twig", this.templateEngine);
		return this.templateEngine ;

	};

	Kernel.prototype.domReady = function(){
		if ( ! this.booted ) return ; 
		this.logger("domReady", "DEBUG");
		this.fire("onDomLoad", this);
		var element = this.uiContainer ? $(this.uiContainer) : $("body");
		try {
			if ( this.modules["app"] ){
				this.modules["app"].initialize(element);	
			}		
			for (var module in this.modules){
				if (module === "app") continue;
				this.modules[module].initialize(element);
			}	
			this.fire("onReady", this);
			this.isDomReady = true;
		}catch(e){
			this.logger(e,"ERROR");
		}
	};

	
	Kernel.prototype.listen = function(){
		return this.notificationsCenter.listen.apply(this.notificationsCenter, arguments);
	}

	Kernel.prototype.fire = function(event){
		this.logger("EVENT : " + event,"DEBUG");
		return this.notificationsCenter.fire.apply(this.notificationsCenter, arguments);
	};

	Kernel.prototype.getModule = function(name){
		return this.modules[name] ;
	};
	
	Kernel.prototype.logger = function(pci, severity, msgid,  msg){
		if (! msgid) msgid = "KERNEL "
		return this.syslog.logger(pci, severity, msgid,  msg);
	};

	Kernel.prototype.initializeLog = function(settings){
		
		var syslog =  new stage.syslog(settings);
		if (this.environment === "dev"){
		// CRITIC ERROR
			syslog.listenWithConditions(this,{
				severity:{
					data:"CRITIC,ERROR"
				}		
			},function(pdu){
					console.log(pdu.payload)
				if (pdu.payload.stack ){
						console.error( "SYSLOG " + pdu.severityName +" " + pdu.msgid + " "+new Date(pdu.timeStamp) + " " + pdu.msg+" : "+  pdu.payload.stack);
				}else{
					console.error( "SYSLOG " + pdu.severityName +" " + pdu.msgid + " "+new Date(pdu.timeStamp) + " " + pdu.msg+" : "+  pdu.payload);	
				}
				/*if (pdu.typePayload === "Error" ){
					if (pdu.payload.stack ){
						console.error( "SYSLOG " + pdu.severityName +" " + pdu.msgid + " "+new Date(pdu.timeStamp) + " " + pdu.msg+" : "+  pdu.payload.stack);
					}
					return;
				}
				console.error( "SYSLOG " + pdu.severityName +" " + pdu.msgid + " "+new Date(pdu.timeStamp) + " " + pdu.msg+" : "+  pdu.payload);*/	
			});
			// INFO DEBUG
			var data ;
			this.debug ? data = "INFO,DEBUG" : data = "INFO" ;
			syslog.listenWithConditions(this,{
				severity:{
					data:data
				}		
			},function(pdu){
				console.info( "SYSLOG " + pdu.severityName +" " + pdu.msgid + " "+new Date(pdu.timeStamp) + " " + pdu.msg+" : "+ pdu.payload);
			});
			syslog.listenWithConditions(this,{
				severity:{
					data:"WARNING"
				}		
			},function(pdu){
				console.warn( "SYSLOG " + pdu.severityName +" " + pdu.msgid + " "+new Date(pdu.timeStamp) + " " + pdu.msg+" : "+ pdu.payload);
			});
		}
		return syslog;
	};

	Kernel.prototype.boot = function(){
		this.booted = true;
	};

	Kernel.prototype.ready = function(){
		//this.fire("onUrlChange", this.router.url() )
	};

	Kernel.prototype.loadModule = function(url, settings){
		var res = stage.io.urlToOject(url);
		var moduleName = res.basename ;
				
		return $.ajax(url,stage.extend( {
			cache:false,
			method:"GET",
			//async:false,
			dataType:"xml",
			success:function(data, status, xhr){
				try {
					//FIXME try to parse with url
					var res = stage.xml.parseXml(data);
					var moduleName = res.module["@id"];
					var type = res.module["@type"];
					var moduleSrc = res.module["@src"];
				 
					switch ( type ){
						case "application/javascript" :
							if ( moduleSrc ){
								if (moduleName in this.modules) {
									this.modules[moduleName].initialize();
									this.modules[moduleName].fire("onInitialize", moduleName);	
									this.fire("onInitializeModule", moduleName);	
								} else {							
									this.autoloader.load(moduleSrc, function(error, transport){
										if (error){
											this.fire("onError", error);
											throw error;
										}
										this.registerModule(moduleName, res);
										if (moduleName === "app")
											this.fire("onBoot", this);
									}.bind(this));
								}
							}
						break;
					}
				}catch(e){
					this.logger(e, "ERROR");
					this.fire("onError", e);
					throw e ;
				}
			}.bind(this),
			error:function(xhr, status, message){
				this.fire("onGetConfigError", moduleName);
				this.fire("onError", message);	
			}.bind(this)
		}, settings))
	};

	Kernel.prototype.registerModule = function(name, xml){
		if (name in stage.modules){
			var kernelcontext = this;
			var Class = stage.modules[name].herite(stage.Module);
			this.container.addScope(name);
			Class.prototype.name = name;
			try {
				if (this.isDomReady){
						this.modules[name] = new Class(this, xml,{
							onReady:function(){
								if (this.initialize){
									try {
										this.initialize();
										this.fire("onInitialize", name);	
										kernelcontext.fire("onInitializeModule", name);
									}catch(e){
										this.logger("INITIALIZE MODULE : "+name +" "+e, "ERRROR");
										throw e;
									}
										
								}
							}});	
					
					
				}else{
					this.modules[name] = new Class(this, xml);
				}
				this.container.set(name, this.modules[name]);
			}catch(e){
				this.logger("INSTANCE MODULE : "+name +" "+e, "ERRROR")
				throw e;
			}
		}
	};

	Kernel.prototype.getModuleName = function(url){
		var module = stage.dirname(url);
		var tab = module.split("/")
		return tab[tab.indexOf("Resources")-1];
	};

	return  Kernel;
});
