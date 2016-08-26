
stage.register('TFM', function(){
	

	var TFMTranport = function(url, settings){
		return  new stage.io.transports.websocket(url, settings);
		
	}

	var TFM = function(kernel, settings){
		this.kernel = kernel ;
		this.settings = settings;
		this.name = "TFM" ;
		this.kernel.API = this.name ;

		this.notificationsCenter = stage.notificationsCenter.create(this.settings, this);

		this.transport = null ; 
		this.webrtc = null ; 
		this.connect();
		
	};

	TFM.prototype.listen = function(){
		return this.notificationsCenter.listen.apply(this.notificationsCenter, arguments);
	};

	TFM.prototype.fire = function(){
		return this.notificationsCenter.fire.apply(this.notificationsCenter, arguments);
	};

	TFM.prototype.info = function(message , sev){
		return this.kernel.info(message , sev);
	};

	TFM.prototype.close = function(){
		this.unRegister();
		//this.transport.close() ;
		delete this.transport ;
	};

	TFM.prototype.connect = function(){
		if (this.transport ){
			this.close() ;	
		}
		this.transport = TFMTranport(this.settings.WebSockServerUrl, {
			//websocket protocol 
			protocol:"sip"
		});

		this.initWebrtc(this.transport);

		this.transport.listen(this, "onConnect", function (event) {			
			this.fire("onConnect", this.transport , this);
		}.bind(this));

		this.transport.listen(this, "onClose", function () {			
			this.fire("onDisconnect", this.transport , this);
		}.bind(this));
	};

	TFM.prototype.reConnect = function(){
		delete this.webrtc ;
		this.connect();
	}

	TFM.prototype.register = function(user, passwd){
		if ( this.webrtc ){
			this.webrtc.register(user, passwd, {
				displayName:this.settings.userConfig ? this.settings.userConfig.displayName : user  
			});
		}
	};

	TFM.prototype.unRegister = function(){
		if ( this.webrtc ){
			this.webrtc.unRegister();
		}
	};

	TFM.prototype.initWebrtc = function(transport){
		this.webrtc = null ;

		this.webrtc = new stage.webRtc(this.settings.SIPProxyUrl, transport, {
			protocol:"SIP",
			sipPort:5060,
			sipTransport:"WSS",
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
	
	return TFM;
	
});
