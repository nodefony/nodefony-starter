
nodefony.registerBundle ("realTime", function(){

	/**
	 *	The class is a **`realTime` BUNDLE** .
	 *	@module NODEFONY
	 *	@main NODEFONY
	 *	@class realTime
	 *	@constructor
	 *	@param {class} kernel
	 *	@param {class} container
	 *	
	 */
	var realTime = class realTime extends nodefony.Bundle {

		constructor (name, kernel, container){

			super(name, kernel, container);
			// load bundle library 
			this.autoLoader.loadDirectory(this.path+"/core");
		};
	};

	return realTime;
});
