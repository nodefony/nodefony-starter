/*
 *
 *
 *
 *
 *
 *
 *
 */
var crypto = require('crypto');


nodefony.register("cookies",function(){
	
	var encode = encodeURIComponent ;
	var decode = decodeURIComponent ;

	var cookieDefaultSettings = {
		maxAge:0,//24*60*60,
		path:"/",
		domain:null,
		secure:false,
		httpOnly:true,
		signed:false,
		secret:"!nodefony.secret!"
	};

	var Cookie = function(name, value, settings){
		if (typeof name === "object"){
			this.settings = name.settings ;
			this.name = name.name ;	
			this.signed = name.signed ;
			this.value =name.value; 
			this.originalMaxAge = name.originalMaxAge ;
			this.expires = name.expires ;
			this.path = name.path;
			this.domain = name.domain ;
			this.httpOnly = name.httpOnly ;
			this.secure = name.secure  ;
			this.maxAge = name.maxAge;
		}else{
			this.settings = nodefony.extend({}, cookieDefaultSettings, settings) ;
			if (! name ) throw new Error( "cookie must have name");
			this.name = name ;
			this.signed = this.settings.signed ;
 			this.value = this.setValue( value );
			this.originalMaxAge = this.setOriginalMaxAge(this.settings.maxAge) ;
			this.expires = this.setExpires(this.settings.expires) ;
			this.path = this.setPath(this.settings.path);
			this.domain = this.setDomain() ;
			this.httpOnly = this.setHttpOnly(this.settings.httpOnly) ;
			this.secure = this.setSecure(this.settings.secure)  ;
		}
	};
	
	Cookie.prototype.setValue = function(value){
		if (value){
			value = decode( value ) ;
		}
		if (this.signed)
			this.value = this.sign(value, this.settings.secret );	
		else
			this.value = value ; 
		return this.value
	};


	Cookie.prototype.setSecure = function(val){
		return val;
	};

	Cookie.prototype.setDomain = function(domain){
		return this.settings.domain;
	};

	Cookie.prototype.setHttpOnly = function(val){
		return val;
	};

	Cookie.prototype.setPath = function(val){
		return val;
	};

	Cookie.prototype.setExpires = function(date){
		if ( date ){
			try {
				if (date instanceof Date){
					this.expires = date;
				}else{
					this.expires = new Date(date);	
				}
			}catch(e){
				this.expires = null ;
			}	
		}else{
			var maxage = this.getMaxAge() ;
			if ( maxage === 0 ){
				this.expires = null ;
			}else{
				var exp = new Date().getTime() ;
				var res= exp + ( maxage * 1000 ) ;
				this.expires = new Date(res ) ;
			}
			return this.expires ;
		}
		this.getMaxAge() ;
		return this.expires;
	};

	Cookie.prototype.setOriginalMaxAge = function(ms){
		switch (typeof ms){
			case "number" :
				return  ms;		
			break;
			case "string" :
				try {
					var res = eval(ms);
				}catch(e){
					var res = ms;
				}
				return  parseInt(res, 10);
			break;
			default :
				throw new Error("cookie class error maxage bad type "+ typeof ms );
		}
	};

	Cookie.prototype.getMaxAge = function(){
		if (this.expires && this.expires instanceof  Date){
			var ms = ( this.expires.getTime() - new Date().getTime() ) ;
			var s = (ms/1000) ;
			if (s > 0){
				this.maxAge = s  ; // en seconde
			}else{
				throw new Error("Espires / Max-Age : "+ s + " Error Espires")
			}
		}else{
			this.maxAge = this.originalMaxAge ;
		}
		return 	this.maxAge ;
	};
		
	Cookie.prototype.toString =  function() {
		return this.name + "=" + encode(this.value) ;
	};

	Cookie.prototype.sign = function(val, secret){
		if ('string' != typeof val) throw new TypeError('cookie required');
		if ('string' != typeof secret) throw new TypeError('secret required');
		return val + '.' + crypto
			.createHmac('sha256', secret)
			.update(val)
			.digest('base64')
			.replace(/\=+$/, '');
	};

	Cookie.prototype.unsign = function(val, secret){
		if ('string' != typeof val) throw new TypeError('cookie required');
		if ('string' != typeof secret) throw new TypeError('secret required');
		var str = val.slice(0, val.lastIndexOf('.'));
		return this.sign(str, secret) == val ? str : false;
	};

	Cookie.prototype.serialize = function(opt){
		var tab = [];
		tab.push( this.toString() );
		if (this.maxAge) tab.push('Max-Age=' + this.maxAge);
		if (this.domain) tab.push('Domain=' + this.domain);
		if (this.path) tab.push('Path=' + this.path);
		if (this.expires) tab.push('Expires=' + this.expires.toUTCString());
		if (this.httpOnly) tab.push('HttpOnly');
		if (this.secure) tab.push('Secure');
		return tab.join('; ');
	};

	var parse = function(strToParse){
    		var obj = {};
		if (! strToParse) return obj;
    		var tab = strToParse.split(/[;,] */);
    		tab.forEach(function(pair) {
        		var eq_idx = pair.indexOf('=')
        		if (eq_idx < 0) {
				throw new Error("skip things that don't look like key=value")
        		}
        		var key = pair.substr(0, eq_idx).trim();
        		var val = pair.substr(++eq_idx, pair.length).trim();
        		// quoted values
        		if ('"' == val[0]) {
				val = val.slice(1, -1);
        		}

        		// only assign once
        		if (undefined == obj[key]) {
                		obj[key] = val;
        		}
    		});
	    	return obj;
	};

	var cookiesParser = function(context){
		var cookies = context.request.request.headers.cookie ;
		if ( cookies ){
			var obj = parse(cookies);
			for (var cookie in obj){
				var co = new Cookie(cookie, obj[cookie]);
				context.addCookie(co);
			}
		}
	};

	return {
		cookie:Cookie,
		cookiesParser:cookiesParser,
		parser:parse
	
	}
});
