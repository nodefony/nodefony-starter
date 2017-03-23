/*
 *
 *
 *
 *
 *
 */

var AsciiTable = require('ascii-table');

nodefony.register("Worker", function(){


	var regHidden = /^\./;
	var isHiddenFile = function(name){
		return regHidden.test(name);
	};

	var Worker = class Worker extends nodefony.Service {

		constructor (name, container, notificationsCenter){
			super( name, container, notificationsCenter);
			this.twig = this.kernel.templating ; //this.container.get("templating");
			this.publicDirectory = this.kernel.rootDir+"/web/";
		}

		showHelp (){
			return this.kernel.showHelp() ;
		}

		terminate (code){
			if ( code === undefined ){
				return this.kernel.terminate(0);	
			}
			return this.kernel.terminate(code);
		}

		createDirectory (path, mode, callback){
			try {
				fs.mkdirSync(path, mode);
				var file = new nodefony.fileClass(path);
				callback( file );
				return file ;
			}catch(e){
				throw e ;
			}
		}

		createSymlink (srcpath, dstpath, callback){
			var res= null ;
			try {
				res = fs.statSync(srcpath);
				//if ( ! res ) this.logger("FILE :"+srcpath +" not exist","ERROR");
				try{
					// LINK
					res = fs.lstatSync(dstpath);
					if (res ){ fs.unlinkSync(dstpath) ;}
				}catch(e){
					//console.log("PASS CATCH")
					//console.log(e ,"ERROR")
				}			
				//console.log(srcpath+" : "+ dstpath);
				res = fs.symlink(srcpath, dstpath, (e) => {
					//console.log("PASS symlinkSync");
    					if(!e || (e && e.code === 'EEXIST')){
						callback(srcpath, dstpath);
    					} else {
        					this.logger(e,"ERROR");
    					}
				});
				callback(srcpath, dstpath);
			}catch(e){
				this.logger("FILE :"+srcpath +" not exist: "+e,"ERROR");
				//this.logger("Create symlink   : "+ e, "ERROR");
			}
		}

		getSizeDirectory (dir){
			var files = fs.readdirSync(dir);
			var i, totalSizeBytes= 0;
			var dirSize = null ;
			for (i=0; i<files.length; i++) {
				var path = dir+"/"+files[i] ;
				var stat = fs.lstatSync(path);
				switch (true){
					case stat.isFile() :
						if (!  isHiddenFile(files[i] ) ){
							totalSizeBytes += stat.size;
						}
					break;
					case stat.isDirectory() :
						dirSize = this.getSizeDirectory(path);
						totalSizeBytes += dirSize;
					break;
					case stat.isSymbolicLink() :
						//console.log("isSymbolicLink")
						dirSize = this.getSizeDirectory(fs.realpathSync(path));
						totalSizeBytes += dirSize;
					break;
				}	
			}		
			return totalSizeBytes ;
		}

		// ASSETS LINK
		assetInstall (){
			var table = new AsciiTable("INSTALL LINK IN PUBLIC DIRECTORY : ./web");	
			table.setHeading(
				"BUNDLE",
				"DESTINATION PATH",
				"SOURCE PATH",
				"SIZE"
			);
			
			this.createAssetDirectory(this.publicDirectory, () => {
				this.parseAssetsBundles(table);
			});
			console.log(table.render());	
		}

		createAssetDirectory (Path, callback){
			try {
				return callback( fs.statSync(Path));
			}catch(e){
				this.logger("Create directory : "+ Path);
				fs.mkdir(Path, (e) => {
    					if(!e || (e && e.code === 'EEXIST')){
        					callback( fs.statSync(Path) );
    					} else {
        					this.logger(e,"ERROR");
    					}
				});
			}
		}

		parseAssetsBundles (table){
			var bundles = this.kernel.getBundles();
			var result = null ;
			for ( var bundle in bundles ){
				try {
					result = bundles[bundle].getPublicDirectory();	
				}catch(e){
					continue ;
				}
				if ( result.length() ){
					var name = path.basename(bundles[bundle].path) ;
					var srcpath = bundles[bundle].path+"/Resources/public";
					
					this.createSymlink(srcpath, this.publicDirectory+'/'+name,function(srcpath, dstpath){
						table.addRow(
							bundle,
							dstpath,
							this.publicDirectory+"/"+srcpath,
							nodefony.niceBytes(this.getSizeDirectory(dstpath))
						);

					}.bind(this, bundle));
				}
			}	
			table.setTitle("INSTALL LINK IN /web TOTAL SIZE : " + nodefony.niceBytes( this.getSizeDirectory( this.publicDirectory )) );
		}

		

		

		createFile (path, skeleton, parse, params, callback){
			if ( skeleton ){
				this.buildSkeleton(skeleton, parse, params,(error, result) => {
					if (error){
						this.logger(error, "ERROR");	
					}else{
						try {
							fs.writeFileSync(path, result,{
								mode:"777"
							});
							callback( new nodefony.fileClass(path) ); 
						}catch(e){
							throw e	;
						}		
					}					
				});
			}else{
				var data = "/* generate by nodefony */";
				try {
					fs.writeFileSync(path, data,{
						mode:"777"
					});
					callback( new nodefony.fileClass(path) ); 
				}catch(e){
					throw e	;
				}
			}
		}

		buildSkeleton (skeleton, parse, obj, callback){
			var skelete = null ;
			try {
				skelete = new nodefony.fileClass(skeleton);
				if (skelete.type === "File"){
					if (parse !== false){
						this.twig.renderFile(skelete, obj, callback);
					}else{
						callback(null, fs.readFileSync(skelete.path,{
							encoding:'utf8'
						}));
					}
				}else{
					throw new Error( " skeleton must be file !!! : "+ skelete.path);
				}
			}catch(e){
				this.logger(e, "ERROR");
			}
			return skelete;
		}

		build (obj, parent){
			var child = null;
			switch ( nodefony.typeOf(obj) ){
				case "array" :
					for (var i = 0 ; i < obj.length ; i++){
						this.build(obj[i], parent);
					}	
				break;
				case "object" :
					for (var ele in obj ){
						var value = obj[ele];
						switch (ele){
							case "name" :
								var name = value;
							break;
							case "type" :
								switch(value){
									case "directory":
										child = this.createDirectory(parent.path+"/"+name, "777", (ele) => {
											this.logger("Create Directory :" + ele.name);
										} );
									break;
									case "file":
										this.createFile(parent.path+"/"+name, obj.skeleton, obj.parse, obj.params, (ele) =>{
											this.logger("Create File      :" + ele.name);
										});
									break;
									case "symlink":
										fs.symlink ( parent.path+"/"+obj.params.source, parent.path+"/"+obj.params.dest , obj.params.type || "file", (ele) => {
											this.logger("Create symbolic link :" + ele.name);
										} );
									break;
								}
							break;
							case "childs" :
								try {
									//console.log(value)
									this.build(value, child);
								}catch (e){
									this.logger(e, "ERROR");
								}
							break;
						}
					}
				break;
				default:
					this.logger("generate build error arguments : "+ ele, "ERROR" );
			}
			return child ;
		}
	};
	return Worker ;
});

