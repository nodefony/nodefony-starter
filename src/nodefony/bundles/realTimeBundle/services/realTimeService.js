/*
 *	The MIT License (MIT)
 *	
 *	Copyright (c) 2013/2014 cci | christophe.camensuli@nodefony.com
 *
 *	Permission is hereby granted, free of charge, to any person obtaining a copy
 *	of this software and associated documentation files (the 'Software'), to deal
 *	in the Software without restriction, including without limitation the rights
 *	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *	copies of the Software, and to permit persons to whom the Software is
 *	furnished to do so, subject to the following conditions:
 *
 *	The above copyright notice and this permission notice shall be included in
 *	all copies or substantial portions of the Software.
 *
 *	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *	THE SOFTWARE.
 */
var net = require('net');
var xml = require('xml2js');
var shortId = require('shortid');

nodefony.registerService("realTime", function(){

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

	Connections.prototype.getClientId = function(client){
		return client.idClient ;
	};
	Connections.prototype.getConnectionId = function(client){
		return client.idConnection ;
	};

	Connections.prototype.setConnection = function(connection, obj){
		var id  = this.generateId() ;
		connection.id = id ;
		this.connections[id] =  {
			id:id,
			remote:obj,
			context:connection,
			mustClose:false,
			clients:{}
		} ;
		return id;
	};

	Connections.prototype.getConnection = function(client){
		var id  = this.getConnectionId(client);
		return 	this.connections[id];
	};

	Connections.prototype.removeConnection = function(id){
		if (this.connections[id]) {
			delete this.connections[id]
			return true ;
		}
		return false ;
	};


	Connections.prototype.setClient = function(idConnection, client){
		if (this.connections[idConnection] ){
			var idClient  = this.generateId() ;
			client.idClient = idClient ;
			client.idConnection = idConnection ;
			this.connections[idConnection]["clients"][idClient] = client;
			return idClient;
		}else{
			throw idConnection ;
		}
	};

	Connections.prototype.getClient= function(clientId){
		for (var connection in this.connections){
			for (var client in this.connections[connection].clients ){
				if ( client === clientId ){
					return this.connections[connection].clients[client];
				}
			}	
		}
		return null;
	};

	Connections.prototype.removeClient = function(client){
		var idConnection = this.getConnectionId(client);
		var idClient = this.getClientId(client)
		if (idConnection && idClient){
			if ( this.connections[idConnection] ){
				delete this.connections[idConnection]["clients"][idClient]	;
				return idClient;
			}
		}
		return false ;
	};

	Connections.prototype.removeAllClientConnection = function(){
		for (var ele in this.connections ){
		
		}
	};

	/**
	 *	The class is a **`realTime` SERVICE** .
	 *	@module NODEFONY 
	 *	@main NODEFONY
	 *	@class realTime
	 *	@constructor
	 *	
	 */
	var settingsSyslog = {
		moduleName:"REALTIME",
		defaultSeverity:"INFO"
	};
 
	
	var realTime = function(container, kernel){
		this.motherSys = this.$super;
		this.motherSys.constructor(settingsSyslog);
		this.kernel = kernel;
		this.container = container ;
		this.version = "1.0";
		this.connections = new Connections();
		this.services = {};
		this.initSyslog();
		this.protocol = new nodefony.io.protocol.bayeux();
		this.listen(this, "onError", this.onError );
		this.listen(this, "onMessage", this.onMessage );
		this.kernel.listen(this, "onReady", function(){
			this.settings = this.container.getParameters("bundles.realTime");
			for (var services in this.settings.services){
				this.registerService(services, this.settings.services[services])
			}
		});

	}.herite(nodefony.syslog);

	realTime.prototype.registerService = function(name, definition){
		this.services[name] = definition;
		return 	this.services[name];
	};

	realTime.prototype.initSyslog = function(){
		this.listenWithConditions(this,{
			severity:{
				data:"CRITIC,ERROR,DEBUG,INFO"
			}		
		},function(pdu){
			this.kernel.logger(pdu);
		});
	};

	realTime.prototype.logger = function(pci, severity, msgid,  msg){
		if (! msgid) msgid = "SERVICE REALTIME";
		return this.motherSys.logger(pci, severity, msgid,  msg)
	};
	

	realTime.prototype.getServices = function(){
		return this.services ;
	};
	
	realTime.prototype.onHandshake = function(message, connectionId, ipClient){
		var advice = this.settings.system.reconnect.handshake ;
		var response = this.protocol.handshakeResponse(message, advice,{address:ipClient}) ;
		response.clientId = connectionId;
		response.successful = true ;
		return this.protocol.send(response) ;
	};


	

	realTime.prototype.onSubscribe = function(message, data, context){ 
		var name = message.subscription.split("/")[2] ;
		var serv = this.services[name] ;
		if (!serv ){
			message.error = this.protocol.errorResponse(404, message.subscription, "Unknown Channel" ) ;
			return this.send( context , this.protocol.send( message ));
		}
		switch (serv.type){
			case "tcp" :
				try {
					var client = new net.Socket({
						allowHalfOpen : true,
						//highWaterMark:16384*2
						highWaterMark:1024*64
					});

					
					/*client.on("readable",function(){
						console.log( client);
						var chunk;
						console.log("-------------")
						console.log(client._readableState.buffer)
						console.log(client.bytesRead);
						while (null !== (chunk = client.read())) {
							console.log(chunk.toString());
							this.send( context , this.protocol.publishMessage( message.subscription, chunk.toString(), message.clientId ) );
						}
						//client.read(0)
						console.log("-------------")
					}.bind(this));*/


					//console.log(client)	
					client.connect(serv.port, serv.domain , function(){
						try {
							if (data){
								client.write(data);
							}
							var id = this.connections.setClient(message.clientId, client);
							message.successful = true ;
							//message.data = id;
							message.clientId = id ;
							//console.log(client)
							this.logger("SUBCRIBE SERVICE : " + name +" ID = "+id, "INFO")	
						}catch(e){
							if (id){
								this.connections.removeClient(client);	
							}
							message.successful = false ;
							this.logger("SUBCRIBE SERVICE : " + name +" ID = "+id + " "+e,"ERROR");	
						}
						this.send(context, this.protocol.send( message ) );
					}.bind(this))	

					client.on("data",function(buffer){
						//console.log(buffer)
						//this.logger(buffer.length, "INFO")
						//console.log("--------")
						//console.log(buffer.length)
						//console.log(buffer.toString())
						// ENCAPSULATION buffer in bayeux data
						//console.log(buffer.toString())
						this.send( context , this.protocol.publishMessage( message.subscription, buffer.toString(), message.clientId ) );
						//client.push("");
					}.bind(this));

										
					

					/*client.on("timeout",function(buffer){
						console.log("PASS event timeout")
					});*/


					client.on("end",function(){
						message.channel =  "/meta/unsubscribe" ;
						//message.data = error ;
						message.subscription = "/service/"+name;
						message.successful = true ;
						this.onUnSubscribe(message, null, context);
						this.send(context, this.protocol.send( message )  );
					}.bind(this));

					client.on("error",function(error){
						//FIXME other error socket
						switch (error.code){
							case "ECONNREFUSED" :
								//this.send( context ,this.protocol.errorResponse(403, message.clientId+","+message.channel,error.errno ) );
								var res = this.protocol.subscribeResponse(message);
								res.error = this.protocol.errorResponse(403, message.clientId+","+message.channel,error.errno ) ;
								res.successful = false ;
								this.send(context, this.protocol.send( res ));
							break;
							case "ETIMEDOUT" :
								var res = this.protocol.subscribeResponse(message);
								res.error = this.protocol.errorResponse(408, message.clientId+","+message.channel,error.errno ) ;
								res.successful = false ;
								this.send(context, this.protocol.send( res ));
							break;
						}
						//console.log(error);
						this.logger("ERROR SERVER DOMAIN : "+serv.domain+" SERVER PORT : "+serv.port+" SERVICE : " + name + " " + error, "ERROR");
					}.bind(this));

					client.on("close",function(error){
						if (error){
							this.logger("CANNOT CONNECT SERVICE : " + name , "ERROR");
						}else{
							var connection = this.connections.getConnection(client);
							if (connection && connection.mustClose){
								var size = Object.keys(connection.clients).length ;
							}
							var id = this.connections.removeClient(client);
							this.logger("UNSUBCRIBE SERVICE : " + name +" ID = "+id, "INFO");
							if (connection && connection.mustClose){
								//console.log("SIZE clients struck :" + size)
								if ( size === 1 ){
									if (connection.disconnect){
										//console.log(connection.disconnect)
										this.send( connection.context, connection.disconnect );
									}
									this.connections.removeConnection(connection.id);	
									this.logger("REMOVE ID connection : "+connection.id, "INFO");	
								}
							}
						}
						client.destroy();
					}.bind(this));

				}catch(e){
					//FIXME
					//this.send( context ,this.protocol.errorResponse(403, message.clientId+","+message.channel,error.errno ) );
				}
			break;
			case "socket" :
			break;
			case "udp" :
			break ;
			case "spawn" :
				var spawn = require('child_process').spawn ;
			break;
			default:
				message.error = this.protocol.errorResponse(500, message.clientId+","+message.channel,"bad connection Type "+serv.type );
				return this.send( context ,this.protocol.send(message) );
		}
		return client;
	};

	realTime.prototype.onUnSubscribe = function(message, data, context, error){
		try{
			var name = message.subscription.split("/")[2] ;
			var serv = this.services[name] ;
			switch (serv.type){
				case "tcp" :
					var client = this.connections.getClient(message.clientId);
					if ( client ){
						client.end(data);
						//this.send(context, this.protocol.send( message )  );
					}
				break;
				default:
			}
		}catch(e){
			this.logger("UNSUBCRIBE  : "+ e , "ERROR");	
		}
	};


	var cleanConnection = function(cliendID, disconnect, context){
		try {
			if ( this.connections.connections[cliendID] ){
				var connectionID = this.connections.connections[cliendID].id ; 
				if ( ! connectionID){
					return ;
				}
			}else{
				return ;
			}
			if ( disconnect ){
				this.connections.connections[connectionID].disconnect = disconnect ;
				this.connections.connections[connectionID].context = context ;
			}
			var pass = false ;
			for (var cli in this.connections.connections[connectionID].clients){
				pass = true;
				this.connections.connections[connectionID].clients[cli].end();
			}
			if ( pass ){
				this.connections.connections[connectionID].mustClose = true ;
			}else{
				this.connections.removeConnection(connectionID);	
				this.logger("REMOVE ID connection : "+connectionID, "INFO");	
			}
		}catch(e){
			this.logger(e,"ERROR")
		}	
	};



	realTime.prototype.onConnect = function(message, ipClient){
		var advice = this.settings.system.reconnect.connect ;
		var response = this.protocol.connectResponse(message, advice, {address:ipClient});
		response.data = this.getServices();
		return  this.protocol.send(response) ;	
	};

	realTime.prototype.onDisconnect = function(message, context){
		var response = this.protocol.disconnectResponse(message);
		cleanConnection.call(this, message.clientId, this.protocol.send(response) , context );
		//return this.protocol.send(response);
		//return this.send( context, this.protocol.send(response) );	
	};

	realTime.prototype.onPublish = function(message){
		var client = this.connections.getClient(message.clientId);
		if (client){
			if (message.data){
				try {
					client.write(message.data);
					return this.protocol.publishResponse(message.subscription, message.id );
				}catch (e){					
					return this.protocol.publishResponse(message.subscription, message.id, false );
				}
			}else{
				var error = this.protocol.errorResponse(500, message.subscription+","+message.id, "no message " );	
				return this.protocol.publishResponse(message.subscription, message.id, error );
			}
		}else{
			var error = this.protocol.errorResponse(404, message.subscription+","+message.id, "Unknown Channel" );
			return this.protocol.publishResponse(message.subscription, message.id, error );
		}	
	};

	realTime.prototype.onError = function( error, connection){
		return this.send(connection, this.protocol.close( error) );
	};


	realTime.prototype.handleConnection = function(message, context){
		switch(context.type){
			case "WEBSOCKET":
				return this.onMessage(message, context);
			break;
			case "HTTP":
			case "HTTPS":
				return this.onMessage(message, context);
		}
	}	

	
	realTime.prototype.onMessage = function(message, context ){
		switch (nodefony.typeOf(message) ) {
			case "string" :
 			       var ret = null ;	
			        try {
					this.protocol.parser(message, function(err, mess){
						if (err){
							message.error = this.protocol.errorResponse(500, message.clientId+","+message.channel,"bad Request  "+ message) ;
							ret = this.send( context , this.protocol.send(message) );

							//throw err ;
							return ret;
						}
						ret = this.onMessage(mess, context) ;	
					}.bind(this));
				}catch(e){
					message.error = this.protocol.errorResponse(500, message.clientId+","+message.channel,"bad Request  "+ message) ;
					return this.send( context , this.protocol.send(message) );
				}
				return ret ;
			break;
			case "object" :
				try {
					switch(message.channel){
						case "/meta/handshake":
							//var remoteAddress = context.request.remoteAdress
							//var remoteAddress = context.request.domain
							var obj = {
								remoteAddress : context.remoteAddress || context.request.remoteAdress,
								host:url.parse(context.request.headers.host)	
							};
							//console.log(remoteAddress + " : " + context.request.domain)
							var connectionId = this.connections.setConnection(context, obj) ; 
							var res = this.onHandshake(message, connectionId, JSON.stringify(obj) ) ;
							
							this.logger("CONNECT ID connection  : "+ connectionId  , "INFO")
							return this.send( context, res )
						break;
						case "/meta/connect":
							var obj = {
								remoteAddress : context.remoteAddress,
								host:url.parse(context.request.origin)	
							};
							//var remoteAddress = context.request.remoteAddress ;
							//var remoteAddress = context.request.domain ;
							//console.log(context.request)
							context.notificationsCenter.listen(this,"onClose", function(code, info){
							//context.connection.on('close',function(code, info){
								cleanConnection.call(this, message.clientId)
							}.bind(this));
							//setTimeout(function(){context.connection.close()},10000)
							return this.send( context, this.onConnect(message, JSON.stringify(obj)) );
						break;
						case "/meta/disconnect":
							return this.onDisconnect(message, context);
							//return this.send( context, this.onDisconnect(message, context) );
						break;
						case "/meta/subscribe":
							return this.onSubscribe(this.protocol.subscribeResponse(message ), message.data, context );
						break;
						case "/meta/unsubscribe":
							return this.onUnSubscribe( this.protocol.unsubscribeResponse(message) ,message.data, context ); 
						break;
						default:
							// /some/channel
							return this.send( context , this.onPublish(message));
					}
				}catch(e){
					message.error = this.protocol.errorResponse(500, message.clientId+","+message.channel,"bad Request  "+ message) ;
					return this.send( context , this.protocol.send(message));	
				}
			break;
			case "array" :
				var tab = [];
				for (var i = 0 ; i< message.length ; i++){
					tab.push( this.onMessage(message[i]) , context );
				}
				return tab ;
			break;
			default :
				throw new Error ("BAYEUX message bad format ");
		}
	};

	realTime.prototype.send = function( connection, message){
		//console.log("SEND :   "+ message)
		try {
			switch (connection.type){
				case "HTTP":
				case "HTTPS":
					connection.response.body = message ;
					connection.response.setHeader("Content-Type", "application/json");
					//return connection.response ;
				break;
				case "WEBSOCKET":
					connection.send(message);
				break;
			}
			return connection.response ;
		}catch(e){
			this.logger(e,"ERROR")
		}
	}

	return realTime;

});

