/*
 *
 *
 *
 *
 *	 Users CLass
 *
 *
 *
 */

nodefony.register( "usersProvider", function(){


	
	var usersProvider = function(name, obj){
		this.name = name ;
		this.users = {};
		for (var user in obj ){
			this.createUser(user, obj[user].password, obj[user].enabled, obj[user].credentials, obj[user].blocked, obj[user].roles)
		}	
	};


	usersProvider.prototype.loadUserByUsername = function(userName){
		return this.users[userName] ;
	};

	
	
	usersProvider.prototype.createUser = function(username, password, enabled, credentials, blocked, roles){
		return this.users[username] = new nodefony.user(username, password, enabled, credentials, blocked, roles);	
	};

	usersProvider.prototype.getUserPassword = function(username){
		if ( this.users[username] ){
			return this.users[username].getPassword();
		}else{
			throw {
				status:401,
				message:"User : "+username+" not exist"
			}
			//throw new Error("User : "+username+" not exist" )
		}

	}

	return usersProvider;
});


