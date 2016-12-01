/*
 *
 *
 *
 *
 */
var fs = require("fs");
var util = require('util');
var path = require("path");
var cluster = require('cluster');

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

	var regBundleName = /^(.*)Bundle[\.js]{0,3}$/;
	var regBundle = /^(.*)Bundle.js$/;

	var waitingBundle = function(){
		this.eventReadywait -= 1 ;
		if ( this.eventReadywait === 0 || this.eventReadywait === -1 ){
			process.nextTick( () => {
				try {
					this.logger("\x1B[33m EVENT KERNEL READY\x1b[0m", "DEBUG")
					this.fire("onReady", this)	
					this.ready = true ;
					this.fire("onPostReady", this)	
					this.logger("\x1B[33m EVENT KERNEL POST READY\x1b[0m", "DEBUG")

				}catch(e){
					this.logger(e, "ERROR");
				}
			})
		}
	};


	var settingsSyslog = {
		//rateLimit:100,
		//burstLimit:10,
		moduleName:"KERNEL",
		defaultSeverity:"ERROR"
	};


	var logConsole = function(syslog){
		var red, blue, green, reset;
		red   = '\x1b[31m';
		blue  = '\x1b[34m';
		green = '\x1b[32m';
		yellow = '\x1B[33m';
		reset = '\x1b[0m';

		// CRITIC ERROR
		syslog.listenWithConditions(this,{
			severity:{
				data:"CRITIC,ERROR"
			}		
		},(pdu) => {
			var pay = pdu.payload ? (pdu.payload.stack || pdu.payload) : "Error undefined" ; 
			var date = new Date(pdu.timeStamp) ;
			console.error(date.toDateString() + " " +date.toLocaleTimeString()+ " " + red + pdu.severityName +" "+ reset + green  + pdu.msgid + reset  + " : "+ pay);	
		});

		// INFO DEBUG
		var data ;
		this.debug ? data = "INFO,DEBUG,WARNING" : data = "INFO" ;
		syslog.listenWithConditions(this, {
			severity:{
				data:data
			}		
		},(pdu) => {
			//console.log(this.node_start)
			//console.log(pdu)
			if ( pdu.msgid === "SERVER WELCOME"){
				console.log(   blue + "              "+reset + " "+ pdu.payload);	
				return ;
			}
			//if ( this.preboot ){
				var date = new Date(pdu.timeStamp) ;
				console.log( date.toDateString() + " " +date.toLocaleTimeString()+ " " + blue + pdu.severityName +" "+ reset + green  + pdu.msgid + reset +" "+ " : "+ pdu.payload);	
			//}
		});
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
	var kernel = class kernel {	

		constructor (environment, debug, autoLoader, type, options){
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
			this.regBundle = regBundle;

			this.options = options ;
			this.node_start = options.node_start ;

			
			this.boot(options);
			
			/**
		 	*	@signals
		 	*
		 	*	onTerminate
		 	*/
			process.on('SIGINT', () => {
				this.logger("SIGINT", "CRITIC")
				this.fire("onSignal", "SIGINT", this)
				this.terminate(0);	
			});
			process.on('SIGTERM', () => {
				this.logger("SIGTERM", "CRITIC")
				this.fire("onSignal", "SIGTERM", this)
				this.terminate(0);	
			});
			process.on('SIGHUP', () => {
				this.logger("SIGHUP", "CRITIC")
				this.fire("onSignal", "SIGHUP", this)
				this.terminate(0);	
			});
			process.on('SIGQUIT',() =>{
				this.logger("SIGQUIT", "CRITIC")
				this.fire("onSignal", "SIGQUIT", this)
				this.terminate(0);
			});
		};

		/**
	 	 *	@method get
	 	 *	@param {String} name of service
         	 */
		get (name){
			if (this.container)
				return this.container.get(name);
			return null;
		};

		/**
	 	*	@method set
	 	*	@param {String} name of service
	 	*	@param {Object} instance of service
         	*/
		set (name, obj){
			if (this.container)
				return this.container.set(name, obj);
			return null;
		}
		
		/**
	 	*	@method boot
         	*/
		boot (options){	
			// Manage Container
			this.initializeContainer();
			
			// Manage Reader
			this.reader = new nodefony.Reader(this.container);
			this.container.set("reader",this.reader);
			this.container.set("autoLoader",this.autoLoader);

			this.reader.readConfig(this.configPath, (result) => {
				this.settings = result;
				this.settings["environment"] = this.environment ;
				this.container.setParameters("kernel", this.settings);
				this.httpPort = result.system.httpPort || null;
				this.httpsPort = result.system.httpsPort || null;
				this.domain = result.system.domain || null;
				this.hostname = result.system.domain || null ;
				this.hostHttp = this.hostname +":"+this.httpPort ;
				this.hostHttps = this.hostname +":"+this.httpsPort ;
				this.domainAlias = result.system.domainAlias ;
				// manage LOG
				if (this.environment === "prod")
					this.environment = result.system.debug ? "dev" : "prod" ;
				this.syslog = this.initializeLog(options);
				this.autoLoader.syslog = this.syslog;
				this.container.set("syslog",this.syslog);
			});

			//  manage GLOBAL EVENTS
			this.notificationsCenter = nodefony.notificationsCenter.create(options, this);
			this.container.set("notificationsCenter", this.notificationsCenter);
			this.initCluster();

			this.eventReadywait = 0 ;

			// Manage Template engine
			this.initTemplate();	

			// Manage Injections
			this.injection = new nodefony.injection(this.container);
			this.container.set("injection", this.injection);

			/*
 		 	*	BUNDLES
 		 	*/
			var bundles = [];
			bundles.push("./vendors/nodefony/bundles/httpBundle");
			bundles.push("./vendors/nodefony/bundles/frameworkBundle");
			bundles.push("./vendors/nodefony/bundles/asseticBundle");

			// FIREWALL 
			if (this.settings.system.security){
				bundles.push("./vendors/nodefony/bundles/securityBundle");
			}

			// REALTIME
			if ( this.settings.system.realtime) {
				bundles.push("./vendors/nodefony/bundles/realTimeBundle");
			}

			// MONITORING
			if ( this.settings.system.monitoring) {
				bundles.push("./vendors/nodefony/bundles/monitoringBundle");
			}

			try {
				this.fire("onPreRegister", this );
			}catch(e){
				this.logger(e);
			}
			this.registerBundles(bundles, () => {
				this.preboot = true ;
				this.logger("\x1B[33m EVENT KERNEL onPreBoot\x1b[0m", "DEBUG");
				this.fire("onPreBoot", this );
			}, false);
		};

		// FIXME CLUSTER MODE
		initCluster (){
			this.processId = process.pid ;
			this.process = process ;
			if (cluster.isMaster) {
				console.log("		      \x1b[34mNODEFONY "+this.type+" CLUSTER MASTER \x1b[0mVersion : "+ this.settings.system.version +" PLATFORM : "+this.platform+"  PROCESS PID : "+this.processId+"\n");
				this.fire("onCluster", "MASTER", this,  process);

			}else if (cluster.isWorker) {
				console.log("		      \x1b[34mNODEFONY "+this.type+" CLUSTER WORKER \x1b[0mVersion : "+ this.settings.system.version +" PLATFORM : "+this.platform+"  PROCESS PID : "+this.processId);
				this.workerId = cluster.worker.id ;
				this.worker = cluster.worker ;
				this.fire("onCluster", "WORKER",  this, process);
				process.on("message" , this.listen(this, "onMessage" ) ); 
				this.listen(this, "onMessage", function(worker, message){
				})
			}
		}

		sendMessage (message){
			return process.send({
				type : 'process:msg',
				data : message
			});
		}

		/**
	 	*	@method fire
	 	*	@param {String} event name 
	 	*	@param {Arguments} ... arguments to inject  
         	*/
		fire (ev){
			//this.logger(ev, "DEBUG", "EVENT KERNEL")
			return this.notificationsCenter.fire.apply(this.notificationsCenter, arguments);
		};

		/**
	 	*	@method listen
	 	*	@param {Oject} context
	 	*	@param {String} event
	 	*	@param {Function} callback
         	*/
		listen (){
			return this.notificationsCenter.listen.apply(this.notificationsCenter, arguments);
		};
	
		/**
	 	*	@method initializeLog
         	*/
		initializeLog (options){
			var syslog =  new nodefony.syslog(settingsSyslog);
			
			if ( this.settings.system.log.console ||  this.environment === "dev"){
			
				logConsole.call(this, syslog);

			}else{
				//FIXME do service with nodefony.log
				// PM2
				if ( this.settings.system.log.active && options.node_start === "PM2" ){
					logConsole.call(this, syslog);
				}

				if ( this.settings.system.log.file   ){
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
		initializeContainer (){
			this.container = new nodefony.Container();	
			this.container.set("kernel", this);	
			this.container.set("container", this.container);	
		};

		/**
	 	*	@method getTemplate
         	*/	
		getTemplate (name){
			return nodefony.templatings[name];
		}

		/**
	 	*	@method initTemplate
         	*/
		initTemplate (){
			var classTemplate = this.getTemplate(this.settings.templating);
			this.templating = new classTemplate(this.container, this.settings[this.settings.templating])
			this.set("templating", this.templating )
		}

		/**
	 	*	@method logger
         	*/
		logger (pci, severity, msgid,  msg){
			if (! msgid) msgid = "KERNEL "
			return this.syslog.logger(pci, severity, msgid,  msg);
		};

		/**
	 	*	get kernel name
	 	*	@method getName 
         	*/
		getName (){
			this.name = "KERNEL";	
		};
		
		/**
	 	*	get bundle instance
	 	*	@method getBundle 
	 	*	@param {String} name
         	*/
		getBundle (name){
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
		getBundles (name){
			if (name)
				return this.getBundle(name);
			return this.bundles;	
		};
		
		/**
	 	*	get  Bundle name
	 	*	@method getBundleName 
	 	*	@param {String} str
         	*/
		getBundleName (str){
			var ret = regBundleName.exec(str);
			return  ret[1] ;
		};
		
		loadBundle (file){
			try {
				var name = this.getBundleName(file.name);
				var Class = this.autoLoader.load(file.path);
				if (Class) {
					if (typeof Class === "function" ){
						Class.prototype.path = file.dirName;
						Class.prototype.name = name;
						Class.prototype.autoLoader = this.autoLoader;
						Class.prototype.container = this.container;
						this.bundles[name] = new Class( this, this.container);
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
		registerBundles (path, callbackFinish, nextick){
			var func = function(){
				try{
					var finder = new nodefony.finder( {
						path:path,
						recurse:false,
						onFile:(file) => {
							if (file.matchName(this.regBundle) ){
								try {
									this.loadBundle(file)
								}catch(e){
									this.logger(e);
								}	
							}
						},
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
		initApplication (){
			var App = class App extends nodefony.Bundle {
				constructor (myKernel, myContainer){
					super(myKernel, myContainer);
				};
			}
			App.prototype.path = this.appPath ;
			App.prototype.name = "App";
			App.prototype.autoLoader = this.autoLoader;
			App.prototype.container = this.container;
			//var func = App.herite(nodefony.Bundle);
			this.bundles["App"] = new App(this, this.container);
			//this.logger("\033[32m INITIALIZE APPLICATION   \033[0m","DEBUG");
			this.readConfigDirectory(this.appPath+"config", (result) => {
				if (result){
					this.bundles["App"].parseConfig(result);
				}
			});
			// OVERRIDE VIEWS BUNDLE in APP DIRECTORY
			this.listen(this, "onBoot" , () => {
				for (var bundle in this.bundles){
					if (bundle === "App") continue ;
					var result = this.bundles["App"].resourcesFiles.findByNode(bundle+"Bundle");
					if ( result.length() ){
						try {
							this.logger("\x1b[32m APP OVERRIDING\x1b[0m views for bundle : "+bundle, "DEBUG")
							this.bundles[bundle].registerViews(result);
							//FIXME LOCALE
							this.bundles[bundle].registerI18n(null, result);
						}catch(e){
							this.logger(e);
						}
					}
				}
			});
			return this.bundles["App"];
		};

		/**
	 	*	initialisation  all bundles 
	 	*	@method initializeBundles 
         	*/	
		initializeBundles (error, result){

			this.app = this.initApplication();
			
			this.logger("\x1B[33m EVENT KERNEL onPostRegister\x1b[0m", "DEBUG");
			this.fire("onPostRegister", this);

			for (var name in this.bundles ){
				this.logger("\x1b[36m INITIALIZE Bundle :  "+ name.toUpperCase()+"\x1b[0m","DEBUG");
				try {
					this.bundles[name].boot();
				}catch (e){
					this.logger("BUNDLE :"+name+" "+ e);
					continue ;
				}
			}
			if ( this.eventReadywait  === 0) waitingBundle.call(this) ;
			this.logger("\x1B[33m EVENT KERNEL BOOT\x1b[0m", "DEBUG");
			this.fire("onBoot", this);
			this.booted = true ;

			

			return;
		};
	
		/**
	 	*	 
	 	*	@method readConfigDirectory 
         	*/	
		readConfigDirectory (path, callbackConfig){
			var finder = new nodefony.finder({
				path:path,
				onFinish:(error, result) => {
					this.readConfig.call(this, error, result, callbackConfig)
				}
			})	
		};

		/**
	 	*	 
	 	*	@method readConfig 
         	*/
		readConfig (error, result, callback){
			if (error){
				this.logger(error);
			}else{
				result.forEach((ele, index, array) => {
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
								var router = this.container.get("router") ;
								if ( router ){
									router.reader(ele.path);
								}else{
									this.logger("Router service not ready to LOAD FILE :"+ele.path ,"WARNING", "SERVICE KERNEL READER");	
								}
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
				})
			}
		};

		/**
	 	*	 
	 	*	@method terminate 
         	*/
		terminate (code){
			try {
				this.fire("onTerminate", this);
			}catch(e){
				console.trace(e)
				code = 1;
				process.nextTick( () => {
					this.logger("Cycle Of Live terminate KERNEL CODE : "+code,"INFO");
				});
				this.logger(e,"ERROR");
			}
			if (this.logStream){
				this.logStream.close("Close error stream\n");
			}
			if (this.logStreamD){
				this.logStreamD.close("Close debug stream\n");	
			}
			process.nextTick( () => {
				this.logger("Cycle Of Live terminate KERNEL CODE : "+code,"INFO");
				process.exit(code);
			});
			return ;
		};

	};

	return kernel ;
});
