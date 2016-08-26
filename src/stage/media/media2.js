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
		panner		: true,
		filter		: false,
		analyser	: false,
		connect		: true,
	};

	var Track = function(media, bus, settings){
		this.media = media ;
		this.bus = bus ;
		this.settings = stage.extend({}, trackSettings, settings);
		this.audioNodes = {} ;
		this.audioBus = {};
		this.transport = null;
		this.context = bus.audioContext ;

		this.source = null;
		this.buffer = null;
		this.out = null ;
		this.in = null ;

		this.name = this.settings.name ;

		this.sync = 0;
		this.retry = 0;
		this.ready = false ;
		this.muted = false ;
		this.currentTime = 0 ;
		this.eventsManager = stage.notificationsCenter.create(this.settings, this);
		this.createNodes();

		this.listen(this, "onReady" , function(){
				// connect track to master bus
				if ( this.settings.connect ){
					this.connect(this.bus.in);
				}
		})

		var type = stage.typeOf(media) ;
		switch ( type ){
			case "object" :
				switch (true ){
					case  media instanceof mediaStream :
						this.mediaType = "stream" ;
						this.buffer = media.stream;
						this.url = stage.io.urlToOject(media.urlStream);
						this.ready = true;
						this.fire("onReady", this);
					break;
					case  media instanceof AudioNode :
						this.mediaType = "audioNode" ;
						this.buffer = media ;
						this.ready = true;
						this.fire("onReady", this);
					break;
					default :
						var error = new Error ("media type not allowed ") ;
						this.fire("onError",  error) ;
						throw error ;
				}
			break;
			case "element":
				// TODO
				this.mediaType = "domElement" ;
				this.createSource(media);

			break;
			case "string" :
				this.url = stage.io.urlToOject(media);
				this.load(media);
			break;
			default :
				var error = new Error ("Track media type error") ;
				this.fire("onError",  error) ;
				throw error ;
		}
	};

	Track.prototype.setName = function(name){
		this.name = name ;
	}

	Track.prototype.listen = function(){
		return this.eventsManager.listen.apply(this.eventsManager, arguments);
	};

	Track.prototype.unListen = function(){
		return this.eventsManager.unListen.apply(this.eventsManager, arguments);
	};

	Track.prototype.fire = function(){
		return this.eventsManager.fire.apply(this.eventsManager, arguments);
	};

	Track.prototype.createNodes = function(){

		this.audioNodes["mute"] = this.bus.createGain() ;
		this.in = this.audioNodes["mute"];
		this.out = this.audioNodes["mute"];

		if (this.settings.gain){
			this.audioNodes["gain"] = this.bus.createGain() ;
			this.out.connect( this.audioNodes["gain"] )
			this.out = this.audioNodes["gain"];
		}
		if (this.settings.filter){
			this.audioNodes["filter"]  = this.bus.createFilter();
			this.out.connect(this.audioNodes["filter"])
			this.out = this.audioNodes["filter"] ;
		}

		if (this.settings.panner){
			this.audioNodes["panner"]  = this.bus.createStereoPanner();
			this.out.connect( this.audioNodes["panner"] );
			this.out = this.audioNodes["panner"] ;
		}
		if (this.settings.analyser){
			this.audioNodes["analyser"] = this.bus.createAnalyser();
			this.audioNodes["analyser"].smoothingTimeConstant = 0.85;
			this.out.connect( this.audioNodes["analyser"] );
		}
	}

    Track.prototype.setGain =  function(value) {
      this.audioNodes.gain.gain.value = value ;
      return this;
  	} ;

	Track.prototype.getGain =  function() {
      return this.audioNodes.gain.gain.value  ;
  	} ;

	Track.prototype.mute =  function() {
      this.audioNodes.mute.gain.value = 0;
      this.muted = true;
	  this.fire("onMute",this)
      return this;
  	};

    Track.prototype.unmute =  function(){
      this.audioNodes.mute.gain.value = 1;
	  this.muted = false;
	  this.fire("onUnMute",this)
      return this;
  	};

	Track.prototype.pause =  function(when) {
      if ( this.source ) {
		if (this.source.node && this.source.playbackState == this.source.node.PLAYING_STATE) {
    		this.source.node.stop( when || 0 );
		}
		this.disconnectSource();
      }
      return this;
  	};

    Track.prototype.play = function( time , loop) {
	  	this.pause().connectSource();
	  	if ( loop )
 			this.source.loop = true;
 	 	if ( this.source.noteOn )
 		 	this.source.noteOn(this.context.currentTime, time);
 	 	if ( this.source.start )
 		 	this.source.start(this.context.currentTime, time)
		return this ;
  	};

	Track.prototype.connectSource = function(){
		this.source = this.createSource();
		this.source.connect( this.in );
	};

	Track.prototype.disconnectSource = function(){
		this.source.disconnect( this.in );
        this.source = null;
	};

	Track.prototype.connect = function(audioNode){
		this.destination = audioNode ;
		this.out.connect(audioNode);
	};
	Track.prototype.disconnect = function(){
		this.out.disconnect( this.destination );
		this.destination = null ;
	};

	Track.prototype.createSource = function( buffer ){
		//console.log(arguments);
		switch ( this.mediaType ){
			case "audioNode":
				var source = buffer || this.buffer ;
			break;
			case "video":
			case "audio":
				var source = this.context.createBufferSource();
				source.buffer = buffer || this.buffer;
			break;
			case "domElement" :
				//TODO
				//console.log("PASSSS ELEMENT");
			break;
			case "decode" :
				this.rawBuffer = buffer ;
				this.urlStream = URL.createObjectURL ( new Blob([this.rawBuffer]) )
				this.context.decodeAudioData(buffer,
					function(decoded){
						this.buffer = decoded ;
						this.ready = true;
						this.fire("onReady", this);
					}.bind(this),
					function(error){
						console.log(arguments)
						this.eventsManager.fire("onError", this, error);
						// only on error attempt to sync on frame boundary
						//if(this.syncStream()) this.createSource(type, buffer);
					}.bind(this)
				);
			break;
			case "stream":
				var source = this.context.createMediaStreamSource(buffer || this.buffer);
			break;
			case "element":
				var source = this.context.createMediaElementSource(buffer || this.buffer);
			break;
		}
		return source;
	}

	Track.prototype.syncStream = function(){
		var buf8 = new Uint8Array(this.buffer);
    		Uint8Array.prototype.indexOf = Array.prototype.indexOf;
    		var i=this.sync, b=buf8;
    		while(1) {
        		this.retry++;nodeGain
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

	Track.prototype.load = function (url) {

		this.transport = new XMLHttpRequest();
		this.transport.open("GET", url, true);
		this.transport.responseType = "arraybuffer";
		this.transport.onload = function() {
		    // Asynchronously decode the audio file data in request.response
			this.mediaType = "decode" ;
			this.createSource( this.transport.response ) ;
			this.contentType = this.transport.getResponseHeader("content-type").split(";")[0];
			switch(this.contentType){
				case (/audio\/.*/.test(this.contentType) ? this.contentType : null ) :
					this.mediaType = "audio" ;
				break;
				case (/video\/.*/.test(this.contentType) ? this.contentType : null ) :
					this.mediaType = "video" ;
				break;
			}
		  }.bind(this)

		this.transport.onerror = function() {
			console.error('BufferLoader: XHR error');
		}

		this.transport.send();
	};


	/*
	 *
	 *	CLASS AUDIOBUS
	 *
	 */
	 var defaultAudioBusSettings = {
		 panner: false,
		 analyser:false
	 }
	var audioBus = function(name, mixer, settings){
		this.name = name ;
		this.mixer = mixer ;
		this.settings = stage.extend({}, defaultAudioBusSettings, settings);
		this.audioContext = new audioContext();
		this.tracks = [];
		this.audioNodes = {} ;

		this.in = null ;
		this.out = null ;
		this.destination = null ;
		this.muted = false;

		this.createNodes();
	}

	audioBus.prototype.createNodes = function(){
		// mute
		this.audioNodes["mute"] = this.createGain();
		this.in = this.audioNodes["mute"];

		// gain
		this.audioNodes["gain"] = this.createGain();
		this.in.connect( this.audioNodes["gain"] );
		this.out = this.audioNodes["gain"];

		// analyseur stéreo
		if ( this.settings.analyser ){
			this.audioNodes["splitter"]= this.createChannelSplitter(2);
			this.out.connect( this.audioNodes["splitter"] );
			this.audioNodes["analyserLeft"] = this.createAnalyser();
			this.audioNodes["analyserLeft"].smoothingTimeConstant = 0.85;
			this.audioNodes["splitter"].connect(this.audioNodes["analyserLeft"], 0, 0);

			this.audioNodes["analyserRight"] = this.createAnalyser();
			this.audioNodes["analyserRight"].smoothingTimeConstant = 0.85;
			this.audioNodes["splitter"].connect(this.audioNodes["analyserRight"], 1, 0);
		}

		// panoramique
		if ( this.settings.panner ){
			this.audioNodes["panner"]  = this.createStereoPanner();
			this.out.connect( this.audioNodes["panner"] );
			this.out = this.audioNodes["panner"] ;
		}
	}

	audioBus.prototype.connect = function(audioNode){
		this.destination = audioNode ;
		this.out.connect(audioNode);
	}

	audioBus.prototype.disconnect = function(audioNode){
		if ( this.destination ){
			this.out.disconnect(this.destination);
			this.destination = null;
		}
	}

	audioBus.prototype.setGain =  function(value) {
      this.audioNodes.gain.gain.value = value ;
      return this;
  	} ;

	audioBus.prototype.getGain =  function() {
      return this.audioNodes.gain.gain.value  ;
  	} ;

	audioBus.prototype.mute =  function() {
      this.audioNodes.mute.gain.value = 0;
      this.muted = true;
      return this;
  	};

    audioBus.prototype.unmute =  function(){
      this.audioNodes.mute.gain.value = 1;
	  this.muted = false;
      return this;
  	};

	audioBus.prototype.createGain = function(){
		return this.audioContext.createGain();
	};

	audioBus.prototype.createPanner = function(){
		return this.audioContext.createPanner();
	};

	audioBus.prototype.createStereoPanner = function(){
		return this.audioContext.createStereoPanner();
	};

	audioBus.prototype.createFilter = function(){
		return this.audioContext.createBiquadFilter();
	};

	audioBus.prototype.createAnalyser = function(){
		return this.audioContext.createAnalyser();
	};

	audioBus.prototype.createChannelSplitter = function(nbChannel){
		return this.audioContext.createChannelSplitter(nbChannel);
	};

	audioBus.prototype.createChannelMerger = function(nbChannel){
		return this.audioContext.createChannelMerger(nbChannel);
	};

	audioBus.prototype.createOscillator = function(){
		return this.audioContext.createOscillator();
	};

	audioBus.prototype.createMediaStreamDestination = function(){
		var destination = this.audioContext.createMediaStreamDestination();
		this.disconnect();
		this.connect(destination);
		return destination ;
	};

	audioBus.prototype.createTrack = function(media, settings){
		var track = new Track(media, this, settings );
		this.tracks.push(track);
		return track ;
	};

	/*
	 *
	 *
	 *	MEDIA MIX
	 *
	 *
	 */
	var mixSettings = {};

	var mediaMix = function(settings){
		this.tracks = [];
		//this.audioContext = new audioContext();
		this.audioBus = {} ;
		this.nbBus = 0 ;
		this.settings = stage.extend({}, mixSettings, settings);
		this.eventsManager = new stage.notificationsCenter.create(this.settings, this);

		//console.log(this)

	 	this.createAudioBus("MASTER", {
			panner:true,
			analyser:true
		});
		this.masterBus = this.audioBus["MASTER"];
		this.audioContext = this.masterBus.audioContext ;
		this.muted = this.masterBus.muted;
		this.panner = this.masterBus.audioNodes.panner ;
		this.analyserLeft = this.masterBus.audioNodes["analyserLeft"];
		this.analyserRight = this.masterBus.audioNodes["analyserRight"];
		this.gain = this.masterBus.audioNodes["gain"];

		this.connect(this.audioContext.destination);
	};

	mediaMix.prototype.listen = function(){
		return this.eventsManager.listen.apply(this.eventsManager, arguments);
	};

	mediaMix.prototype.unListen = function(){
		return this.eventsManager.unListen.apply(this.eventsManager, arguments);
	};

	mediaMix.prototype.fire = function(){
		return this.eventsManager.fire.apply(this.eventsManager, arguments);
	};

	mediaMix.prototype.createAudioBus = function(name, settings){
		try {
			var bus = new audioBus(name, this , settings );
		}catch(e){
				throw e ;
		}
		this.audioBus[name] = bus ;
		this.nbBus++ ;
		return bus ;
	}

	mediaMix.prototype.connect = function(audioNode){
		this.destination = audioNode ;
		return this.masterBus.connect(audioNode);
	}

	mediaMix.prototype.disconnect = function(){
		this.masterBus.disconnect();
		this.destination = null ;
	}

	mediaMix.prototype.setGain =  function(value) {
	  this.masterBus.setGain(value);
      return this;
  	} ;

	mediaMix.prototype.getGain =  function() {
		return this.masterBus.getGain();
  	} ;

	mediaMix.prototype.mute =  function() {
		this.masterBus.mute();
		this.muted = this.masterBus.muted ;
      return this;
  	};

    mediaMix.prototype.unmute =  function(){
		this.masterBus.unmute();
		this.muted = this.masterBus.muted ;
      return this;
  	};

	mediaMix.prototype.createTrack = function(media, settings){
		var mysettings = stage.extend({}, settings, {
			onReady:function(track){
				this.fire('onReadyTrack', this, track);
			}.bind(this)
		})
		var track = new Track(media, this.masterBus, mysettings );
		this.tracks.push(track);
		return track ;
	};

	mediaMix.prototype.playTracks = function(time, loop){
		for (var i = 0 ; i<this.tracks.length ; i++){
			this.tracks[i].play( time, loop );
		}
	}

	mediaMix.prototype.createGain = function(){
		return this.audioContext.createGain();
	};

	mediaMix.prototype.createPanner = function(){
		return this.audioContext.createPanner();
	};

	mediaMix.prototype.createStereoPanner = function(){
		return this.audioContext.createStereoPanner();
	};

	mediaMix.prototype.createFilter = function(){
		return this.audioContext.createBiquadFilter();
	};

	mediaMix.prototype.createAnalyser = function(){
		return this.audioContext.createAnalyser();
	};

	mediaMix.prototype.createChannelSplitter = function(nbChannel){
		return this.audioContext.createChannelSplitter(nbChannel);
	};

	mediaMix.prototype.createChannelMerger = function(nbChannel){
		return this.audioContext.createChannelMerger(nbChannel);
	};

	mediaMix.prototype.createOscillator = function(){
		return this.audioContext.createOscillator();
	};

 	// UDPATER
 	var mediaStream = null ;
	var getMediaStream =null;

	var updaterMedia = function(){

		// MediaStream	API
		try {
			if (stage.browser.Webkit){

  				//getUserMedia = navigator.webkitGetUserMedia.bind(navigator);


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

  				//getUserMedia = navigator.getUserMedia ? navigator.getUserMedia.bind(navigator) :   navigator.mozGetUserMedia.bind(navigator);

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
				//getUserMedia = navigator.getUserMedia ;
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
		return navigator.getUserMedia({
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
