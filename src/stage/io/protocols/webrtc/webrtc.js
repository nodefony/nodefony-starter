stage.register.call(stage.io.protocols, "webrtc",function(){




	var defaultResponse = {
		version		: "WEBRTC/1.0",
		userAgent	: "nodefony",
	};


	var response = function(dialog){
		this.dialog =  dialog ;
		this.response = $.extend({}, defaultResponse);
	}

	response.prototype.send = function(data){
		var res = $.extend(this.response, {
			type:		this.dialog.method,
			from :		this.dialog.from,
			idConnection:	this.dialog.idConnection,
			callId:		this.dialog.callId,
			to:		this.dialog.to
		}, data);
		//console.log(res);
		try {
			return this.dialog.webrtc.send.call(this.dialog.webrtc, JSON.stringify(res) );
		}catch(e){
			throw new Error(" response webrtc error: "+e.message);
		}
	}
	
	var dialog = function(method, protocol){
		this.webrtc = protocol;
		this.from = this.webrtc.userName;
		this.to = this.webrtc.userName;
		if ( this.webrtc.idConnection) {
			this.idConnection = this.webrtc.idConnection ;
		}else{
			throw new Error("DIALOG WEBRTC no  id connection try to connect service !!");
		}

		if (method instanceof Message ){
			this.method = method.type ;
			this.callId = method.callId;
			this.to = method.from;
		}else{
			this.method = method;
			this.callId = parseInt(Math.random()*1000000000,10);
		}
	}

	

	dialog.prototype.createResponse = function(){
		return new response(this) ;	
	}

	dialog.prototype.register = function(user, password){
		if ( user && password){
			var data = {
				userName:	user,
				password:	password,
			};
		}
		var res = this.createResponse();	
		
		res.send( data || {} );
		return res;		
	};


	dialog.prototype.candidate = function(candidate){
	
		var data = candidate ; 

		var res = this.createResponse();	
		res.send( data || {} );
		return res;
	
	}


	dialog.prototype.invite = function( data){
		this.to = data.to || this.to ;
		var res = this.createResponse();			
		res.send( data || {} );
		return res;	

	}


	dialog.prototype.answer = function(to, sessionDescription){
		var data = {
			sessionDescription:sessionDescription,
			code:	200
		};
		this.to = to ;
		var res = this.createResponse();			
		res.send( data || {} );
		return res;		
	
	}
	

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

	dialog.prototype.by = function(data){
		this.method = "BYE";
		this.to = data ? data.to : this.to ;
		var res = this.createResponse();			
		res.send( data || {} );
		return res;
	};




	/*
 	 *
 	 *	PROTOCOL
 	 *
 	 */
	var Protocol = function(server , transport, settings){
		this.settings = settings ;
		this.userName = this.settings.userName ;
		this.password = this.settings.password ;
		this.notificationsCenter = stage.notificationsCenter.create(this.settings, this);
		this.dialogs = {} ;
		this.connect(server, transport, settings);		
	};

	Protocol.prototype.connect = function(server, transport, settings){
	
		if ( ! transport ){
			var isSecure = stage.io.isSecure(server) ;
			if (/^http[s]?:\/\//.test(server)){
				server = server.replace(/^http[s]?:\/\/(.*)/,"$1") ; 
			}
			var wsserver = isSecure ? "wss://"+server : "ws://"+server ;
			this.transport = new stage.io.transports.websocket(wsserver, settings);
		}else{
			this.transport = transport ;		
		}	
		this.transport.listen(this,"onConnect",this.onMessage );
		this.transport.listen(this,"onMessage",this.listen(this,"onMessage",this.onMessage) );
		this.transport.listen(this,"onError",this.listen(this,"onError"));
		this.transport.listen(this,"onClose",this.listen(this,"onClose"));
	}


	Protocol.prototype.listen = function(){
		return this.notificationsCenter.listen.apply(this.notificationsCenter, arguments);	
	};

	Protocol.prototype.send = function(){
		if ( this.transport )
			return this.transport.send.apply(this.transport,arguments);	
		throw new Error("webrtc prototcole no transport find try to connect !!");
	};

	Protocol.prototype.cleanDialog = function(message){
		var dialogId = message.callId
		delete	this.dialogs[ dialogId ] ;
	};


	Protocol.prototype.register = function(user, password){
		var diagReg = new dialog("REGISTER", this);
		this.dialogs[diagReg.callId] = diagReg;
		diagReg.register(user, password);
		return diagReg; 
	};


	Protocol.prototype.invite = function(userTo, description){
		var diagInv = new dialog("OFFER", this);
		this.dialogs[diagInv.callId] = diagInv;
		diagInv.invite({
			to :	userTo ,
			sessionDescription: description.sdp,
			//code:200
		});
		return diagInv; 
	};

	Protocol.prototype.by = function(callId){ 
		if( this.dialogs[callId] ){
			this.dialogs[callId].by();	
		}else{
			throw new Error("Dialog error already close ! ");
		}

	}

	
	Protocol.prototype.candidate = function(candidate){
		var diagCandidate = new dialog("CANDIDATE", this);
		this.dialogs[diagCandidate.callId] = diagCandidate;
		diagCandidate.candidate(candidate);
		return diagCandidate; 
	};



	var Message = function(response, webrtc){
		this.webrtc = webrtc ;
		this.rawResponse =  response ;
		if (response){
			try {
				this.response = this.parse( response );
					
			}catch(e){
				throw e ;
			}
		}else{
			throw new Error("Message bad  response ");
		}
		if ( this.rawResponse.type == "message" && this.response.type != "CONNECT"){
			this.dialog = this.webrtc.dialogs[this.callId];
			//console.log(this.callId)
			if ( ! this.dialog ){
				this.dialog = new dialog(this, this.webrtc);
				this.webrtc.dialogs[this.callId] = this.dialog;
			}
		}
	}; 

	Message.prototype.parse = function( message ){
		if (stage.typeOf( message ) == "string" ){
			try{ 
				var res =  JSON.parse(message);
			}catch(e){
				throw new Error("Message response error JSON parse  : " + e.message );
			}
			return message ;	
		}

		switch ( message.type ){
			case "open":
				this.type = "OPEN" ;
				return {
					type : "OPEN" 
				}
			break;
			case "message":
				if (message.data ){
					try{ 
						var res =  JSON.parse(message.data);
						this.type = res.type ;	
						this.callId = res.callId ;
						this.code = res.code ;
						this.idConnection = res.idConnection;
					}catch(e){
						throw new Error("Message response error JSON parse  : " + e.message );
					}
					return res ;	
				}
				throw new Error("Message response not have data attibute");
			break;
		}
	}


	Protocol.prototype.onMessage = function(msg){

		try {
			var message = new Message( msg , this)
		}catch(e){
			throw new Error("Bad message webrtc : "+e.message);	
		}

		//console.log("EVENT :" + message.type)
		//console.log(  message)
		switch(message.type){
			case "CONNECT" :
				this.idConnection = message.idConnection;
				this.notificationsCenter.fire("onConnect", message);
			break;
			case "REGISTER" :
				switch (message.code){
					case "200" :
						this.notificationsCenter.fire("onRegister", message)
						this.cleanDialog(message);
					break;
					case "409" :
						this.notificationsCenter.fire("onError", message)
						this.cleanDialog(message);
					break;
				}	
			break;
			case "OFFER" :
				switch ( message.response.code ){
					case 180 : 
						this.notificationsCenter.fire("onRinging",message);
					break;
					case 100 : 
						this.notificationsCenter.fire("onTrying",message);
					break;
					case 200 :
						this.notificationsCenter.fire( "onCall",  message, message.dialog);	
					case 201 :
						// candidate
						this.notificationsCenter.fire( "onCandidate",  message, message.dialog);	
					break;
					case 603 :
						this.notificationsCenter.fire("onDecline",message);
						this.cleanDialog(message);
					break;
					case 404 : 
						this.notificationsCenter.fire("onError",message.type, message.code, message);
					break;
					default:
						this.notificationsCenter.fire( "onInvite",  message, message.dialog);
						
				}
			break;
			case "BYE" :
				this.notificationsCenter.fire( "onBye",  message);	
				message.dialog.by();
				this.cleanDialog(message);
			break;
			case "CANDIDATE" :
				this.notificationsCenter.fire( "onCandidate",  message.response, message.dialog);
			break;
			case "OPEN" :
				this.notificationsCenter.fire("onOpen", message.rawResponse);
			break;
			default:
				
		}	
	};
	
	return Protocol;
});
