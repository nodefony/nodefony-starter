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
					this.notificationCenter.fire("checkAuthenticate", host, request, response, this.getUserPasswd );
					return response.statusCode = this.statusCode;
				}catch(e){
					response.headers["WWW-Authenticate"] = this.generateResponse(host, request, response);
					response.statusCode = this.statusCode
					throw (e);	
				}
			}
			if (request.headers["Session"]){
				this.notificationCenter.fire("checkSession", host, request, response );
				//return this.checkSession();
			}else{
				response.headers["WWW-Authenticate"] = this.generateResponse(host, request, response);	
				this.statusCode = response.statusCode = 401;
			}
		return this.statusCode ;
	};

	authenticate.prototype.checkSession = function(){
		throw new Error("YOU MUST redefine session function checkSession in authenticate  ")
		return 200;	
	};

	authenticate.prototype.generatePasswd = function(type, user, passwd){
		var mech = this.getMechanisms(type);
		var inst = new mech(this.host);
		return inst.generatePasswd( user, passwd);
	};

	authenticate.prototype.getUserPasswd = function(userName){
		throw new Error("YOU MUST redefine provider function getUserPasswd in authenticate prototcole ")	
	};
	
	
	return  {
		mechanisms:{},
		authenticate : authenticate
	}
});
