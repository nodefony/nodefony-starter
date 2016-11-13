
nodefony.registerFixture("users", function(){

	var userPromise = function(resolve, reject){
		 
		var user = this.getEntity("user");

		var tab = [{
				username:"anonymous",
				name: "",
				surname: "",
				displayName: "Anonymous",
				password: "",
				lang:"en_en",
				roles:"ANONYMOUS"
			},{
				username:"admin",
				name: "administrator",
				surname: "nodefony",
				displayName: "administrator",
				password: "admin",
				roles:"ADMIN"
			},{
				username:"1000",
				name: "User",
				surname: "1000",
				displayName: "1000",
				password: "1234",
				lang:"fr_fr",
				roles:"USER"
			},{
				username:"2000",
				name: "User",
				surname: "2000",
				displayName: "2000",
				password: "1234",
				lang:"fr_fr",
				roles:"USER"
			},{
				username:"3000",
				name: "User",
				surname: "3000",
				displayName: "3000",
				password: "1234",
				lang:"fr_fr",
				roles:"USER"
			}];

		var connection = this.getConnection("nodefony");
		switch ( connection.options.dialect ){
		
			case "mysql" : 
				connection.query('SET FOREIGN_KEY_CHECKS = 0')
				.then(function(){
			 		return user.sync({ force: false });
				})
				.then(function(User){
					this.logger("Database synchronised  " ,"INFO");
					
					return Sequelize.Promise.map( tab, function(obj) {
						return User.findOrCreate({where: {username: obj.username}, defaults:obj});
					})
					
				}.bind(this))
				.spread(function(ele){
					for (var i = 0 ; i< arguments.length ;i++){
						if (arguments[i][1]){
							this.logger("ADD USER : " +arguments[i][0].username,"INFO");
						}else{
							this.logger("ALREADY EXIST USER : " +arguments[i][0].username,"INFO");
						}
					}
				}.bind(this))
				.then(function(){
			    		connection.query('SET FOREIGN_KEY_CHECKS = 1');
				})
				.catch( function(error){
					this.logger(error);
					reject(error)
				}.bind(this))
				.done(function(error, result){
					resolve("userEntity");
				});
			break;
			case "sqlite":
				/*user.sync({force:false})

				.then(function(){
					this.logger("Database synchronised  " ,"INFO");
					
					return Sequelize.Promise.map( tab, function(obj) {
						return user.findOrCreate({where: {username: obj.username}, defaults:obj});
					})
					
				}.bind(this))
				.spread(function(ele){
					for (var i = 0 ; i< arguments.length ;i++){
						if (arguments[i][1]){
							this.logger("ADD USER : " +arguments[i][0].username,"INFO");
						}else{
							this.logger("ALREADY EXIST USER : " +arguments[i][0].username,"INFO");
						}
					}
				}.bind(this))
				.catch(function(error){
					this.logger(error);
					reject(error)
				}.bind(this))
				.done(function(){
					resolve("userEntity");
				}.bind(this))*/

				//connection.query('SELECT * FROM users  ')
				connection.query('PRAGMA foreign_keys = 0  ')
				.then(function(){
			 		return user.sync({ force: false });
				})
				.then(function(User){
					this.logger("Database synchronised  " ,"INFO");
					return Sequelize.Promise.map( tab, function(obj) {
						return User.findOrCreate({where: {username: obj.username}, defaults:obj});
					})
				}.bind(this))
				.spread(function(ele){
					for (var i = 0 ; i< arguments.length ;i++){
						if (arguments[i][1]){
							this.logger("ADD USER : " +arguments[i][0].username,"INFO");
						}else{
							this.logger("ALREADY EXIST USER : " +arguments[i][0].username,"INFO");
						}
					}
				}.bind(this))
				.catch(function(error){
					this.logger(error);
					reject(error)
				}.bind(this))
				.done(function(){
					resolve("userEntity");
				}.bind(this))
			break;
		}
	}

	return {
		type:"sequelize",
		connection : "nodefony",
		entity: "user",
		fixture: userPromise
	}
});
