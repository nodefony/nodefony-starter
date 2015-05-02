/*
 *
 *
 *
 *	Response
 *
 *
 *
 */




nodefony.register("Response",function(){


	var Response = function(response, container){
		this.container = container ;
		this.kernel = this.container.get("kernel") ;
		if (response instanceof  http.ServerResponse)
			this.response =response;
		//BODY
		this.body = "";
		this.encoding = null;

		//cookies
		this.cookies = {};

		// struct headers
		this.headers = {};

		this.ended = false ;

		// default http code 
		this.setStatusCode(200);

		//default Content-Type to implicit headers
		this.setHeader("Content-Type", "text/html; charset=utf-8");

		// free container scope
		this.response.on("finish",function(){
			//console.log("FINISH response")
			//if ( ! this.ended ){
			//	this.kernel.container.leaveScope(this.container);
			//}
		}.bind(this))

		/*this.response.on("close",function(){
		}.bind(this))*/
	};

	Response.prototype.addCookie = function(cookie){
		if ( cookie instanceof nodefony.cookies.cookie ){
			this.cookies[cookie.name] = cookie;
		}else{
			throw {
				message:"",
				error:"Response addCookies not valid cookies"
			}
		}	
	};

	Response.prototype.setCookies = function(){
		for (var cook in this.cookies){
			this.setCookie(this.cookies[cook]);	
		}
	};

	Response.prototype.setCookie = function(cookie){
		this.response.on('header', function(){
			this.logger("ADD COOKIE ==> " + cookie.serialize(), "DEBUG")	
			this.setHeader('Set-Cookie', cookie.serialize());
		}.bind(this))
	};

	Response.prototype.logger = function(pci, severity, msgid,  msg){
		var syslog = this.container.get("syslog");
		if (! msgid) msgid = "HTTP RESPONSE";
		return syslog.logger(pci, severity, msgid,  msg);
	};

	//ADD INPLICIT HEADER
	Response.prototype.setHeader = function(name, value){
		this.response.setHeader(name, value);
	};
	
	Response.prototype.setHeaders = function(obj){
		nodefony.extend(this.headers, obj);
	};

	Response.prototype.setEncoding = function(encoding){
		return this.encoding = encoding ;
	};


	Response.prototype.setStatusCode = function(status, message){
		this.statusCode = status ;
		this.response.statusMessage = message || http['STATUS_CODES'][this.statusCode] ;
	};

	Response.prototype.setBody = function(ele){
		switch (nodefony.typeOf(ele) ) {
			case "string" :
				this.body = ele;
			break;
			case "object" :
			case "array" :
				this.body = JSON.stringify(ele); 
			break;
			default:
				this.body = ele;
		}
		return  ele ;
	};

	Response.prototype.writeHead = function(statusCode, headers){
		if ( ! this.response.headersSent ){
			return this.response.writeHead(
				statusCode || this.statusCode,
				headers || this.headers
			);
		}else{
			throw new Error("Headers already sent !!");	
		}
	};

	Response.prototype.flush = function(data, encoding){
		if ( ! this.response.headersSent ) {
			this.setHeader('Transfer-Encoding', 'chunked');
			this.headers['Transfer-Encoding'] = 'chunked' ;
			this.writeHead();
		}
		return this.response.write( data , encoding);
	};

	Response.prototype.write = function(){
		if (this.encoding )
			return this.response.write( this.body + "\n", this.encoding);
		else
			return this.response.write( this.body + "\n");
	};

	Response.prototype.end = function(data, encoding){
		//console.log('pass response end')
		this.ended = true ;
        	var ret = this.response.end(data, encoding);
		//this.kernel.container.leaveScope(this.container);
		return ret ;
	};

	Response.prototype.redirect = function(url, status){
		if (status === "301")
			this.setStatusCode( status );
		else
			this.setStatusCode( 302 );

		this.setHeader("Location", url);		
		return this;
	};
	
	return Response;

});
