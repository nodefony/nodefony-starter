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
			case "Digest" : 
				if (command[1] && command[2] && command[3]){
					var security = this.container.get("security");
					var context = command[1];
					if (  ! security.securedAreas[context] ){
						this.logger("firewall "+ context +" not exits", "ERROR");
						this.terminate();
						return 
					}
					var user = command[2] ; 
					var passwd = command[3] ; 
					if (command[4]) 
						var realm = command[4] ;
					else 
						var realm = security.securedAreas[context].factory.settings.realm //  //this.container.getParameters("kernel").system.domain+":"+this.container.getParameters("kernel").system.httpsPort;

						
					this.logger("FIREWALL = " + security.securedAreas[context].name)
					this.logger("Authentification = " + security.securedAreas[context].factory.name)
					this.logger("REALM = " + security.securedAreas[context].factory.settings.realm)
					this.logger("HASH GENERATE = " + security.securedAreas[context].factory.generatePasswd(realm, user, passwd) );

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
			md5:["encoders:Digest firewall login password [realm]" ,"Generate encoding keys digest MD5 Example : ./console encoders:Digest secured_area login password"],
		},
		worker:encoders	
	}

});

