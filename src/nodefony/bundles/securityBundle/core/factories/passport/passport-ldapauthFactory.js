/*
 *
 *
 *	PASSPORT DIGEST  FACTORY
 *
 *
 */

try {
	var passport = require('passport');
	var LdapStrategy = require('passport-ldapauth');

	var nodefonyPassport = require("passport-nodefony");
}catch(e){
	console.error(e);
}



nodefony.register.call(nodefony.security.factory, "passport-ldapauth",function(){

	var defaultWrapper = function(){
		return {
			username	: '',
			name		: '',
			surname		: '',
			email		: '',
			password	: this.generatePassWd(),
			provider	: "ldap",
			roles		: "USER",	
			displayName	: '',
			url		: '',
			image		: ''
		}
	}


	var ISDefined = function(ele){
		if (ele !== null && ele !== undefined )
			return true
		return false;
	}

	var parseParameterString = function(str, value){
		switch( nodefony.typeOf(str) ){
			case "string" :
				return parseParameterString.call(this,str.split(".") , value);
			break;
			case "array" :
				switch(str.length){
					case 1 :
						var ns = Array.prototype.shift.call(str);
						if ( ! this[ns] ){
							this[ns] = value;
						}else{
							if ( ISDefined(value) ){
								this[ns] = value ;
							}else{
								return this[ns];
							}
						}
						return value ;
					break;
					default :
						var ns = Array.prototype.shift.call(str);
						if ( ! this[ns] && ISDefined(value) ){
							this[ns] = {};
						}
						return parseParameterString.call(this[ns], str, value);	
				}
			break;
			default:
				return false;
		}
	};

	var Factory = function(contextSecurity,  settings){
		this.name = this.getKey();
		this.contextSecurity = contextSecurity ;
		this.settings = settings ;

		this.passport = passport ;
	
		this.passport.framework( nodefonyPassport(this) );
		
		this.strategy = this.getStrategy(this.settings) ;

		this.passport.use(this.strategy);

		this.contextSecurity.container.get("kernel").listen(this,"onReady",function(){
			this.orm = this.contextSecurity.container.get("sequelize") ;
			this.User = this.orm.getEntity("user") ;
			this.connection = this.orm.getConnection("nodefony");
		})

		this.profileWrapper = this.settings.profile_wrapper
	};

	Factory.prototype.wrapperLdap = function( profile ){
		 
		var obj = {} ;
		for ( var name in this.profileWrapper ){
			var res = parseParameterString.call({profile:profile}, this.profileWrapper[name], null );
			if ( res ){
				obj[name] = res ;	
			}else{
				obj[name] = "" ;	
			}
		}
		return nodefony.extend( defaultWrapper.call(this) ,  obj ) ;
	};


	Factory.prototype.getStrategy = function(options){
	
		return  new LdapStrategy(options, function( profile, done){
			this.contextSecurity.logger("TRY AUTHORISATION "+ this.name+" : "+profile.uid ,"DEBUG");
			var obj = null ;
			if ( profile ){
				this.contextSecurity.logger("PROFILE AUTHORISATION "+ this.name+" : "+profile.displayName ,"DEBUG");
				obj = this.wrapperLdap(profile) ;
			}else{
				return done(new Error("Profile Ldap error") , null );	
			}

			if ( obj ){
				this.User.findOrCreate({
					where: {username: obj.username}, 
					defaults:obj
				}).then(function(user){
					if ( nodefony.typeOf( user)  === "array" ){ 
						done(null, user[0]);
					}else{
						done(null, user);	
					}
				}).catch(function(e){
					done(e, null)	
				})
				return ;	
			}
			done(new Error("Profile Ldap error") , null );
		}.bind(this));	
	}

	Factory.prototype.generatePassWd = function(){
		var date = new Date().getTime();
		var buf = crypto.randomBytes(256);
		var hash = crypto.createHash('md5');
		return hash.update(buf).digest("hex");
	};


	Factory.prototype.getKey = function(){
		return "passport-ldapauth";
	};

	Factory.prototype.getPosition = function(){
		return "http";	
	};

	Factory.prototype.handle = function( context, callback){
		this.contextSecurity.logger("HANDLE AUTHORISATION  "+ this.getKey(),"DEBUG");
		this.passport.authenticate('ldapauth', { 
			session: false, 
		})(context, function(error, res){
			if (error){
				return callback(error, null)	
			}
			if ( res  ){
				context.user = res ;	
				this.contextSecurity.logger("AUTHORISATION "+this.name+" SUCCESSFULLY : " + res.username ,"INFO");
			}
			var token = {
				name:"ldap",
				user:res
			}

			return callback(error, token)
		}.bind(this));
	};

	Factory.prototype.generatePasswd = function(realm, user, passwd){
	};

	return Factory ;
});
