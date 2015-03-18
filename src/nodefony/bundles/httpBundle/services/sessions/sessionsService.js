/*
 * New node file
 */


nodefony.registerService("sessions", function(){


	var cookiesParser = function(context, name){
		if (context.cookies[name] ){
			return context.cookies[name];
		}
		return null;
	};

	var checkSecureReferer = function(){
		var host = this.context.request.request.headers['host'] ;
		var meta = this.getMetaBag( "host" );

		if ( host === meta ){
			return host ;
		}else{
			this.manager.logger("SESSION START WARNING REFERRER NOT SAME, HOST : "+host+" ,META STORAGE :" + meta ,"WARNING");
			throw {
				meta :meta ,
				host :host
			}
		}	
	};

	var setMetasSession = function(){
		var time = new Date().getTime() ;
		this.setMetaBag("created", time );
		this.setMetaBag("lifetime", this.settings.cookie["maxAge"] );
		this.setMetaBag("host", this.context.request.request.headers['host'] );
		if ( this.context.request.request.headers['user-agent'] )
			this.setMetaBag("user_agent",this.context.request.request.headers['user-agent'] );	
	};

	var createSession = function(lifetime){
		this.id = this.setId();
		this.manager.logger("NEW SESSION CREATE : "+ this.id)	
		this.cookieSession = this.setCookieSession(lifetime) ;
		setMetasSession.call(this);	
		return this ;
	};

	/*
 	 *
 	 *	CLASS SESSION
 	 */
	var Session = function(name, settings, storage, manager ){
		if ( ! storage ){
			this.status = "disabled";
		}else{
			this.status = "none"; // active | disabled
		}
		this.manager = manager ;
		this.setName(name);
		this.id = null ;
		this.settings = settings ;
		this.storage = storage ;	
		this.mother = this.$super;
		this.mother.constructor();
		this.context = null ;
		this.lifetime =  this.settings.cookie["maxAge"]; 
		this.saved = false ;
	}.herite(nodefony.Container);
	
	Session.prototype.start = function(context){
		this.context = context ;
		if (this.settings.use_only_cookies){
			this.applyTranId = 0;	
		}else{
			this.applyTranId = this.settings.use_trans_sid ;	
		}
		switch (this.status){
			case "active":
				this.manager.logger("SESSION ALLREADY STARTED ==> "+this.name+" : "+this.id, "WARNING");
				return this;
			break;
			case  "disabled" :
				try {
					this.storage = this.manager.initializeStorage();
					if ( this.storage ){
						this.status = "none";
						return this.start(context);
					}
				}catch(e){
					this.manager.logger("SESSION STORAGE HANDLER NOT FOUND ","ERROR")
				}
			break;
			default:
				if (this.settings.use_cookies){
					var cookie = cookiesParser(context, this.name) ;
					if (cookie){
						this.id = cookie.value;
						this.cookieSession = new nodefony.cookies.cookie(cookie);	
					}
					this.applyTranId = 0 ;	
				}
				if ( (! this.settings.use_only_cookies) && (! this.id) ){
					if ( this.name in context.request.query ){
						this.id = context.request.query[this.name];
					}
				}
		}

		if (this.id){
			var ret = this.storage.start(this.id);
			if (ret){
				this.deSerialize(ret);
				if (this.settings.referer_check){
					try {
						var secure = checkSecureReferer.call(this, context)	
					}catch(e){
						this.manager.logger("SESSION REFERER ERROR SESSION  ==> " + this.name + " : "+ this.id, "WARNING");
						this.invalidate(this.id);	
					}
				}
			}else{
				if (this.settings.use_strict_mode){
					this.invalidate();
				}
			}		
		}else{
			this.clear();
			createSession.call(this, this.lifetime);
		}
		this.status = "active" ;
		this.manager.logger("START SESSION ==> " + this.name + " : "+ this.id);
		return this ;
		
		//this.save(this.id, this.serialize() );
		
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

	Session.prototype.setCookieSession = function( leftTime){
		if (leftTime){
			var settings = nodefony.extend( {}, this.settings.cookie);
			settings["maxAge"] = leftTime;
		}else{
			var settings = 	this.settings.cookie ;
		}
		var cookie = new nodefony.cookies.cookie(this.name, this.id, settings);
		this.context.response.addCookie(cookie);
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

	Session.prototype.remove = function(){
		try {
			return this.storage.destroy( this.id);	
		}catch(e){
			this.manager.looger(e, "ERROR");
			throw e;
		}
	};

	Session.prototype.destroy = function(){
		this.clear()
		this.remove();
		return true ;	
	};


	Session.prototype.clear = function(){
		delete this.protoService ;
		this.protoService = function(){};
		delete this.protoParameters
		this.protoParameters = function(){};
		delete this.services ;
		this.services = new this.protoService();
		delete this.parameters ;
		this.parameters = new this.protoParameters();
	};

	Session.prototype.count = function(){
	
	};

	Session.prototype.invalidate = function(lifetime){
		this.manager.logger("INVALIDATE SESSION ==>"+this.name + " : "+this.id,"DEBUG");
		if (! lifetime) lifetime = this.lifetime ;
		this.destroy();
		return createSession.call(this, lifetime);
	};

	Session.prototype.migrate = function(destroy, lifetime){
		this.manager.logger("MIGRATE SESSION ==>"+this.name + " : "+this.id,"DEBUG");
		//this.save();
		if (! lifetime) lifetime = this.lifetime ;
		if (destroy){
			this.remove();
		}
		return createSession.call(this, lifetime);
	};

	Session.prototype.setId = function(){
		var ip = this.context.remoteAddress || this.getRemoteAdress(this.context) ;
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
		this.saved = true ;
		try {
			return this.storage.write(this.id, this.serialize());	
		}catch(e){
			this.manager.logger(" SESSION ERROR : "+e,"ERROR");
			this.saved = false ;	
		}
	};

	Session.prototype.getName = function(){
		return this.name ;	
	};

	Session.prototype.setName = function(name){
		this.name = name || this.settings.name ;	
	};

	Session.prototype.randomValueHex = function(len) {
		return crypto.randomBytes(Math.ceil(len/2))
			.toString('hex') // convert to hexadecimal format
			.slice(0,len);   // return required number of characters
	};
	
	Session.prototype.getRemoteAdress = function(){
		var request = this.context.request ;
		return request.getRemoteAdress() ; 
	};

	/*
 	 *
 	 *	SERVICE MANAGER SESSIONS
 	 *
 	 *
 	 */
	
	var SessionsManager = function(security, httpKernel){
		this.httpKernel = httpKernel;
		this.firewall = security ; 
		this.kernel = httpKernel.kernel;
		this.kernel.listen(this, "onBoot",function(){
			this.settings = this.container.getParameters("bundles.http").session;
			this.defaultSessionName = this.settings.name ;
			this.initializeStorage();
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
					if ( ! this.saved )
						context.session.save();	
				}
			});
		}.bind(this));

		this.kernel.listen(this, "onTerminate",function(){
			if ( this.storage )
				this.storage.close();	
		}.bind(this));
	};

	SessionsManager.prototype.initializeStorage = function(){
		var storage =  eval("nodefony."+this.settings.handler) ;
		if (storage){
			this.storage = new storage(this) ;
			this.storage.open();
		}else{
			this.storage = null ;
			this.logger("SESSION HANDLER STORAGE NOT FOUND :" + this.settings.handler,"ERROR")
		}
		return this.storage
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
			this.storage.gc(this.settings.gc_maxlifetime);	
		}
		return session; 
	};
	
	SessionsManager.prototype.createSession = function(name, settings){
		var session = new Session(name, settings, this.storage, this);
		session.logger = this.logger.bind(this) ;
		return session ;
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
