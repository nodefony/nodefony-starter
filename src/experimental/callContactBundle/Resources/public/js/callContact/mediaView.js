
stage.register.call(callContact, 'getMediaView', function(){

	var defaultSettings = {};

	var openPanelControls = function(){
		if(!$(this).data('onAnimating')){
			$(this).animate({
				left: "0px",
				start: function(){
					$(this).data('onAnimating', true);
				},
				complete: function(){
					$(this).removeData('onAnimating');
				}
			});
		}
	};

	var closePanelControls = function(){

		if(!$(this).data('onAnimating')){
			var timeoutLeave = setTimeout(function(){

				$(this).animate({left: - $(this).width(),
					start: function(){
						$(this).data('onAnimating', true);
					},
					complete: function(){
						$(this).removeData('onAnimating');
					}});

			}.bind(this), 1000);
			$(this).data("timeoutLeave", timeoutLeave);
		}
	};

	var stopTimeoutLeave = function(){
		var timeoutLeave = $(this).data("timeoutLeave");
		if(timeoutLeave) {
			clearTimeout(timeoutLeave);
			$(this).removeData("timeoutLeave");
		}
	};




	var video = function(settings){
		this.type = "video";
		this.settings = stage.extend({}, defaultSettings, settings);
	};

	video.prototype.createPlayer = function(type, user, stream, api, transaction){

		var videoElm = $('<video/>', {
			class: "bg-black embed-responsive-item",
			"controls": false,
			"autoplay": true,
			"mouseover": function(){
				openPanelControls.call($(this).data("controls"));
			},
			"mousemove": function(){
				stopTimeoutLeave.call($(this).data("controls"))
			},
			"mouseout": function(){
				closePanelControls.call($(this).data("controls"));
			}
		});

		videoElm.get(0).onloadstart = function(){
			//console.log("PLAY")

			//this.play();
			// FIXME button
			if ( type == "LocalUser" )
				this.muted = true;

		};

		var elms = {};

		var stopSound = $('<div/>', {class: "btn-media-control", title: "Arréter le son", click: function(){
			var videoObj = $(this).closest('.mediaPlayerContainer').find('video');
			var icon = $(this).find('.fa');
			if(icon.hasClass('fa-microphone')){
				icon.removeClass('fa-microphone');
				icon.addClass('fa-microphone-slash');
				$(this).attr('title', "Remettre le son");
				if(videoObj.length) videoObj.get(0).muted = 1;
				videoElm.data('stream').getAudioTracks()[0].muted = 1;
			} else {
				icon.removeClass('fa-microphone-slash');
				icon.addClass('fa-microphone');
				$(this).attr('title', "Arréter le son");
				if(videoObj.length) videoObj.get(0).muted = 0;
				videoElm.data('stream').getAudioTracks()[0].muted = 0;
			}
		}}).append(
			$('<i/>', {class: "fa fa-microphone icon-control"})
		);

		var stopVideo = $('<div/>', {class: "btn-media-control", title: "Arréter la caméra", click: function(){
			var videoObj = $(this).closest('.mediaPlayerContainer').find('video');
			var icon = $(this).find('.fa');
			if(icon.hasClass('fa-eye')){
				icon.removeClass('fa-eye');
				icon.addClass('fa-eye-slash');
				$(this).attr('title', "Remettre le son");
				if(videoObj.length) videoObj.get(0).pause();
				videoElm.data('stream').getVideoTracks()[0].muted = 1;

			} else {
				icon.removeClass('fa-eye-slash');
				icon.addClass('fa-eye');
				$(this).attr('title', "Arréter le son");
				if(videoObj.length) videoObj.get(0).play();
				videoElm.data('stream').getVideoTracks()[0].muted = 0;
			}

		}}).append(
			$('<i/>', {class: "fa fa-eye icon-control"})
		);

		var hold = $('<div/>', {class: "btn-media-control", title: "Mettre en attente", click: function(){
			var videoObj = $(this).closest('.mediaPlayerContainer').find('video');
			var icon = $(this).find('.fa');
			if(icon.hasClass('fa-play')){
				icon.removeClass('fa-play');
				icon.addClass('fa-pause');
				$(this).attr('title', "Remettre en activité");

			} else {
				icon.removeClass('fa-pause');
				icon.addClass('fa-play');
				$(this).attr('title', "Mettre en attente");
			}

		}}).append(
			$('<i/>', {class: "fa fa-pause icon-control"})
		);

		var controls = $('<div/>', {
			class: "videoControlsContainer",
			style: "left: -50px;",
			"mouseover": function(){
				stopTimeoutLeave.call(this)
			},
			"mousemove": function(){
				stopTimeoutLeave.call(this)
			},
			"mouseout": function(){
				closePanelControls.call(this);
			},
		}).append(
			stopSound
		).append(
			stopVideo
		).append(
				hold
		);

		elms["sound"] = stopSound;
		elms["video"] = stopVideo;
		elms["hold"] = hold;

		if(type == 'RemoteUser'){

			var hangUp = $('<div/>', {class: "btn-media-control", title: "Raccrocher", click: function(){
				if ( transaction.dialog && transaction.dialog.status === transaction.dialog.statusCode.ESTABLISHED ){
					transaction.bye();
				}
			}}).append(
				$('<i/>', {class: "fa fa-phone icon-control"})
			);

			elms["hangUp"] = hangUp;

			controls.append( hangUp );
		}

		var dom = $('<div/>', {class: "mediaPlayerContainer"}).append(
			$('<div/>', {class: "embed-responsive embed-responsive-4by3"})
				.append(
					videoElm.data("controls", controls)
				)

		).append($('<div/>', {class: "media-video-title", text: type + ' : ' + user.displayName}))
		.append(
			controls
		);

		videoElm.data('stream', stream);

		stream.attachMediaStream(videoElm.get(0));
		setTimeout(function(){videoElm.get(0).play();}, 5000);

		if(this.settings.container)
			this.settings.container.append(dom);



		return elms;
	};



	// AUDIO CLASS

	var drawSpectrum = function(canvas, myAudioAnalyser) {
	        var ctx = canvas.getContext('2d');
	        var width = canvas.width;
	        var height = canvas.height;
	        var bar_width = 10;
	        ctx.clearRect(0, 0, width, height);
	        var freqByteData = new Uint8Array(myAudioAnalyser.frequencyBinCount);
	        myAudioAnalyser.getByteFrequencyData(freqByteData);
	        var barCount = Math.round(width / bar_width);
	        for (var i = 0; i < barCount; i++) {
	                var magnitude = freqByteData[i];
	                // some values need adjusting to fit on the canvas
			ctx.fillStyle = 'rgb(150,50,250)';
	                ctx.fillRect(bar_width * i, height, bar_width - 2, -magnitude + 60);
	        }
	};

	var audio = function(settings){
		this.type = "audio";
		this.settings = stage.extend({}, defaultSettings, settings);
	};

	audio.prototype.createPlayer = function(type, user, stream, api, transaction){


		var audioElm = $('<audio/>', {
			"controls": true,
			"autoplay": true
		});

		stream.attachMediaStream(audioElm.get(0));

		var controls = $('<div/>', {class: "audioControlsContainer"});
		var buttonControls = $('<div/>', {class: "col-xs-6"});
		controls.append(buttonControls);

		var elms = {};

		if(type == 'RemoteUser'){

			var stopSound = $('<div/>', {class: "btn-media-control", title: "Arréter le son", click: function(){
				var audioObj = $(this).closest('.mediaPlayerContainer').find('audio');
				var icon = $(this).find('.fa');
				if(icon.hasClass('fa-microphone')){

					icon.removeClass('fa-microphone');
					icon.addClass('fa-microphone-slash');
					$(this).attr('title', "Remettre le son");
				} else {

					icon.removeClass('fa-microphone-slash');
					icon.addClass('fa-microphone');
					$(this).attr('title', "Arréter le son");
				}
			}}).append(
				$('<i/>', {class: "fa fa-microphone icon-control"})
			);

			var hold = $('<div/>', {class: "btn-media-control", title: "Mettre en attente", click: function(){
				var audioObj = $(this).closest('.mediaPlayerContainer').find('audio');
				var icon = $(this).find('.fa');
				if(icon.hasClass('fa-play')){

					icon.removeClass('fa-play');
					icon.addClass('fa-pause');
					$(this).attr('title', "Remettre en activité");
				} else {

					icon.removeClass('fa-pause');
					icon.addClass('fa-play');
					$(this).attr('title', "Mettre en attente");
				}

			}}).append(
				$('<i/>', {class: "fa fa-pause icon-control"})
			);

			var hangUp = $('<div/>', {class: "btn-media-control", title: "Raccrocher", click: function(){
				console.log('Raccrocher');
				console.log(transaction);
				if ( transaction.dialog && transaction.dialog.status === transaction.dialog.statusCode.ESTABLISHED ){
					transaction.bye();
				}
			}}).append(
				$('<i/>', {class: "fa fa-phone icon-control"})
			);

			buttonControls
				.append(
					stopSound
				).append(
					hold
				).append(
					hangUp
				);

			controls.append(
				$('<div/>', {class: "col-xs-6"}).append($('<input/>', {type: "text", class: "m-l-xl bootSlider"}))
			);

			controls.find('.bootSlider').slider({
				reversed : true,
				min: 0,
				max: 100,
				step: 10,
				value: 50,
				reversed: false
			});

			elms["sound"] = stopSound;
			elms["hold"] = hold;
			elms["hangUp"] = hangUp;

		}

		var dom = $('<div/>', {class: ""});

		if(type == 'RemoteUser'){
			dom.append($('<div/>', {class: "media-audio-title", text: type + ' : ' + user.displayName}));
		}

		dom.append( audioElm ).append( controls );

		audioElm.data('stream', stream);

		stream.attachMediaStream(audioElm.get(0));

		if(type !== 'RemoteUser'){
			audioElm.get(0).muted = true;
		}

		if(this.settings.container)
			this.settings.container.append(dom);

		return elms;
	};


	return function(stream, settings){
		if(stream.videotracks && stream.videotracks.length){
			return new video(settings);
		} else {
			return new audio(settings);
		}
	};

});
