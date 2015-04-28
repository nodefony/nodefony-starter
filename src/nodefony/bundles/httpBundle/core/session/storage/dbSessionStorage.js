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
		this.gc(this.gc_maxlifetime, contextSession);
		this.entity.count({context:( contextSession || "default" )}, function(err, sessionCount) {
			this.manager.logger("CONTEXT "+( contextSession ? contextSession : "default" )+" DB SESSIONS STORAGE  ==>  " + this.manager.settings.handler.toUpperCase() + " COUNT SESSIONS : "+sessionCount );
		}.bind(this));	
	};

	dbSessionStorage.prototype.close = function(){
		this.gc(this.gc_maxlifetime);
		return true;	
	};

	dbSessionStorage.prototype.destroy = function(id, contextSession){
		this.entity.find({
			session_id: id,
			context: contextSession	
		},function(error, results){
			if (error){
				this.manager.logger("DB DESTROY SESSION context : "+contextSession+" ID : "+ id , "ERROR");
				return ;
			}
			if ( results.length ){
				results[0].remove(function(error, session){
					if (error){
						this.manager.logger("DB DESTROY SESSION context : "+contextSession+" ID : "+ id , "ERROR");
						return ;
					}
					this.manager.logger("DB DESTROY SESSION context : "+session.context+" ID : "+ session.session_id + " DELETED");
				}.bind(this))
			}
		}.bind(this));	
	};


	var finderGC = function(msMaxlifetime, contextSession){
		var nbSessionsDelete  = 0 ;
		var myDate = 	new Date().getTime() - msMaxlifetime ;
		this.entity.find({
			context		:contextSession	
		},function(error, results){
			if ( error ){
				return ;
 			}	
			for (var i = 0 ; i < results.length  ; i++){
				if ( results[i].createdAt > myDate)
					continue ;
				results[i].remove(function(error, session ){
					nbSessionsDelete++ ;
					this.manager.logger("DB SESSIONS STORAGE GARBADGE COLLECTOR SESSION context : "+session.context+" ID : "+ session.session_id + " DELETED");
				}.bind(this));	
			}
			this.manager.logger("DB SESSIONS STORAGE context : "+ ( contextSession || "default" ) +" GARBADGE COLLECTOR ==> "+ nbSessionsDelete + " DELETED")
		}.bind(this));	
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

