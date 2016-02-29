/*
 *
 *
 *
 *
 */
var fs = require("fs");
var util = require('util');
var path = require("path");
var npm = require("npm");


nodefony.register("kernel", function(){
	

	/**
	 *	@event onTerminate
	 *
	 *
	 *	@event onReady
	 */

	/**
	 *	@event onBoot
	 */


	var settingsSyslog = {
		//rateLimit:100,
		//burstLimit:10,
		moduleName:"KERNEL",
		defaultSeverity:"ERROR"
	};

	/**
	 *	KERKEL class   
	 *	The class is a **`KERNEL NODEFONY`** .
	 *	@module NODEFONY
	 *	@main nodefony
	 *	@class kernel
	 *	@constructor
	 *	@param {String} environment  DEV || PROD
	 *	@param {Bollean} debug
	 *	@param {class} autoLoader
	 *	
	 */
	
	var kernel= function(environment, debug, autoLoader, type, options){


		this.rootDir = process.cwd();
		this.nodefonyPath = this.rootDir+"/vendors/nodefony/";
		this.appPath = this.rootDir+"/app/";
		this.configPath = this.rootDir+"/vendors/nodefony/config/config.yml" ;
		this.platform = process.platform ;
		this.getName();
		this.type = type;
		this.container = null; 
		this.bundles = {};
		this.environment = environment;
		this.debug = debug || false;
		if (this.debug){
			//this.preboot = true;
		}
		this.booted = false;
		this.ready = false;
		this.autoLoader = autoLoader;
		this.settings = null;

		
		this.boot(options);
		
		/**
		 *	@event onTerminate
		 */
		process.on('SIGINT', function() {
			this.terminate(0);	
		}.bind(this));
		process.on('SIGTERM', function() {
			this.terminate(0);	
		}.bind(this));
	};

	/**
	 	@method get
	 	@param {String} name of service
         */
	kernel.prototype.get = function(name){
		if (this.container)
			return this.container.get(name);
		return null;
	}

	/**
	 *	@method set
	 *	@param {String} name of service
	 *	@param {Object} instance of service
         */
	kernel.prototype.set = function(name, obj){
		if (this.container)
			return this.container.set(name, obj);
		return null;
	}
		
	/**
	 *	@method boot
         */
	kernel.prototype.boot = function(options){	

		
		// Manage Container
		this.initializeContainer();
		
		// Manage Reader
		this.reader = new nodefony.Reader(this.container);
		this.container.set("reader",this.reader);
		this.container.set("autoLoader",this.autoLoader);
		this.autoLoader.syslog = this.syslog;

		this.reader.readConfig(this.configPath, function(result){
			this.settings = result;
			this.settings["environment"] = this.environment ;
			this.container.setParameters("kernel", this.settings);
			this.httpPort = result.system.httpPort || null;
			this.httpsPort = result.system.httpsPort || null;
			this.domain = result.system.domain || null;
			// manage LOG
			if (this.environment === "prod")
				this.environment = result.system.debug ? "dev" : "prod" ;
			this.syslog = this.initializeLog();
			this.container.set("syslog",this.syslog);

		}.bind(this));

		//  manage GLOBAL EVENTS
		this.notificationsCenter = nodefony.notificationsCenter.create(options, this);
		this.container.set("notificationsCenter", this.notificationsCenter);

		this.eventReadywait = 0 ;

		// Manage Template engine
		this.initTemplate();	

		// Manage Injections
		this.injection = new nodefony.injection(this.container);
		this.container.set("injection", this.injection);

		var bundles = [];
		bundles.push("./vendors/nodefony/bundles/httpBundle");
		bundles.push("./vendors/nodefony/bundles/frameworkBundle");
		bundles.push("./vendors/nodefony/bundles/asseticBundle");

		// FIREWALL 
		if (this.settings.system.security){
			bundles.push("./vendors/nodefony/bundles/securityBundle");
		}

		// REALTIME
		if (this.type == "SERVER" && this.settings.system.realtime) {
			bundles.push("./vendors/nodefony/bundles/realTimeBundle");
		}

		// MONITORING
		if (this.type == "SERVER" && this.settings.system.monitoring) {
			bundles.push("./vendors/nodefony/bundles/monitoringBundle");
		}
		if (this.type === "SERVER"){
			this.logger("		      \033[34m"+this.type+" \033[0mVersion : "+ this.settings.system.version +" PLATFORM : "+this.platform+"  PROCESS PID : "+process.pid+"\n", "INFO", "SERVER WELCOME");
		}

		this.fire("onPreRegister", this );
		this.registerBundles(bundles, function(){
			
			this.preboot = true ;
			this.fire("onPreBoot", this );
		}.bind(this), false);

	};

	/**
	 *	@method fire
	 *	@param {String} event name 
	 *	@param {Arguments} ... arguments to inject  
         */
	kernel.prototype.fire = function(ev){
		//this.logger(ev, "DEBUG", "EVENT KERNEL")
		return this.notificationsCenter.fire.apply(this.notificationsCenter, arguments);
	};

	/**
	 *	@method listen
	 *	@param {Oject} context
	 *	@param {String} event
	 *	@param {Function} callback
         */
	kernel.prototype.listen = function(){
		return this.notificationsCenter.listen.apply(this.notificationsCenter, arguments);
	};
	
	/**
	 *	@method initializeLog
         */
	kernel.prototype.initializeLog = function(){
		var red, blue, green, reset;
		red   = '\033[31m';
		blue  = '\033[34m';
		green = '\033[32m';
		yellow = '\x1B[33m';
		reset = '\033[0m';
		var syslog =  new nodefony.syslog(settingsSyslog);
		if (this.environment === "dev"){
		// CRITIC ERROR
			syslog.listenWithConditions(this,{
				severity:{
					data:"CRITIC,ERROR"
				}		
			},function(pdu){
				var pay = pdu.payload ? (pdu.payload.stack || pdu.payload) : "Error undefined" ; 
				var date = new Date(pdu.timeStamp) ;
				console.error(date.toDateString() + " " +date.toLocaleTimeString()+ " " + red + pdu.severityName +" "+ reset + green  + pdu.msgid + reset  + " : "+ pay);	
			});
			// INFO DEBUG
			var data ;
			this.debug ? data = "INFO,DEBUG" : data = "INFO" ;
			syslog.listenWithConditions(this,{
				severity:{
					data:data
				}		
			},function(pdu){
				if ( pdu.msgid === "SERVER WELCOME"){
					console.log(   blue + "              "+reset + " "+ pdu.payload);	
					return ;
				}
				//if ( this.preboot ){
					var date = new Date(pdu.timeStamp) ;
					console.log( date.toDateString() + " " +date.toLocaleTimeString()+ " " + blue + pdu.severityName +" "+ reset + green  + pdu.msgid + reset +" "+ " : "+ pdu.payload);	
				//}
			});

			syslog.listenWithConditions(this,{
				severity:{
					data:"WARNING"
				}		
			},function(pdu){
				//if ( this.preboot ){
					var date = new Date(pdu.timeStamp) ;
					console.log(date.toDateString() + " " +date.toLocaleTimeString()+ " " + yellow + pdu.severityName +" "+ reset + green  + pdu.msgid + reset  + " : "+ pdu.payload);	
				//}
			});



		}else{
			//FIXME do service with nodefony.log
			if (this.type === "CONSOLE") return syslog ; 
			if ( this.settings.system.log.active ){
				this.logStream = new nodefony.log(this.rootDir+this.settings.system.log.error,{
					rotate:this.settings.system.log.rotate
				});
				syslog.listenWithConditions(this,{
					severity:{
						data:"CRITIC,ERROR"
					}		
				},function(pdu){
					var pay = pdu.payload ? (pdu.payload.stack || pdu.payload) : "Error undefined" ;
					var reg = new RegExp("\\[32m");
					var line = pdu.severityName +" SYSLOG "  + pdu.msgid +  " " + pdu.msg+" : "+ pay.replace(reg,"");
					this.logStream.logger( new Date(pdu.timeStamp) + " " +line +"\n" );
				});	
				var data ;
				this.logStreamD = new nodefony.log(this.rootDir+this.settings.system.log.messages,{
					rotate:this.settings.system.log.rotate
				});
				this.debug ? data = "INFO,DEBUG,WARNING" : data = "INFO" ;
				syslog.listenWithConditions(this,{
					severity:{
						data:data
					}		
				},function(pdu){
					if ( pdu.msgid === "SERVER WELCOME"){
						console.log(  pdu.payload);	
						return ;
					}
					if (! pdu.payload ) return 
					var reg = new RegExp("\\[32m");
					var line = pdu.severityName +" SYSLOG "  + pdu.msgid +  " : "+ pdu.payload.replace(reg,"");
					this.logStreamD.logger( new Date(pdu.timeStamp) + " " +line +"\n" );
				});
			}
		}
		return syslog;
	};

	/**
	 *	@method initializeContainer
         */
	kernel.prototype.initializeContainer = function(){
		this.container = new nodefony.Container();	
		this.container.set("kernel", this);	
		this.container.set("container", this.container);	
	};

	/**
	 *	@method getTemplate
         */	
	kernel.prototype.getTemplate = function(name){
		return nodefony.templatings[name];
	}

	/**
	 *	@method initTemplate
         */
	kernel.prototype.initTemplate = function(){
		var classTemplate = this.getTemplate(this.settings.templating);
		this.templating = new classTemplate(this.container, this.settings[this.settings.templating])
		this.set("templating", this.templating )
	}

	/**
	 *	@method logger
         */
	kernel.prototype.logger = function(pci, severity, msgid,  msg){
		if (! msgid) msgid = "KERNEL "
		return this.syslog.logger(pci, severity, msgid,  msg);
	};

	/**
	 *	get kernel name
	 *	@method getName 
         */
	kernel.prototype.getName = function(){
		this.name = "KERNEL";//path.basename(this.rootDir);	
	};
	
	/**
	 *	get bundle instance
	 *	@method getBundle 
	 *	@param {String} name
         */
	kernel.prototype.getBundle = function(name){
		for (var ns in this.bundles){
			if (ns === name)
				return this.bundles[ns];
		}
		return null;	
	};

	/**
	 *	get all Bundles instance
	 *	@method getBundles 
	 *	@param {String} name
         */
	kernel.prototype.getBundles = function(name){
		if (name)
			return this.getBundle(name);
		return this.bundles;	
	};
	
	/**
	 *	get  Bundle name
	 *	@method getBundleName 
	 *	@param {String} str
         */
	var regBundleName = /^(.*)Bundle[\.js]{0,3}$/;
	kernel.prototype.getBundleName = function(str){
		var ret = regBundleName.exec(str);
		return  ret[1] ;
	};

	kernel.prototype.regBundle = /^(.*)Bundle.js$/;
	var waitingBundle = function(){
		this.eventReadywait -= 1 ;
		if ( this.eventReadywait === 0 || this.eventReadywait === -1 )
			process.nextTick(function(){
				try {
					this.logger("\x1B[33m EVENT KERNEL READY\033[0m", "DEBUG")
					this.fire("onReady", this)	
					this.ready = true ;
				}catch(e){
					this.logger(e, "ERROR");
				}
			}.bind(this))
	};

	kernel.prototype.loadBundle =  function(file){
		try {
			var name = this.getBundleName(file.name);
			var Class = this.autoLoader.load(file.path);
			if (Class) {
				if (typeof Class === "function" ){
					Class.prototype.path = file.dirName;
					Class.prototype.name = name;
					Class.prototype.autoLoader = this.autoLoader;
					Class.prototype.container = this.container;
					var func = Class.herite(nodefony.Bundle);
					this.bundles[name] = new func(this, this.container);
					if ( this.bundles[name].waitBundleReady ){
						this.eventReadywait += 1 ;
						this.bundles[name].listen(this,"onReady", waitingBundle);
					}	
				}
			}	
		}catch(e){
			throw e ;
		}
	};

	/**
	 *	register Bundle 
	 *	@method registerBundles 
	 *	@param {String} path
	 *	@param {Function} callbackFinish
         */
	kernel.prototype.registerBundles = function(path, callbackFinish, nextick){
		var func = function(){
			try{
				var finder = new nodefony.finder( {
					path:path,
					recurse:false,
					onFile:function(file){
						if (file.matchName(this.regBundle)){
							try {
								//this.logger("\033[32m REGISTER BUNDLE : "+name+"   \033[0m","DEBUG");
								this.loadBundle(file)
							}catch(e){
								this.logger(e);
							}	
						}
					}.bind(this),
					onFinish:callbackFinish || this.initializeBundles.bind(this)
				});
			}catch(e){
				this.logger(e);
			}
		}
		if ( nextick === undefined ){
			process.nextTick( func.bind(this) );	
		}else{
			func.apply(this)	
		}
	};

	/**
	 *	initialisation application bundle 
	 *	@method initApplication 
         */	
	kernel.prototype.initApplication = function(){
		var App = function(kernel, container){
			this.$super.constructor(kernel, container)
		};
		App.prototype.path = this.appPath ;
		App.prototype.name = "App";
		App.prototype.autoLoader = this.autoLoader;
		App.prototype.container = this.container;
		var func = App.herite(nodefony.Bundle);
		this.bundles["App"] = new func(this, this.container);
		//this.logger("\033[32m INITIALIZE APPLICATION   \033[0m","DEBUG");
		this.readConfigDirectory(this.appPath+"config", function(result){
			if (result){
				this.bundles["App"].parseConfig(result);
			}
		}.bind(this));
		// OVERRIDE VIEWS BUNDLE in APP DIRECTORY
		this.listen(this, "onBoot" , function(){
			for (var bundle in this.bundles){
				if (bundle === "App") continue ;
				var result = this.bundles["App"].resourcesFiles.findByNode(bundle+"Bundle");
				if ( result.length() ){
					try {
						this.logger("\033[32m APP OVERRIDING\033[0m views for bundle : "+bundle, "DEBUG")
						this.bundles[bundle].registerViews(result);
						//FIXME LOCALE
						this.bundles[bundle].registerI18n(null, result);
					}catch(e){
						this.logger(e);
					}
				}
			}
		}.bind(this));
		return this.bundles["App"];
	};

	/**
	 *	initialisation  all bundles 
	 *	@method initializeBundles 
         */	
	kernel.prototype.initializeBundles = function(error, result){
		this.app = this.initApplication();
		for (var name in this.bundles ){
			this.logger("\x1b[36m INITIALIZE Bundle :  "+ name.toUpperCase()+"\033[0m","DEBUG");
			try {
				this.bundles[name].boot();
			}catch (e){
				this.logger("BUNDLE :"+name+" "+ e);
				continue ;
			}
		}
		if ( this.eventReadywait  === 0) waitingBundle.call(this) ;
		this.logger("\x1B[33m EVENT KERNEL BOOT\033[0m", "DEBUG")
		this.fire("onBoot", this)
		this.booted = true ;
		return;
	};
	
	/**
	 *	 
	 *	@method readConfigDirectory 
         */	
	kernel.prototype.readConfigDirectory = function(path, callbackConfig){
		var finder = new nodefony.finder({
			path:path,
			onFinish:function(error, result){
				this.readConfig.call(this, error, result, callbackConfig)
			}.bind(this)
		})	
	};

	/**
	 *	 
	 *	@method readConfig 
         */
	kernel.prototype.readConfig = function(error, result, callback){
		if (error){
			this.logger(error);
		}else{
			result.forEach(function(ele, index, array){
				switch (true){
					case /^config\..*$/.test(ele.name) :
						try {
							this.logger("CONFIG LOAD FILE :"+ele.path ,"DEBUG","SERVICE KERNEL READER");
							this.reader.readConfig( ele.path, callback )
						}catch(e){
							this.logger(util.inspect(e),"ERROR","BUNDLE "+this.name.toUpperCase()+" CONFIG :"+ele.name)
						}
						break;
					case /^routing\..*$/.test(ele.name) :
						// ROUTING
						try {
							this.logger("ROUTER LOAD FILE :"+ele.path ,"DEBUG", "SERVICE KERNEL READER");
							this.container.get("router").reader(ele.path);
						}catch(e){
							this.logger(util.inspect(e),"ERROR","BUNDLE "+this.name.toUpperCase()+" CONFIG ROUTING :"+ele.name)
						}
						break;
					case /^services\..*$/.test(ele.name) :
						try {
							this.logger("SERVICE LOAD FILE :"+ele.path ,"DEBUG", "SERVICE KERNEL READER");
							//this.kernel.listen(this, "onBoot", function(){
								this.container.get("injection").reader(ele.path);
							//});
						}catch(e){
							this.logger(util.inspect(e),"ERROR","BUNDLE "+this.name.toUpperCase()+" CONFIG SERVICE :"+ele.name)
						}
						break;
					case /^security\..*$/.test(ele.name) :
						try {
							var firewall = this.container.get("security") ;
							if ( firewall ){
								this.logger("SECURITY LOAD FILE :"+ele.path ,"DEBUG", "SERVICE KERNEL READER");
								firewall.reader(ele.path);
							}else{
								this.logger("SECURITY LOAD FILE :"+ele.path +" BUT SERVICE NOT READY" ,"WARNING");	
							}
						}catch(e){
							this.logger(util.inspect(e),"ERROR","BUNDLE "+this.name.toUpperCase()+" CONFIG SECURITY :"+ele.name)
						}
						break;
				}
			}.bind(this))
		}
	};

	/**
	 *	 
	 *	@method terminate 
         */
	kernel.prototype.terminate = function(code){
		try {
			this.fire("onTerminate",this);
		}catch(e){
			console.log(e)
			code = 1;
			process.nextTick(function(){
				this.logger("Cycle Of Live terminate WEF KERNEL CODE : "+code,"INFO");
				//process.exit(code);
			}.bind(this));
			this.logger(e,"ERROR");
		}
		if (this.logStream){
			this.logStream.close("Close error stream\n");
		}
		if (this.logStreamD){
			this.logStreamD.close("Close debug stream\n");	
		}
		process.nextTick(function(){
			this.logger("Cycle Of Live terminate WEF KERNEL CODE : "+code,"INFO");
			process.exit(code);
		}.bind(this));
		return ;
	};

	/**
	 *	 
	 *	@method generateAscii 
         */
	kernel.prototype.generateAscii = function(str, callback){
		var exec = require('child_process').exec ;
		var commandLine = './bin/figlet -c -f vendors/asciiArt/figlet222/fonts/standard.flf ' + str ;
		var ASCII = exec(commandLine, callback);
	};

	return kernel ;
});
