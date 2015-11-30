/*
 *
 *	WEBRTC
 *
 *
 */

stage.register("webRtc",function(){


	/*var parseSdp = function(sdp){
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
	}*/

	/*var RTCPeerConnection = null;	
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
	*/

	/*
 	 *
 	 *	CLASS USER
 	 *
 	 */
	var userSettings = {
		constraints	: { mandatory: { 'OfferToReceiveAudio': true, 'OfferToReceiveVideo': true } },
		//constraintsOffer: stage.browser.Gecko ? {'mandatory': {'MozDontOfferDataChannel':true}} : null
	};

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
		return this.mediaStream ;
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
				this.from.setDescription(this.RTCPeerConnection.setLocalDescription(sessionDescription, function(){
					var dialog = this.webrtc.protocol.invite(this.to.name, sessionDescription);
					this.callId = dialog.callId ;
				}.bind(this),this.webrtc.listen(this, "onError")));
				//this.RTCPeerConnection.startIce();
			}catch(e){
				throw e;
			}
		}.bind(this), this.webrtc.listen(this, "onError"), this.from.settings.constraintsOffer);
	};

	Transaction.prototype.createPeerConnection = function(){
		try {	
			this.RTCPeerConnection = new RTCPeerConnection( location.search.indexOf('turn=true') !== -1 ? this.webrtc.settings.TURN : this.webrtc.settings.STUN, this.webrtc.settings.optional );
			//console.log(pc);
			this.RTCPeerConnection.onicecandidate = function (event) {
				//console.log(event)
				//console.log("local:  " + JSON.stringify(event.candidate));
				if (event.candidate){
					this.candidates.push(event.candidate);
				}
			}.bind(this);


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
		}
		return this.to.createMediaStream ;
	};


	Transaction.prototype.setRemoteDescription = function(type, user, description, dialog){
		var desc = {
			type:type,
			sdp:description
		}
		this.remoteDescription = this.RTCPeerConnection.setRemoteDescription(
			new RTCSessionDescription(desc),
			function(){
				if (this.RTCPeerConnection.remoteDescription.type == "offer"){
					this.doAnswer(dialog);
					this.webrtc.notificationsCenter.fire("onRemoteDescription", this.from, this);
				}
			}.bind(this),
			this.webrtc.listen(this, "onError")			
		);
		return this.remoteDescription;
	};


	Transaction.prototype.doAnswer = function(dialog) {
		return this.RTCPeerConnection.createAnswer(
			function(sessionDescription){
				this.from.setDescription(sessionDescription) ; 
				this.RTCPeerConnection.setLocalDescription(sessionDescription,function(){
					this.webrtc.notificationsCenter.fire("onCreateAnwser", this.to, sessionDescription, this, dialog);
				}.bind(this),this.webrtc.listen(this, "onError"));
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
		protocol	: "webrtc",
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
								message.transaction.createResponse(180, "Ringing");
								message.transaction.sendResponse();
								this.notificationsCenter.fire("onOffer", message, to, transac);
								
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
						transac.setRemoteDescription("answer", from, message.rawBody, message.dailog);
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
				this.protocol = new stage.io.protocols.webrtc(this.server, this.transport,{
					userName:userName,
					password:password
				});

				this.protocol.listen(this, "onRegister",function(message){
					switch (message.code){
						case "200" :
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

				this.protocol.listen(this, "onInvite",function(message, dialog){
					if ( message.response.sessionDescription ){
						var to = new User(message.response.from);
						this.users[message.response.from] = to ;
						to.setDescription(message.response.sessionDescription);
						var transac = this.createTransaction(to, dialog.callId);
						dialog.invite({
							to:message.response.from,
							code:100,
							message:"trying"
						});
						dialog.invite({
							to:message.response.from,
							code:180,
							message:"Ringing"
						});
						this.notificationsCenter.fire("onOffer", message, to, transac);
					}
				});

				this.protocol.listen(this, "onCandidate", function(message, dialog){

					var transaction = this.transactions[message.response.from];
					if ( ! transaction ) return ;
					if (message.response.candidates){
						//message.transaction.ack();
						var res = JSON.parse( message.response.candidates ) ;
						
						for (var i=0 ; i<res.length;i++){
							var candidate = new RTCIceCandidate(res[i]);
							transaction.RTCPeerConnection.addIceCandidate(candidate,function(){/*console.log("Succes Candidate")*/},function(e){console.log("Error candidate")});
								//console.log("remote:  " + res[i]);
						}

					}
					if (transaction.candidates.length){
						dialog.invite( {
							to:message.response.from,
							candidates : JSON.stringify(transaction.candidates),
							code:201,
							message:"trying candidate"
						});
						transaction.candidates= [];
					}
				});

				this.protocol.listen(this, "onCall", function(message, dialog){
					var transac =  this.transactions[message.response.from];
					if ( message.response.sessionDescription){		
						this.notificationsCenter.fire("onAnwer", message);
						var from = this.users[message.response.from];
						from.setDescription(message.response.sessionDescription);
						transac.setRemoteDescription("answer", from, message.response.sessionDescription, dialog);
						if (transac.candidates.length){
							dialog.invite({
								to:message.from,
								candidates : JSON.stringify(transac.candidates),
								code:201,
								message:"trying candidate"
							});
						}
						this.notificationsCenter.fire( "onOffHook",message.response.from , message);	
					}
				});

				this.protocol.listen(this, "onConnect" , function(){
					this.protocol.register();
				});
				
				this.protocol.listen(this, "onDecline",function(message){
					this.notificationsCenter.fire("onDecline", message.response.from, message.code, message);	
				});

				this.protocol.listen(this,"onRinging",function(message){
					this.notificationsCenter.fire( "onRinging",message.response.from , message);	
				});

				this.protocol.listen(this,"onTrying",function(message){
					this.notificationsCenter.fire( "onTrying",message.response.from, message );	
				});

				this.protocol.listen(this, "onBye",function(message){
					//console.log(this.transactions)
					if ( message.response.from in  this.transactions ){
						var transac =  this.transactions[message.response.from];
						var name = message.response.from
					}else{
						var transac =  this.transactions[message.response.to];
						var name = message.response.to
					}
					transac.close();
					this.notificationsCenter.fire("onOnHook", name ,message);
					delete this.transactions[name];
					delete this.users[name];
				});

				this.protocol.listen(this, "onError",function(message){
					this.notificationsCenter.fire("onError", message.type, message.code, message);	
				});

				this.listen(this, "onCreateAnwser", function(to, sessionDescription, webrtcTransaction, diag ){
					//console.log("onCreateAnwser")
					diag.answer(to.name, sessionDescription.sdp);	
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
