/*
 *
 *
 *
 *
 *
 */


nodefony.register.call(nodefony.io.transports, "websocket", function(){


	var websocket = function(container, request, response ,type){
		this.type = type ;
		this.container = container;
		this.kernel = this.container.get("kernel") ;
		this.request =request ; 
		this.connection = request.accept(null, request.origin);
		this.response = new nodefony.wsResponse( this.connection );
		this.remoteAddress = request.httpRequest.headers['x-forwarded-for'] || request.httpRequest.connection.remoteAddress || request.remoteAddress ;
		this.logger(' Connection Websocket Connection from : ' + this.connection.remoteAddress +" PID :" +process.pid + " ORIGIN : "+request.origin , "INFO", null, {
			remoteAddress:this.connection.remoteAddress,
			origin:request.origin
		});

		//  manage EVENTS
		this.notificationsCenter = nodefony.notificationsCenter.create();
		this.container.set("notificationsCenter", this.notificationsCenter);

		// LISTEN EVENTS KERNEL 
		this.notificationsCenter.listen(this, "onView", function(result){
			this.response.body = result;
		}.bind(this));
		this.notificationsCenter.listen(this, "onResponse", this.send);
		this.notificationsCenter.listen(this, "onRequest", this.handle);

		// LISTEN EVENTS SOCKET	
		
		

		this.connection.on('message', this.handleMessage.bind(this));

		this.connection.on('close', this.close.bind(this)); 

		/* // assembleFragments:false 
 		 * this.connection.on('frame', function(webSocketFrame) {
			console.log(webSocketFrame.binaryPayload.toString())
		}.bind(this));*/
	};


	websocket.prototype.handleMessage = function(message){
		try {
			var resolver = this.get("router").resolve(this.container, this.request);
			if (resolver.resolve) {
				return resolver.callController(message);
			}else{
				this.request.reject();
			}
		}catch(e){
			this.notificationsCenter.fire("onError", this.container, e);	
		}	

	};


	websocket.prototype.handle = function(container, request, response, data){
		this.container.get("translation").handle( request );
		try {
			var resolver = this.get("router").resolve(this.container, this.request);
			if (resolver.resolve) {
				return resolver.callController(data || null);
			}else{
				request.reject();
			}
		}catch(e){
			this.notificationsCenter.fire("onError", this.container, e);	
		}		

	};

	websocket.prototype.logger = function(pci, severity, msgid,  msg){
		var syslog = this.container.get("syslog");
		if (! msgid) msgid = "REQUEST "+this.type ;
		return syslog.logger(pci, severity, msgid,  msg);

	};


	websocket.prototype.send = function(data){
		//console.log(data)
		return this.response.send(data || this.response.body)
	};

	websocket.prototype.close = function(reasonCode, description){
		try {
			this.notificationsCenter.fire("onClose", reasonCode, description);
			this.logger( new Date() + ' Connection Websocket CLOSE : ' + this.connection.remoteAddress +" PID :" +process.pid + " ORIGIN : "+this.request.origin  +" " +reasonCode +" " + description , "INFO");
			this.connection.close();
		}catch(e){
			this.logger( new Date() + ' ERROR  Websocket CLOSE : ' + this.connection.remoteAddress +" PID :" +process.pid + " ORIGIN : "+this.request.origin  +" " +e , "ERROR")
		}
		this.kernel.container.leaveScope(this.container);
	};


	websocket.prototype.get = function(name){
		if (this.container)
			return this.container.get(name);
		return null;
	};

	websocket.prototype.set = function(name, obj){
		if (this.container)
			return this.container.set(name, obj);
		return null;
	};

	return websocket 


});
