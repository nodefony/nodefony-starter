/*
 *
 *
 *
 *	Response websocket
 *
 *
 *
 */

nodefony.register("wsResponse",function(){

	var Response = class Response {

		constructor (connection, container, type){

			this.container = container ;
			this.kernel = this.container.get("kernel") ;
			this.connection = connection ;
			this.body = "";
			this.statusCode = this.connection.state;
			this.config = this.connection.config ;
			this.webSocketVersion = this.connection.webSocketVersion ;

			//cookies
			this.cookies = {};

			// struct headers
			this.headers = {};
			this.type = "utf8" ; 
		};

		logger (pci, severity, msgid,  msg){
			var syslog = this.container.get("syslog");
			if (! msgid) msgid = "WEBSOCKET RESPONSE";
			return syslog.logger(pci, severity, msgid,  msg);
		};

		send (data, type){
			switch (type){
				case "utf8":
					this.connection.sendUTF(data.utf8Data);
				break;
				case "binary":
					this.connection.sendBytes(data.binaryData)
				break;
				default:
					this.connection.send(data);
			}
			this.body = "";
		};

		clean (){
			delete this.connection ;	
			delete this.body ;
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
			this.logger("ADD COOKIE ==> " + cookie.serialize(), "DEBUG")	
			this.setHeader('Set-Cookie', cookie.serialize());
		};

		//ADD INPLICIT HEADER
		setHeader (name, value){
			this.response.setHeader(name, value);
		};
		
		setHeaders (obj){
			nodefony.extend(this.headers, obj);
		};
	};

	return Response;

});
