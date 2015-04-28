/*
 *
 *
 *
 *
 */


nodefony.register.call(nodefony.session.storage, "db",function(){


	var dbSessionStorage = function(manager){
		this.manager = manager ;
		this.orm = this.manager.get("ORM2");
		this.manager.kernel.listen(this,"onReady", function(){
			this.entity = this.orm.getEntity("session");
		})
		this.gc_maxlifetime = this.manager.settings.gc_maxlifetime ;
		this.contextSessions = [];
	};

	dbSessionStorage.prototype.start = function(id, contextSession, callback){
		try {
			return this.read(id, contextSession, callback);

		}catch(e){
			return callback(e, null) ;
		}
	
	};

	dbSessionStorage.prototype.open = function(contextSession){
		//this.gc(this.gc_maxlifetime, contextSession);	
	};

	dbSessionStorage.prototype.close = function(){
		//this.gc(this.gc_maxlifetime);
		return true;	
	};

	dbSessionStorage.prototype.destroy = function(id, contextSession){
	
	};


	var finderGC = function(msMaxlifetime, contextSession){
		var myDate = 	new Date().getTime() - msMaxlifetime ;
		this.entity.find({
			createdAt	:new Date ( myDate),
			context		:contextSession	
		},function(){
			console.log(arguments)	
		});	
	};

	dbSessionStorage.prototype.gc = function(maxlifetime, contextSession){
		var msMaxlifetime = ( (maxlifetime || this.gc_maxlifetime) * 1000);
		if ( contextSession ){
			finderGC.call(this, msMaxlifetime, contextSession)	
		}else{
			if (this.contextSessions.length){
				for (var i = 0 ; i<this.contextSessions.length ; i++){
					finderGC.call(this,  msMaxlifetime , this.contextSessions[i]);	
				}
			}
		}
	
	};

	dbSessionStorage.prototype.read = function(id, contextSession, callback){
		
		this.entity.find({session_id:id,context:contextSession || "default"}, function(err, results) {
			if (err){
				this.manager.logger(err,"ERROR");
				callback(err,null );
				return ;
			}
			if ( results.length ){
				var data = results[0] ;
				callback(null,{
					id:data.session_id,
					flashBag:data.flashBag,
					metaBag:data.metaBag,
					attributes:data.attributes,		
				} );
			}else{
				callback(null,{});
			}
		}.bind(this));
	};

	dbSessionStorage.prototype.write = function(id, serialize, contextSession, callback){
		console.log(serialize)
		var data = nodefony.extend({}, serialize, {
			session_id:id,
			context:contextSession
		});
		this.entity.find({session_id:id,context:contextSession || "default"}, function (err, results) {
			if (results.length){
				var session = results[0] ;
				session.save(data, function (err) {
					if (err){
						callback(err, null) ;
						return ;
					}
					console.log(data)
					callback(null, session) ;
				}.bind(this));
			}else{
				this.entity.create(data, function(err, results) {
					if (err){
						this.manager.logger(err,"ERROR");
						callback(err,null)		
					}
					callback(null, results) ;
				}.bind(this));
			}
		}.bind(this));
			
	};

	return dbSessionStorage ;

});

