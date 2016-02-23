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
		
		this.router.createRoute("request-details", "/request/{uid}/details", {
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
		});

		this.router.createRoute("config-bundle", "/config/{bundle}", {
			controller:"appModule:nav:config"
		});
	


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
		$.ajax("/api/routes",{
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
			$.ajax("/api/config",{
				//dataType:"json",
				success:function(data, status, xhr){
					this.renderDefaultContent("appModule:kernel:kernel",{
						config:data.response.data.kernel,
						bundles:data.response.data.bundles
					});
					//$("table").DataTable();
				}.bind(this),
				error:function(xhr,stats,  error){
					this.logger(error, "ERROR");
				}.bind(this)
			
			})
		}else{
			$.ajax("/api/config/"+bundleName,{
				//dataType:"json",
				success:function(data, status, xhr){
					this.renderDefaultContent("appModule:bundles:bundle",{
						config:data.response.data,
					});
					//$("table").DataTable();
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

		$.ajax("/api/services",{
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
		$.ajax("/api/syslog",{
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
		$.ajax("/api/requests",{
			success:function(data, status, xhr){
				var obj = [];
				for (var res in data.response.data ){
					//console.log(data.response.data[res])
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
		});
		
	};


	/*
	 *
	 */
	controller.prototype.requestAction = function(uid) {

		try {
			$.ajax("/api/request/"+uid,{
				success:function(data, status, xhr){
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
						security:data.response.data.payload["security"],
						payload:data.response.data.payload,
						routing:data.response.data.payload["routing"],
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
						timeRequest:data.response.data.payloadtimeRequest
					});
					var search = this.get("location").search();
					if(search){
						if ("tab" in search ){
							var selector = ".nav-pills a[data-target='#"+search.tab+"']" ;
							$(selector).tab('show')
						}	
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





	
	return controller;
});
