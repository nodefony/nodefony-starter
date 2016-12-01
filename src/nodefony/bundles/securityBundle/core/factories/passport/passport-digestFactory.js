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

	var Factory = class Factory {

		constructor (contextSecurity,  settings){
			this.name = this.getKey();
			this.contextSecurity = contextSecurity ;
			this.settings = settings ;

			this.passport = passport ;
		
			this.passport.framework( nodefonyPassport(this) );
			
			this.strategy = this.getStrategy(this.settings) ;

			this.passport.use(this.strategy);

		};

		getStrategy (options){
		
			return  new DigestStrategy(options, (username, done) => {
					this.contextSecurity.logger("TRY AUTHORISATION "+ this.name+" : "+username ,"DEBUG");
					// get passwd 
					this.contextSecurity.provider.getUserPassword(username,  (error, passwd) =>{
							if ( error ){
								return done(error, null)
							}
							this.contextSecurity.provider.loadUserByUsername(username, (error, result) => {
								if ( error ){
									return done(error, null)
								}
								return done( null, result , passwd )
								
							});
					});
			});	
		}

		getKey (){
			return "passport-digest";
		};

		getPosition (){
			return "http";	
		};

		handle ( context, callback){
			this.contextSecurity.logger("HANDLE AUTHORISATION passport-digest " ,"DEBUG");
			
			this.passport.authenticate('digest', { 
				session: false, 
			})(context, (error, res) => {
				if ( res  ){
					context.user = res ;	
					this.contextSecurity.logger("AUTHORISATION "+this.getKey()+" SUCCESSFULLY : " + res.username ,"INFO");
				}
				var token = {
					name:"Digest",
					user:res
				}

				return callback(error, token)
			});
		};

		generatePasswd (realm, user, passwd){

		};
	};

	return Factory ;
});
