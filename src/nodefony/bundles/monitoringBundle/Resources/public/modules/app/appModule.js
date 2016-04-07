/**
 * app Module
 */
stage.registerModule("app", function() {
	

	/**
	 * 
	 */
	var module = function(kernel, config, route) {	
		this.mother = this.$super;
		this.mother.constructor(kernel, config, route);
		this.kernel = kernel;
		
		this.serverSyslog = new stage.syslog();
		this.set( "serverSyslog", this.serverSyslog );
		this.set("pm2_graph", new pm2graph() );
	};
	
	
	/**
	 * 
	 */
	module.prototype.initialize = function() {
					
		this.logger("INITIALIZE APP", "DEBUG");
		
		try {
			var server = "/nodefony/monitoring/realtime"; 
			this.realtime = new stage.realtime(server ,{
 				onConnect:function(message, realtime){
					console.log("welcome to realtime " )
					
				}.bind(this),
				onError:function(code, realtime ,message){
					this.logger("REAlTIME  :" + message,"ERROR")
				}.bind(this),
				onClose:function(){
					console.log("REALTIME CLOSE");
				},
				onDisconnect:function(){
					console.log("REALTIME DISCONNECT");
				},
				reConnect:function(){
					console.log("REALTIME DISCONNECT");	
				}
			});
			this.kernel.set("realtime", this.realtime)
			this.realtime.start();
		}catch(e){
		
		}

		
		
	
	};


	// SERVICE PM2
	var pm2graph = function(){
		this.timeSeriesMemory={};
		this.timeSeriesCpu={};
		this.table = {} ; 
	}

	
	// GRAPH
	pm2graph.prototype.addTimeSerieMemory = function(id, ele){
		this.timeSeriesMemory[id] = ele ;	
	}
	pm2graph.prototype.addTimeSerieCpu = function(id, ele){
		this.timeSeriesCpu[id] = ele ;	
	}
	pm2graph.prototype.updateMemory = function(id, data){
		if ( this.timeSeriesMemory[id] ){
			//console.log("ID : "+ id + " data : "  + data)
			this.timeSeriesMemory[id].append(new Date().getTime(), data);
		}	
	}

	pm2graph.prototype.updateCpu = function(id, data){
		if ( this.timeSeriesCpu[id] ){
			//console.log("ID : "+ id + " data : "  + data)
			var scale = ( 512 * data ) / 100 ;
			this.timeSeriesCpu[id].append(new Date().getTime(), scale);
		}	
	}

	
	// TABLE
	var checkSelector = function(ele){
		switch (true){
			case ( ele instanceof jQuery ) :
				var selector =  ele ;
				var id = ele.attr("id") ;
			break;
			case ( typeof ele === "string" ) :
				var selector = $("#"+ele) ;
				var id = ele ;
			break;
 		        default:
				throw new Error("pm2 graph create table error bad type ");		
		}
		return {
			selector:selector,
			id:id
		}
	}

	pm2graph.prototype.createTable = function(ele){
		try{
			var ret = checkSelector(ele)
		}catch(e){
			throw e ;
		}

		this.table[ret.id] = ret.selector.DataTable({
			"paging":   false,
			"ordering": false,
			"filter":false,
			"info":     false
		});
		return 	this.table[ret.id] ;
	}
	pm2graph.prototype.getTable = function(id){
		return this.table[id]  ;
	}
	pm2graph.prototype.updateTable = function(ele, data){

		try{
			var ret = checkSelector(ele)
		}catch(e){
			throw e ;
		}
		var table = this.getTable(ret.id);

		table.rows().remove();

		for (var i= 0 ; i < data.length ; i++){
			table.row.add( this.parseData( data[i] ) ).draw( false );
		}
			
	}

	// DATA
	pm2graph.prototype.parseData = function(data){
		var tab = [];
		tab.push(data.name);
		tab.push(data.pm_id);
		tab.push(data.pm2_env.exec_mode);
		tab.push(data.pid);
		tab.push(data.pm2_env.status);
		tab.push(data.pm2_env.restart_time);
		tab.push(jQuery.timeago( data.pm2_env.pm_uptime ) );
		tab.push(parseFloat( data.monit.memory/1000000 ).toFixed(2) );	
		tab.push( data.monit.cpu  );	
		return tab ;
	}


	
			
	return module;		
});
