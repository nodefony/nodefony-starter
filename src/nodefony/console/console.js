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


	
	var settingsSysLog = {
		//rateLimit:100,
		//burstLimit:10,
		moduleName:"CONSOLE",
		defaultSeverity:"INFO"
	};

	var Console = function(environment, debug, loader){
		this.commands = {};
		this.workerSyslog = this.initWorkerSyslog(settingsSysLog);
		this.getOptsTab = [];

		// App Kernel 
		this.appKernel = this.$super;
		this.appKernel.constructor("CONSOLE", environment, debug, loader, {
			onPreRegister:function(){
				console.log("		      \033[34m"+this.type+" \033[0mVersion : "+ this.settings.system.version +" PLATFORM : "+this.platform+"  PROCESS PID : "+process.pid+"\n");
			},
			onBoot:function(){
				if ( process.argv[2] && process.argv[2] === "npm:list" ){
					this.listPackage(this.rootDir+"/package.json")
				}	
			}

		});

		/*
		 *
 		 *       READ GLOBAL CONSOLE CONFIG
 	 	 */
                /*this.readConfigDirectory("./config", function(result){
 	 	        if (result){
 	 	                this.settings = nodefony.extend(true, this.settings, result)
 	 	        }
 	 	}.bind(this));*/

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
				this.logger(e);
				this.terminate(1);
				return ;
			}
			process.nextTick(function () {
				try {
					var res = this.matchCommand();
				}catch(e){
					this.logger(e);
					this.terminate(1);
				}
			}.bind(this))
		});
		
		
	}.herite(nodefony.appKernel)


	/**
	 *	register Bundle 
	 *	@method registerBundles 
	 *	@param {String} path
	 *	@param {Function} callbackFinish
         */
	Console.prototype.registerBundles = function(path, callbackFinish, nextick){
		var func = function(){
			try{
				var finder = new nodefony.finder( {
					path:path,
					recurse:false,
					onFile:function(file){
						if (file.matchName(this.regBundle)){
							try {
								//this.loadBundle(file);
								if ( process.argv[2] && process.argv[2] === "npm:install" ){
									var name = this.getBundleName(file.name);
									this.InstallPackage(name, file);	
								}else{
									this.loadBundle( file)
								}
							}catch(e){
								this.workerSyslog.logger(e, "ERROR");
							}	
						}
					}.bind(this),
					onFinish:callbackFinish || this.initializeBundles.bind(this)
				});
			}catch(e){
				this.workerSyslog.logger(e, "ERROR");
			}
		}
		if ( nextick === undefined ){
			process.nextTick( func.bind(this) );	
		}else{
			func.apply(this)	
		}
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
			table.addRow(
				ele[pack].name,
				ele[pack].version,
				ele[pack].desc
			);	
		}
		//table.removeBorder()
		console.log(table.render());	
	};



	Console.prototype.listPackage = function(conf){
		var conf = require(conf);
		npm.load(conf, function(error){
			if (error){
				this.workerSyslog.logger(error,"ERROR");
				this.terminate();
				return ;
			}
			npm.commands.ls([], true, function(error, data){
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
			}.bind(this))
		}.bind(this))
	};

	
	Console.prototype.installPackage = function(name, file){
		try {
			var conf = new nodefony.fileClass(file.dirName+"/package.json");
			var config = require(conf.path);
			npm.load( config ,function(error){
				if (error){
					this.workerSyslog.logger(error, "ERROR");
					this.terminate();
				}
				var dependencies = createNpmDependenciesArray(conf.path) ;
				this.workerSyslog.logger("Install Package BUNDLE : "+ name,"INFO");
				npm.commands.install(dependencies,  function(er, data){
					if (er){
 				       		this.workerSyslog.logger(er, "ERROR", "SERVICE NPM BUNDLE " + name);
						this.terminate();
						return ;
					}
					this.loadBundle(file);	
				}.bind(this));
			}.bind(this))

		}catch(e){
			if (e.code != "ENOENT"){
				this.workerSyslog.logger("Install Package BUNDLE : "+ name +":"+e,"ERROR");
				throw e ;
			}
		}
	};

	Console.prototype.InstallPackage = function(name, file){
		try {
			var conf = new nodefony.fileClass(file.dirName+"/package.json");
			var options = {
    				path: '.',              // installation path [default: '.']
    				forceInstall: false,    // force install if set to true 
    				npmLoad: {              // npm.load(options, callback): this is the "options" given to npm.load()
        				loglevel: 'silent'  // [default: {loglevel: 'silent'}]
    				}
			};

			var dependencies = createNpmiDependenciesArray(conf.path, options) ;

			for (var i= 0 ; i < dependencies.length ; i++){
				//console.log(dependencies[i])
				this.workerSyslog.logger("INSTALL BUNDLE " + name +" dependence : " + dependencies[i].name);	
				var nodeDep =  dependencies[i].name ;
				var nodeDepVersion = dependencies[i].version ;
				npmi(dependencies[i], function (err, result) {
    					if (err) {
        					if (err.code === npmi.LOAD_ERR)    
							this.workerSyslog.logger(err.message, "ERROR", "NMP load error");
        					else if (err.code === npmi.INSTALL_ERR) 
							this.workerSyslog.logger(err.message, "ERROR", "NMP install error");
						this.terminate();
    					}
					// installed
					this.workerSyslog.logger(nodeDep+'@'+nodeDepVersion+' installed successfully in nodefony');
					if ( i === dependencies.length-1){
						this.loadBundle(file);
					}
				}.bind(this));

			}
			//this.terminate();

		}catch(e){
			if (e.code != "ENOENT"){
				this.workerSyslog.logger("Install Package BUNDLE : "+ name +":"+e,"ERROR");
				throw e ;
			}
		}
	};



	Console.prototype.initWorkerSyslog = function(settings){
		var red, blue, reset;
		red   = '\033[31m';
		blue  = '\033[34m';
		reset = '\033[0m';
		
		var syslog =  new nodefony.syslog(settings);

		// CRITIC ERROR
		syslog.listenWithConditions(this,{
			severity:{
				data:"ERROR"
			}		
		},function(pdu){
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
		},function(pdu){
			console.log(pdu.payload)
		});
		return syslog;
	};

	var generateHelp = function(obj, str){
		str+= "\033[32mnodefony\033[0m\n"
		str +=  "\t\033[32m"+ "npm:list"+"\033[0m							 List all installed packages \n";
		str +=  "\t\033[32m"+ "npm:install"+"\033[0m							 Install all framework packages\n";
		for (var ele in obj){
			if (obj[ele].name ){
				str += "\033[32m"+ obj[ele].name+"\033[0m"; 
			}
			for (var cmd in obj[ele].task ){
				str +=  "\t\033[32m"+ obj[ele].task[cmd][0]+"\033[0m";
				var length =  obj[ele].task[cmd][0].length;
				var size = 65 - length ;
				for (var i = 0 ; i< size ; i++) str +=" ";
				str +=  obj[ele].task[cmd][1]+"\n";
			}
		}
		return str;
	};

	Console.prototype.loadCommand = function(){
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
					name :"\033[32m"+bundle+"\n\033[0m",
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
	
	/*
 	 *
 	 */
	var syslogger = function(){
		this.workerSyslog.logger.apply(this.workerSyslog, arguments)
	};
	

	Console.prototype.matchCommand = function(){
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
							worker.prototype.logger = syslogger.bind(this) ;
							try {
								ret = new worker(this.container, this.cli.argv , this.cli.options )
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
	Console.prototype.getopt = function(tab){
		tab.push(['h' , 'help']);
		tab.push(['v' , 'version', 'show version']);
		var res = new Getopt(tab).bindHelp();
		res.errorFunc = function(error){
			this.logger(error)
			res.showHelp();
			this.stop = true;
			this.terminate();
		}.bind(this);
		return res;
	};

	Console.prototype.readBundleDirectory = function(path){
		var finder = new nodefony.finder({
			path:path,
			recurse:false,
			onDirectory:function(result){
				if (result){
					this.registerBundles(result.path, this.initializeBundles.bind(this))
				}
			}.bind(this)
		})	
	};

	Console.prototype.startTimer = function(name){
		this.startTime = new Date();	
		this.logger(" BEGIN TIMER : " + name, "INFO");
	
	};

	Console.prototype.stopTimer = function(name){
		if (this.startTime){
			this.stopTime = new Date();
			this.time = (this.stopTime.getTime() - this.startTime.getTime());
			this.logger( "TIMER "+ name + " execute in : "+ this.time/1000 + " s" ,"INFO" )	;
		}else{
			return ;
		}
		this.startTime = null;
	};

	return  Console;
});
