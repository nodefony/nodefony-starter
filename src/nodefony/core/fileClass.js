/*
 *
 *
 *
 *
 *
 */

var mime = require('mime');
var crypto = require('crypto');


nodefony.register("fileClass", function(){


	var findPath = function(str, Path, rec){
		//Path = Path.replace(" ","\ ");
		//str = str.replace(" ","\ ");
			//console.log( "Patern :" + str );
			//console.log( "Path Dir:" + Path);
		var res = regRelatif.exec(str);
		if (res){
			var nb = str.indexOf("/");
			//console.log("NB = " + nb)
			if (nb > 0){
				var ele = str.slice(nb+1);
				//console.log("SLICE = " + ele)
				//console.log("dirname = " + path.dirname(Path))
				return findPath(ele, path.dirname(Path) , true);
			}
		}else{
			var dirname  =  path.dirname(Path) ;
			if ( rec ){
				return dirname+"/"+str; 
			}
			res = regAbsolute.exec(str);
			if (res){
				return str;
			}
			return dirname+"/"+str;
		}
	};

	/*
 	 *
 	 *	CLASS File
 	 *
 	 *
 	 */
	var regRelatif = /^(\.\.\/)+/;
	var regAbsolute = /^\//;
	var File = function(Path){
		if (Path){
			this.stats =  fs.lstatSync(Path);
			this.type = this.checkType();	
			if ( this.stats.isSymbolicLink() ){
				var res = fs.readlinkSync( Path ) ;
				this.path = findPath(Path, res) ;
			}else{
				this.path = this.getRealpath(Path) ;	
			}
			this.name = path.basename(this.path);
			if (this.type === "File"){
				this.mimeType = this.getMimeType(this.name);
				this.encoding = this.getCharset();
			}
			this.dirName = this.dirname();
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
	};

	File.prototype.checkSum = function(type){
		if (! type ){
			var type = 'md5' ;
		}
		return crypto.createHash(type).update(this.content()).digest("hex") ; 
	};

	File.prototype.getMimeType = function(name){
		return  mime.lookup(name);
	};

	File.prototype.getCharset = function(mimeType){
		return mime.charsets.lookup(mimeType || this.mimeType  )
	};

	File.prototype.getRealpath = function(Path, cache){
		return  fs.realpathSync(Path, cache);
	};

	File.prototype.matchName = function(ele){
		 
		if (ele instanceof RegExp ){
			this.match = ele.exec(this.name);
			return this.match;
		}
		if (ele === this.name)
			return true;
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
		return type === this.type;
	};

	File.prototype.isFile = function(){
		return this.type === "File";
	};

	File.prototype.isDirectory = function(){
		return this.type === "Directory";
	};

	File.prototype.isSymbolicLink = function(){
		return this.type === "symbolicLink";
	};

	File.prototype.dirname = function(){
		return path.dirname(this.path);
	};

	var regHidden = /^\./;
	File.prototype.isHidden = function(){
		return regHidden.test(this.name);
	};

	File.prototype.content = function(encoding){
		var encode =  encoding ? encoding : ( this.encoding ?  this.encoding : 'utf8' ) ;
		if (this.type === "symbolicLink"){
			var path = fs.readlinkSync(this.path, encode);	
			return fs.readFileSync(this.dirName+"/"+path, encode);
		}
		return fs.readFileSync(this.path, encode);
	};

	File.prototype.read = File.prototype.content ;


	File.prototype.readByLine = function(callback, encoding){
		var res = this.content(encoding);
		var nb = 0 ;
		res.toString().split('\n').forEach(function(line){
			callback(line, ++nb );	
		})
	}

	var defautWriteOption = { 
		flags: 'w',
		defaultEncoding: 'utf8'
		//mode: 0o666
	};
	File.prototype.write = function(data, options) {
		return fs.writeFileSync( this.path, data, nodefony.extend({}, defautWriteOption ,options ) ) ;
	};

	File.prototype.move = function(target){
		try {
			fs.renameSync(this.path, target);
			return new File(target);
		}catch(e){
			throw e;
		}
	};

	File.prototype.unlink = function(){
		try {
			fs.unlinkSync(this.path);
		}catch(e){
			throw e;
		}
	};

	return File;

});

