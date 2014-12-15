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

nodefony.register( "usersManager", function(){

	var User = function(username, password, enabled, credentials, blocked, roles){
		this.username = username;
		this.password = password;
		this.enabled = enabled;
		/*this.accountNonExpired = userNonExpired;*/
		this.credentialsNonExpired = credentials;
		this.accountNonLocked = blocked;
		this.roles = roles;
	};

	User.prototype.getName = function(){
		return 	this.username;
	};
	User.prototype.getPassword = function(){
		return 	this.password;
	};
	User.prototype.isEnable = function(){
		return this.enabled;
	};


	
	var usersManager = function(obj){
		this.users = {};
		for (var user in obj ){
			this.createUser(user, obj[user].password, obj[user].enabled, obj[user].credentials, obj[user].blocked, obj[user].roles)
		}	
	};
	
	usersManager.prototype.createUser = function(username, password, enabled, credentials, blocked, roles){
		this.users[username] = new User(username, password, enabled, credentials, blocked, roles);	
	};

	usersManager.prototype.getUserPassword = function(username){
		if ( this.users[username] ){
			return this.users[username].getPassword();
		}else{
			throw new Error("User : "+username+" not exist" )
		}

	}

	return usersManager;
});


