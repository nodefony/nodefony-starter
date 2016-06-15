/*
 *
 *
 *
 *
 *
 *
 */
stage.register("realtime",function(){



	var defaultSettings = {
	
	};

	var settingsSyslog = {
		moduleName:"REALTIME",
		defaultSeverity:"INFO"
	};

	var realtime = function(urlServer, settings){
		if (! urlServer)
			throw new Error("realtime url server is not defined")
		this.settings = stage.extend({}, defaultSettings, settings); 
		this.notificationCenter = stage.notificationsCenter.create(this.settings, this);
		this.syslog =  new stage.syslog(settingsSyslog);
		this.url = stage.io.urlToOject(urlServer) ;
		//this.crossDomain =  ! stage.io.isSameOrigin(this.url.href);	
		this.protocol = new stage.io.protocols.bayeux(this.url); 
		this.services = null;
		this.subscribedService = {};
		this.nbSubscribed = 0 ;
		this.connected = false ;
		this.publicAddress = null;
		this.domain = null;

		/*
 		 *	EVENT REALTIME
 		 */
		this.notificationCenter.listen(this, "onAuthorized", function(){
			this.protocol.handshake(this.url.href)
		});

		/*
 		 *	EVENTS PROTOCOL BAYEUX
 		 */
		this.protocol.notificationCenter.listen(this, "onMessage", this.onMessage);
		this.protocol.notificationCenter.listen(this, "onHandshake", function(message, socket){
			if (message.ext && message.ext.address){
				var addr = JSON.parse(message.ext.address);
				this.publicAddress = addr.remoteAddress ;
				this.domain = addr.host;
			}
			this.notificationCenter.fire("onHandshake", message, socket, this)	
		});
		this.protocol.notificationCenter.listen(this, "onConnect", function(message){
			this.services = message.data;
			this.connected = true ;
			if (message.ext && message.ext.address){
				var addr = JSON.parse(message.ext.address);
				this.publicAddress = addr.remoteAddress ;
				this.domain = addr.host;
			}
			this.notificationCenter.fire("onConnect", message, this)
		}); 
		this.protocol.notificationCenter.listen(this, "onDisconnect", function(message){
			this.services = message.data;
			this.connected = false ;
			this.notificationCenter.fire("onDisconnect", message, this)
		});
		this.protocol.notificationCenter.listen(this, "reConnect", function(bayeux){
			setTimeout(function(){
				this.start();
			}.bind(this), 60000)
		});
		this.protocol.notificationCenter.listen(this, "onSubscribe", function(message){
			var service = message.subscription.split("/")[2];
			this.subscribedService[service] = message ;
			this.nbSubscribed ++ ;
			this.notificationCenter.fire("onSubscribe", service, message, this)
		}); 
		this.protocol.notificationCenter.listen(this, "onUnsubscribe", function(message){
			var service = message.subscription.split("/")[2];
			delete this.subscribedService[service];
			this.nbSubscribed -- ;
			this.notificationCenter.fire("onUnSubscribe", service, message, this)
		});
		this.protocol.notificationCenter.listen(this, "onError", function(code, arg, message){
			this.notificationCenter.fire("onError", code, arg, message);
		}); 
		this.protocol.notificationCenter.listen(this, "onClose", function(message){
			this.connected = false ;
			this.notificationCenter.fire("onClose", message);
			for(var service in this.subscribedService ){
				//this.unSubscribe(service);
				delete this.subscribedService[service];
			}
		});

		//this.start();	
	};

	realtime.prototype.listen = function(){
		return 	this.notificationCenter.listen.apply(this.notificationCenter, arguments);
	};

	realtime.prototype.unListen = function(){
		return 	this.notificationCenter.unListen.apply(this.notificationCenter, arguments);
	};


	realtime.prototype.start = function(){
		if ( this.connected ){
			//throw new Error("connection already started");
			this.notificationCenter.fire("onError", 500, this, "connection already started");
			return false;
		}
		var statusCode  = {
			
                	401: function(request, type, message) {
				var auth = request.getResponseHeader("WWW-Authenticate");
				var res = request.responseText;
				var obj =  {
					"WWW-Authenticate":request.getResponseHeader("WWW-Authenticate"),
					body:request.responseText
				}
				this.authenticate = new stage.io.authentication.authenticate(this.url, obj, {
					ajax:true,
					onSuccess:function(data, type, xhr){
						this.notificationCenter.fire('onAuthorized',data, type, xhr);
					}.bind(this),
					onError:function(obj, type, message){
						var res = stage.io.getHeaderJSON(obj);
						if (res){
							this.notificationCenter.fire('onError',401, obj, res)	
						}else{
							this.notificationCenter.fire('onError',401, obj, message)
						}
					}.bind(this)
				});
				this.notificationCenter.fire('onUnauthorized', this.authenticate , this);
                	}.bind(this),
			404:function(obj, type, message){
				// '404 - realtimeD server not available'
				this.notificationCenter.fire('onError',404, obj, message );	
			}.bind(this),
                	503: function(obj, type, message) {
				//  '503 - Service Unavailable'
			    	this.notificationCenter.fire('onError',503, obj, message);
                	}.bind(this)   
            	};

		return $.ajax({
            		method: 'GET',
		        cache:false,
            		url: this.url.href ,
            		statusCode:statusCode,
		        success:function(data, type, xhr){
				this.notificationCenter.fire('onAuthorized',data, type, xhr);
			}.bind(this),
            		error: function(obj, type, message) {
				if (obj.status in statusCode )
					return ;
				this.notificationCenter.fire('onError', obj.status, obj, message);
            		}.bind(this)
        	});
	};


	realtime.prototype.subscribe = function(name, data){
		if ( ! this.connected ){
			this.notificationCenter.fire('onError', 500, this, "Not connected");
			return false;
		}
		if ( name in this.services ){
			if (name in this.subscribedService ){
				this.notificationCenter.fire('onError', 500, this, "already subscribed");
				return false;
			}
			return send.call(this,  this.protocol.subscribe(name, data) ) ;	
		}	
		this.notificationCenter.fire('onError', 500, this, "service : "+ name + " not exist");	
		return false ;
	};

	realtime.prototype.unSubscribe = function(name, data){
		if ( ! this.connected ){
			this.notificationCenter.fire('onError', 500, this, "Not connected");	
			return false;
		}
		if ( name in this.services ){
			
			if (  name in this.subscribedService ){
				var clientId = this.subscribedService[name].clientId;
				return send.call(this,  this.protocol.unSubscribe(name, clientId, data) ) ;	
			}else{
				this.notificationCenter.fire('onError', 500, this, "service : "+ name + " not subcribed");	
				return false;
			}
		}
		this.notificationCenter.fire('onError', 404, this, "service : "+ name + " not exist");	
		return false;
	};

	var send = function(data){
		this.protocol.send(data)	
	};


	realtime.prototype.sendMessage = function(service , data){
		if ( ! this.connected ){
			this.notificationCenter.fire('onError', 500, this, "Not connected");	
			return false;
		}
		if ( service in this.services ){
			if (service in this.subscribedService ){
				var clientId = this.subscribedService[service].clientId;
				try {
					var proto = this.protocol.sendMessage(service, data, clientId) ;
					send.call(this,  proto );
					return JSON.parse(proto).id	
				}catch(e){
					this.fire("onError",500, e, e.message);
				}
			}else{
				this.notificationCenter.fire('onError', 500, this, "service : "+ service + " not subcribed");	
				return false;
			}
		}else{
			this.fire("onError",404, this, "service :"+service + " not exit");
		}
		return false;
	};


	realtime.prototype.stop = function(){
		if (  this.connected ){
			this.protocol.stopReConnect();
			for(var service in this.subscribedService ){
				//this.unSubscribe(service);
				delete this.subscribedService[service];
			}
			
			return send.call(this, this.protocol.disconnect() );
		}
		throw new Error("connection already stoped");
	};

	realtime.prototype.onMessage = function(message){
		if (message.error){
			if (message.channel)
				this.notificationCenter.fire("onError", message.error);
			else
				this.notificationCenter.fire("onError",message.id, message.successful );		
		}else{
			if (message.channel)
				this.notificationCenter.fire("onMessage", message.channel.split("/")[2], message.data);
			else
				this.notificationCenter.fire("onMessage",message.id, message.successful);
		}
	};



	return realtime ;

});
