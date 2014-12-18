/*
 *
 *
 *
 *
 *
 */
nodefony.register.call(nodefony.io, "UploadedFile",function(){

	// FIXME add to config 
	var directoryUpload = "/tmp/upload" ;


	var upload = function(file, container){
		this.container = container ;
		this.mother = this.$super;
		this.syslog = 	this.container.get("syslog");
		this.path = container.get("kernel").rootDir+directoryUpload;
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

		//this.mother.constructor(path);
		//console.log(this)	

	}.herite(nodefony.fileClass);


	upload.prototype.logger = function(pci, severity, msgid,  msg){
		if (! msgid) msgid = "HTTP UPLOAD";
		return this.syslog.logger(pci, severity, msgid,  msg);
	}

	return upload ;


})
