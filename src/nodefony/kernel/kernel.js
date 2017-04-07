/*
 *
 *
 *
 *
 */

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
					this.logger("\x1B[33m EVENT KERNEL READY\x1b[0m", "DEBUG");
					this.fire("onReady", this);
					this.ready = true ;
					this.fire("onPostReady", this);
					this.logger("\x1B[33m EVENT KERNEL POST READY\x1b[0m", "DEBUG");
					if ( this.type === "SERVER" ){
						if (  global && global.gc ){
							this.memoryUsage("MEMORY POST READY ") ;
							setTimeout(()=>{
								global.gc();
								this.memoryUsage("EXPOSE GARBADGE COLLECTOR ON START") ;
							},5000);
						}else{
							this.memoryUsage("MEMORY POST READY ");
						}
					}
				}catch(e){
					this.logger(e, "ERROR");
				}
			});
		}
	};


	var defaultEnvEnable = {
		dev:		true,
		development:	true,	
		prod:		true,
		production:	true,	
	};

	var defaultOptions = {
		nbListener:30
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
	var kernel = class kernel extends nodefony.Service {	

		constructor (environment, debug, autoLoader, type, options){

			super( "KERNEL" , null, null , nodefony.extend( {}, defaultOptions,  options) );
			this.rootDir = process.cwd();
			this.nodefonyPath = this.rootDir+"/vendors/nodefony/";
			this.appPath = this.rootDir+"/app/";
			this.configPath = this.rootDir+"/vendors/nodefony/config/config.yml" ;
			this.generateConfigPath = this.rootDir+"/config/generatedConfig.yml" ;
			this.publicPath = this.rootDir+"/web";
			this.platform = process.platform ;
			this.type = type;
			this.bundles = {};
			
			if ( environment in defaultEnvEnable ){
				switch ( environment ){
					case "dev" :
					case "development" :
						this.environment = "dev";
						process.env.NODE_ENV = "development";
					break;
					case "prod" :
					case "production" :
						this.environment = "prod";
						process.env.NODE_ENV = "production";
					break;
				}
			}
			
			this.debug = debug || false;
			this.booted = false;
			this.ready = false;
			this.autoLoader = autoLoader;
			this.settings = null;
			this.regBundle = regBundle;

			this.options = options ;
			this.node_start = options.node_start ;

			// Manage Container
			this.initializeContainer();

			// cli worker
			this.cli = new nodefony.cliWorker("CLI", this.container, this.notificationsCenter);
			this.listen(this, "onReady" , () =>{
				this.autoLoader.deleteCache();
			});

			this.listen(this, "onPostRegister" , () =>{
				if ( this.type === "SERVER" ){
					this.cli.assetInstall();
				}
			});

			/**
		 	*	@signals
		 	*
		 	*	onTerminate
		 	*/
			process.on('SIGINT', () => {
				this.logger("SIGINT", "CRITIC");
				this.fire("onSignal", "SIGINT", this);
				this.terminate(0);	
			});
			process.on('SIGTERM', () => {
				this.logger("SIGTERM", "CRITIC");
				this.fire("onSignal", "SIGTERM", this);
				this.terminate(0);	
			});
			process.on('SIGHUP', () => {
				this.logger("SIGHUP", "CRITIC");
				this.fire("onSignal", "SIGHUP", this);
				this.terminate(0);	
			});
			process.on('SIGQUIT',() =>{
				this.logger("SIGQUIT", "CRITIC");
				this.fire("onSignal", "SIGQUIT", this);
				this.terminate(0);
			});

			/**
		 	*	@promise
		 	*
		 	*	
		 	*/
			const unhandledRejections = new Map();
			process.on('rejectionHandled', (promise) => {
				this.logger("PROMISE REJECTION EVENT ", "CRITIC");
				unhandledRejections.delete(promise);
			});
			process.on('unhandledRejection', (reason, promise) => {
				this.logger("WARNING  !!! PROMISE CHAIN BREAKING : "+ reason, "CRITIC");
				unhandledRejections.set(promise, reason);
			});
			process.on('uncaughtException', (err) => {
				this.logger(err, "CRITIC");
			});

			this.boot(options);
		}
				
		/**
	 	*	@method boot
         	*/
		boot (options){	
			
			// Manage Reader
			this.reader = new nodefony.Reader(this.container);
			this.set("reader",this.reader);
			this.set("autoLoader",this.autoLoader);

			try {
				this.reader.readConfig(this.configPath, (result) => {
					this.settings = result;
					this.settings.environment = this.environment ;
					this.setParameters("kernel", this.settings);
					this.httpPort = result.system.httpPort || null;
					this.httpsPort = result.system.httpsPort || null;
					this.domain = result.system.domain || null;
					this.hostname = result.system.domain || null ;
					this.hostHttp = this.hostname +":"+this.httpPort ;
					this.hostHttps = this.hostname +":"+this.httpsPort ;
					this.domainAlias = result.system.domainAlias ;
					// manage LOG
					if (this.environment === "prod"){
						this.environment = result.system.debug ? "dev" : "prod" ;
					}
					this.initializeLog(options);
					this.autoLoader.syslog = this.syslog;
					// Manage Template engine
					this.initTemplate();
				});
				var gconf = this.readGeneratedConfig() ;
				if ( gconf ){
					if ( gconf.system && gconf.system.bundles ){
						this.settings = nodefony.extend(true, gconf, this.settings );
					}
				}
			}catch(e){
				this.logger(e, "ERROR");
				throw e ;
			}

			this.initCluster();

			this.eventReadywait = 0 ;
			
			// Manage Injections
			this.injection = new nodefony.injection(this.container);
			this.set("injection", this.injection);

			// SERVERS 
			this.initServers();

			/*
 		 	*	BUNDLES
 		 	*/
			 
			this.configBundle = this.getConfigBunbles() ;

			var bundles = [];
			bundles.push("./vendors/nodefony/bundles/httpBundle");
			bundles.push("./vendors/nodefony/bundles/frameworkBundle");
			bundles.push("./vendors/nodefony/bundles/asseticBundle");

			
			// FIREWALL 
			if (this.settings.system.security){
				bundles.push("./vendors/nodefony/bundles/securityBundle");
			}

			// ORM MANAGEMENT
			switch ( this.settings.orm ){
				case "sequelize" :
					bundles.push("./vendors/nodefony/bundles/sequelizeBundle");
 				break;
				default :
					throw new Error ("nodefony can't load ORM : " + this.settings.orm );
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
			try {
				this.registerBundles(bundles, () => {
					this.preboot = true ;
					this.logger("\x1B[33m EVENT KERNEL onPreBoot\x1b[0m", "DEBUG");
					this.fire("onPreBoot", this );
					this.registerBundles( this.configBundle );
				}, false);

			}catch(e){
				this.logger(e, "ERROR");
			}
		}

		checkPath (myPath){
			if ( ! myPath ){
				return null ;
			}
			var abs = path.isAbsolute( myPath ) ;
			if ( abs ){
				return myPath ;
			}else{
				return this.rootDir+"/"+myPath ;
			}
		}

		getConfigBunbles (){
			var config = [] ;
			this.checkBundlesExist( this.settings, "Kernel Config" , this.configPath );
			try {
				for ( var bundle in this.settings.system.bundles){
					var name = this.settings.system.bundles[bundle].replace("\.\/","").replace(/\/\//,"/") ;
					config.push(name);	
				}
			}catch(e){
				throw e ;
			}
			return config ;
		}

		checkBundlesExist (yml, nameConfig, pathConfig, remove){
			var exist = null ;
			if (yml && yml.system && yml.system.bundles ){
				for ( var bundle in yml.system.bundles ){
					exist = fs.existsSync(this.rootDir+"/"+yml.system.bundles[bundle] );
					if ( ! exist){
						delete yml.system.bundles[bundle];
						if ( remove ){
							try{
								fs.writeFileSync( pathConfig, yaml.safeDump(yml),{encoding:'utf8'} );
								this.logger( nameConfig+" : " + bundle +" Bundle dont't exit", "WARNING" );
								this.logger("Update Config  : " + pathConfig);
							}catch(e){
								this.logger(e, "ERROR");
							}
						}else{
							var error = new Error(nameConfig+" : " + bundle +" Bundle dont't exit") ;
							this.logger( error, "ERROR" );
							this.logger( "Config file : " + pathConfig );
							this.logger( yml.system.bundles );
						}
						try {
							var link = this.publicPath+"/"+bundle+"Bundle" ;
							var stat = fs.lstatSync(link) ;
							if ( stat ){
								exist = fs.existsSync( fs.readlinkSync(link) ) ;
								if ( ! exist ){
									fs.unlinkSync(link);
									this.logger("REMOVE LINK : " + link);
								}
							}
						}catch(e){
						}
					}else{
						/*if (this.type === "SERVER"){
							var name = this.rootDir+"/"+yml.system.bundles[bundle].replace("\.\/","").replace(/\/\//,"/");
							this.logger( "BUNDLE TO LOAD : " +  name );
						}*/
					}
				}
			}	
		}

		readGeneratedConfig (){
			var exist = null ;
			try {
				exist = fs.existsSync(this.generateConfigPath);
				if (exist){
					try {
						var yml = yaml.load( fs.readFileSync(this.generateConfigPath, 'utf8' ) ); 
						this.checkBundlesExist( yml, "Generated Config", this.generateConfigPath, true);
						return yml ;
					}catch(e){
						throw e;
					}
				}else{
					return null ;	
				}	
			}catch(e){
				console.trace(e);
				this.logger(e, "ERROR");
			}
		}

		initServers (){
			if (this.type === "SERVER"){
				this.listen(this,"onPostReady", () => {
					// create HTTP server 
					var http =null ;
					var https =null ;
					try {
						if ( this.settings.system.servers.http ){
							http = this.get("httpServer").createServer();
						}
						// create HTTPS server
						if ( this.settings.system.servers.https ){
							https = this.get("httpsServer").createServer();
						}
						// create WEBSOCKET server
						if ( this.settings.system.servers.ws ){
							this.get("websocketServer").createServer(http);
						}
						// create WEBSOCKET SECURE server
						if ( this.settings.system.servers.wss ){
							this.get("websocketServerSecure").createServer(https);
						}
					}catch(e){
						this.logger(e, "ERROR");
						console.error(e);
						throw e ;
					}
				});
			}
		}

		initCluster (){
			this.processId = process.pid ;
			this.process = process ;
			if (cluster.isMaster) {
				console.log("		      \x1b[34mNODEFONY "+this.type+" CLUSTER MASTER \x1b[0mVersion : "+ this.settings.version +" PLATFORM : "+this.platform+"  PROCESS PID : "+this.processId+"\n");
				this.fire("onCluster", "MASTER", this,  process);

			}else if (cluster.isWorker) {
				console.log("		      \x1b[34mNODEFONY "+this.type+" CLUSTER WORKER \x1b[0mVersion : "+ this.settings.version +" PLATFORM : "+this.platform+"  PROCESS PID : "+this.processId);
				this.workerId = cluster.worker.id ;
				this.worker = cluster.worker ;
				this.fire("onCluster", "WORKER",  this, process);
				process.on("message" , this.listen(this, "onMessage" ) ); 
				/*this.listen(this, "onMessage", function(worker, message){
				})*/
			}
		}

		sendMessage (message){
			return process.send({
				type : 'process:msg',
				data : message
			});
		}
		
		/**
	 	*	@method initializeLog
         	*/
		initializeLog (options){
			
			if ( this.settings.system.log.console ||  this.environment === "dev"){
				this.cli.listenSyslog( this.syslog , this.debug);
				//logConsole.call(this, this.syslog);
			}else{
				// PM2
				if ( this.settings.system.log.active && options.node_start === "PM2" ){
					this.cli.listenSyslog( this.syslog , this.debug );
					//logConsole.call(this, this.syslog);
				}

				if ( this.settings.system.log.file ){
					this.logStream = new nodefony.log(this.rootDir+this.settings.system.log.error,{
						rotate:this.settings.system.log.rotate
					});
					this.syslog.listenWithConditions(this,{
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
					if ( this.debug ){
						data = "INFO,DEBUG,WARNING" ;
					}else{
						data = "INFO" ;
					}
					this.syslog.listenWithConditions(this,{
						severity:{
							data:data
						}		
					},function(pdu){
						if ( pdu.msgid === "SERVER WELCOME"){
							console.log(  pdu.payload);	
							return ;
						}
						if (! pdu.payload ) { return ; } 
						var reg = new RegExp("\\[32m");
						var line = pdu.severityName +" SYSLOG "  + pdu.msgid +  " : "+ pdu.payload.replace(reg,"");
						this.logStreamD.logger( new Date(pdu.timeStamp) + " " +line +"\n" );
					});
				}
			}
		}

		/**
	 	*	@method initializeContainer
         	*/
		initializeContainer (){
			this.set("kernel", this);	
		}

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
			this.templating = new classTemplate(this.container, this.settings[this.settings.templating]);
			this.set("templating", this.templating );
		}

		/**
	 	*	@method logger
         	*/
		logger (pci, severity, msgid,  msg){
			if (! msgid) { msgid = this.cli.clc.magenta("KERNEL ");}
			return this.syslog.logger(pci, severity, msgid,  msg);
		}

		/**
	 	*	get bundle instance
	 	*	@method getBundle 
	 	*	@param {String} name
         	*/
		getBundle (name){
			for (var ns in this.bundles){
				if (ns === name){
					return this.bundles[ns];
				}
			}
			return null;	
		}

		/**
	 	*	get all Bundles instance
	 	*	@method getBundles 
	 	*	@param {String} name
         	*/
		getBundles (name){
			if (name){
				return this.getBundle(name);
			}
			return this.bundles;	
		}
		
		/**
	 	*	get  Bundle name
	 	*	@method getBundleName 
	 	*	@param {String} str
         	*/
		getBundleName (str){
			var ret = regBundleName.exec(str);
			if ( ret){
				return  ret[1] ;
			}
			throw new Error("Bundle Name :" +str +" not exist") ;
		}
		
		loadBundle (file){
			try {
				var name = this.getBundleName(file.name);
				var Class = this.autoLoader.load(file.path);
				if (Class) {
					if (typeof Class === "function" ){
						Class.prototype.path = file.dirName;
						Class.prototype.autoLoader = this.autoLoader;
						try {
							this.bundles[name] = new Class( name, this, this.container);
						}catch(e){
							this.logger(e, "ERROR");
							console.trace(e);
							throw e ;
						}
						if ( this.bundles[name].waitBundleReady ){
							this.eventReadywait += 1 ;
							this.bundles[name].listen(this,"onReady", waitingBundle);
						}	
					}
				}	
			}catch(e){
				throw e ;
			}
		}

		/**
	 	*	register Bundle 
	 	*	@method registerBundles 
	 	*	@param {String} path
	 	*	@param {Function} callbackFinish
         	*/
		registerBundles (path, callbackFinish, nextick){
			var func = function(){
				try{
					 return new nodefony.finder( {
						path: path,
						followSymLink: true,
						exclude:/^doc$|^node_modules$/,
						recurse: false,
						onFile:(file) => {
							if ( file.matchName(this.regBundle) ){
								try {
									this.loadBundle(file);
								}catch(e){
									this.logger(e, "ERROR");
								}	
							}
						},
						onFinish:callbackFinish || this.initializeBundles.bind(this)
					});
				}catch(e){
					this.logger(e, "ERROR");
				}
			};
			if ( nextick === undefined ){
				process.nextTick( () => {
					try {
						return func.call(this);
					}catch(e){
						this.logger(e, "ERROR");	
					}
 				});	
			}else{
				try {
					return func.apply(this);
				}catch(e){
					this.logger(e, "ERROR");	
				}
			}
		}

		/**
	 	*	initialisation application bundle 
	 	*	@method initApplication 
         	*/	
		initApplication (){
			var App = class App extends nodefony.Bundle {
				constructor (name, myKernel, myContainer){
					super(name, myKernel, myContainer);
				}
			};
			App.prototype.path = this.appPath ;
			App.prototype.autoLoader = this.autoLoader;
			App.prototype.settings = this.settings;
			this.bundles.App = new App("App", this, this.container);
			this.readConfigDirectory(this.appPath+"config", (result) => {
				if (result){
					this.bundles.App.parseConfig(result);
				}
			});
			// OVERRIDE VIEWS BUNDLE in APP DIRECTORY
			this.listen(this, "onBoot" , () => {
				for (var bundle in this.bundles){
					if (bundle === "App") { continue ; }
					var result = this.bundles.App.resourcesFiles.findByNode(bundle+"Bundle");
					if ( result.length() ){
						try {
							this.logger("\x1b[32m APP OVERRIDING\x1b[0m views for bundle : "+bundle, "DEBUG");
							this.bundles[bundle].registerViews(result);
							this.bundles[bundle].registerI18n(null, result);
						}catch(e){
							this.logger(e);
						}
					}
				}
			});
			return this.bundles.App;
		}

		/**
	 	*	initialisation  all bundles 
	 	*	@method initializeBundles 
         	*/	
		initializeBundles (){

			this.app = this.initApplication();
			
			this.logger("\x1B[33m EVENT KERNEL onPostRegister\x1b[0m", "DEBUG");
			this.fire("onPostRegister", this);

			for (var name in this.bundles ){
				this.logger("\x1b[36m INITIALIZE Bundle :  "+ name.toUpperCase()+"\x1b[0m","DEBUG");
				try {
					this.bundles[name].boot();
				}catch (e){
					this.logger("BUNDLE :"+name+" "+ e, "ERROR");
					console.trace(e);
					continue ;
				}
			}
			if ( this.eventReadywait  === 0) { waitingBundle.call(this) ; }
			this.logger("\x1B[33m EVENT KERNEL BOOT\x1b[0m", "DEBUG");
			this.fire("onBoot", this);
			this.booted = true ;
			return;
		}
	
		/**
	 	*	 
	 	*	@method readConfigDirectory 
         	*/	
		readConfigDirectory (Path, callbackConfig){
			var finder = new nodefony.finder({
				path:Path,
				onFinish:(error, result) => {
					this.readConfig.call(this, error, result, callbackConfig);
				}
			});
			return finder ;
		}

		/**
	 	*	 
	 	*	@method readConfig 
         	*/
		readConfig (error, result, callback){
			if (error){
				this.logger(error);
			}else{
				result.forEach((ele) => {
					switch (true){
						case /^config\..*$/.test(ele.name) :
							try {
								this.logger("CONFIG LOAD FILE :"+ele.path ,"DEBUG","SERVICE KERNEL READER");
								this.reader.readConfig( ele.path, callback );
							}catch(e){
								this.logger(util.inspect(e),"ERROR","BUNDLE "+this.name.toUpperCase()+" CONFIG :"+ele.name);
							}
							break;
						case /^routing\..*$/.test(ele.name) :
							// ROUTING
							try {
								this.logger("ROUTER LOAD FILE :"+ele.path ,"DEBUG", "SERVICE KERNEL READER");
								var router = this.get("router") ;
								if ( router ){
									router.reader(ele.path);
								}else{
									this.logger("Router service not ready to LOAD FILE :"+ele.path ,"WARNING", "SERVICE KERNEL READER");	
								}
							}catch(e){
								this.logger(util.inspect(e),"ERROR","BUNDLE "+this.name.toUpperCase()+" CONFIG ROUTING :"+ele.name);
							}
							break;
						case /^services\..*$/.test(ele.name) :
							try {
								this.logger("SERVICE LOAD FILE :"+ele.path ,"DEBUG", "SERVICE KERNEL READER");
								//this.kernel.listen(this, "onBoot", function(){
									this.get("injection").reader(ele.path);
								//});
							}catch(e){
								this.logger(util.inspect(e),"ERROR","BUNDLE "+this.name.toUpperCase()+" CONFIG SERVICE :"+ele.name);
							}
							break;
						case /^security\..*$/.test(ele.name) :
							try {
								var firewall = this.get("security") ;
								if ( firewall ){
									this.logger("SECURITY LOAD FILE :"+ele.path ,"DEBUG", "SERVICE KERNEL READER");
									firewall.reader(ele.path);
								}else{
									this.logger("SECURITY LOAD FILE :"+ele.path +" BUT SERVICE NOT READY" ,"WARNING");	
								}
							}catch(e){
								this.logger(util.inspect(e),"ERROR","BUNDLE "+this.name.toUpperCase()+" CONFIG SECURITY :"+ele.name);
							}
							break;
					}
				});
			}
		}

		memoryUsage (message){
			var memory =  process.memoryUsage() ;
			for ( var ele in memory ){
				switch (ele ){
					case "rss" :
						this.logger( (message || ele )  + " ( Resident Set Size ) PID ( "+this.processId+" ) : " + this.cli.niceBytes( memory[ele] ) , "INFO", "MEMORY " + ele) ;
					break;
					case "heapTotal" :
						this.logger( (message || ele ) + " ( Total Size of the Heap ) PID ( "+this.processId+" ) : " + this.cli.niceBytes( memory[ele] ) , "INFO","MEMORY " + ele) ;
					break;
					case "heapUsed" :
						this.logger( (message || ele ) + " ( Heap actually Used ) PID ( "+this.processId+" ) : " + this.cli.niceBytes( memory[ele] ) , "INFO", "MEMORY " + ele) ;
					break;
					case "external" :
						this.logger( (message || ele ) + " PID ( "+this.processId+" ) : " + this.cli.niceBytes( memory[ele] ) , "INFO", "MEMORY " + ele) ;
					break;
				}
			}
		}

		/**
	 	*	 
	 	*	@method terminate 
         	*/
		terminate (code){
			if ( code === undefined ){
				code = 0 ;
			}
			try {
				this.fire("onTerminate", this, code);
			}catch(e){
				console.trace(e);
				code = 1;
				process.nextTick( () => {
					this.logger("Kernel Life Cycle Terminate CODE : "+code,"INFO");
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
				this.logger("Kernel Life Cycle Terminate CODE : "+code,"INFO");
				process.exit(code);
			});
			return ;
		}
	};

	return kernel ;
});
