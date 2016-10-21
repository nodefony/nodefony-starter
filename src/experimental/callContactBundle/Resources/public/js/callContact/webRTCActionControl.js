
stage.register.call(callContact, 'webRTCActionControl', function(){
	
	var webRTCActionControl = function(api){
		this.api = api;
	};
	
	webRTCActionControl.prototype.invite = function(user){
		//console.log('webRTCActionControl.invite');
		//this.api.fire("onCall");
		
		if(this.api && this.api.webrtc){
			this.api.webrtc.createOffer(user);
		}
	};
	
	return webRTCActionControl;
});

