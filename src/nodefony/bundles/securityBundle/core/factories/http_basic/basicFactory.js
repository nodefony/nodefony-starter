/*
 *
 *	HTTP BASIC  FACTORY	
 *
 *
 *
 */

nodefony.register.call(nodefony.security.factory, "http_basic",function(){

	var Factory = function(contextSecurity, settings){
		this.name = this.getKey();
		this.contextSecurity = contextSecurity ;
		this.settings = settings ;
		this.token = "Basic"; 
	};

	Factory.prototype.getKey = function(){
		return "http_basic";
	};

	Factory.prototype.getPosition = function(){
		return "http";
	};

	Factory.prototype.handle = function(context){
		var request = context.request ;
		var response = context.response ;
		this.contextSecurity.token = new nodefony.security.tokens["Basic"](request, response, this.settings);
		this.contextSecurity.logger("TRY AUTHORISATION "+this.contextSecurity.token.name ,"DEBUG")
		if (! this.contextSecurity.token.authorization){ 
			response.headers["WWW-Authenticate"] = this.contextSecurity.token.generateResponse();
			throw {
				status:401,
				message:"Unauthorized"
			}
		}
		try {
			var res = this.contextSecurity.token.checkResponse( this.contextSecurity.provider.getUserPassword.bind(this.contextSecurity.provider))
			if ( res )
				context.user = this.contextSecurity.provider.loadUserByUsername(this.contextSecurity.token.username);
		}catch(e){
			response.headers["WWW-Authenticate"] = this.contextSecurity.token.generateResponse();
			throw e;
		}
	
	}

	return Factory ;

});

