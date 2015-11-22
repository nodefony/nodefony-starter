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
stage.provide("io");



stage.require("jquery");



stage.register("io",function(){




	var isSameOrigin = function (url) {
		var loc = window.location;
		var a = urlToOject(url);
		return a.hostname == loc.hostname &&
			a.port == loc.port &&
			a.protocol == loc.protocol;
	};

	var isSecure = function(url){
		var loc = window.location;
		var a = urlToOject(url);
		return a.protocol === "https:" ;
	}

	/*
 	 *
 	 *   CLASS AUTHENTICATE
 	 *
 	 *
 	 *	EVENTS
 	 *
 	 *	onError: 
 	 *
 	 *
 	 *	onSuccess:
 	 *
 	 *
 	 */

	var authenticate = function(url, request, settings ){
		this.url = typeof url === "object" ? url : stage.io.urlToOject(url) ;
		this.crossDomain = ! stage.io.isSameOrigin(url);
		// notification center
		this.notificationCenter = stage.notificationsCenter.create(settings);
		// get header WWW-Authenticate
		var authenticate = request["WWW-Authenticate"].split(" ") ;
		//  get type authentification
		var authType = Array.prototype.shift.call(authenticate);
		var headers = request["WWW-Authenticate"].replace(authType+" ","") 
		//console.log(authType);
		this.method = "POST";
		var body = request.body;

		// intance of authentication
		var auth = this.getAuthenticationType(authType);
		this.authentication = new auth(this.url,  this.method, headers, body )
		this.ajax = false;
		if (settings.ajax){
			this.ajax = true;
		}
	};

	authenticate.prototype.getAuthenticationType = function(type){
		if (type in stage.io.authentication){
			return stage.io.authentication[type];
		}else{
			throw new Error("SSE client can't negociate : "+type )
		}
	};

	authenticate.prototype.register = function(username, password){

		var line = this.authentication.getAuthorization(username, password);
		this.notificationCenter.fire("onRegister", this, line);	
		if (this.ajax){
			$.ajax({
				type:		this.method,
				url:		this.url.href,
				cache:		false,
				crossDomain:	this.crossDomain ? false : true ,
				error:function(obj, type, message){
					this.notificationCenter.fire("onError", obj, type, message);	
				}.bind(this),
				beforeSend:function(xhr){
					xhr.setRequestHeader("Authorization", line );
					//if (this.crossDomain)
						//xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
				}.bind(this),
				success:function(data, state, obj){
					this.notificationCenter.fire("onSuccess", data, state, obj);
				}.bind(this)
			});
		}		
	};


	/**
 	 * We need our custom method because encodeURIComponent is too aggressive and doesn't follow
 	 * http://www.ietf.org/rfc/rfc3986.txt with regards to the character set (pchar) allowed in path
 	 * segments:
 	 *    segment       = *pchar
 	 *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
 	 *    pct-encoded   = "%" HEXDIG HEXDIG
 	 *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
 	 *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
 	 *                     / "*" / "+" / "," / ";" / "="
 	 */
	 var encodeUriSegment = function(val) {
  		return encodeUriQuery(val, true).
             		replace(/%26/gi, '&').
             		replace(/%3D/gi, '=').
             		replace(/%2B/gi, '+');
	};


	/**
 	 * This method is intended for encoding *key* or *value* parts of query component. We need a custom
 	 * method because encodeURIComponent is too aggressive and encodes stuff that doesn't have to be
 	 * encoded per http://tools.ietf.org/html/rfc3986:
 	 *    query       = *( pchar / "/" / "?" )
 	 *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
 	 *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
 	 *    pct-encoded   = "%" HEXDIG HEXDIG
 	 *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
 	 *                     / "*" / "+" / "," / ";" / "="
 	 */
	 var encodeUriQuery = function (val, pctEncodeSpaces) {
  		return encodeURIComponent(val).
             		replace(/%40/gi, '@').
             		replace(/%3A/gi, ':').
             		replace(/%24/g, '$').
             		replace(/%2C/gi, ',').
             		replace(/%3B/gi, ';').
             		replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
	};

	

	var parseKeyValue = function(search){
		var obj = {}, key_value, key;
		var tab = (search|| "").split('&') ;
		if (tab.length){
			for (var i = 0 ; i< tab.length;i++){
				try {
					var key_value = tab[i].replace(/\+/g,'%20').split('=');
					var key = decodeURIComponent(key_value[0]); 
					if ( key ){
						var val =  decodeURIComponent(key_value[1])
						if (Object.prototype.hasOwnProperty.call(obj, key) ){
							obj[key] = val;
						}else{
							switch (stage.typeOf(obj[key])){
								case "array":
									obj[key].push(val);
								break;
								default:
									obj[key] = [obj[key],val];
							}
						}
					}
				}catch (e){
					//invalid
				}
			}
		}
		return obj	
	};

	var toKeyValue = function(obj){
		var parts = [];
		for (var ele in obj){
			switch(stage.typeOf(obj[ele])){
				case "array":
					for (var i = 0 ; i<obj[ele].length ;i++){
						parts.push(encodeUriQuery(ele, true) + (obj[ele][i] === true ? '' : '=' + encodeUriQuery(obj[ele][i], true)));	
					}
				break;
				case "string":
				case "boolean":
					parts.push( encodeUriQuery(ele, true) + (obj[ele] === true ? '' : '=' + encodeUriQuery(obj[ele], true)) );
				break;
				default:
					continue ;
			}
		}
		return parts.length ? parts.join('&') : '';
  	};


	var getHeaderJSON = function(xhr) {
  		var json = xhr.getResponseHeader("X-Json"); 
  		if (json) {
			try {
				return JSON.parse(json)
			}catch(e){
				return json;
			}
  		}
		return null;
	};

   

	var urlToOject = function(url){
		var result = {};

		var anchor = document.createElement('a');
		anchor.href = url;

		var keys = 'protocol hostname host pathname port search hash href'.split(' ');
		for (keyIndex in keys) {
			var currentKey = keys[keyIndex]; 
			result[currentKey] = anchor[currentKey];
		}

		result.toString = function() { return anchor.href; };
		result.requestUri = result.pathname + result.search;  

		result.basename = result.pathname.replace(/\\/g,'/').replace( /.*\//, '' ) ;
		result.dirname = result.pathname.replace(/\\/g,'/').replace(/\/[^\/]*$/, '') ;

		return result;	
	};

	var nativeWebSocket = window.WebSocket  ? true : false ; 

	var transportCore = function(url, settings, context){
		this.$super.constructor(settings, context || this);	
		// Manage Url
		if (url){
			this.url = urlToOject(url);
			this.crossDomain = !isSameOrigin(url);
			this.error = null;
		}else{
			this.fire("onError", new Error("Transport URL not defined") );
		}
	}.herite(stage.notificationsCenter.notification);

	return {
		nativeWebSocket: nativeWebSocket,
		urlToOject: urlToOject,
		parseKeyValue:parseKeyValue,
		toKeyValue:toKeyValue,
		encodeUriSegment:encodeUriSegment,
		encodeUriQuery:encodeUriQuery,
		getHeaderJSON: getHeaderJSON,
		isSameOrigin: isSameOrigin,
		isSecure:isSecure,
		protocols: {},
		authentication: {
			authenticate: authenticate,
			mechanisms: {}
		},
		transport: transportCore,
		transports: {}
	}

});


