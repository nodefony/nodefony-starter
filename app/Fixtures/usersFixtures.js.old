
nodefony.registerFixture("users", function(){


	var userPromise = function(resolve, reject){

		var user = this.getEntity('user');
		user.clear();

		user.create([
			{
				username:"admin",
				name: "administrator",
				surname: "nodefony",
				password: "f3084b5754aa27d3a9b86af28a569bc4",
				roles:["ADMIN"]
			},{
				username:"cci",
				name: "christophe",
				surname: "CAMENSULI",
				password: "df6b3f921393a0d4ea273f044694c39c",
				lang:"fr_fr",
				roles:["ADMIN","USER"]
			}], 
			function (err, items) {
				if (err){
					return reject(err) ;
				}	
				this.logger("FIXTRES ENTITY USERS", "INFO")
				for (var i=0 ; i< items.length ;i++){
					items[i].save(function (err) {
						this.logger("SAVE : "+ items[i].username, "INFO");
					}.bind(this));	
				}
				resolve(items)
		}.bind(this));
	}

	return {
		type:"ORM2",
		connection : "nodefony",
		entity: "user",
		fixture: userPromise
	}

})
