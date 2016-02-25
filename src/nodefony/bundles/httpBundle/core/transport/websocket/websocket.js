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
		this.request = request ; 
		this.connection = request.accept(null, request.origin);
		this.response = new nodefony.wsResponse( this.connection );
		this.originUrl = url.parse( request.origin );
		//this.remoteAddress = this.originUrl.hostname || request.httpRequest.headers['x-forwarded-for'] || request.httpRequest.connection.remoteAddress || request.remoteAddress ;
		this.secureArea = null ;
		this.cookies = this.parseCookies( request.cookies );
		this.domain =  this.container.getParameters("kernel").system.domain;
		this.logger(' Connection Websocket Connection from : ' + this.connection.remoteAddress +" PID :" +process.pid + " ORIGIN : "+request.origin , "INFO", null, {
			remoteAddress:this.remoteAddress,
			origin:request.origin
		});

		this.security = null ;
		this.user = null ;

		this.url = this.request.resourceURL.href;
		this.remoteAdress = this.request.remoteAddress ;
		//console.log(this)

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

	websocket.prototype.parseCookies = function(cookies){
		var obj = {};
		for (var i = 0 ; i<cookies.length ; i++ ){
			obj[cookies[i].name] = 	cookies[i].value ;
		}
		return obj ;	
	};

	websocket.prototype.listen = function(){
		return this.notificationsCenter.listen.apply(this.notificationsCenter, arguments);
	};

	websocket.prototype.fire = function(){
		return this.notificationsCenter.fire.apply(this.notificationsCenter, arguments);
	};

	websocket.prototype.clean = function(){
		delete  this.response.body ;
		delete	this.response ;
		delete 	this.notificationsCenter ;
	}

	websocket.prototype.handleMessage = function(message){
		try {
			this.resolver = this.get("router").resolve(this.container, this.request);
			this.fire("onMessage", message, this, this.resolver) ;
			if (this.resolver.resolve) {
				return this.resolver.callController(message);
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
			this.resolver  = this.get("router").resolve(this.container, this.request);
			//WARNING EVENT KERNEL
			this.kernel.fire("onRequest", this, this.resolver);
			if (this.resolver.resolve) {
				return this.resolver.callController(data || null);
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
		//console.log(this.response)
		if ( this.response ){
			return this.response.send(data || this.response.body)
		}
		return null ;
	};

	websocket.prototype.close = function(reasonCode, description ){
		try {
			this.logger( new Date() + ' Connection Websocket CLOSE : ' + this.connection.remoteAddress +" PID :" +process.pid + " ORIGIN : "+this.request.origin  +" " +reasonCode +" " + description , "INFO");
			if (this.connection.state !== "closed")
				this.connection.close();
			this.notificationsCenter.fire("onClose", reasonCode, description, this.connection);
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
