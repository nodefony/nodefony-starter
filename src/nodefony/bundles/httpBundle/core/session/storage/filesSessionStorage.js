/*
 *
 *
 *
 *
 *
 */

nodefony.register.call(nodefony.session.storage, "files",function(){

	var fileSessionStorage = function(manager){
		this.manager = manager ;
		this.path = manager.settings.save_path;
		var res = fs.existsSync(this.path);
		if (! res ){
			this.manager.logger("create directory native sessions " + this.path);
			try {
				var res = fs.mkdirSync(this.path);
			}catch(e){
				throw e ;
			}
		}
		this.finder = new nodefony.finder({
			path:this.path,
			/*onFile:function(file){
				this.loadSession(file);
			}.bind(this),*/
			onFinish:function(error, result){
				this.manager.logger("FILES SESSIONS STORAGE  ==>  " + this.manager.settings.handler.toUpperCase() + " COUNT SESSIONS : "+result.length());
			}.bind(this)
		});
	};

	fileSessionStorage.prototype.start = function(session){
		var fileSession  = null ;	
		var finder = new nodefony.finder({
			path:this.path,
			onFile:function(file){
				if ( file.name === session.id){
					fileSession = file ;	
				}
			}.bind(this),
			onFinish:function(error, result){
				if ( ! fileSession){
					this.write(session.id, session.serialize() );	
				}else{
					this.read(fileSession, session);
				}
			}.bind(this)
		});
		return fileSession ;
	};

	fileSessionStorage.prototype.open = function(){
		return true;
	};

	fileSessionStorage.prototype.close = function(){
		return true;
	};

	fileSessionStorage.prototype.destroy = function(id){
		var fileDestroy  = null ;
		var finder = new nodefony.finder({
			path:this.path,
			onFile:function(file){
				if ( file.name === id){
					fileDestroy = file ;	
				}
			}.bind(this),
			onFinish:function(error, result){
				if ( fileDestroy )
					fileDestroy.unlink();		
			}.bind(this)
		});
	};

	fileSessionStorage.prototype.gc = function(maxlifetime){
		var nbSessionsDelete  = 0 ;
		var finder = new nodefony.finder({
			path:this.path,
			onFile:function(file){
				
			}.bind(this),
			onFinish:function(error, result){
				this.manager.logger("FILES SESSIONS STORAGE GARBADGE COLLECTOR ==> "+ nbSessionsDelete + " DELETED")			
			}.bind(this)
		});

	};

	fileSessionStorage.prototype.read = function(file, session){
		var id = file.name;
		try {
			var res = fs.readFileSync(file.path, {
				encoding:'utf8'
			});
			var obj = JSON.parse(res);
			session.deSerialize(obj);
			this.manager.logger("FILES SESSIONS STORAGE READ ==> "+ file.name)
		}catch(e){
			this.manager.logger("FILES SESSIONS STORAGE READ  ==> "+ e,"ERROR")	
			throw e;
		}	
	};

	fileSessionStorage.prototype.write = function(fileName, serialize){
		var path = this.path+"/"+fileName ;
		try{
			fs.writeFileSync(path, serialize);
			this.manager.logger("FILES SESSIONS STORAGE  CREATE SESSION : " + fileName);
		}catch(e){
			this.manager.logger("FILES SESSIONS STORAGE : "+ e,"ERROR");
			throw e;
		} 
	};
	
	return fileSessionStorage ;
})
