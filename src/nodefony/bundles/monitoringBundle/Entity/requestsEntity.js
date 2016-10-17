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
				remoteAddress	:	{type:Sequelize.STRING },
				userAgent	:	{type:Sequelize.STRING },
				url		:	{type: Sequelize.TEXT },
				route		:	{type:Sequelize.STRING },
				method		:	{type:Sequelize.STRING },
				state		:	{type:Sequelize.STRING },
				protocole	:	{type:Sequelize.STRING },
				username	:	{type:Sequelize.STRING },
				data		:	{type: Sequelize.TEXT },
    		},{
			classMethods: {
				
			}
		});

		/*ormService.listen(this, 'onReadyConnection', function(connectionName, db, ormService){
			if(connectionName == 'nodefony'){
				
			}
		});*/
		return model ;
	};

	return {
		type:"sequelize",
		connection : "nodefony",
		entity:requests

	};
})

