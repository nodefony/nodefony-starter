/*
 *
 *
 *
 *
 *
 */

var AsciiTable = require('ascii-table');


nodefony.registerCommand("assets",function(){

	

	var Asset = function(container, command, options){

		this.kernel = container.get("kernel");

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
						this.createAssetDirectory(this.publicDirectory, function(stat){
							this.parseBundles();
						}.bind(this));
						console.log(this.table.render());
						this.terminate(0);
					break;
					case "dump" :
						this.bundles = this.kernel.getBundles();
						var serviceTemplate = container.get("templating") ;
						this.kernel.listen(this, "onReady", function(){
							for ( var bundle in this.bundles ){
								var views = this.bundles[bundle].resourcesFiles.findByNode("views") ;
								views.getFiles().forEach(function(file, index, array){
									serviceTemplate.compile( file, function(error, template){
										if (error){
											this.logger(error, "ERROR");
											return ;
										}
									}.bind(this) )	
								})
							}
							this.terminate(0);
						});
					break;
					default:
						this.logger(new Error(command[0] + " command error"),"ERROR")
						this.showHelp();
				}
			break;
			default:
				this.logger(new Error(command[0] + " command error"),"ERROR")
				this.showHelp();
				this.terminate(0);
		}
		
	};

	Asset.prototype.parseBundles = function(){
		this.bundles = this.kernel.getBundles();
		for ( var bundle in this.bundles ){
			try {
				var result = this.bundles[bundle].getPublicDirectory();	
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
						this.getSizeDirectory(dstpath) / 1000 + " ko"	
					);

				}.bind(this, bundle));
			}
		}	
		this.table.setTitle("INSTALL LINK IN /web TOTAL SIZE : " + this.getSizeDirectory( this.publicDirectory )/ 1000 + " ko")
	};

	var regHidden = /^\./;
	var isHiddenFile = function(name){
		return regHidden.test(name);
	}

	Asset.prototype.getSizeDirectory = function(dir){
		var files = fs.readdirSync(dir);
		var i, totalSizeBytes= 0;
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
					var dirSize = this.getSizeDirectory(path);
					totalSizeBytes += dirSize;
				break;
				case stat.isSymbolicLink() :
					//console.log("isSymbolicLink")
					var dirSize = this.getSizeDirectory(fs.realpathSync(path));
					totalSizeBytes += dirSize;
				break;
			}	
		}		
		return totalSizeBytes ;
	};

	Asset.prototype.createAssetDirectory =function(Path, callback){
		try {
			return callback( fs.statSync(Path));
		}catch(e){
			this.logger("Create directory : "+ Path);
			fs.mkdir(Path, function(e){
    				if(!e || (e && e.code === 'EEXIST')){
        				callback( fs.statSync(Path) );
    				} else {
        				this.logger(e,"ERROR");
    				}
			}.bind(this));
		}
	};

	Asset.prototype.createSymlink =function(srcpath, dstpath, callback){
		try {
			var res = fs.statSync(srcpath);
			//if ( ! res ) this.logger("FILE :"+srcpath +" not exist","ERROR");
			try{
				// LINK
				res = fs.lstatSync(dstpath);
				if (res ) fs.unlinkSync(dstpath)
			}catch(e){
				//console.log("PASS CATCH")
				//console.log(e ,"ERROR")
			}			
			//console.log(srcpath+" : "+ dstpath);
			var res = fs.symlink(srcpath, dstpath, function(e){
				//console.log("PASS symlinkSync");
    				if(!e || (e && e.code === 'EEXIST')){
					callback(srcpath, dstpath)
    				} else {
        				this.logger(e,"ERROR");
    				}
			}.bind(this));
			callback(srcpath, dstpath)
		}catch(e){
			this.logger("FILE :"+srcpath +" not exist: "+e,"ERROR");
			//this.logger("Create symlink   : "+ e, "ERROR");
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
	}

});
