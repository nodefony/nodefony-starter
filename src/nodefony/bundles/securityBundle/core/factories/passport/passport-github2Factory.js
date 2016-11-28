try{
	var passport = require('passport');
	var GitHubStrategy = require('passport-github2').Strategy;
	var nodefonyPassport = require("passport-nodefony");
}catch(e){
	this.logger(e);
}

nodefony.register.call(nodefony.security.factory, "passport-github2",function(){

	var Factory = class Factory {

		constructor(contextSecurity,  settings){
			this.name = this.getKey();
			this.contextSecurity = contextSecurity ;
			this.settings = settings ;

			this.passport = passport ;
			
			this.passport.framework( nodefonyPassport(this) );
			
			this.strategy = this.getStrategy(this.settings) ;

			this.passport.use(this.strategy);

			this.contextSecurity.container.get("kernel").listen(this,"onReady",() => {
				this.orm = this.contextSecurity.container.get("sequelize") ;
				this.User = this.orm.getEntity("user") ;
				this.connection = this.orm.getConnection("nodefony");
			})

			this.scopes = settings.scopes || ['user:email'] ; 

		};

		getStrategy (options){
			return  new GitHubStrategy(options, (accessToken, refreshToken, profile, cb) => {
				var obj = null ;
				if ( profile ){
					this.contextSecurity.logger("PROFILE AUTHORISATION "+ this.name+" : "+profile.displayName ,"DEBUG");
					var obj = {
						username	: profile._json.login,
						name		: profile.username || "",
						surname		: profile._json.name || "",
						email		: profile.emails ? profile.emails[0].value : "" ,
						password	: this.generatePassWd(),
						provider	: profile.provider,
						roles		: "USER",	
						displayName	: profile.displayName,
						url		: profile._json.url || "",
						image		: profile._json.avatar_url || ""
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
			
			});	
		}

		generatePassWd (){
			var date = new Date().getTime();
			var buf = crypto.randomBytes(256);
			var hash = crypto.createHash('md5');
			return hash.update(buf).digest("hex");
		};


		getKey (){
			return "passport-github2";
		};

		getPosition (){
			return "http";	
		};

		handle ( context, callback){
			
			var route = context.resolver.getRoute() ;
			if ( route.name === "githubArea" ) {
				this.passport.authenticate('github', { scope: this.scopes })(context);
				return ;
			}
			if ( route.name === "githubCallBackArea" ){ 
				this.passport.authenticate('github', { 
					session: false, 
				})(context, (error, res) => {
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
				});
				return ;
				
			}
			return callback({
				status:401,
		        	message :"PASSPORT GITHUB BAD ROUTE "
			}, null)
		};
	};

	return Factory ;
});


