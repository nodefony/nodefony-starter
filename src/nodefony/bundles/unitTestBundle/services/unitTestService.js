var Mocha = require('mocha') ;


nodefony.registerService("unitTest", function(){


	var regFile = /^(.*)Test\.js$/;


	var service = function(kernel, options){
		this.kernel = kernel ;
		this.bundles = kernel.bundles; 

	}

	service.prototype.consoleMochaInit = function(){
		
		this.settingMocha = this.kernel.getBundle("unitTest").settings.mocha.nodefony;
		this.mocha = new Mocha(this.settingMocha.console);
		this.mocha.suite.on('pre-require', function (context) {
			context.kernel = this.kernel ;
		}.bind(this))
	}

	service.prototype.mochaAddTest = function(tests){
		for(var i = 0; i < tests.length; i++){
			this.mocha.addFile( tests[i].path );
		}
	}

	service.prototype.mochaRunTest = function(callback){
		return this.mocha.run(  callback )
	}

	service.prototype.getBundlesTestFiles = function( bundleName, testName, tests){
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

	service.prototype.getNodefonyTestFiles = function( testName, tests){
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
	} 

	return service ;
});

