/*
 *
 *
 *
 *
 *
 */

nodefony.registerBundle ("http", function(){

	
	var httpServer  = class httpServer extends nodefony.Bundle {

		constructor (name, kernel, container){


			super(name, kernel, container );

			this.autoLoader.loadDirectory(this.path+"/core");

			//this.waitBundleReady = true ; 

		}
	};

	return httpServer;
});
