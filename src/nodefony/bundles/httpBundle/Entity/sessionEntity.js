/*
 *  *
 *   *
 *    *	ENTITY SESSION
 *     *
 *      *
 *       */

nodefony.registerEntity("session", function(){

	var Session = function(db,  ormService ){
		var model = db.define("session", {
			session_id	: {type: "text", unique: true },
			context		: {type: "text", default: "default" },
			attributes	: Object,
			flashBag	: Object,
			metaBag		: Object,
			createdAt	: Date
			},{ 
				hooks: {
					beforeCreate: function() {
						if(this.createdAt === null) { this.createdAt = new Date(); }
					}
				}
		});

		/*ormService.listen(this, 'onReadyConnection', function(connectionName, db, ormService){
 			if( connectionName == 'nodefony' ){
 		 		var user = ormService.getEntity('user');
 		 		if ( user ){
 		 			//model.hasOne("user", user);
 		 		}else{
 		 			throw "ENTITY ASSOCIATION USER NOT AVAILABLE"
 		 		}
 		 	}
 		 });*/
		return model;
	};

	return {
		type:"ORM2",
			connection : "nodefony",
			entity:Session
	};
});

