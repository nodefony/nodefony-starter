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
				response.statusCode = this.statusCode ;
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
