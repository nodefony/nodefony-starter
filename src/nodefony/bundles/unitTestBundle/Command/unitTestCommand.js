
var Mocha = require('mocha'),
    chai = require('chai'),
    fs = require('fs');

nodefony.registerCommand("unitTest", function(){

	var getTestFiles = function(bundles, bundleName, testName){

		var tests = [];
		var regFile = /^.*\.js$/;
		bundleName = bundleName.replace('Bundle', '');
		if(bundles[bundleName] && bundles[bundleName].finder){
			var dirBundle = bundles[bundleName].finder.path[0].dirName;
			var files = bundles[bundleName].finder.find({exclude:/^docs$|^public$/}).findByNode('tests').files;
			for(var i = 0; i < files.length; i++){
				if(files[i].type == 'File' && regFile.exec(files[i].name)){
					tests.push({
						bundle: bundleName,
						name: files[i].name,
						dir: files[i].dirName.split('/tests/')[1] || '',
						dirBundle: dirBundle
					});
				}
			}
		}

		return tests;
	};

	var isExistTest = function(file){
		if(!fs.existsSync(file)){
			this.logger(file + " doesn't exist", "ERROR");
			return false;
		}
		return true;
	};

	var unitTest = function(container, command, options){

		var arg = command[0].split(":");
		command.shift();
		this.kernel = this.container.get("kernel")
		var rootDir = this.container.get("kernel").rootDir;
		var bundles = this.container.get("kernel").bundles;

		this.mocha = new Mocha({
			ui: 'bdd',
			reporter: 'spec',
			globals:["kernel"]
		});

		var tests = [];

		if(arg[2] == 'all'){
			for(var bundle in bundles){
				tests = tests.concat(getTestFiles.call(this, bundles, bundle));
			}
		} else if(arg[2] == 'bundle' || arg[2] == 'single'){
			if(arg[2] == 'single'){
				var bundleName = command[0].split(':')[0];
				var testName = command[0].split(':')[1];
			} else {
				var bundleName = command[0];
			}

			tests = getTestFiles.call(this, bundles, bundleName, testName || undefined);
		}

		this.kernel.listen(this, 'onReady', function(kernel){

			switch ( arg[1] ){

				case "list" :

					switch( arg[2 ]){
						case "all":
						case "bundle" : 
							var bundleName = '';
							for(var i = 0; i < tests.length; i++){

								if(bundleName != tests[i].bundle){
									bundleName = tests[i].bundle;
									this.logger("\033[46m\033[37m\n   ★★★ BUNDLE : " + bundleName + " ★★★\n","DEBUG");
								}
								this.logger("       ‣ " + tests[i].name,"DEBUG");
							}
							this.logger("\033[0m\033[0m","DEBUG");
							break;
					}
					this.terminate(1);
					break;

				case "launch" :

					switch( arg[2 ]){

						case "single" :								
						case "all":
						case "bundle" : 

							for(var i = 0; i < tests.length; i++){
								this.mocha.addFile(tests[i].dirBundle + '/' + tests[i].bundle + 'Bundle/tests/' + (tests[i].dir != '' ? tests[i].dir + '/' : '') + tests[i].name);
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
			launchBundle: ["unitTest:launch:bundle bundleName", "Launch bundle tests"],
			launchSingle: ["unitTest:launch:single bundleName testfile", "Launch single test"]

		},
		worker: unitTest
	};

});
