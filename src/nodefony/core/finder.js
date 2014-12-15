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



	

	/*
 	 *	CLASS Result
 	 *
 	 */
	var Result = function(res){
		if (res && nodefony.typeOf(res) === "array")
			this.files = res;
		else
			this.files = [];		
	} 

	Result.prototype.push = function(file){
		this.files.push(file)
	};

	Result.prototype.length = function(){
		return this.files.length;
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
		followSymLink:false
	};


	var regSlash = /^(.*)\/$/g;
	var finder = function(settings){	
		this.path = [];
		this.settings = nodefony.extend({}, defaultSettings, settings);	
		this.notificationsCenter = nodefony.notificationsCenter.create(this.settings);
		if (this.settings.path){	
			this.in(this.settings.path);
			if ( this.path.length ){
				this.result = this.find( this.settings );
			}else{
				this.result = new Result();
			}
		}
	};

	finder.prototype.in = function(Path){
		this.typePath = nodefony.typeOf(Path);
		if (this.typePath === "string" ){
			try{
				this.path.push(new nodefony.fileClass(Path))
				return this;
			}catch(e){
				return this ; 	
			}
		}
		if(this.typePath === "array" ){
			for (var i = 0 ; i < Path.length ; i++){
				this.path.push(new nodefony.fileClass(Path[i]))
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
		var extend = nodefony.extend({}, defaultSettings, settings) ;
		if (settings.json){
			result.json = [];
		}
		for (var i = 0 ; i < this.path.length ; i++){
			var json = null ;
			if (result.json ){
				result.json[this.path[i].name] = this.path[i];
				//result.json["childs"]=[];
				json = result.json ;
			}
			find.call(this, this.path[i], result, extend.depth, extend, json );
		}
		this.notificationsCenter.fire("onFinish",null,result)
		return result;
	}	


	

	var find = function(file, result, depth, settings, json){
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
					var file = filePath+res[i] ;	
					var info = new nodefony.fileClass( file );
					if (! settings.seeHidden){
						if ( checkHidden.call(this, info, settings) ) {
							continue;
						}	
					}
					if ( settings.exclude ){
						if ( checkExclude.call(this, info, settings) ){
							continue;
						}
					}
					if (settings.match){
						var match =  checkMatch.call(this, info, settings) ;
					}
					if (match){
						result.push(info);
						this.notificationsCenter.fire("on"+info.type, info, this);
					}
					switch(info.type){
						case "Directory":
							if (json && match ){
								var obj = [];
								obj[info.name] = info;
								//obj["childs"] =[];
								//var index = json["childs"].push(obj);
								//json[info.name] = json["childs"][index-1];
								//json[info.name] = obj;
								json.push(obj)
							}
							if ( settings.recurse && depth-1 !== 0 ){
								arguments.callee.call(this, info, result, --depth, settings, obj );	
								depth++;
							}
						break;
						case "File":
							if (json && match ){
								var obj = info;
								//obj[info.name] = info;
								//json["childs"].push(obj);
								//json[info.name] = obj;
								json.push(obj)
							}
						break;
						case "symbolicLink" :
							if (settings.followSymLink && depth-1 !== 0){
								arguments.callee.call(this, new nodefony.fileClass(info.path), result, settings.depth, settings, json);
							}
						break;
					}

					//
				}
			}
			return result;
		}catch(e){
			this.notificationsCenter.fire("onError",e);
			this.notificationsCenter.fire("onFinish",e,null);
			return ;	
		}
	};
	
	return finder;
});
