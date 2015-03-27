/*
 *
 *
 *
 *
 *
 *
 */

nodefony.register.call(nodefony.security.factory, "sasl",function(){

	var parseSASLAuth = function(request){

		var str = request.headers["authorization"] || ( request.query ? request.query.authorization : null ) ;
		if ( str ){
			try {
				var tab = str.split(" ") ;
				if (tab[0] !== "SASL"){
					throw {
						message:"Stack Protocole SASL bad format",
						status:401
					}
				}
				var tab2 = tab[1].split(",");
				var decode = new Buffer(tab2[1], 'base64').toString('ascii');
				request.headers["authorization"] = decode ;
				return {
					mechanism:tab2[0].split("=")[1] ? tab2[0].split("=")[1].replace(/"/g,"") : null,
					decode:decode
				}
			}catch(e){
				throw {
					message:e,
					status:401
				}	
			}
		}else{
			throw {
				message:" SASL security send challenge",
				status:401
			}	
		}
	};


	var Factory = function(contextSecurity, settings){
		this.name = this.getKey();
		this.settings = settings ;
		this.contextSecurity = contextSecurity ;
		this.token = this.getAllMechanisms();
		this.defaultToken = "Digest";
	};

	Factory.prototype.getKey = function(){
		return "sasl";
	};

	Factory.prototype.getPosition = function(){
		return "Form";
	};

	Factory.prototype.handle = function(context){
		var request = context.request ;
		var response = context.response ;

		try {
			var res = parseSASLAuth(request);
		}catch(e){
			this.contextSecurity.logger(e.message, "ERROR")	
			request.headers["authorization"]= null;
			var res = {
				mechanism:this.defaultToken
			}
		}
		try {
			var typeMech = this.getMechanisms(res.mechanism);
		}catch( e ){
			var typeMech = this.getMechanisms( this.defaultToken );
			this.contextSecurity.token = new typeMech( request, response, this.settings);
			response.headers["WWW-Authenticate"] = this.generateResponse(this.contextSecurity.token);
			throw e;
		}

		this.contextSecurity.token = new typeMech( request, response, this.settings);

		if (! this.contextSecurity.token.authorization){ 
			response.headers["WWW-Authenticate"] = this.generateResponse(this.contextSecurity.token);
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
			response.headers["WWW-Authenticate"] = this.generateResponse(this.contextSecurity.token);
			throw e;
		}	
	};


	Factory.prototype.generateResponse = function(token){
		//console.log(request)
		var res = "SASL ";
		var line = {
			"mechanisms":token.name
		}
		line["challenge"]=token.generateResponse();
		 
		for (var ele in line){
			res+=ele+"="+line[ele]+","
		}
		return res.substring(0,res.length-1) ;
	};

	Factory.prototype.getAllMechanisms = function(){
		var mech = '"';
		this.nbMechanism = 0;
		for (var me in nodefony.security.tokens){
			mech+=me+" ";
			this.nbMechanism++;
		}
		var str = mech.substring(0,mech.length-1)
		str+='"';
		return str;
	};

	Factory.prototype.getMechanisms = function(mech){
		if ( mech in nodefony.security.tokens){
			return nodefony.security.tokens[mech]
		}else{
			throw new Error("SASL mechanism token  : "+mech+" is not implemented");
		}
	}
	
	Factory.prototype.generatePasswd = function(realm, user, passwd){
		var func = new nodefony.security.tokens["Digest"]();
		return func(realm, user, passwd);	
	};



	return Factory ;

});


/*nodefony.register.call( nodefony.io.authentication, "SASL", function(){


	 
	var parseSASLAuth = function(str){
		var tab = str.split(" ") ;
		if (tab[0] !== "SASL"){
			throw {
				message:"Stack Protocole SASL bad format"
			}
		}
		var tab2 = tab[1].split(",");
		var decode = new Buffer(tab2[1], 'base64').toString('ascii');
		return {
			mechanism:tab2[0].split("=")[1],
			decode:decode
		}
	};

	var mechanisms = {
		//"DIGEST-MD5":nodefony.io.authentication.mechanisms["digest-md5"]	
	};

	var SASL = function(options){
		this.settings = options;
		this.mother = this.$super;
		this.$super.constructor("SASL");
		this.mechanisms	= this.getAllMechanisms();
		this.notificationCenter.listen(this, "checkAuthenticate", function(host, request, response, callback){
			try {
				this.checkResponse(host, request, response, callback)
			}catch(e){
				throw e
			}
		}.bind(this))
	
	};

	SASL.prototype.generateResponse = function(host, request, response){
		//console.log(request)
		var res = "SASL ";
		var line = {
			"mechanisms":this.mechanisms
		}
		
		if (this.nbMechanism === 1){
			var mech = this.getMechanisms();
			var inst = new mech(this.settings,host, request, response);
			line["challenge"]=inst.generateResponse(host, request, response);	
		} 
		for (var ele in line){
			res+=ele+"="+line[ele]+","
		}
		return res.substring(0,res.length-1) ;
	};

	SASL.prototype.checkResponse = function(host, request, response, callback){
		//console.log("CHECK Authorization SASL")
		var res = parseSASLAuth(this.authorization)
		var typeMech = this.getMechanisms(res.mechanism);
		var line = res.decode;
		var inst = new typeMech(this.settings, host, request, response);
		try{
			inst.authorization = line;
			inst.notificationCenter.fire("checkAuthenticate",host, request, response, callback );
			this.statusCode =  inst.statusCode;
			//this.statusCode =  inst.checkResponse(line, callback);
		}catch(e){
			this.statusCode = 401;
			throw (e);
		}
	};

	SASL.prototype.getAllMechanisms = function(){
		var mech = '"';
		this.nbMechanism = 0;
		for (var me in mechanisms){
			mech+=me+" ";
			this.nbMechanism++;
		}
		var str = mech.substring(0,mech.length-1)
		str+='"';
		return str;
	};

	SASL.prototype.getMechanisms = function(mech){
		switch (mech){
			case "Digest" :
			case "DIGEST-MD5" :
			case "digest-md5" :
				mech = "DIGEST-MD5" ;
			default:
				if (this.nbMechanism === 1){
				for (var ele in mechanisms){
					return mechanisms[ele];
				}
				}else{
					throw new Error("SASL mechanism : getMechanism no arg");
				}
		}
		if ( mech in mechanisms){
			return mechanisms[mech]
		}else{
			throw new Error("SASL mechanism : "+mech+" is not implemented");
		}
	}

	return SASL.herite(nodefony.io.authentication.authenticate)

});*/

