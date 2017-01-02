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

	var proto = {
		createDirectory : function(path, mode, callback){
			try {
				fs.mkdirSync(path, mode);
				var file = new nodefony.fileClass(path);
				callback( file );
				return file ;
			}catch(e){
				throw e ;
			}
		},
		createFile : function(path, skeleton, parse, params, callback){
			if ( skeleton ){
				this.buildSkeleton(skeleton, parse, params,(error, result) => {
					if (error){
						this.logger(error, "ERROR");	
					}else{
						try {
							fs.writeFileSync(path, result,{
								mode:"777"
							});
							callback( new nodefony.fileClass(path) ); 
						}catch(e){
							throw e	;
						}		
					}					
				});
			}else{
				var data = "/* generate by nodefony */";
				try {
					fs.writeFileSync(path, data,{
						mode:"777"
					});
					callback( new nodefony.fileClass(path) ); 
				}catch(e){
					throw e	;
				}
			}
		},
		buildSkeleton : function(skeleton, parse, obj, callback){
			var skelete = null ;
			try {
				skelete = new nodefony.fileClass(skeleton);
				if (skelete.type === "File"){
					if (parse !== false){
						this.twig.renderFile(skelete, obj, callback);
					}else{
						callback(null, fs.readFileSync(skelete.path,{
							encoding:'utf8'
						}));
					}
				}else{
					throw new Error( " skeleton must be file !!! : "+ skelete.path);
				}
			}catch(e){
				this.logger(e, "ERROR");
			}
			return skelete;
		},
		build : function(obj, parent){
			var child = null;
			switch ( nodefony.typeOf(obj) ){
				case "array" :
					for (var i = 0 ; i < obj.length ; i++){
						this.build(obj[i], parent);
					}	
				break;
				case "object" :
					for (var ele in obj ){
						var value = obj[ele];
						switch (ele){
							case "name" :
								var name = value;
							break;
							case "type" :
								switch(value){
									case "directory":
										child = this.createDirectory(parent.path+"/"+name, "777", (ele) => {
											this.logger("Create Directory :" + ele.name);
										} );
									break;
									case "file":
										this.createFile(parent.path+"/"+name, obj.skeleton, obj.parse, obj.params, (ele) =>{
											this.logger("Create File      :" + ele.name);
										});
									break;
									case "symlink":
										fs.symlink ( parent.path+"/"+obj.params.source, parent.path+"/"+obj.params.dest , obj.params.type || "file", (ele) => {
											this.logger("Create symbolic link :" + ele.name);
										} );
									break;
								}
							break;
							case "childs" :
								try {
									//console.log(value)
									this.build(value, child);
								}catch (e){
									this.logger(e, "ERROR");
								}
							break;
						}
					}
				break;
				default:
					this.logger("generate build error arguments : "+ ele, "ERROR" );
			}
			return child ;
		}
 	};
	/*
 	 *	BUNDLE CLASS
 	 */
	var Bundle = class Bundle extends nodefony.Service {

		constructor (name , kernel , container){

			super( name, container );
			
			this.logger("\x1b[36m REGISTER BUNDLE : "+this.name+"   \x1b[0m","DEBUG","KERNEL");
			this.kernel = kernel ;
			this.waitBundleReady = false ;
			this.locale = this.kernel.settings.system.locale ;
			var config = this.container.getParameters("bundles."+this.name) ;
			if ( ! config ){
				this.container.setParameters("bundles."+this.name, {});
			}
			try {
				this.finder = new nodefony.finder( {
					path:this.path,
					exclude:/^docs$|^tests$|^public$|^doc$/,
				});
			}catch(e){
				this.logger(e, "ERROR");	
			}
			this.controllers = {};
			this.views = {};
			this.views["."] = {};
			this.entities = {};
			this.fixtures = {};

			this.reader = this.container.get("kernel").reader;
			
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
			this.regTemplateExt = new RegExp("^(.+)\."+this.container.get("templating").extention+"$");
		}
	
		parseConfig (result){
			if (result){
				var config = null ;
				for (var ele in result){
					var ext = null ;
					switch (true){
						case /^(.*)Bundle$/.test(ele) :
							var name = /^(.*)Bundle$/.exec(ele);
							config = this.container.getParameters("bundles."+name[1]);
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
								this.container.setParameters("bundles."+name[1], this.kernel.bundles[name[1]].settings); 
							}else{
								this.container.setParameters("bundles."+name[1], ext || {}); 
							}
						break;
						case /^locale$/.test(ele) :
							this.locale = result[ele] ;
						break;
					}
				}
				config = this.container.getParameters("bundles."+this.name);
 		        	if ( Object.keys(config).length ){
					this.logger("\x1b[32m BUNDLE IS ALREADY OVERRIDING BY AN OTHERONE  INVERT\x1b[0m  CONFIG  "+ util.inspect(config)  ,"WARNING");
					this.settings = nodefony.extend(true, {}, result, config ); 
					this.container.setParameters("bundles."+this.name, this.settings);
				}else{
					this.settings = result ;
					this.container.setParameters("bundles."+this.name, this.settings);	
				}	
			}
		}

		logger (pci, severity, msgid,  msg){
			//var syslog = this.container.get("syslog");
			if (! msgid) { msgid = "BUNDLE "+this.name.toUpperCase(); }
			return this.syslog.logger(pci, severity, msgid,  msg);
		}

		loadFile (path, force){
			return this.autoLoader.load(path, force);
		}

		boot (){
			this.fire("onBoot",this);
			// Register Controller
			this.registerControllers();

			// Register Views
			this.registerViews();

			// Register internationalisation 
			this.registerI18n(this.locale);

			// Register Entity 
			this.registerEntities();
			
			// Register Entity 
			this.registerFixtures();

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

		registerControllers (){
			// find  controler files 
			var controller = this.finder.result.findByNode("controller");
			controller.forEach((ele) => {
				var res = regController.exec( ele.name );
				if ( res ){
					var name = res[1] ;
					var Class = this.loadFile( ele.path);
					if (typeof Class === "function" ){
						Class.prototype.name = name;
						Class.prototype.bundle = this;
						this.controllers[name] = Class ;
						this.logger("Bundle "+this.name+" Register Controller : "+name , "DEBUG");
					}else{
						this.logger("Bundle "+this.name+" Register Controller : "+name +"  error Controller closure bad format","ERROR");
					}
				}
			});
		}

		reloadController ( nameC ){
			if ( ! nameC ) { return ; }
			var controller = this.finder.result.findByNode("controller");
			try {
				controller.forEach((ele) => {
					var res = regController.exec( ele.name );
					if ( res &&  res[1] === nameC ){
						delete this.controllers[name] ;
						this.controllers[name] = null ;
						var name = res[1] ;
						var Class = this.loadFile( ele.path, true);
						if (typeof Class === "function" ){
							Class.prototype.name = name;
							Class.prototype.bundle = this;
							this.controllers[name] = Class ;
						}else{
							this.logger("Register Controller : "+name +"  error Controller closure bad format ");
						}
						throw "BREAK" ;
					}
				});
			}catch(e){
				if ( e === "BREAK" ) { return ; }
				throw e ;
			}	
		}

		registerViews (result){
			
			var serviceTemplate = this.get("templating") ;
			var views = null ;

			if ( ! result ){
				try {
					views = new nodefony.finder( {
						path:this.path+"/Resources/views",
					}).result;
				}catch(e){
					this.logger("Bundle " + this.name +" views directory not found", "WARNING");
				}
		
			}else{
				// find  views files 
				views = result.findByNode("views") ;
			}

			if ( ! views ) { return ; }
			
			views.getFiles().forEach((file) => {
				var basename = path.basename(file.dirName);
				var res = null ;
				var name = null ;
				if (basename !== "views"){
					// directory 
					//console.log(basename)
					if ( ! this.views[basename] ){
						this.views[basename] = {};
					}
					res = this.regTemplateExt.exec( file.name );
					if (res){
						name = res[1];
						this.views[basename][name] = {
							file:file,
							template:null
						};
						this.logger("Register Template : '"+this.name+"Bundle:"+basename+":"+name +"'", "DEBUG");
						if (this.kernel.type !== "CONSOLE" ){
							serviceTemplate.compile( file, (error, template) => {
								if (error){
									this.logger(error, "ERROR");
									return ;
								}
								this.views[basename][name].template = template ;
								this.logger("COMPILE Template : '"+this.name+"Bundle:"+basename+":"+name +"'", "DEBUG");
							});
						}else{
							/*if ( this.kernel.getopts.parsedOption.argv[0] == "assets:dump" ){
								serviceTemplate.compile( file, function(error, template){
									if (error){
										this.logger(error, "ERROR");
										return ;
									}
									this.views[basename][name]["template"] = template ;
									this.logger("COMPILE Template : '"+this.name+"Bundle:"+basename+":"+name +"'", "DEBUG");
								}.bind(this) )	
							}*/
						}
					}
				}else{
					// racine
					basename = ".";
					res = this.regTemplateExt.exec( file.name );
					if (res){
						name = res[1];
						this.views[basename][name]= {
							file:file,
							template:null
						};
						this.logger("Register Template : '"+this.name+"Bundle:"+""+":"+name + "'", "DEBUG");
						if (this.kernel.type !== "CONSOLE"){
							serviceTemplate.compile( file, (error, template) => {
								if (error){
									this.logger(error, "ERROR");
									return ;
								}
								this.views[basename][name].template = template ;
								this.logger("COMPILE Template : '"+this.name+"Bundle:"+""+":"+name + "'", "DEBUG");
							});
						}else{
							/*if( this.kernel.getopts.parsedOption.argv[0] == "assets:dump" ){
								serviceTemplate.compile( file, function(error, template){
									if (error){
										this.logger(error, "ERROR");
										return ;
									}
									this.views[basename][name]["template"] = template ;
									this.logger("COMPILE Template : '"+this.name+"Bundle:"+""+":"+name + "'", "DEBUG");
								}.bind(this) )
							}*/
						}
					}
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
					var bundleLocal = this.container.getParameters("bundles."+this.name+".locale") ;
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
						for (var func in proto){
							command.worker.prototype[func] = proto[func] ;	
						}
						command.worker.prototype.container = this.container;
						command.worker.prototype.terminate = this.kernel.terminate.bind(this.kernel);
						command.worker.prototype.logger = this.logger.bind(this); 
						command.worker.prototype.twig = this.container.get("templating");

						if ( command.commands ){
							command.worker.prototype.commands = command.commands ;
							store[this.name][name] = command.worker ; 
							//this.kernel.commands[name] = command.worker ;
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
