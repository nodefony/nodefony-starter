/*
 *
 *
 *
 *
 *
 */
var mkdirp = require('mkdirp');

nodefony.register.call(nodefony.session.storage, "files",function(){

	var finderGC = function(path, msMaxlifetime ,context){
		var nbSessionsDelete  = 0 ;
		var finder = new nodefony.finder({
			path:path,
			onFile:function(file){
				var mtime = new Date( file.stats.mtime ).getTime();
				if ( mtime + msMaxlifetime < new Date().getTime() ){
					file.unlink();
					this.manager.logger("FILES SESSIONS STORAGE GARBADGE COLLECTOR SESSION context : "+context+" ID : "+ file.name + " DELETED");
					nbSessionsDelete++;
				}
			}.bind(this),
			onFinish:function(error, result){
				this.manager.logger("FILES SESSIONS STORAGE context : "+ ( context || "default" ) +" GARBADGE COLLECTOR ==> "+ nbSessionsDelete + " DELETED");	
			}.bind(this)
		});
		return finder;	
	}

	var fileSessionStorage = class fileSessionStorage {
		constructor (manager){
			this.manager = manager ;
			this.path = manager.settings.save_path;
			this.gc_maxlifetime = manager.settings.gc_maxlifetime ;
			this.contextSessions = [];
		};

		start (id, contextSession){
			var fileSession  = null ;	
			if ( contextSession ){
				var path = this.path+"/"+contextSession+"/"+id ;	
			}else{
				var path = this.path+"/default/"+id ;	
			}
			try {
				fileSession = new nodefony.fileClass(path);
			}catch(e){
				return new Promise ( (resolve, reject ) => {
					resolve( {} );	
				})
			}
			try {
				return this.read(fileSession);
			}catch(e){
				throw e ;
			}
		}

		open (contextSession){
			if (contextSession) {
				var path = this.path+"/"+contextSession ;
				this.contextSessions.push(contextSession);
			}else{
				var path = this.path ;
			}
			var res = fs.existsSync(path);
			if (! res ){
				this.manager.logger("create directory context sessions " + path);
				try {
					//var res = fs.mkdirSync(path);
					var res = mkdirp.sync(path)
				}catch(e){
					throw e ;
				}
			}else{
				this.gc(this.gc_maxlifetime, contextSession);
				this.finder = new nodefony.finder({
					path:path,
					recurse:false,
					onFinish:function(error, result){
						this.manager.logger("CONTEXT "+( contextSession ? contextSession : "GLOBAL" )+" SESSIONS STORAGE  ==>  " + this.manager.settings.handler.toUpperCase() + " COUNT SESSIONS : "+result.length() );
					}.bind(this)
				});
			}
			return true;
		}

		close (){
			this.gc(this.gc_maxlifetime);
			return true;
		}

		destroy (id, contextSession){

			var fileDestroy  = null ;
			var path = null ;
			if ( contextSession ){
				path = this.path+"/"+contextSession+"/"+id ;	
			}else{
				path = this.path+"/default/"+id ;	
			}
			try {
				fileDestroy = new nodefony.fileClass(path);
			}catch(e){
				this.manager.logger("STORAGE FILE :" + path   ,"DEBUG");
				return new Promise ( (resolve, reject ) => {
					resolve( id );	
				})	
			}
			return new Promise ( (resolve, reject) => {
				try {
					this.manager.logger("FILES SESSIONS STORAGE DESTROY SESSION context : "+contextSession +" ID : "+ fileDestroy.name + " DELETED");
					return resolve( fileDestroy.unlink() ) ;
				}catch(e){
					return reject (id) ;
				}			
			});
		}
	
		gc (maxlifetime, contextSession){
			var msMaxlifetime = ( (maxlifetime || this.gc_maxlifetime) * 1000);
			if ( contextSession ){
				var path = this.path+"/"+contextSession ;
				finderGC.call(this, path , msMaxlifetime, contextSession)	
			}else{
				//finderGC.call(this, this.path , msMaxlifetime)	
				if (this.contextSessions.length){
					for (var i = 0 ; i<this.contextSessions.length ; i++){
						finderGC.call(this, this.path+"/"+this.contextSessions[i] , msMaxlifetime , this.contextSessions[i]);	
					}
				}
			}
		}

		read (file){
			return new Promise ( (resolve, reject) => {
				var id = file.name;
				try {
					fs.readFile(file.path, "utf8", (err, data) => {
						if (err){
							return reject( err );
						}
						return resolve( JSON.parse(data ));
					});
					 
				}catch(e){
					this.manager.logger("FILES SESSIONS STORAGE READ  ==> "+ e,"ERROR")	
					return reject(e );
				}	
			});
		}

		write (fileName, serialize, contextSession){
			if ( contextSession ){
				var path = this.path+"/"+contextSession+"/"+fileName ;	
			}else{
				var path = this.path+"/default/"+fileName ;	
			}
			return new Promise ( (resolve, reject) => {
				try{	
					fs.writeFile(path, JSON.stringify(serialize), 'utf8', (err) => {
						if ( err ){
							return reject (err);
						}
						resolve(serialize);
					});
				}catch(e){
					this.manager.logger("FILES SESSIONS STORAGE : "+ e,"ERROR");
					return reject(e) ;
				}
			});
		}
	};
	return fileSessionStorage ;
});
