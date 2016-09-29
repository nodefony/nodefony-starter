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
var QS = require('qs');
var xml = require('xml2js');

nodefony.register("Request",function(){

	var settingsXml = {};
	var parserRequestBody = function(){
		//var contentType = this.contentType ? this.contentType : "application/x-www-form-urlencoded";
		switch ( this.request.method ){
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
						var service = this.container.get("upload");
						var res = new nodefony.io.MultipartParser(this);
						this.queryPost = res.post ;
						var queryFile = res.file ;
						if (Object.keys(queryFile).length ) {
							for(var file in queryFile){
								this.queryFile[file] = service.createUploadFile(this, queryFile[file]);
							}
						}
						this.logger("FORM  multipart/form-data   BUFFER SIZE : "+ this.body.length, "DEBUG");
						nodefony.extend( this.query, this.queryFile);
					break;
					case "application/x-www-form-urlencoded":
						this.queryPost = QS.parse(this.body.toString(this.charset));
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
		this.headers = 	request.headers ;
		this.host = this.getHost() ; //request.headers.host;
		this.hostname = this.getHostName(this.host) ;
		//console.log( request.url )
		//console.log( request )
		//console.log( request.headers.host )
		this.sUrl = this.getFullUrl( request );
		this.url = this.getUrl(this.sUrl) ;
		if ( this.url.search ){
			this.url.query = QS.parse( this.url.search.replace(/^\?/,"") ) ;
		}else{
			this.url.query = {} ;
		}
		this.queryPost = {}; 
		this.queryFile = {}; 
		this.queryGet = this.url.query;
		this.query = this.url.query;
		
		this.method = this.getMethod() ;// request.method;
		this.rawContentType = {} ;
		this.contentType = this.getContentType(this.request);
		this.charset = this.getCharset(this.request);
		this.domain = this.getDomain();
		this.remoteAdress = this.getRemoteAdress();
		this.data = new Array();
		this.dataSize = 0;

		this.request.on('data', function (data) {
			this.data.push(data) 
			this.dataSize+= data.length;
		}.bind(this));

		this.request.on('end', function (data) {
			try {
				this.body = Buffer.concat(this.data);
				parserRequestBody.call(this, this.request );
				switch (typeof this.queryPost){
					case "object" :
						if (this.queryPost instanceof Buffer){
							this.query = this.queryPost ;
						}else{
							nodefony.extend( this.query, this.queryPost);
							//nodefony.extend( this.query, this.queryFile);
						}
					break;
					default:
						nodefony.extend( this.query, this.queryPost);
						//nodefony.extend( this.query, this.queryFile);
				}
			}catch(e){
				if (e.status){
					throw e ;
				}
				throw new Error ("Request "+this.url.href +" Content-type : " + this.contentType + " data Request :   "+ this.body.length+"   " + e );
			}
		}.bind(this));
	};

	Request.prototype.getHost = function(){
		return this.request.headers.host ;
		//return this.url.host ;
	}

	Request.prototype.getHostName = function(host){
		if ( this.url && this.url.hostname )
			return this.url.hostname ;
		if ( host ){
			return host.split(":")[0] ;
		}
		return  this.getHost().split(":")[0] ; 
	}


	Request.prototype.getUserAgent = function(){
		return this.request.headers['user-agent'];	
	}

	Request.prototype.getMethod = function(){
		return this.request.method ;
	}

	Request.prototype.clean = function(){
		delete 	this.data ;
		delete  this.body ; 
		delete	this.queryPost ;
		delete	this.queryFile;
		delete	this.queryGet;
		delete  this.query ;
		delete  this.request ;
	}

	/*Request.prototype.acceptLanguage = function(request){
		var data = request.headers["accept-language"];
		if ( ! data ) return null ;
		var tab  = data.split(";");
		if ( ! tab.length ) return null;
		var res = {};
		for (var i = 0 ; i<tab.length ; i++){
			if ( tab[i] ){
				var ele = tab[i].split(",");
				console.log(ele);
			}	
		}
	}*/

	Request.prototype.logger = function(pci, severity, msgid,  msg){
		var syslog = this.container.get("syslog");
		if (! msgid) msgid = "HTTP REQUEST  ";
		return syslog.logger(pci, severity, msgid,  msg);
	};

	Request.prototype.getContentType = function( request ){
		if ( request.headers["content-type"] ){
			var tab = request.headers["content-type"].split(";") ;
			if (tab.length > 1){
				for (var i = 1 ; i<tab.length ;i++){
					if (typeof tab[i] === "string"){
						var ele = tab[i].split("=")
						var key = ele[0].replace(" ","");
						this.rawContentType[key]= ele[1]; 
					}else{
						continue ;
					}

				}
			}
			this.extentionContentType = request.headers["content-type"] ;
			return  tab[0];		
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

	Request.prototype.getDomain = function(){
		return this.getHostName() ;
		//return this.host.split(":")[0];
	};

	Request.prototype.getRemoteAdress = function(){
		// proxy mode
		if ( this.headers && this.headers['x-forwarded-for'] ){
			return this.headers['x-forwarded-for'] ;
		}
		if ( this.request.connection && this.request.connection.remoteAddress ){
			return this.request.connection.remoteAddress 
		}
		if ( this.request.socket && this.request.socket.remoteAddress ){
			return this.request.socket.remoteAddress
		}
		if (this.request.connection &&  this.request.connection.socket && this.request.connection.socket.remoteAddress ){
			return  this.request.connection.socket.remoteAddress ;
		}
		return null ;
	};

	Request.prototype.setUrl = function(Url){
		this.url = this.getUrl(Url);
	};

	Request.prototype.getUrl = function(sUrl, query){
		return url.parse( sUrl, query);
	};

	Request.prototype.getFullUrl = function(request){
		// proxy mode
		if ( this.headers && this.headers['x-forwarded-for'] ){
			return this.headers['x-forwarded-proto'] + "://" + this.host +  request.url ;
		}
		if ( request.connection.encrypted ){
			return 'https://' + this.host + request.url;
		}else{
			return 'http://' + this.host + request.url;
		}
	};

	Request.prototype.isAjax = function(){
		if ( this.headers['x-requested-with'] )
			return (  'xmlhttprequest' === this.headers['x-requested-with'].toLowerCase() ) 
		return false;
	}

	return Request;
});


