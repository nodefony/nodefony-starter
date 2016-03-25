

nodefony.registerController("api", function(){

		/**
		 *	The class is a **`api` CONTROLLER** .
		 *	@module api
		 *	@main api
		 *	@class api
		 *	@constructor
		 *	@param {class} container   
		 *	@param {class} context
		 *	
		 */
		var apiController = function(container, context){
			this.mother = this.$super;
			this.mother.constructor(container, context);
		};


		apiController.prototype.renderRest = function(data, async){
		
			var context = this.getContext() ;
			var type = context.request.queryGet.format || context.request.headers["X-FORMAT"] || "" ;

			var response = this.getResponse() ;
			if ( data.code ){
				response.setStatusCode(data.code) ;
			}
			switch( type.toLowerCase() ){
				case "application/xml" : 
				case "text/xml" : 
				case "xml" : 
					response.setHeader('Content-Type' , "application/xml"); 
					if (async){
						return this.renderAsync('monitoringBundle:api:api.xml.twig',data);
					}else{
						return this.render('monitoringBundle:api:api.xml.twig',data);
					}
				break
				default:
					response.setHeader('Content-Type' , "application/json");
					if (async){
						return this.renderAsync('monitoringBundle:api:api.json.twig',data);
					}else{
						return this.render('monitoringBundle:api:api.json.twig',data);
					}
			}

			
		};

		/**
		 *
		 *	@method routesAction
		 *
		 */
		apiController.prototype.routesAction = function(name){

			return this.renderRest({
				code:200,
			        type:"SUCCESS",
			        message:"OK",
				data:JSON.stringify(this.get("router").routes)
			});
		};

		/**
		 *
		 *	@method servicesAction
		 *
		 */
		apiController.prototype.servicesAction = function(name){

			var services = {}
			for (var service in nodefony.services){
				var ele = this.container.getParameters("services."+service);
				services[service] = {};
				services[service]["name"] = service;
				if (ele){
					var inject = "";
					var i = 0;
					for (var inj in ele.injections){
						var esc = i === 0 ? "" : " , ";
						inject += esc+inj;
						i++;	
					}
					services[service]["run"] = "CONFIG"	
					services[service]["scope"] = ele.scope === "container" ? "Default container" :	ele.scope ;
					services[service]["calls"] = ele.calls	;
					services[service]["injections"] = inject;
					services[service]["properties"] = ele.properties;
					services[service]["orderInjections"] = ele.orderArguments ? true : false;
				}else{
					services[service]["run"] = "KERNEL"	
					services[service]["scope"] = "KERNEL container"	
				
				}		
			}

			return this.renderRest({
				code:200,
			        type:"SUCCESS",
			        message:"OK",
				data:JSON.stringify(services)
			});
		};


		/**
		 *
		 *	@method syslogAction
		 *
		 */
		apiController.prototype.syslogAction = function(){

			return this.renderRest({
				code:200,
			        type:"SUCCESS",
			        message:"OK",
				data:JSON.stringify(this.get("syslog").ringStack)
			});
		};



		/**
		 *
		 *	@method requestsAction
		 *
		 */
		apiController.prototype.requestsAction = function(){
			var syslog = this.get("kernel").getBundles("monitoring").syslogContext ;
			return this.renderRest({
				code:200,
			        type:"SUCCESS",
			        message:"OK",
				data:JSON.stringify(syslog.ringStack)
			});
		}

		/**
		 *
		 *	@method requestAction
		 *
		 */
		apiController.prototype.requestAction = function(uid){
			var syslog = this.get("kernel").getBundles("monitoring").syslogContext ;
			
			var pdu = null ;
			for (var i= 0 ; i < syslog.ringStack.length ; i++){
				if ( uid == syslog.ringStack[i].uid ){
					var pdu = syslog.ringStack[i];
					break;
				}
			}
			if ( pdu == null ){
				return this.renderRest({
					code:404,
					type:"ERROR",
					message:"not found",
					data:JSON.stringify(null)
				});
			}
			return this.renderRest({
				code:200,
			        type:"SUCCESS",
			        message:"OK",
				data:JSON.stringify(pdu)
			});
		}


		/**
		 *
		 *	@method requestsAction
		 *
		 */
		apiController.prototype.configAction = function(){
			var kernel = this.get("kernel");

			return this.renderRest({
				code:200,
			        type:"SUCCESS",
			        message:"OK",
				data:JSON.stringify({
					kernel:kernel.settings,
					debug:kernel.debug,
					nodejs:process.versions,
					events:this.bundle.infoKernel.events,
					bundles:this.bundle.infoBundles
				})
			});
		}

		/**
		 *
		 *	@method requestsAction
		 *
		 */
		apiController.prototype.bundleAction = function( bundleName ){
			var config = this.getParameters( "bundles."+bundleName );
			var bundle = this.get("kernel").getBundle(bundleName)
			//console.log(bundle)
			var router  = this.get("router");
			//console.log(router)
			var routing = [] ;
			for (var i = 0 ; i < router.routes.length ; i++ ){
				//console.log(ele)
				//console.log(router.routes[ele])
				var bun = router.routes[i].defaults.controller.split(":");
				//console.log(bun[0]);	
				//console.log(bundleName+"Bundle");	
				if( bun[0] === bundleName+"Bundle"){
					routing.push( router.routes[i] );
				}
			}
				//console.log(routing);	
			var security  = this.get("security");
			//console.log(bundle.resourcesFiles.files)


			return this.renderRest({
				code:200,
			        type:"SUCCESS",
			        message:"OK",
				data:JSON.stringify({
					config:bundle.settings,
					routing:routing,
					services:null,
					security:null,
					views:bundle.views,
					entities:bundle.entities,
					fixtures:bundle.fixtures,
					controllers:bundle.controllers,
					events:bundle.notificationsCenter._events,
					waitBundleReady:bundle.waitBundleReady,
					locale:bundle.locale,
					files:bundle.resourcesFiles.files
				})
			});
		}






		/**
		 *
		 *	@method realTimeAction
		 *
		 */
		apiController.prototype.realtimeAction = function(name){

			var service  = this.get("realTime")
			if ( ! service){
				return this.renderRest({
					code:404,
			        	type:"ERROR",
			        	message:"Service realtime not found",
				}); 
			}
			switch(name){
				case "connections":
					var obj ={connections:{}};
					for (var connect in service.connections.connections){
						var conn = service.connections.connections[connect]; 
							obj.connections[connect] = {
								remote:conn.remote,
								nbClients:Object.keys(conn.clients).length
							};
					}
					try {
						return this.renderRest({
							code:200,
							type:"SUCCESS",
							message:"Operation Réussi",
							data:JSON.stringify(obj) //JSON.stringify(service.connections)
						});

					}catch(e){
						this.logger(e, "ERROR");
						this.realtimeAction("error");
					}

				break;
				case "error" :
				default:
					return this.renderRest({
						code:404,
			        		type:"ERROR",
			        		message:"not found",
					});
			}
			
		};



		/**
		 *
		 *	@method 
		 *
		 */
		apiController.prototype.usersAction = function(name){

			var orm = this.getORM() ;

			var nodefonyDb = orm.getConnection("nodefony") ;

			var users = null ;
			nodefonyDb.query('SELECT * FROM users')
			.then(function(result){
				users = result[0];
			}.bind(this))
			.done(function(){
				this.renderRest({
					code:200,
					type:"SUCCESS",
					message:"OK",
					data:JSON.stringify(users)
				}, true);
			}.bind(this))

		}

		/**
		 *
		 *	@method 
		 *
		 */
		apiController.prototype.sessionsAction = function(name){

			var orm = this.getORM() ;

			var nodefonyDb = orm.getConnection("nodefony") ;

			var joins = null ;
			nodefonyDb.query('SELECT * FROM sessions S LEFT JOIN users U on U.id = S.user_id ')
			.then(function(result){
				joins = result[0];
				for (var i = 0 ; i < joins.length ; i++){
					joins[i].metaBag = JSON.parse( joins[i].metaBag )
				}
			}.bind(this))
			.done(function(){
				this.renderRest({
					code:200,
					type:"SUCCESS",
					message:"OK",
					data:JSON.stringify(joins)
				}, true);
			}.bind(this))

		}


		
		return apiController;
});
