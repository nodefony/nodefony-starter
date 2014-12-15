nodefony.register("watcher", function(){

	


	/*
 	 *
 	 *
 	 *
 	 *
 	 */
	var watcher = function(path){
		this.notificationsCenter = nodefony.notificationsCenter.create();	
		this.path = path ;
	};

	watcher.prototype.watch = function(){
		this.watcher = fs.watch(this.path);
		this.watcher.on("change",function(event, filename){
			switch (event){
				case "change":
					this.fire("onChange", this.path, fs.lstatSync(this.path))
				break;
				case "rename":
					this.fire("onRename", this.path, fs.lstatSync(this.path))
				break;
			}	
		}.bind(this));
		return this.watcher ;
	};

	watcher.prototype.unWatch = function(){
		fs.unwatchFile(this.path);
		this.fire("onClose", this.path);
	};

	watcher.prototype.listen = function(){
		return this.notificationsCenter.listen.apply(this.notificationsCenter, arguments);
	};

	watcher.prototype.fire = function(){
		return this.notificationsCenter.fire.apply(this.notificationsCenter, arguments);
	};

	watcher.prototype.unListen = function(){
		return this.notificationsCenter.unListen.apply(this.notificationsCenter, arguments);
	};





	return watcher ;



})
