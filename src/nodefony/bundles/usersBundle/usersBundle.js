
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
	var users = class  users extends nodefony.Bundle{
		constructor(name, kernel, container){

			super(name, kernel, container);
			// load bundle library 
			this.autoLoader.loadDirectory(this.path+"/core");

			/*
		 	*	If you want kernel wait usersBundle event <<onReady>> 
		 	*
		 	*      this.waitBundleReady = true ; 
		 	*/	
			
		};
	};

	return users;
});
