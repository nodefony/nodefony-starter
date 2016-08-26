

stage.register.call(callContact, 'notify', function(){
	
	var notify = function (kernel) {
		this.kernel = kernel ;
		this.nofificationHTML5 = false ;
	  	// Voyons si le navigateur supporte les notifications
	  	this.checkHTML5();
	};
	
	notify.prototype.checkHTML5 = function(){
		if (!("Notification" in window)) {
	    		this.kernel.logger("Ce navigateur ne supporte pas les notifications desktop", "INFO");
	  	}
	  	// Voyons si l'utilisateur est OK pour recevoir des notifications
	  	else if (Notification.permission === "granted") {
	    		// Si c'est ok, créons une notification
	    		/*var notification = new Notification(" NODEFONY",{
				body:"Notification HTML 5 activé ",
				icon:"/webRtcBundle/images/fanout_icon.png"
			});*/
			this.nofificationHTML5 = true ;
	  	}
	
	  	// Sinon, nous avons besoin de la permission de l'utilisateur
	  	// Note : Chrome n'implémente pas la propriété statique permission
	  	// Donc, nous devons vérifier s'il n'y a pas 'denied' à la place de 'default'
	  	else if (Notification.permission !== 'denied') {
	    		Notification.requestPermission(function (permission) {
	
	      			// Quelque soit la réponse de l'utilisateur, nous nous assurons de stocker cette information
	      			if(!('permission' in Notification)) {
	        			Notification.permission = permission;
	      			}
	
	      			// Si l'utilisateur est OK, on crée une notification
	      			if (permission === "granted") {
	        			var notification = new Notification("Notification HTML 5 activé !",{
						body:"CALLCONTACT ",
						icon:"/webRtcBundle/images/fanout_icon.png"
					});
	      			}else{
					this.kernel.logger("Vous avez réfusez de recevoir des notifications ", "INFO");
	      			}
	
	    		}.bind(this));
	  	}
		if (Notification.permission === "denied"){
			this.kernel.logger("Notifications HTML5 Bloqué ", "INFO");	
		}
	  	// Comme ça, si l'utlisateur a refusé toute notification, et que vous respectez ce choix,
	  	// il n'y a pas besoin de l'ennuyer à nouveau.
	};
	
	notify.prototype.logger = function(message, title, severity){
		if ( this.nofificationHTML5 ){
			var notification = new Notification(title || "CALLCONTACT",{
					body:message,
					icon:"/callContactBundle/images/barbuq.png"
			});
		}else{
			this.kernel.logger( title + " : " +  message , severity || "INFO" ) ;
		}
	};
	
	return notify ;
	
});



stage.kernel.prototype.initializeLog = function(settings){

	var syslog =  new stage.syslog(settings);
	this.notify = new callContact.notify(this);
		
	syslog.listenWithConditions(this,{
		msgid:{
			data:"NOTIFY"
		}
		},function(pdu){
			this.notify.logger( "SYSLOG " + pdu.severityName +" " + pdu.msgid + " "+new Date(pdu.timeStamp) + " " + pdu.msg+" : "+ pdu.payload);         
		}
	);

	syslog.listenWithConditions(this,{
		severity:{
			data:"CRITIC,ERROR"
		}		
	},function(pdu){
		//console.log(pdu.payload)
		if (pdu.payload.stack ){
				console.error( "SYSLOG " + pdu.severityName +" " + pdu.msgid + " "+new Date(pdu.timeStamp) + " " + pdu.msg+" : "+  pdu.payload.stack);
		}else{
			console.error( "SYSLOG " + pdu.severityName +" " + pdu.msgid + " "+new Date(pdu.timeStamp) + " " + pdu.msg+" : "+  pdu.payload);	
		}
		/*if (pdu.typePayload === "Error" ){
			if (pdu.payload.stack ){
				console.error( "SYSLOG " + pdu.severityName +" " + pdu.msgid + " "+new Date(pdu.timeStamp) + " " + pdu.msg+" : "+  pdu.payload.stack);
			}
			return;
		}
		console.error( "SYSLOG " + pdu.severityName +" " + pdu.msgid + " "+new Date(pdu.timeStamp) + " " + pdu.msg+" : "+  pdu.payload);*/	
	});

			
	return syslog;	
};


stage.kernel.prototype.info = function(message, severity){
	this.logger(message, severity || "INFO" , "NOTIFY");
};



stage.kernel.prototype.initApiLog = function(settings){

	this.apiLog =  new stage.syslog(settings);

	this.apiLog.listenWithConditions(this,{
		msgid:{
			data:"WEBRTC"
		}},function(pdu){
			this.console.logWebrtc(pdu);
			//console.log( "SYSLOG " + pdu.severityName +" " + pdu.msgid + " "+new Date(pdu.timeStamp) + " " + pdu.msg+" : "+ pdu.payload);         
		}
	);

	this.apiLog.listenWithConditions(this,{
		msgid:{
			data:"SIP"
		}},function(pdu){
			this.console.logSip(pdu);
			//console.log( "SYSLOG " + pdu.severityName +" " + pdu.msgid + " "+new Date(pdu.timeStamp) + " " + pdu.msg+" : "+ pdu.payload);         
		}
	);

	this.apiLog.listenWithConditions(this,{
		msgid:{
			data:"API"
		}},function(pdu){
			pdu.api = this.API ;
			this.console.logApi(pdu);
		}
	);


}

stage.kernel.prototype.logSip = function(data, severity){
	if ( this.apiLog )
		return this.apiLog.logger(data, severity, "SIP");

}

stage.kernel.prototype.logWebrtc = function(data, severity){
	if ( this.apiLog )
		return this.apiLog.logger(data, severity, "WEBRTC");
}

stage.kernel.prototype.logApi = function(data, severity){
	if ( this.apiLog )
		return this.apiLog.logger(data, severity, "API");
}


stage.register.call( callContact, "browserStorage", function(){

	// HTML5 Storage
	var browserStorage = function(type){
		if (type === "local")
			this.data =  window.localStorage;
		else
			this.data =  window.sessionStorage;
	};
	browserStorage.prototype.get = function(key){
		var ele = this.data.getItem(key);
		if ( ele === "" || ele === null || ele === undefined ) return null;
		if ( ele && typeof ele === "object")
			return JSON.parse(ele.value);
		return JSON.parse(ele);
	};
	browserStorage.prototype.set = function(key, value ){
		return this.data.setItem(key, JSON.stringify(value));
	};
	browserStorage.prototype.unset = function(key){
		return this.data.removeItem(key);
	};
	browserStorage.prototype.clear = function(){
		return this.data.clear();
	};
	browserStorage.prototype.each = function(){
		//TODO
	};

	return browserStorage ;

})



