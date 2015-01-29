/*
 * New node file
 */


nodefony.registerService("sessions", function(){


	/*
 	 *
 	 *	CLASS SESSION
 	 */
	var settingsSession = {
	
	};

	/*var Session = function(name, id, context, settings){
		if (typeof name  === "object" ){
			this.container = this.$super ;
			this.$super.constructor(name.services, name.parameters);
			this.settings = name.settings ;
			this.id = name.id ;
			this.referer = name.referer;
			this.userAgent= name.userAgent;
			this.dateCreation = name.dateCreation;
			this.sessionName = name.sessionName ;
			this.cookieSession = new nodefony.cookies.cookie(name.cookieSession) ;
		}else{
			this.container = this.$super ;
			this.$super.constructor();
			this.settings = nodefony.extend({}, settingsSession, settings);
			this.id = id ;
			var date = Date.now() ;
			this.setParameters("session.created", date );
			this.setParameters("session.lastUsed", date);
			this.setParameters("session.referer",  context.request.remoteAdress);
			this.setParameters("session.userAgent",  context.request.request.headers["user-agent"]);
			this.sessionName = name ;
			this.cookieSession = this.setCookieSession(context) ;
		}
	}.herite(nodefony.Container);

	Session.prototype.logger = function(pci, severity, msgid, msg){
		var syslog = this.container.get("syslog");
		if (! msgid) msgid = "SESSIONS "+this.id+" :";
		return syslog.logger(pci, severity || "DEBUG", msgid,  msg);
	};

	
	Session.prototype.setCookieSession = function(context){
		var cookie = new nodefony.cookies.cookie(this.sessionName, this.id, this.settings.cookie);
		context.setCookie(cookie);
		return cookie ;
	};

	*/


	var Session = function(name, settings, storage ){
		this.name = name ;
		this.settings = settings ;
		this.storage = storage ;	
		this.mother = this.$super;
		this.mother.constructor();
	}.herite(nodefony.Container);

	Session.prototype.start = function(context){
		var cookie = cookiesParser(context, this.name)
		if (cookie){
			this.id = cookie.value;
			this.cookieSession = new nodefony.cookies.cookie(cookie);
		}else{
			this.id  = this.generateId(context);
			this.cookieSession = this.setCookieSession(context) ;
		}
		this.storage.start(this);
		return this ;
	};

	Session.prototype.setCookieSession = function(context){
		this.settings.cookie["maxAge"] = this.settings.cookie_lifetime ;
		var cookie = new nodefony.cookies.cookie(this.name, this.id, this.settings.cookie);
		context.setCookie(cookie);
		return cookie ;
	};

	Session.prototype.serialize = function(){
		return JSON.stringify( this.services );		
	};

	Session.prototype.deSerialize = function(obj){
		for (var attr in obj)
			this.set(attr, obj[attr]);	
	};

	Session.prototype.replace = function(){
	
	};

	Session.prototype.remove = function(){
		return this.storage.destroy(this);	
	};

	Session.prototype.clear = function(){
		this.services = null ;
		this.services = new this.protoService();
	};

	Session.prototype.count = function(){
	
	};

	Session.prototype.invalidate = function(){
	
	};

	Session.prototype.migrate = function(){
	
	};

	Session.prototype.setId = function(){
	
	};

	Session.prototype.getId = function(){
	
	};

	Session.prototype.save = function(){
		return this.storage.write(this.id, this.serialize());	
	};

	Session.prototype.getName = function(){
		return this.name ;	
	};

	Session.prototype.setName = function(){
	
	};

	Session.prototype.generateId = function(context){
		var ip = context.remoteAddress ;
		var date = new Date().getTime();
		var concat = ip + date + this.randomValueHex(16) + Math.random() * 10 ;
		switch(this.settings.hash_function){
			case "md5":
				var hash = crypto.createHash('md5');
			break;
			case "sha1":
				var hash = crypto.createHash('sha1');
			break;
			default:
				var hash = crypto.createHash('md5');	
		}
		return hash.update(concat).digest("hex");
	};

	Session.prototype.randomValueHex = function(len) {
		return crypto.randomBytes(Math.ceil(len/2))
			.toString('hex') // convert to hexadecimal format
			.slice(0,len);   // return required number of characters
	};
	
	/*
 	 *
 	 *	SERVICE MANAGER SESSIONS
 	 *
 	 *
 	 */
	var cookiesParser = function(context, name){
		if (context.cookies[name] ){
			return context.cookies[name];
		}
		return null;
	};

	var SessionsManager = function(security, httpKernel){
		this.httpKernel = httpKernel;
		this.firewall = security ; 
		this.sessions = {};
		this.kernel = httpKernel.kernel;
		this.kernel.listen(this, "onBoot",function(){
			this.settings = this.container.getParameters("bundles.http").session;
			this.defaultSessionName = this.settings.name ;
			var storage =  eval("nodefony."+this.settings.handler) ;
			if (storage){
				this.storage = new storage(this) ;
			}else{
				this.storage = null ;
			}
		}.bind(this));
		this.kernel.listen(this, "onHttpRequest", function(container, context, type){
			var request = context.request.request ;
			request.on('end', function(){
				if ( this.settings.start === "autostart" )
					context.session = this.start(context);
			}.bind(this))
		}.bind(this));
	};

	SessionsManager.prototype.logger = function(pci, severity, msgid,  msg){
		var syslog = this.container.get("syslog");
		if (! msgid) msgid = "SERVICE SESSIONS";
		return syslog.logger(pci, severity || "DEBUG", msgid,  msg);
	};
	
	SessionsManager.prototype.start = function(context){
		var session = this.createSession(this.defaultSessionName, this.settings );
		var ret = session.start(context) ;
		if ( this.probaGarbage() ){
			this.storage.gc(this.settings.cookie_lifetime);	
		}
		return ret; 
	};
	
	SessionsManager.prototype.createSession = function(name, settings){
		return new Session(name, settings, this.storage);
	};

	SessionsManager.prototype.probaGarbage = function(){
		var proba = parseInt( this.settings.gc_probability, 10 ) ;
		var divisor = parseInt( this.settings.gc_divisor, 10 ) ;
		if (proba > 0){
			var rand = Math.random() ;
			var random = parseInt( divisor * ( rand === 1 ? Math.random() :  rand ) , 10 ) ; 
			if (random < proba ){
				return true
			}
		}
		return false ;
	};

	return SessionsManager;
});
