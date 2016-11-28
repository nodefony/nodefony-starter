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
				var res = fs.mkdirSync(path, mode);
				var file = new nodefony.fileClass(path);
				callback( file );
				return file
			}catch(e){
				throw e
			}
		},
		createFile : function(path, skeleton, parse, params, callback){
			if ( skeleton ){
				this.buildSkeleton(skeleton, parse, params,(error, result) => {
					if (error){
						this.logger(error, "ERROR");	
					}else{
						try {
							var res = fs.writeFileSync(path, result,{
								mode:"777"
							});
							callback( new nodefony.fileClass(path) ); 
						}catch(e){
							throw e	
						}		
					}					
				});
			}else{
				var data = "/* generate by nodefony */";
				try {
					var res = fs.writeFileSync(path, data,{
						mode:"777"
					});
					callback( new nodefony.fileClass(path) ); 
				}catch(e){
					throw e	
				}
			}
		},
		buildSkeleton : function(skeleton, parse, obj, callback){
			try {
				var skelete = new nodefony.fileClass(skeleton);
				if (skelete.type === "File"){
					if (parse !== false){
						this.twig.renderFile(skelete, obj, callback);
					}else{
						callback(null, fs.readFileSync(skelete.path,{
							encoding:'utf8'
						}))
					}
				}else{
					throw new Error( " skeleton must be file !!! : "+ skelete.path);
				}
			}catch(e){
				this.logger(e, "ERROR")
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
										var child = this.createDirectory(parent.path+"/"+name, "777", (ele) => {
											this.logger("Create Directory :" + ele.name)
										} );
									break;
									case "file":
										this.createFile(parent.path+"/"+name, obj.skeleton, obj.parse, obj.params, (ele) =>{
											this.logger("Create File      :" + ele.name)
										});
									break;
									case "symlink":
										fs.symlink ( parent.path+"/"+obj.params.source, parent.path+"/"+obj.params.dest , obj.params.type || "file", (ele) => {
											this.logger("Create symbolic link :" + ele.name)
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
	var Bundle = class Bundle {

		constructor (kernel , container){
			this.logger("\x1b[36m REGISTER BUNDLE : "+this.name+"   \x21[0m","DEBUG","KERNEL");
			this.kernel = kernel ;
			this.notificationsCenter = nodefony.notificationsCenter.create();
			this.waitBundleReady = false ;
			this.locale = this.kernel.settings.system.locale ;
			this.container = container ;
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
			})
			this.regTemplateExt = new RegExp("^(.+)\."+this.container.get("templating").extention+"$");
		};
	
		parseConfig (result){
			if (result){
				for (var ele in result){
					switch (true){
						case /^(.*)Bundle$/.test(ele) :
							var name = /^(.*)Bundle$/.exec(ele)
							var config = this.container.getParameters("bundles."+name[1])
							if ( config ){
								var ext = nodefony.extend(true, {}, config , result[ele])
								this.logger("\x21[32m OVERRIDING\x21[0m  CONFIG bundle  : "+name[1]  ,"WARNING")
								//this.container.setParameters("bundles."+name[1], ext);	
							}else{
								var ext = result[ele] ;
								this.logger("\x21[32m OVERRIDING\x21[0m  CONFIG bundle  : "+name[1] + " BUT BUNDLE "+ name[1] +" NOT YET REGISTERED "  ,"WARNING");
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
				var config = this.container.getParameters("bundles."+this.name);
 		        	if ( Object.keys(config).length ){
					this.logger("\x21[32m BUNDLE IS ALREADY OVERRIDING BY AN OTHERONE  INVERT\x21[0m  CONFIG  "+ util.inspect(config)  ,"WARNING");
					this.settings = nodefony.extend(true, {}, result, config ); 
					this.container.setParameters("bundles."+this.name, this.settings);
				}else{
					this.settings = result ;
					this.container.setParameters("bundles."+this.name, this.settings);	
				}	
			}
		};

		listen (){
			return this.notificationsCenter.listen.apply(this.notificationsCenter, arguments);
		};

		fire (ev){
			this.logger(ev, "DEBUG", "EVENT BUNDLE "+this.name+"\x21[0m")
			return this.notificationsCenter.fire.apply(this.notificationsCenter, arguments);
		};

		logger (pci, severity, msgid,  msg){
			var syslog = this.container.get("syslog")
			if (! msgid) msgid = "BUNDLE "+this.name.toUpperCase();
			return syslog.logger(pci, severity, msgid,  msg)
		}

		loadFile (path, force){
			return this.autoLoader.load(path, force);
		};

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

		};

		getName (){
			return this.name;
		};

		getController (name){
			return this.controllers[name];
		};
		
		registerServices (){
			// find  controler files 
			var services = this.finder.result.findByNode("services");
			services.forEach((ele, index, array) => {
				var res = regService.exec( ele.name );
				if ( res ){
					var name = res[1] ;
					var Class = this.loadFile( ele.path );
					if (typeof Class === "function" ){
						Class.prototype.bundle = this ;
						this.logger("Bundle "+this.name+" Register Service : "+res[0] , "DEBUG");
					}else{
						this.logger("Register Service : "+name +"  error Service bad format")
					}
				}
			});
		};

		registerControllers (){
			// find  controler files 
			var controller = this.finder.result.findByNode("controller");
			controller.forEach((ele, index, array) => {
				var res = regController.exec( ele.name );
				if ( res ){
					var name = res[1] ;
					var Class = this.loadFile( ele.path);
					if (typeof Class === "function" ){
						Class.prototype.name = name;
						Class.prototype.bundle = this;
						//var func = Class.herite(nodefony.controller);
						this.controllers[name] = Class ;
						this.logger("Bundle "+this.name+" Register Controller : "+name , "DEBUG");
					}else{
						this.logger("Bundle "+this.name+" Register Controller : "+name +"  error Controller closure bad format","ERROR");
					}
				}
			});

		};

		reloadController ( nameC, container){
			if ( ! nameC ) return ;
			var controller = this.finder.result.findByNode("controller");
			try {
				controller.forEach((ele, index, array) => {
					var res = regController.exec( ele.name );
					if ( res &&  res[1] === nameC ){
						delete this.controllers[name] ;
						this.controllers[name] = null
						var name = res[1] ;
						var Class = this.loadFile( ele.path, true);
						if (typeof Class === "function" ){
							Class.prototype.name = name;
							Class.prototype.bundle = this;
							//var func = Class.herite(nodefony.controller);
							this.controllers[name] = func ;
						}else{
							this.logger("Register Controller : "+name +"  error Controller closure bad format ");
						}
						throw "BREAK" ;
					}
				});
			}catch(e){
				if ( e === "BREAK" ) return ;
				throw e ;
			}	
		}

		registerViews (result){
			
			var serviceTemplate = this.get("templating") ;

			if ( ! result ){
				try {
					var views = new nodefony.finder( {
						path:this.path+"/Resources/views",
					}).result;
				}catch(e){
					this.logger("Bundle " + this.name +" views directory not found", "WARNING");
				}
		
			}else{
				// find  views files 
				var views = result.findByNode("views") ;
			}

			if ( ! views ) return ;
			
			views.getFiles().forEach((file, index, array) => {
				var basename = path.basename(file.dirName);
				if (basename !== "views"){
					// directory 
					//console.log(basename)
					if ( ! this.views[basename] ){
						this.views[basename] = {};
					}
					var res = this.regTemplateExt.exec( file.name );
					if (res){
						var name = res[1];
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
								this.views[basename][name]["template"] = template ;
								this.logger("COMPILE Template : '"+this.name+"Bundle:"+basename+":"+name +"'", "DEBUG");
							} )
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
					var basename = ".";
					var res = this.regTemplateExt.exec( file.name );
					if (res){
						var name = res[1];
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
								this.views[basename][name]["template"] = template ;
								this.logger("COMPILE Template : '"+this.name+"Bundle:"+""+":"+name + "'", "DEBUG");
							} )
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
		};

		getView (viewDirectory, viewName){
			
			if ( this.views[viewDirectory] ){
				var res = this.regTemplateExt.exec( viewName );
				if (res){
					var name = res[1];
					if ( this.views[viewDirectory][name] )
						return this.views[viewDirectory][name]["file"];
					throw new Error("Bundle "+ this.name+" directory : "+viewDirectory +" GET view file Name : "+ viewName +" Not Found");
				}else{
					throw new Error("Bundle "+ this.name+" directory : "+viewDirectory +" GET view file Name : "+ viewName +" Not Found");
				}
			}else{
				throw new Error("Bundle "+ this.name+" GET view directory : "+viewDirectory +" Not Found");
			}
		};

		getTemplate (viewDirectory, viewName){
			
			if ( this.views[viewDirectory] ){
				var res = this.regTemplateExt.exec( viewName );
				if (res){
					var name = res[1];
					if ( this.views[viewDirectory][name] )
						return this.views[viewDirectory][name]["template"];
					throw new Error("Bundle "+ this.name+" directory : "+viewDirectory +" GET view file Name : "+ viewName +" Not Found");
				}else{
					throw new Error("Bundle "+ this.name+" directory : "+viewDirectory +" GET view file Name : "+ viewName +" Not Found");
				}
			}else{
				throw new Error("Bundle "+ this.name+" GET view directory : "+viewDirectory +" Not Found");
			}
		};


		registerI18n (locale, result){
			var translation = this.get("translation");
			if (! translation ) return ;
			// find i18n files
			if (result)
				var i18nFiles = result.findByNode("translations");
			else
				var i18nFiles = this.resourcesFiles.findByNode("translations");
			if (! i18nFiles.length() ) return ;
			if (locale){
				var defaultLocale =  locale;	
				var reg = new RegExp("^(.*)\.("+defaultLocale+")\.(.*)$"); 
				var files = i18nFiles.match(reg);
			}else{
				var defaultLocale =  translation.defaultLocale  ;
				if (! defaultLocale ) return ;
				var reg = new RegExp("^(.*)\.("+defaultLocale+")\.(.*)$"); 
				var files = i18nFiles.match(reg);
				if ( ! files.length() ){
					var bundleLocal = this.container.getParameters("bundles."+this.name+".locale") ;
					if ( bundleLocal ){
						defaultLocale = bundleLocal ; 	
					}
					var reg = new RegExp("^(.*)\.("+defaultLocale+")\.(.*)$"); 
					files = i18nFiles.match(reg);
					if ( bundleLocal  && ! files.length() ){
						throw new Error("Error Translation file locale: "+defaultLocale+" don't exist")
					}
				}
			}
			files.getFiles().forEach( (file, index, array) => {
				//var basename = path.basename(file.dirName)
				var domain = file.match[1] ;
				var Locale = file.match[2] ;
				//console.log(file.path)
				//console.log(file.match)
				translation.reader(file.path, Locale, domain)
			});
		};


		/*
 	 	*
 	 	*	COMMAND
 	 	*
 	 	*/
				
		registerCommand (store){
			// find i18n files
			this.commandFiles = this.finder.result.findByNode("Command") ;
			this.commandFiles.getFiles().forEach( (file, index, array) => {
				var res = regCommand.exec( file.name );
				if (res){
					try{
						var command = this.loadFile( file.path);
					}catch(e){
						throw new Error( e + "   FILE COMMAND : "+ file.path);
					}
					if (! command ){
						throw new Error("Command : "+file+" BAD FORMAT");
					}
					var name = command.name || res[1] ;
					if (! name ) throw new error("Command : "+name+"BAD FORMAT NANE ");

					if ( ! store[this.name] ){
						store[this.name] = {};	
					}
					if (command.worker){
						for (var func in proto){
							command.worker.prototype[func] = proto[func] ;	
						}
						command.worker.prototype.container = this.container;
						command.worker.prototype.terminate = this.kernel.terminate.bind(this.kernel);
						command.worker.prototype.logger = this.logger.bind(this) 
						command.worker.prototype.twig = this.container.get("templating");

						if ( command.commands ){
							command.worker.prototype.commands = command.commands ;
							store[this.name][name] = command.worker ; 
							//this.kernel.commands[name] = command.worker ;
						}else{
							throw new error("Command : "+name+"BAD FORMAT commands ");	
						}	
					}else{
						throw new error("Command : "+name+" WORKER COMMAND NOT FIND");
					}
				}
			});
		};

		getPublicDirectory (){
			try {
				var res  = new nodefony.finder( {
					path:this.path+"/Resources/public",
					exclude:/^docs$|^tests$/
				});
			}catch(e){
				this.logger(e,"ERROR");
			}
			return res.result;

		};

		registerEntities (){
			this.entityFiles = this.finder.result.findByNode("Entity") ;
			if (this.entityFiles.length()){
				this.entityFiles.getFiles().forEach( (file, index, array) => {
					var res = regEntity.exec( file.name );
					if ( res ){
						var name = res[1] ;
						var Class = this.loadFile( file.path);
						if (typeof Class.entity === "function" ){
							Class.entity.prototype.bundle = this;
							this.entities[name] = Class;
							this.logger("LOAD ENTITY : "+file.name ,"DEBUG")
						}else{
							this.logger("Register ENTITY : "+name +"  error ENTITY bad format")
						}
					}
				});	
			}
		};

		getEntity (name){
			if ( this.entities[name] ){
				return this.entities[name];
			}
			return null ;
		};

		getEntities (name){
			if ( this.entities ){
				return this.entities;
			}
			return null;
		};

		registerFixtures (){
			this.fixtureFiles = this.finder.result.findByNode("Fixtures") ;
			if (this.fixtureFiles.length()){
				this.fixtureFiles.getFiles().forEach( (file, index, array) => {
					var res = regFixtures.exec( file.name );
					if ( res ){
						var name = res[1];
						var Class = this.loadFile( file.path);
						if (typeof Class.fixture === "function" ){
							Class.fixture.prototype.bundle = this;
							this.fixtures[name] = Class;
							this.logger("LOAD FIXTURE : "+file.name ,"DEBUG")
						}else{
							this.logger("Register FIXTURE : "+name +"  error FIXTURE bad format")
						}
					}
				});	
			}
		};
		
		getFixture (name){
			if ( this.fixtures[name] ){
				return this.fixtures[name];
			}
			return null ;
		};

		getFixtures (){
			if ( this.fixtures ){
				return this.fixtures;
			}
			return null ;
		};

		get (name){
                	if (this.container)
                        	return this.container.get(name);
                	return null;
        	};

        	set (name, obj){
                	if (this.container)
                        	return this.container.set(name, obj);
                	return null;
        	};

		getParameters (){
			return this.container.getParameters.apply(this.container , arguments);
		};

		setParameters (){
			return this.container.setParameters.apply(this.container ,arguments);
		};

	};

	return Bundle;
});
