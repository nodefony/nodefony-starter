/*
 *
 *
 *	PASSPORT DIGEST  FACTORY
 *
 *
 */

try{
	var passport = require('passport');
	var DigestStrategy = require('passport-http').DigestStrategy;
	var nodefonyPassport = require("passport-nodefony");
}catch(e){
	this.logger(e);
}


nodefony.register.call(nodefony.security.factory, "passport-digest",function(){

	var Factory = function(contextSecurity,  settings){
		this.name = this.getKey();
		this.contextSecurity = contextSecurity ;
		this.settings = settings ;

		this.passport = passport ;
	
		this.passport.framework( nodefonyPassport(this) );
		
		this.strategy = this.getStrategy(this.settings) ;

		this.passport.use(this.strategy);

	};

	Factory.prototype.getStrategy = function(options){
	
		return  new DigestStrategy(options, function(username, done){
				this.contextSecurity.logger("TRY AUTHORISATION "+ this.name+" : "+username ,"DEBUG");
				// get passwd 
				this.contextSecurity.provider.getUserPassword(username, 
					function(error, passwd){
						if ( error ){
							return done(error, null)
						}
						this.contextSecurity.provider.loadUserByUsername(username, function(error, result){
							if ( error ){
								return done(error, null)
							}
							return done( null, result , passwd )
							
						}.bind(this));
				}.bind(this));
		}.bind(this));	
	}

	Factory.prototype.getKey = function(){
		return "passport-digest";
	};

	Factory.prototype.getPosition = function(){
		return "http";	
	};

	Factory.prototype.handle = function( context, callback){
		this.contextSecurity.logger("HANDLE AUTHORISATION passport-digest " ,"DEBUG");
		
		this.passport.authenticate('digest', { 
			session: false, 
		})(context, function(error, res){
			if ( res  ){
				context.user = res ;	
				this.contextSecurity.logger("AUTHORISATION "+this.getKey()+" SUCCESSFULLY : " + res.username ,"INFO");
			}
			var token = {
				name:"Digest",
				user:res
			}

			return callback(error, token)
		}.bind(this));
	};

	Factory.prototype.generatePasswd = function(realm, user, passwd){
	};

	return Factory ;
});
