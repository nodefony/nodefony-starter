/**
 * 
 */
stage.registerController("appController", function() {
	

	/**
	 * 
	 */
	stage.Controller.prototype.viewOptions = {
		"hideHeader": false,
		"hideAside" : false,
		"hideFooter": false
	};
	
	/**
	 * 
	 */
	stage.Controller.prototype.renderContent = function(partial, variables, options) {
		var options = stage.extend(true, {}, this.viewOptions, options);
		
		$(".app-header")[options.hideHeader?"addClass":"removeClass"]("hide");
		$(".app-footer")[options.hideFooter?"addClass":"removeClass"]("hide");
		
		// remove left margins for content and footer
		$(".app-aside")[options.hideAside?"addClass":"removeClass"]("hide");
		$(".app-content")[options.hideAside?"addClass":"removeClass"]("aside-hide");
		$(".app-footer")[options.hideAside?"addClass":"removeClass"]("aside-hide");
		
		return this.renderPartial(partial, variables);
	};
	
	/**
 	 * Render a classic scrollable page in the content
 	 * area.
 	 */
	stage.Controller.prototype.renderDefaultContent = function(partial, variables, options) {
		var view = this.renderContent(partial, variables, options);			
		var layout = '<div class="app-content-body">' + view + '</div>';
		this.render($(".app-content").removeClass("full"), layout);
	};

	/**
 	 * Render a application style page in the content
 	 * area.
 	 */
	stage.Controller.prototype.renderFullContent = function(partial, variables, options) {
		var view = this.renderContent(partial, variables, options);
		var layout = '<div class="app-content-body app-content-full full">' + view + '</div>';
		this.render($(".app-content").addClass("full"), layout);
	};





	var maximum =  200;
	var ringStack = function(){


		var coor = [];
		for (var i= 0 ; i < maximum ; i++){
			coor.push([null,null]);	
		}

		var series = [{
			data: coor,
			lines: {
				fill: true,
				lineWidth: 1,
				fillColor: {colors: [{opacity: 0.5}, {brightness: 0.6, opacity: 0.8}]}
			},
			splines: { show: true, tension: 0.4, lineWidth: 1, fill: 0.8 }
		}];

		var y = [];
		for (var i= 0 ; i < maximum ; i++){
			y.push(0);	
		}


		var ring = function(val){
			y.shift();
			y.push(val);
			return y ;
		}

		return function( val){
			ring(val);
			for (var i = 0 ;i < maximum ; i++ ){
				coor[i][0] = i ; 	
				coor[i][1] = y[i] ; 	
			}
			series[0].data = coor ;
			return series ;		
		}
	}();

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


	var onRandomMessage = function(service, message){
		if (service === "random" ){
			if ( message === "READY" ){
				var rpc = JSON.stringify({
						method:"start",
						params:[500]
				});
				this.realtime.sendMessage("random", rpc);	
			}else{
				var res = JSON.parse(message).result;
				$('#myEle').html(res+"%");
				$('.chart').each(function(index , ele){
					$(ele).data('easyPieChart').update(res);
				})
				$('.step').html(res+"%");
				if (plot){
					plot.setData(ringStack(res));
					plot.draw();
				}
				

			}
		}
	};


	var regfragment = /^({.*})({.*})$/g;  
	var fragment = function(message){
		try {
			if ( this.fragment ){
				this.message += message;
			}else{
				this.message = message ;
			}
			var res= regfragment.exec(message)
			if (res){
				fragment.call(this,res[1])
				fragment.call(this,res[2])
				return ;
			}		
			var pdu = new stage.PDU();
			pdu.parseJson(this.message);
			this.serverSyslog.logger(pdu);
			this.fragment = false ;
		}catch(e){
			//console.log("FRAGMENTE")
			this.fragment = true ;
			return ;

		}	
	}



	var parseMessage = function(message){
		//console.log(message)
		try {
			var json = JSON.parse(message) ; 

			if ( json.pdu ){
				//return fragment.call(this, JSON.stringify( message.pdu) );
			}
			if ( json.pm2){
				var pm2_graph = this.get("pm2_graph");
				//console.log(pm2_graph)
				for (var i= 0 ; i < json.pm2.length ; i++){
					var id = json.pm2[i].pm_id ;
					//console.log("ID : "+ id + " data : "  + json.pm2[i].monit.memory)
					var mem = json.pm2[i].monit.memory/1000000 ;
					pm2_graph.updateMemory(id, mem );
					var val = parseFloat( mem ).toFixed(2)
					$("#pm2Memory_"+id).text(val);
					pm2_graph.updateCpu(id, json.pm2[i].monit.cpu);
					$("#pm2CPU_"+id).text(json.pm2[i].monit.cpu);

				}
				pm2_graph.updateTable($("#pm2-status"), json.pm2);
				//this.logger(json.pm2,"INFO");	
			}	
		}catch(e){
			this.logger(e,"ERROR");	
		}
	}

	var serverMessages = function(service, message){
		if (service === "monitoring" ){
			try {
				parseMessage.call(this, message);
			}catch(e){
				this.logger(e,"ERROR");
			}
		}
	}


	var onConnect = function(message, realtime){
		if  ( message.data.random ){
			switch (this.kernel.router.location.url()){
				case "/developer/graph":
				case "/developer/realTime":
					realtime.subscribe("random");
				break;
			}
		}
		if  ( message.data.monitoring ){
			switch (this.kernel.router.location.url()){
				case "/dashboard":
					realtime.subscribe("monitoring");
				break
			}
		}
	
	}

	/**
	 * 
	 */
	var controller = function(container, module) {
		this.mother = this.$super;
		this.mother.constructor();

		this.config = this.module.config;
		this.kernel.listen(this, "onReady", function(){
			this.realtime = this.get("realtime") ;
			this.serverSyslog = this.get("serverSyslog");	
			this.realtime.listen(this, "onConnect", onConnect );
			this.realtime.listen(this, "onSubscribe", function(service, message, realtime){
				if (service === "monitoring"){
					this.realtime.listen(this, "onMessage", serverMessages );
				}
			})

			this.realtime.listen(this, "onUnSubscribe", function(service, message, realtime){
				this.realtime.unListen("onMessage" , serverMessages) ;
				console.log("onUnSubscribe service : " + service)
			})
		});

		this.kernel.listen(this, "onRouteChange",function(newRoute ,lastRoute){
			switch(lastRoute.id){
				case "developer" :
					if (lastRoute.args.length ){
						switch(lastRoute.args[0]){
							case "graph" :
							case "realTime" :
								this.realtime.unSubscribe("random");
							break;
						}
					}
				break;
				case "dashboard" :
					this.realtime.unSubscribe("monitoring");
				break;
			}
			
		}.bind(this))

		/******** AJAX SETUP *************/
		$.ajaxSetup({
			statusCode : {
				401: function() {
					 window.location = "/";
				}
			},
			error: function(jqXHR, textStatus, errorThrown){
				if (textStatus === "error"){
					switch (errorThrown){
						case "Unauthorized" :
							window.location = "/";
						break;
						default:
							App.logger("Error: " + textStatus + ": " + errorThrown, "ERROR");	
					}
					return ;
				}
				//App.logger("Error: " + textStatus + ": " + errorThrown, "ERROR");	
			}.bind(this)
		});
	};
	
	/**
	 * 
	 */
	controller.prototype.indexAction = function() {		
		this.render( this.kernel.uiContainer , this.renderPartial("appModule::index", {config: this.config}), "prepend") ;

		// section elements definition
		var section = {};
		section.header 	= $(".app-header");
		section.aside 	= $(".app-aside");
		section.content = $(".app-content");
		section.footer 	= $(".app-footer");		
		this.kernel.set("section", section);

		// load the nav menu
		this.module.controllers.navController.indexAction();
	
		// rewind initial route
		var location = this.get("location");
		var browser = this.get("browser");
		location.url(location.initialUrl);
		if (location.hash() === "" || location.hash() ==="/") {
			this.redirect(this.router.generateUrl("dashboard"));
		} else {
			browser.url(location.initialUrl);	
		}
	};

	/**
	 * 
	 */
	controller.prototype["404Action"] = function() {		
		this.renderDefaultContent("appModule::404", {
			"product": this.kernel.product,
			"version": this.kernel.version
		}, {
			"hideHeader": true,
			"hideAside" : true,
			"hideFooter": true
		});
	};
	
	/**
	 * 
	 */
	controller.prototype["500Action"] = function(error) {		
		if (!$(".app-content").length) {
			var view = this.renderPartial("appModule::500", { error: error });
			$("body").html(view);
			return ;
		}
		
		this.renderDefaultContent("appModule::500", {
			"error": error,
			"product": this.kernel.product,
			"version": this.kernel.version
		}, {
			"hideHeader": true,
			"hideAside" : true,
			"hideFooter": true
		});
	};

	/**
	 * 
	 */
	controller.prototype.developerAction = function(ele) {		
		this.renderDefaultContent("appModule:developer:" + ele);
		switch (ele){
			case "realTime":
				$('.chart').easyPieChart({
					//your configuration goes here
					animate: 1000,
					size:200,
					lineWidth:7
				});
				if (!  this.realtime.subscribedService["random"] ){
					this.realtime.subscribe("random");
				} 
			break;
			case "graph":

				plot = $.plot('.graphs .realTime .graph', ringStack(0), {
					colors: [colors['primary']],
			    		//points: { show: true, radius: 1},
			    		//series: { shadowSize: 3 }, 
			    		grid: {
				    		show: true,
						hoverable: true,
						borderWidth: 0,
						color: '#a1a7ac',
						markings: [ 
							{ xaxis: { from: 0, to: 500 }, yaxis: { from: 0, to: 0 }, color: colors['muted'] },
							{ xaxis: { from: 0, to: 0 }, yaxis: { from: 0, to: 110 }, color: colors['muted'] }
						]
			    		},
			    		xaxis:{
				    		show: true,
						tickLength: 0
			    		},
			    		yaxis:{
				    		show: true,
						tickLength: 0,
						tickSize: 10,
						tickFormatter: function(val){return Math.round(val)},
						max:110,
						min: 0
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

				if (!  this.realtime.subscribedService["random"] ){
					this.realtime.subscribe("random");
				}
			break;
		
		}
	};

	return controller;
});
