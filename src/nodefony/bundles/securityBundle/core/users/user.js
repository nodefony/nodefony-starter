/*
 *
 *
 *
 *
 */

nodefony.register( "user", function(){

	var User = function(username, password, enabled, credentials, blocked, roles){
		this.roles = [];
		this.id = this.generateId();
		this.salt = null ; 
		this.username = username;
		this.password = password;
		this.enabled = enabled;
		this.credentialsNonExpired = credentials;
		this.accountNonLocked = blocked;
		this.addRole(roles);
	};

	User.prototype.generateId = function(){
		var date = new Date().getTime();
		var buf = crypto.randomBytes(256);
		var hash = crypto.createHash('md5');
		return hash.update(buf).digest("hex");
	};

	User.prototype.getName = function(){
		return	this.username;
	};

	User.prototype.getPassword = function(){
		return	this.password;
	};

	User.prototype.isEnable = function(){
		return this.enabled;
	};


	User.prototype.addRole = function(role){
		this.roles.push(role)
	};

	return User ;

});
