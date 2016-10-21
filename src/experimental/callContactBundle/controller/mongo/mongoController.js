
var MongoClient = require('mongodb').MongoClient;


nodefony.registerController("mongo", function(){

		/**
		 *	The class is a **`mongo` CONTROLLER** .
		 *	@module mongo
		 *	@main mongo
		 *	@class mongo
		 *	@constructor
		 *	@param {class} container   
		 *	@param {class} context
		 *	
		 */
		var mongoController = function(container, context){
			
			this.mother = this.$super;
			this.mother.constructor(container, context);
			
			
		};


		/**
		 *
		 *	@method indexAction
		 *
		 */
		mongoController.prototype.indexAction = function(){
		
			
			//console.log(this.get('mongodb'));
			
			/*this.get('mongodb').admin().listDatabases(function(err, dbs) {
				return this.renderAsync("callContactBundle:Mongo:Mongo.html.twig", {dbs: dbs});
			}.bind(this));*/
			
			/*this.get('mongodb').collections(function(err, collections){
				console.log(collections);
				if(err) {
					  throw "MONGODB GET COLLECTIONS ERROR";					 
				 }
				return this.renderAsync("callContactBundle:Mongo:Mongo.html.twig", {dbs: collections});
			}.bind(this))*/
			
			this.get('mongodb').collection('location', function(err, collection){
				//console.log(arguments);
				if(err) {
					console.log(err);
					  throw "MONGODB SELECT COLLECTION ERROR";					 
				}
				collection.find().toArray(function(err, suscribers) {
					console.log(suscribers);
					return this.renderAsync("callContactBundle:Mongo:Mongo.html.twig", {dbs: suscribers});
				}.bind(this));
				
				
				
			}.bind(this))
			
		};
		
		mongoController.prototype.sipLogAction = function(){		
			return this.getCollectionContent('acc');						
		};
		
		mongoController.prototype.connectHistoryAction = function(){		
			return this.getCollectionContent('location');						
		};
		
		mongoController.prototype.subscriberAction = function(){		
			return this.getCollectionContent('subscriber', function(logs){
				for(var i in logs){
					if(logs[i].password){
						delete logs[i].password;
					}
				}
				return this.renderJsonAsync({data: logs});
			}.bind(this));						
		};
		
		mongoController.prototype.getCollectionContent = function(collectionName, callback, callbackError){
			
			this.get('mongodb').collection(collectionName, function(err, collection){

				if(err) {
					var cbError = callbackError || this.callbackError;
					return cbError("MONGODB SELECT COLLECTION " + collectionName + " ERROR", err);						
				}
				
				collection.find().toArray(function(err, logs) {
				
					if(err) {
						var cbError = callbackError || this.callbackError;
						return cbError("MONGODB COLLECTION " + collectionName + " find() ERROR", err);						
					}
					
					return callback ? callback(logs) : this.renderJsonAsync({data: logs});
				}.bind(this));	
				
				
			}.bind(this))
		};
		
		mongoController.prototype.callbackError = function(title, message){
			return this.renderJsonAsync({
				title: "MONGODB SELECT COLLECTION location ERROR",
				message: err
			}, 500);
		}


		mongoController.prototype.sipRouterAction = function(){		
			var gw_ip = "93.20.94.2";
			var gw_port = "5060"
			var translate = {}
			for (var ele in this.query ){
				var buff = new Buffer(this.query[ele], 'hex');
				translate[ele] = buff.toString(); 	
			}
			console.log( translate );

			var routing = { 
  				"version": "1.0", 
  				"routing": "serial", 
  				"routes": [    { 
      					"uri": "sip:"+translate["rU"]+"@"+gw_ip+":"+gw_port,
      					"dst_uri": "sip:"+gw_ip+":"+gw_port,
      					"headers" : {
        					"extra" : "X-Ccapi-Domain: callcontact.net\r\n"
      					}
    				}  ]
			} 
			return this.renderJson(routing) ;
		};


		
		return mongoController;
});
