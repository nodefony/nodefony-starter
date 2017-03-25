/*
 *
 *
 *
 *
 *
 *
 */
const Getopt = require('node-getopt');
const npm = require("npm");
const npmi = require('npmi');

nodefony.register("console", function(){

	/*var createNpmDependenciesArray = function (packageFilePath) {
    		var p = require(packageFilePath);
    		if (!p.dependencies) { return []; }

    		var deps = [];
    		for (var mod in p.dependencies) {
        		deps.push(mod + "@" + p.dependencies[mod]);
    		}
    		return deps;
	};*/

	var createNpmiDependenciesArray = function (packageFilePath, opt) {
    		var p = require(packageFilePath);
    		if (!p.dependencies) { return [];}

    		var deps = [];
    		for (var mod in p.dependencies) {
			var options = {
				name: mod,    // your module name
				version:  p.dependencies[mod],       // expected version [default: 'latest']
			};
        		deps.push(nodefony.extend({}, opt, options));
    		}
    		return deps;
	};

	
	var generateHelp = function(obj, str){
		str+= "\x1B[32mnodefony\x1B[0m\n";
		str +=  "\t\x1B[32m"+ "npm:list"+"\x1B[0m							 List all installed packages \n";
		str +=  "\t\x1B[32m"+ "npm:install"+"\x1B[0m							 Install all framework packages\n";
		for (var ele in obj){
			if (obj[ele].name ){
				str += "\x1B[32m"+ obj[ele].name+"\x1B[0m"; 
			}
			for (var cmd in obj[ele].task ){
				str +=  "\t\x1B[32m"+ obj[ele].task[cmd][0]+"\x1B[0m";
				var length =  obj[ele].task[cmd][0].length;
				var size = 65 - length ;
				for (var i = 0 ; i< size ; i++) { str +=" "; }
				str += obj[ele].task[cmd][1]+"\n";
			}
		}
		return str;
	};

	

	var settingsSysLog = {
		//rateLimit:100,
		//burstLimit:10,
		moduleName:"CONSOLE",
		defaultSeverity:"INFO"
	};

	var Console = class Console extends nodefony.appKernel {

		constructor (environment, debug, loader , settings){
			// App Kernel 
			super("CONSOLE", environment, debug, loader, nodefony.extend( settings , {
				onBoot:function(){
					if ( process.argv[2] && process.argv[2] === "npm:list" ){
						this.listPackage(this.rootDir+"/package.json");
					}	
				},
				syslog:settingsSysLog
			}));

			this.commands = {};
			this.getOptsTab = [];
			
			if ( process.argv[2] && process.argv[2] === "npm:install" ||  process.argv[2] && process.argv[2] === "npm:list" ){
				return ;
			}
			// MANAGE CLI OPTIONS
			this.listen(this, "onPostRegister",function(){
				try {
					var ret = this.loadCommand();
					if (ret){
						this.terminate(1);
					}
				}catch(e){
					this.logger(e, "ERROR");
					this.terminate(1);
					return ;
				}
				process.nextTick( ()=> {
					try {	
						this.matchCommand();
					}catch(e){
						this.logger(e,  "ERROR");
						this.terminate(1);
					}
				});
			});
		}

		initializeLog ( settings ) {
			this.cli.listenSyslog(this.syslog, this.debug);
		}

		/**
	 	*	@method logger
         	*/
		logger (pci, severity, msgid,  msg){
			if (! msgid) { msgid = "CONSOLE " ;}
			return this.syslog.logger(pci, severity, msgid,  msg);
		}

		/**
	 	*	register Bundle 
	 	*	@method registerBundles 
	 	*	@param {String} path
	 	*	@param {Function} callbackFinish
         	*/
		registerBundles (path, callbackFinish, nextick){
			
			var func = ( Path ) => {
				try{
					new nodefony.finder( {
						path:Path,
						recurse:false,
						onFile:(file) => {
							if (file.matchName(this.regBundle)){
								try {
									if ( process.argv[2] && process.argv[2] === "npm:install" ){
										var name = this.getBundleName(file.name);
										this.InstallPackage(name, file);	
									}else{
										this.loadBundle( file);
									}
								}catch(e){
									console.trace(e);
									this.logger(e, "ERROR");
								}	
							}
						},
						onFinish:callbackFinish || this.initializeBundles.bind(this)
					});
				}catch(e){
					this.logger(e, "ERROR")
					this.logger("GLOBAL CONFIG REGISTER : ","INFO");
					this.logger(this.configBundle,"INFO");
					var gene = this.readGeneratedConfig();
					if ( gene ){
						this.logger("GENERATED CONFIG REGISTER file ./config/GeneratedConfig.yml : ","INFO");
						this.logger( gene  , "INFO" );
					}
				}
			};
			
			if ( nextick === undefined ){
				process.nextTick( () =>{
					func.call(this, path );
				});
				//func.apply(this)
				//process.nextTick( func.bind(this) );	
			}else{
				func.call(this, path );
			}
		}

		listPackage (conf){
			conf = require(conf);
			npm.load(conf, (error) => {
				if (error){
					this.logger(error,"ERROR");
					this.terminate(1);
					return ;
				}
				npm.commands.ls([], true, (error, data) =>{
					var ele = [];
					for (var pack in data.dependencies){
						//this.kernel.logger(data.dependencies[pack].name + " : " + data.dependencies[pack].version + " description : " + data.dependencies[pack].description , "INFO");
						ele.push([
							data.dependencies[pack].name,
							data.dependencies[pack].version,
							data.dependencies[pack].description
						]);
					}
					this.logger( "NPM NODEFONY PACKAGES", "INFO")
					var headers = [
						"NAME", 
						"VERSION",
						"DESCRIPTION"
					];
					this.cli.displayTable(ele, {
						head: headers, 
						colWidths :[30,10,100]
					});
					this.terminate(0);
				});
			});
		}
		
		/*installPackage (name, file){
			try {
				var conf = new nodefony.fileClass(file.dirName+"/package.json");
				var config = require(conf.path);
				npm.load( config ,(error) => {
					if (error){
						this.logger(error, "ERROR");
						this.terminate(1);
					}
					var dependencies = createNpmDependenciesArray(conf.path) ;
					this.logger("Install Package BUNDLE : "+ name,"INFO");
					npm.commands.install(dependencies,  (er, data) => {
						if (er){
 				       			this.logger(er, "ERROR", "SERVICE NPM BUNDLE " + name);
							this.terminate(1);
							return ;
						}
						this.loadBundle(file);	
					});
				});
			}catch(e){
				if (e.code !== "ENOENT"){
					this.logger("Install Package BUNDLE : "+ name +":"+e,"ERROR");
					throw e ;
				}
			}
		}*/

		InstallPackage (name, file){
			try {
				var conf = new nodefony.fileClass(file.dirName+"/package.json");
				var options = {
    					path: '.',              // installation path [default: '.']
    					forceInstall: false,    // force install if set to true 
    					npmLoad: {              // npm.load(options, callback): this is the "options" given to npm.load()
        					loglevel: 'silent'  // [default: {loglevel: 'silent'}]
    					}
				};
				if ( this.debug && this.environment ==="dev"){
					options.npmLoad.loglevel = "verbose" ;	
				}

				var dependencies = createNpmiDependenciesArray(conf.path, options) ;


				this.logger("NPMI USE NPM VERSION : " + npmi.NPM_VERSION);
				for (var i= 0 ; i < dependencies.length ; i++){
					let nodeDep =  dependencies[i].name + "@" + dependencies[i].version ;
					this.logger("LOAD BUNDLE " + name +" dependence : " + nodeDep);	
					npmi( dependencies[i], ( err, result) => {
    						if (err) {
        						if (err.code === npmi.LOAD_ERR){
								this.logger(err.message, "ERROR", "NMPI load error");
        						}else if (err.code === npmi.INSTALL_ERR) {
								this.logger(err.message, "ERROR", "NMPI install error");
							}
							this.logger("Try to install in mode cli   : npm install  "+nodeDep, "ERROR", "NMPI install error");
							return ;
							//this.terminate();
    						}
						// installed
						if ( ! result ){
							this.logger(nodeDep+' Already installed  in nodefony');
						}else{
							this.logger(nodeDep+' installed successfully in nodefony');
						}
					});
				}
				//this.terminate();

			}catch(e){
				console.trace(e);
				if (e.code !== "ENOENT"){
					this.logger("Install Package BUNDLE : "+ name +":"+e,"WARNING");
				}
			}
		}

		loadCommand (){
			this.stop = false;
			for ( let bundle in this.bundles ){
				this.bundles[bundle].registerCommand( this.commands );
			}
			this.getopts =  this.getopt(this.getOptsTab);
			
			
			this.helpString = this.getopts.getHelp();
			this.helpString += "\nCommands : [arguments]\n";

			var bundles = {};
			for ( let bundle in this.commands ){
				if ( ! bundles[bundle] ){
					bundles[bundle] = { 
						name :"\x1B[32m"+bundle+"\n\x1B[0m",
						task:[]
					};
				}

				var commands = this.commands[bundle];
				for (var cmd in commands ){
					var command = commands[cmd].prototype.commands;
					for (var task in command){
						bundles[bundle].task.push( command[task] );
					}
				}
			}
			this.getopts.setHelp( generateHelp(bundles, this.helpString) );
			//this.getopts.setHelp(this.helpString);
			return this.stop;
		}
		
		matchCommand (){
			this.cliParse = this.getopts.parseSystem();
			var ret = null;
			if (this.cliParse.argv.length){
				var ele = this.cliParse.argv[0].split(":");
				if (ele.length){
					var cmd = ele[0];
					for (var bundle in this.commands  ){
						if (cmd in this.commands[bundle]){
							var worker = this.commands[bundle][cmd];
							if (worker){
								try {
									ret = new worker(this.container, this.cliParse.argv , this.cliParse.options );
								}catch(e){
									throw e ;
								}
							}else{
								this.showHelp();
								throw new Error("Worker : ")+ cmd +" not exist" ;
							}
							return ret;
						}
					}
					this.showHelp();
					throw new Error("COMMAND : ")+ this.cliParse.argv +" not exist" ;
				}else{
					this.showHelp();
					throw new Error("BAD FORMAT ARGV : ") + this.cliParse.argv ;
				}
			}
			return this.showHelp();
		}

		showHelp (){
			return this.getopts.showHelp();
		}
			
		/*
 	 	*
 	 	*
 	 	*
 	 	*   Getopt arguments options
	 	*	'=':   has argument
	 	*	'[=]': has argument but optional
	 	*	'+':   multiple option supported
 	 	*
 	 	*
 	 	*
 	 	*/
		getopt (tab){
			tab.push(['h' , 'help']);
			tab.push(['v' , 'version', 'show version']);
			var res = new Getopt(tab).bindHelp();
			res.errorFunc = (error) => {
				this.logger(error);
				res.showHelp();
				this.stop = true;
				this.terminate(1);
			};
			return res;
		}

		/*readBundleDirectory (path){
			var finder = new nodefony.finder({
				path:path,
				recurse:false,
				onDirectory:(result) => {
					if (result){
						this.registerBundles(result.path, this.initializeBundles.bind(this))
					}
				}
			})	
		};*/

		startTimer (name){
			this.startTime = new Date();	
			this.logger(" BEGIN TIMER : " + name, "INFO");
		
		}

		stopTimer (name){
			if (this.startTime){
				this.stopTime = new Date();
				this.time = (this.stopTime.getTime() - this.startTime.getTime());
				this.logger( "TIMER "+ name + " execute in : "+ this.time/1000 + " s" ,"INFO" )	;
			}else{
				return ;
			}
			this.startTime = null;
		}
	};

	return  Console;
});
