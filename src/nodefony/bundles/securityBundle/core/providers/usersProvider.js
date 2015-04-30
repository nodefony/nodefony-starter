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


	usersProvider.prototype.loadUserByUsername = function(userName, callback){
		if ( this.users[userName] ) 
			return callback(null, this.users[userName])
		return callback({
				status:401,
				message:"User : "+username+" not exist"
			},null) ;
	};

	
	
	usersProvider.prototype.createUser = function(username, password, enabled, credentials, blocked, roles){
		return this.users[username] = new nodefony.user(username, password, enabled, credentials, blocked, roles);	
	};

	usersProvider.prototype.getUserPassword = function(username, callback){
		if ( this.users[username] ){
			callback( null, this.users[username].getPassword() );
		}else{
			callback( {
				status:401,
				message:"User : "+username+" not exist"
			}, null );
		}

	}

	return usersProvider;
});


