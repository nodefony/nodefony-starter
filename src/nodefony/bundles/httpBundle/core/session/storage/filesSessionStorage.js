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
		this.open();

		this.finder = new nodefony.finder({
			path:this.path,
			onFinish:function(error, result){
				this.manager.logger("FILES SESSIONS STORAGE  ==>  " + this.manager.settings.handler.toUpperCase() + " COUNT SESSIONS : "+result.length());
			}.bind(this)
		});
	};

	fileSessionStorage.prototype.start = function(id){
		var fileSession  = null ;	
		var path = this.path+"/"+id ;
		try {
			fileSession = new nodefony.fileClass(path);
			return this.read(fileSession);

		}catch(e){
			return false ;
		}
		/*var finder = new nodefony.finder({
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
		});*/
		//return fileSession ;
	};

	fileSessionStorage.prototype.open = function(){
		var res = fs.existsSync(this.path);
		if (! res ){
			this.manager.logger("create directory native sessions " + this.path);
			try {
				var res = fs.mkdirSync(this.path);
			}catch(e){
				throw e ;
			}
		}
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
		var msMaxlifetime = (maxlifetime * 1000);
		var finder = new nodefony.finder({
			path:this.path,
			onFile:function(file){
				var mtime = new Date( file.stats.mtime ).getTime();
				if ( mtime + msMaxlifetime < new Date().getTime() ){
					file.unlink();
					this.manager.logger("FILES SESSIONS STORAGE GARBADGE COLLECTOR SESSION ID ==> "+ file.name + " DELETED");
					nbSessionsDelete++;
				}
			}.bind(this),
			onFinish:function(error, result){
				this.manager.logger("FILES SESSIONS STORAGE GARBADGE COLLECTOR ==> "+ nbSessionsDelete + " DELETED")			
			}.bind(this)
		});

	};

	fileSessionStorage.prototype.read = function(file){
		var id = file.name;
		try {
			var res = fs.readFileSync(file.path, {
				encoding:'utf8'
			});
			this.manager.logger("FILES SESSIONS STORAGE READ ==> "+ file.name)
			return res ; 
		}catch(e){
			this.manager.logger("FILES SESSIONS STORAGE READ  ==> "+ e,"ERROR")	
			throw e;
		}	
	};

	fileSessionStorage.prototype.write = function(fileName, serialize){
		var path = this.path+"/"+fileName ;
		try{
			var ret = fs.writeFileSync(path, serialize);
			this.manager.logger("FILES SESSIONS STORAGE  WRITE SESSION : " + fileName);
		}catch(e){
			this.manager.logger("FILES SESSIONS STORAGE : "+ e,"ERROR");
			throw e;
		} 
		return   new nodefony.fileClass(path) ;
	};
	
	return fileSessionStorage ;
})
