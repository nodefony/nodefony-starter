/*
 *
 *
 *	PASSPORT DIGEST  FACTORY
 *
 *
 */

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var nodefonyPassport = require("passport-nodefony");



nodefony.register.call(nodefony.security.factory, "passport-local",function(){

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
		return  new LocalStrategy(options, function(username, password, done){
				this.contextSecurity.logger("TRY AUTHORISATION "+ this.name+" : "+username ,"DEBUG");
				// get passwd 
				this.contextSecurity.provider.getUserPassword(username, 
					function(error, passwd){
						if ( error ){
							return done(error, false, { message: 'Incorrect username.' });
						}
						if ( passwd !== password ){
							return done(null, false, { message: 'Incorrect password.' });
						}
						this.contextSecurity.provider.loadUserByUsername(username, function(error, result){
							if ( error ){
								return done(error, null)
							}
							return done( null, result )
							
						}.bind(this));
				}.bind(this));
		}.bind(this));	
	}

	Factory.prototype.getKey = function(){
		return "passport-local";
	};

	Factory.prototype.getPosition = function(){
		return "http";	
	};

	Factory.prototype.handle = function( context, callback){
		this.contextSecurity.logger("HANDLE AUTHORISATION "+this.getKey() ,"DEBUG");
		
		this.passport.authenticate('local', { 
			session: false, 
		})(context, function(error, res){
			if ( res  ){
				context.user = res ;	
				this.contextSecurity.logger("AUTHORISATION "+this.getKey()+" SUCCESSFULLY : " + res.username ,"INFO");
			}
			var token = {
				name:this.getKey(),
				user:res
			}

			return callback(error, token)
		}.bind(this));
	};

	Factory.prototype.generatePasswd = function(realm, user, passwd){
	};

	return Factory ;
});
