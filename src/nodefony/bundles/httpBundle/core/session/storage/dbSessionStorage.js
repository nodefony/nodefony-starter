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

	dbSessionStorage.prototype.start = function(id, contextSession){
		try {
			return this.read(id, contextSession);

		}catch(e){
			return false ;
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
		console.log(new Date ( myDate) )
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

	dbSessionStorage.prototype.read = function(id, contextSession){
		var entity = null ; 
		this.entity.find({session_id:id,context:contextSession || "default"} ).success(function(err, results){
			console.log(arguments)
			if (err){
				this.manager.logger(err,"ERROR");
				return ;
			}
			console.log(results);
			entity=results;
		}.bind(this))
		console.log('pass')
		return 	entity;	
	};

	dbSessionStorage.prototype.write = function(id, serialize, contextSession){
		var ret = null ;
		var data = nodefony.extend({}, serialize, {
			session_id:id,
			context:contextSession
		});
		this.entity.create(data, function(err, results) {
			if (err){
					
			}
			ret =  results ;
		});	
		return ret ;
	};

	return dbSessionStorage ;

});

