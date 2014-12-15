/*
 *
 *	WEBRTC
 *
 *
 */

stage.register("webRtc",function(){


		

	var parseSdp = function(sdp){
		console.log("parse sdp ")	
		var sdpLines = sdp.split('\r\n');
		var newline = "";
		// Search for m line.
		for (var i = 0; i < sdpLines.length; i++) {
			var line = sdpLines[i];
			if (line.search('m=audio') !== -1) {
				line = line.replace("SAVPF", "SAVP")	
			}
			newline+=line+"\r\n";
		}
		
		return newline;
	}



	var RTCPeerConnection = null;	
	/*
 	 *
 	 *	UPDATER WEBRTC MULTI BROWSER
 	 *
 	 */
	//FIXME updater.js 
	var updater = function(){
		try {
			if (stage.browser.Webkit){
  				// The RTCPeerConnection object.
  				RTCPeerConnection = webkitRTCPeerConnection;
  				
  				// New syntax of getXXXStreams method in M26.
  				if (!webkitRTCPeerConnection.prototype.getLocalStreams) {
					webkitRTCPeerConnection.prototype.getLocalStreams = function() {
						return this.localStreams;
					};
					webkitRTCPeerConnection.prototype.getRemoteStreams = function() {
						return this.remoteStreams;
					};
  				}
				return true;
			}
			if (stage.browser.Gecko){
		
  				// The RTCPeerConnection object.
  				RTCPeerConnection = mozRTCPeerConnection;

  				// The RTCSessionDescription object.
  				RTCSessionDescription = mozRTCSessionDescription;

  				// The RTCIceCandidate object.
  				RTCIceCandidate = mozRTCIceCandidate;

  				return true;
			}
			if (stage.browser.Opera){
				RTCPeerConnection = RTCPeerConnection
				return true;
			}
			stage.ui.error("Browser does not appear to be WebRTC-capable")
			return false;
		}catch (e){
			stage.ui.error("Browser does not appear to be WebRTC-capable")
		}
	}();


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
		if ( ! transport ){
			var wsserver = "ws://"+server ;
			this.transport = new stage.io.transports.websocket(wsserver, settings);
		}else{
			this.transport = transport ;		
		}	
		this.transport.listen(this,"onConnect",this.listen(this,"onConnect",this.onMessage) );
		this.transport.listen(this,"onMessage",this.listen(this,"onMessage",this.onMessage) );
		this.transport.listen(this,"onError",this.listen(this,"onError"));
		this.transport.listen(this,"onClose",this.listen(this,"onClose"));	
	};

	Protocol.prototype.listen = function(){
		return this.notificationsCenter.listen.apply(this.notificationsCenter, arguments);	
	};


	Protocol.prototype.send = function(){
		return this.transport.send.apply(this.transport,arguments);	
	};

	Protocol.prototype.register = function(user, passwd, idConnection){
		//this.userName = user ;
		if (this.transport){
			var obj ={
				type		: "REGISTER",
				user		: this.userName,
				password	: this.password,
				idConnection	: idConnection	
			};	
			this.transport.send(JSON.stringify(obj));
		}
	};	

	Protocol.prototype.invite = function(to, sessionDescription){
		if (this.transport){
			var obj ={
				type		: "OFFER",
				from		: this.userName,
				to		: to,
				sessionDescription : sessionDescription.sdp
			};	
			this.transport.send(JSON.stringify(obj));
		}
	};

	Protocol.prototype.answer = function(to, sessionDescription){
		if (this.transport){
			var obj ={
				type:"ANSWER",
				sessionDescription :sessionDescription.sdp,
				to : to,
				from :this.settings.userName
			};	
			//console.log(obj)
			this.transport.send(JSON.stringify(obj));
		}
	};
	
	Protocol.prototype.onMessage = function(msg){
		if (msg.data)
			var message = JSON.parse(msg.data)
		else
			return ;
		//console.log("EVENT :" + message.type)
		switch(message.type){
			case "CONNECT" :
				this.idConnection = message.idConnection;
				this.register(null, null, this.idConnection);
				this.notificationsCenter.fire("onConnect", message);
			break;
			case "REGISTER" :
				switch (message.code){
					case "200" :
						this.notificationsCenter.fire("onRegister", message)
					break;
				}	
			break;
			case "OFFER" :
				this.notificationsCenter.fire( "onOffer",  message);
	
			break;
			case "ANSWER" :
				this.notificationsCenter.fire( "onAnswer",  message);	
			break;
			case "BY" :
				this.notificationsCenter.fire( "onClose",  message);	
			break;
			case "CANDIDATE" :
				
				this.notificationsCenter.fire( "onCandidate",  message);
			break;
			default:
				
		}	
	};
	


	/*
 	 *
 	 *	CLASS USER
 	 *
 	 */

	var userSettings = {
		constraints	: { mandatory: { 'OfferToReceiveAudio': true, 'OfferToReceiveVideo': true } },
		constraintsOffer: stage.browser.Gecko ? {'mandatory': {'MozDontOfferDataChannel':true}} : null
	};


	var password = {};
	var User =function(userName, settings){
		this.name = userName
		this.settings = stage.extend({}, userSettings, settings );
		this.audio = this.settings.constraints.mandatory.OfferToReceiveAudio ;
		this.video = this.settings.constraints.mandatory.OfferToReceiveVideo ;
		this.mediaStream = null ;
		this.description = "" ;

	}; 


	User.prototype.createMediaStream = function(succesCallback, errorMedia){
		this.mediaStream = new stage.media.mediaStream(null, {
			audio: this.audio,
			video:this.video,
			onSucces:succesCallback,
			onError:errorMedia
		});
	};

	User.prototype.setDescription = function(desc){
		this.description = desc ;
	};



	


	/*
 	 *
 	 *	CLASS TRANSACTION
 	 *
 	 */

	var Transaction = function(webrtc, from, to){
		this.webrtc = webrtc ;
		this.protocol =  webrtc.protocol;
		this.from = from ;
		this.to = to;
		this.RTCPeerConnection = this.createPeerConnection() ;
		this.RTCPeerConnection.addStream(this.from.stream)
		this.candidates = [];
	};

	Transaction.prototype.createOffer = function(){
		return  this.RTCPeerConnection.createOffer(function(sessionDescription){
			try{
				this.from.setDescription(this.RTCPeerConnection.setLocalDescription(sessionDescription));
				//this.RTCPeerConnection.startIce();
			}catch(e){
				throw e;
			}
			var dialog = this.webrtc.protocol.invite(this.to.name, sessionDescription);
			this.callId = dialog.callId ;
		}.bind(this), this.webrtc.listen(this, "onError"), this.from.settings.constraintsOffer);
	};


	Transaction.prototype.createPeerConnection = function(){
		try {	
			this.RTCPeerConnection = new RTCPeerConnection( location.search.indexOf('turn=true') !== -1 ? this.webrtc.settings.TURN : this.webrtc.settings.STUN, this.webrtc.settings.optional );
			//console.log(pc);
			this.RTCPeerConnection.onicecandidate = function (event) {
				//console.log("onicecandidate")
				//console.log(event)
				//console.log("local:  " + JSON.stringify(event.candidate));
				if (event.candidate){
					/*var ele = {
						type: 'CANDIDATE',
						label: event.candidate.sdpMLineIndex,
						id: event.candidate.sdpMid,
						candidate: event.candidate.candidate,
						from: this.from.name,
						to:this.to.name
					}*/
					//console.log(JSON.stringify(event.candidate))
					//var candidate = new RTCIceCandidate(event.candidate);
					//this.RTCPeerConnection.addIceCandidate(candidate,function(){console.log("Succes Candidate")},function(e){console.log("Error candidate")});
					this.candidates.push(event.candidate);

				}
				if (this.protocol === "SIP"){
					//this.protocol.notify(this.to, "onicecandidate","application/text")	
				}else{
					if (event.candidate){
						var ele = {
							type: 'CANDIDATE',
							label: event.candidate.sdpMLineIndex,
							id: event.candidate.sdpMid,
							candidate: event.candidate.candidate,
							from: this.from.name,
							to:this.to.name
						}
						//console.log(ele)
						//this.webrtc.protocol.send(JSON.stringify(ele));
					}
				}
			}.bind(this);


			// let the "negotiationneeded" event trigger offer generation
			/*pc.onnegotiationneeded = function () {
				console.log("pass onnegotiationneeded")
			}.bind(this)*/


			this.RTCPeerConnection.onaddstream = function(event){
				//console.log(event)
				this.setRemoteStream( event)
			}.bind(this);
 		       
			return this.RTCPeerConnection;
		}catch (e){
			//console.log(e)
			this.webrtc.fire("onError", e);
		}

	};

	Transaction.prototype.setRemoteStream = function(event){
		if (event){
			//console.log(event.stream.getVideoTracks());
			this.to.createMediaStream(null, null);
			this.to.mediaStream.setStream(event.stream);
			if (event.type === "video" || event.type === "addstream" ){
				this.webrtc.notificationsCenter.fire( "onRemoteStream", event, this.to.mediaStream, this);
			}
			//var videoTracks = this.remoteStream.getVideoTracks();
			//if (videoTracks.length === 0 /*|| remoteVideo.currentTime > 0*/) {
			//}else{
			//	setTimeout(this.onRemoteStream.bind(this), 100);
			//}
		}
	};


	Transaction.prototype.setRemoteDescription = function(type, user, description, dialog){
		var desc = {
			type:type,
			sdp:description
		}
		this.remoteDescription = this.RTCPeerConnection.setRemoteDescription(
			new RTCSessionDescription(desc),
			function(){
				//console.log("setRemoteDescription")
				if (this.RTCPeerConnection.remoteDescription.type == "offer"){
					this.doAnswer(dialog);
					this.webrtc.notificationsCenter.fire("onRemoteDescription", this.from, this);
				}
			}.bind(this),
			this.webrtc.listen(this, "onError")			
		);
		return this.remoteDescription
	};


	Transaction.prototype.doAnswer = function(dialog) {
		return this.RTCPeerConnection.createAnswer(
			function(sessionDescription){
				this.from.setDescription(sessionDescription) ; 
				this.RTCPeerConnection.setLocalDescription(sessionDescription);
				this.webrtc.notificationsCenter.fire("onCreateAnwser", this.to, sessionDescription, this, dialog);
			}.bind(this),
			this.webrtc.listen(this, "onError"),
			this.from.settings.constraints
		);
	};

	Transaction.prototype.by = function(callId){
		this.protocol.by(callId || this.callId);	
	};


	Transaction.prototype.close = function(){
		this.RTCPeerConnection.close();
		delete this.RTCPeerConnection ;
	};

	

	/*
 	 *
 	 *	CLASS WEBRTC
 	 *
 	 */
	var syslogSettings = {
	
	};

	var defaultSettings = {
		audio		: true,
		video		: true,
		protocol	: null,
		sipPort		: null,
		sipTransport	: null,
		//constraints	: { mandatory: { 'OfferToReceiveAudio': true, 'OfferToReceiveVideo': true } },
		//constraintsOffer: stage.browser.Gecko ? {'mandatory': {'MozDontOfferDataChannel':true}} : null,
		STUN		: { iceServers: [{ url: ! stage.browser.Gecko ? 'stun:stun.l.google.com:19302' : 'stun:23.21.150.121'}] },
		TURN		: { iceServers: [{ url: "turn:webrtc%40live.com@numb.viagenie.ca", credential: ""}] },
		//optional	: { optional: [{ "RtpDataChannels": true},{'DtlsSrtpKeyAgreement': 'true'}]}
		optional	: stage.browser.Gecko ? { optional: [{ "RtpDataChannels": true}]} :  { optional: [{ "RtpDataChannels": true},{'DtlsSrtpKeyAgreement': 'true'}]}
		//optional	: stage.browser.Gecko ? { optional: [{ "RtpDataChannels": true},{'DtlsSrtpKeyAgreement': 'false'}]} :  { optional: [{ "RtpDataChannels": true},{'DtlsSrtpKeyAgreement': 'false'}]}
	};

	/*
 	 *	CLASS
 	 */
	var WebRtc = function(server, transport, settings){
		this.settings = stage.extend(true, {}, defaultSettings, settings);
		this.notificationsCenter = stage.notificationsCenter.create(this.settings, this);
		this.syslog = new stage.syslog(syslogSettings);
		this.protocol = null;
		this.transactions = {};
		this.users = {};
		this.transport = transport ;
		if ( this.transport && this.transport.publicAddress ){
			this.publicAddress = this.transport.publicAddress;	
		}
		this.server = server ;
	};

	WebRtc.prototype.listen = function(){
		return this.notificationsCenter.listen.apply(this.notificationsCenter, arguments);
	};

	WebRtc.prototype.fire = function(){
		return this.notificationsCenter.fire.apply(this.notificationsCenter, arguments);
	};

	WebRtc.prototype.createTransaction = function(userTo, callId){
		try {
			var transaction = new Transaction(this, this.user, userTo);
			this.transactions[userTo.name] = transaction ;
			if (callId) transaction.callId = callId ;
			return transaction ;
		}catch(e){
			
		}
	};

	WebRtc.prototype.close = function(){
		for (var trans in this.transactions){
			this.transactions[trans].close();	
			delete this.transactions[trans];
		}	
	};

	WebRtc.prototype.register = function(userName, password, settings){
		this.user = new User(userName, settings);

		switch (this.settings.protocol){
			case "SIP":
				this.protocol = new stage.io.protocols.sip(this.server, this.transport,{
					portServer	: this.settings.sipPort ,
					userName	: userName,
					password	: password	
				});

				this.protocol.listen(this, "onRegister", function(message, transaction){
					switch (message.code){
						case 200 :
							this.user.createMediaStream(function(stream){
								this.user.stream = stream ;
								this.notificationsCenter.fire("onMediaSucces", this.user.mediaStream);
							}.bind(this));
							this.notificationsCenter.fire("onRegister", this.user, this);	
						break;
						default :
							console.log(message)
						break;
					}
				});

				this.protocol.listen(this,"onRinging",function(message){
					//console.log(message);
					this.notificationsCenter.fire( "onRinging",message.toName );	
				});

				this.protocol.listen(this, "onInvite", function(message, dialog){
					
					switch(message.header["Content-Type"]){
						case "application/sdp" :
							if ( message.rawBody ){
								var to = new User(message.fromName);
								this.users[message.fromName] = to ;
								to.setDescription(message.rawBody);
								var transac = this.createTransaction(to, dialog.callId);
								message.transaction.createResponse(100, "trying");
								message.transaction.sendResponse();
								//FIXME 
								/*var res = {
									accept:false
								};*/
								message.transaction.createResponse(180, "Ringing");
								message.transaction.sendResponse();
								this.notificationsCenter.fire("onOffer", message, to, transac);
								/*if (res.accept){
									transac.setRemoteDescription("offer", to, message.rawBody, dialog);
								}else{
									//TODO DECLINED
									message.transaction.createResponse(603, "Declined");
									message.transaction.sendResponse();
								}*/
							}
						break;
						case "ice/candidate" :
							if ( message.rawBody ){
								//message.transaction.ack();
								var transaction = this.transactions[message.fromName];
								if ( ! transaction ) return ;
								var res = JSON.parse(message.rawBody) ;
								message.transaction.createResponse(100, "trying");
								message.transaction.sendResponse();
								for (var i=0 ; i<res.length;i++){
									var candidate = new RTCIceCandidate(res[i]);
									transaction.RTCPeerConnection.addIceCandidate(candidate,function(){/*console.log("Succes Candidate")*/},function(e){console.log("Error candidate")});
										//console.log("remote:  " + res[i]);
								}
								//message.transaction.createResponse(200, "OK", null);
								//console.log(JSON.stringify(transaction.candidates))
								message.transaction.createResponse(200, "OK", JSON.stringify(transaction.candidates), "ice/candidate");
								message.transaction.sendResponse();
								transaction.candidates= [];
							}	
						break;
					
					}
				});

				this.protocol.listen(this, "onTimeout",function(message){
					this.notificationsCenter.fire("onError", message.method, 408, message);	
				});

				this.protocol.listen(this, "onDecline",function(message){
					this.notificationsCenter.fire("onDecline", message.toName, message.code, message);	
				});

				
				this.protocol.listen(this, "onError",function(message){
					this.notificationsCenter.fire("onError", message.method, message.code, message);	
				});

				this.protocol.listen(this, "onBye",function(message){
					if ( message.fromName in  this.transactions ){
						var transac =  this.transactions[message.fromName];
						var name = message.fromName
					}else{
						var transac =  this.transactions[message.toName];
						var name = message.toName
					}
					transac.close();
					this.notificationsCenter.fire("onOnHook", name ,message);
					delete this.transactions[name];
					delete this.users[name];
				});

				this.protocol.listen(this, "onCall", function(message){
					var transac =  this.transactions[message.toName];
					if ( message.header["Content-Type"] == "application/sdp"){		
						//console.log(message)
						this.notificationsCenter.fire("onAnwer", message);
						var from = this.users[message.toName];
						from.setDescription(message.rawBody);
						transac.setRemoteDescription("answer", from, message.rawBody);
						if (transac.candidates.length){
							//console.log( message.dailog)	
							message.dialog.invite(message.toName, JSON.stringify(transac.candidates), "ice/candidate")
						}
						this.notificationsCenter.fire( "onOffHook",message.toName );	
					}
					if ( message.header["Content-Type"] == "ice/candidate"){
						if (transac.candidates.length){
							//console.log( message.dailog)	
							var res = JSON.parse(message.rawBody) ;
							for (var i=0 ; i<res.length;i++){
								var candidate = new RTCIceCandidate(res[i]);
								transac.RTCPeerConnection.addIceCandidate(candidate,function(){/*console.log("Succes Candidate")*/},function(e){console.log("Error candidate")});
								//console.log("remote:  " + res[i]);
							}
						}
					}
				});

				this.listen(this, "onCreateAnwser", function(to, sessionDescription, webrtcTransaction, diag){
					var response = diag.currentTransaction.createResponse( 200, "OK", sessionDescription.sdp, "application/sdp"  );
					diag.currentTransaction.sendResponse();
				});

				this.protocol.register();
			break;
			default:
				this.protocol = new Protocol(this.server, this.transport,{
					userName:userName,
					password:password
				});

				
				this.protocol.listen(this, "onRegister",function(message){
					this.user.createMediaStream(function(stream){
						this.user.stream = stream ;
						this.notificationsCenter.fire("onMediaSucces", this.user.mediaStream);
					}.bind(this));
					this.notificationsCenter.fire("onRegister", this.user, this);
				});

				this.protocol.listen(this, "onOffer",function(message){
					//console.log(message)
					var to = new User(message.from);
					this.users[message.from] = to ;
					to.setDescription(message.sessionDescription);
					var transac = this.createTransaction(to);
					var res = {
						accept:false
					};
					this.notificationsCenter.fire("onOffer", message, res);
					if (res.accept){
						transac.setRemoteDescription("offer", to, message.sessionDescription);
					}else{
						//TODO DECLINED
					}
				});

				this.protocol.listen(this, "onAnswer",function(message){
					//console.log(message)
					this.notificationsCenter.fire("onAnwer", message);
					var from = this.users[message.from];
					from.setDescription(message.sessionDescription);
					var transac =  this.transactions[message.from];
					transac.setRemoteDescription("answer", from, message.sessionDescription);
				});

				this.protocol.listen(this, "onCandidate",function(message){
					//console.log(message);
					var transac =  this.transactions[message.from];
					var candidate = new RTCIceCandidate({
						sdpMLineIndex:message.label,
						candidate:message.candidate
					});
					transac.RTCPeerConnection.addIceCandidate(candidate);
				});

				this.listen(this, "onCreateAnwser", function(to, sessionDescription, webrtcTransaction ){
					this.protocol.answer(to.name, sessionDescription);	
				});

			break;
		}
	};

	WebRtc.prototype.createOffer = function(userTo) {
		var to = new User(userTo);
		this.users[userTo] = to ;
		var transac = this.createTransaction(to);
		transac.createOffer();
	};

	WebRtc.prototype.byAll = function() {
		this.protocol.byAll();
	};


	return WebRtc ;

});
