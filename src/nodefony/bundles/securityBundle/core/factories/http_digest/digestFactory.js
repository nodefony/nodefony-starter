/*
 *
 *
 *	HTTP DIGEST  FACTORY
 *
 *
 */

nodefony.register.call(nodefony.security.factory, "http_digest",function(){

	var Factory = function(contextSecurity,  settings){
		this.name = this.getKey();
		this.contextSecurity = contextSecurity ;
		this.settings = settings ;
		this.token = "Digest"; 
	};

	Factory.prototype.getKey = function(){
		return "http_digest";
	};

	Factory.prototype.getPosition = function(){
		return "http";	
	};

	Factory.prototype.handle = function( context){
		var request = context.request ;
		var response = context.response ;
		this.contextSecurity.token = new nodefony.security.tokens["Digest"](request, response, this.settings);
		this.contextSecurity.logger("TRY AUTHORISATION","DEBUG")
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
	};

	Factory.prototype.generatePasswd = function(){
		return new nodefony.security.tokens["digest-md5"].apply(this, arguments);	
	};

	return Factory ;
});
