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
		if (response instanceof  http.ServerResponse)
			this.response =response;
		this.body = "";
		// struct headers
		this.headers = {};

		// default http code 
		this.statusCode = 200;

		//default Content-Type
		this.setHeader("Content-Type", "text/html; charset=utf-8");
	};

	Response.prototype.logger = function(pci, severity, msgid,  msg){
		var syslog = this.container.get("syslog");
		if (! msgid) msgid = "HTTP RESPONSE";
		return syslog.logger(pci, severity, msgid,  msg);
	};

	Response.prototype.setHeader = function(name, value){
		this.response.setHeader(name, value);
	};
	
	Response.prototype.setHeaders = function(obj){
		nodefony.extend(this.headers, obj);
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
				this.body = JSON.stringify(ele) 
			break;
		}
		return  ele ;
	};


	Response.prototype.writeHead = function(statusCode, headers){
		this.response.writeHead(
			statusCode || this.statusCode,
			headers || this.headers
		);
	};

	Response.prototype.write = function(){
		this.response.write( this.body + "\n");
	};

	Response.prototype.flush = function(data){
        	this.response.end(data);
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
