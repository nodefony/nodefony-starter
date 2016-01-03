/*
 *
 *
 *
 */


var Memcached = require('memcached');


nodefony.register.call(nodefony.session.storage, "memcached",function(){



	var memcachedSessionStorage = function(manager){
		this.manager = manager ;
		this.gc_maxlifetime = manager.settings.gc_maxlifetime ;
		this.contextSessions = [];
		this.settings = manager.settings.memcached;
		this.options = this.settings.options ;
		this.servers = new Array();
		this.clients = {};

		for (var server in this.settings.servers ){
			var port = this.settings.servers[server].port ? this.settings.servers[server].port : 11211 ;
			var host = this.settings.servers[server].location ; 
			this.servers.push( host+":"+port );

		}
	};


	memcachedSessionStorage.prototype.logger = function(pci, severity, msgid,  msg){
		var syslog = this.manager ;
		if (! msgid) msgid = "MEMCACHED SESSION STORAGE";
		return syslog.logger(pci, severity || "DEBUG", msgid,  msg);
	
	}

	memcachedSessionStorage.prototype.start = function(id, contextSession, callback){
		
		try {
			this.read( id, contextSession, callback);

		}catch(e){
			callback(e, null) ;
		}

	};

	memcachedSessionStorage.prototype.open = function(contextSession){
		this.clients[contextSession] = 	new Memcached( this.servers, nodefony.extend({}, this.options ,{
			namespace:contextSession
		}) );
		
		this.clients[contextSession].stats(function(error, stats){
			this.stats = stats ;
		}.bind(this));

		this.clients[contextSession].on('issue', function(details){
			this.logger(details, "INFO");
		}.bind(this));

		this.clients[contextSession].on('failure', function(details){
			this.logger("Server " + details.server + "went down due to: " + details.messages.join( '' ), "ERROR");
		}.bind(this));

		this.clients[contextSession].on('reconnecting', function(details){
			this.logger("Total downtime caused by server " + details.server + " :" + details.totalDownTime + "ms", "INFO");
		}.bind(this));

		this.gc(this.gc_maxlifetime, contextSession); 

		return true;
	};

	memcachedSessionStorage.prototype.close = function(){
		this.gc(this.gc_maxlifetime);
		return true;
	};

	memcachedSessionStorage.prototype.destroy = function(id, contextSession){
		try {
			var client = checkClient.call(this, contextSession);
		}catch(e){
			this.logger( e,"ERROR")	;
			throw e ;
		}

		client.get( id, function(err, data){
			if (err){
				this.logger(" context : "+contextSession +" ID : "+ id + " DESTROY ERROR", "ERROR");
				return false ;
			}
			
			client.del(id, function (err) { 
				if (err){
					this.logger(" context : "+contextSession +" ID : "+ id + " DESTROY ERROR", "ERROR");
					return false ;
				}
				this.logger(" DESTROY SESSION context : "+contextSession +" ID : "+ id + " DELETED");

			}.bind(this));

		}.bind(this));

	};

	var memcacheGC = function(client, msMaxlifetime ){

	};

	memcachedSessionStorage.prototype.gc = function(maxlifetime, contextSession){
		var msMaxlifetime = ( (maxlifetime || this.gc_maxlifetime) * 1000);
		if ( contextSession ){
			if ( this.clients[contextSession] )
				memcacheGC.call(this,this.clients[contextSession], msMaxlifetime );
		}else{
			for (var client in this.clients){
				memcacheGC.call(this, this.clients[client], msMaxlifetime )	
			}
		}
	};

	var checkClient = function(contextSession){
		if ( contextSession ){
			if ( this.clients[contextSession] ){
				var client = this.clients[contextSession] ;
			}else{
				throw ("client Mencahe not found error context : " + contextSession);
			}
		}else{
			if ( this.clients["default"] ){
				var client = this.clients["default"] ;
			}else{
				throw("client Mencahe not found error context ", null) ;
			}
		}
		return client ;
	}

	memcachedSessionStorage.prototype.read = function( id, contextSession , callback){
		try {
			var client = checkClient.call(this, contextSession);
		}catch(e){
			this.logger( e,"ERROR")	;
			throw e ;
		}

		try {
			client.get( id, function(err, data){
				if (err){
					throw  err ;
				}
				if (data){
					callback( null, JSON.parse(data) );
				}else{
					callback( null, {} );
				}
			});
		}catch(e){
			this.logger( e,"ERROR")	
			throw e ;
		}	
	};

	memcachedSessionStorage.prototype.write = function(id, serialize, contextSession, callback){
		try {
			var client = checkClient.call(this, contextSession);
		}catch(e){
			this.logger( e,"ERROR")	;
			callback (e , null) ;
			return ;
		}

		try{
			client.get( id, function(err, data){
				if (err){
					callback (err , null) ;
				}
				if (data){
					client.replace(id, JSON.stringify(serialize) , this.gc_maxlifetime, function(err, result){
						if (err){
							callback(err, null)	
							return ;
						}
						callback(null, serialize)	
						client.end();
					})
				}else{
					client.set(id, JSON.stringify(serialize) , this.gc_maxlifetime ,function(err, result){
						if (err){
							callback(err, null)	
							return ;
						}
						callback(null, serialize)	
					})
				}
			}.bind(this));
		}catch(e){
			this.logger( e,"ERROR");
			callback( e, null );
		}
	};

	return memcachedSessionStorage ;

});



