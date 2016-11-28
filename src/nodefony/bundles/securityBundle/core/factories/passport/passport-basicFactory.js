/*
 *
 *
 *	PASSPORT BASIC  FACTORY
 *
 *
 */

try {
	var passport = require('passport');
	var BasicStrategy = require('passport-http').BasicStrategy;
	var nodefonyPassport = require("passport-nodefony");
}catch(e){
	this.logger(e);
}

nodefony.register.call(nodefony.security.factory, "passport-basic",function(){

	var Factory = class Factory {

		constructor(contextSecurity,  settings){
			this.name = this.getKey();
			this.contextSecurity = contextSecurity ;
			this.settings = settings ;

			this.passport = passport ;
			
			this.passport.framework( nodefonyPassport(this) );
			
			this.strategy = this.getStrategy(this.settings) ;

			this.passport.use(this.strategy);

		};

		getStrategy (options){
		
			return  new BasicStrategy(options, (username, password, done) => {
					this.contextSecurity.logger("TRY AUTHORISATION "+ this.name+" : "+username ,"DEBUG");
					// get passwd 
					this.contextSecurity.provider.getUserPassword(username,  (error, passwd) => {
							if ( error ){
								return done(error, null)
							}
							if ( passwd !== password ){
								return done(null, false);
							}
							this.contextSecurity.provider.loadUserByUsername(username, (error, result) => {
								if ( error ){
									return done(error, null)
								}
								if ( ! result ){
									return done( null, false  )
								}
								return done( null, result  )
								
							});
					});
			});	
		}

		getKey (){
			return "passport-basic";
		};

		getPosition (){
			return "http";	
		};

		handle ( context, callback){
			
			this.passport.authenticate('basic', { 
				session: false, 
			})(context, (error, res) => {
				if ( res ){
					context.user = res ;	
					this.contextSecurity.logger("AUTHORISATION "+this.getKey()+" SUCCESSFULLY : " + res.username ,"INFO");
				}
				var token = {
					name:"Basic",
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

