/*
 *
 *
 *
 *
 *
 *
 */
var Getopt = require('node-getopt');

nodefony.register("console", function(){

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
		this.appKernel.constructor("CONSOLE", environment, debug, loader);

		/*
		 *
 		 *       READ GLOBAL CONSOLE CONFIG
 	 	 */
                this.readConfigDirectory("./config", function(result){
 	 	        if (result){
 	 	                this.settings = nodefony.extend(true, this.settings, result)
 	 	        }
 	 	}.bind(this));

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
					console.log("\x1B[41m\n\n    "+ util.inspect( pdu.payload.message) +"\n"+ reset);
					return ;
    				}
    				if (pdu.payload.stack) {
					console.log("\x1B[41m\n\n    "+ util.inspect( pdu.payload.stack) +"\n"+ reset);
					return ;
    				}
  			}
			console.log("\x1B[41m\n\n    "+ util.inspect( pdu.payload) +"\n"+ reset);
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
		var cli = this.getopts.parseSystem();
		var ret = null;
		if (cli.argv.length){
			var ele = cli.argv[0].split(":");
			if (ele.length){
				var cmd = ele[0];
				for (var bundle in this.commands  ){
					if (cmd in this.commands[bundle]){
						var worker = this.commands[bundle][cmd];
						if (worker){
							worker.prototype.showHelp = this.getopts.showHelp.bind(this.getopts) ;
							worker.prototype.logger = syslogger.bind(this) ;
							try {
								ret = new worker(this.container, cli.argv , cli.options )
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
			       this.logger(new Error("BAD FORMAT ARGV : ") + cli.argv );
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
