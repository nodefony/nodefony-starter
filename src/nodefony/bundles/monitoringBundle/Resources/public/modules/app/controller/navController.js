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
			var components = config.content.components.component;
			var navigation = undefined;
			
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
		var nav = extractMenu(this.config);
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
						contextSecurity:data.response.data[res].payload["security"].name,
						routing:data.response.data[res].payload["routing"].name,
						code:data.response.data[res].payload["response"].statusCode,
						contextType:data.response.data[res].payload["context"],
						sessionName:data.response.data[res].payload["session"].name,
						sessionContext:data.response.data[res].payload["session"].metas.context,
						user:data.response.data[res].payload["security"].user ? data.response.data[res].payload["security"].user.username : null ,
						uid:data.response.data[res].uid
					})
				}
				this.renderDefaultContent("appModule:request:requests",{
					requests:obj
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
	controller.prototype.requestAction = function(uid) {
		$.ajax("/api/request/"+uid,{
			success:function(data, status, xhr){
				console.log(data.response.data.payload["request"].url)			
				this.renderDefaultContent("appModule:request:request",{
					url:data.response.data.payload["request"].url,
					payload:data.response.data.payload
				});
			}.bind(this),
			error:function(xhr,stats,  error){
				this.logger(error, "ERROR");
			}.bind(this)
		});
	};



	
	return controller;
});
