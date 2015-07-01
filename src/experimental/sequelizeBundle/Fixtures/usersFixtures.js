nodefony.registerFixture("users", function(){

	var userPromise = function(resolve, reject){

		 
		var user = this.getEntity("user");
		var tab = [
			{
				username:"admin",
				name: "administrator",
				surname: "nodefony",
				password: "f3084b5754aa27d3a9b86af28a569bc4",
				roles:"ADMIN"
			},{
				username:"cci",
				name: "christophe",
				surname: "CAMENSULI",
				password: "df6b3f921393a0d4ea273f044694c39c",
				lang:"fr_fr",
				roles:"USER"
			}];



		var connection = this.getConnection("nodefony");
		switch ( connection.options.dialect ){
		
			case "mysql" : 
				connection.query('SET FOREIGN_KEY_CHECKS = 0')
				.then(function(){
			 		return user.sync({ force: true });
				})
				.then(function(){
			    		console.log('Database synchronised.');
					for (var i = 0 ; i<tab.length; i++){
						var res = user.create(tab[i],{isNewRecord:true})
						res.then(function(User){
							this.logger("ADD USER : " +User.username,"INFO")
						}.bind(this)).done(function(count,error, result){
							if (error){
								this.logger(error);
								reject(error);	
								return ;	
							}
							if (count+1 == tab.length ){
								resolve(result)
							}
						}.bind(this, i))	
					}
				}.bind(this))
				.then(function(){
			    		return connection.query('SET FOREIGN_KEY_CHECKS = 1')
				})
				.catch( function(error){
					this.logger(error);
					reject(error)
				}.bind(this));
			break;
			case "sqlite":
				user.sync({force:true}).then(function() {
					for (var i = 0 ; i<tab.length; i++){
						var res = user.create(tab[i],{isNewRecord:true})
						res.then(function(User){
							this.logger("ADD USER : " +User.username,"INFO")
						}.bind(this)).done(function(count,error, result){
							if (error){
								this.logger(error);
								reject(error);	
								return ;	
							}
							if (count+1 == tab.length ){
								resolve(result)
							}
						}.bind(this, i))	
					}
					
				}.bind(this)).catch(function(error){
					this.logger(error);
					reject(error)
				}.bind(this)).done(function(){
				
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

})
