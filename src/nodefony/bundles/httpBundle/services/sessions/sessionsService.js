/*
 * New node file
 */
var crypto = require('crypto');


nodefony.registerService("sessions", function(){


	var algorithm = 'aes-256-ctr';
	var password = 'd6F3Efeq';

	var encrypt = function (text){
		var cipher = crypto.createCipher(algorithm, password)
		var crypted = cipher.update(text,'utf8','hex')
		crypted += cipher.final('hex');
		return crypted;
	}

	var decrypt = function (text){
		var decipher = crypto.createDecipher(algorithm, password)
		var dec = decipher.update(text,'hex','utf8')
		dec += decipher.final('utf8');
		return dec;
	}


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
		var time = new Date() ;
		this.setMetaBag("lifetime", this.settings.cookie["maxAge"] );
		this.setMetaBag("context", this.contextSession );
		this.setMetaBag("created", time );
		this.setMetaBag("host", this.context.request.request.headers['host'] );
		if ( this.context.request.request.headers['user-agent'] )
			this.setMetaBag("user_agent",this.context.request.request.headers['user-agent'] );	
	};

	var createSession = function(lifetime, id){
		this.id = id || this.setId();
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
		this.strategy = this.manager.sessionStrategy ;
		this.logger = manager.logger.bind(manager);
		this.setName(name);
		this.id = null ;
		this.settings = settings ;
		this.storage = storage ;	
		this.mother = this.$super;
		this.mother.constructor();
		this.context = null ;
		this.contextSession = "default" ;
		this.lifetime =  this.settings.cookie["maxAge"]; 
		this.saved = false ;
		this.flashBag = {};
	}.herite(nodefony.Container);
	
	Session.prototype.encrypt = function (text){
		var cipher = crypto.createCipher(algorithm, password);
		var crypted = cipher.update(text,'utf8','hex');
		crypted += cipher.final('hex');
		return crypted;
	};

	Session.prototype.decrypt = function (text){
		var decipher = crypto.createDecipher(algorithm, password);
		var dec = decipher.update(text,'hex','utf8');
		dec += decipher.final('utf8');
		return dec;
	};
	
	Session.prototype.start = function(context, contextSession, callback){
		this.context = context ;
		
		if (contextSession ===  undefined)
			contextSession = this.contextSession ;
		
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
						return this.start(context, contextSession, callback);
					}
				}catch(e){
					this.manager.logger("SESSION STORAGE HANDLER NOT FOUND ","ERROR")
				}
			break;
			default:
				if (this.settings.use_cookies){
					var cookie = cookiesParser(context, this.name) ;
					if (cookie){
						this.id = this.getId(cookie.value);
						this.cookieSession = new nodefony.cookies.cookie(cookie);	
					}
					this.applyTranId = 0 ;	
				}
				if ( (! this.settings.use_only_cookies) && (! this.id) ){
					if ( this.name in context.request.query ){
						this.id = this.getId( context.request.query[this.name]);
					}
				}
		}

		if (this.id){
			// change context session 
			if ( this.contextSession != contextSession ){
				switch(this.strategy){
					case "migrate":
						var ret = this.storage.start(this.id, this.contextSession);
						this.deSerialize(ret);
						if (  ! this.isValidSession(ret, context) ){
							this.manager.logger("INVALIDATE SESSION ==> "+this.name + " : "+this.id, "DEBUG");
							this.destroy();
							this.contextSession = contextSession;
							createSession.call(this, this.lifetime);
							this.status = "active" ;
							this.manager.logger("START SESSION ==> " + this.name + " : "+ this.id, "DEBUG");
							return this;
						}
						this.manager.logger("STRATEGY MIGRATE SESSION ==> "+this.name + " : "+this.id, "DEBUG");
						this.remove();
						this.contextSession = contextSession ;
						createSession.call(this, this.lifetime);
						this.status = "active" ;
						this.manager.logger("START SESSION ==> " + this.name + " : "+ this.id);
						return this ;
					break;
					case "invalidate":
						this.manager.logger("STRATEGY INVALIDATE SESSION ==> "+this.name + " : "+this.id, "DEBUG");
						this.destroy();
						this.contextSession = contextSession;
						createSession.call(this, this.lifetime);
						this.status = "active" ;
						this.manager.logger("START SESSION ==> " + this.name + " : "+ this.id, "DEBUG");
						return this;
					break;
					case "none" :
						var ret = this.storage.start(this.id, this.contextSession);
						this.deSerialize(ret);
						if (  ! this.isValidSession(ret, context) ){
							this.manager.logger("INVALIDATE SESSION ==> "+this.name + " : "+this.id, "DEBUG");
							//this.destroy();
							this.contextSession = contextSession;
							createSession.call(this, this.lifetime);
							this.status = "active" ;
							this.manager.logger("START SESSION ==> " + this.name + " : "+ this.id, "DEBUG");
							return this;
						}
						this.manager.logger("STRATEGY SESSION NONE==> "+this.name + " : "+this.id, "DEBUG");
						this.contextSession = contextSession;
						createSession.call(this, this.lifetime, this.id);
						this.status = "active" ;
						this.manager.logger("START SESSION ==> " + this.name + " : "+ this.id);
						return this ;
					break;
				}
			}

			if ( contextSession ){
				this.contextSession = contextSession ;
			}
			this.storage.start(this.id, this.contextSession, function(error, result){
				if (error){
					this.manager.logger("SESSION ==> "+this.name + " : "+this.id + " " +error, "ERROR");	
					this.invalidate();
				}
				if (result){
					this.deSerialize(result);
					if (  ! this.isValidSession(result, context) ){
						this.invalidate();
						error = new Error("SESSION ==> "+this.name + " : "+this.id + "  session invalid ");
					}
				}else{
					if ( this.settings.use_strict_mode ){
						this.invalidate();
						error = new Error("SESSION ==> "+this.name + " : "+this.id + " No data ");
					}
				}
				this.status = "active" ;
				this.manager.logger("START SESSION ==> " + this.name + " : "+ this.id, "DEBUG");
				if (callback)
					return callback(null, this);
			}.bind(this));
			
		}else{
			this.clear();
			createSession.call(this, this.lifetime);
			this.status = "active" ;
			this.manager.logger("START SESSION ==> " + this.name + " : "+ this.id, "DEBUG");
			callback(null, this)
		}
	};

	Session.prototype.isValidSession = function(data, context){
		if (this.settings.referer_check){
			try {
				checkSecureReferer.call(this, context)	
			}catch(e){
				this.manager.logger("SESSION REFERER ERROR SESSION  ==> " + this.name + " : "+ this.id, "WARNING");
				return false ;
			}
		}
		var lastUsed = new Date( this.getMetaBag("lastUsed")).getTime();
		if (this.lifetime === 0 ) {
			if ( lastUsed + ( this.settings.gc_maxlifetime * 1000 ) < new Date().getTime() ){
				return false ;	
			}
			return true ;	
		} 
		if ( lastUsed + ( this.lifetime * 1000 ) < new Date().getTime() ){
			return false;
		}
		return true ;	
	};

	Session.prototype.attributes= function(){
		return this.protoService.prototype ;
	};

	Session.prototype.metaBag = function(){
		return this.protoParameters.prototype ;
	};

	Session.prototype.setMetaBag = function(key, value){
		return this.setParameters(key, value);
	};

	Session.prototype.getMetaBag = function(key){
		return this.getParameters(key);
	};

	Session.prototype.getFlashBag = function(key){
		var res = this.flashBag[key];
		if ( res ){
			this.logger("Delete FlashBag : " + key ,"WARNING")
			delete  this.flashBag[key] ;
			return res ;
		}
		return null ;	
	};

	Session.prototype.setFlashBag = function(key, value){
		if (! key ){
			throw new Error ("FlashBag key must be define : " + key)
		}
		this.logger("ADD FlashBag : " + key ,"WARNING")
		return this.flashBag[key] = value ;
	};

	Session.prototype.flashBags = function(){
		return this.flashBag ;
	}


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
			metaBag:this.protoParameters.prototype,
			flashBag:this.flashBag
		};
		return  obj ;		
	};

	Session.prototype.deSerialize = function(obj){
		//var obj = JSON.parse(data);
		for (var attr in obj.attributes){
			this.set(attr, obj.attributes[attr]);
		}
		for (var meta in obj.metaBag){
			//console.log(meta + " : " + obj.metaBag[meta])
			this.setMetaBag(meta, obj.metaBag[meta]);
		}
		for (var flash in obj.flashBag){
			this.setFlashBag(flash, obj.flashBag[flash])
		}
	};

	Session.prototype.remove = function(){
		try {
			return this.storage.destroy( this.id, this.contextSession);	
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

	Session.prototype.migrate = function(destroy, lifetime, id){
		this.manager.logger("MIGRATE SESSION ==>"+this.name + " : "+this.id,"DEBUG");
		if (! lifetime) lifetime = this.lifetime ;
		if (destroy){
			this.remove();
		}
		return createSession.call(this, lifetime, id);
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
		var res =  hash.update(concat).digest("hex");
		
		return this.encrypt(res+":"+ this.contextSession );
	};

	Session.prototype.getId = function(value){
		var res = this.decrypt(value);
		this.contextSession =  res.split(':')[1];
		return value ;
	};

	Session.prototype.save = function(){
		this.saved = true ;
		try {
			return this.storage.write(this.id, this.serialize(), this.contextSession,function(err, result){
				if (err){
					this.logger( err ,"ERROR" )
					return ; 
				}
				this.logger(result, "DEBUG")
				this.saved = true ;
			}.bind(this));	
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
		this.container = this.kernel.container ;
		this.sessionStrategy = "none" ;
		this.kernel.listen(this, "onBoot",function(){
			this.settings = this.container.getParameters("bundles.http").session;
			this.defaultSessionName = this.settings.name ;
			this.initializeStorage();
		}.bind(this));

		this.kernel.listen(this, "onHttpRequest", function(container, context, type){
			var request = context.request.request ;
			request.on('end', function(){
				if ( this.settings.start === "autostart" )
					 this.start(context);
			}.bind(this));
			var response = context.response.response ;
			response.on("finish",function(){
				if ( context.session ){
					context.session.setMetaBag("lastUsed", new Date() );
					if ( ! this.saved ){
						context.session.save();	
					}
				}
			});
		}.bind(this));

		this.kernel.listen(this, "onTerminate",function(){
			if ( this.storage )
				this.storage.close();	
		}.bind(this));
	};

	SessionsManager.prototype.get = function(service){
		return this.container.get(service);	
	};

	SessionsManager.prototype.set = function(service, value){
		return this.container.set(service, value);
	};

	SessionsManager.prototype.initializeStorage = function(){
		var storage =  eval("nodefony."+this.settings.handler) ;
		if (storage){
			this.storage = new storage(this) ;
			this.kernel.listen(this, "onReady",function(){
				this.storage.open("default");
			});
		}else{
			this.storage = null ;
			this.logger("SESSION HANDLER STORAGE NOT FOUND :" + this.settings.handler,"ERROR")
		}
		return this.storage;
	};
	
	SessionsManager.prototype.logger = function(pci, severity, msgid,  msg){
		var syslog = this.container.get("syslog");
		if (! msgid) msgid = "SERVICE SESSIONS";
		return syslog.logger(pci, severity || "DEBUG", msgid,  msg);
	};
	
	SessionsManager.prototype.start = function(context, sessionContext, callback){
		var inst = this.createSession(this.defaultSessionName, this.settings );
		var ret = inst.start(context, sessionContext, function(err, session){
			context.session = session ;
			callback(err, session)
		}.bind(this)) ;
		
		if ( this.probaGarbage() ){
			this.storage.gc(this.settings.gc_maxlifetime, sessionContext);	
		}
		return inst; 
	};
	
	SessionsManager.prototype.createSession = function(name, settings){
		var session = new Session(name, settings, this.storage, this);
		return session ;
	};

	SessionsManager.prototype.addContextSession = function(context){
		if (this.storage){
			this.kernel.listen(this, "onReady",function(){
				this.storage.open(context)	
			});
		}
	};

	SessionsManager.prototype.setSessionStrategy = function(strategy){
		this.sessionStrategy = strategy ;
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
