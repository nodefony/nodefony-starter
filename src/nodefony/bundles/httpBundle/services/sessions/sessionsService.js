/*
 * New node file
 */


nodefony.registerService("sessions", function(){



	var garbageCollector = function(sessions, settings){
	
	
	};


	//TODO deplace  in repo with other sessionStorage
	/*
 	 *	Session storage files
 	 *
 	 */
	
	var fileSessionStorage = function(manager){
		this.manager = manager ;
		this.path = manager.settings.save_path;
		var res = fs.existsSync(this.path);
		if (! res ){
			// create directory sessions
			manager.logger("create directory native sessions " + this.path)
			try {
				var res = fs.mkdirSync(this.path);
			}catch(e){
				throw e ;
			}
		}
		this.finder = new nodefony.finder({
			path:this.path,
			onFile:function(file){
				this.loadSession(file)
			}.bind(this),
			onFinish:function(error, result){
				this.manager.logger("FILES SESSIONS STORAGE  ==>  " + this.manager.settings.storage.toUpperCase() + " COUNT SESSIONS : "+result.length())
			}.bind(this)
		});
	
	};

	fileSessionStorage.prototype.loadSession = function(file){
		var id = file.name ;
		try {
			var res = fs.readFileSync(file.path, {
				encoding:'utf8'
			});
			var obj = JSON.parse(res);
			var session = new Session(obj)
			this.manager.pushSession(obj.sessionName, id, session)
		}catch(e){
			this.manager.logger("FILES SESSIONS STORAGE  ==> "+ e,"ERROR")	
		}

	};


	fileSessionStorage.prototype.saveSession = function(id, serialize){
		fs.writeFile(this.path+"/"+id, serialize,function(err){
			if (err){
				this.manager.logger("FILES SESSIONS STORAGE : "+ err,"ERROR");
			}else{
				this.manager.logger("FILES SESSIONS STORAGE : " + id);
			}
		}.bind(this))
	};


	var cookiesParser = function(context, name){
		if (context.cookies[name]){
			return context.cookies[name];
		}
		return null;
	
	};

	var SessionsManager = function(security, httpKernel){
		this.httpKernel = httpKernel;
		this.firewall = security ;
		this.sessions = {};
		this.settings = this.container.getParameters("bundles.http").sessions;
		this.defaultSessionName = this.setName(this.settings.name) ;
		this.garbageCollector = new garbageCollector(this.sessions, this.settings);
		this.kernel = httpKernel.kernel;
		this.kernel.listen(this, "onReady",function(){
			//console.log("kernelready")	
		});
		switch(this.settings.storage){
			case "files" :
				this.storage = new fileSessionStorage(this);
			break;
			default :
				this.storage = null ;
		}
		//console.log(this)
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

	var settingsSession = {
	
	};

	/*
 	 *
 	 *	CLASS SESSION
 	 */
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

	Session.prototype.logger = function(pci, severity, msgid,  msg){
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

	return SessionsManager;
});
