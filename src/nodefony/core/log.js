/*
 *
 *
 *
 *
 *
 *
 *
 */

nodefony.register("log", function(){


	var defaultLog = {
		rotate : false,
		maxFile: 100,
		gzip:true,
		maxSize:1000000
	};


	var Log = class Log {
		constructor (filePath, settings){
			this.path = filePath ; 
			if (nodefony.typeOf(this.path)  !== "string" ){
				throw new Error("filePath  must be a string");
			}
			this.settings = nodefony.extend({}, defaultLog, settings);
			this.notificationsCenter = nodefony.notificationsCenter.create(this.settings);

			this.createStream( this.path );

			if ( this.settings.rotate ) {
				this.watch( this.path );
				/*this.listen(this,"onChange",function(file, stats){
					//TODO ROTATE
					console.log("ROTATE")
				}.bind(this));*/
			}
		}

		createStream (path){
			try {
				this.stats =  fs.lstatSync(path);
				this.stream = fs.createWriteStream(path, {flags: 'a+'});
			}catch(e){
				this.stream = fs.createWriteStream(path, {flags: 'a+'});
				this.stats =  fs.lstatSync(path);
			}
		}

		watch (path){
			this.watcher = fs.watch(path);
			this.watcher.on("change",function(event/*, filename*/){
				switch (event){
					case "change":
						this.fire("onChange", this.path, fs.lstatSync(path));
					break;
					case "rename":
						this.fire("onRename", this.path, fs.lstatSync(path));
					break;
				}	
			}.bind(this));
			return this.watcher ;
		}

		listen (){
			return this.notificationsCenter.listen.apply(this.notificationsCenter, arguments);
		}

		fire (){
			return this.notificationsCenter.fire.apply(this.notificationsCenter, arguments);
		}

		logger (){
			if ( this.stream._writableState.ending || this.stream._writableState.ended){
				return ;
			}
			//FIXME 
			var ret = this.stream.write.apply(this.stream, arguments);
			if ( ! ret){
				//console.log("pass drain")
			//	this.stream.once('drain');
			}
			return ret ;
		}

		close (txt){
			this.stream.end(txt, "UTF8", function(){
				fs.unwatchFile(this.path);
				this.fire("onClose", this.stream);
			}.bind(this));
		}
	};

	return Log;
});
