/*
 *
 *
 *
 */
nodefony.registerBundle ("security", function(){

	var security = class security extends nodefony.Bundle {
		constructor(kernel, container){
			super(kernel, container);

			nodefony.security = {
				factory:{},
				providers:{},
				tokens:{}		  
			};

			// load bundle library 
			this.autoLoader.loadDirectory(this.path+"/core");
		};
	};
	return security;
});



