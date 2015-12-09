
nodefony.registerBundle ("users", function(){

	/**
	 *	The class is a **`users` BUNDLE** .
	 *	@module App
	 *	@main App
	 *	@class users
	 *	@constructor
	 *	@param {class} kernel
	 *	@param {class} container
	 *	
	 */
	var users = function(kernel, container){

		// load bundle library 
		this.autoLoader.loadDirectory(this.path+"/core");

		this.mother = this.$super;
		this.mother.constructor(kernel, container);

		/*
		 *	If you want kernel wait usersBundle event <<onReady>> 
		 *
		 *      this.waitBundleReady = true ; 
		 */	
		
	};

	return users;
});
