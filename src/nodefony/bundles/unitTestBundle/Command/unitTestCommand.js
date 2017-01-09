

nodefony.registerCommand("unitTest", function(){

	var unitTest = class unitTest extends nodefony.Worker {

		constructor (container, command/*, options*/){

			super( "unitTest", container, container.get("notificationsCenter") );

			var arg = command[0].split(":");
			command.shift();
			var bundles = this.kernel.bundles;

			this.serviceUnitTest = this.container.get("unitTest");
			this.serviceUnitTest.consoleMochaInit();
					
			var tests = [];

			if(arg[2] === 'all'){
				this.serviceUnitTest.getNodefonyTestFiles( null, tests);
				for(var bundle in bundles){
					this.serviceUnitTest.getBundlesTestFiles( bundle, null, tests);
				}
			} else if(arg[2] === 'bundle'){
				var bundleName = command[0];
				var testName = command[1];
				bundleName = bundleName.replace('Bundle', '');
				if (bundleName === "nodefony" ){
					this.serviceUnitTest.getNodefonyTestFiles( testName, tests);	
				}else{
					this.serviceUnitTest.getBundlesTestFiles( bundleName, testName , tests);
				}
			}

			this.listen(this, 'onReady', (/*kernel*/) => {
				switch ( arg[1] ){
					case "list" :
						switch( arg[2] ){
							case "all":
							case "bundle" : 
								var bundleName = '';
								for(var i = 0; i < tests.length ; i++){
									if ( bundleName !== tests[i].bundle){
										bundleName = tests[i].bundle;
										this.logger("★★★ BUNDLE : " + bundleName + " ★★★\n","INFO");
									}
									this.logger("       ‣ " + tests[i].name,"INFO");
								}
								this.logger("\x1b[0m\x1b[0m","INFO");
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
								this.serviceUnitTest.mochaAddTest(tests);
								this.serviceUnitTest.mochaRunTest( (failures) => {
									this.terminate(failures);
								});
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
			});
		}
	};	
	return {
		name: "unitTest",
		commands: {
			listAll: ["unitTest:list:all", "List all unit tests"],
			listBundle: ["unitTest:list:bundle bundleName", "List all bundle unit tests"],
			launchAll: ["unitTest:launch:all", "Launch all tests Example : ./console unitTest:launch:all"],
			launchBundle: ["unitTest:launch:bundle bundleName { testfile }", "Launch bundle tests Example: ./console unitTest:launch:bundle demoBundle responseTest.js"],
		},
		worker: unitTest
	};
});
