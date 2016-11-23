
var Mocha = require('mocha'),
    fs = require('fs');

nodefony.registerCommand("unitTest", function(){

	var regFile = /^(.*)Test\.js$/;

	/*var getBundlesTestFiles = function(bundles, bundleName, testName, tests){
		if( bundles[bundleName].finder){
			var files = bundles[bundleName].finder.find({
				exclude:/^doc$|^public$|^Resources$/
			}).findByNode('tests').files;
			for(var i = 0; i < files.length; i++){
				if(files[i].type == 'File' && regFile.exec(files[i].name)){
					if ( testName ){
						if (files[i].name === testName  ){
							files[i].bundle = bundleName ;
							tests.push( files[i] );
						}
					}else{
						files[i].bundle = bundleName ;
						tests.push( files[i] );
					}
				}
			}
		}
	};*/

	var getBundlesTestFiles = function(bundles, bundleName, testName, tests){
		if( bundles[bundleName].finder){
			var finder = bundles[bundleName].finder.find({
				exclude:/^doc$|^public$|^Resources$/,
				match:regFile
			});
			if (finder.files.length ){
				for(var i = 0 ; i < finder.files.length ; i++){
					if ( testName ){
						if (finder.files[i].name === testName  ){
							finder.files[i].bundle = bundleName;
							tests.push( finder.files[i] );
						}
					}else{
						finder.files[i].bundle = bundleName;
						tests.push( finder.files[i] );
					}
				}
			}
		}
	};

	var getNodefonyTestFiles = function(rootDir, testName, tests){
		var finder = new nodefony.finder( {
			path:rootDir+"/vendors/nodefony",
			exclude:/^bundles$|^doc$/,
			match:regFile
		});
		if (finder.result.files.length ){
			for(var i = 0 ; i < finder.result.files.length ; i++){
				if ( testName ){
					if (finder.result.files[i].name === testName  ){
						finder.result.files[i].bundle = "nodefony";
						tests.push( finder.result.files[i] );
					}
				}else{
					finder.result.files[i].bundle = "nodefony";
					tests.push( finder.result.files[i] );
				}
			}
		}
	} 

	var unitTest = function(container, command, options){

		var arg = command[0].split(":");
		command.shift();
		this.kernel = this.container.get("kernel")
		var rootDir = this.container.get("kernel").rootDir;
		var bundles = this.container.get("kernel").bundles;

		var settingMocha = this.kernel.getBundle("unitTest").settings.mocha.nodefony ;

		this.mocha = new Mocha(settingMocha.console);
		
		var tests = [];

		if(arg[2] == 'all'){
			getNodefonyTestFiles.call(this, rootDir, null, tests)
			for(var bundle in bundles){
				getBundlesTestFiles.call(this, bundles, bundle, null, tests);
			}
		} else if(arg[2] == 'bundle'){
			var bundleName = command[0];
			var testName = command[1];
			bundleName = bundleName.replace('Bundle', '');
			if (bundleName === "nodefony" ){
				getNodefonyTestFiles.call(this, rootDir, testName, tests);	
			}else{
				getBundlesTestFiles.call(this, bundles, bundleName, testName , tests);
			}
		}

		this.kernel.listen(this, 'onReady', function(kernel){

			switch ( arg[1] ){
				case "list" :
					switch( arg[2] ){
						case "all":
						case "bundle" : 
							var bundleName = '';
							for(var i = 0; i < tests.length ; i++){
								if ( bundleName != tests[i].bundle){
									bundleName = tests[i].bundle;
									this.logger("★★★ BUNDLE : " + bundleName + " ★★★\n","INFO");
								}
								this.logger("       ‣ " + tests[i].name,"INFO");
							}
							this.logger("\033[0m\033[0m","INFO");
							break;
					}
					this.terminate(1);
					break;

				case "launch" :

					switch( arg[2 ]){

						case "single" :								
						case "all":
						case "bundle" : 
							//console.log(tests)
							for(var i = 0; i < tests.length; i++){
								this.mocha.addFile( tests[i].path );
							}

							this.mocha.run( function(failures){
								this.terminate(failures);
							}.bind(this));

							break;
						default:
							this.showHelp();
							this.terminate(1);
					}

					break;

				default:
					this.logger(new Error("unitTest   "+command[1] +" bad format"), "ERROR");
					this.showHelp();
					this.terminate(1);

			}

		}.bind(this));
	};	

	return {
		name: "unitTest",
		commands: {
			listAll: ["unitTest:list:all", "List all unit tests"],
			listBundle: ["unitTest:list:bundle bundleName", "List all bundle unit tests"],
			launchAll: ["unitTest:launch:all", "Launch all tests"],
			launchBundle: ["unitTest:launch:bundle bundleName { testfile }", "Launch bundle tests"],
		},
		worker: unitTest
	};

});
