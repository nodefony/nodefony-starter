/*
 *
 *
 *
 *
 */
nodefony.register.call(nodefony.session.storage, "sequelize",function(){



	var finderGC = function(msMaxlifetime, contextSession){
		var nbSessionsDelete  = 0 ;
		var myDate = 	new Date().getTime() - msMaxlifetime ;
		this.entity.findAll({ 
			where:{
				context		:contextSession
			}
		}).then( (results) => {
			for (var i = 0 ; i < results.length  ; i++){
				if ( results[i].metaBag.lastUsed ){
					var date = new Date( results[i].metaBag.lastUsed ).getTime() ;
				}else{
					var date = new Date( results[i].createdAt ).getTime() ;
				}
				if ( date > myDate)
					continue ;
				results[i].destroy({ force: true }).then(( session ) => {
					
					nbSessionsDelete++ ;
					this.manager.logger("DB SESSIONS STORAGE GARBADGE COLLECTOR SESSION context : "+session.context+" ID : "+ session.session_id + " DELETED");
				}).catch((error) => {
					if (error){
						this.manager.logger("DB SESSIONS STORAGE GARBADGE COLLECTOR SESSION : " +error, "ERROR");
						return ;
					}	
				})	
			}
			//this.manager.logger("DB SESSIONS STORAGE context : "+ ( contextSession || "default" ) +" GARBADGE COLLECTOR ==> "+ nbSessionsDelete + " DELETED")
		}).catch((error) => {
			console.trace(error);
			return ;
		});	
	};

	var dbSessionStorage = class dbSessionStorage {

		constructor (manager){
			this.manager = manager ;
			this.orm = this.manager.get("sequelize");
			this.manager.kernel.listen(this,"onReady", () => {
				this.entity = this.orm.getEntity("session");
			})
			this.gc_maxlifetime = this.manager.settings.gc_maxlifetime ;
			this.contextSessions = [];
		};

		start (id, contextSession, callback){
			try {
				return this.read(id, contextSession, callback);
			}catch(e){
				callback(e, null) ;
			}
		};

		open (contextSession){
			if( this.orm.kernel.type != "CONSOLE" ){
				this.gc(this.gc_maxlifetime, contextSession);
				return this.entity.count({ where: {"context" : contextSession } }).then((sessionCount) =>  {
					this.manager.logger("CONTEXT "+( contextSession ? contextSession : "default" )+" SEQUELIZE SESSIONS STORAGE  ==>  " + this.manager.settings.handler.toUpperCase() + " COUNT SESSIONS : "+sessionCount );
				})	
			}
		};

		close (){
			this.gc(this.gc_maxlifetime);
			return true;	
		};

		destroy (id, contextSession){
			return this.entity.findOne({where:{
				session_id: id,
				context: contextSession	
			}})
			.then( (result) => {
				if ( result ){
					result.destroy({ force: true }).then( ( session) => {
						this.manager.logger("DB DESTROY SESSION context : "+session.context+" ID : "+ session.session_id + " DELETED");
					}).catch((error) => {
						if (error){
							this.manager.logger("DB DESTROY SESSION context : "+contextSession+" ID : "+ id , "ERROR");
							return ;
						}	
					})
				}
			}).catch((error) => {
				if (error){
					this.manager.logger("DB DESTROY SESSION context : "+contextSession+" ID : "+ id , "ERROR");
					return ;
				}
			})
		};

		
		gc (maxlifetime, contextSession){
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

		read (id, contextSession, callback){
			var myWhere = null ;
			if ( contextSession ){
				myWhere = {where:{session_id:id,context:(contextSession)}} ;
			}else{
				myWhere = {where:{session_id:id}} ;
			}
			return this.entity.findOne(myWhere)
			.then(( result) => {
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
			}).catch((error) => {
				if (error){
					this.manager.logger(error,"ERROR");
					callback(error,null );
					return ;
				}
			})
		};

		write (id, serialize, contextSession, callback){
			
			var data = nodefony.extend({}, serialize, {
				session_id:id,
				context:contextSession
			});
			return this.entity.findOne({where:{
				session_id:id,
				context:(contextSession || "default")
			}}).then(  (result) =>  {
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
					.then((session) => {
						this.manager.logger("ADD SESSION : " + session.session_id +" user-id :" + (session.user_id ?session.user_id : "anonymous")  ,"INFO");
						callback(null, session) ;
					}).catch((error) => {
						this.manager.logger(error);
						callback(error, null) ;	
					})	
				}
			}).catch((error) => {
				if (error){
					this.manager.logger(error,"ERROR");
					callback(error,null );
					return ;
				}
			})
		};
	};

	return dbSessionStorage ;
});

