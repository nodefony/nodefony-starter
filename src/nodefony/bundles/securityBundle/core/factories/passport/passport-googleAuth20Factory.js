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
			this.orm = this.contextSecurity.container.get("sequelize") ;
			this.User = this.orm.getEntity("user") ;
			this.connection = this.orm.getConnection("nodefony");
		})

		this.scopes = settings.scopes || ['profile'] ; 

	};

	Factory.prototype.getStrategy = function(options){
		return  new GoogleStrategy(options, function(accessToken, refreshToken, profile, cb){
			var obj = null ;
			console.log(profile)
			if ( profile ){
				this.contextSecurity.logger("PROFILE AUTHORISATION "+ this.name+" : "+profile.displayName ,"DEBUG");
				var obj = {
					username	: profile.displayName,
					name		: profile.name.familyName || "",
					surname		: profile.name.givenName || "",
					password	: "",
					provider	: profile.provider,
					lang		: profile._json.language,
					roles		: "USER",	
					gender		: profile.gender || "",
					displayName	: profile.displayName,
					url		: profile._json.url || "",
					image		: profile._json.image.url || ""
				}
			}

			if ( obj ){
				this.User.findOrCreate({
					where: {username: obj.username}, 
					defaults:obj
				}).then(function(user){
					if ( nodefony.typeOf( user)  === "array" ){ 
						cb(null, user[0]);
					}else{
						cb(null, user);	
					}
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
			this.passport.authenticate('google', { scope: this.scopes })(context);
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




