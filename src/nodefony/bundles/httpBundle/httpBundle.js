/*
 *
 *
 *
 *
 *
 */

nodefony.registerBundle ("http", function(){

	
	var httpServer  = function(kernel, container){

		// load bundle library 
		this.autoLoader.loadDirectory(this.path+"/core");

		this.mother = this.$super;
		this.mother.constructor(kernel, container);

		//this.waitBundleReady = true ; 

		//setTimeout(function(){
		//	this.fire("onReady")
		//}.bind(this),10000);
	}

	return httpServer;
});
