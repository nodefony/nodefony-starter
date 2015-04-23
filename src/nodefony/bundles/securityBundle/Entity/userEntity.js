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
				username	: {type: 'text', unique: true},
				password	: String,
				enabled		: Boolean,
				credentialsNonExpired: Boolean,
				accountNonLocked: Boolean,
				email		: String,
				name		: String,
				surname		: String,
				roles		: String
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
				return callback(err, user[0].password)
			})
			return callback ;	
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
		entity:user,
		association:{
			
		}

	};
})

