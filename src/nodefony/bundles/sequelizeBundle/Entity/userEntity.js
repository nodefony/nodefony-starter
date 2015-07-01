/*
 *
 *
 *	ENTITY USER
 *
 *
 */
var Sequelize =require("sequelize");


nodefony.registerEntity("user", function(){


	var User = function(db, ormService){
		var model = db.define("user", {
				id		:	{type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
				username	:	{type: Sequelize.STRING, unique: true, allowNull: false},
				password	:	Sequelize.STRING,
				enabled		:	{type: Sequelize.BOOLEAN, defaultValue:true},
				credentialsNonExpired:	{type: Sequelize.BOOLEAN, defaultValue:true},
				accountNonLocked:	{type: Sequelize.BOOLEAN, defaultValue:true},
				email		:	{type: Sequelize.STRING, unique: true},
				name		:	Sequelize.STRING,
				surname		:	Sequelize.STRING,
				lang		:	{type: Sequelize.STRING, defaultValue: "en_en" },
				roles		:	{type: Sequelize.STRING, defaultValue:  'ADMIN'}
    		},{
			classMethods: {
				getUserPassword : function(username, callback){
					this.findOne({where:{ username: username }}).then( function ( user) {
						if ( user )
							return callback(null, user.password)
						return callback({
							status:401,
				        		message:"User : " + username +" not Found"
						}, null)
					}).catch(function(error){
						if (error)
							return callback(err, null)
					});
				},	
				loadUserByUsername : function(username, callback){
					this.findOne({
  						where: {username: username}
					}).then(function( user) {
						return callback(null, user);
					}).catch(function(error){
						if (error)
							return callback(error, null);	
					});
				}
			}
		});

		ormService.listen(this, 'onReadyConnection', function(connectionName, db, ormService){
			if(connectionName == 'nodefony'){
				var session = ormService.getEntity("session");
				if ( session){
					model.hasMany(session, {  foreignKey: 'user_id', onDelete: 'CASCADE' });
				}else{
					throw "ENTITY ASSOCIATION session NOT AVAILABLE"
				}
			}
		});
		return model ;
	};

	return {
		type:"sequelize",
		connection : "nodefony",
		entity:User

	};
})

