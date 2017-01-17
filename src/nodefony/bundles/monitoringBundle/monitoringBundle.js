try {
	var Git = require("nodegit");
}catch(e){
	console.log(e);
}
const useragent = require('useragent');

nodefony.registerBundle ("monitoring", function(){

	/**
	 *	The class is a **`monitoring` BUNDLE** .
	 *	@module NODEFONY
	 *	@main NODEFONY
	 *	@class monitoring
	 *	@constructor
	 *	@param {class} kernel
	 *	@param {class} container
	 *	
	 */
	var monitoring = class monitoring extends nodefony.Bundle {

		constructor(name, kernel, container ){

			super(name, kernel, container);

			// load bundle library 
			//this.autoLoader.loadDirectory(this.path+"/core");
				
			/*
		 	*	If you want kernel wait monitoringBundle event <<onReady>> 
		 	*
		 	*      this.waitBundleReady = true ; 
		 	*/	
			
			this.infoKernel = {};
			this.infoBundles = {};
			
			// MANAGE GIT
			this.gitInfo = {} ;
			try {
				Git.Repository.open(this.kernel.rootDir).then( (repo) => {
					repo.getCurrentBranch().then((reference) => {
						this.gitInfo.currentBranch = reference.shorthand() ;	
					});	
				});
			}catch(e){
				this.logger(e, "WARNING");
				this.gitInfo.currentBranch = null ;	
			}

			this.kernel.listen(this, "onPreBoot", (kernel) => {

				this.templating = this.get("templating");

				this.infoKernel.events = {} ;
				for(var event in kernel.notificationsCenter.event._events ){
					switch (event){
						case "onPreBoot":
							this.infoKernel.events[event] = {
								fire:kernel.preboot,
								nb:1,
								listeners:kernel.notificationsCenter.event._events[event].length
							} ;
						break;
						default:
							this.infoKernel.events[event] = {
								fire:false,
								nb:0,
								listeners:kernel.notificationsCenter.event._events[event].length
							} ;
							kernel.listen(kernel ,event, function(){
								var ele =  arguments[0]  ;
								this.infoKernel.events[ele].fire= true;
								this.infoKernel.events[ele].nb = ++this.infoKernel.events[ele].nb;
							}.bind(this, event ) );
					}
				}
			});


			this.kernel.listen(this, "onPostReady", (kernel) => {

				if ( this.settings.storage.active ){
					this.storageProfiling = this.settings.storage.requests ;
				}else{
					this.storageProfiling = null ;	
				}

				var ormName = this.kernel.settings.orm ;
				this.orm = this.get(ormName);
				this.requestEntity = this.orm.getEntity("requests"); 

				this.kernelSetting = nodefony.extend(true, {},this.kernel.settings, {
					templating: this.kernel.settings.templating + " " + this.templating.version,
					orm:this.orm ? this.kernel.settings.orm +" "+this.orm.engine.version : ""
				});
				
				for(var bund in kernel.bundles ){
					this.infoBundles[bund] = {} ;
					this.infoBundles[bund].waitBundleReady = kernel.bundles[bund].waitBundleReady;
					this.infoBundles[bund].version = kernel.bundles[bund].settings.version;
					if ( kernel.bundles[bund].settings  ) {
						this.infoBundles[bund].version = kernel.bundles[bund].settings.version;
					}else{
						this.infoBundles[bund].version = "1.0" ;
					}	
				}
				//console.log(this.infoBundles);
				for(var event in this.kernel.notificationsCenter.event._events ){
					switch (event){
						case "onReady":
							this.infoKernel.events[event] = {
								fire:kernel.ready,
								nb:0,
								listeners:this.kernel.notificationsCenter.event._events[event].length
							} ;
						break;
						default:
							this.infoKernel.events[event] = nodefony.extend( true, this.infoKernel.events[event],{
								listeners:this.kernel.notificationsCenter.event._events[event].length
							}) ;
					}
				}


				if ( this.settings.debugBar ) {
					this.logger("ADD DEBUG BAR MONITORING", "WARNING");
					this.bundles = function(){
						var obj = {};
						for (var bundle in this.kernel.bundles ){
							obj[bundle] = {
								name:this.kernel.bundles[bundle].name,
								version:this.infoBundles[bundle].version
							};
						}
						return obj;
					}.call(this);
					this.syslogContext = new nodefony.syslog({
						moduleName:"CONTEXT",
						maxStack: 50,
						defaultSeverity:"INFO"	
					}); 
					this.env = this.kernel.environment ;
					this.app = this.getParameters("bundles.App").App ;
					this.node = process.versions ;
					this.upload = this.container.get("upload");
					this.translation = this.container.get("translation");
					this.sessionService = this.container.get("sessions");
					this.domain =  this.translation.defaultDomain ;
					this.nbServices = Object.keys(nodefony.services).length ;

					//ORM
					var ORM = {} ;
					if (this.orm){
						ORM = {
							name:this.orm.name,
							version:this.orm.engine.version,
							connections:{}
						};
					}
					//ORM
					var templating = {} ;
					if ( this.templating ){
						templating = {
							name:this.templating.name,
							version:this.templating.version
						};
					}

					for (var connection in this.orm.connections){
						ORM.connections[connection] = {
							state:this.orm.connections[connection].state,
							name:this.orm.connections[connection].name,
							type:this.orm.connections[connection].type,
							db:{
								config:this.orm.connections[connection].db.config,
								options:this.orm.connections[connection].db.options,
								models:{}
							}
						} ;
						for (var model in this.orm.connections[connection].db.models){
							ORM.connections[connection].db.models[model] ={
								name:model
							};
						}
					}

					this.service = {
						upload : {
							tmp_dir:this.upload.config.tmp_dir,
							max_size:this.upload.config.max_filesize
						},
						translation:{
							defaultLocale:this.translation.defaultLocale,
							defaultDomain: this.domain	
						},
						session:{
							storage:this.sessionService.settings.handler,
							path:this.sessionService.settings.save_path
						},
						ORM:ORM,
						templating:templating
					}; 
					this.security = function(){
						var obj = {};
						var firewall = this.container.get("security");
						if (firewall){
							for (var area in firewall.securedAreas ){
								//console.log(firewall.securedAreas[area])
								obj[area] = {};
								obj[area].pattern = firewall.securedAreas[area].regPartten;
								obj[area].factory = firewall.securedAreas[area].factory ? firewall.securedAreas[area].factory.name : null ;
								obj[area].provider = firewall.securedAreas[area].provider ? firewall.securedAreas[area].provider.name : null ;
								obj[area].context = firewall.securedAreas[area].sessionContext;
							}
						}
						return obj ; 
					}.call(this);	
				}
			}); 

			this.kernel.listen(this, "onServerRequest",(request/*, response, logString, d*/) => {
				request.nodefony_time = new Date().getTime();	
			});


			this.kernel.listen(this, "onRequest",(context) => {

				context.profiling = null ;
				var agent = null ;
				var tmp = null ;
				var myUserAgent  = null; 
				context.storage = this.isMonitoring(context) ;

				if ( ! context.storage  ){
					if ( ! this.settings.debugBar ){
						return ;
					}
				}

				try {
					if ( context.request.headers ){
						agent = useragent.parse(context.request.headers['user-agent']);
						tmp = useragent.is(context.request.headers['user-agent']);
					}else{
						agent = useragent.parse(context.request.httpRequest.headers['user-agent']);
						tmp = useragent.is(context.request.httpRequest.headers['user-agent']);
					}

					var client = {};
					for (var ele in tmp ){
						if ( tmp[ele] === true ){
							client[ele] = 	tmp[ele];
						}
						if (ele === "version"){
							client[ele] = tmp[ele];	
						}
					}
					myUserAgent  ={
						agent: agent.toAgent(),
						toString:agent.toString(),
						version:agent.toVersion(),
						os:agent.os.toJSON(),
						is:client
					};
				}catch(e){
					myUserAgent  ={
						agent: null,
						toString:null,
						version:null,
						os:null,
						is:null
					};
				}

				var settingsAssetic = context.container.getParameters("bundles.assetic") ;

				var trans = context.get("translation");
			 	
				context.profiling = {
					id:null,
					bundle:context.resolver.bundle.name,
					bundles:this.bundles,
					cdn:settingsAssetic.CDN || null ,
					pwd:process.env.PWD,
					node:this.node,
					services:this.service,
					git:this.gitInfo,
					nbServices:this.nbServices,
					security:this.security,
					route:{
						name:context.resolver.route.name,
						uri:context.resolver.route.path,
						variables:context.resolver.variables,
						pattern:context.resolver.route.pattern.toString(),	
						defaultView:context.resolver.defaultView
					},
					varialblesName:context.resolver.route.variables,
					kernelSettings:this.kernelSetting,
					environment:this.env,
					debug:this.kernel.debug,
					appSettings:this.app,
					queryPost:  context.request.queryPost ,	
					queryGet:  context.request.queryGet ,
					protocole:  context.type ,
					cookies:  context.cookies ,
					events:{},
					twig:[],
					locale:{
						default:trans.defaultLocale,
						domain:trans.defaultDomain
					},
					userAgent:myUserAgent
				};


				for(var event in context.notificationsCenter.event._events ){
					if ( event === "onRequest"){
						context.profiling.events[event] = {
							fire:true,
							nb:1,
							listeners:context.notificationsCenter.event._events[event].length
						} ;
					}else{
						context.profiling.events[event] = {
							fire:false,
							nb:0,
							listeners:context.notificationsCenter.event._events[event].length
						} ;
					}
					//console.log(event)
					context.listen(context ,event, function(){
						var ele =  arguments[ 0]  ;
						this.profiling.events[ele].fire= true;
						this.profiling.events[ele].nb = ++this.profiling.events[ele].nb;
					}.bind(context, event ) );
				}
				var secu = null ;
				if ( context.security ){
					secu = context.session.getMetaBag("security");
					context.profiling.context_secure = {
						name: context.security.name ,
						factory : context.security.factory.name,
						token:secu  ? secu.tokenName : context.security.factory.token,
						user:context.user
					};
				}else{
					secu = context.session ? context.session.getMetaBag("security") : null;
					if ( secu ){
						context.profiling.context_secure = {
							name:	"OFF",
							factory : null,
							token:null,
							user:context.user
						};
					}else{
						context.profiling.context_secure = null ;	
					}
				}
					
				if ( context.resolver.route.defaults ) {
					var tab = context.resolver.route.defaults.controller.split(":") ;
					var contr   =    ( tab[1] ? tab[1] : "default" );
					context.profiling.routeur =  {
						bundle : context.resolver.bundle.name+"Bundle" ,
						action : tab[2]+"Action" ,
						pattern : context.resolver.route.defaults.controller ,
						Controller : contr+"Controller"
					};
				}
				if (context.proxy){
					context.profiling.proxy = context.proxy ;
				}else{
					context.profiling.proxy = null ;
				}

				if ( context.session ){
					context.profiling.session = {
						name:context.session.name,
						id:context.session.id,
						metas:context.session.metaBag(),
						attributes:context.session.attributes(),
						flashes:context.session.flashBags(),
						context:context.session.contextSession
					};
				}
				
				if ( context.request.queryFile ){
					context.profiling.queryFile = {};
					for (let ele in context.request.queryFile){
						context.profiling.queryFile[ele] = {
							path		: context.request.queryFile[ele].path,
							mimetype	: context.request.queryFile[ele].mimeType,
							length		: context.request.queryFile[ele].lenght,
							fileName	: context.request.queryFile[ele].fileName
						};
					}
				}
				context.profiling.context = {
					type:context.type,	
					isAjax:context.isAjax,
					secureArea:context.secureArea,
					domain:context.domain,
					url:context.url,
					remoteAddress:context.remoteAddress  ,
					crossDomain:context.crossDomain
				};

				var content = null ;
				switch (context.type){
					case "HTTP":
					case "HTTPS":
						context.profiling.timeStamp = context.request.request.nodefony_time ;
						switch (context.request.contentType){
							case "multipart/form-data":
								try{
									content = JSON.stringfy(context.request.queryFile);
								}catch(e){
									content = null ;
								}
							break;
							case "application/xml":
							case "text/xml":
							case "application/json":
							case "text/json":
							case "application/x-www-form-urlencoded":
								content = context.request.body.toString(context.request.charset);
							break;
							default:
								content = null ;
						}
						context.profiling.request = {
							url:context.url,
							method:context.request.method,
							protocol:context.type,
							remoteAddress:context.request.remoteAddress,
							queryPost:context.request.queryPost,
							queryGet:context.request.queryGet,
							headers:context.request.headers,
							crossDomain:context.crossDomain,
							dataSize:context.request.dataSize,
							content:content,
							"content-type":context.request.contentType
						};
						context.profiling.response = {	
							statusCode:context.response.statusCode,
							message:context.response.response.statusMessage,
							size:context.response.body.length ,
							encoding:context.response.encoding,
							"content-type":context.response.response.getHeader('content-type')
						};
						
						context.listen(this, "onSendMonitoring", (response/*, Context*/) => {
							context.profiling.timeRequest = (new Date().getTime() ) - (context.request.request.nodefony_time )+" ms";
							context.profiling.response = {
								statusCode:response.statusCode,
								message:response.response.statusMessage,
								size:response.body.length ,
								encoding:response.encoding,
								"content-type":response.response.getHeader('content-type'),
								headers:response.response._headers	
							};
							if ( context.storage ){
								this.saveProfile(context, (error/*, res*/) => {
									if (error){
										this.kernel.logger(error);
									}

									if ( ! context.timeoutExpired  ){

										if( ! context.isAjax && context.showDebugBar /*&& context.profiling.route.name !== "monitoring"*/ ){
											var View = this.container.get("httpKernel").getView("monitoringBundle::debugBar.html.twig");
											if (response && typeof response.body === "string" && response.body.indexOf("</body>") > 0 ){
												this.templating.renderFile(View, context.extendTwig(context.profiling),function(error , result){
													if (error){
														throw error ;
													}
													response.body = response.body.replace("</body>",result+"\n </body>") ;
												});
											}else{
												//context.setXjson(context.profiling);
											}
										}else{
											//context.setXjson(context.profiling);	
										}
									}

									/*
 	 						 		*  WRITE RESPONSE
 	 						 		*/  
									if ( context && context.response ){
										context.response.write();
										// END REQUEST
										return context.close();

									}
									if ( error ){
										throw new Error ("MONITORING CAN SAVE REQUEST") ;
									}
									if ( ( ! context ) ||  ( ! context.response ) ){
										throw new Error ("MONITORING REQUEST ALREADY SENDED !!! ") ;	
									}
								});
							}else{
								if ( ! context.timeoutExpired  ){

									if( ! context.isAjax && context.showDebugBar /*&& context.profiling.route.name !== "monitoring"*/ ){
										var View = this.container.get("httpKernel").getView("monitoringBundle::debugBar.html.twig");
										if (response && typeof response.body === "string" && response.body.indexOf("</body>") > 0 ){
											this.templating.renderFile(View, context.extendTwig(context.profiling),function(error , result){
												if (error){
													throw error ;
												}
												response.body = response.body.replace("</body>",result+"\n </body>") ;
											});
										}else{
											//context.setXjson(context.profiling);
										}
									}else{
										//context.setXjson(context.profiling);	
									}
								}
							}
						});
					break;
					case "WEBSOCKET":
					case "WEBSOCKET SECURE":
						//console.log(context)
						context.profiling.timeStamp = context.request.nodefony_time ;
						var conf = null ;
						var configServer = {};
						for (conf in context.request.serverConfig){
							if ( conf === "httpServer"){
								continue ;
							}
							configServer[conf] = context.request.serverConfig[conf];	
						}

						//console.log(context.request.remoteAddress)
						//console.log(context.profiling["context"].remoteAddress)
						context.profiling.request = {
							url:context.url,
							headers:context.request.httpRequest.headers,
							method:context.request.httpRequest.method,
							protocol:context.type,
							remoteAddress:context.request.remoteAddress,
							serverConfig:configServer,
						};
						var config = {};
						for (conf in context.response.config){
							if ( conf === "httpServer"){
								continue ;
							}
							config[conf] = 	context.response.config[conf];	
						}
						context.profiling.response = {
							statusCode:context.response.statusCode,	
							connection:"WEBSOCKET",
							config:config,
							webSocketVersion:context.response.webSocketVersion,
							message:[],
						};
							
						context.listen(this,"onMessage", (message, Context, direction ) => {
							var ele = {
								date:new Date().toTimeString(),
								data:message,
								direction:direction
							};

							if (  JSON.stringify(context.profiling).length  < 60000 ){
								if (message && context.profiling ){
									context.profiling.response.message.push( ele ) ;
								}
							}else{
								context.profiling.response.message.length = 0 ;
								context.profiling.response.message.push( ele ) ;	
							}
							if ( context.storage ){	
								this.updateProfile(context,(error/*, result*/) => {
									if (error){
										this.kernel.logger(error);
									}
								});
							}
						});
						
						context.listen(this, "onFinish", (/*Context, reasonCode, description*/ ) => {
							if ( context.profiling ){
								context.profiling.response.statusCode = context.connection.state  ;	
							}
							if ( context.storage ){
								this.updateProfile(context, (error/*, result*/) => {
									if (error){
										this.kernel.logger(error);
									}
									if (context){
										delete context.profiling ;	
									}
								});
							}
						});	

						if ( context.storage ){
							this.saveProfile(context, (error/*, result*/) => {
								if (error){
									this.kernel.logger(error);
								}
							});
						}
					break;
				}

				context.listen(this, "onView", (result, Context, view, viewParam) => {
					try {
						JSON.stringify( viewParam ) ;
					}catch(e){
						viewParam = "view param can't be parse" ;
					}
					context.profiling.twig.push({
						file:view,
						//param:viewParam
					});
				});
			});
		}		

		isMonitoring (context){
			/*var stop = this.storageProfiling && this.settings.debugBar ;
			if( ! stop){
				return false;
			} */

			if ( ! context.resolver.route ){
				return false ;
			}
			if ( context.resolver.route.name.match(/^monitoring-/) ){
				return false;
			}

			if ( ! context.resolver.resolve ){
				return false;
			}
			return this.settings.storage.active ;
		}

		updateProfile ( context , callback){
			if ( context.profiling) {
				switch( this.storageProfiling ){
					case "syslog" :
						context.profilingObject.payload = context.profiling ;
						return ;
					case "orm":
						this.requestEntity.update({
								data	: JSON.stringify(context.profiling),
								state	: context.profiling.response.statusCode
							}, {
  							where: {
    								id:context.profiling.id,
  							}
						}).then((result) => {
							this.kernel.logger("ORM REQUEST UPDATE ID : " + context.profiling.id,"DEBUG");
							callback(null, result);
						}).catch((error) => {
							this.kernel.logger(error);
							callback(error, null) ;
						});
					break;
					default:
						callback(new Error("No PROFILING"), null);
				}	
			}
		}

		saveProfile (context , callback){
			if (context.profiling){
				switch( this.storageProfiling ){
					case "syslog" :
						this.syslogContext.logger(context.profiling);
						var logProfile = this.syslogContext.getLogStack();
						context.profiling.id = logProfile.uid ;
						callback(null, logProfile);
						return ;
					case "orm":
						var user = null ;
						var data = null ;	
						//console.log(context.profiling)
						// DATABASE ENTITY
						if ( context.profiling.context_secure ){
							user = context.profiling.context_secure.user ? context.profiling.context_secure.user.username : "anonymous" ; 
						}else{
							user = "none" ;	
						}
						try {
							data = JSON.stringify(context.profiling); 
						}catch(e){
							this.kernel.logger("JSON.stringify  :"  ,"ERROR");
							console.trace(e);
						}
						this.requestEntity.create({
							id		: null,
							remoteAddress	: context.profiling.context.remoteAddress,
							userAgent	: context.profiling.userAgent.toString,
							url		: context.profiling.request.url,
							route		: context.profiling.route.name,
							method		: context.profiling.request.method,
							state		: context.profiling.response.statusCode,
							protocole	: context.profiling.context.type,
							username	: user,
							data		: data 
						},{isNewRecord:true})
						.then((request) => {
							this.kernel.logger("ORM REQUEST SAVE ID :" + request.id ,"DEBUG");
							if ( context && context.profiling){
								context.profiling.id = request.id ;
							}
							callback(null ,  request);
						}).catch((error) => {
							console.log(error);
							this.kernel.logger(error);
							callback(error, null);
						});
					break;
					default:
						callback(new Error("No PROFILING"), null);
				}
			}
		}
	};

	return monitoring;
});
