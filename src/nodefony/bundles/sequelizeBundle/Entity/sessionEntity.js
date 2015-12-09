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
			logging:false,
			classMethods: {
				fetchAll:function(callback){
					this.findAll().then(function(result){
                                                return callback(null, result)
                                        }).catch(function(error){
                                                if (error)
                                                        return callback(error, null);
                                        });
				}
			}
		});

		ormService.listen(this, 'onReadyConnection', function(connectionName, db, ormService){
			if(connectionName == 'nodefony'){
				
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



	
