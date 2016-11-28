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

	var Response = class Response {

		constructor (response, container, type){
			this.container = container ;
			this.kernel = this.container.get("kernel") ;
			if (response instanceof  http.ServerResponse)
				this.response =response;
			//BODY
			this.body = "";
			this.encoding = this.setEncoding('utf8');;

			//cookies
			this.cookies = {};

			// struct headers
			this.headers = {};

			this.ended = false ;

			// default http code 
			this.setStatusCode(200);

			//timeout default
			var settings = this.container.getParameters("bundles.http");
			this.timeout = type === "HTTP" ? settings.http.responseTimeout : settings.https.responseTimeout ;

			//default Content-Type to implicit headers
			this.setHeader("Content-Type", "text/html; charset=utf-8");

			// free container scope
			this.response.on("finish",() =>{
				//console.log("FINISH response")
				//if ( ! this.ended ){
				//	this.kernel.container.leaveScope(this.container);
				//}
			})

			/*this.response.on("close",() => {
			})*/
		};

		clean (){
			delete this.response ;	
			delete this.cookies ;
			delete this.headers ;
			delete this.body ;
		
		}

		setTimeout (ms){
			this.timeout = ms ;
		}

		addCookie (cookie){
			if ( cookie instanceof nodefony.cookies.cookie ){
				this.cookies[cookie.name] = cookie;
			}else{
				throw {
					message:"",
					error:"Response addCookies not valid cookies"
				}
			}	
		};

		setCookies (){
			for (var cook in this.cookies){
				this.setCookie(this.cookies[cook]);	
			}
		};

		setCookie (cookie){
			//this.response.on('header', function(){
				this.logger("ADD COOKIE ==> " + cookie.serialize(), "DEBUG")	
				this.setHeader('Set-Cookie', cookie.serialize());
			//}.bind(this))
		};

		logger (pci, severity, msgid,  msg){
			var syslog = this.container.get("syslog");
			if (! msgid) msgid = "HTTP RESPONSE";
			return syslog.logger(pci, severity, msgid,  msg);
		};

		//ADD INPLICIT HEADER
		setHeader (name, value){
			this.response.setHeader(name, value);
		};
		
		setHeaders (obj){
			nodefony.extend(this.headers, obj);
		};

		setEncoding (encoding){
			return this.encoding = encoding ;
		};


		setStatusCode (status, message){
			this.statusCode = status ;
			this.response.statusMessage = message || http['STATUS_CODES'][this.statusCode] ;
		};

		setBody (ele){
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

		writeHead (statusCode, headers){
			if ( ! this.response.headersSent ){
				return this.response.writeHead(
					statusCode || this.statusCode,
					headers || this.headers
				);
			}else{
				throw new Error("Headers already sent !!");	
			}
		};

		flush (data, encoding){
			if ( ! this.response.headersSent ) {
				this.setHeader('Transfer-Encoding', 'chunked');
				this.headers['Transfer-Encoding'] = 'chunked' ;
				this.writeHead();
			}
			return this.response.write( data , encoding);
		};

		write (){
			if (this.encoding )
				return this.response.write( this.body + "\n", this.encoding);
			else
				return this.response.write( this.body + "\n");
		};

		end (data, encoding){
			if ( this.response ){
				this.ended = true ;
				var ret = this.response.end(data, encoding);
				return ret ;
			}
			return null ;
		};	

		redirect (url, status){
			if (status == "301"){
				this.setStatusCode( status );
			}else{
				this.setStatusCode( 302 );
			}
			this.setHeader("Location", url);		
			return this;
		};
	};
	
	return Response;

});
