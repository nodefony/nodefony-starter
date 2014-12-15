

nodefony.register("mailerAttachment", function(){	
	
	
	var settingsSyslog = {
		//rateLimit: 100,
		//burstLimit: 10,
		moduleName: "MAILER-ATTACHMENT",
		defaultSeverity: "WARNING"
	};
	
	var MailerAttachment = function(data, fileName, contentType){
		
		if(data){
			this.contents = data;
			this.fileName = fileName || '';
			this.contentType = contentType || '';
		}
		/*this.filePath = '';
		this.streamSource = '';*/
		this.cid = '';
		this.contentDisposition = 'attachment';
		this.syslog = this.initializeLog();
		this.name = "MailerAttachment";
	};
	
	MailerAttachment.prototype.logger = function(pci, severity, msgid,  msg){
		if (! msgid) msgid = "CLASS MailerAttachment";
		return this.syslog.logger(pci, severity, msgid,  msg);
	};
	
	MailerAttachment.prototype.initializeLog = function(){
		
		var red, blue, green, reset;
		red   = '\033[31m';
		blue  = '\033[34m';
		green = '\033[32m';
		reset = '\033[0m';
		
		var syslog =  new nodefony.syslog(settingsSyslog);
		// CRITIC ERROR
		syslog.listenWithConditions(this,{
			severity:{
				data:"WARNING,CRITIC,ERROR"
			}		
		},function(pdu){
			console.error( red + pdu.severityName +" SYSLOG "+this.name +reset +" "+pdu.msgid + " "+new Date(pdu.timeStamp) + " " + pdu.msg+" : "+ util.inspect( pdu.payload));	
		});
		// INFO DEBUG
		var data ;
		this.debug ? data = "INFO,DEBUG" : data = "INFO" ;
		syslog.listenWithConditions(this,{
			severity:{
				data:data
			}		
		},function(pdu){
			//console.log( blue + pdu.severityName +" SYSLOG " +reset + pdu.msgid + " "+new Date(pdu.timeStamp) + " " + pdu.msg+" : "+ util.inspect( pdu.payload));	
			console.log( blue + pdu.severityName +" SYSLOG "+this.name +reset +" "+ pdu.msgid + " "+new Date(pdu.timeStamp) + " " + pdu.msg+" : "+ pdu.payload);	
		});
		return syslog;
	};
	
	MailerAttachment.prototype.setId = function(id){
		if(id) this.cid = id;
		return this;
	};
	
	MailerAttachment.prototype.getId = function(){
		return this.cid;
	};
	
	MailerAttachment.prototype.setContentType = function(contentType){
		if(contentType) this.contentType = contentType;
		return this;
	};
	
	MailerAttachment.prototype.setDisposition = function(contentDisposition){
		if(contentDisposition && ['inline', 'attachment'].indexOf(contentDisposition) >= 0){
			this.contentDisposition = contentDisposition;
		} else {
			this.logger("Attachment content disposition must be \"inline\" or \"attachment\"");
		}
		return this;
	};
	
	var fromPath = function(path){
		var currentAttachment = new MailerAttachment();
		currentAttachment.filePath = path;
		return currentAttachment;
	};
	
	return {
		newInstance: function(data, fileName, contentType){
			return new MailerAttachment(data, fileName, contentType);
		},
		fromPath: fromPath
	}
	
});
