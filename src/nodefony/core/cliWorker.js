/*
 *
 *
 *
 *
 *
 */
var Table = require('cli-table');
const clc = require('cli-color');

nodefony.register("cliWorker", function(){

	const red   = clc.red.bold;
	const cyan   = clc.cyan.bold;
	const blue  = clc.blueBright.bold;
	const green = clc.green;
	const yellow = clc.yellow.bold;
	const reset = '\x1b[0m';
	var logSeverity = function(severity) {
		switch(severity){
			case "DEBUG":
				return cyan(severity);
			case "INFO":
				return blue(severity);
			case "NOTICE" :
				return red(severity);
			case "WARNING" :
				return yellow(severity);
			case "ERROR" :
			case "CRITIC":
			case "ALERT":
			case "EMERGENCY":
				return red(severity);
			default:
				return cyan(severity);
		}
	};

	const regHidden = /^\./;
	var isHiddenFile = function(name){
		return regHidden.test(name);
	};

	var createFile = function (Path, skeleton, parse, params, callback){
		if ( skeleton ){
			buildSkeleton.call(this, skeleton, parse, params,(error, result) => {
				if (error){
					this.logger(error, "ERROR");	
				}else{
					try {
						fs.writeFileSync(Path, result,{
							mode:"777"
						});
						callback( new nodefony.fileClass(Path) ); 
					}catch(e){
						throw e	;
					}		
				}					
			});
		}else{
			var data = "/* generate by nodefony */";
			try {
				fs.writeFileSync(Path, data,{
					mode:"777"
				});
				callback( new nodefony.fileClass(Path) ); 
			}catch(e){
				throw e	;
			}
		}
	};

	var buildSkeleton = function(skeleton, parse, obj, callback){
		var skelete = null ;
		try {
			skelete = new nodefony.fileClass(skeleton);
			if (skelete.type === "File"){
				if (parse !== false){
					obj.settings = this.twigOptions ; 
					this.twig.renderFile(skelete.path, obj, callback);
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
	};



	var createAssetDirectory = function (Path, callback){
		this.logger("INSTALL ASSETS LINK IN WEB PUBLIC DIRECTORY  : "+ Path);
		try {
			if ( fs.existsSync(Path) ){
				return callback( fs.statSync(Path) );
			}
			throw new Error( Path +" don' exist") ;	
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
	};

	var parseAssetsBundles = function (table, Name){
		var bundles = this.kernel.getBundles();
		var result = null ;
		let name =null; 
		let srcpath =null; 
		for ( let bundle in bundles ){
			if (Name && Name !== bundle){
				continue;
			}
			try {
				result = bundles[bundle].getPublicDirectory();	
			}catch(e){
				continue ;
			}
			if ( result.length() ){
				name = path.basename(bundles[bundle].path) ;
				srcpath = bundles[bundle].path+"/Resources/public";
				this.createSymlink(srcpath, this.publicDirectory+name, (Srcpath, dstpath) => {
					var size = "not Defined";
					try {
						size = nodefony.niceBytes( this.getSizeDirectory(Srcpath ) ) ;
					}catch(e){
						this.logger(e, "ERROR");	
					}
					table.push([
						bundle,
						dstpath.replace(this.kernel.rootDir,"."),
						Srcpath.replace(this.kernel.rootDir,"."),
						size 
					]);
				});
			}
		}	
		try {
			this.logger("INSTALL LINK IN /web TOTAL SIZE : " + nodefony.niceBytes( this.getSizeDirectory( this.publicDirectory ,/^docs$|^tests|^node_modules|^assets$/ )) );
		}catch(e){
			this.logger(e, "WARNING");		
		}
	};

	var niceBytes = function (x){
  		var units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    		    n = parseInt(x, 10) || 0, 
    		    l = 0;        
  		while(n >= 1024){
      			n = n/1024;
      			l++;
  		}
  		return(n.toFixed(n >= 10 || l < 1 ? 0 : 1) + ' ' + units[l]);
	};
	nodefony.niceBytes = niceBytes ;

	var defaultTableCli = {
		style: {head: ['cyan'], border: ['grey']}
	};

	/*
	 *
	 *	CLI WORKER
	 *
	 */
	var cliWorker = class cliWorker extends nodefony.Service {

		constructor (name, container, notificationsCenter){
			super( name, container, notificationsCenter);
			this.publicDirectory = this.kernel.rootDir+"/web/";
			this.twig = twig ;
			this.clc = clc ;
			this.twigOptions = {
				views :this.kernel.rootDir,
				'twig options':{
					async: false,
					cache: false 
				}
			};
		}

		reset (){
			process.stdout.write(this.clc.reset);
		}

		showHelp (){
			return this.kernel.showHelp() ;
		}

		niceBytes (x){
			return niceBytes(x);
		}

		terminate (code){
			return this.kernel.terminate(code);
		}

		displayTable ( datas, options ){
			var table = new Table( nodefony.extend(true, defaultTableCli, options ) );
				
			if ( datas ) {
				for ( var i= 0 ;  i < datas.length ; i++ ){
					table.push( datas[i] )	
				}
				console.log(table.toString()); 
			}
			return table ;
		}

		createDirectory (Path, mode, callback){
			try {
				fs.mkdirSync(Path, mode);
				var file = new nodefony.fileClass(Path);
				callback( file );
				return file ;
			}catch(e){
				throw e ;
			}
		}

		normalizeLog  (pdu){
			var date = new Date(pdu.timeStamp) ;

			if ( ! pdu.payload ){
				console.log( date.toDateString() + " " + date.toLocaleTimeString() + " " + logSeverity( pdu.severityName ) + " " + green( pdu.msgid) + " " + " : " + "logger message empty !!!!");
				console.trace(pdu);
				return 	;	
			}
			var message = pdu.payload;
			switch( typeof message ){
				case "object" :
					switch (true){
						default:
							message = util.inspect(message)
					}
				break;
				default:
			}
			console.log( date.toDateString() + " " + date.toLocaleTimeString() + " " + logSeverity( pdu.severityName ) + " " + green(pdu.msgid) + " " + " : " + message);
		}

		listenSyslog (syslog, debug){
			// CRITIC ERROR
			syslog.listenWithConditions(this,{
				severity:{
					data:"CRITIC,ERROR"
				}		
			},(pdu) => {
				this.normalizeLog( pdu);
			});
			// INFO DEBUG
			var data ;
			if ( debug ){
				data = "INFO,DEBUG,WARNING" ;
			}else{
				data = "INFO" ;
			}
			syslog.listenWithConditions(this, {
				severity:{
					data:data
				}		
			},(pdu) => {
				if ( pdu.msgid === "SERVER WELCOME"){
					console.log(   '\x1b[34m' + "              \x1b[0m "+ pdu.payload);	
					return ;
				}
				this.normalizeLog( pdu);
			});
		};

		createSymlink (srcpath, dstpath, callback){
			var res= null ;
			try {
				res = fs.statSync(srcpath);
				try{
					// LINK
					res = fs.lstatSync(dstpath);
					if ( res ){ fs.unlinkSync(dstpath) ;}
				}catch(e){
					//console.log("PASS CATCH")
					//console.log(e ,"ERROR")
				}			
				//console.log(srcpath+" : "+ dstpath);
				res = fs.symlink(srcpath, dstpath, (e) => {
    					if(!e || (e && e.code === 'EEXIST')){
						callback(srcpath, dstpath);
    					} else {
        					this.logger(e,"ERROR");
    					}
				});
				callback(srcpath, dstpath);
			}catch(e){
				this.logger("FILE :"+srcpath +" not exist: "+e,"ERROR");
			}
		}

		getSizeDirectory (dir, exclude){
			try {
				if ( exclude ){
					var basename = path.basename(dir);
					if ( basename.match(exclude) ){
						return 0 ;
					}
				}
				var stat = fs.lstatSync(dir);
			}catch(e){
				this.logger(e, "ERROR");
				throw e ;
			}
			var files = null ;
			switch (true){
				case stat.isFile() :
					throw  new Error ( dir+" is not a directory");
				break;
				case stat.isDirectory() :
					files = fs.readdirSync(dir);
				break;
				case stat.isSymbolicLink() :
					files = fs.realpathSync(dir);
				break;
				default:
					throw  new Error ( dir+" is not a directory");
			}
				
			var i, totalSizeBytes= 0;
			var dirSize = null ;
			for (i=0; i<files.length; i++) {
				var Path = dir+"/"+files[i] ;
				try {
					stat = fs.lstatSync(Path);
				}catch(e){
					return 	totalSizeBytes ;
				}
				switch (true){
					case stat.isFile() :
						if (!  isHiddenFile(files[i] ) ){
							totalSizeBytes += stat.size;
						}
					break;
					case stat.isDirectory() :
						dirSize = this.getSizeDirectory(Path, exclude);
						totalSizeBytes += dirSize;
					break;
					case stat.isSymbolicLink() :
						//console.log("isSymbolicLink")
						dirSize = this.getSizeDirectory(fs.realpathSync(Path), exclude);
						totalSizeBytes += dirSize;
					break;
				}	
			}		
			return totalSizeBytes ;
		}

		// ASSETS LINK
		assetInstall (name){
			var table = this.displayTable(null, {
				head:[
					"BUNDLES",
					"DESTINATION PATH",
					"SOURCE PATH",
					"SIZE"
				]
			})
			createAssetDirectory.call(this, this.publicDirectory, () => {
				parseAssetsBundles.call(this, table, name);
				console.log(table.toString());	
			});
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
										createFile.call(this, parent.path+"/"+name, obj.skeleton, obj.parse, obj.params, (ele) =>{
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
	return cliWorker ;
});

