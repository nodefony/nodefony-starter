/**
 * app Module
 */
stage.registerModule("app", function() {
	

	/**
	 * 
	 *	MODULE APP
	 *
	 */
	var module = class module  extends stage.Module {

		constructor(kernel, config, settings) {	
			super(kernel, config, settings);
			this.kernel = kernel;
			this.serverSyslog = new stage.syslog();
			this.set( "serverSyslog", this.serverSyslog );
			this.set("pm2_graph", new pm2graph(kernel) );

		}
		/**
	 	* 
	 	*/
		initialize () {
			this.logger("INITIALIZE APP", "DEBUG");
			try {
				var server = "/nodefony/monitoring/realtime"; 
				this.realtime = new stage.realtime(server ,{
 					onConnect:function(message, realtime){
						this.logger("welcome to realtime " ,"INFO");
					}.bind(this),
					onError:function(code, realtime ,message){
						this.logger("REAlTIME  :" + message,"ERROR");
					}.bind(this),
					onClose:function(){
						this.logger("REALTIME CLOSE","INFO");
					}.bind(this),
					onDisconnect:function(){
						this.logger("REALTIME DISCONNECT","INFO");
					}.bind(this),
					reConnect:function(){
						this.logger("REALTIME DISCONNECT","INFO");	
					}.bind(this)
				});
				this.kernel.set("realtime", this.realtime)
				this.realtime.start();
			}catch(e){
				this.logger(e,"ERROR");
			}
		}
	};
	
	

	/*
 	 *
 	 *	SERVICE PM2
 	 *
 	 */

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
	};

	var pm2graph = class pm2graph  extends stage.Service {


		constructor(kernel){
			super("PM2", kernel.container , kernel.notificationsCenter );
			this.timeSeriesMemory={};
			this.timeSeriesCpu={};
			this.table = {} ; 
		}

		// GRAPH
		addTimeSerieMemory(id, ele){
			this.timeSeriesMemory[id] = ele ;	
		}

		addTimeSerieCpu (id, ele){
			this.timeSeriesCpu[id] = ele ;	
		}

		updateMemory (id, data){
			if ( this.timeSeriesMemory[id] ){
				//console.log("ID : "+ id + " data : "  + data)
				this.timeSeriesMemory[id].append(new Date().getTime(), data);
			}	
		}

		updateCpu(id, data){
			if ( this.timeSeriesCpu[id] ){
				//console.log("ID : "+ id + " data : "  + data)
				var scale = ( 1024 * data ) / 100 ;
				this.timeSeriesCpu[id].append(new Date().getTime(), scale);
			}	
		}

		createTable (ele){
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

		getTable (id){
			return this.table[id]  ;
		}

		updateTable (ele, data){

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
		parseData (data){
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
	};
			
	return module;		
});
