 /*
  *
  *
  */

var Sequelize =require("sequelize");
var Promise = require('promise');
var Url = require("url");

nodefony.registerCommand("Monitoring",function(){


	var monitoring = function(container, command, options){
		var arg = command[0].split(":");
		switch ( arg[1] ){
			case "test":
				this.serverLoad = this.container.get("serverLoad");
				switch( arg[2]){
					case "load":
						try {
							var url = Url.parse( command[1] );
							var nb = parseInt( command[2] ,10 );
							var concurence = parseInt( command[3] ,10 );
						}catch(e){
							this.showHelp();
							this.terminate();
						}
						this.serverLoad.handleConnection({
							type:url.protocol.replace(":", "") ,
							nbRequest:nb || 1000,
							concurence:concurence || 40,
							url:url.href,
							method:'GET'
						},this)
					break;
					default:
						this.showHelp();
						this.terminate();
				}
			break;
			default:
			this.showHelp();
			this.terminate();
		}

	}

	monitoring.prototype.send = function(data, encodage){
		this.logger(data, "INFO");	
	}


	monitoring.prototype.close = function(code){
		this.terminate(code);	
	}



	return {
		name:"Monitoring",
		commands:{
			Test:["Monitoring:test:load URL [nbRequests] [concurence]" ,"load test example ./console Monitoring:test:load http://nodefony.com:5151/demo 10000 100 "],
		},
		worker:monitoring

	
	} ;
});		

