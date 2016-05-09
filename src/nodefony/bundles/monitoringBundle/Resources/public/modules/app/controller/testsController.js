
stage.registerController("testsController", function() {
	/**
	 * 
	 */
	var controller = function(container, module) {
		this.mother = this.$super;
		this.mother.constructor();
		
		this.config = this.module.config;
		this.router = container.get("router");

			// ROUTES 
		this.router.createRoute("tests", "/tests", {
			controller:"appModule:tests:index"
		});
		
		this.loadSocket = null ;

	}


	var updateLegendTimeout = null;
	var latestPosition = null;
	var updateLegend= function() {

		updateLegendTimeout = null;

		var pos = latestPosition;

		var axes = plot.getAxes();
		if (pos.x < axes.xaxis.min || pos.x > axes.xaxis.max ||
			pos.y < axes.yaxis.min || pos.y > axes.yaxis.max) {
			return;
		}

		var i, j, dataset = plot.getData();
		for (i = 0; i < dataset.length; ++i) {

			var series = dataset[i];

			// Find the nearest points, x-wise

			for (j = 0; j < series.data.length; ++j) {
				if (series.data[j][0] > pos.x) {
					break;
				}
			}

			// Now Interpolate

			var y,
				p1 = series.data[j - 1],
				p2 = series.data[j];

			if (p1 == null) {
				y = p2[1];
			} else if (p2 == null) {
				y = p1[1];
			} else {
				y = p1[1] + (p2[1] - p1[1]) * (pos.x - p1[0]) / (p2[0] - p1[0]);
			}

			legends.eq(i).text(series.label.replace(/=.*/, "= " + y.toFixed(2)));
		}
	}

	
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


	var data = [];
	var data2 = [];
	var plot = function(res){
	

		data.push([res.percentEnd, res.requestBySecond ]);
		data2.push([res.percentEnd, res.average  ])
		

		var settings = {
			show: true,
			lineWidth: 0.5,
			fill: false,
			
		};

		var settings2 = {
			show: true,
			lineWidth: 0.5,
			fill: false,
			
		};
		var tab = [{
			data: data2,
			label:"Average concurence in ms"
			//lines: settings2
		}, {
			data: data,
			label:"Number Requests by secondes"
			//lines: settings
		}] ;

		$.plot("#http-rps", tab, {
			colors: [colors['primary'],colors['success'] ],
			crosshair: {
				mode: "x"
			},
			series: {
				lines: {
					show: true,
					fill: false,
				}
			},	
		});

		$("#http-rps").bind("plothover",  function (event, pos, item) {
			console.log("pass")
			latestPosition = pos;
			if (!updateLegendTimeout) {
				updateLegendTimeout = setTimeout(updateLegend, 50);
			}
		});

		legends = $("#placeholder .legendLabel");

	
	
	}

	var dataPie = [];
	var pie = function(res){

		var i = 0 ;
		for (var ele in res.status ) {
			dataPie[i] = {
				label: ele,
				data: res.status[ele]
			}
			i++;
		}

		$.plot('#http-pie', dataPie, {
    			series: {
        			pie: {
            				show: true,
					//radius: 1,
					label: {
						show: true,
						//radius: 2/3,
						//formatter: labelFormatter,
						//threshold: 0.1
					}
        			}
    			}
		});
	}

	var cleanResult = function(ele){
		$("#result-http").show();
		$("#result").empty();
		$('#progress-http').css('width', '0%').attr('aria-valuenow', 1).html("0%");
		$('#progress-http').addClass("active");
	}

	controller.prototype.indexAction = function(){
	
		var navView = this.renderDefaultContent("appModule:tests:tests", {
		});

		var isClose = true ;
		$("#startLoad").click(function(){
			data.length = 0 ;
			data2.length = 0 ;
			if ( ! isClose ){
				$("#result").append('WEBSOCKET ALREADY OPEN : </br>');
				return ;
			}
			var location = window.location ;
			var protocol = location.protocol ;
			switch (protocol){
				case "https:":
					this.loadSocket = new WebSocket("wss://"+location.host+"/nodefony/test/load");
				break;
				case "http:":
					this.loadSocket = new WebSocket("ws://"+location.host+"/nodefony/test/load");
				break;
			}	
			this.loadSocket.onopen = function (event) {
				cleanResult("http")
				
				isClose=false;
				var toSend = $("#loadForm").serialize() ;
				$("#result").append('WEBSOCKET EVENT OPEN </br>');
				this.loadSocket.send(JSON.stringify({
					query:toSend,
					type:"http"
				})); 
				
			}.bind(this);
			
			this.loadSocket.onerror = function(error){
				$("#result").append('WEBSOCKET SOCKET ERROR : '+error);
			};
			this.loadSocket.onmessage = function(message){
				$("#result").append( message.data + "</br>")
				var res = JSON.parse( message.data) ;
				$('#progress-http').css('width', res.percentEnd+'%').attr('aria-valuenow', res.percentEnd).html(res.percentEnd+"%"); 
				if ( ! res.message ){
					plot(res);
					pie(res);
				}
			};
			this.loadSocket.onclose = function(event){
				isClose = true ;
				$('#progress-http').removeClass("active");
				$("#result").append("WEBSOCKET SERVER CLOSE : "+event.reason)
				
			};

		}.bind(this));


		var isClose = true ;
		$("#startLoadHttps").click(function(){
			if ( ! isClose ){
				$("#resultHttps").append('WEBSOCKET ALREADY OPEN : </br>');
				return ;
			}
			var location = window.location ;
			var protocol = location.protocol ;
			switch (protocol){
				case "https:":
					this.loadSocket = new WebSocket("wss://"+location.host+"/nodefony/test/load");
				break;
				case "http:":
					this.loadSocket = new WebSocket("ws://"+location.host+"/nodefony/test/load");
				break;
			}	
			this.loadSocket.onopen = function (event) {
				$("#resultHttps").empty();
				isClose=false;
				var toSend = $("#loadFormHttps").serialize() ;
				$("#resultHttps").append('WEBSOCKET EVENT OPEN </br>');
				this.loadSocket.send(JSON.stringify({
					query:toSend,
					type:"https"
				})); 
			}.bind(this);
			
			this.loadSocket.onerror = function(error){
				$("#resultHttps").append('WEBSOCKET SOCKET ERROR : '+error);
			};
			this.loadSocket.onmessage = function(message){
				$("#resultHttps").append( message.data + "</br>")
			};
			this.loadSocket.onclose = function(event){
				isClose = true ;
				$("#resultHttps").append("WEBSOCKET SERVER CLOSE : "+event.reason)
			};

		}.bind(this));



		return navView ;

	}

	return controller ;

});
