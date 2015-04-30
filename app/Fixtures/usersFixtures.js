
nodefony.registerFixture("users", function(){


	var userPromise = function(resolve, reject){

		var user = this.getEntity('user');
		user.clear();

		user.create([
			{
				username:"admin",
				name: "admin",
				surname: "admin",
				password: "f3084b5754aa27d3a9b86af28a569bc4"
			}
			], 
			function (err, items) {
				if (err){
					return reject(err) ;
				}	
				this.logger("FIXTRES ENTITY USERS", "INFO")
				for (var i=0 ; i< items.length ;i++){
					items[i].save(function (err) {
						this.logger("SAVE : "+ items[i].name, "INFO");
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
