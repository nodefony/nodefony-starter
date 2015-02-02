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
		this.id = null ;
		this.settings = settings ;
		this.storage = storage ;	
		this.mother = this.$super;
		this.mother.constructor();
		//this.lifeSession = new Date().getTime() + ( parseInt((this.settings.gc_maxlifetime * 1000) , 10) );
	}.herite(nodefony.Container);

	Session.prototype.start = function(context){
		var cookie = cookiesParser(context, this.name)
		if (cookie){
			this.id = cookie.value;
			this.cookieSession = new nodefony.cookies.cookie(cookie);
			var hasCookie = true ;
		}else{
			this.id  = this.setId(context);
			this.cookieSession = this.setCookieSession(context) ;
			var hasCookie = false ;
		}
		var ret = this.storage.start(this.id);
		if (ret){
			this.deSerialize(ret);
		}else{
			if (hasCookie && this.settings.use_strict_mode ){
				this.id = this.setId(context);
				this.cookieSession = this.setCookieSession(context) ;
			}
			//not found
			var time = new Date().getTime() ;
			this.setMetaBag("created", time );
			this.setMetaBag("lifetime", this.settings.cookie["maxAge"] );
			this.save(this.id, this.serialize() );
		}
		return this ;
	};

	Session.prototype.metaBag = function(){
		return this.parameters ;
	};

	Session.prototype.setMetaBag = function(key, value){
		return this.setParameters(key, value);
	};

	Session.prototype.getMetaBag = function(key){
		return this.getParameters(key);
	};


	Session.prototype.setCookieSession = function(context, leftTime){
		if (leftTime){
			var settings = nodefony.extend( {}, this.settings.cookie);
			settings["maxAge"] = leftTime;
		}else{
			var settings = 	this.settings.cookie ;
		}
		var cookie = new nodefony.cookies.cookie(this.name, this.id, settings);
		context.setCookie(cookie);
		return cookie ;
	};

	Session.prototype.serialize = function(){
		var obj = {
			attributes:this.protoService.prototype,
			metaBag:this.protoParameters.prototype
		};
		return JSON.stringify( obj );		
	};

	Session.prototype.deSerialize = function(data){
		var obj = JSON.parse(data);
		for (var attr in obj.attributes)
			this.set(attr, obj.attributes[attr]);
		for (var meta in obj.metaBag)
			this.setMetaBag(meta, obj.metaBag[meta]);
	};

	Session.prototype.remove = function(id){
		return this.storage.destroy(id || this.id);	
	};

	Session.prototype.clear = function(){
		this.services = null ;
		this.services = new this.protoService();
		this.parameters = null;
		this.parameters = new this.protoParameters();
	};

	Session.prototype.count = function(){
	
	};

	Session.prototype.invalidate = function(lifetime){
		this.clear();
	};

	Session.prototype.migrate = function(context, destroy, lifetime){
		var oldId = this.id ;
		this.id = this.setId(context);
		this.cookieSession = this.setCookieSession(context, lifetime) ;
		var time = new Date().getTime() ;
		this.setMetaBag("created", time );
		this.setMetaBag("lifetime", lifetime );
		this.save(this.id, this.serialize() );
		if (destroy){
			this.remove(oldId);
		}
	};

	Session.prototype.setId = function(context){
		var ip = context.remoteAddress || this.getRemoteAdress(context) ;
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

	Session.prototype.getId = function(){
		return this.id ;
	};

	Session.prototype.save = function(){
		return this.storage.write(this.id, this.serialize());	
	};

	Session.prototype.getName = function(){
		return this.name ;	
	};

	Session.prototype.setName = function(){
	
	};

	Session.prototype.randomValueHex = function(len) {
		return crypto.randomBytes(Math.ceil(len/2))
			.toString('hex') // convert to hexadecimal format
			.slice(0,len);   // return required number of characters
	};
	
	Session.prototype.getRemoteAdress = function(context){
		var request = context.request.request ;
		return request.headers['x-forwarded-for'] || request.connection.remoteAddress || request.socket.remoteAddress || request.connection.socket.remoteAddress ;
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
			var response = context.response.response ;
			response.on("finish",function(){
				if ( context.session ){
					context.session.setMetaBag("lastUsed", new Date().getTime() );
					context.session.save();	
				}
			});
		}.bind(this));
	};

	SessionsManager.prototype.logger = function(pci, severity, msgid,  msg){
		var syslog = this.container.get("syslog");
		if (! msgid) msgid = "SERVICE SESSIONS";
		return syslog.logger(pci, severity || "DEBUG", msgid,  msg);
	};
	
	SessionsManager.prototype.start = function(context){
		var session = this.createSession(this.defaultSessionName, this.settings );
		//var date = new Date().getTime();
		var ret = session.start(context) ;
		if ( this.probaGarbage() ){
			this.storage.gc(this.settings.gc_maxlifetime);	
		}
		return session; 
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
