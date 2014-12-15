/*
 *
 *
 *
 *
 *
 */

nodefony.registerCommand("minification",function(){

	var writefile = function(fileName, data){
		fs.writeFileSync(fileName, data );
	}
	
	var mergeCompileFiles =function(config){
	
		if (config.system.jsPath){
			var paths = config.system.jsPath.split(" ");
		}else{
			var paths = [];	
		}
		Array.prototype.unshift.call(paths, "src/library/");
		var line = "";
		for (var i=0 ; i< paths.length ; i++){
			line+=" -p " + paths[i]
		}
		return line ;
	};

	var Minification = function(container, command, options){
		var arg = command[0].split(":");
		//Array.prototype.shift.call(arg)
		this.kernel = container.get("kernel");
		switch ( arg[0] ){
			case "minification" : 
				this.config = this.container.getParameters("kernel");
				this.buidDirectory = process.cwd()+"/"+this.config.system.buildDirectory;
				if ( ! command[1] ){
					this.compilater = this.config.system.compilater ;
				}else{
					this.compilater = command[1];	
				}
				this.kernel.startTimer("minification");
				this.calcdeps(this.config, function(error, stdout, stderr){
					//console.log(stdout);
					writefile("./tmp/deps.js", stdout);
					if (this.compilater){
						this.compile(this.compilater, function(error, stdout, stderr){
							this.logger(stderr);
							//console.log(stdout);
							writefile(this.buidDirectory+"/"+this.config.system.nameFile, stdout)
							this.logger("CREATE nodefony LIBRARY : "+ this.config.system.nameFile+ " show in directory :" +this.buidDirectory+"/"+this.config.system.nameFile);
							this.kernel.stopTimer("minification");
							this.terminate();
						}.bind(this));
					}
				}.bind(this))

			break;
			default:
				this.logger(new Error(command[0] + " command error"),"ERROR")
				this.showHelp();
				this.terminate();
		}
	};

	Minification.prototype.calcdeps = function(config, callback){
		this.line = "";
		for(var i = 0; i < config.library.require.length ; i++ ){
			for(var ele in config.library.require[i] ){
				var name = ele
				var version = config.library.require[i][ele];
			}
			this.line += 'nodefony.require("'+name+'" );\n' ;
			this.logger("nodefony BUILDER NEED DEPENDENCES ===> "+name);
		}
		writefile("./tmp/require.js", this.line)
		
		var exec = require('child_process').exec ;
		this.line = mergeCompileFiles(this.config);		
		var cmdLine = "./tools/google/calcdeps.py -i ./tmp/require.js "+ this.line +" -o deps"	
		var deps = exec(cmdLine, callback);

	}

	Minification.prototype.compile = function(options, callback){
		if (this.config.system.state !== "prod"){
			var cmdLine = "./tools/google/calcdeps.py -i ./tmp/require.js -p src/library/ -o script"
		}else{
			var level = this.config.system.compilaters[options];	
			//var line = mergeCompileFiles(this.config);		
			switch (options){
				case "google" :
					this.logger("Minification with tool : "+ options );
					var cmdLine = "./tools/google/calcdeps.py -i ./tmp/require.js  -c ./tools/google/compiler.jar"+ this.line +"  -o compiled  -f --compilation_level -f "+	level
 				break;	
				case "yahoo" :
					this.logger("Minification with tool : "+ options );
					var cmdLine = "./tools/google/calcdeps.py -i ./tmp/require.js  -c ./tools/yahoo/yuicompressor-2.4.2.jar "+ this.line +" -o compiled  -f --type -f js -f --charset -f utf-8  -f "+level
 				break;	
				default:
					this.logger(new Error("BUILDER MINIFICATION ERROR COMPILATER NAME :"+options), "ERROR" );
					return ;
			}
		}
		var exec = require('child_process').exec ;
		var deps = exec(cmdLine, callback);
	}

	
	return {
		name:"minification",
		commands:{
			compile:["minification:compile [compilateur]" ,"Minificaton javascript compilateur : google / yahoo"],
		},
		worker:Minification
	}

});
