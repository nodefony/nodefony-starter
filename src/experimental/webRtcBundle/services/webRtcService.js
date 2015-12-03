var shortId = require('shortid');


nodefony.registerService("webrtc", function(){

	/*
	 *
	 *	CLASS CONNECTION
	 *
	 */
	var Connections = function(){
		this.connections = {};
	};

	Connections.prototype.generateId = function(){
		return shortId.generate();
	};

	
	Connections.prototype.getConnectionById = function(id){
		return this.connections[id] ;
	};

	Connections.prototype.setConnection = function(connection){
		var id  = this.generateId() ;
		connection.id = id ;
		this.connections[id] = connection ;
		return id;
	};

	Connections.prototype.removeConnection = function(id){
		if (this.connections[id]) {
			delete this.connections[id];
			return true ;
		}
		return false ;
	};

	/*
 	 *
 	 *	USERS
 	 *
 	 */
	var User = function(name , connection, service){
		this.connection = connection ;
		this.connectionId = this.connection.id;
		this.name = name ;
		this.service = 	service ;
		this.state = "register";
		this.ip = this.connection.remoteAddress;
		this.sessionDescription = null ;
		this.dialogs = {};
	
	}
	User.prototype.getConnection = function(){
		return this.connection ;
	};

	User.prototype.removeConnection = function(){
		this.getConnection().removeConnection(this.connectionId);
	}

	User.prototype.setDialog = function(){
	
	}
	
	User.prototype.setSessionDescription =function(sessionDescription){
		this.sessionDescription = sessionDescription;
		return sessionDescription;
	};

	User.prototype.send = function(data){
		if (typeof data === "object"){
			var str = JSON.stringify(data);
			this.service.logger("TO : "+this.name + '  Message '  + str);
			this.getConnection().send(str)
		}
		if (typeof data === "string"){
			this.service.logger("TO : "+this.name + '  Message ' + data);
			this.getConnection().send(data)
		}
	};

	User.prototype.ack = function(type , data){
		//console.log(data);
		var ele = nodefony.extend({}, {
			type		: type,
			userName	: this.name,
			idConnection	: this.connectionId,
			ip		: this.ip,	
		}, data);
		//console.log(ele)
		this.send(ele);
	}

	var settingsSyslog = {
		moduleName:"WEBRTC SERVICE",
		defaultSeverity:"INFO"
	};


	var WebRtc = function( container, kernel){
	
		this.motherSys = this.$super;
		this.motherSys.constructor(settingsSyslog);
		this.initSyslog();
		this.container = container ;
		this.kernel = kernel ;
		this.name ="webrtc" ;
		this.connections = new Connections();
		this.users = {};

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
		if (! msgid) msgid = "\x1b[36mWEBRTC \x1b[0m";
		return this.motherSys.logger(pci, severity, msgid,  msg)
	};


	WebRtc.prototype.handleConnection = function( context){
		var id = this.connections.setConnection(context);
		context.notificationsCenter.listen(this,"onClose", function(){
			for ( var users in this.users ){
				if ( this.users[users].connectionId === id){
					this.logger("delete user :" + this.users[users].name);
					var userToDelete = this.users[users].name ;
					delete this.users[users] ;
				} 
			}
			for ( var users in this.users ){
				var res = {
					type : "BYE",
					from: userToDelete,
					to: this.users[users].name,
					code:200
				}
				var user = this.users[users] ;
				user.ack( res.type,   res  );
			}

			this.connections.removeConnection(id);
		});
		return context.send(JSON.stringify({
			type:"CONNECT",
			idConnection:id,
			code:200
		}));
	};

	WebRtc.prototype.handleMessage = function(message, context){
		// websocket
		return this.onMessage(JSON.parse(message), context);	
	};

	WebRtc.prototype.onMessage = function(message, context){
		if (message){
			switch (message.type){
				case "REGISTER" :
					//console.log(message)
					if (message.idConnection in this.connections.connections){
						//console.log("id in connection struct");
						
						if ( this.users[message.from] ){
							var res = nodefony.extend( message, {
								type:"REGISTER",
								userName:message.from,
								code:"409",
								message:"Already REGISTERED on : "+ this.users[message.from].ip
							});
							//this.users[message.from].ack(message.type , res);
							// call to new connection
							var connection = this.connections.getConnectionById(message.idConnection);
							var str = JSON.stringify(res);
							this.logger("TO : "+this.name + '  Message '  + str);
							connection.send(str);
						}else{
							this.users[message.from] = new User(message.from, this.connections.connections[message.idConnection], this);
						}
						return this.users[message.from].ack(message.type , nodefony.extend( message, {
							type:"REGISTER",
							userName:message.from,
					        	code:"200",
					        	message:"OK"
						}));
					}else{
						return context.send(nodefony.extend( message, {
							type:"REGISTER",
							userName:message.from,
					        	code:"501",
					        	message:"connection dead"
						}));
					}
					
				break;
				case "ANSWER" :
				case "OFFER" :
					var res = {
						type : message.type,
						sessionDescription:null,
						from:null,
						to:null,
						code:message.code
					}

					if (this.users[message.from]) {
						var user = this.users[message.from] ;
						if ( message.sessionDescription ){
							res.sessionDescription = user.setSessionDescription( message.sessionDescription );
						}
						res.from = user.name
						if (this.users[message.to] ){
							var remote = this.users[message.to] ;
							res.to = remote.name;
							remote.ack(message.type,  message   );
						}else{
							user.ack(message.type, nodefony.extend( message, {
								from:message.to,
								to:message.from,
					        		code:404,
					        		message:"User not connected"
							}) ) ;	
						}
					}else{

						
					}
				break;
				case "BYE" :
					var res = {
						type : message.type,
						from:null,
						to:null,
						code:200
					}
					if (this.users[message.from]) {
						var user = this.users[message.from] ;
						res.from = user.name ;
						if (this.users[message.to] ){
							var remote = this.users[message.to] ;
							res.to = remote.name;
							remote.ack( message.type, nodefony.extend( message, res ) );
						}
					}else{
						return context.send(nodefony.extend( message, {
							type:message.type,
							userName:message.from,
					        	code:"404",
					        	message:"Dialog not found"
						}));
					}

				break;
				case "CLOSE" :
					console.log("CLOSE")
				break;
				default:
					/*context.send(JSON.stringify({
						ACK : message
					}))*/
			}
		}
	};

	return WebRtc ;

});
