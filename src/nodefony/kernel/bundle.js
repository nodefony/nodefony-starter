/*
 *
 *
 *
 *
 *
 */

nodefony.register("Bundle", function(){
	
	var regFixtures = /^(.+)Fixtures.js$/;
	var regController = /^(.+)Controller.js$/;
	var regService = /^(.+)Service.js$/;
	var regCommand = /^(.+)Command.js$/;
	var regEntity = /^(.+)Entity.js$/;

		
	/*
	 *
	 *	WATCHER 
	 *
	 */
	var defaultWatcherSettings  = {
		persistent: true,
  		followSymlinks: true,
  		alwaysStat: false,
  		depth: 50,
		//usePolling: true,
  		//interval: 100,
  		//binaryInterval: 300,
  		atomic: true // or a custom 'atomicity delay', in milliseconds (default 100)
	};
	
	var Watcher = class Watcher extends nodefony.watcher {
		constructor (Path , settings, bundle){
		
			super( Path , nodefony.extend(true, {}, defaultWatcherSettings, settings), bundle.container );

			if ( bundle ){
				this.bundle = bundle ;
				this.cwd = bundle.path ; 
			}
		}

		logger (  payload, severity, msgid, msg  ){
			if ( typeof payload  === "string"){
				var txt = "\x1b[36m"; 
				if ( this.bundle ){
					txt += "BUNDLE "+ this.bundle.name + "\x1b[0m ";
				}
				txt +=  payload ;
				msgid = "\x1b[36mWATCHER EVENT "+msgid+"\x1b[0m";
				payload = txt ;
			}
			return super.logger( payload, severity, msgid, msg );
		}
		
		listenWatcherController(){
			this.on('all', (event, Path) => {
				switch(event){
					case "addDir" :
						this.logger( Path, "WARNING", event );
					break;
					case "add" :
					case "change" :
						this.logger( Path, "INFO", event );
						try {
							var basename = path.basename(Path) ;
							var res = regController.exec( basename );
							var name = res[1] ;
							var file = this.cwd + "/" + Path ;
							this.bundle.reloadWatcherControleur( name, file);
						}catch(e){
							this.logger(e, "ERROR");
						}
					break;
					case "error" :
						this.logger( Path, "ERROR", event );
					break;
					case "unlinkDir" :
						this.logger( Path, "WARNING", event );
					break;
					case "unlink" :
						this.logger( Path, "WARNING", event );
						var basename = path.basename(Path) ;
						var res = regController.exec( basename );
						var name = res[1] ;
						if ( this.bundle.controllers[name] ){
							this.logger( "REMOVE CONTROLLER : " +  Path, "INFO", event );
							delete this.bundle.controllers[name] ;
							this.bundle.controllers[name] = null ;
						}
					break;
				}
				this.fire(event, this.watcher , Path);
			});	
		}

		listenWatcherView(){
			this.on('all', (event, Path) => {
				switch( event ){
					case "addDir" :
						this.logger( Path, "INFO", event );
					break;
					case "add" :
					case "change" :
						this.logger( Path, "INFO", event );
						var file = this.cwd + "/" + Path ;
						try{ 
							var fileClass = new nodefony.fileClass(file);
							var ele = this.bundle.recompileTemplate(fileClass);
							if ( ele.basename === "."){
								this.logger("RECOMPILE Template : '"+this.bundle.name+"Bundle:"+""+":"+ele.name + "'", "INFO", event);
							}else{
								this.logger("RECOMPILE Template : '"+this.bundle.name+"Bundle:"+ele.basename+":"+ele.name + "'", "INFO",event );
							}
						}catch(e){
							this.logger(e, "ERROR", event);
						}
					break;
					case "error" :
						this.logger( Path, "ERROR", event );
					break;
					case "unlinkDir" :
						this.logger( Path, "INFO", event );
					break;
					case "unlink" :
						this.logger( Path, "INFO", event );
						var file = this.cwd + "/" + Path ;
						var parse = path.parse(file)  ;
						if ( parse.ext === "."+this.bundle.serviceTemplate.extention ){
							var name = parse.name ;
							var directory = path.basename(parse.dir);
							if (directory !== "views"){
								if ( this.bundle.views[directory]){
									if ( this.bundle.views[directory][name] ){
										delete	this.bundle.views[directory][name];
										this.logger( "REMOVE TEMPLATE : " +  file, "INFO", event );
									}
								}
							}else{
								if ( this.bundle.views["."][name] ){
									delete this.bundle.views["."][name] ;
									this.logger( "REMOVE TEMPLATE : " +  file, "INFO", event );
								}	
							}
						}
					break;
				}
				this.fire(event, this.watcher , Path);
			});	
		}
	};

	var defaultWatcherViews = function (){
		return {
			ignoreInitial: true,
			ignored: [
				 (string)  => {
					var file = null;
					var basename = path.basename(string) ;
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
						return false ;
					}
					if ( this.regTemplateExt.test(basename) ){
						return false ;
					}
					return true ;
				}
			],
			cwd:this.path
		} ;
	};

	var defaultWatcherControllers  = function() {
		return {
			ignoreInitial: true,
			ignored: [
				 (string) => {
				 	var file = null ;
					var basename = path.basename(string);
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
						return false ;
					}
					if ( regController.test(basename) ){
						return false ;
					}
					return true ;
				}
			],
			cwd:this.path
		};
	};

	/*
 	 *	BUNDLE CLASS
 	 */
	var Bundle = class Bundle extends nodefony.Service {

		constructor (name , kernel , container){

			super( name, container );
			
			this.logger("\x1b[36m REGISTER BUNDLE : "+this.name+"   \x1b[0m","DEBUG","KERNEL");
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
					exclude:/^docs$|^tests$|^public$|^doc$/,
				});
			}catch(e){
				this.logger(e, "ERROR");	
			}

			this.serviceTemplate = this.get("templating") ;
			this.regTemplateExt = new RegExp("^(.+)\."+this.serviceTemplate.extention+"$");

			this.reader = this.kernel.reader;
			 
			// assets 
			this.webPackConfig = null ;

			// controllers
			this.controllersPath = this.path+"/controller" ; 
			this.controllerFiles = this.findControllerFiles(this.finder.result);
			this.controllers = {};
			this.watcherController = null ;

			// views
			this.viewsPath = this.path+"/Resources/views" ; 
			this.viewFiles = this.findViewFiles(this.finder.result);
			this.views = {};
			this.views["."] = {};
			this.watcherView = null ;

			// 
			this.entities = {};
			this.fixtures = {};

			try {
				this.resourcesFiles = this.finder.result.findByNode("Resources") ;
			}catch(e){
				console.trace(e);
				this.logger("Bundle " + this.name +" Resources directory not found", "WARNING");
			}

			// Register Service
			this.registerServices();
			
			// read config files
			this.kernel.readConfig.call(this, null, this.resourcesFiles.findByNode("config") ,(result) => {
				this.parseConfig(result);
			});

			// WATCHERS
			if ( this.kernel.environment === "dev" && this.settings.watch ){
				var controllers = false ;
				var views = false ;
				try { 
					switch ( typeof this.settings.watch   ){
						case "object":
							controllers = this.settings.watch.controllers ;
							views = this.settings.watch.views ;
						break;
						case "boolean":
							controllers = true ;	
							views = true ;	
						break;
						default:
							throw new Error ("Bad Config watcher ");
					}
					// controllers
					if ( controllers ){
						this.watcherController = new Watcher(this.controllersPath, defaultWatcherControllers.call(this), this);
						this.watcherController.listenWatcherController();
						this.kernel.on("onTerminate", () => {
							this.logger("Watching Ended : " + this.watcherController.path, "INFO");
							this.watcherController.close();
						});
					}
					// views
					if ( views ){
						this.watcherView = new Watcher( this.viewsPath, defaultWatcherViews.call(this), this);
						this.watcherView.listenWatcherView();
						this.kernel.on("onTerminate", () => {
							this.logger("Watching Ended : " + this.watcherView.path, "INFO");
							this.watcherView.close();
						});
					}
				}catch(e){
					throw e ;
				}
			}

			// WEBPACK SERVICE
			this.webpackService = this.get("webpack");
			this.webpackCompiler = null ;

			this.fire( "onRegister", this);
		}
			
		parseConfig (result){
			if (result){
				var config = null ;
				for (var ele in result){
					var ext = null ;
					switch (true){
						case /^(.*)Bundle$/.test(ele) :
							var name = /^(.*)Bundle$/.exec(ele);
							config = this.getParameters("bundles."+name[1]);
							if ( config ){
								ext = nodefony.extend(true, {}, config , result[ele]);
								this.logger("\x1b[32m OVERRIDING\x1b[0m  CONFIG bundle  : "+name[1]  ,"WARNING");
								//this.container.setParameters("bundles."+name[1], ext);	
							}else{
								ext = result[ele] ;
								this.logger("\x1b[32m OVERRIDING\x1b[0m  CONFIG bundle  : "+name[1] + " BUT BUNDLE "+ name[1] +" NOT YET REGISTERED "  ,"WARNING");
								//this.container.setParameters("bundles."+name[1], result[ele]);	
							}
							if ( this.kernel.bundles[name[1]] ){
								this.kernel.bundles[name[1]].settings = ext ; 
								this.setParameters("bundles."+name[1], this.kernel.bundles[name[1]].settings); 
							}else{
								this.setParameters("bundles."+name[1], ext || {}); 
							}
						break;
						case /^locale$/.test(ele) :
							this.locale = result[ele] ;
						break;
						case /^webpack$/.test(ele) :
								try {
									this.webPackConfig = result[ele] || null ;
									if ( this.webPackConfig ){
										this.listen(this, "onReady", () => {
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
						this.logger("Bundle "+this.name+" Register Service : "+res[0] , "DEBUG");
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
				var res = regController.exec( ele.name );
				if ( res ){
					var name = res[1] ;
					var Class = this.loadFile( ele.path, false, true);
					if (typeof Class === "function" ){
						Class.prototype.name = name;
						Class.prototype.bundle = this;
						this.controllers[name] = Class ;
						this.logger("Bundle "+this.name+" Register Controller : "+name , "DEBUG");
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
					var res = regController.exec( ele.name );
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
							this.logger("Register Template : '"+this.name+"Bundle:"+""+":"+ele.name + "'", "DEBUG");
						}else{
							this.logger("Register Template : '"+this.name+"Bundle:"+ele.basename+":"+ele.name + "'", "DEBUG");
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

		registerI18n (locale, result){
			var translation = this.get("translation");
			if (! translation ) { return ; }
			// find i18n files
			var i18nFiles = null ;
			var defaultLocale = null ;
			var reg = null ;
			var files = null ;
			if (result){
				i18nFiles = result.findByNode("translations");
			}else{
				i18nFiles = this.resourcesFiles.findByNode("translations");
			}
			if (! i18nFiles.length() ) { return ; }
			if (locale){
				defaultLocale =  locale;	
				reg = new RegExp("^(.*)\.("+defaultLocale+")\.(.*)$"); 
				files = i18nFiles.match(reg);
			}else{
				defaultLocale =  translation.defaultLocale  ;
				if (! defaultLocale ) { return ; }
				reg = new RegExp("^(.*)\.("+defaultLocale+")\.(.*)$"); 
				files = i18nFiles.match(reg);
				if ( ! files.length() ){
					var bundleLocal = this.getParameters("bundles."+this.name+".locale") ;
					if ( bundleLocal ){
						defaultLocale = bundleLocal ; 	
					}
					reg = new RegExp("^(.*)\.("+defaultLocale+")\.(.*)$"); 
					files = i18nFiles.match(reg);
					if ( bundleLocal  && ! files.length() ){
						throw new Error("Error Translation file locale: "+defaultLocale+" don't exist");
					}
				}
			}
			files.getFiles().forEach( (file) => {
				//var basename = path.basename(file.dirName)
				var domain = file.match[1] ;
				var Locale = file.match[2] ;
				//console.log(file.path)
				//console.log(file.match)
				translation.reader(file.path, Locale, domain);
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
					exclude:/^docs$|^tests$/
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
