/*
 *
 *
 *
 *
 *
 */
var Url = require("url");


nodefony.registerService("firewall", function(){



	var pluginReader = function(){

		var replaceKey = function(key){
			var tab = ['firewall', 'user', 'encoder'];
			return (tab.indexOf(key) >= 0 ? key + 's' : key);
		};
		
		var arrayToObject = function(tab){
			var obj = {};
			for(var i = 0; i < tab.length; i++){
				for(var key in tab[i]){
					if(tab[i]['name'] && key != 'name'){
						if(!obj[tab[i]['name']]){
							obj[tab[i]['name']] = {};
							delete obj['name'];
						}
						obj[tab[i]['name']][key] = (tab[i][key] instanceof Array ? arrayToObject(tab[i][key]) : tab[i][key]);
					} else if(key == 'rule'){
						obj = tab[i][key];
					} else {
						var value = (tab[i][key] instanceof Array ? arrayToObject(tab[i][key]) : tab[i][key]);
						if(value && value.class && value.algorithm){
							value[value.class] = value.algorithm;
							delete value.class;
							delete value.algorithm;
						}
						obj[replaceKey(key)] = value;
					}
				}
				
			}
			return (obj instanceof Object && Object.keys(obj).length == 0 ? null : obj);
		};
		

		var importXmlConfig = function(xml, prefix, callback, parser){
			
			if (parser){
				xml = this.render(xml, parser.data, parser.options);
			}
			var config = {};
			this.xmlParser.parseString(xml, function(err, node){
				for(var key in node){
					switch(key){
						case 'config':
							config = arrayToObject(node[key]);
							break;
					}
				}
			});
			
			if(callback) {
				callback.call(this, this.xmlToJson.call(this, {security: config}));
			} else {
				return config;
			}
		};

		var getObjectSecurityXML = function(file, callback, parser){
			importXmlConfig.call(this, file, '', callback, parser);
		};	
		
		var getObjectSecurityJSON = function(file, callback, parser){
			if (parser){
				file = this.render(file, parser.data, parser.options);
			}
			if(callback) callback(JSON.parse(file)); 
		};	
		
		var getObjectSecurityYml = function(file, callback, parser){
			if (parser){
				file = this.render(file, parser.data, parser.options);
			}
			if(callback) callback(yaml.load(file));
		};	

		return {
			xml:getObjectSecurityXML,
			json:getObjectSecurityJSON,
			yml:getObjectSecurityYml,
			annotation:null
		};
	}();

	// context security
	var securedArea = function(name, container, firewall){
		//this.notificationCenter = new nodefony.notificationsCenter.create();
		this.name = name ;
		this.container = container;
		this.firewall = firewall ;
		this.sessionContext = "default" ;
		this.crossDomain = null;
		this.pattern = ".*";
		this.factory = null; 
		this.provider = null;
		this.formLogin = null;
		this.checkLogin = null;

		this.firewall.kernel.listen(this, "onBoot",function(){
			try {
				if ( this.providerName in this.firewall.providers){
					this.provider = this.firewall.providers[ this.providerName ] ;	
				}else{
					this.firewall.logger("PROVIDER : "+this.providerName +" NOT registered ","ERROR");	
					return ;
				}
				this.logger(" FACTORY : "+ this.factory.name + " PROVIDER : " + this.provider.name + " PATTERN : " + this.pattern, "DEBUG");
			}catch(e){
				this.logger(this.name +"  "+e,"ERROR");	
				throw e;
			}
		}.bind(this))
	};

	
	securedArea.prototype.logger = function(pci, severity, msgid,  msg){
		if (! msgid) msgid = "\x1b[36mCONTEXT SECURITY \033[31m"+this.name+" \x1b[0m";
		return this.firewall.logger(pci, severity, msgid,  msg);
	};

	/*securedArea.prototype.listen = function(){
		return this.notificationCenter.listen.apply(this.notificationCenter, arguments);
	};

	securedArea.prototype.fire = function(){
		return this.notificationCenter.fire.apply(this.notificationCenter, arguments);
	};*/

	securedArea.prototype.handleCrossDomain = function(context, request, response){
		if ( context.crossDomain ){
			if ( this.crossDomain ){
				return  this.crossDomain.match( context.request, context.response )	
			}else{
				return  401;
			}
		}
	};

	securedArea.prototype.handle = function(context, request, response){
		try {
			// FACTORY
			if ( this.factory ){
				this.factory.handle(context);
				context.session.migrate(true);
				context.session.setMetaBag("security",{
					firewall:this.name,
					user:context.user.username,	
					factory:this.factory.name,
					tokenName:this.token.name
				});
			}
			if ( this.defaultTarget && context.request.url.path === this.checkLogin){
				this.overrideURL(context.request, this.defaultTarget);
				if ( context.request.isAjax() ){
					var obj = context.setXjson( {
						message:"OK",
						status:200,
					});
					context.notificationsCenter.fire("onRequest",context.container, request, response, obj );
					return ;
				}else{
					this.redirect(context, this.defaultTarget);
					return ;
				}
			}
			context.notificationsCenter.fire("onRequest", context.container, request, response);
		}catch (e){
			if (this.formLogin) {
				this.logger(e.message, "ERROR");
				var ajax = context.request.isAjax() ;
				//FIXME REDIRECT HTTPS
				if ( ! ajax && context.type === "HTTP" &&  context.container.get("httpsServer").ready ){
					this.redirectHttps(context);
				}else{
					context.response.setStatusCode( 401 ) ;
					this.overrideURL(context.request, this.formLogin);
					if (! ajax){
						if ( e.message !== "Unauthorized" ){
							context.session.setFlashBag("session", {
								error:e.message
							});
						}
					}else{
						 context.setXjson(e);
					}
					context.notificationsCenter.fire("onRequest",context.container, request, response );
				}
			}else{
				if (e.status){
					context.notificationsCenter.fire("onError",context.container, {
						status:e.status,
						message:e.message
					});
				}else{
					context.notificationsCenter.fire("onError",context.container, {
						status:500,
						message:e
					});
				}
			}
		}
	};

	// Factory
	securedArea.prototype.setFactory = function(auth, options){
		if ( auth ){
			if (auth in nodefony.security.factory ){
				this.factory = new nodefony.security.factory[auth](this, options)
				this.logger("FACTORY "+auth +" registered ","DEBUG");
			}else{
				this.logger("FACTORY :"+auth +"NOT registered ","ERROR");
				throw new Error("FACTORY :"+auth +"NOT registered "); 
			}
		}
	};
	
	securedArea.prototype.setProvider = function(provider){
		this.providerName = provider;
	};

	securedArea.prototype.overrideURL = function(request, url ){
		request.url = Url.parse( Url.resolve(request.url, url) ) ;
		return request.url ;
	};
	
	securedArea.prototype.redirectHttps = function(context){
		context.request.url.protocol = "https";
		context.request.url.port = this.container.get("kernel").httpsPort;
		context.request.url.href = "";
		context.request.url.host = "";
		return context.redirect(context.request.url, 301);
	};

	securedArea.prototype.redirect = function(context, url){
		return context.redirect(context.request.url, 301);
	};
		
	securedArea.prototype.match = function(request, response){
                var url = request.url ? request.url.pathname : ( request.resourceURL ? request.resourceURL.pathname : null ) ;
                return this.pattern.exec(url);
	};

	securedArea.prototype.setPattern = function(pattern){
		this.regPartten =  pattern ;
		this.pattern = new RegExp(pattern);
	};

	securedArea.prototype.setCrossDomain = function(crossSettings){
		this.crossDomain = new nodefony.io.cors(crossSettings); 
	};

	securedArea.prototype.setFormLogin = function(route){
		this.formLogin = route;
	};

	securedArea.prototype.setCheckLogin = function(route){
		this.checkLogin = route;	
	};


	securedArea.prototype.setDefaultTarget = function(route){
		this.defaultTarget = route;
	};

	securedArea.prototype.setContextSession = function(context){
		this.sessionContext = context ;
	};

	/*
 	 *
 	 *	CLASS FIREWALL
 	 *
 	 *
 	 */

	var optionStrategy ={
		migrate:true,
		invalidate:true,
		none:true
	};

	var Firewall = function(container, kernel ){
		this.container = container;
		this.kernel = kernel;
		this.kernelHttp = this.get("httpKernel");
		this.reader = function(context){
			var func = context.container.get("reader").loadPlugin("security", pluginReader);
			return function(result){
				try {
					return func(result, context.nodeReader.bind(context));
				}catch(e){
					context.logger(e.message, "ERROR");
					console.log(e)
				}
			};
		}(this);

		this.securedAreas = {}; 
		this.providers = {};
		this.sessionStrategy = "invalidate" ;

		this.syslog = this.container.get("syslog");

		// listen KERNEL EVENTS
		this.kernel.listen(this, "onBoot",function(){
			this.sessionService = this.get("sessions");
			this.sessionService.settings.start = "firewall";
		});

		//this.kernel.listen(this, "onReady",function(){
		//});

		this.kernel.listen(this, "onSecurity",function(context){
			switch (context.type){
				case "HTTP" :
				case "HTTPS" :
					var request = context.request.request ;
					var response = context.response.response ;
					request.on('end', function(){
						for ( var area in this.securedAreas ){
							if ( this.securedAreas[area].match(context.request, context.response) ){
								context.security = this.securedAreas[area];
								this.sessionService.start(context, this.securedAreas[area].sessionContext);
								var meta = context.session.getMetaBag("security");
								if (meta){
									context.user = context.security.provider.loadUserByUsername( meta.user ) ;
									context.notificationsCenter.fire("onRequest", context.container, request, response );
								}else{
									this.handlerHttp(context, request, response);
								}
								break;
							}
						}
						if ( ! context.security ){	
							context.notificationsCenter.fire("onRequest", context.container, request, response);	
						}
					}.bind(this));
				break;
				case "WEBSOCKET" :
				case "WEBSOCKET SECURE" :
					var request = context.request ;
					var response = context.response ;	
					for ( var area in this.securedAreas ){
						if ( this.securedAreas[area].match(context.request, context.response) ){
							context.security = this.securedAreas[area] ;
							this.handlerWebsocket(context, request, response);
							break;
						}
					}
					if ( ! context.security ){
						context.notificationsCenter.fire("onRequest", context.container, request, response );
					}
				break;
			}
		});
	};

	Firewall.prototype.handlerHttp = function( context, request, response){
		try {
			//CROSS DOMAIN 
			var next = context.security.handleCrossDomain(context, request, response) ;
			switch (next){
				case 204 :
					return ;
				case 401 :
					this.logger("\033[31m CROSS DOMAIN Unauthorized \033[0mREQUEST REFERER : " + context.crossURL.href ,"ERROR");
					context.notificationsCenter.fire("onError",context.container, {
						status:next,
						message:"crossDomain Unauthorized "
					});
					return ;
				case 200 :
					this.logger("\033[34m CROSS DOMAIN  \033[0mREQUEST REFERER : " + context.crossURL.href ,"DEBUG")
				break;
			}
			var ret = context.security.handle( context, request, response);
		}catch(e){
			context.notificationsCenter.fire("onError",context.container, {
				status:500,
				message:e
			});	
		}
	};

	Firewall.prototype.handlerWebsocket = function(context, request, response){
		// TODO FIREWALL FOR WEBSOCKET
		context.notificationsCenter.fire("onRequest", context.container, request, response );
	};

	Firewall.prototype.setSessionStrategy = function(strategy){
		if (strategy in optionStrategy ){
			this.logger("Set Session Strategy  : " + strategy,"DEBUG")
			return this.sessionStrategy = strategy ;
		}
		throw new Error("sessionStrategy strategy not found");
	};

	Firewall.prototype.nodeReader = function(obj){
		//console.log(obj.security.firewalls)
		obj = obj.security;
		for (var ele in obj){
			switch (ele){
				case "firewalls" :
					for ( var firewall in obj[ele] ){
						var param = obj[ele][firewall];
						var area = this.addSecuredArea(firewall);
						for (var config in param){
							switch (config){
								case "pattern":
									area.setPattern(param[config]);
								break;
								case "anonymous":
								break;
								
								case "crossDomain":
									area.setCrossDomain(param[config]);
								break;
								case "form_login":
									if (param[config].login_path){
										area.setFormLogin(param[config].login_path);
									}
									if (param[config].check_path){
										area.setCheckLogin(param[config].check_path);
									}
									if (param[config].default_target_path){
										area.setDefaultTarget(param[config].default_target_path);
									}
								break;
								case "remember_me":
								break;
								case "logout":
								break;
								case "provider" :
									//this.kernel.listen(this, "onBoot",function(provider, context){
										var provider = param[config] ;
										//if ( provider in this.providers ){
											area.setProvider(provider);
										//}else{
											//this.logger("Provider  : "+provider +" Not found")

										//}	
									//}.bind(this,param[config], area));
								break;
								case "context" :
									if ( param[config] ){
										this.kernel.listen(this, "onBoot",function(context, contextSecurity){
											//console.log( this.sessionService );
											contextSecurity.setContextSession(context);
											this.sessionService.addContextSession(context);
										}.bind(this, param[config], area));
									}
								break;
								default:
									if ( config in nodefony.security.factory ){
										area.setFactory(config, param[config]);
									}
							}
						}
					}
				break;
				case "session_fixation_strategy":
					this.kernel.listen(this, "onBoot",function(strategy){
						this.setSessionStrategy(strategy);
						this.sessionService.setSessionStrategy(this.sessionStrategy);
					}.bind(this ,obj[ele]));
				break;
				case "access_control" : 
				break;
				case "providers" : 
					for ( var provider in obj[ele] ){
						this.providers[provider] = null;
						for (var pro in obj[ele][provider] ){
							var element = obj[ele][provider] ;
							switch (pro){
								case "memory" :
									for (var api in element[pro]){
										switch (api){
											case "users":
												this.providers[provider] = new nodefony.usersProvider(provider, element[pro][api]);
											break;
											default:
												this.logger("Provider API : "+api +" Not exist")
										}
									}
								break;
								case "entity" :
									for(var api in element[pro]){
										switch(api){
											case "class":
												var Class = nodefony[ element[pro][api] ];
											break;
											case "property":
												var property =  element[pro][api];
											break;
											case "manager_name":
												var manager_name = element[pro][api] ;
											break;
										}
										
									}
									if (Class){
										if (manager_name && manager_name !== "~"){
											this.providers[manager_name] =  new Class(property);	
										}else{
											this.providers[provider] = new Class(property);
										}
									}
								break;
								default:
									this.logger("Provider type :"+pro+" not define ")
							}
						}	
					}
				break;
			}
		}
		//console.log(area)
	}

	
	Firewall.prototype.addSecuredArea = function(name){
		if ( ! this.securedAreas[name] ){
			this.securedAreas[name] = new securedArea(name, this.container, this) ;
			this.logger("ADD security context : " + name, "DEBUG" )
			return this.securedAreas[name];
		}else{
			this.logger("securedAreas :" + name +"already exist ")
		}
	};

	Firewall.prototype.logger = function(pci, severity, msgid,  msg){
		if (! msgid) msgid = "\x1b[36mSERVICE FIREWALL\x1b[0m";
		return this.syslog.logger(pci, severity, msgid,  msg);
	};


	Firewall.prototype.get = function(name){
		if (this.container)
			return this.container.get(name);
		return null;
	};

	Firewall.prototype.set = function(name, obj){
		if (this.container)
			return this.container.set(name, obj);
		return null;
	};

	return Firewall;
});
