
var net = require('net');
var pm2 = require('pm2');


nodefony.registerService("monitoring", function(){


	var connection = class connection  {

		 constructor(socket){
			this.socket = socket ;
			this.id = socket._handle.fd+"_"+socket.server._connectionKey;
			this.readable = socket.readable ;
			this.writable = socket.writable;
		};


		write (data){
			this.socket.write(data);
		};
	};

	var monitoring = class monitoring extends nodefony.Service {

		constructor( realTime, container, kernel ){
		
			super("monitoring", container, kernel.notificationsCenter );

			this.realTime = realTime ;
			this.kernel = kernel ;
			this.status = "disconnect";
			this.connections= [];
			this.domain = kernel.domain;
			this.port = 1318;
			this.server = null;
			this.syslog = kernel.syslog ;

			this.listen(this, "onReady" ,() => {
                                this.name = this.container.getParameters("bundles.App.App.projectName") || "nodefony" ;
                                this.port = this.container.getParameters("bundles.realTime.services.monitoring.port") || 1318;
                                if( this.realTime  &&  this.kernel.type === "SERVER" ){
                                        this.createServer();
                                }
                        })
		};

		logger (pci, severity, msgid,  msg){
			if (! msgid) msgid = "SERVICE MONITORING ";
			if ( this.realTime )
				this.realTime.logger(pci, severity,msgid);
			else
				this.kernel.logger(pci, severity,msgid);
		};

		createServer (){

			this.server = net.createServer({
				allowHalfOpen : true
			}, (socket) => {
				socket.write("");
				this.stopped = false ;
			});

			/*
 		 	*	EVENT CONNECTIONS
 		 	*/
			this.server.on("connection",(socket) => {
				this.logger("CONNECT TO SERVICE MONITORING FROM : "+socket.remoteAddress, "INFO");

				var closed = false ;
				var conn = new connection(socket);
				this.connections.push(conn) ;
				this.connections[conn.id] = this.connections[this.connections.length-1];

				var callback = function(pdu){
					if (closed || this.stopped ){
						if ( this.syslog ){
							if (this.connections && this.connections[conn.id] )
								this.syslog.unListen("onLog", this.connections[conn.id]["listener"]);
						}
						return; 
					}
					var ele ={
						pdu:pdu
					} 
					conn.write(JSON.stringify(ele));	
				};

				/*this.connections[conn.id]["listener"]  = this.syslog.listenWithConditions(this,{
					severity:{
						data:"INFO"
					}		
				},callback);*/	

				pm2.connect( function() {
					this.logger("CONNECT PM2 REALTIME MONITORING", "DEBUG");
				}.bind(this));
				// PM2 REALTIME
				
				var pm2Interval = setInterval(function(){
					pm2.describe(this.name,function(err, list){
						var clusters = {
							pm2:[],
							name:this.name
						}
						if ( list ){
							for ( var i = 0 ; i <  list.length ; i++){
								clusters.pm2.push({
									monit:list[i].monit,
									name:list[i].name,
									pid:list[i].pid,
									pm_id:list[i].pm_id,
									pm2_env:{
										exec_mode:list[i]["pm2_env"].exec_mode,
										restart_time:list[i]["pm2_env"].restart_time,
										pm_uptime:list[i]["pm2_env"].pm_uptime,
										status:list[i]["pm2_env"].status
									}
								}); 	
							}
						}
						if (closed || this.stopped ){
							clearInterval( pm2Interval );
							return ;	
						}
						conn.write(JSON.stringify(clusters));	
					}.bind(this));
					
				}.bind(this),1000);

				//SESSIONS  INTERVAL
					//CONTEXT


				//REQUESTS  INTERVAL
				
					//WEBSOCKET OPEN
					//WEBSOCKET CLOSE
					//HTTP 

				socket.on('end',function(){
					closed = true ;
					if ( this.syslog ){
						if (this.connections && this.connections[conn.id] && this.connections[conn.id]["listener"] )
							this.syslog.unListen("onLog", this.connections[conn.id]["listener"]);
					}
					clearInterval( pm2Interval );
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

			});

			/*
 		 	*	EVENT CLOSE
 		 	*/
			this.server.on("close",(socket) => {
				this.stopped = true ;
				this.logger("SHUTDOWN server MONITORING listen on Domain : "+this.domain+" Port : "+this.port, "INFO");
			});

			/*
 		 	*	EVENT ERROR
 		 	*/
			this.server.on("error",(error) => {
				this.logger( "SERVICE MONITORING domain : "+this.domain+" Port : "+this.port +" ==> " + error ,"ERROR");
			})

			/*
 		 	*	LISTEN ON DOMAIN 
 		 	*/
			this.server.listen(this.port, this.domain, () => {
				this.logger("Create server MONITORING listen on Domain : "+this.domain+" Port : "+this.port, "INFO");
			});	
				
			/*
 		 	*  KERNEL EVENT TERMINATE
 		 	*/ 
			this.kernel.listen(this, "onTerminate", () => {
				this.stopServer();
			})	
		};

		stopServer (){
			this.stopped = true ;
			for (var i = 0 ; i < this.connections.length ; i++){
				this.logger("CLOSE CONNECTIONS SERVICE REALTIME : " + this.name);
				if ( this.connections[i]["listener"] ){
					this.syslog.unListen("onLog", this.connections[i]["listener"]);
				}
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
	};

	return monitoring; 

});
