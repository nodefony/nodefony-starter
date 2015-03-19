/*
 *
 *
 *
 *
 *
 *
 */

var crypto = require('crypto');


nodefony.register.call(nodefony.security.tokens, "Digest",function(){


	/*
 	 *
 	 *
 	 *	DIGEST MD5 
 	 *
 	 */

	var settingsDigest = {
		private_key : "private_key",
		realm : "user@",
		max_time : 0
	}
	var lenghtTs = (new Date().getTime()+"").length;

	var reg =/^([^=]+)=(.+)$/;
	var parseAuthorization = function(str){
		var ret = str.replace(/Digest /g,"");
		ret = ret.replace(/"/g,"");
		ret = ret.replace(/ /g,"");
		var head = ret.split(",");
		for (var i= 0 ; i < head.length ; i++){
			var res = reg.exec(head[i])
			if (res && res[1]){
				if (res[1] === "cnonce")
					this[res[1]] = res[2];
				else	
					this[res[1]] = res[2];
			}
		}	
	}


	var generateA1 = function(username, realm, password, nonce, cnonce){
		if (cnonce)
			var A1 = username + ":" + realm + ":" + password + ":" + nonce+ ":" + cnonce ;
		else
			var A1 = username + ":" + realm + ":" + password ;//+ ":" + nonce ;
		var MD5 = crypto.createHash('md5');
		return MD5.update(A1).digest("hex");
	};


	var responseDigest = function(A1, nonce, noncecount, cnonce, qop, A2){
		var res = ""
		if(qop === "auth" || qop === "auth-int"){
			res = A1 + ":" + nonce +":" + noncecount +":" + cnonce +":" + qop + ":" + A2 ;
		}else{
			res = A1 + ":" + nonce + ":" + A2 ;
		}
		var MD5 = crypto.createHash('md5');
		return MD5.update(res).digest("hex");
	};

	var generateA2 = function(method, uri, entity_body, qop){
		var A2 = "";
		if( ! qop || qop ===  "auth"){
			A2 = method +":" + uri ;
		} else if(qop === "auth-int"){
			if( entity_body ){
				var entity = MD5(entity_body);
				A2 = method + ":" + uri + ":" + entity ; 
			}else{
				A2 = method + ":" + uri + ":" + "d41d8cd98f00b204e9800998ecf8427e" ;
			}
		}
		var MD5 = crypto.createHash('md5');
		return MD5.update(A2).digest("hex");
	};

	var Digest = function( request, response, options){
		this.name = "Digest" ;
		if (! arguments.length ){
			return this.generatePasswd ;
		}
		this.settings = nodefony.extend({}, settingsDigest, options);	
		this.auth = false ;
		this.authorization = request.headers["authorization"] || ( request.query ? request.query.authorization : null ) ;
		this.host = request.headers["host"];
		this.secret = this.host+":"+request.headers["user-agent"]+":"+ ( request.headers["referer"] || request.remoteAdress )
		this.request = request ;
		this.response = response;
		this.method = request.method;
	};

	Digest.prototype.generateNonce = function(){
		var ts = new Date().getTime();
		var SHA1 = crypto.createHash('sha1');
		return  ts + SHA1.update(ts+":"+this.secret+":"+this.settings.private_key).digest("hex");
	};

	Digest.prototype.recalculateNonce = function(){

		var nonce = this.nonce.substring(lenghtTs);
		var ts = this.nonce.substring(0,lenghtTs);
		if (this.settings.max_time !== 0 ){
			var tm = new Date().getTime();
			var tmTimeout = parseInt(tm,10);
			var tsTimeout = parseInt(ts,10)+this.settings.max_time ;
			if ( (! this.auth ) &&  tm > tsTimeout){
				throw {
					status:401,
					message:"Digest TIMEOUT"	
				};
			}
		}
		var SHA1 = crypto.createHash('sha1');
		var res = SHA1.update(ts+":"+this.secret+":"+this.settings.private_key).digest("hex");
		return nonce === res ;
	};


	Digest.prototype.recalculateResponse = function(A1){
		var uri = this["digest-uri"] || this.uri ;
		var A2 = generateA2(this.method, uri ,null,this.qop ); 
		//var res = responseDigest(A1, this.nonce, this.nc, new Buffer(this.cnonce, 'base64').toString('ascii'), this.qop, A2) ;
		var res = responseDigest(A1, this.nonce, this.nc, this.cnonce, this.qop, A2) ;
		return res;
	};
		
	Digest.prototype.generateResponse = function(){
		this.nonce = this.generateNonce();
		var line = "" ;
		var obj = {
			nonce:'"'+this.nonce+'"',
			realm:  this.settings.realm,//+this.host,
			qop:"auth"
		};
		var length = Object.keys(obj).length -1 ; 
		for (var ele in obj ){
			if (length)
				line+=ele+"="+obj[ele]+","	
			else
				line+=ele+"="+obj[ele]	
			length-=1;
		}
		//return  '"'+new Buffer(line).toString('base64')+'"';	
		return  this.name+' '+line;	
	};

	Digest.prototype.checkResponse = function( callback){
		parseAuthorization.call(this, this.authorization);
		try {
			var res = this.recalculateNonce();
			if (! res){
				throw {
					status:401,
					message:"BAD Digest Response "	
				};
			}
			var userHashToCompare = callback(this.username);
			res = this.recalculateResponse(userHashToCompare);
			if (res === this.response){
				this.auth = true ;
				return true;
			}else{
				throw {
					status:401,
					message:"BAD Digest Response "	
				}; 
			}
		}catch(e){
			throw (e); 
		}
	};

	Digest.prototype.generatePasswd = function(realm, username, passwd){
		var Realm = realm || this.settings.realm ;//+ host ;
		return generateA1(username, Realm, passwd)
	};

				 
	return Digest;


});
