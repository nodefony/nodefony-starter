/*
 *
 *
 *
 */
nodefony.registerBundle ("security", function(){


	

	var security = function(kernel, container){

		// load bundle library 
		this.autoLoader.loadDirectory(this.path+"/core");

		this.mother = this.$super;
		this.mother.constructor(kernel, container);
		
	}

	return security
});



