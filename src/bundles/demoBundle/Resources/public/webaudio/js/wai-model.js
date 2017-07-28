
//stage.register.call(wai, 'model', function(){
module.exports =  function(){
	
	var model = function(){
		this.localMedia = null;
	};
	
	model.prototype.getLocalMedia = function(success, error){
		
		this.localMedia = new stage.media.mediaStream(null, {
			audio: true,
			video: false,
			onSucces: function(stream, mediaStream){
				success(stream, mediaStream);
			}.bind(this),
			onError: error || function(){
				console.log("ERROR");
				sconsole.log(arguments);
			}.bind(this)
		});
		return this.localMedia;
	};
	
	model.prototype.startLocalMedia = function(media){
		(media || this.localMedia).getUserMedia({
			audio:true,
			video: false
		});
	};
	
	return model;
	
}();
