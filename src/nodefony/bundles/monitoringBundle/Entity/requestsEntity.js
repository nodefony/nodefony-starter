/*
 *
 *
 *	ENTITY REQUESTS
 *
 *
 */
var Sequelize =require("sequelize");


nodefony.registerEntity("requests", function(){


	var requests = function(db, ormService){
		var model = db.define("requests", {
				id		:	{type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
				data		:	{type: Sequelize.TEXT },
    		},{
			classMethods: {
				
			}
		});

		ormService.listen(this, 'onReadyConnection', function(connectionName, db, ormService){
			if(connectionName == 'nodefony'){
				
			}
		});
		return model ;
	};

	return {
		type:"sequelize",
		connection : "nodefony",
		entity:requests

	};
})

