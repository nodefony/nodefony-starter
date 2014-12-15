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
			delete this.connections[id]
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
	
	}
	User.prototype.getConnection = function(){
		return this.connection ;
	};
	
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
			ip		: this.ip	
		}, data);
		//console.log(ele)
		this.send(ele);
		/*switch (type){
			
			case "REGISTER" :
				
			break;
			case "OFFER" :
			break;
			case "ANSWER" :
			break;
		
		}*/

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
					
					delete this.users[users] ;
				} 
			}
			this.connections.removeConnection(id);
		});
		return context.send(JSON.stringify({
			type:"CONNECT",
			idConnection:id
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
						//console.log("id in connection struct")
						this.users[message.user] = new User(message.user, this.connections.connections[message.idConnection], this);
						return this.users[message.user].ack(message.type , {
							type:"REGISTER",
							userName:message.user,
					        	code:"200",
					        	message:"OK"
						});
					}else{
						return context.send({
							type:"REGISTER",
							userName:message.user,
					        	code:"501",
					        	message:"connection dead"
						});
					}
					
				break;
				case "ANSWER" :
				case "OFFER" :
					//console.log(message.type);
					//console.log(message)
					var res = {
						type : message.type,
						sessionDescription:null,
						from:null,
						to:null
					}
					if (this.users[message.from]) {
						var user = this.users[message.from] ;
						res.sessionDescription = user.setSessionDescription( message.sessionDescription );
						res.from = user.name
						if (this.users[message.to] ){
							var remote = this.users[message.to] ;
							res.to = remote.name;
							remote.ack(message.type, res);
						}
					}
				break;
				case "CANDIDATE" :
					//console.log((new Date()) + ' Received Message ' + message.type);
					var res = {
						label		: message.label,
						id		: message.id,
						candidate	: message.candidate,
						from		: null,
						to		: null
					}
					if (this.users[message.from]) {
						res.from = this.users[message.from].name ;
						if (this.users[message.to]){
							var remote = this.users[message.to] ;
							res.to = remote.name;
							remote.ack(message.type, res);
						}
					}
				break;
				case "BY" :
					console.log("BY")
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
