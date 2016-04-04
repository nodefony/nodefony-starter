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
		this.origin = request.origin;
		//TODO acceptProtocol header sec-websocket-protocol   
		this.connection = request.accept(null, this.origin);
		this.response = new nodefony.wsResponse( this.connection );
		this.originUrl = url.parse( request.origin );
		//this.remoteAddress = this.originUrl.hostname || request.httpRequest.headers['x-forwarded-for'] || request.httpRequest.connection.remoteAddress || request.remoteAddress ;
		this.secureArea = null ;
		this.cookies = {};
		this.domain =  this.container.getParameters("kernel").system.domain;
		this.logger(' Connection Websocket Connection from : ' + this.connection.remoteAddress +" PID :" +process.pid + " ORIGIN : "+request.origin , "INFO", null, {
			remoteAddress:this.remoteAddress,
			origin:request.origin
		});

		this.session = null;
		this.sessionService = this.get("sessions");
		this.sessionAutoStart = this.sessionService.settings.start ;

		//parse cookies
		this.parseCookies();

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
		this.notificationsCenter.listen(this, "onError", this.handleError);

		// LISTEN EVENTS SOCKET	

		this.connection.on('message', this.handleMessage.bind(this));

		this.connection.on('close', onClose.bind(this)); 

		/* // assembleFragments:false 
 		 * this.connection.on('frame', function(webSocketFrame) {
			console.log(webSocketFrame.binaryPayload.toString())
		}.bind(this));*/
	};

	websocket.prototype.addCookie = function(cookie){
		if ( cookie instanceof nodefony.cookies.cookie ){
			this.cookies[cookie.name] = cookie;
		}else{
			throw {
				message:"",
				error:"Response addCookies not valid cookies"
			}
		}	
	};


	websocket.prototype.parseCookies = function(){
		return  nodefony.cookies.cookiesParser(this);
	};

	websocket.prototype.listen = function(){
		return this.notificationsCenter.listen.apply(this.notificationsCenter, arguments);
	};

	websocket.prototype.fire = function(){
		return this.notificationsCenter.fire.apply(this.notificationsCenter, arguments);
	};

	websocket.prototype.clean = function(){
		delete this.request ;
		this.response.clean();
		delete	this.response ;
		delete 	this.notificationsCenter ;
		delete this.cookies ;
	}

	websocket.prototype.handleMessage = function(message){
		try {
			this.resolver = this.get("router").resolve(this.container, this.request);
			this.fire("onMessage", message, this, "RECEIVE") ;
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
		this.container.get("translation").handle( this );
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


	websocket.prototype.handleError = function(container, error){
		return 	onClose.call(this, error.status, error.message );
	
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
			this.fire("onMessage", data, this, "SEND") ;
			return this.response.send(data || this.response.body)
		}
		return null ;
	};

	var onClose = function(reasonCode, description){
		this.logger( new Date() + ' Connection Websocket CLOSE : ' + this.connection.remoteAddress +" PID :" +process.pid + " ORIGIN : "+this.request.origin  +" " +reasonCode +" " + description , "INFO");
		if (this.connection.state !== "closed"){
			try {
				this.connection.close();
				this.fire("onClose", reasonCode, description, this.connection);
			}catch(e){
				this.logger( new Date() + ' ERROR  Websocket CLOSE : ' + this.connection.remoteAddress +" PID :" +process.pid + " ORIGIN : "+this.request.origin  +" " +e , "ERROR");
			}
		}else{
			this.fire("onClose", reasonCode, description, this.connection);	
		}	
		this.kernel.container.leaveScope(this.container);
	}

	websocket.prototype.close = function(reasonCode, description ){
		if ( this.connection ){
			this.connection.close(reasonCode, description);
		}
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
