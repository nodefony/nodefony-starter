
nodefony.registerBundle ("webRtc", function(){

	/**
	 *	The class is a **`webRtc` BUNDLE** .
	 *	@module NODEFONY
	 *	@main NODEFONY
	 *	@class webRtc
	 *	@constructor
	 *	@param {class} kernel
	 *	@param {class} container
	 *	
	 */
	var webRtc = function(kernel, container){

		// load bundle library 
		this.autoLoader.loadDirectory(this.path+"/core");

		this.mother = this.$super;
		this.mother.constructor(kernel, container);

		/*
		 *	If you want kernel wait webRtcBundle event <<onReady>> 
		 *
		 *      this.waitBundleReady = true ; 
		 */	
		
	};

	return webRtc;
});
