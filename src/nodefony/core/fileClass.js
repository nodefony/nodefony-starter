/*
 *
 *
 *
 *
 *
 */
const mime = require('mime');
const crypto = require('crypto');
//var fs = require("fs");
//var path = require("path");

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

	var regHidden = /^\./;

	var defautWriteOption = { 
		flags: 'w',
		defaultEncoding: 'utf8'
		//mode: 0o666
	};


	/*
 	 *
 	 *	CLASS File
 	 *
 	 *
 	 */
	var regRelatif = /^(\.\.\/)+/;
	var regAbsolute = /^\//;

	var File = class File {
		constructor(Path){
			if (Path){
				this.stats =  fs.lstatSync(Path);
				this.type = this.checkType();	
				if ( this.stats.isSymbolicLink() ){
					var res = fs.readlinkSync( Path ) ;
					this.path = findPath(Path, res) ;
				}else{
					this.path = this.getRealpath(Path) ;	
				}
				this.parse = path.parse(this.path);
				this.name = this.parse.name+this.parse.ext;
				this.ext = this.parse.ext;
				this.shortName = this.parse.name ;
				if (this.type === "File"){
					this.mimeType = this.getMimeType(this.name);
					this.encoding = this.getCharset();
				}
				this.dirName = this.parse.dir;
				this.match = null;
			}else{
				throw new Error("error fileClass : "+ Path);
			}
		}

		checkType (){
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

		checkSum (type){
			if (! type ){
				type = 'md5' ;
			}
			return crypto.createHash(type).update(this.content()).digest("hex") ; 
		}

		getMimeType (name){
			return  mime.lookup(name);
		}

		getCharset (mimeType){
			return mime.charsets.lookup(mimeType || this.mimeType );
		}

		getRealpath (Path, cache){
			return  fs.realpathSync(Path, cache);
		}

		matchName (ele){
		 	
			if (ele instanceof RegExp ){
				this.match = ele.exec(this.name);
				return this.match;
			}
			if (ele === this.name){
				return true;
			}
			return false;
		}

		getExtention (){
			if ( this.isFile ){
				var tab = this.name.split('.');
				if (tab.length > 1) { return tab.reverse()[0]; }
			}
			return null ; 
		}

		matchType (type){
			return type === this.type;
		}

		isFile (){
			return this.type === "File";
		}

		isDirectory (){
			return this.type === "Directory";
		}

		isSymbolicLink (){
			return this.type === "symbolicLink";
		}

		dirname (){
			return path.dirname(this.path);
		}

		isHidden (){
			return regHidden.test(this.name);
		}

		content (encoding){
			var encode =  encoding ? encoding : ( this.encoding ?  this.encoding : 'utf8' ) ;
			if (this.type === "symbolicLink"){
				var path = fs.readlinkSync(this.path, encode);	
				return fs.readFileSync(path, encode);
			}
			return fs.readFileSync(this.path, encode);
		}

		read (encoding){
			var encode =  encoding ? encoding : ( this.encoding ?  this.encoding : 'utf8' ) ;
			if (this.type === "symbolicLink"){
				var path = fs.readlinkSync(this.path, encode);	
				return fs.readFileSync(path, encode);
			}
			return fs.readFileSync(this.path, encode);
		}

		readByLine (callback, encoding){
			var res = this.content(encoding);
			var nb = 0 ;
			res.toString().split('\n').forEach(function(line){
				callback(line, ++nb );	
			});
		}
		
		write (data, options) {
			return fs.writeFileSync( this.path, data, nodefony.extend({}, defautWriteOption ,options ) ) ;
		}

		move (target){
			try {
				fs.renameSync(this.path, target);
				return new File(target);
			}catch(e){
				throw e;
			}
		}

		unlink (){
			try {
				fs.unlinkSync(this.path);
			}catch(e){
				throw e;
			}
		}
	};

	return File;

});

