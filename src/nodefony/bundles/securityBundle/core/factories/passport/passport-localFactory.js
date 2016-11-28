/*
 *
 *
 *	PASSPORT LOCAL  FACTORY
 *
 *
 */
try{
	var passport = require('passport');
	var LocalStrategy = require('passport-local').Strategy;
	var nodefonyPassport = require("passport-nodefony");
}catch(e){
	this.logger(e);
}


nodefony.register.call(nodefony.security.factory, "passport-local",function(){

	var Factory =  class Factory {

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
			return  new LocalStrategy(options, (username, password, done) => {
					this.contextSecurity.logger("TRY AUTHORISATION "+ this.name+" : "+username ,"DEBUG");
					// get passwd 
					this.contextSecurity.provider.getUserPassword(username, (error, passwd) => {
							if ( error ){
								return done(error, false, { message: 'Incorrect username.' });
							}
							if ( passwd !== password ){
								return done(null, false, { message: 'Incorrect password.' });
							}
							this.contextSecurity.provider.loadUserByUsername(username, (error, result) => {
								if ( error ){
									return done(error, null)
								}
								return done( null, result )
								
							});
					});
			});	
		}

		getKey (){
			return "passport-local";
		};

		getPosition (){
			return "http";	
		};

		handle ( context, callback){
			this.contextSecurity.logger("HANDLE AUTHORISATION "+this.getKey() ,"DEBUG");
			
			this.passport.authenticate('local', { 
				session: false, 
			})(context, (error, res) => {
				if ( res  ){
					context.user = res ;	
					this.contextSecurity.logger("AUTHORISATION "+this.getKey()+" SUCCESSFULLY : " + res.username ,"INFO");
				}
				var token = {
					name:this.getKey(),
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
