/*
 *
 *
 *
 *
 *
 */

nodefony.registerCommand("less",function(){

	

	var Less = function(container, command, options){

		this.engine = require("less");
		var arg = command[0].split(":");

		switch ( arg[1] ){
			case "render" :
			break;
			default:
				this.logger(new Error(command[0] + " command error"),"ERROR")
				this.showHelp();
		}
	}


	return {
		name:"less",
		commands:{
			render:["less:render" ,"Less CSS compilateur "],
			compile:["less:compile" ,"Less CSS compilateur "],
		},
		worker:Less
	}

});
