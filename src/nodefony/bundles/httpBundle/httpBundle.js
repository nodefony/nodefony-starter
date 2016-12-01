/*
 *
 *
 *
 *
 *
 */

nodefony.registerBundle ("http", function(){

	
	var httpServer  = class httpServer extends nodefony.Bundle {

		constructor (kernel, container){

			// load bundle library 

			super(kernel, container );

			this.autoLoader.loadDirectory(this.path+"/core");

			//this.waitBundleReady = true ; 

			//setTimeout(function(){
			//	this.fire("onReady")
			//}.bind(this),10000);
		}
	};

	return httpServer;
});
