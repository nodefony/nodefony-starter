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

	var Session = function(name, id, context, settings){
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

	Session.prototype.migrate = function(name, id){
	
	};

	Session.prototype.invalidate = function(name, id){
	
	};

	Session.prototype.setCookieSession = function(context){
		var cookie = new nodefony.cookies.cookie(this.sessionName, this.id, this.settings.cookie);
		context.setCookie(cookie);
		return cookie ;
	};

	//Attributes
	Session.prototype.set = function(){
	
	};

	Session.prototype.get = function(){
	
	};

	Session.prototype.has = function(){
	
	};

	Session.prototype.replace = function(){
	
	};

	Session.prototype.remove = function(){
	
	};

	Session.prototype.clear = function(){
	
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
			this.defaultSessionName = this.setName(this.settings.name) ;
			var storage =  eval("nodefony."+this.settings.handler) ;
			if (storage){
				this.storage = new storage(this) ;
			}else{
				this.storage = null ;
			}
		}.bind(this));
	};


	SessionsManager.prototype.logger = function(pci, severity, msgid,  msg){
		var syslog = this.container.get("syslog");
		if (! msgid) msgid = "SERVICE SESSIONS";
		return syslog.logger(pci, severity || "DEBUG", msgid,  msg);
	};
	
	SessionsManager.prototype.start = function(context){
		var id = cookiesParser(context, this.defaultSessionName);
		if (!id){
			var session = this.setSession(this.defaultSessionName, context);
			context.session = session ;
			return session ;
		}else{
			var session = this.getSession(this.defaultSessionName, id) ;
			if (session){
				//isValidSession ?
				context.session = session ;
				return session ;
			}else{
				context.session = null;
				return null;
			}
		}
	};

	SessionsManager.prototype.generateId = function(){
		var hex = Math.floor(Math.random()*167772150000000).toString(16);
		var md5 = crypto.createHash('md5').update("nodefony:"+hex).digest("hex");
		return md5;
	};

	SessionsManager.prototype.getSession = function(name, id){
		if (id in this.sessions[name]){
			return this.sessions[name][id];
		}else{
			return null ;
		}
	};
	
	SessionsManager.prototype.pushSession = function(name, id, session){
		var index = this.sessions[name].push(session);
		this.sessions[name][id] = this.sessions[name][index-1];
		this.logger("CREATE SESSION ID : " + id ,"INFO")
		return session ;
	};

	SessionsManager.prototype.setSession = function(name, context){
		var id  = this.generateId();
		var session = this.pushSession(name, id, new Session(name , id, context, this.settings));
		if (this.storage)
			this.storage.saveSession(id, JSON.stringify( this.sessions[name][id]));
		return session;
	};

	SessionsManager.prototype.getName = function(name){
		return this.sessions[name] ;
	};

	SessionsManager.prototype.setName = function(name){
		this.sessions[name] = [];
		return name ;
	};

	return SessionsManager;
});
