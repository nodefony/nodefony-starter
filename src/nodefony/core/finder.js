/*
 *
 *
 *
 *
 *
 *
 *
 */

nodefony.register("finder", function(){

	var jsonTree =  class jsonTree extends nodefony.fileClass {
		constructor (path, parent){
			super(path);
			this.parent = parent ;
			if ( this.parent !== null && this.parent.children){
				this.parent.children.push(this);
			}
			this.children = [];
		}
	};

	/*
 	 *	CLASS Result
 	 *
 	 */
	var Result = class Result {

		constructor (res){
			if (res && nodefony.typeOf(res) === "array"){
				this.files = res;
			}else{
				this.files = [];
			}
			this.json = {};
		} 

		push (file){
			this.files.push(file);
		}

		length (){
			return this.files.length;
		}

		slice (offset, limit){
			return new Result( Array.prototype.slice.call(this.files, offset, limit) ) ;
		}

		sort (callback){
			return new Result( Array.prototype.sort.call(this.files, callback) ) ;
		}

		sortByName (){
			var res = this.files.sort(function(a,b){
				if ( a.name.toString() > b.name.toString()) {return 1;}
				if (  a.name.toString() < b.name.toString()) {return -1;}
				return 0;
			});
			if (res){
				return new Result(res);
			}
			return this ;
		}

		sortByType (){
			var res = this.files.sort(function(a,b){
				if ( a.type.toString() > b.type.toString()) {return 1;}
				if (  a.type.toString() < b.type.toString()) {return -1;}
				return 0;
			});
			if (res){
				return new Result(res);
			}
			return this ;
		}

		findByNode (nodeName, tab, path){
			var i = null ;
			if ( ! tab ) {
				tab = [];
				for ( i = 0 ; i < this.files.length ; i++ ){
					if (this.files[i].name === nodeName) {
						if ( this.files[i].isDirectory() ){
							path = this.files[i].path ; 
							//tab.push(this.files[i]);
						}
					}
				}
			}
			for ( i = 0 ; i < this.files.length ; i++ ){
				if (this.files[i].dirName === path) {
					tab.push(this.files[i]);	
					if ( this.files[i].isDirectory() ){
						this.findByNode( this.files[i].name, tab, this.files[i].path);
					}
				}
			}
			return new Result(tab);
		}

		getDirectories (){
			var tab = [] ;
			for (var i = 0 ; i < this.files.length ; i++ ){
				if (this.files[i].type === "Directory") {
					tab.push(this.files[i]);
				}
			}
			return new Result(tab);	
		}
		
		getFiles (){
			var tab = [] ;
			for (var i = 0 ; i < this.files.length ; i++ ){
				switch( this.files[i].type ){
					case "File":
						tab.push(this.files[i]) ;
					break;
					case "symbolicLink":
						var path = fs.readlinkSync( this.files[i].path );	
						var file = this.files[i].dirName+"/"+path ;
						if (fs.lstatSync(file).isFile() ){
							tab.push(this.files[i]) ;
						}
					break;
				}
			}
			return new Result(tab);
		}

		getFile (name, casse){
			var reg = null ;
			for (var i = 0 ; i < this.files.length ; i++ ){
				switch( this.files[i].type ){
					case "File":
						if ( casse ){
							reg = new RegExp("^"+name+"$","i") ;
							if ( reg.test(this.files[i].name) ){
								return this.files[i] ;	
							}
						}else{
							if (this.files[i].name === name ){
								return this.files[i] ;
							}
						}
					break;
					case "symbolicLink":
						var path = fs.readlinkSync( this.files[i].path );	
						var file = this.files[i].dirName+"/"+path ;
						if (fs.lstatSync(file).isFile() ){
							if ( casse ){
								reg = new RegExp("^"+name+"$","i") ;
								if ( reg.test(this.files[i].name) ){
									return this.files[i] ;	
								}
							}else{
								if (this.files[i].name === name ){
									return this.files[i] ;
								}
							}
						}
					break;
				}
				if (this.files[i].type === "File") {
					if ( casse ){
						reg = new RegExp("^"+name+"$","i") ;
						if ( reg.test(this.files[i].name) ){
							return this.files[i] ;	
						}
					}else{
						if (this.files[i].name === name ){
							return this.files[i] ;
						}
					}
				}
			}
			return null ;	
		}

		forEach (callback){
			return this.files.forEach(callback);
		}

		match (reg){
			var tab = [] ;
			for (var i = 0 ; i < this.files.length ; i++ ){
				var res =  this.files[i].matchName(reg) ;
				if ( res ) {
					tab.push(this.files[i]);
				}
			}
			return new Result(tab);
		}
	};


	/*
 	 *	CLASS Finder
 	 *
 	 */
	var checkMatch = function(file, settings){
		if ( settings.match ){
			if ( file.matchName(settings.match) ){
				return true;
			}else{
				if ( file.matchType(settings.match) ){
					return settings.match ;
				}
				return false;
			}
		}
		return true;	
	};


	var checkExclude = function(file, settings){
		
		if ( file.matchName( settings.exclude ) ){
			return true ;
		}
		if ( file.matchType(settings.exclude) ){
			return true ;
		}
		return false;
	};

	var checkHidden = function(file, settings){
		if ( ! settings.seeHidden  ){
			if ( file.isHidden() ){
				return true;
			}
		}
		return false ;
	};

	var find = function(file, result, depth, settings, parent){
		try{
				
			var res = fs.readdirSync(file.path);

			if (res && res.length){
				var ret = regSlash.exec(file.path);
				var filePath = null ;
 				if (ret){
					filePath = ret[1]+"/";
				}else{
					filePath = file.path+"/";
				}	
				for (var i=0 ; i < res.length ; i++){
					var match = true ;
					var File = filePath+res[i] ;
					var info = new this.wrapper( File , parent);
					if (! settings.seeHidden){
						if ( checkHidden.call(this, info, settings) ) {
							if (parent && parent.children){
								parent.children.pop();
							}
							continue;
						}
					}
					if ( settings.exclude ){
						if ( checkExclude.call(this, info, settings) ){
							if (parent && parent.children){
								parent.children.pop();
							}
							continue;
						}
					}
					if (settings.match){
						match =  checkMatch.call(this, info, settings) ;
					}
					if (match){
						result.push(info);
						this.notificationsCenter.fire("on"+info.type, info, this);
					}else{
						if (parent && parent.children){
							parent.children.pop();
						}
					}
					switch(info.type){
						case "Directory":
							if ( settings.recurse && depth-1 !== 0 ){
								arguments.callee.call(this, info, result, --depth, settings, info );	
								depth++;
							}
						break;
						case "symbolicLink" :
							if (settings.followSymLink && depth-1 !== 0){
								var obj = new this.wrapper(info.path, info);
								if ( obj.isDirectory() ){
									arguments.callee.call(this, obj, result, settings.depth, settings, parent);
								}
							}
						break;
					}

					//
				}
			}
			return result;
		}catch(e){
			this.notificationsCenter.fire("onError", e);
			this.errorParse.push(e);
			console.log(e);
			//this.notificationsCenter.fire("onFinish",e,null);
			//throw e ;	
		}
	};


	var defaultSettings = {
		path:null,
		sync:true,
		recurse:true,
		depth:-1,
		onFinish:null,
		onFile:null,
		seeHidden:false,
		match: null,
		exclude: null,
		followSymLink:false,
		json:false
	};


	var regSlash = /^(.*)\/$/g;

	var finder = class finder {

		constructor (settings){	
			this.path = [];
			this.errorParse = [];
			this.settings = nodefony.extend({}, defaultSettings, settings);	
			if (this.settings.path){	
				this.result = this.find();
			}
		}

		in (Path){
			this.typePath = nodefony.typeOf(Path);
			if (this.typePath === "string" ){
				try{
					this.path.push(new this.wrapper(Path, null));
					return this;
				}catch(e){
					throw e;
				}
			}
			if(this.typePath === "array" ){
				for (var i = 0 ; i < Path.length ; i++){
					try {
						this.path.push(new this.wrapper(Path[i], null));
					}catch(e){
						throw e;
					}
				}
				return this;
			}

		}

		files (){
			return this.find({
				match:"File"	
			});	
		}

		directories (){
			return this.find({
				match:"Directory"	
			});	
		}

		find ( settings ){
			var result = new Result();
			var extend = null ;
			if (! settings ) {
				extend = this.settings ;
			}else{
				extend = nodefony.extend({}, defaultSettings, settings) ;	
			}

			this.tree = extend.json ; 
			if (this.tree){
				this.wrapper = jsonTree ;
			}else{
				this.wrapper = 	nodefony.fileClass ;
			}

			this.in(extend.path);
			this.notificationsCenter = nodefony.notificationsCenter.create(extend);
			try {
				for (var i = 0 ; i < this.path.length ; i++){
					if (extend.json ){
						result.json[this.path[i].name] = this.path[i];
						find.call(this, this.path[i], result, extend.depth, extend, this.path[i] );
					}else{
						find.call(this, this.path[i], result, extend.depth, extend, null );
					}
				}
			}catch(e){
				this.notificationsCenter.fire("onFinish",e,null);
				throw e;
			}
			this.notificationsCenter.fire("onFinish",null, result) ;
			return result;
		}	
	};
		
	return finder;
});
