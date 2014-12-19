/*
 * 
 * 
 *    
 * 
 * 
 */

var net = require('net');
var nodedomain = require('domain');



nodefony.registerService("dmsg", function(){

	
	/*
 	 *
 	 *
 	 *
 	 */
	var connection = function(socket){
		this.socket = socket ;
		this.id = socket._handle.fd+"_"+socket.server._connectionKey;
		this.readable = socket.readable ;
		this.writable = socket.writable;
	};

	connection.prototype.write = function(data){
		this.socket.write(data+"");
	};
	
	/*
 	 *
 	 *
 	 *
 	 *
 	 */
	var dmsg = function(realTime, container, kernel){
	
		this.realTime = realTime ;
		this.container = container ;
		this.kernel = kernel ;
		this.status = "disconnect";
		this.connections= [];
		this.domain = kernel.domain;
		this.port = 1316;
		this.nbConnections = 0;

		this.createWatcher();

		this.server = null;	
		this.createServer();

	};

	dmsg.prototype.logger = function(pci, severity, msgid,  msg){
		if (! msgid) msgid = "SERVICE DMSG ";
		if (this.realTime)
			this.realTime.logger(pci, severity,"SERVICE DMSG");
		else
			this.kernel.logger(pci, severity,"SERVICE DMSG");
	};


	dmsg.prototype.createWatcher = function(){

		var fileDmsg = this.kernel.platform === "darwin" ? "/var/log/system.log" : "/var/log/message" ;
 

		this.watcher = new nodefony.watcher(fileDmsg);
		
		this.watcher.listen(this, 'onError',function(error){
			this.realTime.logger(error, "ERROR");
		}.bind(this));
	
		
	};

	dmsg.prototype.createServer = function(){

		this.server = net.createServer({
			allowHalfOpen : true
		},function (socket) {
			
				var conn = new connection(socket);
				this.connections.push(conn) ;
				this.connections[conn.fd] = this.connections[this.connections.length-1];
				
				var callback = function(path, stat){
					
					try {
						//this.realTime.logger(stat.size, "DEBUG","SEVICE DMSG");
						var file = new nodefony.fileClass(path);
						if (file){
							var content  = file.content();
							//console.log(content)
							var lines = content.trim().split('\n');
							var lastLine = lines.slice(-1)[0];
						}
						conn.write(lastLine);
						//conn.write(stat.size);
					}catch(e){
						this.logger(e,"ERROR")	
					}
				}.bind(this);
				this.watcher.listen(this, 'onChange', callback);

				socket.on('end',function(){
					this.logger("CLOSE CONNECTION TO SERVICE DMSG FROM : "+socket.remoteAddress, "INFO");
					this.nbConnections-- ;
					if (this.nbConnections === 0 ){
						this.watcher.unWatch();
					}
					this.watcher.unListen("onChange", callback);
					socket.end();
				}.bind(this))

				conn.write("READY");
		}.bind(this));

		this.server.on("connection",function(socket){
			this.logger("CONNECT TO SERVICE DMSG FROM : "+socket.remoteAddress, "INFO");
			
			socket.on("data",function(buffer){
				try {
					if (this.nbConnections === 0 ){
						this.watcher.watch();		
					}
					this.nbConnections ++ ;
					/*this.protocol.parser(buffer.toString(),function(error, ele){
						if (error)
							throw error;
						switch (ele.action){
							case "START":
								if (this.nbConnections === 0 ){
									this.watcher.watch();		
								}
								this.nbConnections ++ ;
							break;
						}
					}.bind(this));*/
				}catch(e){
					this.realTime.logger(e, "ERROR");
				}
			}.bind(this));
		}.bind(this));

			
		this.server.on("error",function(error){
			this.logger( error,"ERROR")
		}.bind(this))
	
		/*
 		 *	EVENT ERROR
 		 */
		this.server.on("error",function(error){
			this.logger( "SERVICE DMSG domain : "+this.domain+" Port : "+this.port +" ==> " + error ,"ERROR");
		}.bind(this))


		/*
 		 *	EVENT CLOSE
 		 */
		this.server.on("close",function(socket){
			this.realTime.logger("SHUTDOWN server DMSG listen on Domain : "+this.domain+" Port : "+this.port, "INFO");
		}.bind(this));


		/*
 		 *	LISTEN ON DOMAIN 
 		 */
		this.server.listen(this.port, this.domain, function(){
			this.realTime.logger("Create server DMSG listen on Domain : "+this.domain+" Port : "+this.port, "INFO");
		}.bind(this));	



		this.kernel.listen(this, "onTerminate", function(){
			//FIXME ERROR IN CONSOLE and ctrl c
			this.stopServer();
		}.bind(this))

	};
	


	dmsg.prototype.stopServer = function(){
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


	return dmsg; 


});
