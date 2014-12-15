/*
 *
 *
 *
 *
 *
 */



nodefony.registerCommand("encoders",function(){


	var encoders = function(container, command, options){
	
		var arg = command[0].split(":");
		switch ( arg[1] ){
			case "MD5" : 
				if (command[1] && command[2]){
					var user = command[1] ; 
					var passwd = command[2] ; 
					if (command[3]) 
						var realm = command[3] ;
					else 
						var realm = "nodefony" ; //this.container.getParameters("kernel").system.domain+":"+this.container.getParameters("kernel").system.httpsPort;

					var security = this.container.get("security");
					var area = security.addSecuredArea("console");
					var options = {
						realm:realm
					};
					/*if (command[4]){
 					       	options["realm"] = command[4];
					}*/
					/*if (command[4]){
 					       	options["private_key"] = command[5]
					}*/
					var digest = area.authentication("DIGEST", options);
					//this.logger("HOST = " + host)
					this.logger("REALM = " + digest.settings.realm)
					//this.logger("private_key = " + digest.settings.private_key)
					this.logger("HASH GENERATE = " + digest.generatePasswd(digest.settings.realm, user, passwd) );

				}else{
					this.logger(new Error("encoders:MD5 must have login password arguments"), "ERROR")
				
				}
			break;
		}
		this.terminate();
	
	}

	return {
		name:"encoders",
		commands:{
			md5:["encoders:MD5 login password [realm]" ,"Generate encoding keys digest MD5"],
		},
		worker:encoders	
	}

});

