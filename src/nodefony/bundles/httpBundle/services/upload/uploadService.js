/*
 *
 *
 *
 *
 */
var shortId = require('shortid');

nodefony.registerService("upload", function(){

	var uploadedFile =  class uploadedFile extends nodefony.fileClass { 

		constructor (tmpName, myPath, dataFile, service) {

			super( myPath );
			this.serviceUpload = service ;
			this.tmpName = tmpName ;
			this.headers = dataFile.headers ;
			this.mimeType = this.getMimeType( this.name );
			this.raw = dataFile.data ;
			this.lenght = this.raw.length ;
			this.name = this.headers.name ;
			this.filename = this.headers.filename ;
			this.error = null ;
		} 

		move (target){
			var inst = null ;
			try {
				if (fs.existsSync(target) ){
					var newFile = new nodefony.fileClass(target);
					if ( newFile.isDirectory() ){
						inst = super.move(target+"/"+this.headers.filename);
						//delete this.serviceUpload[this.tmpName];
						this.serviceUpload.logger("Move tmpFile : "+ this.tmpName +" in path : "+ target+"/"+this.headers.filename, "DEBUG");
						return inst ;
					}
				}
				var dirname = path.dirname(target) ; 
				if ( fs.existsSync(dirname) ){
					inst = super.move(target);
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
		}

		realName (){
			return this.headers.filename ;
		}

		getMimeType (){
			if ( this.headers ) {
				return this.headers["Content-Type"] ;
			}else{
				return super.getMimeType( this.name );
			}
		}
	};

	var upload = class upload  extends nodefony.Service {
		 
		constructor( httpKernel ) {

			super( "upload", httpKernel.container, httpKernel.notificationsCenter );

			this.httpKernel = httpKernel ;
			this.kernel = this.httpKernel.kernel ;
			//this.syslog = this.container.get("syslog");

			this.listen(this,"onBoot" , () => {
				this.config = this.container.getParameters("bundles.http").upload;
				if (/^\//.test(this.config.tmp_dir)){
					this.path = this.config.tmp_dir;
				}else{
					this.path = this.kernel.rootDir+"/"+this.config.tmp_dir;
				}
				var res = fs.existsSync(this.path);
				if (! res ){
					// create directory 
					this.logger("create directory FOR UPLOAD FILE " + this.path, "DEBUG");
					try {
						res = fs.mkdirSync(this.path);
					}catch(e){
						throw e ;
					}
				}
			});
		}

		createUploadFile (request, dataFile){

			if ( dataFile.data.length > this.config.max_filesize ){ 
				var uploadfile = new uploadedFile(null , null, dataFile, this);
				uploadfile.error = "File Upload size exceeded ,File "+ uploadfile.filename +" : "+ uploadfile.lenght+ " size must be less than " +this.config.max_filesize + " Bytes " ;
				return uploadfile ;
			}else{	
				return this.createTmpFile(request, dataFile);
			}
		} 

		createTmpFile (request, dataFile){
			// create tmp file
			//var path = this.path + "/" +queryFile.headers.name ;
			// Generate ID 
			var id = this.generateId();
			var name = id +"_"+dataFile.headers.filename ;
			var myPath =  this.path + "/" + name ;
			var res = fs.existsSync(myPath);
			if (! res ){
				// create tmp file  
				this.logger("ID : "+ id +" Create TMP FILE UPLOAD  " + myPath, "DEBUG");
				try {
					res = fs.writeFileSync(myPath, dataFile.data, {encoding: 'binary'});
				}catch(e){
					throw e ;
				}
			}else{
				throw new Error(myPath +' not exist') ;
			}
			return new uploadedFile(name , myPath, dataFile, this);
		}

		logger (pci, severity, msgid,  msg){
			if (! msgid) {msgid = "HTTP UPLOAD";}
			return this.syslog.logger(pci, severity, msgid,  msg);
		}

		generateId (){
			return shortId.generate();
		}
	};

	return  upload ;
});
