/*
 *
 *	WEBRTC
 *
 *
 */

stage.register("webRtc",function(){


	// FIXME CALLBACK SDP PARSER
	var parseSdp = function(description){
		var sdpLines = description.sdp.split('\r\n');
		var newline = "";
		// Search for m line.
		for (var i = 0; i < sdpLines.length; i++) {
			var line = sdpLines[i];
			switch (description.type ){
				case "offer":
					/*if (line.search('a=crypto') !== -1) {
						console.log("PARSE SDP DELETE CRYPTO ");
						continue ;
					}*/
					/*if (line.search('a=setup:actpass') !== -1) {
						console.log("PARSE SDP REPLACE setup :  actpass by active  ");
						line = line.replace("a=setup:actpass", "a=setup:active")
					}*/
				break;
				case "answer":
					/*if (line.search('a=crypto') !== -1) {
						console.log("PARSE SDP DELETE CRYPTO ");
						continue ;
					}*/
					/*if (line.search('a=setup:actpass') !== -1) {
						console.log("PARSE SDP REPLACE setup :  actpass by active  ");
						line = line.replace("a=setup:actpass", "a=setup:active")
					}*/
				break;
			}
			if ( i === sdpLines.length-1 ){
				newline+=line;
			}else{
				newline+=line+"\r\n";
			}
		}
		description.sdp = newline ;
		return description;
	}



	/*
 	 *
 	 *	CLASS USER
 	 *
 	 */
	var userSettings = {
		constraints	: { mandatory: { 'OfferToReceiveAudio': true, 'OfferToReceiveVideo': true } },
		//constraintsOffer: stage.browser.Gecko ? {'mandatory': {'MozDontOfferDataChannel':true}} : null
		displayName	: ""
	};

	var User =function(userName, settings){
		this.name = userName ;

		this.settings = stage.extend({}, userSettings, settings );

		this.displayName = this.settings.displayName || userName ;

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
 	 *	CLASS TRANSACTION WEBRTC
 	 *
 	 */
	var Transaction = function(webrtc, from, to, dialog, settings){
		this.webrtc = webrtc ;
		this.notificationsCenter = stage.notificationsCenter.create(settings || {}, this);
		this.dialog = dialog || null ;
		this.error = null ;
		if ( this.dialog ){
			this.callId = this.dialog.callId;
		}
		this.protocol =  webrtc.protocol;
		this.from = from ;
		try {
			if (to instanceof User ){
				this.to = to;
			}else{
				this.to = new User(to, settings) ;
			}
		}catch(e){
			throw e ;
		}
		this.asyncCandidates = this.webrtc.settings.asyncCandidates ;

		console.log("CREATE TRANSATION WEBRTC");
		this.RTCPeerConnection = this.createPeerConnection() ;
		this.RTCPeerConnection.addStream(this.from.stream)

		// MANAGE DTMF
		this.dtmfSender= null ;
		if ( this.webrtc.settings.dtmf ){
			try {
				this.initDtmfSender( this.from.stream );
				this.webrtc.listen(this, "onKeyPress", this.sendDtmf ) ;
				// FIXME TRY TO RECEIVE DTMF RTP-EVENT
				/*this.webrtc.listen(this, "onRemoteStream",function(event, mediaStream, transaction){
					console.log( "DTMF setRemoteStream")
					this.initDtmfReceiver( this.from.stream );
				});*/
			}catch(e){
				console.log(e) ;
				throw e ;
			}
		}

		// MANAGE CANDIDATES
		this.candidates = [];
		this.listen(this, "onIcecandidate" , function(transaction, candidates, peerConnection){
			//console.log(" onIcecandidate : " + peerConnection.localDescription.type )
			if ( this.asyncCandidates && this.candidates.length){
				//console.log( message.dailog)
				var to = this.dialog.to.replace("<sip:", "").replace(">","") ;
				console.log("CANDIDATE TO" + to)
				console.log("CANDIDATE TO" + this.to.name)
				this.dialog.invite(to, JSON.stringify(this.candidates), "ice/candidate")
			}else{
				if ( peerConnection.localDescription.type == "offer" ){
					this.sessionDescription = parseSdp.call(this, peerConnection.localDescription ) ;
					if ( this.dialog ){
						var to = this.dialog.to.replace("<sip:", "").replace(">","") ;
						console.log("CANDIDATE TO" + to)
						console.log("CANDIDATE TO" + this.to.name)
						this.dialog.invite(to, this.sessionDescription);
					}else{
						this.dialog = this.webrtc.protocol.invite(this.to.name, this.sessionDescription);
						this.callId = this.dialog.callId ;
						this.webrtc.fire("onInvite", this, this.to, this.sessionDescription );
					}
				}
				if (peerConnection.localDescription.type == "answer" ){
					this.sessionDescription = peerConnection.localDescription ;
					if ( this.sessionDescription && ! ( this.error ) )
					this.fire("onCreateAnwser", this.to, this.sessionDescription, this, this.dialog);
				}

			}
		})

		this.listen(this, "onCreateAnwser", function(to, sessionDescription, webrtcTransaction, diag){
			var response = this.dialog.currentTransaction.createResponse( 200, "OK", this.sessionDescription.sdp, "application/sdp"  );
			response.send();
		});
	};

	Transaction.prototype.listen = function(){
		return this.notificationsCenter.listen.apply(this.notificationsCenter, arguments);
	};

	Transaction.prototype.unListen = function(){
		return this.notificationsCenter.unListen.apply(this.notificationsCenter, arguments);
	};

	Transaction.prototype.fire = function(){
		return this.notificationsCenter.fire.apply(this.notificationsCenter, arguments);
	};

	Transaction.prototype.createPeerConnection = function(){
		try {
			// CREATE PeerConnection
			this.RTCPeerConnection = new RTCPeerConnection( location.search.indexOf('turn=true') !== -1 ? this.webrtc.settings.TURN : this.webrtc.settings.STUN, this.webrtc.settings.optional );

			// MANAGE EVENT CANDIDATES
			this.RTCPeerConnection.onicecandidate = function (event) {
				// FIX firefox fire many time onicecandidate  iceGatheringState === complete
				var old = this.iceGatheringState ;
				if ( event.target ){
					this.iceGatheringState = event.target.iceGatheringState || this.RTCPeerConnection.iceGatheringState ;
				}else{
					this.iceGatheringState = this.RTCPeerConnection.iceGatheringState ;
				}
				var type = this.RTCPeerConnection.localDescription.type ;
				//console.log( this.iceGatheringState )
				//console.log( type )
				if (type === "offer"  && this.iceGatheringState === 'complete'  && old !== "complete")  {
					//console.log("PASSS CANDIDATE")
					this.fire("onIcecandidate", this, this.candidates ,this.RTCPeerConnection );
    				} else if (event && event.candidate == null) {
					// candidates null !!!
    				} else {
					console.info("WEBRTC : ADD CANDIDATE");
					if (event.candidate){
						this.candidates.push(event.candidate);
					}
					if (type === "answer"){
						this.fire("onIcecandidate", this, this.candidates ,this.RTCPeerConnection );
						this.RTCPeerConnection.onicecandidate = null ;
					}
    				}
			}.bind(this);

			// MANAGE STREAM
			this.RTCPeerConnection.onaddstream = function(event){
				//console.log(event)
				this.setRemoteStream( event)
				console.log("WEBRTC : ADD STREAM ")
			}.bind(this);

			return this.RTCPeerConnection;
		}catch (e){
			//console.log(e)
			this.webrtc.fire("onError", this, e);
		}
	};

	// FIXME TRY TO RECEIVE DTMF RTP-EVENT
	/*Transaction.prototype.initDtmfReceiver = function(mediaStream){
		console.log(this.RTCPeerConnection)
		if ( ! this.RTCPeerConnection.createDTMFSender ) {
			throw new Error(" RTCPeerConnection method createDTMFSender() !!!! which is not support by this browser");
		}
  		if (mediaStream !== null) {
			try {
				var remoteAudioTrack = mediaStream.getAudioTracks()[0];
				var dtmfSender = this.RTCPeerConnection.createDTMFSender(remoteAudioTrack);
				dtmfSender.ontonechange = function(tone){
					console.log("dtmfOnToneChange")
					this.webrtc.fire("dtmfOnToneChange", tone , this);
				}.bind(this);
			}catch(e){
				throw e ;
			}

  		} else {
			throw new Error( 'No local stream to create DTMF Sender', 500)
  		}
	}*/

	Transaction.prototype.initDtmfSender = function(mediaStream) {

		switch ( this.webrtc.settings.dtmf ){
			case "SIP-INFO" :
				var func = function(){} ;
				func.prototype.insertDTMF = function(key, duration, gap){
					var description = "Signal="+key+"\nDuration="+duration ;
					var type= "application/dtmf-relay";
					this.dialog.info( description, type)
				}.bind(this);
				this.dtmfSender = new func() ;
			break;
			case "RTP-EVENT" :
				if ( ! this.RTCPeerConnection.createDTMFSender ) {
					throw new Error(" RTCPeerConnection method createDTMFSender() !!!! which is not support by this browser", 500);
				}
  				if (mediaStream !== null) {
    					var localAudioTrack = mediaStream.getAudioTracks()[0];
					this.dtmfSender = this.RTCPeerConnection.createDTMFSender(localAudioTrack);
					this.dtmfSender.ontonechange = function(tone){
						this.webrtc.fire("dtmfOnToneChange", tone , this);
					}.bind(this);

  				} else {
					throw new Error( 'No local stream to create DTMF Sender', 500)
  				}
			break;
		}
	}

	Transaction.prototype.sendDtmf = function(code, key, event) {
		if ( this.dialog.status !== this.dialog.statusCode.ESTABLISHED ) {
			return ;
		}
		if (this.dtmfSender) {
			var duration = 500;
			var gap = 50;
			console.log('DTMF SEND, duration, gap: ', key, duration, gap);
			return this.dtmfSender.insertDTMF(key, duration, gap);
		}
		throw new Error(" DTMF SENDER not ready");
	};


	Transaction.prototype.createOffer = function(){

		return  this.RTCPeerConnection.createOffer(function(sessionDescription){
			this.sessionDescription = parseSdp.call(this, sessionDescription);
			try{
				this.from.setDescription(this.RTCPeerConnection.setLocalDescription(this.sessionDescription, function(){
					// ASYNC CANDIDATES
					if (  this.asyncCandidates ){
						// INVITE
						this.dialog = this.webrtc.protocol.invite(this.to.name, this.sessionDescription);
						this.callId = this.dialog.callId ;
						this.webrtc.fire("onInvite", this, this.to, this.sessionDescription );
					}else{
						// SYNC CANDIDATES
						/*this.webrtc.listen(this, "onIcecandidate" , function(transaction, candidates, peerConnection){
							if ( peerConnection.localDescription.type == "offer" ){
								this.sessionDescription = parseSdp.call(this, peerConnection.localDescription ) ;
								if ( this.dialog ){
									var to = this.dialog.to.replace("<sip:", "").replace(">","") ;
									this.dialog.invite(to, this.sessionDescription);
								}else{
									this.dialog = this.webrtc.protocol.invite(this.to.name, this.sessionDescription);
									this.webrtc.fire("onInvite", this, this.to.name, this.sessionDescription );
									this.callId = this.dialog.callId ;
								}
							}
						})*/
					}
				}.bind(this),
				function(error){
					this.error = error ;
					this.webrtc.fire("onError", this , error) ;
				}.bind(this)));
			}catch(e){
				throw e;
			}
		}.bind(this),
 		function(error){
			this.webrtc.fire("onError", this , error) ;
		}.bind(this),
		this.from.settings.constraintsOffer);
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
		//console.log("setRemoteDescription")
		this.currentTransaction = dialog.currentTransaction ;
		var desc = {
			type:type,
			sdp:description
		}
		//console.log( desc );
		var remoteDesc = parseSdp.call(this, desc);
		var ClassDesc = new RTCSessionDescription( remoteDesc );

		this.remoteDescription = this.RTCPeerConnection.setRemoteDescription(
			ClassDesc,
			function(){
				if (this.RTCPeerConnection.remoteDescription.type == "offer"){
					//console.log("WEBRTC : onRemoteDescription ");
					//this.doAnswer(dialog);
					this.webrtc.fire("onOffer", this.webrtc, this);
					this.webrtc.fire("onRemoteDescription", this.from, this, this.to);
				}else{
					this.webrtc.fire( "onOffHook", this , dialog );
				}
			}.bind(this),
			function(error){
				this.error = error ;
				this.webrtc.fire( "onError", this, error )
			}.bind(this)
		);
		return this.remoteDescription;
	};

	Transaction.prototype.doAnswer = function(dialog) {
		return this.RTCPeerConnection.createAnswer(
			function(sessionDescription){
				this.from.setDescription(sessionDescription) ;
				this.RTCPeerConnection.setLocalDescription(sessionDescription, function(){
					this.sessionDescription = sessionDescription ;
					if ( this.asyncCandidates ){
						this.fire("onCreateAnwser", this.to, this.sessionDescription, this, dialog);
					}
					this.webrtc.fire( "onOffHook",this , dialog );
				}.bind(this),
				function(error){
					this.error = error ;
					this.webrtc.fire( "onError", this , error);
				}.bind(this));
			}.bind(this),
			// error
			function(e){
				this.error = e ;
				this.webrtc.fire( "onError", this ,e);
			}.bind(this),
			this.from.settings.constraints
		);
	};

	Transaction.prototype.bye = function(){
		if ( this.dialog  ){
			this.dialog.bye();
		}
	};

	Transaction.prototype.cancel = function(){
		if ( this.currentTransaction ){
			this.currentTransaction.cancel();
		}
		this.webrtc.closeTransaction(this, this.to.name)
	};

	Transaction.prototype.decline = function(){
		if ( this.currentTransaction ){
			this.currentTransaction.decline();
		}
		this.webrtc.closeTransaction(this, this.to.name);
	};

	Transaction.prototype.close = function(){
		console.log("WEBRTC CLOSE TRANSACTION  : "+ this.callId )
		this.RTCPeerConnection.close();
		this.webrtc.unListen( "onKeyPress", this.sendDtmf ) ;
		delete this.RTCPeerConnection ;
		return this ;
	};
	stage.Transaction = Transaction ;

	/*
 	 *
 	 *	CLASS WEBRTC
 	 *
 	 */
	var defaultSettings = {
		audio		: true,
		video		: true,
		protocol	: "webrtc",
		sipPort		: 5060,
		sipTransport	: "UDP",
		dtmf		: "SIP-INFO", // "SIP-INFO", "RTP-EVENT"
		//constraints	: { mandatory: { 'OfferToReceiveAudio': true, 'OfferToReceiveVideo': true } },
		//constraintsOffer: stage.browser.Gecko ? {'mandatory': {'MozDontOfferDataChannel':true}} : null,
		//STUN		: { iceServers: [{ url: ! stage.browser.Gecko ? 'stun:stun.l.google.com:19302' : 'stun:23.21.150.121'}] },
		//TURN		: { iceServers: [{ url: "turn:webrtc%40live.com@numb.viagenie.ca", credential: ""}] },
		//optional	: { optional: [{ "RtpDataChannels": true},{'DtlsSrtpKeyAgreement': 'true'}]}
		//optional	: stage.browser.Gecko ? { optional: [{ "RtpDataChannels": true}]} :  { optional: [{ "RtpDataChannels": true},{'DtlsSrtpKeyAgreement': 'true'}]},
		optional	: stage.browser.Gecko ? { optional: []} :  { optional: [{'DtlsSrtpKeyAgreement': 'true'}]},
		asyncCandidates : false
	};

	/*
 	 *	CLASS
 	 */
	var WebRtc = function(server, transport, settings){
		this.settings = stage.extend(true, {}, defaultSettings, settings);
		this.notificationsCenter = stage.notificationsCenter.create(this.settings, this);
		//this.syslog = new stage.syslog(syslogSettings);
		this.protocol = null;
		this.socketState = "close" ;
		this.transactions = {};
		//this.users = {};
		this.transport = this.connect( transport ) ;
		if ( this.transport && this.transport.publicAddress ){
			this.publicAddress = this.transport.publicAddress;
			//this.publicAddress = server;
			//this.publicAddress = this.transport.domain;
		}
		this.server = server ;
		this.init();
	};

	WebRtc.prototype.connect = function(transport){
		//console.log(transport instanceof stage.realtime  )
		if ( transport ){
			transport.listen(this, "onConnect" , function(){
				this.socketState = "open" ;
			});
			transport.listen(this, "onClose" , function(){
				this.socketState = "close" ;
			})
			return 	transport ;
		}
	}

	WebRtc.prototype.listen = function(){
		return this.notificationsCenter.listen.apply(this.notificationsCenter, arguments);
	};

	WebRtc.prototype.unListen = function(){
		return this.notificationsCenter.unListen.apply(this.notificationsCenter, arguments);
	};

	WebRtc.prototype.fire = function(){
		return this.notificationsCenter.fire.apply(this.notificationsCenter, arguments);
	};

	WebRtc.prototype.createTransaction = function(userTo, dialog, settings){
		try {
			var transaction = new Transaction(this, this.user, userTo, dialog, settings);
			return transaction ;
		}catch(e){
			this.fire("onError", this, e);
			throw e ;
		}
	};



	WebRtc.prototype.unRegister = function(){
		//console.log( "WEBRTC unregister")
		this.close();
		if (this.protocol){
			this.protocol.unregister();
		}
	};

	WebRtc.prototype.register = function(userName, password, settings){
		this.user = new User(userName, settings);
		this.protocol.register( userName, password, settings )
	}


	WebRtc.prototype.init = function(){
		delete this.protocol ;
		this.protocol = null ;

		// EVENTS WEBRTC
		this.listen(this, "onInvite", function(transaction , userTo, description){
			this.transactions[transaction.callId] = transaction ;
		});

		/*this.listen(this, "onOffer", function(message , userTo, transaction){
			this.transactions[transaction.callId] = transaction ;
		});*/

		this.listen(this, "onOffer", function(webrtc, transaction){
			this.transactions[transaction.callId] = transaction ;
		});

		this.listen(this, "onAccept", function(webrtc, transac){
			transac.doAnswer(transac.dialog);
			//transac.setRemoteDescription("offer", transac.to, transac.to.description, transac.dialog);
		});

		this.listen(this, "onDeclineOffer", function(webrtc, transac){

			var ret = transac.dialog.currentTransaction.createResponse(
				603,
				"Declined"
			);
			ret.send();

			/*var ret = message.transaction.createResponse(
				603,
				"Declined"
			);
			ret.send();*/
			this.closeTransaction(transac);
		});

		// MANAGE PROTOCOL
		switch (this.settings.protocol){
			case "SIP":
				this.protocol = new stage.io.protocols.sip(this.server, this.transport,{
					portServer	: this.settings.sipPort ,
					transport	: this.settings.sipTransport,
				});

				this.protocol.listen(this, "onRegister", function(sip, message){
					switch (message.code){
						case 200 :
							this.user.createMediaStream(function(stream){
								this.user.stream = stream ;
								this.notificationsCenter.fire("onMediaSucces", this.user.mediaStream, this.user);
							}.bind(this),function(e){
								this.notificationsCenter.fire("onError", this, e);
							}.bind(this));
							this.notificationsCenter.fire("onRegister", this.user, this);
						break;
						default :
							this.notificationsCenter.fire("onError", this.protocol, message);
						break;
					}
				});

				this.protocol.listen(this, "onUnRegister",function(sip, message){
					this.fire("onUnRegister", sip, message);
				})

				this.protocol.listen(this,"onRinging",function(sip, message){
					var transaction = this.transactions[message.callId];
					if ( transaction ){
						this.notificationsCenter.fire( "onRinging", message.toName , transaction);
					}
				});

				this.protocol.listen(this,"onTrying",function(sip, message){
					var transaction = this.transactions[message.callId];
					if ( transaction ){
						this.notificationsCenter.fire( "onTrying", message.toName , transaction);
					}
				});

				this.protocol.listen(this,"onInfo",function(message){
					var transaction = this.transactions[message.callId];
					//console.log(message);
					if (message.contentType === "application/dtmf-relay" ){
						this.fire( "onDtmf", message.body.dtmf , transaction);
					}
				});

				this.protocol.listen(this,"onCancel",function(message){
					var transaction = this.transactions[message.callId];
					if (transaction){
						this.notificationsCenter.fire( "onCancel", message.body.body , transaction );
						this.closeTransaction(transaction, message.fromName);
					}
				});

				this.protocol.listen(this, "onInvite", function(message, dialog){
					switch(message.header["Content-Type"]){
						case "application/sdp" :
							if ( message.rawBody ){

								if ( dialog.status === dialog.statusCode.INITIAL){

									// TODO MANAGE MULTI CALL

									var res = message.transaction.createResponse(100, "trying");
									res.send();

									// transaction WEBRTC
									try {
										var transac = this.createTransaction(message.fromName, dialog , {
											displayName: message.fromNameDisplay || ""
										});
										transac.to.setDescription( message.rawBody );
									}catch(e){
										var res = message.transaction.createResponse(500, e.message);
										res.send();
										return ;
									}

									var res = message.transaction.createResponse(180, "Ringing");
									res.send();

									try {
										transac.setRemoteDescription("offer", transac.to, transac.to.description, transac.dialog);
										//this.notificationsCenter.fire("onOffer", message, transac.to, transac);
										//this.fire("onOffer", this, transac);
									}catch(e){
										var res = message.transaction.createResponse(500, e.message);
										res.send();
									}

									return ;
								}
								if ( dialog.status === dialog.statusCode.ESTABLISHED){
									// HOLD THE LINE
									message.transaction.decline();
								}
							}
						break;
						case "ice/candidate" :
							if ( message.rawBody ){
								var transaction = this.transactions[message.callId];
								if ( ! transaction ) {
									var ret = message.transaction.createResponse(500, "no transaction ");
									ret.send();
									return ;
								}
								var res = JSON.parse(message.rawBody) ;
								var ret = message.transaction.createResponse(100, "trying");
								ret.send();
								for (var i=0 ; i<res.length;i++){
									var candidate = new RTCIceCandidate(res[i]);
									transaction.RTCPeerConnection.addIceCandidate(candidate,
										function(index){
											console.log("WEBRTC remote CANDIDATES   " +res[index].candidate );
										}.bind(this, i),
										function(index, e){
											console.log(e);
											console.log("WEBRTC Error CANDIDATES " +res[index].candidate );
										}.bind(this, i)
									);

								}
								if ( transaction.candidates.length ){
									var ret = message.transaction.createResponse(200, "OK", JSON.stringify(transaction.candidates), "ice/candidate");
									ret.send();
									transaction.candidates= [];
								}else{
									var ret = message.transaction.createResponse(200, "OK");
									ret.send();
									//transaction.candidates= [];
									/*this.listen(this, "onIcecandidate" , function(transaction, candidates, peerConnection){
										var ret = message.transaction.createResponse(200, "OK", JSON.stringify(transaction.candidates), "ice/candidate");
										ret.send();
										transaction.candidates= [];
									});*/
								}
							}
						break;
						default:
							this.notificationsCenter.fire("onError", this.protocol,  message);

					}
				});

				this.protocol.listen(this, "onTimeout",function(sip, message){
					this.notificationsCenter.fire("onTimeout", message.method, 408, message);
				});

				this.protocol.listen(this, "onDecline",function(message){
					if ( message.callId in  this.transactions ){
						var transac =  this.transactions[message.callId];
						this.fire("onDecline", this, transac );
						this.closeTransaction(transac);
					}
				});

				this.protocol.listen(this, "onError",function(Class, message){
					this.notificationsCenter.fire("onError", Class, message);
					var transac =  this.transactions[message.callId];
					if  (transac ){
						this.closeTransaction(transac, transac.to.name);
					}
				});

				this.protocol.listen(this, "onQuit",function(protocol){
					this.close();
				});

				this.protocol.listen(this, "onInitCall",function(to, dialog, transaction){
					if ( dialog.callId in this.transactions ){
						var transac =  this.transactions[dialog.callId];
						transac.currentTransaction = transaction ;
						this.notificationsCenter.fire("onInitCall", transac );
					}
				});

				this.protocol.listen(this, "onBye",function(message){
					if ( message.callId in  this.transactions ){
						var transac =  this.transactions[message.callId];
						var name = message.fromName
					}
					if ( transac ){
						this.notificationsCenter.fire("onOnHook", transac ,message);
						this.closeTransaction(transac, name);
					}else{
						// WHEN USER LOCAL STOP REGISTRATION
						if ( message.fromName === this.user.name ){
							this.close()
						}
					}
				});

				this.protocol.listen(this, "onCall", function(message){
					var transac =  this.transactions[message.callId];
					if ( message.toNameDisplay ){
						transac.to.displayName = message.toNameDisplay ;
					}
					//var from = this.users[message.toName];
					if ( message.dialog.status === message.dialog.statusCode.EARLY && message.header["Content-Type"] == "application/sdp"){
						this.notificationsCenter.fire("onAnwer", message);
						transac.to.setDescription(message.rawBody);
						transac.setRemoteDescription("answer", transac.to, message.rawBody, message.dialog);
						/*if ( this.settings.asyncCandidates && transac.candidates.length){
							//console.log( message.dailog)
							message.dialog.invite(message.to, JSON.stringify(transac.candidates), "ice/candidate")
						}*/
						//this.notificationsCenter.fire( "onOffHook", transac , message );
					}else{

					}
					if ( message.header["Content-Type"] == "ice/candidate"){
						if (transac.candidates.length){
							var res = JSON.parse(message.rawBody) ;
							for (var i=0 ; i<res.length;i++){
								var candidate = new RTCIceCandidate(res[i]);
								transac.RTCPeerConnection.addIceCandidate(candidate,
									function(index){
										//console.log("Succes Candidate")
										console.log("WEBRTC ADD remote CANDIDATES :  " + res[index].candidate);
									}.bind(this, i),
									function(index , e){
										console.log(e);
										console.log("WEBRTC Error CANDIDATES " + res[index].candidate );
									}.bind(this, i)
								);
							}
						}
					}
				});

				this.protocol.listen(this, "onMessage",function(message){
					this.fire("onMessage", message);
				});

				this.protocol.listen(this, "onSend",function(message){
					this.fire("onSend", message);
				});

				this.listen(this, "onError", function(Class, error){

					switch (true){
						case ( Class instanceof  WebRtc ) :
						break ;
						case ( Class instanceof Transaction ) :
							//console.log(Class.currentTransaction )
							if ( Class.currentTransaction ){
								var response = Class.currentTransaction.createResponse( 500, error.message );
								response.send();
							}
							this.closeTransaction(Class, Class.to.name);
						break ;
						case ( Class instanceof  Error ) :
						break ;
					}
				});
			break;
			default:
				throw new Error("WEBRTC Protocol not found " ) ;
		}
	};

	WebRtc.prototype.createOffer = function(userTo) {
		var to = new User(userTo);
		//this.users[userTo] = to ;
		var transac = this.createTransaction(to);
		transac.createOffer();
		return transac ;
	};

	WebRtc.prototype.closeTransaction = function(transation, name) {
		if ( transation ){
			transation.close();
			delete this.transactions[transation.callId];
			//delete this.users[name];
		}
	}

	WebRtc.prototype.close = function(){
		this.fire("onQuit", this);
		for (var trans in this.transactions){
			try {
				this.transactions[trans].bye();
				this.transactions[trans].close();
			}catch(e){

			}
			delete this.transactions[trans];
		}
	};

	WebRtc.prototype.quit = function() {
		this.protocol.bye();
	};

	return WebRtc ;

});
