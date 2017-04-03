
module.exports = function (){

	var nativeTransport = function(url, settings){
		return new stage.io.transports.websocket(url, settings);
	};

	var NODEFONYTranport = function(url, settings){
		var real = new stage.realtime(url ,settings);
		real.send = function(data){
			return this.sendMessage("kamailio", data) ;
		}.bind(real);
		return real;
	};

	var error = function error (Class,  error) {
		switch (true){
			case ( Class instanceof stage.io.transports.websocket ) :
				//this.logger( error, "ERROR");
			break;
			case ( Class instanceof  stage.media.webrtc ) :
				var err = error.message || error ;
				this.logger( err, 'CRITIC' );
			break ;
			case ( Class instanceof  stage.io.protocols.sip ) :
				switch(error.method){
					case 'REGISTER' :
						switch(error.code){
							case 401 :
								break;
							case 404 :
								break;
							default:
								this.logger(error.toName+": "+ error.statusLine.message,'CRITIC' );
						}
					break;
					case 'INVITE' :
						switch(error.code){
							case 404 :
							case 408 :
								var content = (error.code == 404 ? "L'utilisateur " + error.toName + " n'est pas en ligne." : "L'utilisateur " + error.toName + " ne repond pas.");
								break;
							default:
								//console.log(message)
								this.logger(error.toName+": "+ error.statusLine.message, 'CRITIC' );
						}
					break;
					default:
						if( error instanceof Error ){
						}
						if ( error.method && error.statusLine ){
						}
				}
			break ;
			case ( Class instanceof stage.media.webrtcTransaction ) :
				var err = error.message || error ;	
				this.logger( err , 'CRITIC' );
			break ;
			case (  Class instanceof Event ) :
				this.logger( Class, 'CRITIC' );
			break;
			case ( Class instanceof  Error ) :
				var err = error.message || error ;
				this.logger(err, 'CRITIC' );
			break ;
			case ( typeof Class === "string" ) :
				this.logger( Class, 'CRITIC' );
			break;
			default :
				console.log(arguments) ;
		}	
	};

	var transport = class transport extends stage.Service {
	
		constructor(kernel, config){
			
			super("API-WEBRTC", kernel.container, stage.notificationsCenter.create() );

			this.settings = config ;

			this.transport = null ; 
			this.webrtc = null ; 

			this.listen(this, "onError", error.bind(this) );

			this.connect();
		}	

		connect (){

			this.close();

			switch (this.settings.server){
				case "kamailio" :
					this.transport = nativeTransport(this.settings.sip.serverUrl, {
						//websocket protocol 
						protocol:"sip"
					});

					this.transport.listen(this, "onConnect", function (event) {			
						this.fire("onConnect", this.transport , this);
					});

					this.transport.listen(this, "onClose", function () {			
						this.fire("onDisconnect", this.transport , this);
					});

					this.transport.listen(this, "onError", function (error) {			
						this.fire("onError", this.transport , error);
					}); 
				break;
				case "nodefony" :

					this.transport = NODEFONYTranport.call(this, this.settings.sip.serverUrl, {
						// fire when 401 http code
		    				onUnauthorized:(authenticate, realtime) => {
							this.logger(" REAL TIME  WEBRTC Unauthorized")
		    				},
		    				// fire when authetification success or not authenticate
		    				onAuthorized:(authenticate, realtime) => {
			    				this.logger("WELCOME TO REAL TIME  WEBRTC ")
		    				},
		    				// fire when error
		    				onError:(code, realtime ,message) => {
			    				switch (code){
				    				case 500:
					    				//try to subcribe
					    				//realtime.subscribe("kamailio");
					    			break;
				    				case "403":
				    				case 403:
									this.logger("CODE: "+ code + " Mesasge : " + message, "ERROR");
					    			break;
								default:
									this.logger("CODE: "+ code + " Mesasge : " + message, "ERROR");
			    				}
		    				},
		    				// fire when socket connection ready 
		    				onHandshake:(message, socket, realtime) => {
							this.fire("onHandshake", message, realtime , this);
			    				this.logger("HANSHAKE OK");
		    				},
		    				// fire when service is ready
		    				onConnect:(message, realtime) => {
			    				this.logger("CONNECT ON : "+realtime.publicAddress);
			    				if (message.data.kamailio){
				    				realtime.subscribe("kamailio");
			    				}
		    				},

						onSubscribe:(service, message, realtime) => {
			    				this.logger( "SUBSCRIBE service : " + service);
			    				if ( service  === "kamailio"){
								this.initWebrtc(realtime);
								this.fire("onConnect", realtime , this);
							}
						},

		    				onDisconnect:() => {
			    				this.logger("Disconnect realtime service");
			    				this.fire("onDisconnect", realtime , this);
		    				},

		    				// fire when socket close
		    				onClose:() => {
			    				this.logger( "onClose");
			    				this.fire("onClose", this);
		    				},

						onUnsubscribe:(service, message, realtime) => {
							this.logger( "UNSUBSCRIBE service : " + service);
						}
					});
				
					this.transport.start();
				break;
				default:
					throw new Error ("Api :" + this.settings.server +"not found ")
			}
		}

		register (user, passwd){
			if ( this.webrtc ){
				this.webrtc.register(user, passwd, {
					displayName:this.settings.userConfig ? this.settings.userConfig.displayName : user  
				});
			}
		};


		close (){
			if ( this.transport ){	 
				this.unRegister();
				//this.transport.close() ;
				delete this.transport ;
			}
		}

		reconnect (){
			delete this.webrtc ;
			this.connect();
		}

		unRegister (){
			if ( this.webrtc ){
				this.webrtc.unRegister();
			}
		}

		initWebrtc (transport){
			console.log(this.settings)
			this.webrtc = null ;
			this.webrtc = new stage.media.webrtc(this.settings.sip.sipProxyUrl, transport, {
				protocol	: this.settings.webrtc.protocol ,
				sipTransport	: this.settings.sip.sipTransport,
				sipPort		: this.settings.sip.sipPort,
				dtmf		: this.settings.sip.DTMF,
				iceServers	: { iceServers:this.settings.webrtc.ICEServers },
				onRegister:(user, webrtc) => {
					this.info("register User "+user.name);
					this.fire("onRegister", user, webrtc);
					user.mediaStream.getUserMedia({
							audio:	true,
							video:	this.settings.webrtc.enableVideo
						},
						(mediaStream) => {
							this.fire("onMedia", mediaStream, this );
						},
						(error) => {
							this.fire("onError", error, this );
						}
					);
				},

				onUnRegister:(protocol, message) => {
					this.fire("onUnRegister",message, this.webrtc );	
				},

				onRemoteStream:(type, event, remoteStream, transaction) => {
					this.fire("onRemote", type, event, remoteStream, transaction, this );
				},	

				onOffer:(webrtc, transac) => {
					this.fire("onOffer", webrtc, transac, this );	
					this.info(" Appel de : "+ transac.to.displayName);
				},

				onCancel:() => {
					this.fire("onCancel", this );	
				},

				onQuit:(webrtc) => {
					this.fire("onQuit", webrtc, this );
				},

				onRinging:(user) => {
					this.fire("onRiging", user, this );
					//this.info(user+" Sonne !!!");
				},

				onInitCall:(to, dialog, transaction) => {
					this.fire("onInitCall", to, dialog, transaction );
				},

				onOffHook:(transaction, message) => {
					this.fire("onOffHook", transaction, message, this );
					//this.info(user+" a decroché !!!");	
				},

				onOnHook:(transaction, message) => {
					this.fire("onOnHook", transaction, message, this );
					//this.info(user+" a racroché !!!");	
					//mv.removeRemoteMedia(user);
				},

				onDecline:(webrtc, transaction) => {
					this.fire("onDecline", webrtc, transaction );
					//this.info(user+" a refusé");
				},

				onError:(Class, error, message) => {
					this.fire("onError", Class, error, this );
				},

				onTimeout:(method, code, message) => {
					this.fire("onError", method, code, message, this );
				},

				onMessage:(message) => {
					this.fire("onMessage", message)
				},

				onSend:(message) => {
					this.fire("onSend", message)	
				}
			})
		}
	};
	
	return transport ;		
}();
