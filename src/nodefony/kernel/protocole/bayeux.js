/*
 *
 *	SERVER
 *
 */

var shortId = require('shortid');

nodefony.register.call(nodefony.io.protocol, "bayeux",function(){


	var defaultSettings = {
		timestamp:true
	}

	var bayeux = function(rootName, settings){
	
		this.proto = this.$super;
		this.proto.constructor(null, {
			extention:"json"
		});

		this.settings = nodefony.extend({}, defaultSettings, settings )

		this.supportedConnectionTypes = [];
		
		this.response = {
			version:"1.0",
		};

	}.herite(nodefony.io.protocol.reader);


	bayeux.prototype.generateClientId = function(){
		return shortId.generate();	
	};

	bayeux.prototype.generateTimestamp = function(){
		return new Date().toUTCString();	
	};

	bayeux.prototype.handshakeResponse = function(message, advice, ext){
		if ( advice ) 
			var reconnect = "retry" ;
		else
			var reconnect = "none" ;	
		var ele = nodefony.extend({}, this.response , {
			channel : "/meta/handshake",
			//clientId:this.generateClientId(),
			supportedConnectionTypes: ["websocket"],
			//successful:true,
			authSuccessful:true,
			advice:{reconnect:reconnect},
			ext: ext || {}
		});
		if (this.settings.timestamp) 
			ele.timestamp = this.generateTimestamp(); 
		return ele;
	};

	bayeux.prototype.connectResponse = function(message, advice, ext){
		if ( advice ) 
			var reconnect = "retry" ;
		else
			var reconnect = "none" ;
		var ele = nodefony.extend({}, this.response , {
			channel: "/meta/connect",
			successful: true,
			error: "",
			clientId: message.clientId,
			timestamp: new Date(),
			advice: { reconnect: reconnect },
			ext: ext || {}
		});
		return ele;
	};
	
	bayeux.prototype.disconnectResponse = function(message){
		var ele = nodefony.extend({}, this.response , { 
			channel: "/meta/disconnect",
			clientId: message.clientId,
			successful: true
		});
		return ele ;
	};

	bayeux.prototype.subscribeResponse = function(message){
		var ele = nodefony.extend({}, this.response , {
			 channel: "/meta/subscribe",
			 clientId: message.clientId,
			 subscription: message.subscription,
			 error: ""
		});	
		return ele ;
	};

	bayeux.prototype.unsubscribeResponse = function(message){
		var ele = nodefony.extend({}, this.response , {
			 channel: "/meta/unsubscribe",
			 clientId: message.clientId,
			 subscription: message.subscription,
			 successful: true,
			 error: ""
		});	
		return ele ;
	
	};
	
	bayeux.prototype.publishResponse = function(channel, id, error){
		return this.send ( nodefony.extend({}, this.response , {
			channel: channel,
		        successful: error ? false : true,
			error:error,
			id: id
		}) );	
	};

	bayeux.prototype.publishMessage = function(channel, data, clientId){
		return this.send ( nodefony.extend({}, this.response , {
			channel: channel,
			data: data,
			clientId: clientId
		}) );	
	};

	bayeux.prototype.errorResponse = function(code, channel, message){
		return  {
			error: code+":"+channel+":"+message
		} ;
	};

	bayeux.prototype.onMessage = function(message){
		switch (nodefony.typeOf(message) ) {
			case "string" :
 			       var ret = null ;	
				this.parser(message, function(err, mess){
					if (err){
						//console.log(err)
						throw err ;
					}
					ret = this.onMessage(mess) ;	
				}.bind(this));
				return ret ;
			break;
			case "object" :
				switch(message.channel){
					case "/meta/handshake":
						return this.send( this.handshakeResponse(message) );
					break;
					case "/meta/connect":
						return this.send( this.connectResponse(message) );
					break;
					case "/meta/disconnect":
						return this.send( this.disconnectResponse(message) );
					break;
					case "/meta/subscribe":
						return this.send( this.subscribeResponse(message) );
					break;
					case "/meta/unsubscribe":
						return this.send( this.unsubscribeResponse(message) );
					break;
					default:
						return this.send( this.publishResponse(message) );
						// /some/channel
				}
			break;
			case "array" :
				var tab = [];
				for (var i = 0 ; i< message.length ; i++){
					tab.push( this.onMessage(message[i]) );
				}
				return this.send(tab) ;
			break;
			default :
				throw new Error ("BAYEUX message bad format ");
		}
	};

	bayeux.prototype.send = function(message){
		return this.builderResponse(message)	
	};

	
	return bayeux ;

});
