nodefony.register("watcher", function(){

	/*
 	 *
 	 *
 	 *
 	 *
 	 */
	var watcher = class watcher {

		constructor (path){
			this.notificationsCenter = nodefony.notificationsCenter.create();	
			this.path = path ;
		}

		watch (){
			this.watcher = fs.watch(this.path);
			this.watcher.on("change",function(event/*, filename*/){
				switch (event){
					case "change":
						this.fire("onChange", this.path, fs.lstatSync(this.path));
					break;
					case "rename":
						this.fire("onRename", this.path, fs.lstatSync(this.path));
					break;
				}	
			}.bind(this));
			return this.watcher ;
		}

		unWatch (){
			fs.unwatchFile(this.path);
			this.fire("onClose", this.path);
		}

		listen (){
			return this.notificationsCenter.listen.apply(this.notificationsCenter, arguments);
		}

		fire (){
			return this.notificationsCenter.fire.apply(this.notificationsCenter, arguments);
		}

		unListen (){
			return this.notificationsCenter.unListen.apply(this.notificationsCenter, arguments);
		}
	};


	return watcher ;



});
