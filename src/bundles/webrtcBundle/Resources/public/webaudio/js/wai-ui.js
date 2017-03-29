//stage.register.call(wai, 'UI', function(){

module.exports =  function(){


	var tableMixContainer = function(){

		this.container.append('<div class="table mix-table">\
			<div class="table-row">\
				<div class="table-cell">\
					<div class="table">\
						<div class="table-row tracks">\
							\
						</div>\
					</div>\
				</div>\
				<div class="table-cell w-80 b-l">\
					<div class="table">\
						<div class="table-row mixTracks" style="overflow: auto;"></div>\
					</div>\
				</div>\
			</div>\
		</div>');

		this.tracksContainer = $('.tracks');
		this.mixTracksContainer = $('.mixTracks');
	};

	var createSpectrum = function(){

	};

	var trackUi = function(container, title, type){

		var content = $('<div class="table-cell" id="' + title + '">\
				<div class="table">\
				<div class="table-row title">\
					<div class="table-cell w-70">' + title + '</div>\
				</div>\
				<div class="table-row play">\
					<div class="table-cell w-70 mute">\
						<div class="h-50 m-t-10 text-center full-width">\
						<i class="fa fa-pause"></i>\
						</div>\
					</div>\
				</div>\
				<div class="table-row spectrum">\
					<div class="table-cell w-70 mute">\
						<div id="view" class="h-50 m-t-10 text-center full-width">\
							<canvas /><' + type + ' />\
						</div>\
					</div>\
				</div>\
				<div class="table-row pitch">\
					<div class="table-cell w-70 mute">\
						<div class="h-50 m-t-10 text-center full-width">\
							<div class="switch">\
								<input type="checkbox">\
								<label></label>\
							</div>\
						</div>\
					</div>\
				</div>\
				<div class="table-row pitch">\
					<div class="table-cell w-70 filter">\
						<div class="h-50 m-t-10 text-center full-width">\
							<input type="text" value="75" class="knob" />\
						</div>\
					</div>\
				</div>\
				<div class="table-row pitch">\
					<div class="table-cell w-70 filter">\
						<div class="h-50 m-t-10 text-center full-width">\
							<input type="text" value="10" class="knob" />\
						</div>\
					</div>\
				</div>\
				<div class="table-row pitch">\
					<div class="table-cell w-70 panner">\
						<div class="h-50 m-t-10 text-center full-width">\
							<input type="text" value="35" class="knob" />\
						</div>\
					</div>\
				</div>\
				<div class="table-row volume">\
					<div class="table-cell w-70 slider relative">\
						<input type="text" class="bootSlider" data-slider-min="0" data-slider-max="10" data-slider-step="1" data-slider-value="5" data-slider-orientation="vertical"/>\
					</div>\
				</div>\
			</div>\
		</div>');

		container.append(content);

		content.find('.bootSlider').slider({
			reversed : true,
			min: 0,
			max: 100,
			step: 10
		});

		content.find(".knob").knob({
			width: '70px',
			height: '80px',
			step: 10,
			angleOffset: -125,
			angleArc: 250,
			thickness: 0.5,
			change: function(value){
				this.$.trigger('change', value);
			}
		});

		var spectrum = content.find('.spectrum canvas');
		spectrum.drawSpectrum = drawSpectrum;

		var tag = content.find('audio').length ? content.find('audio') : content.find('video') ;

		var playPause = content.find('.play i.fa');
		playPause.click(function(){
			if($(this).hasClass('fa-play')){
				$(this).removeClass('fa-play');
				$(this).addClass('fa-pause');
			} else {
				$(this).removeClass('fa-pause');
				$(this).addClass('fa-play');
			}
		});

		return {
			mediaTag: tag ,
			spectrum: spectrum,
			mute: content.find('.mute input[type=checkbox]'),
			panner: content.find('.panner input[type=text]'),
			filter1: content.find('.filter1 input[type=text]'),
			filter2: content.find('.filter2 input[type=text]'),
			volume: content.find('.volume input[type=text]'),
			play:playPause,
		};
	};


	var waiUi = function(container){

		this.container = container || $('body');
	};

	waiUi.prototype.buildContainer = function(){
		tableMixContainer.call(this);
	};

	waiUi.prototype.buildGlobalTrack = function(){
		return trackUi.call(this, this.mixTracksContainer, 'MASTER');
	};

	waiUi.prototype.addTrack = function(track, name){
		var mediaType = track.mediaType
		if (  mediaType === "stream"){
			if ( track.media.getVideoTracks().length ){
				var mediaType = "video" ;
			}else{
				var mediaType = "audio" ;
			}
		}

		var dom = trackUi.call(this, this.tracksContainer, name, mediaType);

		if ( mediaType === "domElement"){
				$("#view").append( track.media )
				dom.mediaTag = track.media ;
		}
		return dom ;
	};

	waiUi.prototype.removeTrack = function(name){
		this.tracksContainer.find('#' + name).remove();
	};

	var drawSpectrum = function(myAudioAnalyser) {
		//console.log(this);
		//console.log(myAudioAnalyser);
		var canvas = $(this).get(0);
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


	return waiUi;

}();
