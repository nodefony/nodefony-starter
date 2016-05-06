var QS = require('qs');
var https = require('https');
var http = require('http');


nodefony.registerService("serverLoad", function(){





	var averaging = function(){
		this.times = [];
		this.status = {};
	}

	averaging.prototype.addTime = function(tab){
		
		var time = 0 ;
		for (var i= 0 ; i< tab.length ; i++){
			time +=  tab[i].time
		}
		var res= time / tab.length ;
		this.times.push(res ) ;
		return res ;	
	}

	averaging.prototype.average = function(){
		var time = 0 ;
		for (var i= 0 ; i< this.times.length ; i++){
			time += tab[i].time;
		}
		return  time / tab.length ;
	}

	averaging.prototype.addStatus = function(tab){
		var res = {} ;
		for (var i= 0 ; i< tab.length ; i++){
			if (tab[i].statusCode in this.status ){
				this.status[tab[i].statusCode] += 1 ;	
			}else{
				this.status[tab[i].statusCode] = 1	
			}

			if (tab[i].statusCode in res ){
				res[tab[i].statusCode] += 1 ;	
			}else{
				res[tab[i].statusCode] = 1	
			}
		}
		return 	res;
	}


	var testLoad = function( context,  manager , options){
		this.manager = manager ;
		this.nbRequest = parseInt( options.nbRequest ,10 ) ;
		this.nbRequestSent = 0;
		this.nbError = 0 ;
		this.nbSuccess = 0 ;
		this.concurrence = parseInt( options.concurence ,10 );
		this.context = context ;
		this.options = options ;
		this.averaging = new averaging() ;

		this.httpsSettings =  this.manager.get("httpsServer").settings ;
		this.rootDir = this.manager.kernel.rootDir ; 

	}

	testLoad.prototype.requests = function(prototcol){
		var tab = [] ;
		for ( var i = 0 ; i < this.concurrence ; i++){
			tab.push( this.httpRequest( prototcol ) );		
		}	

		var myResult = null ; 

		Promise.all(tab)
		.catch(function(e){
			this.manager.logger(e,"ERROR");
			//throw e ;
		}.bind(this))
		.then(function(result){
			this.manager.logger( "PROMISE HTTP THEN" , "DEBUG");	
			myResult = result ;
			
		}.bind(this))
		.done(function(ele){
			this.manager.logger( "PROMISE HTTP DONE" , "DEBUG");

			var average  = this.averaging.addTime( myResult );
			var status = this.averaging.addStatus( myResult );
			this.context.send( JSON.stringify({
				average:average,
				status:status,
				percentEnd:( (this.nbRequestSent * 100) / this.nbRequest ) ,
				nbResquest:this.nbRequestSent,
				type:prototcol
			}) );
			if ( this.nbRequestSent < this.nbRequest ) {
				this.requests(prototcol);
			}else{
				this.context.close();	
			}

		}.bind(this))
	}


	testLoad.prototype.httpRequest = function( prototcol ){
		// cookie session 
		var headers = {}
		if ( this.context.session  ){
			headers["Cookie"] = this.context.session.name+"="+this.context.session.id ;
		}
		headers["user-agent"] = "nodefony" ;
		var options = {
  			hostname: this.options.hostname,
  			port: this.options.port,
			path:this.options.path,
  			method: this.options.method || 'GET',
			headers:headers
		}	
		
		if ( prototcol === "https" ){
			// https 
			// keepalive if multiple request in same socket
			var keepAliveAgent = new https.Agent({ keepAlive: true });

			nodefony.extend(options,{
				key: fs.readFileSync(this.rootDir+this.httpsSettings.certificats.key),
				cert:fs.readFileSync(this.rootDir+this.httpsSettings.certificats.cert),
				rejectUnauthorized: false,
				requestCert: true,
				agent: keepAliveAgent
			});
			var wrapper = https.request ;

		}else{
			var wrapper = http.request ;
			// keepalive
			// keepalive if multiple request in same socket
			var keepAliveAgent = new http.Agent({ keepAlive: true });
			options.agent = keepAliveAgent;
		}

		var promise = new Promise( function(resolve, reject){
			var start = new Date().getTime() ; 
			var req = wrapper(options, function(res){
				var bodyRaw = "";
				res.setEncoding('utf8');
				res.on('data', function (chunk) {
					//this.manager.logger( chunk, "DEBUG");
					//bodyRaw += chunk ;
				}.bind(this));

				res.on('end', function(chunk){
					//this.manager.logger( res.statusCode, "DEBUG");
					this.nbRequestSent+=1 ;
					var stop = new Date().getTime() ;	
					resolve({
						statusCode:res.statusCode,
						time:stop - start
					});
				}.bind(this))	

			}.bind(this));

			req.on('error', function(chunk){
				this.nbRequestSent+=1 ;
				reject(chunk);
			}.bind(this));

			req.end();	
		}.bind(this));
		
		return 	promise ;
	}

	var service = function( container, kernel){
	
		this.container = container ;
		this.kernel = kernel ;
		this.name ="serverLoad" ;

	};


	service.prototype.logger = function(pci, severity, msgid,  msg){
		if (! msgid) msgid = "\033[34m SERVICE SERVER LOAD \033[0m";
		if ( this.realTime )
			this.realTime.logger(pci, severity,msgid);
		else
			this.kernel.logger(pci, severity,msgid);
	};

	service.prototype.handleConnection = function(message , context){
		switch (message.type){
		
			case "http":
			case "https":
				if (message.query){
					var obj = QS.parse(message.query) ;
					this.loadHTTP( context, message.type,  obj );
				}
			break;
		}
		
	}

	service.prototype.loadHTTP = function(context, type, options){
		
		var test = new testLoad(context, this, options );
		test.requests( type );		
	
	};


	return service ;

})
