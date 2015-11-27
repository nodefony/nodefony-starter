/*
 *
 *	MEDIA
 *
 *
 */



stage.register("media", function(){



	var audioContext = null ;

	var webAudioApi = function(){
		audioContext = window.AudioContext || window.webkitAudioContext  ;
		if (audioContext)
			return true;
		return false;
	}();


	var trackSettings = {
		gain		: true,
		filter		: true,
		panner		: true,
		analyser	: false
	}; 

	var Track = function(media, context, settings){
		this.media = media ;
		this.settings = stage.extend({}, trackSettings, settings);
		this.transport = null;
		this.context = context ;
		this.source = null;
		this.buffer = null;
		this.eventsManager = stage.notificationsCenter.create(this.settings, this);;
		var type = stage.typeOf(media) ;
		switch (type){
			case "object" :
				if (media instanceof mediaStream){
					this.buffer = media.stream;
					this.url = stage.io.urlToOject(media.urlStream);
					//console.log(media.getAudioTracks())
					this.createSource("stream", media.stream)
				}	
				
			break;
			case "element":

			break;
			case "string" :
				this.url = stage.io.url.urlToOject(media);
				this.load(media);
			break;
			default :
				throw new Error("Track error type")
		}
		this.sync = 0;
		this.retry = 0;
		this.ready = false ;
		this.muted = false ;
		this.currentTime = 0 ;
	};

	var routeSound = function(){
		this.out = this.source;
		if (this.settings.gain){
			this.volume =  this.createGain();
			this.out.connect(this.volume)
			this.out = this.volume ;		
		}
	
		if (this.settings.filter){
			this.filter = this.createFilter();
			this.out.connect(this.filter)
			this.out = this.filter ;
		}

		if (this.settings.panner){
			this.panner = this.createPanner();
			this.out.connect(this.panner)
			this.out = this.panner ;
		}

		if (this.settings.analyser){
			this.analyser = this.context.createAnalyser();
			this.analyser.smoothingTimeConstant = 0.85;
			this.out.connect(this.analyser)
			this.out = this.analyser ;
		}

	}


	Track.prototype.createSource = function(type, buffer){
		switch (type){
			case "audio":
				// create a sound source
				this.source = this.context.createBufferSource();
				// The Audio Context handles creating source
				// buffers from raw binary data
				var Buffer = this.context.createBuffer(buffer, true/*make mono*/);
				// Add the buffered data to our object
				this.source.buffer = Buffer;
				this.ready = true;
				routeSound.call(this);
				this.eventsManager.fire("onReady", this);
			break;
			case "decode" :
				this.context.decodeAudioData(buffer,
					function(decoded){
						this.source = this.context.createBufferSource();
						this.source.buffer = decoded; 
						this.ready = true;
						routeSound.call(this);
						this.eventsManager.fire("onReady", this);
					}.bind(this),
					function(){ 
						console.log(arguments)
						// only on error attempt to sync on frame boundary
						//if(this.syncStream()) this.createSource(type, buffer);
					}.bind(this)
				);
			break;
			case "stream":
				this.source = this.context.createMediaStreamSource(buffer);
				this.ready = true;
				routeSound.call(this);
				this.eventsManager.fire("onReady", this);
			break;
			case "element":
				this.source = this.context.createMediaElementSource(buffer);
				this.ready = true;
				routeSound.call(this);
				this.eventsManager.fire("onReady", this);
			break;
		}
		return this.source;
	}

	Track.prototype.createGain = function(){
		return this.context.createGain();
	};

	Track.prototype.createPanner = function(){
		return this.context.createPanner();
	};

	Track.prototype.createFilter = function(){
		return this.context.createBiquadFilter();
	};

	Track.prototype.syncStream = function(){
		var buf8 = new Uint8Array(this.buffer); 
    		Uint8Array.prototype.indexOf = Array.prototype.indexOf;
    		var i=this.sync, b=buf8;
    		while(1) {
        		this.retry++;
        		i=b.indexOf(0xFF,i); if(i==-1 || (b[i+1] & 0xE0 == 0xE0 )) break;
        		i++;
    		}
    		if(i!=-1) {
        		var tmp=this.buffer.slice(i); //carefull there it returns copy
        		delete(this.buffer); this.buffer=null;
        		this.buffer=tmp;
        		this.sync=i;
        		return true;
    		}
    		return false;	
	}
	
	Track.prototype.play = function (loop) { 
		if ( this.ready ){
			this.out.connect(this.context.destination);
			if ( loop )
				this.source.loop = true;
			if ( this.source.noteOn )
				this.source.noteOn(0);
			if ( this.source.start )
				this.source.start(0)
		}
    	}

	Track.prototype.mute =  function() {
		this.source.noteOff(0);
	}

	Track.prototype.load = function (url) { 
		var ajaxSettings = {
			responseType : "arraybuffer",
			onSuccess:function(transport, progressEvent){
				//console.log(transport);
				this.contentType = transport.getHeader("content-type").split(";")[0]; 
				this.buffer= transport.response;
        			this.sync=0;
        			this.retry=0;
				switch(this.contentType){
					case (/audio\/.*/.test(this.contentType) ? this.contentType : null ) :
						this.createSource("audio", transport.response );
						//this.createSource("decode", transport.response );
					break;
					case (/video\/.*/.test(this.contentType) ? this.contentType : null ) :
						this.createSource("audio", transport.response );
					break;
				}
			}.bind(this)
		}
		this.transport = jQuery.ajax(url,  ajaxSettings);
	};

	var mediaMix = function(){
		this.tracks = [];	
		this.audioContext = new audioContext();
		this.ready = false;
		this.playing = false;
		this.progress = 0;
		this.averageVolume = 0;
		this.volumeLeft = 0;
		this.volumeRight = 0;
		this.gain = 1;
		this.loaded = 0;
		this.nodeGain = this.audioContext.createGain();
		this.nodePanner = this.audioContext.createPanner();
	};

	mediaMix.prototype.createTrack = function(media, settings){
		var track = new Track(media, this.audioContext, settings );
		this.tracks.push(track)
		return track ;
	};
	
	mediaMix.prototype.playTracks = function(){
		for (var i = 0 ; i<this.tracks.length ; i++){
			this.tracks[i].play();
		}
	}








	var mediaStream = null ;
	var getUserMedia = null;
	var attachMediaStream = null;
	var getMediaStream =null;


	var updaterMedia = function(){
		 
		// MediaStream	API 
		try {
			if (stage.browser.Webkit){

  				getUserMedia = navigator.webkitGetUserMedia.bind(navigator);


				getMediaStream = function(stream){
					return URL.createObjectURL(stream);
				};

				mediaStream =  webkitMediaStream ;
  				// The representation of tracks in a stream is changed in M26.
  				// Unify them for earlier Chrome versions in the coexisting period.
  				if (!webkitMediaStream.prototype.getVideoTracks) {
					webkitMediaStream.prototype.getVideoTracks = function() {
						return this.videoTracks;
					};
					webkitMediaStream.prototype.getAudioTracks = function() {
						return this.audioTracks;
					};
  				}
				return true;
			}
			if (stage.browser.Gecko){
								
  				getUserMedia = navigator.getUserMedia ? navigator.getUserMedia.bind(navigator) :   navigator.mozGetUserMedia.bind(navigator);

				getMediaStream = function(stream){
					return window.URL.createObjectURL(stream);
				};
  				  				
				mediaStream =  MediaStream ;
  				// Fake get{Video,Audio}Tracks
				if (!MediaStream.prototype.getVideoTracks) {
					MediaStream.prototype.getVideoTracks = function() {
						return [];
					};
				}
				if (!MediaStream.prototype.getAudioTracks) {	
					MediaStream.prototype.getAudioTracks = function() {
						return [];
					};
				}
				return true;
			}
			if (stage.browser.Opera){
				getUserMedia = navigator.getUserMedia ;
				getMediaStream = function(stream){
					return stream;
				};
				// Fake get{Video,Audio}Tracks
				if (!MediaStream.prototype.getVideoTracks) {
					MediaStream.prototype.getVideoTracks = function() {
						return [];
					};
				}
				if (!MediaStream.prototype.getAudioTracks) {	
					MediaStream.prototype.getAudioTracks = function() {
						return [];
					};
				}


				return true;
			}
			console.error("Browser does not appear to be mediaStream-capable");
		}catch(e){
			console.log(e);
		}
	}()






	/*
 	 *	MEDIA STREAM
 	 *
 	 *
 	 *
 	 *
 	 */	
	var defaultSettingsStream = {
		audio:true,
		video:true
	};

	var mediaStream = function(mediaElement, settings){
		this.settings = stage.extend({},defaultSettingsStream, settings)
		this.notificationsCenter = stage.notificationsCenter.create(this.settings, this);
		this.urlStream = null;
		this.stream = this.settings.stream ? this.setStream(this.settings.stream):null;
		this.mediaElement = mediaElement ? mediaElement : null ;
	};

	mediaStream.prototype.getUserMedia = function(settings, success, error){
		
		if (settings){
			this.settings = stage.extend( {}, defaultSettingsStream, settings)
			this.notificationsCenter.settingsToListen(settings);
		}
		getUserMedia({
				video:this.settings.video,
				audio:this.settings.audio
			},
			function(stream){
				this.setStream(stream);
				if (success)
					success(this);
				this.notificationsCenter.fire("onSucces", stream, this);
			}.bind(this),
			function(e){
				if (error)
					error(e);	
				this.notificationsCenter.listen(this, "onError")
			}.bind(this)
		);
	};
	
	mediaStream.prototype.setStream = function(stream){
		this.stream = stream ;
		this.urlStream = this.getMediaStream(stream);
		this.videotracks = this.getVideoTracks();
		this.audiotracks = this.getAudioTracks();
		return stream ;
	};	

	mediaStream.prototype.stop = function(){
		if (this.stream){
			this.stream.stop();
		}
	};	

	mediaStream.prototype.getMediaStream = getMediaStream ;

	mediaStream.prototype.attachMediaStream = function(){
		if (stage.browser.Webkit || stage.browser.Opera){
			return function(element){ 
				// Attach a media stream to an element.
				this.mediaElement = element;
				element.src = this.getMediaStream(this.stream);
				element.play();
			}
		}
		if (stage.browser.Gecko){
			return function(element){ 
				// Attach a media stream to an element.
				this.mediaElement = element;
				element.mozSrcObject = this.stream;
				element.play();
			}
		}
  	}();
	
	//FIXME
	mediaStream.prototype.reattachMediaStream = function(){
		if (stage.browser.Webkit){
			return function(to){ 
				// reattach a media stream to an element.
				this.mediaElement.src = this.getMediaStream(this.stream);
				//to.src = this.mediaElement.src;
				this.mediaElement.play()
				//this.mediaElement = to;
			}
		}
		if (stage.browser.Gecko){
			return function(to){ 
				// reattach a media stream to an element.
				to.mozSrcObject = this.mediaElement.mozSrcObject;
				to.play();
				this.mediaElement = to;
			}
		}
  	}();

	mediaStream.prototype.getVideoTracks = function(){
		return this.stream.getVideoTracks();
	};

	mediaStream.prototype.getAudioTracks = function(){
		return this.stream.getAudioTracks();
	};


	/*mediaStream.prototype.startRecording = function(stream){
		var mediaStreamSource = this.audioContext.createMediaStreamSource(stream);
		console.log(mediaStreamSource);
		mediaStreamSource.connect(this.audioContext.destination);
		this.recorder = new Recorder(mediaStreamSource);
	}

	mediaStream.prototype.stopRecording = function(){
		this.recorder.stop();
		this.recorder.exportWAV(function(stream) {
			this.recordSource = window.URL.createObjectURL(stream);
		}.bind(this));

	}*/




	return {
		mediaStream		: mediaStream,
		webAudioApi		: webAudioApi,
		mediaMix		: mediaMix
	}

});
