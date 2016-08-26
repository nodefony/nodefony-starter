
var MongoClient = require('mongodb').MongoClient;

nodefony.registerBundle ("callContact", function(){

	/**
	 *	The class is a **`callContact` BUNDLE** .
	 *	@module Demo
	 *	@main Demo
	 *	@class callContact
	 *	@constructor
	 *	@param {class} kernel
	 *	@param {class} container
	 *	
	 */
	var callContact = function(kernel, container){

		// load bundle library 
		this.autoLoader.loadDirectory(this.path+"/core");

		this.mother = this.$super;
		this.mother.constructor(kernel, container);

		/*
		 *	If you want kernel wait callContactBundle event <<onReady>> 
		 *
		 *      this.waitBundleReady = true ; 
		 */	
		//console.log(this.settings);
		this.waitBundleReady = true ; 
	
		this.startMongoDbService(this.settings.api[this.settings.defaultApi].mongodbUrl);		
	};
	
	callContact.prototype.startMongoDbService = function(url){
		//console.log("INITIALISATION MONGO DB : " + url);
		MongoClient.connect(url, function(err, db) {
			this.set('mongodb', db);
			this.fire("onReady", this);
		}.bind(this));
	};
	
	callContact.prototype.closeMongoDbService = function(url){
		var mongodb = this.get('mongodb');
		if(mongodb){
			mongodb.close();
		}
	};
	

	return callContact;
});
