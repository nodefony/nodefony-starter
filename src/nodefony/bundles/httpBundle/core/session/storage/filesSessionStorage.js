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
			manager.logger("create directory native sessions " + this.path)
	try {
		var res = fs.mkdirSync(this.path);
	}catch(e){
		throw e ;
	}
		}
		this.finder = new nodefony.finder({
			path:this.path,
			onFile:function(file){
				this.loadSession(file)
			}.bind(this),
			onFinish:function(error, result){
				this.manager.logger("FILES SESSIONS STORAGE  ==>  " + this.manager.settings.handler.toUpperCase() + " COUNT SESSIONS : "+result.length())
			}.bind(this)
		});
	};

	fileSessionStorage.prototype.loadSession = function(file){
		var id = file.name ;
		try {
			var res = fs.readFileSync(file.path, {
				encoding:'utf8'
			});
			var obj = JSON.parse(res);
			var session = new Session(obj)
				this.manager.pushSession(obj.sessionName, id, session)
		}catch(e){
			this.manager.logger("FILES SESSIONS STORAGE  ==> "+ e,"ERROR")	
		}

	};

	fileSessionStorage.prototype.saveSession = function(id, serialize){
		fs.writeFile(this.path+"/"+id, serialize,function(err){
			if (err){
				this.manager.logger("FILES SESSIONS STORAGE : "+ err,"ERROR");
			}else{
				this.manager.logger("FILES SESSIONS STORAGE : " + id);
			}
		}.bind(this))
	};

	fileSessionStorage.prototype.garbageCollector = function(){

	};

	return fileSessionStorage ;
})
