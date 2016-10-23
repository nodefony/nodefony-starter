/*
 *
 *
 *	PASSPORT DIGEST  FACTORY
 *
 *
 */






var passport = require('passport')
  , DigestStrategy = require('passport-http').DigestStrategy;


nodefony.register.call(nodefony.security.factory, "passport-digest",function(){

	var Factory = function(contextSecurity,  settings){
		this.name = this.getKey();
		this.contextSecurity = contextSecurity ;
		this.settings = settings ;
		this.token = "Digest"; 

		this.passport = passport ;

		this.strategy = this.getStrategy();

		this.passport.use(this.strategy);
	};


	Factory.prototype.getStrategy = function(options){
	
		return  new DigestStrategy(
			{ qop: 'auth' ,realm:"nodefony"},
			function(username, done){
				this.contextSecurity.logger("TRY AUTHORISATION "+username ,"DEBUG");
				// get passwd 
				this.contextSecurity.provider.getUserPassword(username, 
					function(error, passwd){
						if ( error ){
							done(error, null)
						}
						this.contextSecurity.provider.loadUserByUsername(username, function(error, result){
							if ( error ){
								return done(error, null)
							}
							//context.user = 	result;
							console.log(result)
							done(null, result, passwd )
						}.bind(this));
						return done(null, username, passwd)
				});
		}.bind(this));	
	}

	Factory.prototype.getKey = function(){
		return "passport-digest";
	};

	Factory.prototype.getPosition = function(){
		return "http";	
	};

	Factory.prototype.handle = function( context, callback){
		console.log("HANDLE FACTORY passport-digest");
		this.passport.authenticate('digest', { 
			session: false, 
			successRedirect: this.contextSecurity.defaultTarget, 
			failureRedirect: this.contextSecurity.formLogin
		})(context.request.request, context.response.response ,function(error, result){
			console.log("NEXT")
			console.log(arguments)
			callback(error, result)
		});
		
	};

	Factory.prototype.generatePasswd = function(realm, user, passwd){
	};

	return Factory ;
});
