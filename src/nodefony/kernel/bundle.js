/*
 *
 *
 *
 *
 *
 */

nodefony.register("Bundle", function(){
	
	var regBundle = /^(.*)Bundle$/;
	var regFixtures = /^(.+)Fixtures.js$/;
	var regController = /^(.+)Controller.js$/;
	var regService = /^(.+)Service.js$/;
	var regCommand = /^(.+)Command.js$/;
	var regEntity = /^(.+)Entity.js$/;
	var regI18nFile =/^(.*)\.(.._..)\.(.*)$/;
	var regConfigFile = /^routing\..*$/; 

	var checkIngnoreFile = function(string, basename){
		var file = null;
		try{
			file = new nodefony.fileClass(string);
		}catch(e){
			if ( basename.match(/^\./) ){
				return true ;
			}
			return false ;
		}
		if ( basename.match(/^\./) ){
			return true ;
		}
		if ( file.type === "Directory" ){
			return "Directory" ;
		}
		return false;
	};

	var defaultWatcher = function ( reg , settings){
		return {
			ignoreInitial: true,
			ignored: [
				 (string)  => {
					var basename = path.basename(string) ;
					var file = checkIngnoreFile( string , basename);
					if ( file === true  ){
						return true ;
					}
					if ( file === "Directory" ){
						return false ;
					}
					if ( basename.match(reg) ){
						return false ;
					}
					return true ;
				}
			],
			cwd:this.path
		} ;
	};
	
	/*
 	 *	BUNDLE CLASS
 	 */
	var Bundle = class Bundle extends nodefony.Service {

		constructor (name , kernel , container){

			super( name, container );
			
			this.logger("\x1b[36m REGISTER BUNDLE : "+this.name+"   \x1b[0m","DEBUG",this.kernel.cli.clc.magenta("KERNEL") );
			this.environment = this.kernel.environment;
			this.waitBundleReady = false ;
			this.locale = this.kernel.settings.system.locale ;
			var config = this.getParameters("bundles."+this.name) ;
			if ( ! config ){
				this.setParameters("bundles."+this.name, {});
			}
			try {
				this.finder = new nodefony.finder( {
					path:this.path,
					exclude:/^docs$|^tests$|^public$|^doc|^node_modules$/,
				});
			}catch(e){
				this.logger(e, "ERROR");	
			}
			
			this.translation = this.get("translation");
			this.reader = this.kernel.reader;

			// assets 
			this.webPackConfig = null ;

			// controllers
			this.controllersPath = this.path+"/controller" ; 
			this.controllerFiles = this.findControllerFiles(this.finder.result);
			this.controllers = {};
			this.watcherController = null ;
			this.regController = regController;

			// views
			this.serviceTemplate = this.get("templating") ;
			this.regTemplateExt = new RegExp("^(.+)\."+this.serviceTemplate.extention+"$");
			this.viewsPath = this.path+"/Resources/views" ; 
			this.viewFiles = this.findViewFiles(this.finder.result);
			this.views = {};
			this.views["."] = {};
			this.watcherView = null ;

			// config
			this.regConfigFile = regConfigFile ;
			this.configPath = this.path+"/Resources/config";

			// others
			this.entities = {};
			this.fixtures = {};
			
			try {
				this.resourcesFiles = this.finder.result.findByNode("Resources") ;
			}catch(e){
				console.trace(e);
				this.logger("Bundle " + this.name +" Resources directory not found", "WARNING");
			}

			// I18n
			this.i18nPath = this.path+"/Resources/translations";
			this.i18nFiles = this.findI18nFiles( this.resourcesFiles);
			this.watcherI18n = null;
			this.regI18nFile = regI18nFile;

			// Register Service
			this.registerServices();
			
			// read config files
			this.kernel.readConfig.call(this, null, this.resourcesFiles.findByNode("config") ,(result) => {
				this.parseConfig(result);
			});

			// WATCHERS
			if ( this.kernel.environment === "dev" && this.settings.watch ){
				this.initWatchers();	
			}

			// WEBPACK SERVICE
			this.webpackService = this.get("webpack");
			this.webpackCompiler = null ;

			this.fire( "onRegister", this);
		}

		initWatchers(){
			var controllers = false ;
			var views = false ;
			var i18n = false ;
			var config = false ;
			try { 
				switch ( typeof this.settings.watch   ){
					case "object":
						controllers = this.settings.watch.controllers ;
						views = this.settings.watch.views ;
						i18n = this.settings.watch.translations ;
						config = this.settings.watch.config ;
					break;
					case "boolean":
						controllers = true ;	
						views = true ;
						i18n = true ;
						config = true ;
					break;
					default:
						throw new Error ("Bad Config watcher ");
				}
				// controllers
				if ( controllers ){
					this.watcherController = new nodefony.kernelWatcher(this.controllersPath, defaultWatcher.call(this, regController), this);
					this.watcherController.listenWatcherController();
					this.kernel.on("onTerminate", () => {
						this.logger("Watching Ended : " + this.watcherController.path, "INFO");
						this.watcherController.close();
					});
				}
				// views
				if ( views ){
					this.watcherView = new nodefony.kernelWatcher( this.viewsPath, defaultWatcher.call(this, this.regTemplateExt), this);
					this.watcherView.listenWatcherView();
					this.kernel.on("onTerminate", () => {
						this.logger("Watching Ended : " + this.watcherView.path, "INFO");
						this.watcherView.close();
					});
				}
				// I18n
				if ( i18n ){
					this.watcherI18n = new nodefony.kernelWatcher( this.i18nPath, defaultWatcher.call(this, regI18nFile), this);
					this.watcherI18n.listenWatcherI18n();
					this.kernel.on("onTerminate", () => {
						this.logger("Watching Ended : " + this.watcherI18n.path, "INFO");
						this.watcherI18n.close();
					});
				}
				// config
				if ( config ){
					this.watcherConfig = new nodefony.kernelWatcher( this.configPath, defaultWatcher.call(this, regConfigFile), this);
					this.watcherConfig.listenWatcherConfig();
					this.kernel.on("onTerminate", () => {
						this.logger("Watching Ended : " + this.watcherConfig.path, "INFO");
						this.watcherConfig.close();
					});
				}
			}catch(e){
				throw e ;
			}	
		}
			
		parseConfig (result){
			if (result){
				var config = null ;
				for (var ele in result){
					var ext = null ;
					switch (true){
						case regBundle.test(ele) :
							var name = regBundle.exec(ele);
							config = this.getParameters("bundles."+name[1]);
							if ( config ){
								ext = nodefony.extend(true, {}, config , result[ele]);
								this.logger("\x1b[32m OVERRIDING\x1b[0m  CONFIG bundle  : "+name[1]  ,"WARNING");
							}else{
								ext = result[ele] ;
								this.logger("\x1b[32m OVERRIDING\x1b[0m  CONFIG bundle  : "+name[1] + " BUT BUNDLE "+ name[1] +" NOT YET REGISTERED "  ,"WARNING");
							}
							if ( this.kernel.bundles[name[1]] ){
								this.kernel.bundles[name[1]].settings = ext ; 
								this.setParameters("bundles."+name[1], this.kernel.bundles[name[1]].settings); 
							}else{
								this.setParameters("bundles."+name[1], ext || {}); 
							}
						break;
						case /^locale$/.test(ele) :
							if ( result[ele] ){
								this.locale = result[ele] ;
							}
						break;
						case /^webpack$/.test(ele) :
								try {
									this.webPackConfig = result[ele] || null ;
									if ( this.webPackConfig ){
										this.kernel.listen(this, "onPostRegister", () => {
											this.logger("WEBPACK BUNDLE RUN COMPILER WATCHING : "+ this.webPackConfig.watch )
											if ( this.webpackService ){
												this.webpackCompiler = this.webpackService.loadConfig( this.webPackConfig ,this.path);	
											}
										});
									}
								}catch(e){
									throw  e ;	
								}
						break;
					}
				}
				config = this.getParameters("bundles."+this.name);
 		        	if ( Object.keys(config).length ){
					this.logger("\x1b[32m BUNDLE IS ALREADY OVERRIDING BY AN OTHERONE  INVERT\x1b[0m  CONFIG  "+ util.inspect(config)  ,"WARNING");
					this.settings = nodefony.extend(true, {}, result, config ); 
					this.setParameters("bundles."+this.name, this.settings);
				}else{
					this.settings = result ;
					this.setParameters("bundles."+this.name, this.settings);	
				}	
			}
		}

		logger (pci, severity, msgid,  msg){
			if (! msgid) { msgid = "BUNDLE "+this.name.toUpperCase(); }
			return this.syslog.logger(pci, severity, msgid,  msg);
		}

		loadFile (path, force, watch){
			return this.autoLoader.load(path, force, watch);
		}

		boot (){
			this.fire("onBoot",this);
			try { 
				// Register Controller
				this.registerControllers();

				// Register Views
				this.registerViews();

				// Register internationalisation 
				if ( this.translation ){
					this.locale = this.translation.defaultLocal;
				}
				this.registerI18n(this.locale);

				// Register Entity 
				this.registerEntities();
				
				// Register Fixtures 
				if ( this.kernel.type === "CONSOLE" ){
					this.registerFixtures();
				}
			}catch(e){
				throw e ;
			}

			if ( this.waitBundleReady === false ){
				this.fire("onReady",this);
			}

		}

		getName (){
			return this.name;
		}

		getController (name){
			return this.controllers[name];
		}

		compileWebpack (){
			if ( this.webpackCompiler ){
				try {
					return this.webpackService.runCompiler( this.webpackCompiler, this.name);	
				}catch(e){
					throw e ;
				}
			}
		}
		
		registerServices (){
			// find  controler files 
			var services = this.finder.result.findByNode("services");
			services.forEach((ele) => {
				var res = regService.exec( ele.name );
				if ( res ){
					var name = res[1] ;
					var Class = this.loadFile( ele.path );
					if (typeof Class === "function" ){
						Class.prototype.bundle = this ;
						this.logger("Register Service : "+res[0] , "DEBUG");
					}else{
						this.logger("Register Service : "+name +"  error Service bad format");
					}
				}
			});
		}

		findControllerFiles ( result ){
			if ( ! result ){
				try {
					this.controllerFiles = new nodefony.finder( {
						path:this.controllersPath,
					}).result;
				}catch(e){
					this.logger("Bundle " + this.name +" controller directory not found", "WARNING");
				}
			}else{
				// find  views files 
				this.controllerFiles = result.findByNode("controller") ;
			}
			return this.controllerFiles ;	
		}

		registerControllers ( result ){
			if ( result ){
				this.findControllerFiles(result);	
			}	
			
			this.controllerFiles.forEach((ele) => {
				var res = this.regController.exec( ele.name );
				if ( res ){
					var name = res[1] ;
					var Class = this.loadFile( ele.path, false, true);
					if (typeof Class === "function" ){
						Class.prototype.name = name;
						Class.prototype.bundle = this;
						this.controllers[name] = Class ;
						this.logger("Register Controller : '"+name+"'" , "DEBUG");
					}else{
						this.logger("Bundle "+this.name+" Register Controller : "+name +"  error Controller closure bad format","ERROR");
						console.trace("Bundle "+this.name+" Register Controller : "+name +"  error Controller closure bad format");
					}
				}
			});
		}

		reloadWatcherControleur ( name, Path){
			try { 
				if ( this.controllers[name] ){
					delete this.controllers[name] ;
					this.controllers[name] = null ;
				}
				var Class = this.loadFile( Path, true);
				if (typeof Class === "function" ){
					Class.prototype.name = name;
					Class.prototype.bundle = this;
					this.controllers[name] = Class ;
				}else{
					throw new Error("Register Controller : "+name +"  error Controller closure bad format ");
				}
			}catch(e){
				throw e ;
			}
		}

		reloadController ( nameC ){
			if ( ! nameC ) { return ; }
			var controller = this.finder.result.findByNode("controller");
			try {
				controller.forEach((ele) => {
					var res = this.regController.exec( ele.name );
					if ( res &&  res[1] === nameC ){
						var name = res[1] ;
						this.reloadWatcherControleur( name , ele.path );
						throw "BREAK" ;
					}
				});
			}catch(e){
				if ( e === "BREAK" ) { return ; }
				throw e ;
			}	
		}

		findViewFiles(result){
			var views = null ;
			if ( ! result ){
				try {
					views = new nodefony.finder( {
						path:this.viewsPath,
					}).result;
				}catch(e){
					this.logger("Bundle " + this.name +" views directory not found", "WARNING");
				}
		
			}else{
				// find  views files 
				views = result.findByNode("views") ;
			}
			return views ;
		}

		compileTemplate (file, basename, name){
			this.serviceTemplate.compile( file, (error, template) => {
				if (error){
					this.logger(error, "ERROR");
					return ;
				}
				this.views[basename][name].template = template ;
			});	
		}
		
		setView(file){
			var basename = path.basename(file.dirName);
			var res = null ;
			var name = null ;
			if (basename !== "views"){
				if ( ! this.views[basename] ){
					this.views[basename] = {};
				}
				res = this.regTemplateExt.exec( file.name );
				if (res){
					name = res[1];
					if ( this.views[basename][name] ){
						delete this.views[basename][name] ;
					}
					return this.views[basename][name] = {
						name:name,
						basename:basename,
						file:file,
						template:null
					};
				}
			}else{
				basename = ".";
				res = this.regTemplateExt.exec( file.name );
				if (res){
					name = res[1];
					if ( this.views[basename][name] ){
						delete this.views[basename][name] ;
					}
					return this.views[basename][name]= {
						name:name,
						basename:basename,
						file:file,
						template:null
					};
				}
			}		
			return null ;
		}

		recompileTemplate (file){
			try {
				var ele = this.setView(file) ;
				if ( ele && this.kernel.type !== "CONSOLE" ){
					this.compileTemplate(ele.file, ele.basename, ele.name);
				}
				return ele ;
			}catch(e){
				throw e ;
			}
		}

		registerViews (result){
			var views = null ;
			if ( result ){
				views = this.findViewFiles(result);	
			}else{
				views = this.viewFiles ;
			}
			return views.getFiles().forEach((file) => {
				try {
					var ele = this.recompileTemplate(file) ;
					if ( ele ){
						if ( ele.basename === "."){
							this.logger("Register Template   : '"+this.name+"Bundle:"+""+":"+ele.name + "'", "DEBUG");
						}else{
							this.logger("Register Template   : '"+this.name+"Bundle:"+ele.basename+":"+ele.name + "'", "DEBUG");
						}
					}
				}catch(e){
					throw e ;	
				}
			});
		}

		getView (viewDirectory, viewName){
			if ( this.views[viewDirectory] ){
				var res = this.regTemplateExt.exec( viewName );
				if (res){
					var name = res[1];
					if ( this.views[viewDirectory][name] ){
						return this.views[viewDirectory][name].file;
					}
					throw new Error("Bundle "+ this.name+" directory : "+viewDirectory +" GET view file Name : "+ viewName +" Not Found");
				}else{
					throw new Error("Bundle "+ this.name+" directory : "+viewDirectory +" GET view file Name : "+ viewName +" Not Found");
				}
			}else{
				throw new Error("Bundle "+ this.name+" GET view directory : "+viewDirectory +" Not Found");
			}
		}

		getTemplate (viewDirectory, viewName){
			if ( this.views[viewDirectory] ){
				var res = this.regTemplateExt.exec( viewName );
				if (res){
					var name = res[1];
					if ( this.views[viewDirectory][name] ){
						return this.views[viewDirectory][name].template;
					}
					throw new Error("Bundle "+ this.name+" directory : "+viewDirectory +" GET view file Name : "+ viewName +" Not Found");
				}else{
					throw new Error("Bundle "+ this.name+" directory : "+viewDirectory +" GET view file Name : "+ viewName +" Not Found");
				}
			}else{
				throw new Error("Bundle "+ this.name+" GET view directory : "+viewDirectory +" Not Found");
			}
		}

		findI18nFiles( result ){
			var i18n = null ;
			if ( ! result ){
				try {
					i18n = new nodefony.finder( {
						path:this.i18nPath,
					}).result;
				}catch(e){
					this.logger("Bundle " + this.name +" I18n directory not found", "WARNING");
				}
		
			}else{
				// find  i18n files 
				i18n = result.findByNode("translations");
			}
			return i18n ;	
		}

		getfilesByLocal(locale){
			var reg = new RegExp("^(.*)\.("+locale+")\.(.*)$"); 
			return this.i18nFiles.match(reg);
		}
		
		registerI18n (locale, result){
			if (! this.translation ) { 
				this.translation = this.get("translation"); 
				if ( this.translation ){
					this.locale = this.translation.defaultLocal;
				}else{
					return ;
 				}	
			}
			if (result){
				this.i18nFiles = this.findI18nFiles(result) ;
			}
			if (! this.i18nFiles.length() ) { return ; }

			var files = null ;
			if (locale){
				files =this.getfilesByLocal(locale);
			}else{
				files = this.getfilesByLocal( this.translation.defaultLocale );
				if ( ! files.length() ){
					var bundleLocal = this.getParameters("bundles."+this.name+".locale") ;
					files = this.getfilesByLocal( bundleLocal || this.translation.defaultLocale );
					if ( bundleLocal  && ! files.length() ){
						this.logger( Error("Error Translation file locale: "+bundleLocal+" don't exist"), "WARNING" )
					}
				}
			}
			files.getFiles().forEach( (file) => {
				var domain = file.match[1] ;
				var Locale = file.match[2] ;
				this.translation.reader(file.path, Locale, domain);
			});
		}

		/*
 	 	*
 	 	*	COMMAND
 	 	*
 	 	*/
				
		registerCommand (store){
			// find i18n files
			this.commandFiles = this.finder.result.findByNode("Command") ;
			var command = null ;
			this.commandFiles.getFiles().forEach( (file) => {
				var res = regCommand.exec( file.name );
				if (res){
					try{
						command = this.loadFile( file.path);
					}catch(e){
						throw new Error( e + "   FILE COMMAND : "+ file.path);
					}
					if (! command ){
						throw new Error("Command : "+file+" BAD FORMAT");
					}
					var name = command.name || res[1] ;
					if (! name ) { throw new Error("Command : "+name+"BAD FORMAT NANE "); }

					if ( ! store[this.name] ){
						store[this.name] = {};	
					}
					if (command.worker){
						if ( command.commands ){
							command.worker.prototype.commands = command.commands ;
							store[this.name][name] = command.worker ; 
						}else{
							throw new Error("Command : "+name+"BAD FORMAT commands ");	
						}	
					}else{
						throw new Error("Command : "+name+" WORKER COMMAND NOT FIND");
					}
				}
			});
		}

		getPublicDirectory (){
			var res =  null ;
			try {
				res  = new nodefony.finder( {
					path:this.path+"/Resources/public",
					exclude:/^docs$|^tests|^node_modules|^assets$/
				});
			}catch(e){
				this.logger(e,"ERROR");
			}
			return res.result;

		}

		registerEntities (){
			this.entityFiles = this.finder.result.findByNode("Entity") ;
			if (this.entityFiles.length()){
				this.entityFiles.getFiles().forEach( (file) => {
					var res = regEntity.exec( file.name );
					if ( res ){
						var name = res[1] ;
						var Class = this.loadFile( file.path);
						if (typeof Class.entity === "function" ){
							Class.entity.prototype.bundle = this;
							this.entities[name] = Class;
							this.logger("LOAD ENTITY : "+file.name ,"DEBUG");
						}else{
							this.logger("Register ENTITY : "+name +"  error ENTITY bad format");
						}
					}
				});	
			}
		}

		getEntity (name){
			if ( this.entities[name] ){
				return this.entities[name];
			}
			return null ;
		}

		getEntities (){
			if ( this.entities ){
				return this.entities;
			}
			return null;
		}

		registerFixtures (){
			this.fixtureFiles = this.finder.result.findByNode("Fixtures") ;
			if (this.fixtureFiles.length()){
				this.fixtureFiles.getFiles().forEach( (file) => {
					var res = regFixtures.exec( file.name );
					if ( res ){
						var name = res[1];
						var Class = this.loadFile( file.path);
						if (typeof Class.fixture === "function" ){
							Class.fixture.prototype.bundle = this;
							this.fixtures[name] = Class;
							this.logger("LOAD FIXTURE : "+file.name ,"DEBUG");
						}else{
							this.logger("Register FIXTURE : "+name +"  error FIXTURE bad format");
						}
					}
				});	
			}
		}
		
		getFixture (name){
			if ( this.fixtures[name] ){
				return this.fixtures[name];
			}
			return null ;
		}

		getFixtures (){
			if ( this.fixtures ){
				return this.fixtures;
			}
			return null ;
		}
	};

	return Bundle;
});
