stage.register('NODEFONY', function(){
	

	var NODEFONYTranport = function(url, settings){
		var server = "/secure/realtime";
		console.log(url)

		stage.realtime.prototype.send = function(data){
			return this.sendMessage("OPENSIP", data) ;
		}

		return  new stage.realtime(url ,settings);
	
	}

	var NODEFONY = function(kernel, settings){
		this.kernel = kernel ;
		this.settings = settings;
		this.name = "NODEFONY" ;
		this.kernel.API = this.name ;

		this.notificationsCenter = stage.notificationsCenter.create(this.settings, this);

		this.transport = null ; 
		this.webrtc = null ; 
		this.connect();
		
	};

	NODEFONY.prototype.listen = function(){
		return this.notificationsCenter.listen.apply(this.notificationsCenter, arguments);
	};

	NODEFONY.prototype.fire = function(){
		return this.notificationsCenter.fire.apply(this.notificationsCenter, arguments);
	};

	NODEFONY.prototype.info = function(message , sev){
		return this.kernel.info(message , sev);
	};

	NODEFONY.prototype.close = function(){
		this.unRegister();
		//this.transport.close() ;
		delete this.transport 
	};

	NODEFONY.prototype.connect = function(){
		if (this.transport ){
			this.close() ;	
		}
		this.transport = NODEFONYTranport.call(this, this.settings.WebSockServerUrl, {
			// fire when 401 http code
		    	onUnauthorized:function(authenticate, realtime){
				//this.info(" REAL TIME  WEBRTC Unauthorized")
		    	}.bind(this),
		    	// fire when authetification success or not authenticate
		    	onAuthorized:function(authenticate, realtime){
			    	this.info("WELCOME TO REAL TIME  WEBRTC ")
		    	}.bind(this),
		    	// fire when error
		    	onError:function(code, realtime ,message){
			    	//console.log(arguments)
			    	//stage.ui.log(message);
			    	switch (code){
				    	case 500:
					    	//try to subcribe
					    	//realtime.subscribe("OPENSIP");
					    	break;
				    	case 403:
					    	break;
			    	}
		    	}.bind(this),

		    	// fire when socket connection ready 
		    	onHandshake:function(message, socket, realtime){
			    	this.info("HANSHAKE OK");
		    	}.bind(this),
		    	// fire when service is ready
		    	onConnect:function(message, realtime){
			    	this.info("CONNECT ON : "+realtime.publicAddress);
			    	if (message.data.OPENSIP){
				    	realtime.subscribe("OPENSIP");
				    	
			    	}
		    	}.bind(this),

			onSubscribe:function(service, message, realtime){
			    	this.info( "SUBSCRIBE service : " + service);

			    	if ( service  === "OPENSIP"){
					this.initWebrtc(realtime);
					this.fire("onConnect", realtime , this);
				}
			}.bind(this),

		    	onDisconnect:function(){
			    	this.info("Disconnect realtime service");
			    	this.fire("onDisconnect", realtime , this);
		    	}.bind(this),
		    	// fire when socket close
		    	onClose:function(){
			    	this.info( "onClose");
			    	this.fire("onClose", this);
		    	}.bind(this),

			onUnsubscribe:function(service, message, realtime){
				this.info( "UNSUBSCRIBE service : " + service);
			}.bind(this)
		});

		
		this.transport.start();

	};

	NODEFONY.prototype.reConnect = function(){
		delete this.webrtc ;
		this.connect();
	}

	NODEFONY.prototype.register = function(user, passwd){
		if ( this.webrtc ){
			this.webrtc.register(user, passwd, {
				displayName:this.settings.userConfig ? this.settings.userConfig.displayName : user  
			});
		}
	};

	NODEFONY.prototype.unRegister = function(){
		if ( this.webrtc ){
			this.webrtc.unRegister();
		}
	};

	NODEFONY.prototype.initWebrtc = function(transport){
		this.webrtc = null ;

		this.webrtc = new stage.webRtc(this.settings.SIPProxyUrl, transport, {
			protocol:"SIP",
			sipPort:5060,
			sipTransport:"TCP",
			dtmf:this.settings.DTMF,
			onRegister:function(user, webrtc){
				this.info("register User "+user.name);
				this.fire("onRegister", user, webrtc);
				user.mediaStream.getUserMedia({
					audio:true,
					video: ! this.settings.disableVideo
				},
				function(mediaStream){
					this.fire("onMedia", mediaStream, this );
				}.bind(this));

			}.bind(this),

			onUnRegister:function(protocol, message){
				this.fire("onUnRegister",message, this.webrtc );	
			}.bind(this),

			onRemoteStream:function(event, remoteStream, transaction){
				this.fire("onRemote", event, remoteStream, transaction, this );
			}.bind(this),	

			onOffer:function(webrtc, transac){
				this.fire("onOffer", webrtc, transac, this );	
				this.info(" Appel de : "+ transac.to.displayName);
			}.bind(this),

			onCancel:function(){
				this.fire("onCancel", this );	
			}.bind(this),

			onQuit:function(webrtc){
				this.fire("onQuit", webrtc, this );
			}.bind(this),

			onRinging:function(user){
				this.fire("onRiging", user, this );
				//this.info(user+" Sonne !!!");
			}.bind(this),

			onInitCall:function(to, dialog, transaction){
				this.fire("onInitCall", to, dialog, transaction );
			}.bind(this),

			onOffHook:function(transaction, message){
				this.fire("onOffHook", transaction, message, this );
				//this.info(user+" a decroché !!!");	
			}.bind(this),

			onOnHook:function(transaction, message){
				this.fire("onOnHook", transaction, message, this );
				//this.info(user+" a racroché !!!");	
				//mv.removeRemoteMedia(user);
			}.bind(this),

			onDecline:function(webrtc, transaction){
				this.fire("onDecline", webrtc, transaction );
				//this.info(user+" a refusé");
			}.bind(this),

			onError:function(Class, error, message){
				this.fire("onError", Class, error, this );
			}.bind(this),

			onTimeout:function(method, code, message){
				this.fire("onError", method, code, message, this );
			}.bind(this),

			onMessage:function(message){
				this.fire("onMessage", message)
			}.bind(this),

			onSend:function(message){
				this.fire("onSend", message)	
			}.bind(this)
		});	

	};

	return NODEFONY;
	
});
