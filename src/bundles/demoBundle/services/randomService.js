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
var nodedomain = require('domain');
var xml = require('xml2js');


nodefony.registerService("random", function(){

	

	var randomChain = function(){
		var txt = "";
		//for (var i = 0 ; i < 65481; i++){
		for (var i = 0 ; i < 35000; i++){
			txt+="A";
		}
		return txt+"EOF";

	}();


	var random = function( service){
		this.service = service;
		this.interval = null;
		this.notificationsCenter = nodefony.notificationsCenter.create();
		
	};

	random.prototype.start  =function(time){
		this.interval = setInterval(function() {
			var value = parseInt(Math.random()*100,10) ;
			//value  = randomChain;
			//this.service.logger(value, "DEBUG");
			this.notificationsCenter.fire("tic", value );
                }.bind(this), time || 1000);
	};


	random.prototype.listen  =function(context, callback){
		this.notificationsCenter.listen(context || this, "tic", callback)		
	};

	random.prototype.unListen  =function( callback){
		this.notificationsCenter.unListen("tic" , callback);		
	};


	random.prototype.stop  =function(){
		 return clearInterval(this.interval);
	};

	var connection = function(socket){
		this.socket = socket ;
		this.id = socket._handle.fd+"_"+socket.server._connectionKey;
		this.readable = socket.readable ;
		this.writable = socket.writable;
	};

	connection.prototype.write = function(data){
		this.socket.write(data);
	};

	var service = function(realTime, container, kernel){
	
		this.realTime = realTime ;
		this.container = container ;
		this.kernel = kernel ;
		this.random = new random( this);
		this.name ="random" ;
		this.status = "disconnect";
		//this.nbConnections = 0 ;
		this.connections= [];
		this.domain = kernel.domain;
		this.port = 1315;
		this.server = null;
		this.createServer();
		this.protocol = new nodefony.io.protocol["json-rpc"]();
	};

	service.prototype.logger = function(pci, severity, msgid,  msg){
		if (! msgid) msgid = "SERVICE RANDOM ";
		this.realTime.logger(pci, severity,"SERVICE RANDOM");
	};



	service.prototype.stopServer = function(){
		this.stopped = true ;
		for (var i = 0 ; i < this.connections.length ; i++){
			this.connections[i].socket.end();	
			var id = this.connections[i].id
			delete this.connections[id];
		}
		this.connections.length = 0 ;
		if (this.server){
			try {
				this.server.close();
			}catch(e){
				this.logger(e, "ERROR")
			}
		}
	};


	service.prototype.createServer = function(){
	
		this.server = net.createServer({
			allowHalfOpen : true
		},function (socket) {
			//var d = nodedomain.create();
			//d.on('error', function(er) {
			//	this.realTime.logger(er.stack);
			//}.bind(this));
			//d.add(socket);
			//d.run(function() {
				
			socket.write("READY");
			this.stopped = false ;
			//}.bind(this));	
		}.bind(this));

		/*
 		 *	EVENT CONNECTIONS
 		 */
		this.server.on("connection",function(socket){
			this.logger("CONNECT TO SERVICE RANDOM FROM : "+socket.remoteAddress, "INFO");
			
			var conn = new connection(socket);
			this.connections.push(conn) ;
			this.connections[conn.id] = this.connections[this.connections.length-1];
			
			var closed = false ;

			var callback = function(value){
				try {
					if (closed || this.stopped )
						return
					conn.write(this.protocol.methodSuccees(value));
				}catch(e){
					this.logger(e,"ERROR")	
				}
			}.bind(this);
			this.random.listen(this, callback);

			socket.on('end',function(){
				//console.log(arguments)
				closed = true
				this.logger("CLOSE CONNECTION TO SERVICE RANDOM FROM : "+socket.remoteAddress + " ID :" +conn.id, "INFO");
				this.random.unListen(callback);
				socket.end();
				this.server.getConnections(function(err, nb){
					if (nb === 0)
						this.random.stop();
				}.bind(this));
				delete this.connections[conn.id];
			}.bind(this))

			socket.on("data",function(buffer){
				try {
					var message = this.protocol.onMessage(buffer.toString());
					switch (message.method){
						case "start":
							this.server.getConnections(function(err, nb){
								if (nb === 1 ){
									try {
										this.random.start.apply(this.random, message.params )
									}catch(e){
										conn.write(this.protocol.methodError(e.message, message.id));	
									}
								}
							}.bind(this));
						break;
						case "stop":
							try {
								this.random.stop.apply(this.random, message.params )
							}catch(e){
								conn.write(this.protocol.methodError(e.message, message.id));	
							}
						break;
					}
				}catch(e){
					//conn.write(this.protocol.methodError(e.message, message.id));	
					this.logger("message :" + buffer.toString() + " error : "+e.message,"ERROR")
				}
			}.bind(this));

			
		}.bind(this));

		/*
 		 *	EVENT CLOSE
 		 */
		this.server.on("close",function(socket){
			this.stopped = true ;
			this.realTime.logger("SHUTDOWN server RANDOM listen on Domain : "+this.domain+" Port : "+this.port, "INFO");
		}.bind(this));

		/*
 		 *	EVENT ERROR
 		 */
		this.server.on("error",function(error){
			this.logger( "SERVICE RANDOM domain : "+this.domain+" Port : "+this.port +" ==> " + error ,"ERROR");
		}.bind(this))

		/*
 		 *	LISTEN ON DOMAIN 
 		 */
		this.server.listen(this.port, this.domain, function(){
			this.realTime.logger("Create server RANDOM listen on Domain : "+this.domain+" Port : "+this.port, "INFO");
		}.bind(this));	
			
		/*
 		 *  KERNEL EVENT TERMINATE
 		 */ 
		this.kernel.listen(this, "onTerminate", function(){
			this.stopServer();
		}.bind(this))	
	};

	return service; 


});
