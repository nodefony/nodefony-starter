/*
 * New node file
 */
var crypto = require('crypto');

nodefony.registerService("sessions", function(){


	var algorithm = 'aes-256-ctr';
	var password = 'd6F3Efeq';

	var cookiesParser = function(context, name){
		if (context.cookies[name] ){
			return context.cookies[name];
		}
		return null;
	};

	var checkSecureReferer = function(){
		switch (this.context.type ){
			case "HTTP" :
			case "HTTPS" :
				var host = this.context.request.request.headers['host'] ;
			break;	
			case "WEBSOCKET":
			case "WEBSOCKET SECURE":
				var host = this.context.request.httpRequest.headers['host'] ;
			break;	
		}
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
		this.setMetaBag("request", this.context.type );
		this.setMetaBag("created", time );
		this.setMetaBag("remoteAddress", this.context.getRemoteAddress() );
		this.setMetaBag("host", this.context.getHost() );
		var ua = this.context.getUserAgent() ;
		if ( ua )
			this.setMetaBag("user_agent",ua );	
		else
			this.setMetaBag("user_agent","Not Defined" );	
	};

	var createSession = function(lifetime, id, callback){
		this.id = id || this.setId();
		setMetasSession.call(this);	
		this.manager.logger("NEW SESSION CREATE : "+ this.id)	
		this.cookieSession = this.setCookieSession(lifetime) ;
		this.status = "active" ;
		if ( callback ){
			callback(null, this);
			//return this.save(this.context.user ? this.context.user.id : null, callback);
		}
		return this ;
	};

	/*
 	 *
 	 *	CLASS SESSION
 	 */
	var Session = class Session extends nodefony.Container {

		constructor (name, settings, storage, manager ){
			super();
			if ( ! storage ){
				this.status = "disabled";
			}else{
				this.status = "none"; // active | disabled
			}
			this.manager = manager ;
			this.strategy = this.manager.sessionStrategy ;
			this.strategyNone = false ;
			this.logger = manager.logger.bind(manager);
			this.setName(name);
			this.id = null ;
			this.settings = settings ;
			this.storage = storage ;	
			this.context = null ;
			this.contextSession = "default" ;
			this.lifetime =  this.settings.cookie["maxAge"]; 
			this.saved = false ;
			this.flashBag = {};
		};
	
		encrypt  (text){
			var cipher = crypto.createCipher(algorithm, password);
			var crypted = cipher.update(text,'utf8','hex');
			crypted += cipher.final('hex');
			return crypted;
		};

		decrypt  (text){
			var decipher = crypto.createDecipher(algorithm, password);
			var dec = decipher.update(text,'hex','utf8');
			dec += decipher.final('utf8');
			return dec;
		};
	
		start (context, contextSession, callback){
			this.context = context ;
			
			if ( contextSession ===  undefined ){
				contextSession = this.contextSession ;
			}
			
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
							this.storage.start(this.id, this.contextSession, (error, result) => {
								if (error){
									callback(error, null);	
									return ;
								}
								this.deSerialize(result);
								
								if (  ! this.isValidSession(result, context) ){
									this.manager.logger("INVALIDATE SESSION ==> "+this.name + " : "+this.id, "DEBUG");
									this.destroy();
									this.contextSession = contextSession;
									return createSession.call(this, this.lifetime, null, callback);
								}
								this.manager.logger("STRATEGY MIGRATE SESSION ==> "+this.name + " : "+this.id, "DEBUG");
								this.remove();
								this.contextSession = contextSession ;
								return createSession.call(this, this.lifetime, null, callback);
							});
						break;
						case "invalidate":
							this.manager.logger("STRATEGY INVALIDATE SESSION ==> "+this.name + " : "+this.id, "DEBUG");
							this.destroy();
							this.contextSession = contextSession;
							return createSession.call(this, this.lifetime,  null, callback);
						break;
						case "none" :
							this.strategyNone = true ;
						break;
					}
					if ( ! this.strategyNone ){
						return ;
					}
				}

				if ( contextSession ){
					this.contextSession = contextSession ;
				}
				this.storage.start(this.id, this.contextSession, (error, result) => {
					if (error){
						this.manager.logger("SESSION ==> "+this.name + " : "+this.id + " " +error, "ERROR");	
						if ( ! this.strategyNone ){
							this.invalidate();
						}
						return ;
					}
					if ( result &&  Object.keys(result).length ){
						this.deSerialize(result);
						if (  ! this.isValidSession(result, context) ){
							this.manager.logger("SESSION ==> "+this.name + " : "+this.id + "  session invalid ", "ERROR");
							this.invalidate();
						}
					}else{
						if ( this.settings.use_strict_mode ){
							if ( ! this.strategyNone ){
								this.manager.logger("SESSION ==> "+this.name + " : "+this.id + " use_strict_mode ", "ERROR");
								this.invalidate();
							}
						}
					}
					this.status = "active" ;
					return callback(null, this);
				});
				
			}else{
				this.clear();
				return createSession.call(this, this.lifetime, null, callback);
			}
		};

		isValidSession (data, context){
			if (this.settings.referer_check){
				try {
					checkSecureReferer.call(this, context)	
				}catch(e){
					this.manager.logger("SESSION REFERER ERROR SESSION  ==> " + this.name + " : "+ this.id, "WARNING");
					return false ;
				}
			}
			var lastUsed = new Date( this.getMetaBag("lastUsed")).getTime();
			var now = new Date().getTime() ;
			if (this.lifetime === 0 ) {
				/*if ( lastUsed && lastUsed + ( this.settings.gc_maxlifetime * 1000 ) < now ){
					this.manager.logger("SESSION INVALIDE gc_maxlifetime    ==> " + this.name + " : "+ this.id, "WARNING");
					return false ;	
				}*/
				return true ;	
			} 
			if ( lastUsed && lastUsed + ( this.lifetime * 1000 ) < now ){
				this.manager.logger("SESSION INVALIDE lifetime   ==> " + this.name + " : "+ this.id, "WARNING");
				return false;
			}
			return true ;	
		};

		attributes (){
			return this.protoService.prototype ;
		};

		metaBag (){
			return this.protoParameters.prototype ;
		};

		setMetaBag (key, value){
			return this.setParameters(key, value);
		};

		getMetaBag (key){
			
			return this.getParameters(key);
		};

		getFlashBag (key){
			//this.logger("GET FlashBag : " + key ,"WARNING")
			var res = this.flashBag[key];
			if ( res ){
				this.logger("Delete FlashBag : " + key ,"WARNING")
				delete  this.flashBag[key] ;
				return res ;
			}
			return null ;	
		};

		setFlashBag (key, value){
			if (! key ){
				throw new Error ("FlashBag key must be define : " + key)
			}
			if ( ! value ){
				this.logger("ADD FlashBag  : " + key  + " value not defined ","WARNING");	
			}else{
				this.logger("ADD FlashBag : " + key ,"DEBUG");
			}
			return this.flashBag[key] = value ;
		};

		flashBags (){
			return this.flashBag ;
		}

		clearFlashBags (){
			delete this.flashBag ;
			this.flashBag = {} ;
		}

		clearFlashBag (key){
			if (! key ){
				throw new Error ("clearFlashBag key must be define : " + key)
			}
			if ( this.flashBag[key]){
				delete this.flashBag[key] ;
			}
		}

		setCookieSession ( leftTime){
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

		serialize (user){
			var obj = {
				Attributes:this.protoService.prototype,
				metaBag:this.protoParameters.prototype,
				flashBag:this.flashBag,
				user_id:user
			};
			return  obj ;		
		};

		deSerialize (obj){
			//var obj = JSON.parse(data);
			for (var attr in obj.Attributes){
				this.set(attr, obj.Attributes[attr]);
			}
			for (var meta in obj.metaBag){
				//console.log(meta + " : " + obj.metaBag[meta])
				this.setMetaBag(meta, obj.metaBag[meta]);
			}
			for (var flash in obj.flashBag){
				this.setFlashBag(flash, obj.flashBag[flash])
			}
		};

		remove (){
			try {
				return this.storage.destroy( this.id, this.contextSession);	
			}catch(e){
				this.manager.logger(e, "ERROR");
				throw e;
			}
		};

		destroy (){
			this.clear();
			this.remove();
			return true ;	
		};

		clear (){
			delete this.protoService ;
			this.protoService = function(){};
			delete this.protoParameters
			this.protoParameters = function(){};
			delete this.services ;
			this.services = new this.protoService();
			delete this.parameters ;
			this.parameters = new this.protoParameters();
		};


		invalidate (lifetime, id, callback){
			this.manager.logger("INVALIDATE SESSION ==>"+this.name + " : "+this.id,"DEBUG");
			if (! lifetime) lifetime = this.lifetime ;
			this.destroy();
			return createSession.call(this, lifetime, id, callback);
		};

		migrate (destroy, lifetime, id, callback){
			this.manager.logger("MIGRATE SESSION ==>"+this.name + " : "+this.id,"DEBUG");
			if (! lifetime) lifetime = this.lifetime ;
			if (destroy){
				this.remove();
			}
			return createSession.call(this, lifetime, id, callback);
		};

		setId (){
			var ip = this.context.remoteAddress || this.getRemoteAddress(this.context) ;
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

		getId (value){
			var res = this.decrypt(value);
			this.contextSession =  res.split(':')[1];
			return value ;
		};

		save (user, callback){
			try {
				return this.storage.write(this.id, this.serialize(user), this.contextSession,(err, result) => {
					if (err){
						console.trace(err);
						this.logger( err ,"ERROR" )
						this.saved = false ; 
					}else{
						this.saved = true ;
					}
					//this.logger("SAVE SESSION " + this.id, "DEBUG")
					if ( callback ){
						callback(err, this);	
					}
				});	
			}catch(e){
				this.manager.logger(" SESSION ERROR : "+e,"ERROR");
				this.saved = false ;	
			}
		};

		getName (){
			return this.name ;	
		};

		setName (name){
			this.name = name || this.settings.name ;	
		};

		randomValueHex (len) {
			return crypto.randomBytes(Math.ceil(len/2))
				.toString('hex') // convert to hexadecimal format
				.slice(0,len);   // return required number of characters
		};
		
		getRemoteAddress (){
			//var request = this.context.request ;
			return this.context.getRemoteAddress() ; 
		};
	};

	/*
 	 *
 	 *	SERVICE MANAGER SESSIONS
 	 *
 	 *
 	 */
	var SessionsManager = class SessionsManager {
		constructor ( security, httpKernel){
			this.httpKernel = httpKernel;
			this.firewall = security ; 
			this.kernel = httpKernel.kernel;
			this.container = this.kernel.container ;
			this.sessionStrategy = "none" ;
			this.kernel.listen(this, "onBoot",() => {
				this.settings = this.container.getParameters("bundles.http").session;
				this.defaultSessionName = this.settings.name ;
				this.initializeStorage();
			});

			this.kernel.listen(this, "onTerminate",() => {
				if ( this.storage )
					this.storage.close();	
			});
		};

		get (service){
			return this.container.get(service);	
		};

		set (service, value){
			return this.container.set(service, value);
		};

		initializeStorage (){
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
	
		logger (pci, severity, msgid,  msg){
			var syslog = this.container.get("syslog");
			if (! msgid) msgid = "SERVICE SESSIONS";
			return syslog.logger(pci, severity || "DEBUG", msgid,  msg);
		};
		
		start (context, sessionContext, callback){
			if ( context.session ){
				if ( context.session.status === "active" ){
					return callback(null, context.session)  ;
				}
			}
			var inst = this.createSession(this.defaultSessionName, this.settings );
			var ret = inst.start(context, sessionContext, (err, session) =>{
				context.session = session ;
				if ( ! err ){ 
					session.setMetaBag("url", Url.parse(context.url ) );
					context.listen(session, "onFinish",function(){
						this.setMetaBag("lastUsed", new Date() );
						if ( ! this.saved ){
							this.save(context.user ? context.user.id : null);	
						}
					});
				}
				callback(err, session)
			}) ;
			
			if ( this.probaGarbage() ){
				this.storage.gc(this.settings.gc_maxlifetime, sessionContext);	
			}
			return inst; 
		};
	
		createSession (name, settings){
			var session = new Session(name, settings, this.storage, this);
			return session ;
		};

		addContextSession (context){
			if (this.storage){
				this.kernel.listen(this, "onReady",function(){
					this.storage.open(context)	
				});
			}
		};

		setSessionStrategy (strategy){
			this.sessionStrategy = strategy ;
		};

		probaGarbage  (){
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
	};

	return SessionsManager;
});
