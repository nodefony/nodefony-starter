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
			var message = JSON.parse(data) ;
			if ( message.message === "END LOAD TEST" ){
				this.displayTable("NODEFONY LOAD TEST", message  );
				this.logger(data, "INFO");
			}else{
				this.logger(data, "INFO");	
			}
		}

		close (code){
			if (code){
				return this.terminate(code);	
			}
			return this.terminate(0);
		}

		displayTable (titre, ele){
			var table = new AsciiTable(titre);
			table.setHeading(
				"Average By Requests ( ms )", 
				"Average Requests By Seconde",
				"Total Time (s)",
				"Average By Concurences (s)",
				"Average CPU (%)"
			);
			table.setAlignCenter(0);
			table.setAlignCenter(1);
			table.setAlignCenter(2);
			table.setAlignCenter(3);
			table.setAlignCenter(4);
			var obj = new Array(5);
			for ( var val in ele){
				switch(val){
					case "average":
						obj[3] = ele[val];
					break;
					case "averageNet":
						obj[0] = ele[val];
					break;
					case "requestBySecond":
						obj[1] = ele[val];
					break;
					case "totalTime":
						obj[2] = ele[val];
					break;
					case "cpu":
						obj[4] = ele[val].percent;

					break;
				}
			}
			table.addRowMatrix([obj]);
			console.log(table.render());	
		}

	};

	return {
		name:"Monitoring",
		commands:{
			Test:["Monitoring:test:load URL [nbRequests] [concurence]" ,"load test example ./console Monitoring:test:load http://localhost:5151/demo 10000 100 "],
		},
		worker:monitoring
	};
});		

