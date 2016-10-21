/*
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
stage.provide("websocket");


stage.register.call(stage.io.transports, "websocket",function(){

	var websocket = function(url, settings){
		if (url){
			this.$super.constructor(url, settings, this)
			this.connect(url, settings);
		}else{
			this.$super.constructor();
			this.socket = null;
		}
	}.herite(stage.io.transport);


	websocket.prototype.connect = function(url, settings){
		this.socket = new WebSocket(url,settings.protocol );
		this.socket.onmessage = this.listen(this, "onMessage");
		this.socket.onerror = this.listen(this, "onError");
		this.socket.onopen = this.listen(this, "onConnect");
		this.socket.onclose = this.listen(this, "onClose");
		return this.socket ;
	}


	websocket.prototype.close = function(url, settings){
		this.socket.close();
	};

	websocket.prototype.send = function(data){
		this.socket.send(data);
	};

	websocket.prototype.destroy = function(data){
		delete this.socket ;
		this.socket = null;
	};



	return websocket;

});
