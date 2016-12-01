var QS = require('qs');
var https = require('https');
var http = require('http');
var shortId = require("shortid");
var request = require("request");
var os = require("os");


nodefony.registerService("serverLoad", function(){


	var  cpuAverage = function() {
		var totalIdle = 0 ;
		var totalTick = 0 ;

		var cpus = os.cpus();
		

		//Loop through CPU cores
		for ( var i = 0 ; i < cpus.length ; i++) {
			var cpu = cpus[i];
			//Total up the time in the cores tick
    			for(var type in cpu.times) {
				totalTick += cpu.times[type];
   			}
			//Total up the idle time of the core
			totalIdle += cpu.times.idle;
		}
		//Return the average
		return {
			idle : totalIdle / cpus.length ,
			total : totalTick / cpus.length
		}
	}

	var cpuInit = function(){
		var start = cpuAverage.call(this);		
			
		return () => {
			var end = cpuAverage.call(this);

			var dif = {};

			dif.idle  = end.idle  - start.idle ;
			dif.total = end.total - start.total ;

			dif.percent = 100 - ~~(100 * dif.idle / dif.total);
			
			this.cpu.push(dif);
			return dif ;

		}
	}


	var averaging = class averaging {

		constructor(){
			this.timesConcurence = [] ;
			this.statusCode = {} ;
			this.requestBySec= [] ;
			this.cpu = [] ;
			this.total = 0 ;
		}

		addTimeAverage (tab){
			var status = {} ;	
			var time = 0 ;

			for (var i= 0 ; i< tab.length ; i++){
				time += tab[i].time ;
				if (tab[i].statusCode in this.statusCode ){
					this.statusCode[tab[i].statusCode] += 1 ;	
				}else{
					this.statusCode[tab[i].statusCode] = 1	
				}

				if (tab[i].statusCode in status ){
					status[tab[i].statusCode] += 1 ;	
				}else{
					status[tab[i].statusCode] = 1	
				}
			}
			var res = time / tab.length ;
			this.timesConcurence.push( res ) ;

			var requestBySec =( tab.length / ( time / 1000 )  ) ;
			this.requestBySec.push( requestBySec ) ;

			return {
				average:( res / 1000  ).toFixed(2),
				total:( time / 1000 ).toFixed(2),
				requestBySec: requestBySec.toFixed(2) ,
				statusCode:status,
			}
		}

		average (){
			var time = 0 ;
			for (var i= 0 ; i< this.timesConcurence.length ; i++){
				time += this.timesConcurence[i];
			}
			return  ( ( time / this.timesConcurence.length ) / 1000 ).toFixed(2) ;
		}

		cpuAverage (){

			var idle = 0 ;
			var total = 0 ;
			var percent = 0 ;

			for (var i= 0 ; i< this.cpu.length ; i++){
			 	idle += this.cpu[i].idle;
			 	total += this.cpu[i].total;
			 	percent += this.cpu[i].percent;
			}	

			return {
				idle : ( ( idle / this.cpu.length )  ).toFixed(2) ,
				total : ( ( total / this.cpu.length )  ).toFixed(2) ,
				percent : ( ( percent / this.cpu.length )  ).toFixed(2)
			}
		};
	};


	var testLoad = class testLoad {
		constructor( context,  manager , options){
			this.manager = manager ;
			this.nbRequest = parseInt( options.nbRequest ,10 ) ;
			this.nbRequestSent = 0;
			this.nbError = 0 ;
			this.nbSuccess = 0 ;
			this.concurrence = parseInt( options.concurence ,10 );
			this.context = context ;
			this.options = options ;
			this.averaging = new averaging() ;
			this.sid = options.sid ;

			this.httpsSettings =  this.manager.get("httpsServer").settings ;
			this.rootDir = this.manager.kernel.rootDir ; 
			this.stopChain = false ;
			this.running = false ;

			/*this.agentOptions = {
				key: fs.readFileSync(this.rootDir+this.httpsSettings.certificats.key),
				cert: fs.readFileSync(this.rootDir+this.httpsSettings.certificats.cert),
				rejectUnauthorized: false,
			};

			if ( this.httpsSettings.certificats.ca ){
				this.agentOptions["ca"] = fs.readFileSync(this.rootDir+this.httpsSettings.certificats.ca) ;	
			}*/

			this.agentOptions = {
				"rejectUnauthorized": false
			}

		}

		requests ( start ){
			var tab = [] ;
			var cpu = cpuInit.call(this.averaging);
			for ( var i = 0 ; i < this.concurrence ; i++){
				tab.push( this.HttpRequest( ) );		
			}	

			var myResult = null ; 

			this.running = true ;

			//tab.map(function(ele){return ele()})
			Promise.all(tab)
			.catch((e) => {
				this.manager.logger(e,"ERROR");
				this.running = false ;
				//throw e ;
				this.context.send( JSON.stringify({
					running:this.running,
					message:e.message
				}) );

			})
			.then((result) => {
				//console.log(result)
				//this.manager.logger( "PROMISE HTTP THEN" , "DEBUG");	
				myResult = result ;
				var stop = new Date().getTime();
				if ( result ){
					var addTimeAverage  = this.averaging.addTimeAverage( result );
					var time = ( stop - start ); 
					this.averaging.total += time ;
					var sec =   time / 1000 ;
					var nbRequestSec = this.concurrence /  addTimeAverage.average    ;
		        		//this.averaging.addRequestBySec( nbRequestSec );
					this.context.send( JSON.stringify({
						average: addTimeAverage.average,
						statusCode: addTimeAverage.statusCode,
						requestBySecond: nbRequestSec.toFixed(2),
						totalTime: sec  ,//this.averaging.averageResquestBySec(),
						percentEnd: ( (this.nbRequestSent * 100) / this.nbRequest ).toFixed(2) ,
						nbResquest: this.nbRequestSent,
						running: this.running,
						cpu: cpu()
					}) );
					if ( ( this.nbRequestSent < this.nbRequest ) && this.stopChain === false ) {
						this.requests( new Date().getTime() );
					}else{
						this.running = false ;
						this.context.send( JSON.stringify({
							message: "END LOAD TEST",
							average: this.averaging.average(),
							totalTime: this.averaging.total / 1000,
							stop: stop,
							statusCode: this.averaging.statusCode,
							requestBySecond: (  this.nbRequestSent / ( this.averaging.total / 1000 )  ).toFixed(2),
							percentEnd: 100 ,
							nbResquest: this.nbRequestSent,
							running: this.running,
							cpu: this.averaging.cpuAverage(), 
							//prototcol:prototcol
						}) );
						this.context.close();	
					}
				}
			})
			.done((ele) => {
				this.manager.logger( "PROMISE HTTP DONE" , "DEBUG");
			})
		}


		HttpRequest (){
		
			var options = {
				url: this.options.url,
				method:this.options.method || "GET" ,
				forever:true, // keepAlive
				followRedirect:true,
				agentOptions:this.agentOptions,
				headers: {
					//'User-Agent': 'NODEFONY'
					'User-Agent': this.manager.userAgent
				},
				jar:null
			};

			if ( this.context.session  ){
				var j = request.jar();
				var cookie = request.cookie(this.context.session.name+"="+this.context.session.id);
				var url = options.url;
				j.setCookie(cookie, url);
				options.jar = j ;
			}

			var promise = new Promise( (resolve, reject) => { 
				
				var start = new Date().getTime() ;
				request(options, (error, response, body) => {
					var stop = new Date().getTime() ;	
					this.nbRequestSent+=1 ;
					//console.log(this.nbRequestSent);
					if (error){
						var code = error.code ;
						//console.log(error)
						this.nbError +=1 ;
						resolve({
							error:error,
							message:error.message,
							statusCode:code,
							time:stop - start
						});
						return;
					}
					var code = response.statusCode ;
					resolve({
						statusCode:code,
						time:stop - start
					});
				});
			});
			return promise ;
		};

		stop (sid){
			this.stopChain = true ;
			delete this.manager.connections[sid];
		};
		
		handleMessage (message){
			if ( ! message ) return ;
			switch ( message.action ){
				case "stop" :
					this.stop(this.sid);
				break;	
				default:
					return ;
			}
		};
	};

	// service
	var service = class service {

		constructor( container, kernel){
			this.container = container ;
			this.kernel = kernel ;
			this.name ="serverLoad" ;
			this.connections = {} ;
			this.userAgent = "nodefony/"+ this.kernel.settings.system.version +" ("+process.platform+";"+process.arch+") V8/" +process.versions.v8 +" node/"+process.versions.node;
		};

		logger (pci, severity, msgid,  msg){
			if (! msgid) msgid = "\x1b[34m SERVICE SERVER LOAD \x1b[0m";
			if ( this.realTime )
				this.realTime.logger(pci, severity,msgid);
			else
				this.kernel.logger(pci, severity,msgid);
		};

		handleConnection (message , context){
			switch (message.type){
				case "action":
					if (message.sid ){
						this.connections[message.sid].handleMessage(message);
						return ;
					}	
				break;      
				default:
					if (message.query){
						var obj = QS.parse(message.query) ;
						this.loadHTTP( context,  obj );
					}else{
						this.loadHTTP( context,  message );	
					}
			}
		}

		loadHTTP (context, options){
			if ( !  options.sid ){
				var sid = shortId.generate() ;

				var start = new Date().getTime();
				context.send( JSON.stringify({
					message:"START LOAD TEST",
					nbRequest:options.nbRequest,
					running:true,
					concurence:options.concurence,
					percentEnd:0 ,
					start:start,
					sid: sid
				}) );
				this.connections[sid] = new testLoad(context, this, options );
				this.connections[sid].requests( start  );
			}else{
				var sid = options.sid ;
				this.connections[sid].context = null ;
				this.connections[sid].context = context ;
			}
			context.listen(this,"onClose", function(){
				this.connections[sid].stop(sid);
			})
		};
	};

	return service ;

})
