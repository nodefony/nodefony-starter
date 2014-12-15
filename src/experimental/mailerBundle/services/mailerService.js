/*
 *
 *
 *<link href="/home/bgg/git/wef/web/public/demoBundle/css/email-style.css" rel="Stylesheet" type="text/css" />
 *<link href="http://localhost:5151/demoBundle/css/email-style.css" rel="Stylesheet" type="text/css" />
 *
 */

var nodeMailer = require("nodemailer");

nodefony.registerService("mailer", function(){
	
	var settingsSyslog = {
		//rateLimit: 100,
		//burstLimit: 10,
		moduleName: "MAILER",
		defaultSeverity: "WARNING"
	};
	
	var tabCss = [];
	
	var mailerTools = {
		
		juice: function(html, callback){
			var reg = new RegExp("<link.*?href=\"(.*?)\".*?>", "gmi");
			var css;
			while(css = reg.exec(html)){
				tabCss.push(css[1]);
			}
			
			this.loadCss(html, callback);
		},
		
		loadCss: function(html, callback){
			if(tabCss.length > 0){
				if(! /^(http|https)/.test(tabCss[0])){
					fs.readFile(tabCss[0].replace('file://', ''), {encoding: 'utf8'}, function(err, cssContent){
						try{
						html = juice.inlineContent(html, cssContent);
						} catch(e){
							this.logger(tabCss[0].replace('file://', '') + " NOT FOUND");
						}
						tabCss.shift();
						this.loadCss(html, callback);
						
					}.bind(this));
				} else {
					
					var parsedUrl = url.parse(tabCss[0]);
					
					var req = http.request({host: parsedUrl.hostname, port: parsedUrl.port, path: parsedUrl.path}, function(res){
						res.setEncoding('utf8');
						res.on('data', function(cssContent){
							try{
								html = juice.inlineContent(html, cssContent);
							} catch(e){
								this.logger(parsedUrl + " NOT FOUND");
							}	
							tabCss.shift();
							this.loadCss(html, callback);
						}.bind(this));
						
						
					}.bind(this));
					
					req.end();
				}
			} else {
				callback( html );
			}
		}
		
	};
	
	var Mailer = function(container, kernel){
			
		this.container = container;
		this.kernel = kernel;
		this.notificationsCenter = this.container.get("notificationsCenter");
		this.settings = this.container.getParameters('bundles.mailer').mailer;
		this.syslog = this.initializeLog();
		this.name = "MailerService";
		mailerTools.logger = this.logger.bind(this);
	};
	
	Mailer.prototype.logger = function(pci, severity, msgid,  msg){
		if (! msgid) msgid = "SERVICE " + this.name;
		return this.syslog.logger(pci, severity, msgid,  msg);
	};
	
	Mailer.prototype.initializeLog = function(){
		
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
	
	Mailer.prototype.getNotificationsCenter = function(){
		return this.notificationsCenter;
	};
	
	Mailer.prototype.getEventNames = function(){
		return "[ EMAIL_SENDED , EMAIL_ERROR_SENDING ]";
	};
	
	Mailer.prototype.listen = function(){
		return this.notificationsCenter.listen.apply(this.notificationsCenter, arguments);
	};
	
	Mailer.prototype.send = function(mail){
		
		var currentMail = nodefony.extend(true, {}, mail);
		var settings = nodefony.extend(true, {}, this.settings);
		
		if(currentMail.from == ''){
			currentMail.setFrom(this.settings.auth.user);
		}
		
		if(this.settings.envelope){
			if(this.settings.auth.user){
				currentMail.setEnveloppe(currentMail.from, currentMail.to);
				delete settings.auth;
			} else {
				this.logger("You have to add auth.user param in your config for the mailerBundle");
			}
		}
		
		var transport = nodeMailer.createTransport(settings.type, settings);
		
		mailerTools.juice(currentMail.html, function(html){
			
			currentMail.setHtml(html);
		
			transport.sendMail(currentMail, function(error, responseStatus){
				
			    if(!error){
			        this.notificationsCenter.fire('EMAIL_SENDED', responseStatus.message, responseStatus.messageId, currentMail);
			    } else {
			    	this.logger(error, "WARNING");
			    	this.notificationsCenter.fire('EMAIL_ERROR_SENDING', error, currentMail);
			    }
			}.bind(this));
		}.bind(this));
		
	};
	
	return Mailer;
});
