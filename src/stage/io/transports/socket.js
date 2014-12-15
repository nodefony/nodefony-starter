/*
 *
 *
 *
 *
 *
 */

stage.provide("socket");

stage.register.call(stage.io, "socket", function(){


	var defaultSettings = {
		type:"websocket", //   websocket | poll | longPoll 
	}


	var bestTransport = function(){
	
	}; 



	var socket = function(url, localSettings){

		this.settings = stage.extend({}, defaultSettings, localSettings);
		this.$super.constructor(this.settings, this);	

		switch (this.settings.type){
			case "websocket":
				this.socket = stage.io.transports.websocket ; 
			break;
			case "poll":
				this.socket = stage.io.transports.ajax ;
			break;
			case "longPoll":
				this.socket = stage.io.transports.ajax ;
			break;
		}

		this.listen(this, "onConnect");
		this.listen(this, "onClose");
		this.listen(this, "onError");
		this.listen(this, "onMessage");
		this.listen(this, "onTimeout");

	}.herite(stage.notificationsCenter.notification);


	socket.prototype.write = function(settings){
		this.transport.send();
	};

	socket.prototype.close = function(settings){
		this.transport.close();
	};

	socket.prototype.connect = function(url, settings){

		this.transport = new this.socket(url, settings);
		this.transport.onmessage = this.listen(this, "onMessage");
		
	};


	socket.prototype.destroy = function(settings){
		this.transport = null ;
		this.clearNotifications();
	}



	return socket ;


});
