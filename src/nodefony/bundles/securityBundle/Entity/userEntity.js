/*
 *
 *
 *	ENTITY USER
 *
 *
 */


nodefony.registerEntity("user", function(){


	var user = function(db, ormService){
		var model = db.define("user", {
				id		: {type: 'serial', key: true},
				username	: {type: 'text', unique: true, required:true},
				password	: String,
				enabled		: {type: 'boolean', defaultValue:true},
				credentialsNonExpired: {type: 'boolean', defaultValue:true},
				accountNonLocked: {type: 'boolean', defaultValue:true},
				email		: {type: 'text', unique: true},
				name		: String,
				surname		: String,
				lang		: {type: 'text', defaultValue: "en_en" },
				roles		: {type: 'object', defaultValue: ["USER"]}
    			}, {
        		methods: {
            			fullName: function () {
                			return this.name + ' ' + this.surname;
            			}
        		},
        		validations: {
        		}
    		});


		model.getUserPassword = function(username, callback){
			this.find({ username: username }, function (err, user) {
				if (err)
					return callback(err, null)	
				if ( user.length )
					return callback(null, user[0].password)
				return callback({
					status:401,
				        message:"User : " + username +" not Found"
				}, null)
			})
		};	

		model.loadUserByUsername = function(username, callback){
			this.find({ username: username }, function (err, user) {
				if (err)
					return callback(err, null);	
				return callback(null, user[0]);
			})
		};

		ormService.listen(this, 'onReadyConnection', function(connectionName, db, ormService){
			if(connectionName == 'nodefony'){
				var session = ormService.getEntity('session');
				if (  session){
					model.hasMany("session", session);
				}else{
					throw "ENTITY ASSOCIATION session NOT AVAILABLE"
				}
			}
		});
		return model ;
	};

	


	return {
		type:"ORM2",
		connection : "nodefony",
		entity:user

	};
})

