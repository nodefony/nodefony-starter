stage.register.call(callContact, 'masterAudioMix', function(){

	var defaultSettings = {
		
	};

	var masterAudioMix = function( kernel, settings){
		this.settings = stage.extend({}, defaultSettings, settings);
		this.kernel = kernel;
		this.notificationCenter = stage.notificationsCenter.create(this.settings, this);
		//this.storage = new callContact.browserStorage("local");
		//this.state = this.storage.get("keyboard_view");
	};
	
	masterAudioMix.prototype.build = function(container){
		this.container = container;
		this.container.append('<div class="row-fluid">\
			<div class="col-xs-3 text-center mute">\
				<span class="fa fa-volume-up fa-2x text-primary" title="Mute"></div>\
			</div>\
			<div class="col-xs-6 text-center">\
				<input type="text" class="bootSlider"/>\
			</div>\
			<div class="col-xs-3 text-center">\
				<span class="fa fa-sliders fa-rotate-90 fa-2x text-primary" title="Console audio"></div>\
				<div class="consoleAudio">\
				</div>\
			</div>\
		</div>');
		//console.log(this.container.find('.bootSlider'));
		
		this.container.find('.mute .fa').click(function(){
			if($(this).hasClass('fa-volume-up')){
				$(this).removeClass('fa-volume-up');
				$(this).addClass('fa-volume-off');
				$(this).prop('title', 'UnMute');
			} else {
				$(this).removeClass('fa-volume-off');
				$(this).addClass('fa-volume-up');
				$(this).prop('title', 'Mute');
			}
		});
		
		
		this.container.find('.bootSlider').slider({
			reversed : true,
			min: 0, 
			max: 100,
			step: 10,
			value: 50,
			reversed: false
		});
		
		this.container.find('.fa-sliders').click(function(){
			if($('.consoleAudio').is(':visible')){
				$('.consoleAudio').hide();
			} else {
				$('.consoleAudio').show();
			}
		});
	};
	
	masterAudioMix.prototype.addTrack = function(){
		
	};
	
	masterAudioMix.prototype.listen = function(){
		return this.notificationCenter.listen.apply(this.notificationCenter, arguments);
	};

	masterAudioMix.prototype.fire = function(){
		return this.notificationCenter.fire.apply(this.notificationCenter, arguments);
	};
	
	
	
	return masterAudioMix;	
});