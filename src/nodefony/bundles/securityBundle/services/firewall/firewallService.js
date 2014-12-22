/*
 *
 *
 *
 *
 *
 */



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


	var securedArea = function(container){
		this.container = container;
		//console.log( this.container.get("httpsServer") );
		this.Authenticate = null;
		this.crossDomain = false;
		this.pattern = ".*";
		this.provider = null;
		this.formLogin = null;
		this.checkLogin = null;
	};


	securedArea.prototype.authentication = function(auth, options){
		if ( auth ){
			// authentifications
			switch (auth){
				case "SASL":
					this.Authenticate =  new nodefony.io.authentication.SASL(options);
				break;
				case "BASIC":
				case "http_basic":
					this.Authenticate = new nodefony.io.authentication.BASIC(options);
				break;
				case "DIGEST":
				case "http_digest":
					this.Authenticate = new nodefony.io.authentication["http_digest"](options);
				break;	
				case "false":
				case false:
				case null:
					this.Authenticate = null;
				break;
				default:
					this.logger("Authentification : "+ auth+" is not implemented");
			}
		}
		return this.Authenticate;
	};

	securedArea.prototype.setProvider = function(provider){
		this.provider = provider;
	};

	securedArea.prototype.overrideURL = function(request, url ){
		request.url.path = "";
		request.url.href = "";
		return request.url.pathname = url || this.formLogin;
	};
	
	securedArea.prototype.redirectHttps = function(context){
		//console.log(context.request.isAjax());
		context.request.url.protocol = "https";
		context.request.url.port = this.container.get("kernel").httpsPort;
		context.request.url.href = "";
		context.request.url.host = "";
		return context.redirect(context.request.url, 301);
	};

	securedArea.prototype.redirect = function(context, url){
		this.overrideURL(context.request, url);
		return context.redirect(context.request.url, 301);
	};



	securedArea.prototype.match = function(request, response){
		//if (request.url.href === this.formLogin )
                        //return true;
                var url = request.url.pathname || request.resourceURL.pathname ;
                return this.pattern.exec(url);
	};

	securedArea.prototype.setPattern = function(pattern){
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
		this.defaultTarget = route
	};

	securedArea.prototype.checkAuthenticate = function(host, request, response){
		return this.Authenticate.checkAuthenticate(host, request, response);
	};
	//FIXME SESSION
	securedArea.prototype.checkValidSession = function(context){
		if( context.session ) {
			switch (context.session.value){
				case "null":
				case "false":
				case null:
				case false:
					return null;
				break;
				default:
					return 200;
			}
		}else{
			return null;
		}
	};

	/*
 	 *
 	 *	CLASS FIREWALL
 	 *
 	 *
 	 */
	var Firewall = function(container, kernel ){
		this.container = container;
		this.kernel = kernel;
		this.reader = function(context){
			var func = context.container.get("reader").loadPlugin("security", pluginReader);
			return function(result){
				return func(result, context.nodeReader.bind(context));
			};
		}(this);

		this.securedAreas = {}; 
		this.providers = {};

		// listen KERNEL EVENTS
		this.kernel.listen(this, "onHttpRequest", this.handlerHTTP );
		this.kernel.listen(this, "onHttpsRequest", this.handlerHTTP );
		this.kernel.listen(this, "onWebsocketRequest", this.handlerWebsocket );
		this.kernel.listen(this, "onWebSocketSecureRequest", this.handlerWebsocket );
		this.kernel.listen(this, "onReady",function(){
			this.sessionService = this.get("sessions");
		});
		
	};

	Firewall.prototype.handlerHTTP = function(container, context, type){
		
		var request = context.request.request ;
		var response = context.response.response ;
		request.on('end', function(){
			// SESSION START 
			// FIXME GOOD PLACE ???
			//var session = this.sessionService.start(context);

			for ( var area in this.securedAreas ){
				if ( this.securedAreas[area].match(context.request, context.response) ){
					context.secureArea = this.securedAreas[area] ;
					try {
						var host = container.getParameters("request.host");
						var URL = url.parse(request.headers.referer || request.headers.origin ) ;
						var cross = ! ( URL.protocol+"//"+URL.host  === type.toLowerCase()+"://"+host ) ;
						if ( cross ){
							if ( this.securedAreas[area].crossDomain )
								var next = this.securedAreas[area].crossDomain.match( context.request, context.response )	
							else
								var next = 401;
							switch (next){
								case 204 :
									return ;
								case 401 :
									this.logger("\033[31m CROSS DOMAIN Unauthorized \033[0mREQUEST REFERER : " + URL.href ,"ERROR")
									context.notificationsCenter.fire("onError",container, {
										status:next,
										message:"crossDomain Unauthorized "
									});
									return ;
								case 200 :
									this.logger("\033[34m CROSS DOMAIN  \033[0mREQUEST REFERER : " + URL.href ,"DEBUG")
								break;
							}
						}
						if ( this.securedAreas[area].Authenticate ){
							//FIXME SESSION
							if ( this.securedAreas[area].checkValidSession(context) ){
								context.notificationsCenter.fire("onRequest",container, request, response );	
							}else{
								if (this.securedAreas[area].provider ) {
									var provider = this.securedAreas[area].provider
									if ( provider in this.providers){
										this.securedAreas[area].Authenticate.getUserPasswd = this.providers[ provider ].getUserPassword.bind(this.providers[ provider ]) ;	
									}
								}
								var status =  this.securedAreas[area].checkAuthenticate(host, context.request, context.response);
								switch (status){
									case 200 :
										//FIXME SESSION
										//console.log(context.request)
										var cookie = new nodefony.cookies.cookie("session","true",{
											maxAge:50000,
											//domain:context.request.domain
										});
										context.setCookie(cookie);

										if ( this.securedAreas[area].defaultTarget ){
											if ( context.request.isAjax() ){
												this.securedAreas[area].overrideURL(context.request, this.securedAreas[area].defaultTarget);
												var obj = kernelHttp.setXJSON(context, {
													message:"OK",
													status:200,
												});
												context.notificationsCenter.fire("onRequest",container, request, response, obj );
											}else{
												this.securedAreas[area].redirect(context, this.securedAreas[area].defaultTarget);
											}
											
										}else{
											throw {
												message:"defaultTarget not found in config file",
												status:404
											}
										}
									break;
									case 401 :
										var cookie = new nodefony.cookies.cookie("session","false",{
											maxAge:50000,
											//domain:context.request.domain
										});
										context.setCookie(cookie);

										if (this.securedAreas[area].formLogin) {
											var ajax = context.request.isAjax() ;
											if ( ! ajax && type === "HTTP" &&  this.container.get("httpsServer").ready ){
												this.securedAreas[area].redirectHttps(context);
											}else{
												var ur = this.securedAreas[area].overrideURL(context.request);
												context.notificationsCenter.fire("onRequest",container, request, response );
											}
												
										}else{
											context.notificationsCenter.fire("onError",container, {
												status:this.securedAreas[area].Authenticate.statusCode,
												message:"Unauthorized"
											} );
										}
									break;
									default:
										throw {
											message:"Authenticate status code not defined : "+ this.securedAreas[area].Authenticate.statusCode
										}
								}
							}
						}
					}catch (e){
						if (this.securedAreas[area].formLogin) {
							var obj = kernelHttp.setXJSON(context, e);
							var ur = this.securedAreas[area].overrideURL(context.request);
							context.notificationsCenter.fire("onRequest",container, request, response, obj );
							return ;
						}
						context.notificationsCenter.fire("onError",container, {
							xjson:e,	
							status:401,
							message:e
						} );
					}
					return;
				}
			}
			try {
				context.notificationsCenter.fire("onRequest", container, request, response);	
			}catch (e){
				context.notificationsCenter.fire("onError",container, {
					status:500,
					message:e
				});
			}
		}.bind(this));
	};

	
	Firewall.prototype.handlerWebsocket = function(container, context, type){
		var request = context.request.request ;
		var response = context.response.response ;
		// TODO FIREWALL FOR WEBSOCKET
		context.notificationsCenter.fire("onRequest", container, request, response );
	};


	Firewall.prototype.nodeReader = function(obj){
		//console.log(obj.security.firewalls)
		obj = obj.security;
		for (var ele in obj){
			//console.log(obj)
			switch (ele){
				case "firewalls" :
					for ( var firewall in obj[ele] ){
						//console.log(obj[ele][firewall])
						//console.log(obj[ele])
						var param = obj[ele][firewall];
						var area = this.addSecuredArea(firewall);
						for (var ele in param){
							//console.log(ele)
							switch (ele){
								case "pattern":
									area.setPattern(param[ele]);
								break;
								case "anonymous":
								break;
								case "crossDomain":
									area.setCrossDomain(param[ele]);
								break;
								case "form_login":
									if (param[ele].login_path){
										area.setFormLogin(param[ele].login_path);
									}
									if (param[ele].check_path){
										area.setCheckLogin(param[ele].check_path);
									}
									if (param[ele].default_target_path){
										area.setDefaultTarget(param[ele].default_target_path);
									}
								break;
								case "remember_me":
								break;
								case "logout":
								break;
								case "provider" :
									area.setProvider( param[ele]);
								break;
								default:
									if ( ele in nodefony.io.authentication ){
										area.authentication(ele, param[ele]);
									}
							}
						}
					}
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
												this.providers[provider] = new nodefony.usersManager(element[pro][api]);
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

	Firewall.prototype.addProvider = function(name){
		
	};

	Firewall.prototype.addSecuredArea = function(name){
		if ( ! this.securedAreas[name] ){
			this.securedAreas[name] = new securedArea(this.container) ;
			return this.securedAreas[name]
		}else{
			this.logger("securedAreas :" + name +"already exist ")
		}
	};

	Firewall.prototype.logger = function(pci, severity, msgid,  msg){
		var syslog = this.container.get("syslog");
		if (! msgid) msgid = "SERVICE FIREWALL";
		return syslog.logger(pci, severity, msgid,  msg);
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
