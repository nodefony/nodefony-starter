stage.register.call(callContact, 'audioMix', function(){

    /*
     *
     *   CLASS RING
     */
    var Ring = function(mixer){
        this.mixer = mixer ;
        this.music = this.mixer.addTrack('marimba', '/callContactBundle/sound/marimba.wav');
        this.timeout = null ;
    }
    Ring.prototype.play = function(duration){
        this.music.play( 0, true);
        this.timeout = setTimeout(function(){
                this.music.pause();
        }.bind(this), duration || 10000)
    };
    Ring.prototype.stop = function(mixer){
        this.music.pause();
        clearTimeout( this.timeout );
        this.timeout = null ;
    }

    /*
     *
     *   CLASS RINGING
     */
    var Ringing = function(mixer){
        this.mixer = mixer ;
        this.LA = this.build440("LA 440");
        this.LA_BUSY = this.build440("LA_BUSY 440");
        this.intervalRinging = null ;
        this.timeoutRinging = null ;
        this.intervalBusy = null ;
        this.timeoutBusy = null ;
    }

    Ringing.prototype.build440 = function(name){
		// LA 440
		var os = this.mixer.mediaMix.createOscillator();
		os.type = "sine";
		os.frequency.value = 440;

        var merger = this.mixer.mediaMix.createChannelMerger(2);
        os.connect(merger, 0, 0);
        os.connect(merger, 0, 1);
        os.start(0);
		return this.mixer.addTrack(name, merger);
	}

    Ringing.prototype.play = function(duration){
        this.LA.play(0);
		var blink = 2300 ;
		this.intervalRinging = setInterval(function(){
			if (this.LA.muted){
				this.LA.unmute();
			}else{
				this.LA.mute();
			}
		}.bind(this), blink );
		this.timeoutRinging = setTimeout(function(){
			clearInterval(this.intervalRinging);
			this.LA.pause(0);
            this.intervalRinging = null ;
            this.timeoutRinging = null ;
		}.bind(this), duration || 10000);
    };

    Ringing.prototype.stop = function(){
        this.LA.pause(0);
        clearInterval( this.intervalRinging );
        this.intervalRinging = null ;
        clearTimeout( this.timeoutRinging );
        this.timeoutRinging = null ;
    }

    Ringing.prototype.playBusy = function(duration){
        this.LA_BUSY.play(0);
		var blink = 500 ;
		this.intervalBusy = setInterval(function(){
			if (this.LA_BUSY.muted){
				this.LA_BUSY.unmute();
			}else{
				this.LA_BUSY.mute();
			}
		}.bind(this), blink )
		this.timeoutBusy = setTimeout(function(){
			clearInterval(this.intervalRinging);
			this.LA_BUSY.pause(0);
            this.intervalBusy = null ;
            this.timeoutBusy = null ;
		}.bind(this), duration || 10000)
    };

    Ringing.prototype.stopBusy = function(){
        this.LA_BUSY.pause(0);
        clearInterval(this.intervalBusy);
        this.intervalBusy = null ;
        clearTimeout( this.timeoutBusy );
        this.timeoutBusy = null ;
    }

    /*
     *
     *   CLASS DTMF
     */
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
 	};

     var Dtmf = function(mixer){
         this.mixer = mixer ;
         this.dtmf = this.buildDtmf();
     }

     Dtmf.prototype.buildDtmf = function(){
 		var obj = {};
 		for (var dtmf in dtmfRef){
 			var os1 = this.mixer.mediaMix.createOscillator();
 			var os2 = this.mixer.mediaMix.createOscillator();
 			var merger = this.mixer.mediaMix.createChannelMerger(2);
 			os1.type = "sine";
 			os1.frequency.value = dtmfRef[dtmf][0];
 			os2.type = "sine";
 			os2.frequency.value = dtmfRef[dtmf][1];;
 			os1.connect(merger, 0, 0);
 			os2.connect(merger, 0, 1);
 			os1.start(0);
 			os2.start(0);
 			var track = this.mixer.addTrack("DTMF "+ dtmf, merger);
 			obj[dtmf] = track ;
 		}
 		return obj ;
 	}

    Dtmf.prototype.play = function(key, duration){
		var touch = key+"" ;
		if (  touch in this.dtmf){
				this.dtmf[touch].play(0)
				setTimeout(function(){
						this.dtmf[touch].pause()
				}.bind(this), duration || 500)
		}
	}

    /*
     *
     *   CLASS MIXER
     */
    var mixer = function(settings){

        this.settings = stage.extend({} , settings)
		this.mediaMix = null;
        this.build();

        // RING
        //setTimeout(function(){this.ring.play(20000)}.bind(this), 5000)
        //setTimeout(function(){this.ring.stop()}.bind(this), 15000)
        this.ring = new Ring(this);

        // RINGING
        //this.ringing.play() ;
        //this.ringing.playBusy() ;
        this.ringing = new Ringing(this);

        // DTMF
        //this.dtmf.play(1, 500);
        //this.dtmf.play(2, 500);
        this.dtmf = new Dtmf(this) ;

	};

    mixer.prototype.build = function(){
	       this.mediaMix = new stage.media.mediaMix();
           // CREATE BUS AUXILIAIRE 1
           this.aux1 = this.mediaMix.createAudioBus("AUX1");
    }

    mixer.prototype.addTrack = function(name, media, settings){
        var mySettings = stage.extend( {
            name:name,
            panner: false,
        }, settings)
        return this.mediaMix.createTrack(media, mySettings);
    };

    return mixer ;

});
