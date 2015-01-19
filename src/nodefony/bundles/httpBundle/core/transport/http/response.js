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

		// struct headers
		this.headers = {};

		// default http code 
		this.statusCode = 200;

		//default Content-Type to implicit headers
		this.setHeader("Content-Type", "text/html; charset=utf-8");

		// free container scope
		this.response.on("finish",function(){
			//console.log("FINISH")
			this.kernel.container.leaveScope(this.container);
		}.bind(this))

		/*this.response.on("close",function(){
		}.bind(this))*/
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


	Response.prototype.setStatusCode = function(status){
		this.statusCode = status ;
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
		return this.response.writeHead(
			statusCode || this.statusCode,
			headers || this.headers
		);
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
        	return this.response.end(data, encoding);
	};

	Response.prototype.redirect = function(url, status){
		if (status === "301")
			this.statusCode = status;
		else
			this.statusCode = 302;

		this.setHeader("Location", url);		
		return this;
	};
	
	return Response;

});
