/*
 *
 *
 *
 *
 */

nodefony.register( "user", function(){


	var User = class User {
		constructor(username, password, enabled, credentials, blocked, roles){
			this.roles = [];
			this.id = this.generateId();
			this.salt = null ; 
			this.username = username;
			this.password = password;
			this.enabled = enabled;
			this.credentialsNonExpired = credentials;
			this.accountNonLocked = blocked;
			this.addRole(roles);
		}

		generateId (){
			//var date = new Date().getTime();
			var buf = crypto.randomBytes(256);
			var hash = crypto.createHash('md5');
			return hash.update(buf).digest("hex");
		}

		getName (){
			return this.username;
		}

		getPassword (){
			return this.password;
		}

		isEnable (){
			return this.enabled;
		}

		addRole(role){
			this.roles.push(role);
		}
	};

	return User ;

});
