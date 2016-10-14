/**
 * 
 */
stage.registerController("dashboardController", function() {
	/**
	 * 
	 */
	var controller = function(container, module) {
		this.mother = this.$super;
		this.mother.constructor();
		
		this.config = this.module.config;
		this.kernel.listen(this, "onReady", function(){
			this.serverSyslog = this.get("serverSyslog");	
		});

		this.kernel.listen(this, "onRouteChange",function(newRoute ,lastRoute){
			if (lastRoute.id === "dashboard" ){
				//console.log("QUIT DASHBOARD");
				this.serverSyslog.unListen("onLog", this.eventRealTime);	
				this.serverSyslog.unListen("onLog", this.eventSyslog);	
				this.serverSyslog.unListen("onLog", this.eventHttp);	
				//this.serverSyslog.unListen("onLog", this.eventGraph);	
				delete this.eventRealTime ;
				delete this.eventSyslog ;
				delete this.eventHttp ;
				//delete this.eventGraph ;
				
			}
		}.bind(this));
		

	

	};
	
	
	/**
	 * 
	 */
	controller.prototype.syslogWidget = function(ele, pdu) {
		var param = {
			title:"SYSLOG",
			msgid:true
		};
		var contitions = {
			severity:{
				data:"ERROR,INFO"
			}
		};
		if (ele){
			var last = this.module.serverSyslog.getLogStack(-5,null, contitions) ;
			this.render(ele, this.renderPartial("appModule::activity", {syslog:last.reverse(),param:param}));
			switch(pdu.msgid){
				case "SERVER HTTP":
				case "SERVER HTTPS":
					this.nbRequest ++;
					$("#requests").html(this.nbRequest)
				break;
				case "REQUEST WEBSOCKET":
				case "REQUEST WEBSOCKET SECURE":
					this.nbWebsoket++;
					$("#websocket").html(this.nbWebsoket);
				break;
			}
		}else{
			var ele = $("#syslog");	
			this.render(ele, this.renderPartial("appModule::activity", {param:param}));	
			this.eventSyslog = this.module.serverSyslog.listenWithConditions(this, contitions, function(pdu){
				pdu.timeago = jQuery.timeago(pdu.timeStamp)
				this.syslogWidget(ele, pdu);
			});	
		}

	};

	/**
	 * 
	 */
	controller.prototype.realtimeWidget = function(ele){
		var param = {
			title:"REALTIME",
			msgid:false
		};
		var contitions = {
			msgid:{
				data:/^.*REALTIME.*$/,
				operator:"RegExp"
			}
		};
		if (ele){
			var last = this.module.serverSyslog.getLogStack(-5,null, contitions) ;
			this.render(ele, this.renderPartial("appModule::activity", {syslog:last.reverse(),param:param}));
		}else{
			var ele = $("#realtime");	
			this.render(ele, this.renderPartial("appModule::activity", {param:param}));	
			this.eventRealTime = this.module.serverSyslog.listenWithConditions(this, contitions, function(pdu){
				pdu.timeago = jQuery.timeago(pdu.timeStamp)
				this.realtimeWidget(ele);
			});	
		}
	};

	/**
	 * 
	 */
	controller.prototype.httpWidget = function(ele){
		var param = {
			title:"HTTP",
			msgid:false
		};
		var contitions = {
			severity:{
					data:"INFO,DEBUG"
			},
			msgid:{
				data:/^.*HTTP.*$/,
				operator:"RegExp"
			}
		};
		if (ele){
			var last = this.module.serverSyslog.getLogStack(-5, null, contitions) ;
			this.render(ele, this.renderPartial("appModule::activity", {syslog:last.reverse(),param:param}));
		}else{
			var ele = $("#http");	
			this.render(ele, this.renderPartial("appModule::activity", {param:param}));	
			this.eventHttp = this.module.serverSyslog.listenWithConditions(this, contitions, function(pdu){
				pdu.timeago = jQuery.timeago(pdu.timeStamp)
				this.httpWidget(ele, pdu);
			});	
		}
	
	};


	/**
	 * 
	 */
	controller.prototype.indexAction = function() {	
		this.nbRequest = 0 ;	
		this.nbWebsoket = 0 ;
		var layout = null;
		var realtime  = this.get("realtime");
		if ( ! realtime.subscribedService.monitoring){
			realtime.subscribe("monitoring")	
		}
		
		switch (this.config.content.dashboard["@layout"]) {
			// standard layout
			case "standard":
				layout = "standard";
			break;
			// lefty layout
			case "lefty":
				layout = "lefty";
			break;
			// righty layout
			case "righty":
				layout = "righty";
			break;
			default:
				layout = "standard";
		}
		this.renderDefaultContent("appModule::dashboard", {
			"layout": layout,
			kernel:this.kernel
		});


		$.ajax("/nodefony/api/syslog",{
			success:function(data, status, xhr){
				try {
					this.module.serverSyslog.loadStack( data.response.data, true, function(pdu){
						//timeago
						pdu.timeago = jQuery.timeago(pdu.timeStamp)
					} );
				}catch(e){
					this.logger(e, "ERROR");
				}
			}.bind(this),
			error:function(xhr,stats,  error){
				this.logger(error, "ERROR");
			}.bind(this)
		});


		/*$.ajax("/nodefony/api/routes",{
			success:function(data, status, xhr){
				try {
					$("#nbRoutes").html(data.response.data.length);
				}catch(e){
					this.logger(e, "ERROR");
				}
			}.bind(this),
			error:function(xhr,stats,  error){
				this.logger(error, "ERROR");
			}.bind(this)
		});*/

		/*$.ajax("/nodefony/api/services",{
			success:function(data, status, xhr){
				try {
					
					$("#nbServices").html(Object.keys(data.response.data).length);
				}catch(e){
					this.logger(e, "ERROR");
				}
			}.bind(this),
			error:function(xhr,stats,  error){
				this.logger(error, "ERROR");
			}.bind(this)
		});*/

		var manageWidgetServer = function(ele, conf){
			ele.find(".panel-body").removeClass("hide")
			ele.find(".domain").text(conf.domain)
			ele.find(".port").text(conf.port)
			if ( conf.ready){
				ele.find(".ready").text("ACTIVE")
				ele.find(".ready").removeClass("label-danger")
				ele.find(".ready").addClass("label-success")
			}
			var configEle = ele.find(".config");
			for (var name in conf.config ){
				configEle.append('<li class="list-group-item">'+name+'<span class="badge">'+conf.config[name]+'</span></li>');
			}	
		}

		$.ajax("/nodefony/api/config",{
			success:function(data, status, xhr){
				// Manage servers
				for (var server in data.response.data.servers ){
					var conf = data.response.data.servers[server]
					switch(server){
						case "http":
							if ( conf ){
								var ele = $("#HTTP");
							}
						break;
						case "https":
							if ( conf ){
								var ele = $("#HTTPS");
							}
						break;
						case "websocket":
							if ( conf ){
								var ele = $("#WEBSOCKET");
							}
						break;
						case "websoketSecure":
							if ( conf ){
								var ele = $("#WEBSOCKET_SECURE");
							}
						break;
					} 
					manageWidgetServer(ele, conf )	
				}
				// Manage kernel config
				var ele = $("#KERNEL").find(".config");
				for (var sys in data.response.data.kernel.system ){
					switch ( typeof data.response.data.kernel.system[sys] ){
						case "string":
						case "number":
						case "boolean":
							ele.append('<li class="list-group-item">'+sys+'<span class="badge">'+data.response.data.kernel.system[sys]+'</span></li>');
						break;
					}
					
				}

				// Manage app config
				var ele = $("#APP").find(".config");
				for (var sys in data.response.data.App ){
					switch ( typeof data.response.data.App[sys] ){
						case "string":
						case "number":
						case "boolean":
							ele.append('<li class="list-group-item">'+sys+'<span class="badge">'+data.response.data.App[sys]+'</span></li>');
						break;
					}
				}
				// Manage statics config
				if ( data.response.data.kernel.system.statics ) {
					var ele = $("#STATICS");
					ele.find(".panel-body").removeClass("hide")
					ele.find(".ready").text("ACTIVE")
					var eleSetting = ele.find(".settings");
					var eleDirectories = ele.find(".directories");
					var statics = data.response.data.App.httpBundle.statics ;
					for (var ele in  statics){
						if ( ele === "settings" ){
							for (var conf in  statics[ele] ){
								eleSetting.prepend('<li class="list-group-item">'+conf+'<span class="badge">'+statics[ele][conf]+'</span></li>');
							}
						}else{
							var html = ' <a href="" class="list-group-item "> ' ;
							html += '<h4 class="list-group-item-heading">'+ele+'</h4>';
							for (var conf in  statics[ele] ){
								html += ' <p class="list-group-item-text">'+conf+'<span class="badge pull-right">'+statics[ele][conf]+'</span></p>';
							}	
							html +='</a>' ;
							eleDirectories.prepend(html);
						}		
					}
				}

				// MANAGE NODEFONY STATE GENERAL
				var ele = $("#STATE");
				if ( data.response.data.node_start ){
					ele.find(".running").text(data.response.data.node_start)
				}	
				if ( data.response.data.kernel.environment ){
					ele.find(".environment").text(data.response.data.kernel.environment)	
				}
				
				ele.find(".debug").text(data.response.data.debug)	

				// MANAGE NODEFONY STATE CDN 
				//console.log(data.response.data.App.asseticBundle.CDN  )
				if ( data.response.data.App.asseticBundle && data.response.data.App.asseticBundle.CDN ) {
					var ele = $("#CDN");
					//ele.find(".panel-body").removeClass("hide");
					ele.find(".ready").text("ACTIVE")
					if ( data.response.data.App.asseticBundle.CDN.javascripts ){
						var javascript = ele.find(".javascripts");
						javascript.text(data.response.data.App.asseticBundle.CDN.javascripts)	
					}
					if ( data.response.data.App.asseticBundle.CDN.stylesheets ){
						var stylesheets = ele.find(".stylesheets");
						stylesheets.text(data.response.data.App.asseticBundle.CDN.stylesheets)	
					}
				}

				


			}.bind(this),
			error:function(xhr,stats,  error){
				this.logger(error, "ERROR");
			}.bind(this)
		
		});


		$.ajax("/nodefony/api/pm2/status",{
			success:function(data, status, xhr){
				try {
					//console.log(data)
					$("#widget-pm2Status").show();	
					var pm2_service = this.get("pm2_graph");
						
					pm2_service.createTable( $("#pm2-status") );
					pm2_service.updateTable($("#pm2-status"), data.response.data);
					

					for (var i= 0 ; i < data.response.data.length ; i++){
						
						// GRAPH
						var row = $(document.createElement('div'));
						row.addClass("row");

						var id = data.response.data[i].pm_id ;
						// left
						var left = $(document.createElement('div'));
						left.addClass("col-md-2");
						left.append('<h3 class="text-center"> '+data.response.data[i].name+' </h3>')
						left.append('<h4 class="text-center"> <a href="#">Cluster <span class="badge">'+id+'</span></a> </h4>')
						
						row.append(left);

						// center CANVAS
						var center = $(document.createElement('div'));
						center.addClass("col-md-8");
						var canvas = $(document.createElement('canvas'));
						canvas.attr("id", data.response.data[i].pm_id) ;
						canvas.attr("width", 600) ;
						canvas.attr("height", 100) ;
						center.append(canvas);
						row.append(center);
						
						// right
						var memory = parseFloat( data.response.data[i].monit.memory / 1000000 ).toFixed(2) ; 
						var right = $(document.createElement('div'));
						right.addClass("col-md-2");
						right.append('<h3>Memory <span id="pm2Memory_'+id+'" class="badge bg-danger  text-md">'+ memory +'</span></h3>');
						right.append('<h3>CPU <span id="pm2CPU_'+id+'" class="badge bg-primary  text-md">'+data.response.data[i].monit.cpu+'</span></h3>');
						row.append(right);

						$('#widget-pm2').append(row);
						canvas.attr("width",  center.width() ) ;
						 
						var smoothie = new SmoothieChart({
							millisPerPixel:100,
							minValue:0,
							maxValue:1024,
							labels:{
								fillStyle:'#ff7e10'
							}
						});
						smoothie.streamTo(canvas.get(0), 2000);
						var lineM = new TimeSeries() ;
						smoothie.addTimeSeries(lineM, {
							lineWidth:3,
							strokeStyle:'#ff0810'
						});
						pm2_service.addTimeSerieMemory(data.response.data[i].pm_id,  lineM )

						var lineC = new TimeSeries() ;
						smoothie.addTimeSeries(lineC, {
							lineWidth:1.5,
							strokeStyle:'#945fff',
							fillStyle:'rgba(33,18,206,0.58)'
						});
						pm2_service.addTimeSerieCpu(data.response.data[i].pm_id,  lineC )
					}
				}catch(e){
					this.logger(e, "ERROR");
				}
			}.bind(this),
			error:function(xhr,stats,  error){
				this.logger(error, "ERROR");
			}.bind(this)
		});


		//this.syslogWidget();
		//this.realtimeWidget();
		//this.httpWidget();

		//this.graph();
		//this.routeWidget();
		//this.serviceWidget();
	};
	
	return controller;
});
