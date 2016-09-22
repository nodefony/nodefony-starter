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

	
	var jsonTree = function(path, parent){
		this.mother = this.$super;
		this.mother.constructor(path);
		this.parent = parent ;
		if ( this.parent !== null)
			this.parent.children.push(this);
		this.children = [];
	}.herite(nodefony.fileClass);
	

	/*
 	 *	CLASS Result
 	 *
 	 */
	var Result = function(res){
		if (res && nodefony.typeOf(res) === "array")
			this.files = res;
		else
			this.files = [];		
		this.json = {};
	} 

	Result.prototype.push = function(file){
		this.files.push(file)
	};

	Result.prototype.length = function(){
		return this.files.length;
	}


	Result.prototype.slice = function(offset, limit){
		return new Result( Array.prototype.slice.call(this.files, offset, limit) ) ;
	}

	Result.prototype.sort = function(callback){
		return new Result( Array.prototype.sort.call(this.files, callback) ) ;
	}

	Result.prototype.sortByName = function(){
		var res = this.files.sort(function(a,b){
			if ( a.name.toString() > b.name.toString()) return 1;
			if (  a.name.toString() < b.name.toString()) return -1;
			return 0;
		});
		if (res)
			return new Result(res)
		return this
	};
	Result.prototype.sortByType = function(){
		var res = this.files.sort(function(a,b){
			if ( a.type.toString() > b.type.toString()) return 1;
			if (  a.type.toString() < b.type.toString()) return -1;
			return 0;
		});
		if (res)
			return new Result(res)
		return this
	};


	Result.prototype.findByNode = function(nodeName, tab, path){
		if ( ! tab ) {
			tab = [];
			for (var i = 0 ; i < this.files.length ; i++ ){
				if (this.files[i].name === nodeName) {
					if ( this.files[i].isDirectory() ){
						path = this.files[i].path ; 
						//tab.push(this.files[i]);
					}
				}
			}
		}
		for (var i = 0 ; i < this.files.length ; i++ ){
			if (this.files[i].dirName === path) {
				tab.push(this.files[i]);	
				if ( this.files[i].isDirectory() ){
					arguments.callee.call(this,  this.files[i].name, tab, this.files[i].path)
				}
			}
		}
		return new Result(tab) 	
	};

	Result.prototype.getDirectories = function(){
		var tab = [] ;
		for (var i = 0 ; i < this.files.length ; i++ ){
			if (this.files[i].type === "Directory") {
				tab.push(this.files[i])
			}
		}
		return new Result(tab)	
	};
	
	Result.prototype.getFiles = function(){
		var tab = [] ;
		for (var i = 0 ; i < this.files.length ; i++ ){
			if (this.files[i].type === "File") {
				tab.push(this.files[i])
			}
		}
		return new Result(tab)	
	};

	Result.prototype.getFile = function(name, casse){
		var tab = [] ;
		for (var i = 0 ; i < this.files.length ; i++ ){
			if (this.files[i].type === "File") {
				if ( casse ){
					var reg = new RegExp("^"+name+"$","i") ;
					if ( reg.test(this.files[i].name) ){
						return this.files[i] ;	
					}
				}else{
					if (this.files[i].name === name )
						return this.files[i] ;
				}
			}
		}
		return null ;	
	};


	Result.prototype.forEach = function(callback){
		return this.files.forEach(callback)
	};

	Result.prototype.match = function(reg){
		var tab = [] ;
		for (var i = 0 ; i < this.files.length ; i++ ){
			var res =  this.files[i].matchName(reg) ;
			if ( res ) {
				tab.push(this.files[i])
			}
		}
		return new Result(tab)
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
					return settings.match
				}
				return false;
			}
		}
		return true;	
	};


	var checkExclude = function(file, settings){
		
		if ( file.matchName( settings.exclude ) ){
			return true
		}
		if ( file.matchType(settings.exclude) ){
			return true
		}
		return false;
	};

	var checkHidden = function(file, settings){
		if ( ! settings.seeHidden  ){
			if ( file.isHidden() )
				return true;
		}
		return false
	}


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
	var finder = function(settings){	
		this.path = [];
		this.errorParse = [];
		this.settings = nodefony.extend({}, defaultSettings, settings);	
		this.tree = this.settings.json ; 
		if (this.tree){
			this.wrapper = jsonTree ;
		}else{
			this.wrapper = 	nodefony.fileClass ;
		}
		//this.notificationsCenter = nodefony.notificationsCenter.create(this.settings);
		if (this.settings.path){	
			this.in(this.settings.path);
			this.result = this.find();
		}
	};

	finder.prototype.in = function(Path){
		this.typePath = nodefony.typeOf(Path);
		if (this.typePath === "string" ){
			try{
				this.path.push(new this.wrapper(Path, null))
				return this;
			}catch(e){
				return this ; 	
			}
		}
		if(this.typePath === "array" ){
			for (var i = 0 ; i < Path.length ; i++){
				this.path.push(new this.wrapper(Path[i], null))
			}
			return this;
		}

	}

	finder.prototype.files = function(){
		return this.find({
			match:"File"	
		})	
	};

	finder.prototype.directories = function(){
		return this.find({
			match:"Directory"	
		})	
	};


	finder.prototype.find = function( settings ){
		var result = new Result();
		if (! settings ) {
			var extend = this.settings ;
		}else{
			var extend = nodefony.extend({}, defaultSettings, settings) ;	
		}
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


	
	var find = function(file, result, depth, settings, parent){
		try{
				
			var res = fs.readdirSync(file.path);

			if (res && res.length){
				var ret = regSlash.exec(file.path);
 				if (ret){
					var filePath = ret[1]+"/";
				}else{
					var filePath = file.path+"/";
				}	
				for (var i=0 ; i < res.length ; i++){
					var match = true ;
					var File = filePath+res[i] ;
					var info = new this.wrapper( File , parent);
					if (! settings.seeHidden){
						if ( checkHidden.call(this, info, settings) ) {
							if (parent && parent.children)
								parent.children.pop();
							continue;
						}
					}
					if ( settings.exclude ){
						if ( checkExclude.call(this, info, settings) ){
							if (parent && parent.children)
								parent.children.pop();
							continue;
						}
					}
					if (settings.match){
						var match =  checkMatch.call(this, info, settings) ;
					}
					if (match){
						var index = result.push(info);
						this.notificationsCenter.fire("on"+info.type, info, this);
					}else{
						if (parent && parent.children)
							parent.children.pop();
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
								var obj = new this.wrapper(info.path, info) 	
								if ( obj.isDirectory() )
									arguments.callee.call(this, obj, result, settings.depth, settings, parent);
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
	
	return finder;
});
