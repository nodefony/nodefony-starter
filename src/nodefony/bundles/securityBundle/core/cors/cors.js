/*
 *
 *
 *
 *
 *	 http://www.w3.org/TR/cors/
 *
 *
 *
 */

nodefony.register.call( nodefony.io, "cors", function(){


	var headersCorsDefaults = {
		"access-control-allow-methods":			"GET",
		"access-control-allow-headers":			"ETag, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date",
		"access-control-expose-headers":		"WWW-Authenticate, X-Json, X-Requested-With",
		"access-control-max-age":			10,
		"access-control-Allow-Credentials":		true		
	};



	var cors = function(settings){
		this.allowMatch = null;
		this.header = {};
		for (var ele in settings){
			switch (ele){
				case "allow-origin":
					if (settings[ele] === "*"){
						this.allowMatch = new RegExp(".*");
					}else{
						if (typeof settings[ele] === "object"){
							var str = "";	
							var i = 0;
							for (var name in settings[ele]){
								if (i === 0) 
									str = settings[ele][name];
								else
									str += "|"+ settings[ele][name] ;	
								i++;
							}
							if (str)
								this.allowMatch = new RegExp(str);
						}
					}
				break;	
				case "Access-Control":
					nodefony.extend(this.header, headersCorsDefaults, settings[ele] )
				break;	
			}
		}
	}


	cors.prototype.match = function( request, response){
		var URL = url.parse(request.headers.referer || request.headers.origin )
		var origin =  URL.protocol+"//"+URL.host ;
		if (this.allowMatch){
			var res = this.allowMatch.exec(origin) ;
			if (! res )
				return  401;
		}
		this.header["Access-Control-Allow-Origin"] = origin ;
		response.setHeaders( this.header);
		if ( request.method.toUpperCase() === "OPTIONS" ){
			response.statusCode = 204;
			response.writeHead();
			response.flush();
			return 204
		}
		return 200 ;
	};

	return cors;

});

