 /*
  *
  *
  */

var Url = require("url");

nodefony.registerCommand("Monitoring",function(){

	var monitoring = class monitoring  extends nodefony.Worker {

		constructor (container, command/*, options*/){

			super( "Monitoring", container, container.get("notificationsCenter") );

			var arg = command[0].split(":");
			switch ( arg[1] ){
				case "test":
					this.serverLoad = this.container.get("serverLoad");
					var proto = null ;
					var url = null ;
					var nb = null ;
					var concurence = null ;
					switch( arg[2]){
						case "load":
							try {
								url = Url.parse( command[1] );
								nb = parseInt( command[2] ,10 );
								concurence = parseInt( command[3] ,10 );
							}catch(e){
								this.showHelp();
								this.terminate(1);
							}
							if ( ! url.protocol ){
								proto = "http";
								url.protocol = "http:";
								url.href = "http://"+url.href;
							}else{
								proto = url.protocol.replace(":", "");	
							}
							this.serverLoad.handleConnection({
								type: proto,
								nbRequest:nb || 1000,
								concurence:concurence || 40,
								url:url.href,
								method:'GET'
							},this);
						break;
						default:
							this.showHelp();
							this.terminate(0);
					}
				break;
				default:
				this.showHelp();
				this.terminate(0);
			}
		}
		
		send (data/*, encodage*/){
			this.logger(data, "INFO");	
		}
	};

	return {
		name:"Monitoring",
		commands:{
			Test:["Monitoring:test:load URL [nbRequests] [concurence]" ,"load test example ./console Monitoring:test:load http://nodefony.com:5151/demo 10000 100 "],
		},
		worker:monitoring
	};
});		

