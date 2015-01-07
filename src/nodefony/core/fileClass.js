


nodefony.register("fileClass", function(){

	/*
 	 *
 	 *	CLASS File
 	 *
 	 *
 	 */
	var File = function(Path){
		if (Path){
			this.name = path.basename(Path);
			this.path = this.getRealpath(Path);
			this.dirName = this.dirname();
			this.stats =  fs.lstatSync(Path);
			this.type = this.checkType();	
			this.match = null;
		}else{
			throw new Error("error fileClass : "+ Path)
		}
	};

	File.prototype.checkType = function(){
		if ( this.stats.isDirectory() ){
			return "Directory";
		}
		if ( this.stats.isFile() ){
			return "File";
		}
		if ( this.stats.isBlockDevice() ){
			return "BlockDevice";
		}
		if ( this.stats.isCharacterDevice() ){
			return "CharacterDevice";
		}
		if ( this.stats.isSymbolicLink() ){
			return "symbolicLink";
		}
		if ( this.stats.isFIFO() ){
			return "Fifo";
		}
		if ( this.stats.isSocket() ){
			return "Socket";
		}
		return ;
	}

	File.prototype.getRealpath = function(Path, cache){
		return  fs.realpathSync(Path, cache);
	};

	File.prototype.matchName = function(ele){
		 
		if (ele instanceof RegExp ){
			this.match = ele.exec(this.name)
			return this.match;
		}
		if (ele === this.name)
			return true
		return false;
	};

	File.prototype.getExtention = function(){
		if ( this.isFile ){
			var tab = this.name.split('.');
			if (tab.length > 1) return tab.reverse()[0];
		}
		return null ; 
	};


	File.prototype.matchType = function(type){
		return type === this.type
	};

	File.prototype.isFile = function(){
		return this.type === "File"
	};

	File.prototype.isDirectory = function(){
		return this.type === "Directory"
	};

	File.prototype.dirname = function(){
		return path.dirname(this.path);
	};

	var regHidden = /^\./;
	File.prototype.isHidden = function(){
		return regHidden.test(this.name);
	};


	File.prototype.content = function(){
		return fs.readFileSync(this.path, {encoding: 'utf8'});
	};

	File.prototype.move = function(target){
		try {
			fs.renameSync(this.path, target);
			return new File(target);
		}catch(e){
			throw e
		}
	};

	return File;

});

