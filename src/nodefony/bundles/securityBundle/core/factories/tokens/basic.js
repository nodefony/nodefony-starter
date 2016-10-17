/*
 *
 *	Token Basic
 *
 *
 */

var crypto = require('crypto');


nodefony.register.call(nodefony.security.tokens, "Basic",function(){

	var settingsBasic = {
		realm : "user@",
	}


	var parseAuthorization = function(str){
		var ret = str.replace(/Basic /g,"");
		ret = ret.replace(/"/g,"");
		ret = ret.replace(/ /g,"");
		ret = new Buffer(ret, 'base64').toString('ascii');	
		var res = ret.split(":");
		if ( res && res.length === 2 ){
			this.username = res[0] ;
			return {
				username:res[0],
				passwd:res[1]
			}
		}
		return null ;
	}


	var Basic = function(request, response, options){
		this.name = "Basic" ;
		this.settings = nodefony.extend({}, settingsBasic, options);	
		this.auth = false ;
		this.authorization = request.headers["authorization"] || ( request.query ? request.query.authorization : null ) ;
		this.host = request.headers["host"];
		this.secret = this.host+":"+request.headers["user-agent"]+":"+ ( request.headers["referer"] || request.remoteAddress )
		this.request = request ;
		this.response = response;
		this.method = request.method;
	}; 


	Basic.prototype.generateResponse = function(){
		var line = "" ;
		var obj = {
			realm:  this.settings.realm,//+this.host,
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



	Basic.prototype.checkResponse = function( getUserPassword, callback){
		var ret  = parseAuthorization.call(this, this.authorization);
		if (  ! ret ){
			callback ({
				status:401,
				message:"BAD Basic Response "	
			},null);
		}
		try {
			getUserPassword(ret.username, function(error, userHashToCompare){
				if (userHashToCompare == ret.passwd){
					this.auth = true ;
					callback(null, true );
				}else{
					callback( {
						status:401,
						message:"BAD Basic Response "	
					}, null); 
				}

			}.bind(this));
		}catch(e){
			callback(e, null); 
		}

	};

	Basic.prototype.generatePasswd = function(realm, username, passwd){
		return username+":"+passwd ;	
	};

	return Basic ;

});
