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
				this.serverSyslog.unListen("onLog", this.eventGraph);	
				delete this.eventRealTime ;
				delete this.eventSyslog ;
				delete this.eventHttp ;
				delete this.eventGraph ;
				
			}
		}.bind(this))

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




	var maximum =  200;
	var defaultSetting = {
		data:		null,
		lines:		{
					fill: true,
					lineWidth: 1,
					fillColor: {colors: [{opacity: 0.5}, {brightness: 0.6, opacity: 0.8}]}
		},
		splines:	{ show: true, tension: 0.4, lineWidth: 1, fill: 0.8 }
	}; 

	/*var series = function(name, optionsPlot){
		
		var series = {};
		if (name){
			series[name] = 	stage.extend({lablel:name}, defaultSetting, optionsPlot);
		}

		var func = function( val){
			ring(val);
			for (var i = 0 ;i < maximum ; i++ ){
				coor[i][0] = i ; 	
				coor[i][1] = y[i] ; 	
			}
			series[0].data = coor ;
			return series ;		
		}
		func.prototype.setSerie =function(name, optionsPlot){
			if ( ! name )
				throw new Error("No name in set Serie ");
			series[name] = stage.extend({}, defaultSetting, optionsPlot);
			serie.push(settings);
		}
	}();




	controller.prototype.searchSyslog =function(conditions){
		return this.module.serverSyslog.getLogs(conditions);
	
	};*/ 



	/*controller.prototype.graph = function(ele, pdu){

		var conditions =  {
			//msgid :{
			//	data:/.*SERVER HTTP.*\/,
			//	operator:"RegExp"
			//},	
			//date:{
   	 		//	operator:">=",
   	 		//	data:new Date(Date.now()-1000)
   	 		//}
		}

		//REALTIME ELE
		if (ele){
			//ele.setData()
   	 		conditions.date.operator = "<=" ;
			conditions.date.data = new Date(Date.now()+1000) ;
			var last = this.searchSyslog( conditions) ;
			
		}else{
		
			var colors = {
				primary: "#7266ba",
				success: "#27c24c",
				info: "#23b7e5",
				warning: "#fad733",
				danger: "#f05050",
				dark: "#3a3f51",
				black: "#1c2b36",
				muted: "#e8eff0"
			};

			var http = [[0,7],[1,6.5],[2,12.5],[3,7],[4,9],[5,6],[6,11],[7,6.5],[8,8],[9,7]];
			var websocket = [[0,4],[1,4.5],[2,7],[3,4.5],[4,3],[5,3.5],[6,6],[7,3],[8,4],[9,3]];
			var series = [
				{
					data: http,
					lines: {
						fill: true
					},
					splines: { show: true, tension: 0.4, lineWidth: 1, fill: 0.8 },
					label: 'HTTP',

				},
				{
					data: websocket,
					lines: {
						fill: true
					},
					splines: { show: true, tension: 0.4, lineWidth: 1, fill: 0.8 }, // traçage des courbe de bezier (PLUGIN spline)
					label: 'WEBSOCKETS'
				}
			];

	 		
			$('.graphs .bicolor .graph').css({ 'height': '400px' })

			this.plot = $.plot('.graphs .bicolor .graph', series, {
				colors: [colors['info'], colors['primary']],
				points: { show: true, radius: 1},
				series: { shadowSize: 3 }, 
				grid: {
					show: true,
					hoverable: true,
					borderWidth: 0,
					color: '#a1a7ac',
				},
				yaxis:{
					tickSize: 5,
					tickFormatter: function(val){return Math.round(val)},
					max:20 
				},
				tooltip: true,
				tooltipOpts: {
					content: 'Visits of %x.1 is %y.1',
					defaultTheme: false,
					shifts: {
						x: 10,
						y: -25
					}
				}
			});
		
			this.eventGraph = this.module.serverSyslog.listenWithConditions(this, conditions, function(pdu){
				//pdu.timeago = jQuery.timeago(pdu.timeStamp)
				this.graph(this.plot, pdu);
			});
		}
	};*/

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

		$.ajax("/api/syslog",{
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


		$.ajax("/api/routes",{
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

		$.ajax("/api/services",{
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




		this.syslogWidget();
		this.realtimeWidget();
		this.httpWidget();

		//this.graph();
		//this.routeWidget();
		//this.serviceWidget();
	};
	
	return controller;
});
