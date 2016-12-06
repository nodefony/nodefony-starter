/*
 *
 *
 *
 */
nodefony.registerBundle ("framework", function(){

	var framework = class framework extends nodefony.Bundle {

		constructor (name, kernel, container){

			super(name, kernel, container);
			// load bundle library 
			this.autoLoader.loadDirectory(this.path+"/core");

		}
	};

	return framework ;
});



