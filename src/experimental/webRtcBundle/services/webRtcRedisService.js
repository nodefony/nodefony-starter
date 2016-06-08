var shortId = require('shortid');
var redis = require("redis") ;

nodefony.registerService("webrtcRedis", function(){


	/*
	 *
	 *	CLASS CONNECTION
	 *
	 */
	var Connections = function(service, context, options){
		this.room = "webrtc" ;
		this.context = context ;
		this.service = service ;
		this.options = options ;
		this.user = context.user ;
		this.username =  this.user.username ;
		this.ip = context.remoteAddress;
		this.sub = null;
		this.pub = null ;
		this.setConnection();


		this.context.notificationsCenter.listen(this,"onClose", function(){
			this.logger("close websocket client ");
			this.close();
		})

	};

	Connections.prototype.generateId = function(){
		return shortId.generate();
	};


	Connections.prototype.setConnection = function(){

		this.id  = this.generateId() ;

		this.sub = redis.createClient({
			host:this.options.host,
		});

		this.pub = redis.createClient({
			host:this.options.host,
		});

		this.pub.auth(this.options.password, function(){
			this.logger("PUBLISH CONNECT REDIS SERVER  AUTHENTICATION OK  ", "INFO");	
		}.bind(this))
		

		this.sub.auth(this.options.password, function(){
			this.logger("SUBSCRIBE CONNECT REDIS SERVER  AUTHENTICATION OK  ", "INFO");
		}.bind(this))

		this.sub.on("subscribe", function (channel, count) {
			if ( channel === this.room ){
				this.publish({
					type:"CONNECT",
					user:this.username,
					code:200
				});
				
				this.logger(this.username + " SUBSCRIBE ROOM  : " + this.room, "INFO");

			}
		}.bind(this));

		this.sub.on("message", function (channel, message) {
			if ( channel === this.room ){
				this.logger("sub channel " + channel + ": " + message);
				//this.logger( this.username )
				var message = JSON.parse( message ) ; 
				if ( message.user === this.username ){
					if ( message.type === "CONNECT"){
						var ret = this.send(  {
							type:"CONNECT",
					        	code:"200",
					        	message:"OK"
						});
						this.publish(ret);
					}
				}else{
					this.onMessage(message, true)	
				}
			}
		}.bind(this));

		this.sub.subscribe( this.room );
	};

	Connections.prototype.send = function(data){
		if (typeof data === "object"){
			var message = nodefony.extend({ 
				from		: this.username,
				userName	: this.username,
				idConnection	: this.id,
				ip		: this.ip,	
			}, data) ; 
			var str = JSON.stringify(message);
			this.service.logger("WEBSOCKET TO : "+this.username + '  Message '  + str);
			this.context.send(str);
			return str ;
		}
		if (typeof data === "string"){
			this.service.logger("WEBSOCKET TO : "+this.username + '  Message ' + data);
			this.context.send(data);
			return data ;
		}
	};

	Connections.prototype.publish = function(data){
		if (typeof data === "object"){
			var message = nodefony.extend({ 
				from		: this.username,
				userName	: this.username,
				idConnection	: this.id,
				ip		: this.ip,	
			}, data) ; 
			var str = JSON.stringify(message);
			this.service.logger("REDIS PUBLISH TO : "+this.username + '  Message '  + str);
			this.pub.publish(this.room, str);
		}
		if (typeof data === "string"){
			this.service.logger("REDIS PUBLISH TO : "+this.username + '  Message ' + data);
			this.pub.publish(this.room, data);
		}
	}

	Connections.prototype.close = function(id){
		this.logger("CLOSE");	
	};

	Connections.prototype.logger = function(pci, severity, msgid,  msg){
		if (! msgid) msgid = "\x1b[36m REDIS CONNECTION \x1b[0m";
		return this.service.logger(pci, severity, msgid,  msg)
	};


	Connections.prototype.onMessage = function(message, publih){
		if (message.to === this.username ){
			switch (message.type){
				case "REGISTER" :
					this.send({
						type:"REGISTER",
						userName:message.from,
						code:"200",
						message:"OK"
					});
				break;
				case "ANSWER" :
				case "OFFER" :
					this.send( message );
				break;
			}
		}else{
			switch (message.type){
				case "ANSWER" :
				case "OFFER" :
					if ( !  publih )
						this.publish( message );
				break;
			}
		}
	}	



	var settingsSyslog = {
		moduleName:"REDIS WEBRTC SERVICE",
		defaultSeverity:"INFO"
	};


	var WebRtc = function(container, kernel){
	
		this.motherSys = this.$super;
		this.motherSys.constructor(settingsSyslog);
		this.initSyslog();
		this.container = container ;
		this.kernel = kernel ;
		this.name ="webrtcRedis" ;
		this.options = container.getParameters("bundles.webRtc") ;

	}.herite(nodefony.syslog);

	WebRtc.prototype.initSyslog = function(){
		this.listenWithConditions(this,{
			severity:{
				data:"CRITIC,ERROR,DEBUG,INFO"
			}		
		},function(pdu){
			this.kernel.logger(pdu);
		});
		
	};

	WebRtc.prototype.logger = function(pci, severity, msgid,  msg){
		if (! msgid) msgid = "\x1b[36mWEBRTC REDIS \x1b[0m";
		return this.motherSys.logger(pci, severity, msgid,  msg)
	};

	WebRtc.prototype.handleConnection = function( context ){
		this.logger("ADPATER REDIS")
		context.webrtc = new Connections( this, context, this.options.adapter.options );		

	}

	WebRtc.prototype.handleMessage = function(message, context){
		// websocket
		var message = JSON.parse( message ) ; 
		return context.webrtc.onMessage(message) ;	
	};

	
	return WebRtc ;

});




