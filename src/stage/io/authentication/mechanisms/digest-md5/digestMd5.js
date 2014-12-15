/*
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
stage.provide("digest-md5");


stage.require("md5");
stage.require("base64");


stage.register.call(stage.io.authentication.mechanisms, "DIGEST-MD5",function(){

	var keyWord= {
		realm:true,
		qop:true,
		charset:true,
		algorithm:true,
		nonce:true
	}

	var reg =/^([^=]+)=(.+)$/;
	var parserAuthenticate = function(str){
		var ret = str.replace(/"/g,"");
		ret = ret.replace(/Digest /g,"");
		var head = ret.split(",");
		var obj = {}
		for (var i= 0 ; i < head.length ; i++){
			var res = reg.exec(head[i]);
			if (res && res[1])
				obj[res[1]] = res[2]
		}	
		return obj
	}

	var MD5 = stage.crypto.md5.hex_md5_noUTF8 ;
	var BASE64 = stage.crypto.base64.encode ;
	var DBASE64 = stage.crypto.base64.decode;

	var generateA1 = function(username, realm, password, nonce, cnonce){
		if (cnonce)
			var A1 = username + ":" + realm + ":" + password + ":" + nonce+ ":" + cnonce ;
		else
			var A1 = username + ":" + realm + ":" + password ;//+ ":" + nonce ;
		return MD5(A1); 
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
		return MD5(A2);
	};

	var responseDigest = function(A1, nonce, noncecount, cnonce, qop, A2){
		var res = "";
		if(qop === "auth" || qop === "auth-int"){
			res = A1 + ":" + nonce +":" + noncecount +":" + cnonce +":" + qop + ":" + A2 ;
		}else{
			res = A1 + ":" + nonce + ":" + A2 ;
		}
		return MD5(res);
	};


	var digestMd5 = function(url, method, headers, body){
		this.method = method ;
		this.entity_body = body;
		this.url = url;
		this.uri = this.url.requestUri;
		this.protocol = this.url.protocol.replace(":","");
		this.host = this.url.host;
		switch (typeof headers){
			case "object":
				this.parseChallenge(headers);
 			break;	
			default:
				throw new Error("digetMD5 bad format header")
		}
	}

	digestMd5.prototype.parseChallenge = function(headers){
		//console.log(headers)
		var parsing = {};
		switch (typeof headers){
			case "string" : 
			//TODO
				throw new Error("digetMD5 bad format challenge")
			break;	
			case "object" :
				for (var ele in headers ){
					switch (ele){
						case "challenge":
							if (typeof headers.challenge === "string"){
								try{
									this.challengeB64 = DBASE64(headers.challenge);
								}catch(e){
									this.challengeB64 = headers.challenge ;
									//throw new Error("DIGEST MD5 ERROR DECODE BAS64")	
								}
							
							}
						break;
						default:
							parsing[ele] = headers[ele];
							
					};
				}
			break;	
			default:
				throw new Error("digetMD5 bad format challenge")
		}
		var challenge = stage.extend(parserAuthenticate(this.challengeB64), parsing )
		//var challenge = parserAuthenticate(this.challengeB64);
		//console.log(challenge)
		for (var name in challenge){
			if (name in keyWord){
				this[name] = challenge[name];
			}else{
				console.warn("digestMd5 parser challenge header name dropped: "+name)
			}	
		}
	};


	digestMd5.prototype.generateAuthorization = function(username, password){

		var line = 'Digest username="'+username+'"';
		if (! this.realm){
			this.realm = username+"@"+this.url.host ;
		}

		var res ={
			nonce:'"'+this.nonce+'"',
			realm:'"'+this.realm+'"',
			response:null
		}

		this["digest-uri"] = this.protocol+"/"+this.host;
		//this["digest-uri"] = '"'+this.protocol+"/"+this.uri+'"';

		res["digest-uri"] = '"'+this["digest-uri"]+'"';

		/*if (this.charset){
			res["charset"]=this.charset;
		}*/

		if (this.qop){
			this.cnonce = BASE64( Math.floor( (Math.random()*100000000)) .toString() ) ;
			res["cnonce"]='"'+this.cnonce+'"';
			res["qop"]=this.qop;
		}
		if (this.opaque){
			res["opaque"]=this.opaque;
		}

		this.nc = "00000001";
		res["nc"]=this.nc;

		this.A1 = generateA1(username, this.realm, password/*, this.nonce, this.cnonce*/);	
		this.A2 = generateA2(this.method, this["digest-uri"], this.entity_body, this.qop);


		res.response = responseDigest(this.A1, this.nonce, this.nc, this.cnonce, this.qop, this.A2);	
		// generate Authorization 

		for (var ele in res){
			line+=","+ele+"="+res[ele];
		}
		//console.log(line)
		var toSend = BASE64(line);
		return toSend
				
	};


	stage.io.authentication["Digest"] = digestMd5 ;
	

	return digestMd5

})
