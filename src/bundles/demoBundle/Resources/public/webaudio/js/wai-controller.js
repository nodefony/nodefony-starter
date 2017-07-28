
//stage.register.call(wai, 'controller', function(){

module.exports =  function(){

	var controller = function(){
		this.ui = null;
		this.masterTrack = null;
		this.tracks = {};
		this.mediaMix = null;
	};


	var dtmfRef ={
		"1": [697,1209],
		"2": [697,1336],
		"3": [697,1477],
		"4": [770,1209],
		"5": [770,1336],
		"6": [770,1477],
		"7": [852,1209],
		"8": [852,1336],
		"9": [852,1477],
		"#": [941,1209],
		"0": [941,1336],
		"*": [941,1477]

	}

	controller.prototype.buildDtmf = function(){
		var obj = {};
		for (var dtmf in dtmfRef){
			var os1 = this.mediaMix.createOscillator();
			var os2 = this.mediaMix.createOscillator();
			var merger = this.mediaMix.createChannelMerger(2);
			os1.type = "sine";
			os1.frequency.value = dtmfRef[dtmf][0];
			os2.type = "sine";
			os2.frequency.value = dtmfRef[dtmf][1];;
			os1.connect(merger, 0, 0);
			os2.connect(merger, 0, 1);
			os1.start(0);
			os2.start(0);
			var track = this.addTrack("DTMF "+ dtmf, merger);
			obj[dtmf] = track ;
		}
		return obj ;
	}

	controller.prototype.build440 = function(){
		// LA 440
		var os = this.mediaMix.createOscillator();
		os.type = "sine";
		os.frequency.value = 440;
		//os.start(0);
		return this.addTrack("LA 440", os);
	}

	controller.prototype.playRinging = function( timeBlink, time){
		this.LA.play(0);
		if ( timeBlink ) {
			var blink = timeBlink;
		}else{
			var blink = 1500 ;
		}
		if ( time ){
			var ti =  time;
		}else{
			var ti =  10000;
		}
		var interval = setInterval(function(){
			if (this.LA.muted){
				this.LA.unmute();
			}else{
				this.LA.mute();
			}
		}.bind(this), blink )
		setTimeout(function(){
			clearInterval(interval);
			this.LA.pause(0);
		}.bind(this), ti)
	}

	controller.prototype.playDtmf = function(key, duration){
		var touch = key+""
		if (  touch in this.dtmf){
				this.dtmf[touch].play(0)
				setTimeout(function(){
						this.dtmf[touch].pause()
				}.bind(this), duration || 500)
		}
	}

	controller.prototype.playRing = function( duration){
			this.ring.play(0, true);
			setTimeout(function(){
					this.ring.pause()
			}.bind(this), duration || 10000)
	}

	controller.prototype.build = function(container){
		if(!wai || !wai.UI){
			throw "wai.UI not exist";
		} else {

			this.ui = new wai.UI(container);
			this.ui.buildContainer();

			this.masterTrack = this.ui.buildGlobalTrack();

			this.mediaMix = new stage.media.mediaMix({onReadyTrack: function(mix, track){
				var ui = this.ui.addTrack(track, track.name);
				switch (true){
					case track.media instanceof stage.media.mediaStream :
						track.media.attachMediaStream( ui.mediaTag.get(0) );
						//track.play(0, true);
						ui.mediaTag.prop('muted', true);
					break;
					case track.mediaType === "video" :
						ui.mediaTag.get(0).src = track.urlStream ;
						//ui.mediaTag.get(0).play();
						ui.mediaTag.prop('muted', true);
						//track.play(0, true);
					break;
					case track.mediaType === "audio" :
						//track.play(0, true);
					break;
					case track.mediaType === "audioNode" :
						//track.play(0, true);
					break;
					case track.mediaType === "domElement" :
						//console.log(track.media)
					break;
				}
				setEvent.call(this, ui, track);

			}.bind(this)});

			setEventGlobal.call(this);

			this.ring = this.addTrack('marimba', '/webAudioApiBundle/music/marimba.wav');
			this.addTrack('Chico Buarque', '/webAudioApiBundle/music/Chico_Buarque.mp3');
			this.addTrack('Video', '/webAudioApiBundle/music/oceans-clip.webm');

			//this.LA = this.build440();
			this.dtmf = this.buildDtmf();

			// GET USER MEDIA
 			this.localMedia = new stage.media.mediaStream(null, {
				audio: true,
				video: true,
				onSucces: function(stream, mediaStream){
					 this.addTrack('LOCAL', mediaStream);
				}.bind(this),
				onError:  function(){
					console.log("ERROR");
				}.bind(this)
			});
			this.localMedia.getUserMedia();


			// TRY YOUTUBE
			//var video = $("<video/>", {src:"https://www.youtube.com/embed/k8LdRJqjjRM"})
			//this.addTrack("JUMP", video.get(0));
			// ringing
			//this.playRinging() ;

			// ringing busy
			//this.playRinging(500) ;

			// ring
			//setTimeout(function(){this.playRing(20000)}.bind(this), 10000)

			// play dtmf
			//this.playDtmf(1, 500)
			//this.playDtmf(2, 500)

			// aux1
			//var bus = this.mediaMix.createAudioBus("AUX1");
			//console.log(bus)
		}
	};

	// PLUG GLOBAL
	var setEventGlobal = function(){

		this.masterTrack.volume.slider('setValue', this.mediaMix.getGain() * 100);

		this.masterTrack.volume.on('change', function(ev){
			var val = ev.value.newValue / 100;
			this.mediaMix.setGain( val * val );
		}.bind(this));

		this.masterTrack.mute.attr('checked', this.mediaMix.muted);
		this.masterTrack.mute.on('click', function(ev){
			if(ev.currentTarget.checked){
				this.mediaMix.mute();
			} else {
				this.mediaMix.unmute();
			}
		}.bind(this));

		this.masterTrack.panner.val(this.mediaMix.panner.pan.value * 50 + 50).trigger('change');
		this.masterTrack.panner.on('change', function(obj, value){
			this.mediaMix.panner.pan.value = (value / 50) - 1;
		}.bind(this));
	};


	// PLUG TRACKS
	var setEvent = function(ui, track){

		// play
		ui.play.click(function(){
			var state = $(this).hasClass('fa-play') ;
			if(state){
				track.play(0);
				if ( track.name  === "Video"){
					ui.mediaTag.get(0).play();
				}
			} else {
				track.pause();
				if ( track.name  === "Video"){
					ui.mediaTag.get(0).pause();
				}
			}
		});

		ui.volume.slider('setValue', track.getGain() * 100);
		ui.volume.on('change', function(ev){
			var val = ev.value.newValue / 100;
			track.setGain(val * val)  ;
		});

		// MUTE MANAGE
		ui.mute.attr('checked', track.muted);
		ui.mute.on('click', function(ev){
			if(ev.currentTarget.checked){
				track.mute();
			} else {
				track.unmute();
			}
		});
		track.listen(this, "onMute", function(){
			//console.log("onMute")
		});
		track.listen(this, "onUnMute", function(){
			//console.log("onUnMute")
		});

		// MANAGE ANALYSER
		if(track.audioNodes.analyser) {
			var intervalSpectrumId = setInterval(function(){
				ui.spectrum.drawSpectrum(track.audioNodes.analyser);
			}, 30);
		}

		// MANAGE PANNER
		ui.panner.val(track.audioNodes.panner.pan.value * 50 + 50).trigger('change');
		ui.panner.on('change', function(obj, value){
			var val = Number(((value / 50) - 1).toFixed(1));
			track.audioNodes.panner.pan.value = val;
		});
	};

	controller.prototype.addTrack = function(name, media){
		return this.mediaMix.createTrack(media, {name:name, gain: true, panner: true, filter: false, analyser: true});
	};

	return controller;

}();
