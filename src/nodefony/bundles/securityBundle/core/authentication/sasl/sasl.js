/*
 *
 *
 *
 *
 *
 *
 */

nodefony.register.call( nodefony.io.authentication, "SASL", function(){


	/*
 	 *
 	 *
 	 *	SASL AUTH
 	 *
 	 *
 	 */ 
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
		"DIGEST-MD5":nodefony.io.authentication.mechanisms["digest-md5"]	
	};

	var SASL = function(options){
		this.settings = options;
		this.mother = this.$super;
		this.$super.constructor("SASL");
		this.mechanisms	= this.getAllMechanisms();
		this.notificationCenter.listen(this, "checkAuthenticate", function(host, request, response, callback){
			this.checkResponse(host, request, response, callback)
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

});
