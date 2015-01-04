/*
 *  
 *   
 *    
 *     
 *      
 **/


nodefony.registerCommand("server",function(){

	var appRun = function(container, command, options){
		var arg = command[0].split(":");
		switch ( arg[0] ){
			case "server" : 
				if ( arg[1] === "run"){
					this.runServer();
				}
			break;
			default:
				this.logger(new Error(command[0] + " command error"),"ERROR")
				this.showHelp();
		}
	};

	appRun.prototype.runServer = function(){
		//FIXME parent detach kernel console	
		var spawn = require('child_process').spawn;
		var commandLine = './nodefony';
		var server = spawn(commandLine,[],{
			detached:true,
			stdio: [ 'inherit' ]
		});

		server.stdout.on('data', function (data) {
			  console.log(data+"");
		});
		server.unref();

	};

	return {
		name:"server",
		commands:{
			server:["server:run" ,"Run Application"]
		},
		worker:appRun
	}	
});

