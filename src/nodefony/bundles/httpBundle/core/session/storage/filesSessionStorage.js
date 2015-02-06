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
		this.gc_maxlifetime = manager.settings.gc_maxlifetime ;
		
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
		}else{
			this.gc(this.gc_maxlifetime);
			this.finder = new nodefony.finder({
				path:this.path,
				onFinish:function(error, result){
					this.manager.logger("FILES SESSIONS STORAGE  ==>  " + this.manager.settings.handler.toUpperCase() + " COUNT SESSIONS : "+result.length());
				}.bind(this)
			});
		}
		return true;
	};

	fileSessionStorage.prototype.close = function(){
		this.gc(this.gc_maxlifetime);
		return true;
	};

	fileSessionStorage.prototype.destroy = function(id){
		var fileDestroy  = null ;
		var path = this.path+"/"+id ;
		try {
			fileDestroy = new nodefony.fileClass(path);
			this.manager.logger("FILES SESSIONS STORAGE DESTROY SESSION ID ==> "+ fileDestroy.name + " DELETED");
			return fileDestroy.unlink();;

		}catch(e){
			return false ;
		}
	};

	fileSessionStorage.prototype.gc = function(maxlifetime){
		var nbSessionsDelete  = 0 ;
		var msMaxlifetime = ( (maxlifetime || this.gc_maxlifetime) * 1000);
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
			//this.manager.logger("FILES SESSIONS STORAGE READ ==> "+ file.name)
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
			//this.manager.logger("FILES SESSIONS STORAGE  WRITE SESSION : " + fileName);
		}catch(e){
			this.manager.logger("FILES SESSIONS STORAGE : "+ e,"ERROR");
			throw e;
		} 
		return   new nodefony.fileClass(path) ;
	};
	
	return fileSessionStorage ;
})
