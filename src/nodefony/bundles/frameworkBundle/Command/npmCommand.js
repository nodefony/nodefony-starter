/*
 *
 *
 *
 *
 *
 *
 */


var AsciiTable = require('ascii-table');
var npm = require("npm");


nodefony.registerCommand("npm",function(){

	var NPM = function(container, command, options ){
		this.kernel = container.get("kernel");
		var arg = command[0].split(":");
		//Array.prototype.shift.call(arg)
		switch ( arg[1] ){
			case "list" : 
				this.listPackage(this.kernel.rootDir+"/package.json")	
			break;
			case "install":
				this.installPackage()
				//this.terminate();
			break;
			default:
				this.showHelp()
				this.terminate();
		}
	};


	NPM.prototype.displayTable = function(titre, ele){
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



	NPM.prototype.listPackage = function(conf){
		var conf = require(conf);
		npm.load(conf, function(error){
			if (error){
				this.logger(error,"ERROR");
				this.terminate();
				return ;
			}
			npm.commands.ls([], true, function(error, data){
				//this.kernel.logger( "			\033[34m NODEFONY NPM INSTALLED PACKAGE LIST\033[0m","INFO")
				var ele = {};
				for (var pack in data.dependencies){
					//this.kernel.logger(data.dependencies[pack].name + " : " + data.dependencies[pack].version + " description : " + data.dependencies[pack].description , "INFO");	
					ele[pack] = {
						name:data.dependencies[pack].name,
						version:data.dependencies[pack].version,
						desc:data.dependencies[pack].description
					};
				}
				this.displayTable("NPM NODEFONY PACKAGES", ele);
				this.terminate();
			}.bind(this))
		}.bind(this))
	};



	var createNpmDependenciesArray = function (packageFilePath) {
    		var p = require(packageFilePath);
    		if (!p.dependencies) return [];

    		var deps = [];
    		for (var mod in p.dependencies) {
        		deps.push(mod + "@" + p.dependencies[mod]);
    		}
    		return deps;
	};

	/*
 	 *
 	 *	NPM Install Packages
 	 */
	var npmInstallPackages = function(conf, bundle){
		this.logger("BUNDLE : "+ bundle.name,"INFO");
		var config = require(conf);
		npm.load( config ,function(error){
			var dependencies = createNpmDependenciesArray(conf) ;
			npm.commands.install(dependencies,  function(er, data){
				if (er){
 				       	this.logger(er, "ERROR", "SERVICE NPM BUNDLE " + bundle.name);
					this.terminate();
					return ;
				}
				/*if (data){
					for (var i = 0 ; i< data.length ; i++){
						//this.logger(data[i],"INFO", "SERVICE NPM BUNDLE " + bundleName)
						//this.packages[];
					}
				}*/
				this.terminate();
			}.bind(this));
		}.bind(this))
	};
	


	NPM.prototype.installPackage = function(){
		this.packages = {};
		for (var name in this.kernel.bundles ){
			this.kernel.bundles[name].finder.find( {
				match:"package.json",
				recurse:false,
				onFinish:function(error, result){
					if ( result.files.length ){
						npmInstallPackages.call(this, result.files[0].path, this.kernel.bundles[name]);	
					}
				}.bind(this)
			} );
		}
	};

	return {
		name:"npm",
		commands:{
			list:["npm:list" ,"List all installed packages "],
			install:["npm:install" ,"install all framework packages"],
		},
		worker:NPM
	}
});
