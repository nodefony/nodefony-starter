/*
 * 
 * 
 *    
 * 
 * 
 */

var net = require('net');

nodefony.registerService("dmsg", function(){

	
	/*
 	 *
 	 *
 	 *
 	 */
	var connection = class connection {
		constructor (socket){
			this.socket = socket ;
			this.id = socket._handle.fd+"_"+socket.server._connectionKey;
			this.readable = socket.readable ;
			this.writable = socket.writable;
		};

		write (data){
			this.socket.write(data+"");
		};
	};
	
	/*
 	 *
 	 *
 	 *
 	 *
 	 */
	var dmsg = class dmsg {

		constructor(realTime, container, kernel){
		
			this.realTime = realTime ;
			this.kernel = kernel ;
			if ( ! this.realTime ){
				this.kernel.logger("REALIME SERVICE NOT FOUND", "WARNING", "SERVICE DMSG");
				return ;
			}
			this.container = container ;
			this.status = "disconnect";
			this.connections= [];
			this.domain = kernel.domain;
			this.port = 1316;
			this.nbConnections = 0;

			this.kernel.listen(this, "onReady" ,() => {
				if ( this.kernel.type === "SERVER" ) {
					this.port = this.container.getParameters("bundles.realTime.services.dmsg.port") || 1316;
					this.createWatcher();
					this.server = null;	
					this.createServer();
				}

			});
		};

		logger (pci, severity, msgid,  msg){
			if (! msgid) msgid = "SERVICE DMSG ";
			return this.realTime.logger(pci, severity,"SERVICE DMSG");
		};

		createWatcher (){

			var fileDmsg = this.kernel.platform === "darwin" ? "/var/log/system.log" : "/var/log/message" ;
 	

			this.watcher = new nodefony.watcher(fileDmsg);
			
			this.watcher.listen(this, 'onError',(error) => {
				this.realTime.logger(error, "ERROR");
			});
		
			
		};

		createServer (){
			this.server = net.createServer({
				allowHalfOpen : true
			}, (socket) => {
				
					var conn = new connection(socket);
					this.connections.push(conn) ;
					this.connections[conn.fd] = this.connections[this.connections.length-1];
					
					var callback = (path, stat) => {
						
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
					};

					this.watcher.listen(this, 'onChange', callback);

					socket.on('end',() => {
						this.logger("CLOSE CONNECTION TO SERVICE DMSG FROM : "+socket.remoteAddress + " ID :" +conn.id, "INFO");

						this.nbConnections-- ;
						if (this.nbConnections === 0 ){
							this.watcher.unWatch();
						}
						this.watcher.unListen("onChange", callback);
						socket.end();
					})

					conn.write("READY");
			});

			this.server.on("connection",(socket) => {
				this.logger("CONNECT TO SERVICE DMSG FROM : "+socket.remoteAddress, "INFO");
				
				socket.on("data",(buffer) => {
					try {
						if (this.nbConnections === 0 ){
							this.watcher.watch();		
						}
						this.nbConnections ++ ;
						/*this.protocol.parser(buffer.toString(),(error, ele) => {
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
						});*/
					}catch(e){
						this.realTime.logger(e, "ERROR");
					}
				});
			});
				
			this.server.on("error",(error) => {
				this.logger( error,"ERROR")
			})
		
			/*
 		 	*	EVENT ERROR
 		 	*/
			this.server.on("error",(error) => {
				this.logger( "SERVICE DMSG domain : "+this.domain+" Port : "+this.port +" ==> " + error ,"ERROR");
			})


			/*
 		 	*	EVENT CLOSE
 		 	*/
			this.server.on("close",(socket) => {
				this.realTime.logger("SHUTDOWN server DMSG listen on Domain : "+this.domain+" Port : "+this.port, "INFO");
			});


			/*
 		 	*	LISTEN ON DOMAIN 
 		 	*/
			this.server.listen(this.port, this.domain, () => {
				this.realTime.logger("Create server DMSG listen on Domain : "+this.domain+" Port : "+this.port, "INFO");
			});	

			this.kernel.listen(this, "onTerminate", () => {
				//FIXME ERROR IN CONSOLE and ctrl c
				this.stopServer();
			})

		};
		
		stopServer (){
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
	};

	return dmsg; 
});
