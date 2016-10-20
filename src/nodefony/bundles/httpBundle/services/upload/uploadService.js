/*
 *
 *
 *
 *
 */
var shortId = require('shortid');
var Path = require('path') ;

nodefony.registerService("upload", function(){

	var uploadedFile = function(tmpName , path, dataFile, service){

		this.serviceUpload = service ;
		this.tmpName = tmpName ;
		this.headers = dataFile.headers ;
		this.raw = dataFile.data ;
		this.lenght = this.raw.length ;
		this.name = this.headers.name ;
		this.filename = this.headers.filename ;
		if( tmpName && path){
			this.mother = this.$super;
			this.mother.constructor(path);
		}
		this.error = null ;

	}.herite(nodefony.fileClass); 

	uploadedFile.prototype.move = function(target){
		try {
			if (fs.existsSync(target) ){
				var newFile = new nodefony.fileClass(target);
				if ( newFile.isDirectory() ){
					var inst = this.mother.move(target+"/"+this.headers.filename);
					//delete this.serviceUpload[this.tmpName];
					this.serviceUpload.logger("Move tmpFile : "+ this.tmpName +" in path : "+ target+"/"+this.headers.filename, "DEBUG");
					return inst ;
				}
			}
			var dirname = Path.dirname(target) ; 
			if ( fs.existsSync(dirname) ){
				var inst = this.mother.move(target);
				//delete this.serviceUpload[this.tmpName];
				this.serviceUpload.logger("Move tmpFile : "+ this.tmpName +" in path : "+ target, "DEBUG");
				return inst ;
			}else{
				throw fs.lstatSync(dirname);
			}
		}catch(e){
			this.error = e;
			throw e;
		}
	};

	uploadedFile.prototype.realName = function(){
		return this.headers.filename ;
	};

	uploadedFile.prototype.getMimeType = function(){
		return this.headers["Content-Type"] ;
	};

	var upload = function(httpKernel){
		this.httpKernel = httpKernel ;
		this.kernel = this.get("kernel");
		this.syslog = this.container.get("syslog");

		this.kernel.listen(this,"onBoot" , function(){
			this.config = this.container.getParameters("bundles.http").upload;
			if (/^\//.test(this.config.tmp_dir)){
				this.path = this.config.tmp_dir;
			}else{
				this.path = this.kernel.rootDir+"/"+this.config.tmp_dir;
			}
			var res = fs.existsSync(this.path);
			if (! res ){
				// create directory 
				this.logger("create directory FOR UPLOAD FILE " + this.path, "DEBUG")
				try {
					var res = fs.mkdirSync(this.path);
				}catch(e){
					throw e ;
				}
			}
		});
	};

	upload.prototype.createUploadFile = function(request, dataFile){
		if ( dataFile.data.length > this.config.max_filesize ){ 
			var uploadfile = new uploadedFile(null , null, dataFile, this);
			uploadfile.error = "File Upload size exceeded ,File "+ uploadfile.filename +" : "+ uploadfile.lenght+ " size must be less than " +this.config.max_filesize + " Bytes " ;
			return uploadfile ;
		}else{	
			return this.createTmpFile(request, dataFile);
		}
	}; 

	upload.prototype.createTmpFile = function(request, dataFile){
		// create tmp file
		//var path = this.path + "/" +queryFile.headers.name ;
		// Generate ID 
		var id = this.generateId()
		var name = id +"_"+dataFile.headers.filename ;
		var path =  this.path + "/" + name ;
		var res = fs.existsSync(path);
		if (! res ){
			// create tmp file  
			this.logger("ID : "+ id +" Create TMP FILE UPLOAD  " + path, "DEBUG");
			try {
				res = fs.writeFileSync(path, dataFile.data, {encoding: 'binary'});
			}catch(e){
				throw e ;
			}
		}else{
			throw e ;
		}
		//class upload 
		return new uploadedFile(name , path, dataFile, this);
		//this.uploadedFile[name] = inst ;
		//return inst ;

	};

	upload.prototype.logger = function(pci, severity, msgid,  msg){
		if (! msgid) msgid = "HTTP UPLOAD";
		return this.syslog.logger(pci, severity, msgid,  msg);
	}

	upload.prototype.generateId = function(){
		return shortId.generate();
	};

	return  upload ;
});
