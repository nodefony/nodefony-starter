/**
 * 
 */
stage.registerController("navController", function() {
	/**
	 * 
	 */
	var controller = function(container, module) {
		this.mother = this.$super;
		this.mother.constructor();
		
		this.config = this.module.config;
		this.router = container.get("router");



		// ROUTES 
		this.router.createRoute("services", "/services", {
			controller:"appModule:nav:services"
		});
		this.router.createRoute("routing", "/routing", {
			controller:"appModule:nav:routing"
		});

		this.router.createRoute("syslog", "/syslog", {
			controller:"appModule:nav:syslog"
		});

		this.router.createRoute("configuration", "/config", {
			controller:"appModule:nav:config"
		});

		this.router.createRoute("requests", "/requests", {
			controller:"appModule:nav:requests"
		});

		this.router.createRoute("request", "/request/{uid}", {
			controller:"appModule:nav:request"
		});

		this.router.createRoute("bundles", "/bundles", {
			controller:"appModule:nav:config"
		});
		this.router.createRoute("users", "/users", {
			controller:"appModule:nav:users"
		});
		this.router.createRoute("sessions", "/sessions", {
			controller:"appModule:nav:sessions"
		});
		this.router.createRoute("firewall", "/firewall", {
			controller:"appModule:nav:firewall"
		});




		this.router.createRoute("config-bundle", "/config/{bundle}", {
			controller:"appModule:nav:config"
		});


		
		/*this.router.createRoute("request-details", "/request/{uid}/details", {
			controller:"appModule:nav:request"
		});

		this.router.createRoute("request-details-request", "/request/{uid}/details/request", {
			controller:"appModule:nav:request"
		});

		this.router.createRoute("request-details-response", "/request/{uid}/details/response", {
			controller:"appModule:nav:request"
		});

		this.router.createRoute("request-details-flashes", "/request/{uid}/details/flashes", {
			controller:"appModule:nav:request"
		});

		this.router.createRoute("request-session", "/request/{uid}/session", {
			controller:"appModule:nav:request"
		});

		this.router.createRoute("request-firewall", "/request/{uid}/firewall", {
			controller:"appModule:nav:request"
		});

		this.router.createRoute("request-twig", "/request/{uid}/twig", {
			controller:"appModule:nav:request"
		});*/

		


		this.kernel.listen(this, "onUrlChange", function(url, fullurl, cache) {
			// scroll to top for scrollable content
			$("body").scrollTop(0);
			
			// active the current menu
			var items = $("#main_nav a.list-group-item");
			items.each(function() {
				var href = $(this).attr("href").substring(1);
				if (href === url) {
					items.removeClass("active");
					$(this).addClass("active");
					
					// case of collapsible menu
					if ($(this).parent().hasClass("collapse")) {
						$(this).parent().collapse("show");
					} else {
						$("#main_nav .collapse.in").collapse("hide");
					}
				}
			});	
		});
	};
	
	/**
	 * extract menu from config file
	 */
	var extractMenu = function(config) {
		try {
			var components = config.content.bundles.bundle;
			var navigation = null;
			
			(stage.typeOf(components) === "array")?
				navigation = components :
				navigation = new Array(components);
				
			return navigation;
		} catch(e) {
			this.logger("Error while parsing app config file", "ERROR");
		}
	};
	
	/**
	 * 
	 */
	controller.prototype.indexAction = function() {		
		var nav = extractMenu.call(this, this.config);
		var section = this.get("section");
		var navView = this.renderPartial("appModule::navigation", {
			"nav": nav,
			"navCssId": "main_nav",
			"environment": this.get("kernel").environment
		});
		
		this.render(section.aside, navView)
		
		// collapsible menu behaviour
		$("#main_nav .collapse").on("hidden.bs.collapse", function () {
			$(this).prev().removeClass("focus");
		});
		
		$("#main_nav .collapse").on("hide.bs.collapse", function () {
			$(this).prev().find(".collapse-icon").removeClass("fa-rotate-90");
		});
		
		$("#main_nav .collapse").on("show.bs.collapse", function () {
			$(this).prev().addClass("focus");
			$(this).prev().find(".collapse-icon").addClass("fa-rotate-90");
		});
	};

	/*
	 *
	 */
	controller.prototype.routingAction = function() {
		$.ajax("/nodefony/api/routes",{
			//dataType:"json",
			success:function(data, status, xhr){
				this.renderDefaultContent("appModule:route:routing",{
					routes:data.response.data
				});
				$("table").DataTable();
			}.bind(this),
			error:function(xhr,stats,  error){
				this.logger(error, "ERROR");
			}.bind(this)
		
		})

	};

	controller.prototype.configAction = function(bundleName) {
		if ( ! bundleName ){
			$.ajax("/nodefony/api/config",{
				//dataType:"json",
				success:function(data, status, xhr){
					//console.log(data.response.data)
					this.renderDefaultContent("appModule:kernel:kernel",{
						config:data.response.data.kernel,
						debug:data.response.data.debug,
						nodejs:data.response.data.nodejs,
						events:data.response.data.events,
						bundles:data.response.data.bundles
					});
					var search = this.get("location").search();
					if(search){
						if ("tab" in search ){
							var selector = "a[data-target='#"+search.tab+"']" ;
							$(selector).tab('show')
						}	
					}
				}.bind(this),
				error:function(xhr,stats,  error){
					this.logger(error, "ERROR");
				}.bind(this)
			
			})
		}else{
			$.ajax("/nodefony/api/config/"+bundleName,{
				//dataType:"json",
				success:function(data, status, xhr){
					//console.log(data.response.data.routing)
					this.renderDefaultContent("appModule:bundles:bundle",{
						name: data.response.data.config.name ,
						bundleName:bundleName,
						locale:data.response.data.config.locale,
						version:data.response.data.config.version,
						routing:data.response.data.routing,
						//files:data.response.data.files
					});
					$("#json").JSONView(  data.response.data.config );
					$("#json").JSONView( "collapse" );
					$("#tableRouting").DataTable();
					$("#filesData").JSONView(  data.response.data.files );
					$("#filesData").JSONView('toggle',2);

				}.bind(this),
				error:function(xhr,stats,  error){
					this.logger(error, "ERROR");
				}.bind(this)
			
			})
		
		}
	};



	/*
	 *
	 */
	controller.prototype.servicesAction = function() {

		$.ajax("/nodefony/api/services",{
			//dataType:"json",
			success:function(data, status, xhr){
				this.renderDefaultContent("appModule:services:services",{
					services:data.response.data
				});
				$("table").DataTable();
			}.bind(this),
			error:function(xhr,stats,  error){
				this.logger(error, "ERROR");
			}.bind(this)
		
		})
	};

	/*
	 *
	 */
	controller.prototype.syslogAction = function() {
		$.ajax("/nodefony/api/syslog",{
			success:function(data, status, xhr){
				this.module.serverSyslog.loadStack( data.response.data, true ,function(pdu){
					pdu.timeago = jQuery.timeago(pdu.timeStamp)
				})
				this.renderDefaultContent("appModule:syslog:syslog",{
					ringStack:this.module.serverSyslog.ringStack.reverse()
				});
				$("table").DataTable();
			}.bind(this),
			error:function(xhr,stats,  error){
				this.logger(error, "ERROR");
			}.bind(this)
		});
	};

	/*
	 *
	 */
	controller.prototype.requestsAction = function() {
		
		this.renderDefaultContent("appModule:request:requests",{
			requests:[]
		});
		$("table").DataTable({
			"processing": true,
			"serverSide": true,
			"ajax": {
				url:"/nodefony/api/requests",
				data:function ( d ) {
					d.type = "dataTable";
				},
				"type": "GET",
				//"dataSrc": "response.data",
			},
			"order": [[ 1, "desc" ]],
			"columns": [
            			{ "name":"id","data": "uid" },
            			{ "name":"createdAt", "data": "timeStamp" },
            			{ "name":"url","data": "url" },
            			{ "name":"route","data": "route" },
            			{ "name":"method","data": "method" },
            			{ "name":"state","data": "state" },
            			{ "name":"protocole","data": "protocole" },
            			{ "name":"username", "data": "username" }
        		],
			"rowCallback": function( row, data ) {
				$(row).click(function(){
					this.redirect( this.generateUrl("request",{uid:data.uid}) ) ;
				}.bind(this))
			}.bind(this)
		});

		// SYSLOG
		/*$.ajax("/nodefony/api/requests",{
			success:function(data, status, xhr){
				var obj = [];
				for (var res in data.response.data ){
					obj.push({
						date: new Date( data.response.data[res].timeStamp ),
						url:data.response.data[res].payload["request"].url,
						method:data.response.data[res].payload["request"].method,
						routing:data.response.data[res].payload["route"].name,
						code:data.response.data[res].payload["response"].statusCode,
						context:data.response.data[res].payload["context"],
						user:data.response.data[res].payload["security"].user ? data.response.data[res].payload["security"].user.username : null ,
						uid:data.response.data[res].uid
					})
				}
				this.renderDefaultContent("appModule:request:requests",{
					requests:obj
				});
				$("table").DataTable({
					"paging":   true,
					"ordering": true,
					"info":     true
				});
			}.bind(this),
			error:function(xhr,stats,  error){
				this.logger(error, "ERROR");
			}.bind(this)
		});*/
	};


	/*
	 *
	 */
	controller.prototype.requestAction = function(uid) {

		try {
			$.ajax("/nodefony/api/request/"+uid,{
				success:function(data, status, xhr){
					//console.log(data.response.data.payload)
					//
					if (data.response.data.payload["response"].message){
						try {
							var message = data.response.data.payload["response"].message;
							var parse =[];
							for (var i = 0 ; message.length ; i++){
								var ele = {} ;
								ele["direction"] = message[i].direction ;
								if ( message[i].direction === "RECEIVE" ){
									if (message[i].data.utf8Data){
										//ele["type"] = message[i].data.type ;
										try {
											ele["data"]  = JSON.parse(message[i].data.utf8Data);
										}catch(e){
											ele["utf8Data"]  = message[i].data.utf8Data;	
										}
									}
								}
								if ( message[i].direction === "SEND" ){
									if (message[i].data ){
										//ele["type"] = stage.typeOf(message[i].data) ;
										try {
											ele["data"]  = JSON.parse(message[i].data);
										}catch(e){
											ele["data"]  = message[i].data;
										}
										
									}
								}
								parse.push(ele);	
							}
							//console.log(message)
						}catch(e){
							var message = data.response.data.payload["response"].message ;
						}
					}
					//console.log(data.response.data.payload)

					this.renderDefaultContent("appModule:request:request",{
						uid:uid,
						date: new Date( data.response.data.payload.timeStamp ),
						url:data.response.data.payload["request"].url,
						method:data.response.data.payload["request"].method,
						status:data.response.data.payload["response"].statusCode,
						ip:data.response.data.payload["request"].remoteAdress,
						request:data.response.data.payload["request"],
						response:data.response.data.payload["response"],
						security:data.response.data.payload["context_secure"],
						area_security:data.response.data.payload["security"],
						//payload:data.response.data.payload,
						router:data.response.data.payload["routeur"],
						route:data.response.data.payload["route"],
						routeParmeters:data.response.data.payload["routeParmeters"],
						cookies:data.response.data.payload.cookies,
						queryPost:data.response.data.payload.queryPost,
						queryGet:data.response.data.payload.queryGet,
						queryFile:data.response.data.payload.queryFile,
						session:data.response.data.payload.session,
						proxy:data.response.data.payload.proxy,
						context:data.response.data.payload.context,
						events:data.response.data.payload.events,
						protocole:data.response.data.payload.protocole,
						twig:data.response.data.payload.twig,
						timeRequest:data.response.data.payloadtimeRequest,
						message:message
					});
					var search = this.get("location").search();
					if(search){
						if ("tab" in search ){
							var selector = " a[data-target='#"+search.tab+"']" ;
							$(selector).tab('show')
						}	
					}
					if ( parse ){
						$("#wsMessage").DataTable();
						$("#jsonMessage").JSONView(  parse  );
						$("#filesData").JSONView('toggle',2);
					}
	
				}.bind(this),
				error:function(xhr,stats,  error){
					this.logger(error, "ERROR");
					throw error ;
				}.bind(this)
			});
		}catch(error){
			throw error ;	
		}
	};



	/*
	 *
	 */
	controller.prototype.usersAction = function() {

		$.ajax("/nodefony/api/users",{
			//dataType:"json",
			success:function(data, status, xhr){
				this.renderDefaultContent("appModule::users",{
					users:data.response.data
				});
				$("table").DataTable();
			}.bind(this),
			error:function(xhr,stats,  error){
				this.logger(error, "ERROR");
			}.bind(this)
		
		})
	};

	/*
	 *
	 */
	controller.prototype.sessionsAction = function() {

		
		this.renderDefaultContent("appModule::sessions",{
			sessions:[]
		});

		$("table").DataTable({
			"processing": true,
			"serverSide": true,
			"ajax": {
				url:"/nodefony/api/sessions",
				data:function ( d ) {
					d.type = "dataTable";
				},
				"type": "GET",
			},
			"order": [[ 0, "desc" ]],
			"columns": [
            			{ "name":"updatedAt", "data": "updatedAt" },
            			{ "name":"username", "data": "user.username" },
            			{ "name":"metaBag","data": "metaBag.request" },
            			{ "name":"session_id", "data": "session_id" },
            			{ "name":"context", "data": "context" },
            			{ "name":"metaBag", "data": "metaBag.remoteAddress" },
            			{ "name":"Attributes","data": "Attributes.lang" },
            			{ "name":"ua","data": "metaBag.user_agent" },
        		],
			"rowCallback": function( row, data ) {
				$(row).click(function(){
					//this.redirect( this.generateUrl("request",{uid:data.uid}) ) ;
				}.bind(this))
			}.bind(this)
		});
		
	};
	
	/*
	 *
	 */
	controller.prototype.firewallAction = function() {

		$.ajax("/nodefony/api/security",{
			//dataType:"json",
			success:function(data, status, xhr){
				this.renderDefaultContent("appModule:security:firewall",{
					security:data.response.data
				});
			}.bind(this),
			error:function(xhr,stats,  error){
				this.logger(error, "ERROR");
			}.bind(this)
		})
	};

	return controller;
});
