/*
 *
 *
 *	ENTITY SESSION
 *
 *
 */

nodefony.registerEntity("session", function(){

	var Session = function(db,  ormService ){
    		var model = db.define("session", {
				last_access	: Date,
				creation_time	: {type: "date", default: Date.now},
				data		: Buffer
    			}, {
        		methods: {
            			fullName: function () {
                			return this.name + ' ' + this.surname;
            			}
        		},
        		validations: {
				age: ormService.engine.enforce.ranges.number(18, undefined, "under-age")
        		}
    		});

		
		ormService.listen(this, 'onReadyConnection', function(connectionName, db, ormService){
			//console.log(ormService.getEntity('user'));
			if(connectionName == 'conn3'){
				var user = ormService.getEntity('user');
				if (  user){
					model.hasOne("user", user);
				}else{
					throw "ENTITY ASSOCIATION USER NOT AVAILABLE"
				}

			}
		});
		return model;
	};


	return {
		type:"ORM2",
		connection : "conn3",
		entity:Session,
		association:{
			
		}
	};
});

