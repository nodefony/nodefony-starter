/*
 *  
 *   
 *    	ENTITY SESSIONS sequelize
 *     
 *      
 */
var Sequelize =require("sequelize");

nodefony.registerEntity("session", function(){

	var Session = function(db,  ormService ){
		var model = db.define("session", {
			session_id	: {type:  Sequelize.STRING, primaryKey: true },
			context		: {type:  Sequelize.STRING, defaultValue: "default" },
			Attributes	: {
				type:  Sequelize.TEXT,
				set:function( value ){
					return this.setDataValue('Attributes', JSON.stringify(value) );
				},
				get:function(value){
					var val  = this.getDataValue(value);	
					return  JSON.parse(val) ;
				}
			},
			flashBag	: {
				type:  Sequelize.TEXT,
				set:function( value ){
					return this.setDataValue('flashBag', JSON.stringify(value) );
				},
				get:function(value){
					var val  = this.getDataValue(value);	
					return  JSON.parse(val) ;
				}
			},
			metaBag		: {
				type:  Sequelize.TEXT,
				set:function( value ){
					return this.setDataValue('metaBag', JSON.stringify(value) );
				},
				get:function(value){
					var val  = this.getDataValue(value);	
					return  JSON.parse(val) ;
				}
			},
			createdAt	: { type: Sequelize.DATE, defaultValue:Sequelize.NOW }
		},{
			logging:false
		});

		ormService.listen(this, 'onReadyConnection', function(connectionName, db, ormService){
			if(connectionName == 'nodefony'){
				var User = ormService.getEntity("user");
				if ( User){
					//model.hasOne(User,{ foreignKey: 'id' });
				}else{
					throw "ENTITY ASSOCIATION User NOT AVAILABLE"
				}
			}
		});

		return model;
	};

	return {
		type:"sequelize",
		connection : "nodefony",
		entity:Session
	};
});



	
