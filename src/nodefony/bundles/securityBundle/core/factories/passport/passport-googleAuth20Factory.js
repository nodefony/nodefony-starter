var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var nodefonyPassport = require("passport-nodefony");




nodefony.register.call(nodefony.security.factory, "passport-google-oauth20",function(){

	var Factory = function(contextSecurity,  settings){
		this.name = this.getKey();
		this.contextSecurity = contextSecurity ;
		this.settings = settings ;

		this.passport = passport ;
		
		this.passport.framework( nodefonyPassport(this) );
		
		this.strategy = this.getStrategy(this.settings) ;

		this.passport.use(this.strategy);

		this.contextSecurity.container.get("kernel").listen(this,"onReady",function(){
			this.User = this.contextSecurity.container.get("sequelize").getEntity("user") ;
		})


	};

	Factory.prototype.getStrategy = function(options){
		return  new GoogleStrategy(options, function(accessToken, refreshToken, profile, cb){
			var obj = null ;
			if ( profile ){
				this.contextSecurity.logger("PROFILE AUTHORISATION "+ this.name+" : "+profile.displayName ,"DEBUG");
				var obj = {
					id		: profile.id,	
					username	: profile.displayName,
					name		: profile.name.familyName,
					surname		: profile.name.givenName,
					password	: "",
					provider	: profile.provider,
					lang		: profile.language,
					roles		: "USER",	
					gender		: profile.gender,
					displayName	: profile.displayName,
					url		: profile.url,
					image		: profile.image
				}
			}

			if ( obj ){
				this.User.findOrCreate({
					where: {username: obj.username}, 
					defaults:obj
				}).then(function(user){
					cb(null, user);
				}).catch(function(e){
					cb(e, null)	
				})
				return ;	
			}
			cb(new Error("Profile Google error") , null );
		
		}.bind(this));	
	}

	Factory.prototype.getKey = function(){
		return "passport-google-oauth20";
	};

	Factory.prototype.getPosition = function(){
		return "http";	
	};

	Factory.prototype.handle = function( context, callback){
		
		var route = context.resolver.getRoute() ;
		if ( route.name === "googleArea" ) {
			this.passport.authenticate('google', { scope: ['profile'] })(context);
			return ;
		}
		if ( route.name === "googleCallBackArea" ){ 
			
			this.passport.authenticate('google', { 
				session: false, 
			})(context, function(error, res){
				if ( error ){
					return callback(error, null);	
				}
				if ( res ){
					context.user = res ;	
					//this.contextSecurity.logger("AUTHORISATION "+this.getKey()+" SUCCESSFULLY : " + res.username ,"INFO");
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




