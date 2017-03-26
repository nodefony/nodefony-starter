/*
 *
 *
 *
 *
 *
 */
nodefony.register("kernelWatcher", function(){

	/*
	 *
	 *	WATCHER 
	 *
	 */
	var defaultWatcherSettings  = {
		persistent: true,
  		followSymlinks: true,
  		alwaysStat: false,
  		depth: 50,
		//usePolling: true,
  		//interval: 100,
  		//binaryInterval: 300,
  		atomic: true // or a custom 'atomicity delay', in milliseconds (default 100)
	};
	
	var Watcher = class Watcher extends nodefony.watcher {
		constructor (Path , settings, bundle){
		
			super( Path , nodefony.extend(true, {}, defaultWatcherSettings, settings), bundle.container );

			if ( bundle ){
				this.bundle = bundle ;
				this.cwd = bundle.path ; 
			}
			this.router = this.get("router") ;
		}

		logger (  payload, severity, msgid, msg  ){
			if ( typeof payload  === "string"){
				var txt = "\x1b[36m"; 
				if ( this.bundle ){
					txt += "BUNDLE "+ this.bundle.name + "\x1b[0m ";
				}
				txt +=  payload ;
				msgid = "\x1b[36mWATCHER EVENT "+msgid+"\x1b[0m";
				payload = txt ;
			}
			return super.logger( payload, severity, msgid, msg );
		}
		
		listenWatcherController(){
			this.on('all', (event, Path) => {
				switch(event){
					case "addDir" :
						this.logger( Path, "WARNING", event );
					break;
					case "add" :
					case "change" :
						this.logger( Path, "INFO", event );
						try {
							var basename = path.basename(Path) ;
							var res = this.bundle.regController.exec( basename );
							var name = res[1] ;
							var file = this.cwd + "/" + Path ;
							this.bundle.reloadWatcherControleur( name, file);
						}catch(e){
							this.logger(e, "ERROR");
						}
					break;
					case "error" :
						this.logger( Path, "ERROR", event );
					break;
					case "unlinkDir" :
						this.logger( Path, "WARNING", event );
					break;
					case "unlink" :
						this.logger( Path, "WARNING", event );
						var basename = path.basename(Path) ;
						var res = this.bundle.regController.exec( basename );
						var name = res[1] ;
						if ( this.bundle.controllers[name] ){
							this.logger( "REMOVE CONTROLLER : " +  Path, "INFO", event );
							delete this.bundle.controllers[name] ;
							this.bundle.controllers[name] = null ;
						}
					break;
				}
				this.fire(event, this.watcher , Path);
			});	
		}

		listenWatcherView(){
			this.on('all', (event, Path) => {
				switch( event ){
					case "addDir" :
						this.logger( Path, "INFO", event );
					break;
					case "add" :
					case "change" :
						this.logger( Path, "INFO", event );
						var file = this.cwd + "/" + Path ;
						try{ 
							var fileClass = new nodefony.fileClass(file);
							var ele = this.bundle.recompileTemplate(fileClass);
							if ( ele.basename === "." ){
								this.logger("RECOMPILE Template : '"+this.bundle.name+"Bundle:"+""+":"+ele.name + "'", "INFO", event);
							}else{
								this.logger("RECOMPILE Template : '"+this.bundle.name+"Bundle:"+ele.basename+":"+ele.name + "'", "INFO",event );
							}
						}catch(e){
							this.logger(e, "ERROR", event);
						}
					break;
					case "error" :
						this.logger( Path, "ERROR", event );
					break;
					case "unlinkDir" :
						this.logger( Path, "INFO", event );
					break;
					case "unlink" :
						this.logger( Path, "INFO", event );
						var file = this.cwd + "/" + Path ;
						var parse = path.parse(file)  ;
						if ( parse.ext === "."+this.bundle.serviceTemplate.extention ){
							var name = parse.name ;
							var directory = path.basename(parse.dir);
							if (directory !== "views"){
								if ( this.bundle.views[directory]){
									if ( this.bundle.views[directory][name] ){
										delete	this.bundle.views[directory][name];
										this.logger( "REMOVE TEMPLATE : " +  file, "INFO", event );
									}
								}
							}else{
								if ( this.bundle.views["."][name] ){
									delete this.bundle.views["."][name] ;
									this.logger( "REMOVE TEMPLATE : " +  file, "INFO", event );
								}	
							}
						}
					break;
				}
				this.fire(event, this.watcher , Path);
			});	
		}

		listenWatcherI18n(){
			this.on('all', (event, Path) => {
				switch( event ){
					case "addDir" :
						this.logger( Path, "INFO", event );
					break;
					case "add" :
					case "change" :
						this.logger( Path, "INFO", event );
						var file = this.cwd + "/" + Path ;
						try{ 
							var fileClass = new nodefony.fileClass(file);
							fileClass.matchName(this.bundle.regI18nFile);	
							var domain = fileClass.match[1] ;
							var Locale = fileClass.match[2] ;
							this.bundle.translation.reader(fileClass.path, Locale, domain);
						}catch(e){
							this.logger(e, "ERROR", event);
						}
					break;
					case "error" :
						this.logger( Path, "ERROR", event );
					break;
					case "unlinkDir" :
						this.logger( Path, "INFO", event );
					break;
					case "unlink" :
						this.logger( Path, "INFO", event );
					break;
				}
			});
		}
		listenWatcherConfig(){
			this.on('all', (event, Path) => {
				//console.log(Path)
				switch( event ){
					case "addDir" :
						this.logger( Path, "INFO", event );
					break;
					case "add" :
					case "change" :
						this.logger( Path, "INFO", event );
						var file = this.cwd + "/" + Path ;
						try{ 
							var fileClass = new nodefony.fileClass(file);
							this.router.reader(fileClass.path);
						}catch(e){
							this.logger(e, "ERROR", event);
						}
					break;
					case "error" :
						this.logger( Path, "ERROR", event );
					break;
					case "unlinkDir" :
						this.logger( Path, "INFO", event );
					break;
					case "unlink" :
						this.logger( Path, "INFO", event );
						/*var file = this.cwd + "/" + Path ;
						try{ 
							var fileClass = new nodefony.fileClass(file);
							this.router.removeRoutes(fileClass.path);
						}catch(e){
							this.logger(e, "ERROR", event);
						}*/
					break;
				}
			});	
		}
	};

	return Watcher ;

});
