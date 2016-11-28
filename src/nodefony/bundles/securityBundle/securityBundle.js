/*
 *
 *
 *
 */
nodefony.registerBundle ("security", function(){

	var security = class security extends nodefony.Bundle {
		constructor(kernel, container){
			nodefony.security = {
				factory:{},
				providers:{},
				tokens:{}		  
			};

			super(kernel, container);

			// load bundle library 
			this.autoLoader.loadDirectory(this.path+"/core");
		};
	};
	return security;
});



