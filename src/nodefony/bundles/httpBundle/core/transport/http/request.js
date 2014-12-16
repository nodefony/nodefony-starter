/*
 *
 *
 *
 *	Request
 *
 *
 *
 */

var url = require("url")
var qs = require('querystring');
var xml = require('xml2js');



nodefony.register("Request",function(){

	
	var settingsXml = {};
	var parserRequestBody = function(request){
		//var contentType = this.contentType ? this.contentType : "application/x-www-form-urlencoded";
		switch ( request.method ){
			case "POST":
			case "PUT":
			case "DELETE":
				switch(this.contentType){
					case "application/json":
					case "text/json":
						this.queryPost = JSON.parse(this.body.toString(this.charset));
					break;
					case "application/xml":
					case "text/xml":
						var Parser = new xml.Parser( settingsXml );
						Parser.parseString(this.body.toString(this.charset) , function(err, result){
							if ( err )
								throw err ;
							this.queryPost = result ;
						}.bind(this));	
					break;
					case "multipart/form-data":
						this.queryPost = this.body;
						this.logger("FORM you must use a parser for multipart/form-data   BUFFER SIZE : "+ this.body.length, "WARNING");
					break;
					case "application/x-www-form-urlencoded":
						this.queryPost = qs.parse(this.body.toString(this.charset));
					break;
					default:
						//console.log(bodyParser(request,null,function(){console.log(arguments)}))
						this.queryPost = this.body.toString(this.charset);
						this.logger("you must use a parser for "+this.contentType  +" FORM : " + this.body.length, "WARNING");
						//this.queryPost = qs.parse(this.body);

				}
			break;
		}
	};

	var Request = function(request, container){
		this.container = container ;
		this.request = request;
		this.host = request.headers.host;
		this.url = this.getUrl(request) ;
		this.query = this.getUrl(request, true).query;
		this.queryGet = this.getUrl(request, true).query ; 
		this.headers = 	request.headers ;
		this.method = request.method;
		this.contentType = this.getContentType(this.request);
		this.charset = this.getCharset(this.request);
		this.domain = this.setDomain();
		this.remoteAdress = this.getRemoteAdress();
		this.data = new Array();

		this.request.on('data', function (data) {
			this.data.push(data) 
		}.bind(this));

		this.request.on('end', function (data) {
			try {
				this.body = Buffer.concat(this.data);
				parserRequestBody.call(this, this.request );
				switch (typeof this.queryPost){
					case "object" :
						this.query = nodefony.extend(this.query, this.queryGet, this.queryPost);
					break;
					case "string" :
						this.query = this.queryPost;
					break;
					default:
						this.query = nodefony.extend(this.query, this.queryGet);
				}
			}catch(e){
				throw new Error ("Request "+this.url.href +" Content-type : " + this.contentType + " data Request :   "+ this.body.length+"   " + e );
			}
		}.bind(this));
	};

	Request.prototype.logger = function(pci, severity, msgid,  msg){
		var syslog = this.container.get("syslog");
		if (! msgid) msgid = "HTTP REQUEST  ";
		return syslog.logger(pci, severity, msgid,  msg);
	};

	Request.prototype.getContentType = function( request ){
		if ( request.headers["content-type"] ){
			return  request.headers["content-type"].split(";")[0];		
		}
		return null;
	}

	Request.prototype.getCharset = function( request ){
		if ( request.headers["content-type"] ){
			var charset = request.headers["content-type"].split(";")[1];
			if (charset)
				charset = charset.replace(" ","").split("=")[1];
			else
				charset = "utf8" ;
		}
		return  charset || "utf8" ; 
	}

	Request.prototype.setDomain = function(){
		return this.host.split(":")[0];
	};

	Request.prototype.getRemoteAdress = function(){
		return this.headers['x-forwarded-for'] || this.request.connection.remoteAddress ;
	};

	Request.prototype.getUrl = function(request, query){
		if ( request.connection.encrypted )
			var fullURL =  'https://' + this.host + request.url;
		else
			var fullURL = 'http://' + this.host + request.url;
		return url.parse(fullURL, query);
	};

	Request.prototype.isAjax = function(){
		if ( this.headers['x-requested-with'] )
			return (  'xmlhttprequest' === this.headers['x-requested-with'].toLowerCase() ) 
		return false;
	}

	return Request;

});


