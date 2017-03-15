nodefony.register("watcher", function(){

	// see Chokidar 
	/*
 	 *
 	 *
 	 *
 	 *
 	 */
	var watcher = class watcher extends nodefony.notificationsCenter.notification {

		constructor (path, settings ){
			if ( ! path || typeof path  !== "string "){
				new Error("BAD WATCHER path : " + path );	
			}
			super( settings );
			this.path = path ;
			this.watcher = null ;
			this.watched = false ;
			this.options = {} ;
			this.stat = fs.lstatSync(this.path) ;
		}

		watch (){
			this.watcher = fs.watch(this.path ,this.options );
			this.watched = true ;
			this.watcher.on("change",(event, filename) => {
				switch (event){
					case "change":
						this.stat = fs.lstatSync(this.path) ;
						this.fire("onChange", this.path, this.stat );
					break;
					case "rename":
						this.fire("onRename", this.path, fs.lstatSync(this.path));
					break;
				}	
			});

			this.watcher.on("error",(error) => {
				this.fire("onError", error, this.path );
			});

			return this.watcher ;
		}

		close (){
			if ( this.watcher ){
				this.watcher.close() ;
				this.fire("onClose", this.path);
				this.watched = false ;
				return ;
			}
			throw new Error("WATCHER path :" + this.path + "not be watching, wath path before close" );
		}

		unWatch (){
			return this.close();
		}

	};


	return watcher ;



});
