/*
 *
 *
 *
 *
 *
 */

var net = require('net');

module.exports = nodefony.registerService("dmsg", function(){


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
		}

		write (data){
			this.socket.write(data+"");
		}
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

			this.fileDmsg = this.kernel.platform === "darwin" ? "/var/log/system.log" : "/var/log/message" ;

			this.kernel.listen(this, "onReady" ,() => {
				if ( this.kernel.type === "SERVER" ) {
					this.port = this.container.getParameters("bundles.realTime.services.dmsg.port") || 1316;
					this.createWatcher();
					this.server = null;
					this.createServer();
				}
			});
		}

		logger (pci, severity, msgid,  msg){
			if (! msgid) msgid = "SERVICE DMSG ";
			return this.realTime.logger(pci, severity,"SERVICE DMSG");
		}

		createWatcher (){
			try {
				this.watcher = new nodefony.watcher(null , {
					persistent:		true,
					followSymlinks:		false,
					usePolling:		true,
					interval:		60,
					binaryInterval:		300
				}, this.container);

				this.watcher.listen(this, 'onError',(error) => {
					this.realTime.logger(error, "ERROR");
				});
				this.watcher.listen(this, 'onClose',(path) => {
					this.realTime.logger(path);
				});
			}catch(e){
				this.logger(e, "ERROR");
			}

		}

		createServer (){
			this.server = net.createServer({
				//allowHalfOpen : true
			}, (socket) => {
					var conn = new connection(socket);
					this.connections[conn.fd] = conn;
					var callback = (path, stat) => {
						try {
							//this.realTime.logger(stat.size, "DEBUG","SEVICE DMSG");
							if ( conn ){
								var file = new nodefony.fileClass(path);
								if (file){
									var content  = file.content();
									//console.log(content)
									var lines = content.trim().split('\n');
									var lastLine = lines.slice(-1)[0];
								}
								conn.write(lastLine);
								//conn.write(stat.size);
							}
						}catch(e){
							this.logger(e,"ERROR");
						}
					};
					this.watcher.listen(this, 'onChange', callback);
					socket.on('end',() => {
						this.logger("CLOSE CONNECTION TO SERVICE DMSG FROM : "+socket.remoteAddress + " ID :" +conn.id, "INFO");
						delete this.connections[conn.fd];
						this.watcher.removeListener("onChange", callback);
						conn = null ;
						this.nbConnections-- ;
						if (this.nbConnections === 0 ){
							this.watcher.close();
						}
						socket.end();
					});
					conn.write("WATCHER READY : " + this.fileDmsg );
			});

			this.server.on("connection",(socket) => {
				this.logger("CONNECT TO SERVICE DMSG FROM : "+socket.remoteAddress, "INFO");
				socket.on("data",(buffer) => {
					try {
						if (this.nbConnections === 0 ){
							this.watcher.watch(this.fileDmsg);
						}
						this.nbConnections ++ ;
					}catch(e){
						this.realTime.logger(e, "ERROR");
					}
				});
			});


			/*
 		 	*	EVENT ERROR
 		 	*/
			this.server.on("error",(error) => {
				//this.logger( "SERVICE DMSG domain : "+this.domain+" Port : "+this.port +" ==> " + error ,"ERROR");
				var httpError = error.errno;
				switch (error.errno){
					case "EADDRINUSE":
						this.logger( new Error(httpError + " " +this.domain+" Port : "+this.port +" ==> " + error) ,"CRITIC");
						setTimeout(() => {
      							this.server.close();
    						}, 1000);
					break;
					default :
						this.logger( new Error(httpError) ,"CRITIC");
				}
			});

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
				this.stopServer();
			});

		}

		stopServer (){
			for ( var connection in this.connections ){
				this.connections[connection].socket.end();
				delete this.connections[connection];
			}
			this.connections.length = 0 ;
			if (this.server){
				try {
					this.server.close();
				}catch(e){
					this.logger(e, "ERROR");
				}
			}
		}
	};

	return dmsg;
});
