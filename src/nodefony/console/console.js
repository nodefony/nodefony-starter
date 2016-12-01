/*
 *
 *
 *
 *
 *
 *
 */
var Getopt = require('node-getopt');
var AsciiTable = require('ascii-table');
var npm = require("npm");
var npmi = require('npmi');


nodefony.register("console", function(){

	var createNpmDependenciesArray = function (packageFilePath) {
    		var p = require(packageFilePath);
    		if (!p.dependencies) return [];

    		var deps = [];
    		for (var mod in p.dependencies) {
        		deps.push(mod + "@" + p.dependencies[mod]);
    		}
    		return deps;
	};

	var createNpmiDependenciesArray = function (packageFilePath, opt) {
    		var p = require(packageFilePath);
    		if (!p.dependencies) return [];

    		var deps = [];
    		for (var mod in p.dependencies) {
			var options = {
				name: mod,    // your module name
				version:  p.dependencies[mod],       // expected version [default: 'latest']
			}
        		deps.push(nodefony.extend({}, opt, options));
    		}
    		return deps;
	};

	
	var generateHelp = function(obj, str){
		str+= "\x1B[32mnodefony\x1B[0m\n"
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
				for (var i = 0 ; i< size ; i++) str +=" ";
				str +=  obj[ele].task[cmd][1]+"\n";
			}
		}
		return str;
	};

	var displayTable = function(titre, ele){
		var table = new AsciiTable(titre);
		table.setHeading(
			"NAME", 
			"VERSION",
			"DESCRIPTION"
		);
		table.setAlignCenter(3);
		table.setAlignCenter(11);
		
		for (var pack in ele){
			if ( ele[pack].desc ){
				var lgt = ele[pack].desc.length > 110 ? " ..." : "" ;
			}else{
				var lgt = "" ;
			}
			if (  ele[pack].desc ) {
				var desc = ele[pack].desc.substring(0,110) + lgt
			}else{
				var desc = "" ; 	
			}
			table.addRow(
				ele[pack].name,
				ele[pack].version,
				desc
			);	
		}
		//table.removeBorder()
		console.log(table.render());	
	};


	var settingsSysLog = {
		//rateLimit:100,
		//burstLimit:10,
		moduleName:"CONSOLE",
		defaultSeverity:"INFO"
	};
	
	var logConsoleNodefony = function(syslog){
		
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
			if ( pdu.msgid === "SERVER WELCOME"){
				console.log(   blue + "              "+reset + " "+ pdu.payload);	
				return ;
			}
			var date = new Date(pdu.timeStamp) ;
			console.log( date.toDateString() + " " +date.toLocaleTimeString()+ " " + blue + pdu.severityName +" "+ reset + green  + pdu.msgid + reset +" "+ " : "+ pdu.payload);	
		});
	};


	var Console = class Console extends nodefony.appKernel {

		constructor (environment, debug, loader , settings){
			// App Kernel 
			super("CONSOLE", environment, debug, loader, {
				onBoot:function(){
					if ( process.argv[2] && process.argv[2] === "npm:list" ){
						this.listPackage(this.rootDir+"/package.json")
					}	
				}
			});
			this.syslog = this.initializeLog(settingsSysLog);

			this.commands = {};
			this.getOptsTab = [];
			
			if ( process.argv[2] && process.argv[2] === "npm:install" ||  process.argv[2] && process.argv[2] === "npm:list" ){
				return ;
			}
			// MANAGE CLI OPTIONS
			this.listen(this, "onBoot",function(){
				try {
					var ret = this.loadCommand();
					if (ret)
						this.terminate(1);
				}catch(e){
					this.logger(e, "ERROR");
					this.terminate(1);
					return ;
				}
				process.nextTick( ()=> {
					try {
						var res = this.matchCommand();
					}catch(e){
						this.logger(e,  "ERROR");
						this.terminate(1);
					}
				})
			});
			
			
		};

		initializeLog ( settings ) {
			var syslog =  new nodefony.syslog(settingsSysLog);
			logConsoleNodefony.call(this, syslog);	
			return syslog ;
		}

			/**
	 	*	@method logger
         	*/
		logger (pci, severity, msgid,  msg){
			if (! msgid) msgid = "CONSOLE "
			return this.syslog.logger(pci, severity, msgid,  msg);
		};


		/**
	 	*	register Bundle 
	 	*	@method registerBundles 
	 	*	@param {String} path
	 	*	@param {Function} callbackFinish
         	*/
		registerBundles (path, callbackFinish, nextick){
			//console.log(arguments)
			
			var func = ( Path ) => {
				try{
					var finder = new nodefony.finder( {
						path:Path,
						recurse:false,
						onFile:(file) => {
							if (file.matchName(this.regBundle)){
								try {
									if ( process.argv[2] && process.argv[2] === "npm:install" ){
										var name = this.getBundleName(file.name);
										this.InstallPackage(name, file);	
									}else{
										this.loadBundle( file)
									}
								}catch(e){
									console.trace(e)
									this.logger(e, "ERROR");
								}	
							}
						},
						onFinish:callbackFinish || this.initializeBundles.bind(this)
					});
				}catch(e){
					console.log(e)
					this.logger(e, "ERROR");
				}
			}
			
			if ( nextick === undefined ){
				process.nextTick( () =>{
					func.call(this, path );
				})
				//func.apply(this)
				//process.nextTick( func.bind(this) );	
			}else{
				func.call(this, path )	
			}
		};

		listPackage (conf){
			var conf = require(conf);
			npm.load(conf, (error) => {
				if (error){
					this.logger(error,"ERROR");
					this.terminate();
					return ;
				}
				npm.commands.ls([], true, (error, data) =>{
					var ele = {};
					for (var pack in data.dependencies){
						//this.kernel.logger(data.dependencies[pack].name + " : " + data.dependencies[pack].version + " description : " + data.dependencies[pack].description , "INFO");	
						ele[pack] = {
							name:data.dependencies[pack].name,
							version:data.dependencies[pack].version,
							desc:data.dependencies[pack].description
						};
					}
					displayTable("NPM NODEFONY PACKAGES", ele);
					this.terminate();
				})
			})
		};
		
		installPackage (name, file){
			try {
				var conf = new nodefony.fileClass(file.dirName+"/package.json");
				var config = require(conf.path);
				npm.load( config ,(error) => {
					if (error){
						this.logger(error, "ERROR");
						this.terminate();
					}
					var dependencies = createNpmDependenciesArray(conf.path) ;
					this.logger("Install Package BUNDLE : "+ name,"INFO");
					npm.commands.install(dependencies,  (er, data) => {
						if (er){
 				       			this.logger(er, "ERROR", "SERVICE NPM BUNDLE " + name);
							this.terminate();
							return ;
						}
						this.loadBundle(file);	
					});
				})

			}catch(e){
				if (e.code != "ENOENT"){
					this.logger("Install Package BUNDLE : "+ name +":"+e,"ERROR");
					throw e ;
				}
			}
		};

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


				for (var i= 0 ; i < dependencies.length ; i++){
					var nodeDep =  dependencies[i].name + "@" + dependencies[i].version ;
					this.logger("INSTALL BUNDLE " + name +" dependence : " + nodeDep);	
					npmi(dependencies[i],  function (nodeDep, err, result) {
    						if (err) {
        						if (err.code === npmi.LOAD_ERR)    
								this.logger(err.message, "ERROR", "NMPI load error");
        						else if (err.code === npmi.INSTALL_ERR) 
								this.logger(err.message, "ERROR", "NMPI install error");
							this.logger("Try to install in mode cli   : npm install  "+nodeDep, "ERROR", "NMPI install error");
							return ;
							//this.terminate();
    						}
						// installed
						this.logger(nodeDep+' installed successfully in nodefony');
					}.bind(this, nodeDep));

				}
				//this.terminate();

			}catch(e){
				console.trace(e);
				if (e.code != "ENOENT"){
					this.logger("Install Package BUNDLE : "+ name +":"+e,"WARNING");
				}
			}
		};

		/*initWorkerSyslog (settings){
			var red, blue, reset;
			red   = '\x1B[31m';
			blue  = '\x1B[34m';
			reset = '\x1B[0m';
			
			var syslog =  new nodefony.syslog(settings);

			// CRITIC ERROR
			syslog.listenWithConditions(this,{
				severity:{
					data:"ERROR"
				}		
			},(pdu) => {
				if (typeof  pdu.payload === 'object') {
    					if ( pdu.payload.message) {
						console.log("\x1B[46m\n\n    "+ util.inspect( pdu.payload.message) +"\n"+ reset);
						return ;
    					}
    					if (pdu.payload.stack) {
						console.log("\x1B[46m\n\n    "+ util.inspect( pdu.payload.stack) +"\n"+ reset);
						return ;
    					}
  				}
				console.log("\x1B[46m\n\n    "+ util.inspect( pdu.payload) +"\n"+ reset);
			});
			// INFO DEBUG
			var data ;
			this.debug ? data = "INFO,DEBUG" : data = "INFO" ;
			syslog.listenWithConditions(this,{
				severity:{
					data:data
				}		
			},(pdu) => {
				console.log(pdu.payload)
			});
			return syslog;
		};*/

		
		loadCommand (){
			this.stop = false;
			for ( var bundle in this.bundles ){
				this.bundles[bundle].registerCommand( this.commands );
			}
			this.getopts =  this.getopt(this.getOptsTab);
			
			
			this.helpString = this.getopts.getHelp();
			this.helpString += "\nCommands : [arguments]\n";

			var bundles = {};
			for (var bundle in this.commands ){
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
						bundles[bundle]["task"].push( command[task] );
					}
				}
			}
			this.getopts.setHelp( generateHelp(bundles, this.helpString) );
			//this.getopts.setHelp(this.helpString);
			return this.stop;
		};
		
		matchCommand (){
			this.cli = this.getopts.parseSystem();
			var ret = null;
			if (this.cli.argv.length){
				var ele = this.cli.argv[0].split(":");
				if (ele.length){
					var cmd = ele[0];
					for (var bundle in this.commands  ){
						if (cmd in this.commands[bundle]){
							var worker = this.commands[bundle][cmd];
							if (worker){
								worker.prototype.showHelp = this.getopts.showHelp.bind(this.getopts) ;
								worker.prototype.logger = this.logger.bind(this) ;
								try {
									ret = new worker(this.container, this.cli.argv , this.cli.options );
								}catch(e){
									this.logger(""+e, "ERROR");
								}
							}else{
								this.getopts.showHelp();
							}
							return ret;
						}
					}
					this.logger(new Error("COMMAND : ")+ cmd +" not exist" );
					this.getopts.showHelp();
				}else{
					this.logger(new Error("BAD FORMAT ARGV : ") + this.cli.argv );
					this.getopts.showHelp();
				}
			}
			return ret;
		};
			
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
				this.logger(error)
				res.showHelp();
				this.stop = true;
				this.terminate();
			};
			return res;
		};

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
		
		};

		stopTimer (name){
			if (this.startTime){
				this.stopTime = new Date();
				this.time = (this.stopTime.getTime() - this.startTime.getTime());
				this.logger( "TIMER "+ name + " execute in : "+ this.time/1000 + " s" ,"INFO" )	;
			}else{
				return ;
			}
			this.startTime = null;
		};
	};

	return  Console;
});
