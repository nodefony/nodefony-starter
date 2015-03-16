nodefony.register.call(nodefony.io, "authentication",function(){

	/**
 	 *
 	 *	@class authenticate
 	 *
 	 *
 	 */
	var authenticate = function( name , settings ){
		this.name = name;
		this.notificationCenter = new nodefony.notificationsCenter.create(settings);
		this.statusCode = 401;
		this.authorization = null;
		this.provider = null;
	};

	authenticate.prototype.checkAuthenticate = function(host, request, response){
		this.authorization = request.headers["authorization"] || ( request.query ? request.query.authorization : null ) ;
		if (this.authorization){
			try {
				this.notificationCenter.fire("checkAuthenticate", host, request, response );
				if (this.statusCode !== 401)
					return response.statusCode = this.statusCode;
			}catch(e){
				response.headers["WWW-Authenticate"] = this.generateResponse(host, request, response);
				this.statusCode = response.statusCode = 401;
				throw (e);	
			}
		}
		
		response.headers["WWW-Authenticate"] = this.generateResponse(host, request, response);	
		this.statusCode = response.statusCode = 401;

		return this.statusCode ;
	};

	authenticate.prototype.generatePasswd = function(type, user, passwd){
		var mech = this.getMechanisms(type);
		var inst = new mech(this.host);
		return inst.generatePasswd( user, passwd);
	};

	authenticate.prototype.getUserPasswd = function(userName){
		throw new Error("YOU MUST redefine provider function getUserPasswd in authenticate prototcole ")	
	};
	
	authenticate.prototype.serialize = function(){
		return JSON.stringify({
			authorization:	this.authorization ,
			type:this.name
		})
	};
	
	return  {
		mechanisms:{},
		authenticate : authenticate
	}
});


nodefony.register.call(nodefony.security.factory, "http_digest",function(){

	var Factory = function(contextSecurity,  settings){
		this.name = this.getKey();
		this.contextSecurity = contextSecurity ;
		this.authenticate = new nodefony.io.authentication["http_digest"](settings); 
	};

	Factory.prototype.getKey = function(){
		return "http_digest";
	};

	Factory.prototype.getPosition = function(){
		return "http";	
	};

	Factory.prototype.handle = function( context){
		var request = context.request ;
		var authorization = request.headers["authorization"] || ( request.query ? request.query.authorization : null ) ;
		if (! authorization){ 
			var response = context.response ;
			var host = request.headers["host"];
			response.headers["WWW-Authenticate"] = this.authenticate.generateResponse(host, request, response);
			throw {
				status:401,
				message:"Unauthorized"
			}
		}
		try {
			this.authenticate.checkResponse(authorization, this.contextSecurity.provider.getUserPassword.bind(this.contextSecurity.provider))
		}catch(e){
			var response = context.response ;
			var host = request.headers["host"];
			response.headers["WWW-Authenticate"] = this.authenticate.generateResponse(host, request, response);
			throw e;
		}
	};
	return Factory ;
});


nodefony.register.call(nodefony.security.factory, "http_basic",function(){

	var Factory = function(contextSecurity, settings){
		this.name = this.getKey();
		this.provider = contextSecurity.provider ;
		contextSecurity.listen(this, "onHttpRequest", this.handle );
	};

	Factory.prototype.getKey = function(){
		return "http_basic";
	};

	Factory.prototype.getPosition = function(){
		return "http";
	};

	Factory.prototype.handle = function(container, context, type){
	
	}


	return Factory ;

});


nodefony.register.call(nodefony.security.factory, "sasl",function(){

	var Factory = function(contextSecurity, settings){
		this.name = this.getKey();
		this.provider = contextSecurity.provider ;
		contextSecurity.listen(this, "onHttpRequest", this.handle );
	};

	Factory.prototype.getKey = function(){
		return "sasl";
	};

	Factory.prototype.getPosition = function(){
		return "http";
	};

	Factory.prototype.handle = function(container, context, type){
	
	}



	return Factory ;

});
