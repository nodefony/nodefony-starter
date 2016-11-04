var passport = require('passport');

var GoogleStrategy = require('passport-google-oauth20').Strategy;





nodefony.register.call(nodefony.security.factory, "passport-google-oauth20",function(){

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
		return  new GoogleStrategy(options, function(accessToken, refreshToken, profile, cb){
			this.contextSecurity.logger("TRY AUTHORISATION "+ this.name+" : "+username ,"DEBUG");
			console.log(arguments)	
			/*User.findOrCreate({ googleId: profile.id }, function (err, user) {
				return cb(err, user);
			});*/

		}.bind(this));	
	}

	Factory.prototype.getKey = function(){
		return "passport-google-oauth20";
	};

	Factory.prototype.getPosition = function(){
		return "http";	
	};

	Factory.prototype.handle = function( context, callback){
		
		console.log( "HANDLE")
		var route = context.resolver.getRoute() ;
		if ( route.name === "googleArea" ) {
			console.log("googleArea")
			this.passport.authenticate('google', { scope: ['profile'] })(context);
			return ;
		}

		if (route.name === "googleCallbackArea" ){ 
			console.log("googleCallbackArea")
			
			this.passport.authenticate('google', { 
				session: false, 
			})(context, function(error, res){
				if ( res ){
					context.user = res ;	
					this.contextSecurity.logger("AUTHORISATION "+this.getKey()+" SUCCESSFULLY : " + res.username ,"INFO");
				}
				var token = {
					name:"Google",
					user:res
				}
				return callback(error, token)
			}.bind(this));
			return ;
			
		}
		return callback({
			status:401,
		        message :"PASSPORT GOOGLE BAD ROUTE "
		}, null)
		
	};

	return Factory ;
});




