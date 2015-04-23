
nodefony.registerFixture("users", function(){


	var userPromise = function(resolve, reject){

		var user = this.getEntity('user');
		user.clear();

		user.create([
			{
				username:"admin",
				name: "admin",
				surname: "admin",
				password: "admin"
			}
			], 
			function (err, items) {
				if (err){
					//this.logger(err)
					return reject(err) ;
				}	
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
