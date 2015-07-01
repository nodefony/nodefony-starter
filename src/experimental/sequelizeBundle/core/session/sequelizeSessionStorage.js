/*
 *
 *
 *
 *
 */
nodefony.register.call(nodefony.session.storage, "sequelize",function(){


	var dbSessionStorage = function(manager){
		this.manager = manager ;
		this.orm = this.manager.get("sequelize");
		this.manager.kernel.listen(this,"onReady", function(){
			this.entity = this.orm.getEntity("session");
		})
		this.gc_maxlifetime = this.manager.settings.gc_maxlifetime ;
		this.contextSessions = [];
	};

	dbSessionStorage.prototype.start = function(id, contextSession, callback){
		try {
			this.read(id, contextSession, callback);
		}catch(e){
			callback(e, null) ;
		}
	};

	dbSessionStorage.prototype.open = function(contextSession){
		this.gc(this.gc_maxlifetime, contextSession);
		this.entity.count().then(function(sessionCount) {
			this.manager.logger("CONTEXT "+( contextSession ? contextSession : "default" )+" SEQUELIZE SESSIONS STORAGE  ==>  " + this.manager.settings.handler.toUpperCase() + " COUNT SESSIONS : "+sessionCount );
		}.bind(this))	
	};

	dbSessionStorage.prototype.close = function(){
		this.gc(this.gc_maxlifetime);
		return true;	
	};

	dbSessionStorage.prototype.destroy = function(id, contextSession){
		this.entity.findOne({where:{
			session_id: id,
			context: contextSession	
		}})
		.then(function(result){
			if ( result ){
				result.destroy({ force: true }).then(function( session){
					this.manager.logger("DB DESTROY SESSION context : "+session.context+" ID : "+ session.session_id + " DELETED");
				}.bind(this))
				.catch(function(error){
					if (error){
						this.manager.logger("DB DESTROY SESSION context : "+contextSession+" ID : "+ id , "ERROR");
						return ;
					}	
				}.bind(this))
			}
		}.bind(this))
		.catch(function(error){
			if (error){
				this.manager.logger("DB DESTROY SESSION context : "+contextSession+" ID : "+ id , "ERROR");
				return ;
			}
		}.bind(this))
	};

	var finderGC = function(msMaxlifetime, contextSession){
		var nbSessionsDelete  = 0 ;
		var myDate = 	new Date().getTime() - msMaxlifetime ;
		this.entity.findAll({ 
			where:{
				context		:contextSession
			}
		}).then( function(results){
			for (var i = 0 ; i < results.length  ; i++){
				if ( results[i].metaBag.lastUsed ){
					var date = new Date( results[i].metaBag.lastUsed ).getTime() ;
				}else{
					var date = new Date( results[i].createdAt ).getTime() ;
				}
				if ( date > myDate)
					continue ;
				results[i].destroy({ force: true }).then(function( session ){
					
					nbSessionsDelete++ ;
					this.manager.logger("DB SESSIONS STORAGE GARBADGE COLLECTOR SESSION context : "+session.context+" ID : "+ session.session_id + " DELETED");
				}.bind(this))
				.catch(function(error){
					if (error){
						this.manager.logger("DB SESSIONS STORAGE GARBADGE COLLECTOR SESSION : " +error, "ERROR");
						return ;
					}	
				}.bind(this))	
			}
			//this.manager.logger("DB SESSIONS STORAGE context : "+ ( contextSession || "default" ) +" GARBADGE COLLECTOR ==> "+ nbSessionsDelete + " DELETED")
		}.bind(this))
		.catch(function(error){
			return ;
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
		
		this.entity.findOne({where:{session_id:id,context:(contextSession || "default")}})
		.then(function( result) {
			if ( result  ){
				callback(null,{
					id:result.session_id,
					flashBag:result.flashBag,
					metaBag:result.metaBag,
					Attributes:result.Attributes,		
				} );
			}else{
				callback(null,{});
			}
		}.bind(this))
		.catch(function(error){
			if (error){
				this.manager.logger(error,"ERROR");
				callback(error,null );
				return ;
			}
		}.bind(this))
	};

	dbSessionStorage.prototype.write = function(id, serialize, contextSession, callback){
		
		var data = nodefony.extend({}, serialize, {
			session_id:id,
			context:contextSession
		});
		this.entity.findOne({where:{
			session_id:id,
			context:(contextSession || "default")
		}})
		.then( function (result) {
			if (result){
				result.update(data, {
  					where: {
    						session_id:id,
						context:(contextSession || "default")
  					}
				}).then(function(){
					callback(null, serialize) ;	
				}).catch(function(error){
					callback(error, null) ;
				})
			}else{
				this.entity.create(data,{isNewRecord:true})
				.then(function(session){
					this.manager.logger("ADD SESSION : " + session.session_id +" user-id :" + (session.user_id ?session.user_id : "anonymous")  ,"INFO");
					callback(null, session) ;
				}.bind(this)).catch(function(error){
					this.manager.logger(error);
					callback(error, null) ;	
				}.bind(this))	
			}
		}.bind(this))
		.catch(function(error){
			if (error){
				this.manager.logger(error,"ERROR");
				callback(error,null );
				return ;
			}
		}.bind(this))

	};

	return dbSessionStorage ;
});

