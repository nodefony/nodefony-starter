var Mocha = require('mocha') ;


nodefony.registerService("unitTest", function(){


	var regFile = /^(.*)Test\.js$/;


	var service = class service {

		constructor (kernel, options){
			this.kernel = kernel ;
			this.bundles = kernel.bundles; 

		}

		consoleMochaInit (){
			
			this.settingMocha = this.kernel.getBundle("unitTest").settings.mocha.nodefony;
			this.mocha = new Mocha(this.settingMocha.console);
			this.mocha.suite.on('pre-require',  (context)  => {
				context.kernel = this.kernel ;
			})
		}

		mochaAddTest (tests){
			for(var i = 0; i < tests.length; i++){
				this.mocha.addFile( tests[i].path );
			}
		}

		mochaRunTest (callback){
			return this.mocha.run(  callback )
		}

		getBundlesTestFiles ( bundleName, testName, tests){
			if( this.bundles[bundleName].finder){
				var finder = this.bundles[bundleName].finder.find({
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

		getNodefonyTestFiles ( testName, tests){
			var finder = new nodefony.finder( {
				path:this.kernel.rootDir+"/vendors/nodefony",
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
		}; 
	}; 

	return service ;
});

