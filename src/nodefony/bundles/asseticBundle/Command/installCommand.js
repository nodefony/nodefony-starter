/*
 *
 *
 *
 *
 *
 */

var AsciiTable = require('ascii-table');


nodefony.registerCommand("assets",function(){

	
	var regHidden = /^\./;
	var isHiddenFile = function(name){
		return regHidden.test(name);
	};

	var Asset = class Asset extends nodefony.Worker {

		constructor (container, command/*, options*/){

			super( "assets", container, container.get("notificationsCenter") );
				
			var arg = command[0].split(":");
			switch( arg[0] ){
				case "assets" :
					switch ( arg[1] ){
						case "install" :
							this.table = new AsciiTable("INSTALL LINK IN /web/");	
							this.table.setHeading(
								"BUNDLE",
								"DESTINATION PATH",
								"SOURCE PATH",
								"SIZE"
							);

							this.publicDirectory = this.kernel.rootDir+"/web/";
							this.createAssetDirectory(this.publicDirectory, () => {
								this.parseBundles();
							});
							console.log(this.table.render());
							this.terminate(0);
						break;
						case "dump" :
							this.bundles = this.kernel.getBundles();
							//var serviceTemplate = container.get("templating") ;
							this.kernel.listen(this, "onReady", () => {
								for ( var bundle in this.bundles ){
									var views = this.bundles[bundle].resourcesFiles.findByNode("views") ;
									views.getFiles().forEach((file/*, index, array*/) => {
										this.twig.compile( file, (error/*, template*/) => {
											if (error){
												this.logger(error, "ERROR");
												this.terminate(1);
												return ;
											}
										} );
									});
								}
								this.terminate(0);
							});
						break;
						default:
							this.logger(new Error(command[0] + " command error"),"ERROR");
							this.showHelp();
					}
				break;
				default:
					this.logger(new Error(command[0] + " command error"),"ERROR");
					this.showHelp();
					this.terminate(0);
			}
		}

		parseBundles (){
			this.bundles = this.kernel.getBundles();
			var result = null ;
			for ( var bundle in this.bundles ){
				try {
					result = this.bundles[bundle].getPublicDirectory();	
				}catch(e){
					continue ;
				}
				if ( result.length() ){
					var name = path.basename(this.bundles[bundle].path) ;
					var srcpath = this.bundles[bundle].path+"/Resources/public";
					
					this.createSymlink(srcpath, this.publicDirectory+'/'+name,function(srcpath, dstpath){
						//console.log(srcpath+" : "+ dstpath);
						//this.logger("BUNDLE :"+bundle+" CREATE SymLink :" + dstpath+" --> "+srcpath )
						this.table.addRow(
							bundle,
							dstpath,
							this.publicDirectory+"/"+srcpath,
							nodefony.niceBytes(this.getSizeDirectory(dstpath))
						);

					}.bind(this, bundle));
				}
			}	
			this.table.setTitle("INSTALL LINK IN /web TOTAL SIZE : " + nodefony.niceBytes( this.getSizeDirectory( this.publicDirectory )) );
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
	};

	return {
		name:"assets",
		commands:{
			install:["assets:install" ,"Installs bundles web assets link under a public web directory "],
			dump:["assets:dump" ,"Dump  all bundles web assets under a public web directory "]
			//watch:["assetic:watch" ,"Installs bundles web assets under a public web directory "]
		},
		worker:Asset
	};

});
