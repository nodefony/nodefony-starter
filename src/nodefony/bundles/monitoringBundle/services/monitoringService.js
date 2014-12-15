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


nodefony.registerService("monitoring", function(){




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
		this.name ="monitoring" ;
		this.status = "disconnect";
		this.connections= [];
		this.domain = kernel.domain;
		this.port = 1318;
		this.server = null;
		this.syslog = kernel.syslog ;
		this.createServer();

	};

	service.prototype.logger = function(pci, severity, msgid,  msg){
		if (! msgid) msgid = "SERVICE MONITORING ";
		this.realTime.logger(pci, severity,"SERVICE MONITORING");
	};




	service.prototype.createServer = function(){

		this.server = net.createServer({
			allowHalfOpen : true
		},function (socket) {
			socket.write("");
			this.stopped = false ;
			//}.bind(this));	
		}.bind(this));


		/*
 		 *	EVENT CONNECTIONS
 		 */
		this.server.on("connection",function(socket){
			this.logger("CONNECT TO SERVICE MONITORING FROM : "+socket.remoteAddress, "INFO");

			var closed = false ;
			var conn = new connection(socket);
			this.connections.push(conn) ;
			this.connections[conn.id] = this.connections[this.connections.length-1];

			var callback = function(pdu){
				if (closed || this.stopped )
					return 
				conn.write(JSON.stringify(pdu));	
			}.bind(this);

			this.connections[conn.id]["listener"]  = this.syslog.listenWithConditions(this,{
				severity:{
					data:"INFO"
				}		
			},callback);	

			socket.on('end',function(){
				closed = true ;
				this.syslog.unListen("onLog", this.connections[conn.id]["listener"]);
				this.logger("CLOSE CONNECTION TO SERVICE MONITORING FROM : "+socket.remoteAddress + " ID :" +conn.id, "INFO");
				socket.end();
				delete this.connections[conn.id];
			}.bind(this))

			socket.on("data",function(buffer){
				try {
					console.log( buffer.toString() )	
				}catch(e){
					this.logger("message :" + buffer.toString() + " error : "+e.message,"ERROR")
				}
			}.bind(this));

		}.bind(this));


		/*
 		 *	EVENT CLOSE
 		 */
		this.server.on("close",function(socket){
			this.stopped = true ;
			this.realTime.logger("SHUTDOWN server MONITORING listen on Domain : "+this.domain+" Port : "+this.port, "INFO");
		}.bind(this));

		/*
 		 *	EVENT ERROR
 		 */
		this.server.on("error",function(error){
			this.logger( "SERVICE MONITORING domain : "+this.domain+" Port : "+this.port +" ==> " + error ,"ERROR");
		}.bind(this))

		/*
 		 *	LISTEN ON DOMAIN 
 		 */
		this.server.listen(this.port, this.domain, function(){
			this.realTime.logger("Create server MONITORING listen on Domain : "+this.domain+" Port : "+this.port, "INFO");
		}.bind(this));	
			
		/*
 		 *  KERNEL EVENT TERMINATE
 		 */ 
		this.kernel.listen(this, "onTerminate", function(){
			this.stopServer();
		}.bind(this))	



	};


	service.prototype.stopServer = function(){
		this.stopped = true ;
		for (var i = 0 ; i < this.connections.length ; i++){
			this.logger("CLOSE CONNECTIONS SERVICE REALTIME : " + this.name);
			this.syslog.unListen("onLog", this.connections[i]["listener"]);
			this.connections[i].socket.end();	
			var id = this.connections[i].id;
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

	return service; 


});
