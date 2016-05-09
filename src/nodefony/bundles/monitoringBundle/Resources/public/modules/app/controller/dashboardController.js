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
	controller.prototype.routeWidget = function() {	
	};

	/**
	 * 
	 */
	controller.prototype.serviceWidget = function() {	
		
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


		$.ajax("/nodefony/api/routes",{
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
		});

		$.ajax("/nodefony/api/services",{
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
							maxValue:512,
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


		this.syslogWidget();
		this.realtimeWidget();
		this.httpWidget();

		//this.graph();
		//this.routeWidget();
		//this.serviceWidget();
	};
	
	return controller;
});
