/*
 *
 *
 */

stage.register.call(stage.io.protocols, "sip",function(){

	/*
 	 *
 	 *	DIGEST authenticate
 	 *
 	 *
 	 */
	var stringify = function(value){
		return '"'+value+'"';
	}

	var MD5 = stage.crypto.md5.hex_md5_noUTF8 ;
	var BASE64 = stage.crypto.base64.encode ;
	var digest = {
		generateA1:function(username, realm, password, nonce, cnonce){
			if (cnonce)
				var A1 = username + ":" + realm + ":" + password + ":" + nonce+ ":" + cnonce ;
			else
				var A1 = username + ":" + realm + ":" + password ;//+ ":" + nonce ;
			//console.log(A1)
			return MD5(A1); 
		},

		generateA2:function(method, uri, entity_body, qop){
			var A2 = "";
			if( ! qop || qop ===  "auth"){
				A2 = method +":" + uri ;
			} else if(qop === "auth-int"){
				if( entity_body ){
					var entity = auth.MD5(entity_body);
					A2 = method + ":" + uri + ":" + entity ; 
				}else{
					A2 = method + ":" + uri + ":" + "d41d8cd98f00b204e9800998ecf8427e" ;
				}
			}
			//console.log(A2)
			return MD5(A2);
			//return MD5("sboob")
		},
		generateResponse:function(A1, nonce, noncecount, cnonce, qop, A2){
			var res = ""
			if(qop === "auth" || qop === "auth-int"){
				res = A1 + ":" + nonce +":" + noncecount +":" + cnonce +":" + qop + ":" + A2 ;
			}else{
				res = A1 + ":" + nonce + ":" + A2 ;
			}
			//console.log(res)
			return MD5(res);
		}		
	};

	var authenticate = function(message, username, password){
		if (message instanceof Message)
			this.dialog = message.dialog ; 
		else
			this.dialog = message ;
		this.userName = username ;
		this.password = password;
		this.uri = "sip:" +this.dialog.sip.server ;	
		this.realm = "stage";
		this.nonce = null;
		this.cnonce =null;
		this.nonceCount = null;
		this.qop =null;
		this.algorithm = null;
		this.entity_body = null;
	};

	authenticate.prototype.register = function(message){
		/*if (transaction.sended){
			console.log("WWW-Authenticate error")
			return ;
		}*/	
		var head = message.authenticate ;	
		this.realm = head.realm	
		this.nonce = head.nonce;
		this.cnonce = head.cnonce;
		this.qop = head.qop;
		this.algorithm = head.Digestalgorithm ? head.Digestalgorithm : "md5" ;	
		if ( message.rawBody )
			this.entity_body = message.rawBody;

		switch (this.algorithm.toLowerCase()){
			case "md5" :
				this.response = this.digestMD5(message.method);
			break;
		}

		var method = "Authorization: ";
		var line = "Digest username=" +stringify(this.userName)+", realm="+stringify(this.realm)+ ", nonce=" + stringify(this.nonce) +", uri="+stringify(this.uri)+", algorithm="+this.algorithm+", response="+stringify(this.response);
		this.lineResponse = method + line ; 
		//if ( ! transaction.sended){
			//var transac = this.dialog.createTransaction(message.to) ;
			var transac = message.transaction
			var request = transac.createRequest(this.dialog.sdp);
			//console.log(request);
			request.header.response=this.lineResponse;
			transac.sendRequest();
			transac.sended = true;
		//}

	};
	
	authenticate.prototype.digestMD5 = function(method){
		var A1 = digest.generateA1(this.userName, this.realm, this.password, this.nonce, this.cnonce );
		var A2 = digest.generateA2(method, this.uri, this.entity_body, this.qop );
		return  digest.generateResponse(A1, this.nonce, this.nonceCount, this.cnonce, this.qop, A2);
	};


	var reg =/^([^=]+)=(.+)$/;
	var parserAuthenticate = function(str){
		var ret = str.replace(/"/g,"");
		ret = ret.replace(/Digest /g,"");
		var head = ret.split(",");
		var obj = []
		for (var i= 0 ; i < head.length ; i++){
			var res = reg.exec(head[i]);
			var key = res[1].replace(" ","");
			if (res && key)
				obj[key] = res[2]
		}	
		return obj
	};





	/*
 	 *
 	 * CLASS HEADER SIP
 	 *
 	 *
 	 *
 	 */
	var regHeaders = {
		line:/\r\n|\r|\n/,
		headName:/: */,
		Allow:/, */,
		Via:/; */,
		CallId:/^(.*)@.*$/,
		algorithm:/= */,
		fromTo:/(.*)<sip:(.*)>/
	};

	var parsefromTo = function(type, value){
		var sp = value.split(";");
		this.message[type+"Tag"] = null;
		var res = sp.shift();
		var res2 = regHeaders.fromTo.exec(res);
		this.message[type+"Name"] = (res2.length > 2)  ? res2[1].replace(" ","").replace(/"/g,"") : "" ;
 	        this.message[type] = (res2.length >2)  ? res2[2].replace(" ","") : res2[1].replace(" ","") ;	
		for (var i = 0 ; i < sp.length ;i++){
			var res3 = sp[i].split("=");
			if(res3[0].replace(" ","") === "tag")
				this.message[type+"Tag"] = res3[1] ;
			else
				this.message[res3[0]] = res3[1] ;
		}
		return value;
	};

	var headerSip = function(message, header){
		this.message = message; 
		this.method = null; 
		this.firstLine = null;
		this.Via = [];
		if (header && typeof header === "string"){
			try {
				this.parse(header);
			}catch(e){
				console.log(e)
			}
		}
	};

	headerSip.prototype.parse = function(header){
		var tab = header.split(regHeaders.line);
		var type = tab.shift();
		this.firstLine = type.split(" ");
		$.each(tab, function(index, ele){
			var res = regHeaders.headName.exec(ele);
			var size = res[0].length;
			var headName = res.input.substr(0,res.index);
			var headValue = res.input.substr(res.index+size);
			var func = "set"+headName;
			if (func === "setVia"){
				var index = this.Via.push(headValue);	
				this[headName][index-1] = this[func](headValue, ele);
			}else{
				this[headName] = headValue;
				if (this[func]){
					this[headName] = this[func](headValue);	
				}	
			}
		}.bind(this))
		if (!this["Content-Type"])
			this.message.contentType = null;
	};

	headerSip.prototype.setFrom = function(value){
		parsefromTo.call(this, "from", value)	
		return value;
	};

	headerSip.prototype.setTo = function(value){
		parsefromTo.call(this, "to", value)
		return value;
	};

	headerSip.prototype["setWWW-Authenticate"] = function(value){
		this.message.authenticate = parserAuthenticate(value);
		/*var ele ={};
		var res = value.split(",")
		for (var i=0 ; i < res.length ;i++){
			var ret = regHeaders.algorithm.exec(res[i]);
			var size = ret[0].length;
			var headName = ret.input.substr(0,ret.index).replace(" ","");
			var headValue = ret.input.substr(ret.index+size).replace(/"/g,"");
			ele[headName] = headValue.replace(/"/g,"");
		}
		this.message.authenticate = ele ;*/
		return value;
	};

	headerSip.prototype.setDate = function(value){
		try{
			this.message.date = new Date(value)
		}
		catch(e){
			this.message.date = value;
		}
		return value
	};

	headerSip.prototype["setCall-ID"] = function(value){
		var res = regHeaders.CallId.exec(value);	
		if (res){
			this.message.callId =res[1]; 
			return res[1];
			
		}else{
			this.message.callId =value;	
			return value;
		}
	};

	headerSip.prototype.setCSeq = function(value){
		var res = value.split(" ");
		this.message.cseq = parseInt(res[0],10);
		this.message.method = res[1];
		return value;
	};

	var regContact = /<sip:(.*)>/g;
	headerSip.prototype.setContact = function(value){
		var parseValue = value.replace(regContact,"$1");
		var sp = parseValue.split(";");
		var contact = sp.shift();
 	        var tab = contact.split(":");	
		this.message.contact  = tab[0];
		this.message.rport = tab[1];
		for (var i = 0 ; i < sp.length ;i++){
			var res3 = sp[i].split("=");
			//console.log(res3[0] +" : "+  res3[1] );
			this["contact"+res3[0]] = res3[1]; 
		}
		return value; 
	};

	headerSip.prototype.setAllow = function(value){
		if (value ){
			return this.Allow.split(regHeaders.Allow);
		}else{
			return this.Allow;
		}
	};
	headerSip.prototype.setSupported = function(value){
		if (value ){
			return this.Supported.split(regHeaders.Allow);
		}else{
			return this.Supported;
		}
	};

	headerSip.prototype.setVia = function(value,raw){
		if (value){
			var res = value.split(regHeaders.Via);
			//console.log(res)
			var obj = {
				line :Array.prototype.shift.call(res),
				raw:raw
			};
			for (var i = 0 ; i< res.length ;i++){
				var tab = res[i].split('=');
				if ( tab ){
					if (tab[0] === "branch")
						this.branch = tab[1];
					obj[tab[0]] = tab[1];
				}
			}
			return obj
		}else{
			return value;
		}
	};
	

	/*
 	 *
 	 * CLASS BODY SIP
 	 *
 	 *
 	 *
 	 */
	var bodySip = function(message, body){
		message.rawBody = body ;
		this.size = message.contentLength;
		if ( this.size !== body.length ){
			//console.log("BODY LENGTH: "+body.length)
			//console.log("CONTENT LENGTH :"+this.size)
			throw new Error("BAD SIZE");
		}
		if (body){
			this.parse(message.contentType, body)
		}
	
	};
	bodySip.prototype.parse = function(type, body){
		switch (type){
			case "application/sdp":
				this.sdpParser(body);
			break;
			default:
				this.payload = body;
		}
	};

	bodySip.prototype.sdpParser = function(body){
		this.sdp = body || "";
	};

	/*
 	 *
 	 * CLASS REQUEST
 	 *
 	 *
 	 *
 	 */
	var sipRequest = function(transaction, bodyMessage, typeBody){
		this.transaction = transaction;
		this["request-uri"] = this.transaction.dialog.sip.server ; 
		this["request-port"] = this.transaction.dialog.sip.serverPort ; 
		
		this.type = "request";
		this.requestLine ={}; 
		this.buildRequestline();

		this.header = {};
		this.buildHeader();

		this.buildBody(bodyMessage || "", typeBody) ;
		//this.rawMessage = this.getMessage();	
	};

	var endline = "\r\n";
	var endHeader = "\r\n\r\n";
	sipRequest.prototype.buildRequestline = function(){
		this.requestLine.method = this.transaction.method.toUpperCase();
		this.requestLine.version = this.transaction.dialog.sip.version ;
		this.requestLine["request-uri"] = this["request-uri"] ;
	};

	sipRequest.prototype.getRequestline = function(uri){
		switch (this.transaction.method){
			case "REGISTER":
				return  this.transaction.method + " sip:" +this["request-uri"] + " " + this.requestLine.version + endline ;
			break;
			case "INVITE":
			case "BYE":
			case "ACK":
				return this.transaction.method + " " + "sip:"+this.transaction.to+"@"+this.transaction.dialog.sip.server +" " + this.requestLine.version + endline ;
			break;
			case "NOTIFY":
				return this.transaction.method + " " + "sip:"+this.transaction.to+"@"+this.transaction.dialog.sip.server +" " + this.requestLine.version + endline ;
			break;
		}
	};
	
	sipRequest.prototype.buildHeader = function(){
		//FIXE ME RPORT IN VIA PARSER 
		//console.log(this.transaction.dialog.sip.rport)
		
		var rport = this.transaction.dialog.sip.rport ;
		var from = this.transaction.from; //dialog.sip.userName ;
		//FIXME GET IP
		//var ip = this.transaction.dialog.sip.server ;
		var ip = this.transaction.dialog.sip.publicAddress;

		var fromSip = "<sip:"+this.transaction.from+"@"+ip+">" ; //"<sip:"+ this.sip.userName+"@"+this.sip.server+">";
		//var fromSip = "<sip:"+this.transaction.from+"@"+this.transaction.dialog.sip.server+">" ; //"<sip:"+ this.sip.userName+"@"+this.sip.server+">";

		var to = this.transaction.to ;
		var toSip = "<sip:"+this.transaction.to+"@"+this.transaction.dialog.sip.server+">";// "<sip:"+ this.to+"@"+this.sip.server+">";
		var tagTo = this.transaction.dialog.tagTo ? ";tag="+this.transaction.dialog.tagTo : "" ;

		//this.header.via  = "Via: "+this.transaction.dialog.sip.version+"/"+this.transaction.dialog.sip.settings.transport+" " +this["request-uri"]+":"+this["request-port"]+";rport;"+"branch=z9hG4bK16C8CB9433A5";	
		if ( rport ){
			this.header.via  = "Via: "+this.transaction.dialog.sip.version+"/"+this.transaction.dialog.sip.settings.transport+" " +ip+":"+rport+";"+"branch="+this.transaction.branch;
		}else{
			this.header.via  = "Via: "+this.transaction.dialog.sip.version+"/"+this.transaction.dialog.sip.settings.transport+" " +ip+":"+this["request-port"]+";"+"branch="+this.transaction.branch;	
		}	
		this.header.cseq = "CSeq: "+this.transaction.dialog.cseq + " " + this.transaction.method;
		this.header.from = "From: "+ from+ " " + fromSip + ";tag="+this.transaction.dialog.tagFrom ;
		//console.log("toSip : "+toSip);
		this.header.to = "To: "+ to + " "+ toSip + tagTo;
		this.header.callId = "Call-ID: " + this.transaction.dialog.callIdSip;
		this.header.expires = "Expires: " + this.transaction.dialog.expires;
		this.header.maxForward = "Max-Forwards: " + this.transaction.dialog.maxForward;
		this.header.userAgent = "User-Agent: " + this.transaction.dialog.sip.settings.userAgent;
		if ( rport )
			this.header.contact = "Contact: <sip:" +from+"@"+ip+":"+rport+";transport="+this.transaction.dialog.sip.settings.transport.toLowerCase()+">";
		else
			this.header.contact = "Contact: <sip:" +from+"@"+ip+";transport="+this.transaction.dialog.sip.settings.transport.toLowerCase()+">";
	};

	sipRequest.prototype.getHeader = function(){
		var head = "";
		for (var line in this.header ){
			head+=this.header[line]+endline;
		}
		return head ;
	};

	sipRequest.prototype.buildBody = function(body, type){
		this.header.contentLength  = "Content-Length: " + body.length ;
		if (type)
			this.header.contentType  = "Content-Type: " + type ;
		this.body = body || "" ;
	};

	sipRequest.prototype.getBody = function(){
		return this.body ;
	};
	

	sipRequest.prototype.getMessage = function(){
		//console.log(this.getRequestline() + this.getHeader() + endline + this.getBody())
		//console.log(this.getRequestline() + this.getHeader() + endline + this.getBody())
		return this.rawResponse = this.getRequestline() + this.getHeader() + endline + this.getBody() ;
	};

	/*
 	 *
 	 * CLASS RESPONSE
 	 *
 	 *
 	 *
 	 */

	var sipResponse = function(message, code ,messageCode, bodyMessage, typeBody){
		this.message = message ;
		this.transaction = message.transaction;
		this.dialog = message.dialog;
		this.responseLine ={}; 
		this.buildResponseLine(code ,messageCode);
		this.header =[];// message.header.messageHeaders;
		this.buildHeader();
		this.buildBody(bodyMessage || "", typeBody) ;

	};

	var codeMessage = {
		200	:	"OK"
	};

	sipResponse.prototype.buildHeader = function(){
		var rport = this.transaction.dialog.sip.rport ;
		var ip = this.transaction.dialog.sip.publicAddress;
		
		// from 
		var from = this.transaction.from ;
		var fromSip = "<sip:"+from+"@"+ip+">" ; 
		this.header.push ( "From: "+ from+ " " + fromSip + ";tag="+this.transaction.dialog.tagFrom) ;

		// to
		var to = this.transaction.to ;
		var toSip = "<sip:"+this.transaction.to+"@"+this.transaction.dialog.sip.server+">";
		var tagTo = this.transaction.dialog.tagTo ? ";tag="+this.transaction.dialog.tagTo : "" ;
		this.header.push ( "To: "+ to + " "+ toSip + tagTo);


		this.header.push(  "Call-ID: " + this.transaction.dialog.callIdSip);
		//this.header.push(  "Call-ID: " + this.message.callId);
		//this.header.push( "Expires: " + this.transaction.dialog.expires);
		this.header.push( "Max-Forwards: " + this.transaction.dialog.maxForward);
		this.header.push( "User-Agent: " + this.transaction.dialog.sip.settings.userAgent);
		//console.log(this.message.header.Via)

		for (var i = 0, j = 0   ; i<this.message.header.Via.length ; i++){
			if ( i != 0 ){
				this.header.push(this.message.header.Via[j++].raw);	
			}
		}
		this.header.push( "CSeq: "+this.transaction.dialog.cseq + " " + this.transaction.method);
		if ( rport ){
			this.header.push( "Contact: <sip:" +this.transaction.to+"@"+ip+":"+rport+";transport="+this.transaction.dialog.sip.settings.transport.toLowerCase()+">");
		}else{
			this.header.push( "Contact: <sip:" +this.transaction.to+"@"+ip+";transport="+this.transaction.dialog.sip.settings.transport.toLowerCase()+">");
		}
	};
	
	sipResponse.prototype.getHeader = function(){
		var head = "";
		for (var line in this.header ){
			head+=this.header[line]+endline;
		}
		return head ;
	};

	sipResponse.prototype.buildBody = sipRequest.prototype.buildBody ;

	sipResponse.prototype.getBody = sipRequest.prototype.getBody ;

	sipResponse.prototype.buildResponseLine = function(code, messageCode){
		this.responseLine.method = this.transaction.method.toUpperCase();
		this.responseLine.version = this.transaction.dialog.sip.version ;
		this.responseLine.code = code ;
		this.responseLine.message = messageCode || codeMessage[code] ;
	};

	sipResponse.prototype.getResponseline = function(){
		if (this.responseLine.method == "ACK")
			return 	this.responseLine.method +" "+ "sip:"+this.transaction.from+"@"+this.transaction.dialog.sip.server +" "+this.responseLine.version + endline ;		
		return  this.responseLine.version + " " + this.responseLine.code + " " + this.responseLine.message +  endline ;	
	};

	sipResponse.prototype.getMessage = function(){
		//console.log("RESPONSE : " +this.getResponseline() + this.getHeader() + endline + this.getBody())
		return this.rawResponse = this.getResponseline() + this.getHeader() + endline + this.getBody() ;
	};

	/*
 	 *
 	 * CLASS TRANSACTION
 	 *
 	 *
 	 *
 	 */
	var transaction = function(to, dialog){
		this.setMessage(to);
		if (! this.message ){
			this.to = to ;
			this.from = dialog.from ;
			this.cseq = ++dialog.cseq;
			this.dialog = dialog;
			this.message = null;
			this.method = dialog.method;
			this.branch = this.generateBranchId() ;
		}	
		this.response = null;
		this.request = null;
		this.intervalID = null;	
		this.timeInterval = 60000;
		this.error = null;
		this.nbSend = 0;		
		this.sended = false;
	};

	transaction.prototype.setMessage = function(message){
		if (message instanceof Message){
			this.message = message;
			this.to = this.message.toName
			this.from = this.message.fromName
			this.dialog = this.message.dialog;
			this.cseq = this.message.cseq;
			this.method = this.message.method;
			this.branch = this.message.header.branch;
			return message;
		}
		this.message = null;
		return null;
	};


	transaction.prototype.createRequest = function(body, typeBody){
		this.request = new sipRequest(this, body || "", typeBody);
		this.message = null;
		return this.request ;
	};

	transaction.prototype.sendRequest = function(){
		//console.log(this.request.getMessage())
		this.send(this.request.getMessage());
	};


	transaction.prototype.createResponse = function(code ,message, body, typeBody){
		this.response = new sipResponse(this.message, code, message, body , typeBody );
		return this.response ;
	};

	transaction.prototype.sendResponse = function(){
		this.send(this.response.getMessage());
	};

	var generateHex = function(){
		return Math.floor(Math.random()*167772150000000).toString(16) ;
	};
	transaction.prototype.generateBranchId = function(){
		var hex = generateHex();
		if ( hex.length === 12 )
			return "z9hG4bK"+hex;
		else
			return arguments.callee();
	};

	transaction.prototype.send = function(message){
		this.dialog.sip.send(message)
		++this.nbSend ;
		if (this.method !== "ACK"){
			/*this.intervalID = setInterval(function(){
				var lastMessage = message ;
				if ( this.message ){
					this.clear();
				}else{
					//console.log("send" + message)
					this.dialog.sip.send(lastMessage);
					++this.nbSend ;
				}
			}.bind(this),this.timeInterval);*/
		}
	};
	
	transaction.prototype.clear = function(){
		//console.log("clear transaction cseq : "+ this.cseq)
		if ( this.intervalID ){
			clearInterval(this.intervalID);
			this.intervalID = null;
		}
	};
	
	transaction.prototype.ack = function(){
		this.method = "ACK";
		var request = this.createResponse(200,"OK")
		this.sendResponse();
		this.clear();
	};


	/*
 	 *
 	 * CLASS MESSAGE
 	 *
 	 *
 	 *
 	 */

	var firstline = function(firstLine){
		var method = firstLine[0];	
		var code = firstLine[1];
		if ( method === "BYE" && ! code){
			code = 200 ;
		}
		var message = "";
		for (var i = 2 ;i<firstLine.length;i++){
			message+=firstLine[i]+" ";	
		}
		return {
			method : method,
			code : code,
			message : message
		}	
	
	};

	var parseMessage = function(message){
		var splt = message.split(/\r\n\r\n/);
		if (splt.length && splt.length <= 2){
			this.header = new headerSip(this,  splt[0]);
			this.contentLength = parseInt(this.header["Content-Length"],10);
			if ( splt[1] )
				this.body = new bodySip(this, splt[1]);
			else
				this.body = new bodySip(this, ""); ;
			this.statusLine =firstline(this.header.firstLine) 
			this.code = parseInt( this.statusLine.code, 10);
		}else{
			throw splt ;
		}
	};

	var Message = function(response, sip){
		this.sip = sip ;
		if (response){
			this.rawResponse = response;
			this.header = null;
			this.body = null;
			this.statusLine = null;
			try {
				parseMessage.call(this, response);
			}catch(e){
				throw e
			}
			//var callid = this.header["Call-ID"] ;
			//this.dailog = this.dialogs[callid] ;
		}
		this.dialog = this.sip.dialogs[this.header["Call-ID"]];
		if ( ! this.dialog ){
			this.dialog = new dialog(this, this.sip);
			this.sip.dialogs[this.dialog.callId] = this.dialog;
		}
		this.transaction = this.dialog.transactions[this.cseq];
		if ( ! this.transaction) {
			this.transaction = this.dialog.createTransaction(this) ;
		}else{
			this.transaction.setMessage(this)
		}	
		//console.log(this)
	}; 

	Message.prototype.getHeader = function(){
		return this.header;
	};

	Message.prototype.getBody = function(){
		return this.body;
	};

	Message.prototype.getStatusLine = function(){
		return this.statusLine;
	};

	


	/*
 	 *
 	 * CLASS DIALOG
 	 *
 	 *
 	 *
 	 */
	var dialog = function(method, sip){

		this.sip = sip;
		this.transactions = {};
		//this.id = ++identifiant;
		this.from = this.sip.userName;
		this.maxForward = this.sip.settings.maxForward;
 		this.expires = this.sip.settings.expires;

		if (method instanceof Message ){
			this.cseq = method.cseq; 
			this.method = method.method ;
			this.callId = method.callId;
			this.callIdSip = this.callId+"@"+this.sip.server;
			this.to = method.fromName;
			//FIXME
			//this.tagTo = method.fromTag 
			this.tagTo = method.toTag || parseInt(Math.random()*1000000000,10); 
			//FIXME
			//this.tagFrom = method.toTag || parseInt(Math.random()*1000000000,10); 
			this.tagFrom = method.fromTag ; 
			//this.createTransaction(this.to, this.cseq, method.header.branch) ;

		}else{
			this.tagFrom = parseInt(Math.random()*1000000000,10);
			//this.tagTo = parseInt(Math.random()*1000000000,10);
			this.cseq = 0;
			this.method = method;
			this.callId = parseInt(Math.random()*1000000000,10);
			this.callIdSip = this.callId+"@"+this.sip.server;
			this.currentTransaction = null;	
		}
		if (sip.authenticate) {
			this.authenticate = new authenticate(this, sip.userName , sip.settings.password) 
		}
	};

	dialog.prototype.createTransaction = function(to){
		this.currentTransaction = new transaction(to , this);
		this.transactions[this.cseq] = this.currentTransaction;
		return this.currentTransaction;
	};

	dialog.prototype.clearTransaction = function(cseq){
		if (cseq in this.transactions){
			this.transactions[cseq].clear();
		}
		delete this.transactions[cseq];
	};
	
	dialog.prototype.register = function(){
		var trans = this.createTransaction(this.from);
		//this.cseqType = this.cseq+ " REGISTER";
		var request = trans.createRequest();
		trans.sendRequest();
		this.to = this.from ;
		return trans;
				
	};

	dialog.prototype.invite = function(userTo, description, type){
		this.to = userTo ;
		this.sdp = description.sdp ;
		var trans = this.createTransaction(userTo);
		if (description.sdp){
			var Type = "application/sdp" 
			var request = trans.createRequest(this.sdp, Type);
			trans.sendRequest();
		}else{
			var request = trans.createRequest(description, type);
			trans.sendRequest();
		}
		return trans;
	};

	
	dialog.prototype.notify = function(userTo, notify, typeNotify){
		this.notify = notify ;
		var trans = this.createTransaction(userTo);
		if (typeNotify){
			var type = typeNotify; 
			var request = trans.createRequest(this.notify, typeNotify);
			trans.sendRequest();
		}else{
			var request = trans.createRequest(this.notify, null);
			trans.sendRequest();
		}
		return trans;
	};

	dialog.prototype.by = function(){
		this.method = "BYE";
		if (this.to){
			var trans = this.createTransaction(this.to);
			var request = trans.createRequest();
			trans.sendRequest();
		}
	};

	/*
 	 *
 	 *	CLASS SIP
 	 *
 	 *
 	 *
 	 */
	var defaultSettings = {
		expires		: 1800,
		registerTimeout : 60000,
		maxForward	: 70,
		version		: "SIP/2.0",
		userAgent	: "nodefony",
	 	portServer	: "5060",
	 	userName	: "userName",		
	 	pwd		: "password",
		transport	: "TCP"
	};

	var onStart = function(){
		//var diagReg = this.register()	
		this.notificationsCenter.fire("onStart",this);
	};

	var onStop = function(){
		this.stop();	
	};

	var onMessage = function(response){
		try {
			//console.log(this.fragment)
			if ( this.fragment ){
				this.lastResponse += response;
				//console.log(this.lastResponse);
			}else{
				this.lastResponse = response ;
			}
			var message = new Message(this.lastResponse, this);
			this.fragment = false ;
		}catch(e){
			// bad split 
			for ( var i = 0 ; i < e.length ; i++){
				if ( e[i] ){
					try {
						onMessage.call(this, e[i]);			
						continue;
					}catch(e){
						//console.log("FRAGMENTE")
						this.fragment = true ;	
						return ;		
					}
				}
			}	
			return ;
				
		}
		//console.log("SIP RECEIVE :"+ response);
		//console.log(message.method)
		switch (message.method){
			case "REGISTER" :
					this.rport = message.header.Via[0].rport;
					switch ( message.code ){
						case 401 :
						case 407 :
							if (this.registered === 200 ) {
								clearInterval(this.registerInterval);
								this.registerInterval = null ;	
							}else{
								if ( this.registered === 401 || this.registered === 407){
									break; 
								}
								this.registered = message.code ;
							}
							
							this.authenticate = new authenticate(message, this.userName , this.settings.password) ;
							this.authenticate.register(message);
							
						break;	
						case 403 :
							this.registered = message.code ;
							//console.log("Forbidden (bad auth)")
							this.authenticate = false;
						break;	
						case 200 :
							if (this.registered === 401 ) {
								this.notificationsCenter.fire("onRegister",message);
							}
							this.registered = message.code ;
							this.registerInterval = setInterval(function(){
								message.dialog.register();
							}.bind(this) ,this.settings.registerTimeout);
						break;
						default:
							//console.log(message);
							this.notificationsCenter.fire("on"+message.code,message);
						break;
					}
				
			break;
			case "INVITE" :
				this.rport = message.rport || this.rport;
				if (( typeof message.code ) === "number" &&  ! isNaN (message.code) ){
					switch(message.code){
						case 401 :
							this.authenticate = new authenticate(message, this.userName , this.settings.password) ;
							this.authenticate.register(message);
						break;
						case 180 : 
							this.notificationsCenter.fire("onRinging",message);
						break;
						case 100 : 
							//console.log("case 100 trying")
							this.notificationsCenter.fire("onTrying",message);
						break;
						case 603 : 
							this.notificationsCenter.fire("onDecline",message);
						break;
						case 403 :
							//console.log("Forbidden (bad auth)")
							this.authenticate = false;
							this.notificationsCenter.fire("onError",message);
						break;
						case 408 :
							//console.log("Time out")
							this.notificationsCenter.fire("onTimeout",message);
						break;
						case 404 :
							this.notificationsCenter.fire("onError",message);
						break;
						case 480 :
							this.notificationsCenter.fire("onError",message);
						break;
						case 484 :
							this.notificationsCenter.fire("onError",message);
						break;
						case 488 :
							this.notificationsCenter.fire("onError",message);
						break;
						case 477 :
							//console.log("send failed")
							//console.log(message)
							this.notificationsCenter.fire("onError",message);
						break;
						case 200 :
							//console.log("case 200")
							//console.log(message);
							//ACK
							message.transaction.ack();
							this.notificationsCenter.fire("onCall",message);
						break;
						case 500 :
							this.notificationsCenter.fire("onError",message);
						break;
						default:
							this.notificationsCenter.fire("on"+message.code,message);
						break;
					}
				}else{
					//console.log("INVITE :::::::::::::::::::: FROM : "+message.fromName)
					this.notificationsCenter.fire("onInvite", message, message.dialog);
				}
			break;
			case "ACK" :
				//console.log("ACK");
				//TODO manage interval messages
			break;
			case "BYE" :
				switch(message.code){
					case 200 :
						//console.log("200")
						this.notificationsCenter.fire("onBye",message);
					break;
					default :
						this.notificationsCenter.fire("onBye",message);
						var request = message.transaction.createResponse(200,"OK", null)
						message.transaction.sendResponse();
				}
				
			break;
			default:
				console.log("DROP :"+ message.method + " "+" code:"+message.code );
				this.notificationsCenter.fire("onError",message);
			break;
		}
		this.notificationsCenter.fire("onMessage",message);
	};

	var SIP = function(server, transport, settings){
		//console.log(this)	
		this.settings = stage.extend({}, defaultSettings, settings);
		//this.settings.url = stage.io.urlToOject(url)
		this.notificationsCenter = stage.notificationsCenter.create(this.settings, this);
		this.dialogs = {};
		this.version = this.settings.version;
		this.fragment = false;	

		//transport
		this.transport = transport ;

		// GET REMOTE IP
		//console.log(this.transport)
		if (this.transport.publicAddress){
			//this.publicAddress = this.transport.publicAddress ;	
			this.publicAddress = this.transport.domain.hostname ;	
			//console.log(this.publicAddress)
		}else{
			this.publicAddress = server ;	
		}

		this.transport.listen(this, "onSubscribe", function(service, message){
			if (service === "SIP" || service === "OPENSIP")
				onStart.call(this, message);
		} );
		
		this.transport.listen(this, "onUnsubscribe", function(service, message){
			if (service === "SIP" || service === "OPENSIP")
				onStop.call(this, message);
		} );
		this.transport.listen(this, "onMessage", function(service, message){
			if (service === "SIP" || service === "OPENSIP")
				onMessage.call(this, message);
		} );

		this.transport.listen(this, "onClose", function( message){
			this.notificationsCenter.fire("onQuit",this);
		} );

		
		// URL
		this.server = server ;
		this.serverPort = this.settings.portServer;
		//this.server = this.settings.url.hostname;
		//this.serverPort = this.settings.url.port;
		//this.urnServer = this.settings.url.requestUri ;
		//this.url =  this.settings.url.href ;

		// LOGIN
		this.userName = this.settings.userName ;
		this.authenticate = false;
		this.registerInterval = null;
		this.registered = null ;


	};

	SIP.prototype.listen = function(){
		return this.notificationsCenter.listen.apply(this.notificationsCenter, arguments);
	};

	SIP.prototype.start = function(){
		this.state = "CONNECTING";
		this.notificationsCenter.fire("onStateChanged", this.state);
		//this.transport.start(this.settings);	
	};

	SIP.prototype.stop = function(){
		this.state = "DISCONNECTING";
		this.notificationsCenter.fire("onStateChanged", this.state);
		if (this.registerInterval){
			clearInterval(this.registerInterval);	
		}
		//this.transport.stop();
	};

	SIP.prototype.send = function(data){
		//console.log("send : " +data)
		this.transport.sendMessage("OPENSIP", data );
	};

	SIP.prototype.register = function(){
		this.diagRegister = new dialog("REGISTER", this);
		this.dialogs[this.diagRegister.callId] = this.diagRegister;
		this.diagRegister.register();
		
		return this.diagRegister;
	};

	SIP.prototype.invite = function(userTo, description){
		var diagInv = new dialog("INVITE", this);
		this.dialogs[diagInv.callId] = diagInv;
		diagInv.invite(userTo, description);
		return diagInv; 
	};

	SIP.prototype.notify = function(userTo, notifyData, type){
		var diagInv = new dialog("NOTIFY", this);
		this.dialogs[diagInv.callId] = diagInv;
		return diagInv.notify(userTo, notifyData, type);
		//return diagInv; 
	};

	SIP.prototype.byAll = function(){
		for(var dia in this.dialogs){
			this.by(dia);	
		}	
	};

	SIP.prototype.clear = function(){
		if (this.diagRegister){
			this.diagRegister.by();	
		}
		for (var diag in this.dialogs ){
			this.dialogs[diag].by();	
		}
		this.stop();
		//this.transport.stop();
		//this.transport = null ;	
	} 

	SIP.prototype.by = function(callId){
		if( ! callId){
			this.clear();
			this.notificationsCenter.fire("onQuit",this);	
		}else{
			if (callId in this.dialogs ){
				this.dialogs[callId].by();	
			}
		}
	};


	return SIP;
});
