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
				username: String,
				password: String,
				enabled: Boolean,
				credentialsNonExpired:String,
				accountNonLocked:String,
				email:	String,
				roles:	String,
    			}, {
        		methods: {
            			fullName: function () {
                			return this.name + ' ' + this.surname;
            			}
        		},
        		validations: {
				//email: ormService.engine.enforce.ranges.number(18, undefined, "under-age")
        		}
    		});


		return model ;
	};


	return {
		type:"ORM2",
		connection : "conn3",
		entity:user,
		association:{
			
		}

	};
})

