
var juice = require("juice");
//fs = require("fs"),
//http = require("http"),
//url = require('url');

nodefony.register("mailerMessage", function(){
	
	/**
	 * Configuration for nodefony.syslog instance
	 * 
	 * @attribute settingsSyslog
	 * @readOnly
	 */
	var settingsSyslog = {
		//rateLimit: 100,
		//burstLimit: 10,
		moduleName: "MAILER-MESSAGE",
		defaultSeverity: "WARNING"
	};
	
	/**
	 * Function uniqid : Generate an unique id 
	 * @method uniqid
	 * 
	 * @private
	 */
	var uniqid = function (prefix, more_entropy) {

		if (typeof prefix === 'undefined') {prefix = "";}
		
		var retId;
		var formatSeed = function (seed, reqWidth) {
			seed = parseInt(seed, 10).toString(16);
			if (reqWidth < seed.length) {
				return seed.slice(seed.length - reqWidth);
			}
			if (reqWidth > seed.length) { 
				return Array(1 + (reqWidth - seed.length)).join('0') + seed;
			}
			return seed;
		};
		
		if (!uniqidSeed) {
			var uniqidSeed = Math.floor(Math.random() * 0x75bcd15);
		}
		uniqidSeed++;

		retId = prefix;
		retId += formatSeed(parseInt(new Date().getTime() / 1000, 10), 8);
		retId += formatSeed(uniqidSeed, 5);
		if (more_entropy) {
			retId += (Math.random() * 10).toFixed(8).toString();
		}

		return retId;
	};
	
	/**
	 * Function emailValidation : Validate an email with a regexp
	 * @method emailValidation
	 * @private
	 */
	var emailValidation = function(email){
		return (new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")).test(email);
	};
	
	/**
	 * Function addRecipient : Format a recipient with the name and the mail
	 * @method addRecipient
	 * @private
	 */
	var addRecipient = function(dest){
		var cond = emailValidation.call(this, (arguments[2] ? arguments[2] : arguments[1]));
		if(!cond){
			this.logger('Email : ' + (arguments[2] ? arguments[2] : arguments[1]) + ' not valid');
		}
		this[dest] += (this[dest] == '' ? '' : ', ') + (arguments[2] ? arguments[1] + '<' + arguments[2] + '>' : arguments[1]);
	};
	
	/**
	 * A class to build the message content to be sent by email
	 * 
	 * @class MailerMessage
	 * @constructor
	 * 
	 * @example
	 * 		var message = new nodefony.mailerMessage();
	 * 		message
	 * 		.setTo( 'benoit.gimmig@nodefony.com' )
	 *		.setSubject( 'THE SUBJECT .... ' )
	 *		.setText( 'THIS IS A TEXT ..... ' )
	 *		.setHtml( 'THIS IS AN HTML TEXT ..... ' );
	 */
	var MailerMessage = function(){
		
		this.from = '';
		this.to = '';
		this.cc = '';
		this.bcc = '';
		this.replyTo = '';
		this.inReplyTo = '';
		this.references = '';
		this.subject = '';
		this.text = '';
		this.html = '';
		this.generateTextFromHTML = false;
		this.headers = {};
		this.attachments = [];
		this.alternatives = [];
		this.envelope = {};
		this.messageId = '';
		this.date = (new Date()).toUTCString();
		this.encoding = 'quoted-printable';
		this.charset = 'utf-8';
		this.dsn = '';
		this.syslog = this.initializeLog();
		this.name = "MailerMessage";
	};
	
	/**
	 * Output log
	 * 
	 * @method logger
	 * @param {void} payload payload for log. protocole controle information
 	 * @param {Number || String} severity severity syslog like.
 	 * @param {String} msgid informations for message. example(Name of function for debug)
 	 * @param {String} msg  message to add in log. example (I18N)
	 */
	MailerMessage.prototype.logger = function(pci, severity, msgid,  msg){
		if (! msgid) msgid = "CLASS MailerMessage";
		return this.syslog.logger(pci, severity, msgid,  msg);
	};
	
	MailerMessage.prototype.initializeLog = function(){
		
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
	
	/**
	 * Set the email address of the sender
	 * 
	 * @method setFrom
	 * @chainable
	 * @param {String} [name]
	 * @param {String} email
	 */
	MailerMessage.prototype.setFrom = function(name, email){
		Array.prototype.unshift.call(arguments, 'from');
		addRecipient.apply(this, arguments);
		return this;
	};
	
	/**
	 * Set the recipient email address
	 * 
	 * @method setTo
	 * @chainable
	 * @param {String} [name]
	 * @param {String} email
	 */
	MailerMessage.prototype.setTo = function(name, email){
		Array.prototype.unshift.call(arguments, 'to');
		addRecipient.apply(this, arguments);
		return this;
	};
	
	/**
	 * Set carbon copy
	 * 
	 * @method addCc
	 * @chainable
	 * @param {String} [name]
	 * @param {String} email
	 */
	MailerMessage.prototype.addCc = function(name, email){
		Array.prototype.unshift.call(arguments, 'cc');
		addRecipient.apply(this, arguments);
		return this;
	};
	
	/**
	 * Set blind carbon copy
	 * 
	 * @method addBcc
	 * @chainable
	 * @param {String} [name]
	 * @param {String} email
	 */
	MailerMessage.prototype.addBcc = function(name, email){
		Array.prototype.unshift.call(arguments, 'bcc');
		addRecipient.apply(this, arguments);
		return this;
	};
	
	/**
	 * Set the subject email
	 * 
	 * @method	setSubject
	 * @chainable
	 * @param {String} subject
	 */
	MailerMessage.prototype.setSubject = function(subject){
		this.subject = subject;
		return this;
	};
	
	/**
	 * Set the text content of the message
	 * 
	 * @method	setText
	 * @chainable
	 * @param {String} text
	 */
	MailerMessage.prototype.setText = function(text){
		this.text = text;
		return this;
	};
	
	/**
	 * Set the html content of the message
	 * 
	 * @method	setHtml
	 * @chainable
	 * @param {String} html
	 */
	MailerMessage.prototype.setHtml = function(html){
		this.html = html;
		return this;
	};
	
	/**
	 * Used to generate the text of the email with the html part
	 * 
	 * @method	setGenerateTextFromHTML
	 * @chainable
	 * @param {Boolean} bool
	 */
	MailerMessage.prototype.setGenerateTextFromHTML = function(bool){
		this.generateTextFromHTML = !!bool;
		return this;
	};
	
	/**
	 * Used to generate the enveloppe of the message
	 * 
	 * @method	setEnveloppe
	 * @chainable
	 * @param {String} from
	 * @param {String} to
	 */
	MailerMessage.prototype.setEnveloppe = function(from, to){
		if(!from || !to){
			this.logger('mailerMessage.setEnveloppe : argument from or to missing');
		}
		
		if(!emailValidation.call(this, from)){
			this.logger('mailerMessage.setEnveloppe : Email from (' + from + ') is not valid');
		}
		
		if(!emailValidation.call(this, to)){
			this.logger('mailerMessage.setEnveloppe : Email to (' + to + ') is not valid');
		}
		
		this.envelope = {
			from: from,
			to: to
		}
		return this;
	};
	
	/**
	 * Add specific email headers 
	 * 
	 * @method	addHeaders
	 * @chainable
	 * @param {Object} headers
	 * @example
	 * 		message.addHeaders({'X-UNIQ-ID': 123456789, 'X-MAILING-CAMPAIGN': 'TEST'})
	 */
	MailerMessage.prototype.addHeaders = function(headers){
		this.headers = nodefony.extend(false, this.headers, headers);
		return this;
	};
	
	/**
	 * Set the priority of the message
	 * 
	 * @method	setpriority
	 * @chainable
	 * @param {Number} nb Priority values can be 1 to 5. 1 Highest, 5 lowest
	 */
	MailerMessage.prototype.setpriority = function(nb){
		
		var priorityMap = {
            1: 'Highest',
            2: 'High',
            3: 'Normal',
            4: 'Low',
            5: 'Lowest'
		};
		
		if(nb in priorityMap){
			//this.headers['X-Priority'] = nb + ' (' + priorityMap[nb] + ')';
			this.addHeaders({
				'X-Priority': nb + ' (' + priorityMap[nb] + ')',
				'X-MSMail-Priority': priorityMap[nb == 1 ? 2 : nb],
				'Importance': priorityMap[nb == 1 ? 2 : nb]
			});
		} else {
			this.logger("SET PRIORITY " + nb + " doesn't exist");
		}
		
		return this;
	};
	
	/**
	 * Add an attachment object 
	 * 
	 * @method	attach
	 * @chainable
	 * @param {mailerAttachment} attachment
	 */
	MailerMessage.prototype.attach = function(attachment){
		this.attachments.push(attachment);
		return this;
	};
	
	/**
	 * Remove an attachment
	 * 
	 * @method detach
	 * @chainable
	 * @param {mailerAttachment} attachment
	 */
	MailerMessage.prototype.detach = function(attachment){
		for(var i = 0; i < this.attachments.length; i++){
			if(this.attachments[i] == attachment){
				this.attachments.splice(i, 1);
				break;
			}
		}
		return this;
	};
	
	/**
	 * Add an alternative part in the content of the message
	 * 
	 * @method addPart
	 * @chainable
	 * @param {Object} alternative
	 */
	MailerMessage.prototype.addPart = function(alternative){
		this.alternatives.push(alternative);
		return this;
	};
	
	/**
	 * Attach an image and set her disposition inline
	 * 
	 * @method embed
	 * @param {Object} entity
	 * @return {String} A String with cid and an unique id
	 */
	MailerMessage.prototype.embed = function(entity){
		
		if(entity.setDisposition){
			entity.setDisposition('inline');
		}
		
		this.attach(entity);
		
		if(entity.getId && entity.setId && entity.getId() != ''){
			var uniq = entity.getId();
		} else {
			var uniq = uniqid();
		}
		//console.log('CID : ' + uniq);
		entity.setId(uniq);
		
		return 'cid:' + uniq;
	};
	
	return MailerMessage;
	
});
