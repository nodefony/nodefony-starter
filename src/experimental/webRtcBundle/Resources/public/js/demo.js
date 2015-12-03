/**
 * * * * *
 * KERNEL *
 * * * * * 
 */





//== Kernel
var App = new stage.appKernel(null, "dev", {
	debug: true,
	location:{
		html5Mode:false
	},
	onLoad:function(){
		//this.logger("WINDOW LOAD");
		
		/* ---------------------------------------------- /*
		 *		Preloader
		/* ---------------------------------------------- */
		$('#status').fadeOut();
		$('#preloader').delay(300).fadeOut('slow');

		mv = new mediaView({
			containerUserSpace:$("#myDiv"),
			containerRemoteSpace:$("#remoteDiv")
		});

		mix = new stage.media.mediaMix();

		var select = $("#bt").bind("click",function(event){
				var user = $("#invite").val();
				webRTC.createOffer(user)
			});

		$('#invite').keypress(function(e){
			if (e.which == 13) {
				var user = $("#invite").val();
				webRTC.createOffer(user);
				return false;
			}
		});

		$('#startDemo').click(function(e){

			var userName = $("#username").val();
			$('#containerDemo').show();
			webRTC.register( userName );
		});
		this.notify = new notify(this);


		this.isotope =  new Isotope('.isotope', {
  			// options
  			itemSelector: '.isotope-item',
  			layoutMode: 'fitRows',
  			//layoutMode: 'masonry',
			masonry: {
				columnWidth: 300
			}
		});

	},
	onBoot:function() {
		
	},
	onReady: function() {
		//this.uiContainer = $(".debugContent").get(0) || $("body").get(0);

		var url = $("#username").attr("data-url");
		webRTC = new stage.webRtc(url, null,{
			onRegister:function(user, webrtc){
				//console.log(user)
				App.logger("register User "+user.name)
				var ms = user.mediaStream.getUserMedia({
					audio:true,
					video:true
				},function(mediaStream){
					//console.log(mediaStream)
					var vid = mv.AddUserMedia("video", user.name, mediaStream);
					mediaStream.attachMediaStream(vid);
				
					var track2 = mix.createTrack(mediaStream,{
						filter		: false,
						panner		: false,
						analyser	: true,
						onReady		:function(media){
							// not patch on audio output my microphone 
							//media.play();
							var intervalSpectrumId = setInterval(function(){
								drawSpectrum($('#canvas').get(0) ,media.analyser);
							}, 30);
						}	
					});
				})
			},
			onOffer:function(message, user, transac){
				
				var res = confirm("APPEL ENTRANT call from : "+message.response.from ) ; 
				if (res) {
					transac.setRemoteDescription("offer", user, message.response.sessionDescription, message.dialog);
				}else{
					message.dialog.invite({
						code:603,
						message:"Declined"	
					})
				}
				
			},
			onRemoteStream : function(event, remoteStream, transaction){
				var vid = mv.AddRemoteMedia(remoteStream, transaction);
				remoteStream.attachMediaStream(vid);
				var track = mix.createTrack(remoteStream,{
					filter		: false,
					panner		: false,
					analyser	: true,
					onReady		:function(media){
						media.play();
						var intervalSpectrumId = setInterval(function(){
							//drawSpectrum($('#canvas2').get(0) ,media.analyser);
							var canvasContainer = mv.users[transaction.to.name].canvasContainer ;
							drawSpectrum(canvasContainer.get(0) ,media.analyser);
						}, 30);
						 mv.users[transaction.to.name].idInterval = intervalSpectrumId ;
					}.bind(this)	
				});					

				
				App.isotope.appended( mv.users[transaction.to.name].container );
				App.isotope.layout();
			},
			onRinging:function(user, message){
				App.notify.logger( user + " Sonne");
			},
			onTrying:function(user, message){
				//console.log( user + " Communication ");
			},
			onOffHook:function(user){
				App.notify.logger(user + " à Décrocher");
			},
			onOnHook: function(user, message){
				//console.log(arguments);
				//console.log(message);
				App.notify.logger( user +" à Racrocher");
				//console.log(mv.users)
				if ( mv.users[user] &&  ( mv.users[user].idInterval || mv.users[user].idInterval == 0 ) ){
					clearInterval(mv.users[user].idInterval);
				}
				mv.removeRemoteMedia(user);
				App.isotope.layout();
			},
			onDecline:function(user, code, message){
				App.notify(user + " à Décliner");
			},
			onError:function(method, code, message){
				 switch (method){
					case "OFFER" :
					case "INVITE" :
						switch (code){
							case 404 :
								App.notify.logger(message.response.from+" n'est pas en ligne" );
							break;
							case 408 :
								App.notify.logger(message.response.from+" ne repond pas" );
							break;
							default:
								App.notify.logger(message.response.to+": "+ message.response.message);
							break;
						}
					break;
					case "REGISTER" :
						switch (code){
							case 409 :
								App.notify.logger(message.response.to+" :" + message.response.message );
							break;
							default:
								App.notify.logger(message.response.to+": "+ message.response.message);
							break;
						}
					break;
					default:
						App.notify.logger( message );
						throw new Error(message);
				}

			}
		});
		


	},
	onDomLoad: function() {
		//this.router.redirect(this.router.generateUrl("index"));	

		/* ---------------------------------------------- /*
		 * Smooth scroll / Scroll To Top
		/* ---------------------------------------------- */

		$('a[href*=#]').bind("click", function(e){
           
			var anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: $(anchor.attr('href')).offset().top
			}, 1000);
			e.preventDefault();
		});

		$(window).scroll(function() {
			if ($(this).scrollTop() > 100) {
				$('.scroll-up').fadeIn();
			} else {
				$('.scroll-up').fadeOut();
			}
		});


		/* ---------------------------------------------- /*
		 * Navbar
		/* ---------------------------------------------- */

		$('.header').sticky({
			topSpacing: 0
		});

		$('body').scrollspy({
			target: '.navbar-custom',
			offset: 70
		})


		/* ---------------------------------------------- /*
		 * Home BG
		/* ---------------------------------------------- */

		$(".screen-height").height($(window).height());

		$(window).resize(function(){
			$(".screen-height").height($(window).height());
		});

		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
			$('#home').css({'background-attachment': 'scroll'});
		} else {
			$('#home').parallax('50%', 0.1);
			//$('#demo').parallax('50%', 0.1);
		}

		/* ---------------------------------------------- /*
		 * WOW Animation When You Scroll
		/* ---------------------------------------------- */

		wow = new WOW({
			mobile: false
		});
		wow.init();
	},
});

var notify = function (kernel) {
	this.kernel = kernel ;
	this.nofificationHTML5 = false ;
  	// Voyons si le navigateur supporte les notifications
  	this.checkHTML5();
}

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
					body:"NODEFONY ",
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
}

notify.prototype.logger = function(message, title, severity){
	if ( this.nofificationHTML5 ){
		var notification = new Notification(title || "NODEFONY",{
				body:message,
				icon:"/webRtcBundle/images/fanout_icon.png"
		});
	}else{
		this.kernel.logger( title + " : " +  message , severity || "INFO" ) ;
	}
}

var webRTC = null;
var mv = null;

var drawSpectrum = function(canvas, myAudioAnalyser) {
        var ctx = canvas.getContext('2d');
        var width = canvas.width;
        var height = canvas.height;
        var bar_width = 10;
        ctx.clearRect(0, 0, width, height);
        var freqByteData = new Uint8Array(myAudioAnalyser.frequencyBinCount);
	//console.log(freqByteData)
        myAudioAnalyser.getByteFrequencyData(freqByteData);
        var barCount = Math.round(width / bar_width);
        for (var i = 0; i < barCount; i++) {
                var magnitude = freqByteData[i];
                // some values need adjusting to fit on the canvas
		ctx.fillStyle = 'rgb(150,50,250)';
                ctx.fillRect(bar_width * i, height, bar_width - 2, -magnitude + 60);
        }
};	


/*
	*
	* MEDIA VIEW
	*	
	*/
var settingsSyslog = {
	moduleName:"REALTIME",
	defaultSeverity:"INFO"
};

var mediaSetting = {
	containerUserSpace:null,
	containerRemoteSpace:null,
	chat:true
};

var mediaView = function(  settings){
	this.settings = $.extend({},mediaSetting, settings);
	this.createUserSpace();
	this.createRemoteSpace();
	this.users = {};
	this.syslog = new stage.syslog(settingsSyslog);
};

mediaView.prototype.logger = function(){
	return this.syslog.apply(this.syslog, arguments);
};

mediaView.prototype.setName = function(){
	this.media.attr("id", this.name);
};

mediaView.prototype.mute = function(media, mute, audiotracks){
	if (! media ) media = this.mediaElement ;
	media.muted = mute;
	if (audiotracks && audiotracks.length){
		for (var i = 0 ; i < audiotracks.length; i++){
			audiotracks[i].muted = mute 
				audiotracks[i].enabled =  ! mute 
		}
	}
};


mediaView.prototype.createUserSpace = function(){
	var row = $(document.createElement("div"));
	row.addClass("row");
	this.rowUser = row ;
	this.settings.containerUserSpace.prepend(row);
	this.videoSpace = $(document.createElement("div"));
	this.videoSpace.addClass("video-container embed-responsive embed-responsive-16by9");	
	row.append(this.videoSpace);
	if (this.settings.chat){
		//this.addChatSpace(row)	
	}
};		

mediaView.prototype.AddUserMedia = function(type, name, mediaStream){
	this.name = name;
	this.nbTrackVideo =  mediaStream.videotracks.length ;
	this.nbTrackAudio =  mediaStream.audiotracks.length ;

	switch (this.nbTrackVideo){
		case 0 :
			if (this.nbTrackAudio){
				var ico = $(document.createElement("span"));
				ico.addClass("fa fa-headphones");
				this.videoSpace.append(ico);
				this.media = this.buildAudio();
				this.videoSpace.append(this.media);
				this.mediaElement =  this.media.get(0);
				this.setName(name);
			}
		break;
		default:
			this.media = this.buildVideo();
			this.videoSpace.append(this.media);	
			this.mediaElement =  this.media.get(0);				
			this.mediaElement.volume = 0.0 ;
			this.mediaElement.muted = false ;
			this.setName(name);
		break;
	};
	
	this.buildControls(name, null, this.videoSpace, null, mediaStream);
	
	if (this.settings.chat){
		//this.addUserChat(name)	
	}
	return this.mediaElement
};

mediaView.prototype.addChatSpace = function(){

	var title= $(document.createElement("div"));
	title.attr("id", "discussion-title");
	title.addClass("col-md-10 col-xs-8 col-centered");
	title.text("Participants");
	this.rowUser.append(title)			

		this.box = $(document.createElement("div"));
	this.box.attr("id","discussion" );
	this.box.addClass("col-md-10 col-xs-8 col-centered");

	this.rowUser.append(this.box);


};

mediaView.prototype.addUserChat = function(name){
	var part = $(document.createElement("div"));
	part.text(name);
	this.box.append(part);
};


mediaView.prototype.createRemoteSpace = function(){
	this.remoteSpace = this.settings.containerRemoteSpace ; 
	//this.rowRemote = $(document.createElement("div"));
	//this.rowRemote.addClass("row");
	//this.remoteSpace.append(this.rowRemote);

};

mediaView.prototype.removeRemoteMedia = function(user){
	if (user in this.users){
		this.users[user].container.remove();
		delete this.users[user];
	}
};


/*var createPannelRemote = function(type, user, transaction, remoteStream){
	var ele = '<div id="container_'+user+'" class="panel panel-danger grid-item"> \
  		<div class="panel-heading"> \
    			<h3 class="panel-title">'+user+'</h3>\
  		</div>\
  		<div  id="remote_'+user+'" class="panel-body">\
			<div class="">\
				<canvas id="canvas_'+user+'" ></canvas>\
			</div>\
  		</div>\
	</div>';
	this.remoteSpace.append(ele);
	var container = $("#remote_"+user) ;
	var eleContainer = $("#container_"+user) ;
	var canvasContainer = $("#canvas_"+user) ;

	switch (type){
		case "video" :
			var media = this.buildVideo();
		break;
		case "audio" :
			var media = this.buildAudio();	
			
		break;
	}
	//console.log(media);
	//console.log(container);
	container.prepend(media);
	this.buildControls(user, transaction, container,  media.get(0), remoteStream);
	this.users[user] = {
		container : eleContainer,
		canvasContainer: canvasContainer,
 		mediaElement:	media
	} ;
	return media ;
}*/



var createPannelRemote = function(type, user, transaction, remoteStream){

	var ele = '<div id="container_'+user+'" class="video  isotope-item">\
		<div id="remote_'+user+'" class="video-inner">\
                        <p class="video-caption">'+user+'</p>\
                </div>\
		<div class="video-info">\
			<canvas id="canvas_'+user+'" ></canvas>\
		</div>\
        </div>';

	this.remoteSpace.append(ele);	
	var container = $("#remote_"+user) ;
	var eleContainer = $("#container_"+user) ;
	var canvasContainer = $("#canvas_"+user) ;

	switch (type){
		case "video" :
			var media = this.buildVideo();
		break;
		case "audio" :
			var media = this.buildAudio();	
			
		break;
	}
	//console.log(media);
	//console.log(container);
	container.prepend(media);
	this.buildControls(user, transaction, container,  media.get(0), remoteStream);
	this.users[user] = {
		container : eleContainer,
		canvasContainer: canvasContainer,
 		mediaElement:	media
	} ;
	return media ;
}


mediaView.prototype.AddRemoteMedia = function(remoteStream,  transaction){
	this.nbTrackVideo =  remoteStream.videotracks.length ;
	this.nbTrackAudio =  remoteStream.audiotracks.length ;

	switch (this.nbTrackVideo){
		case 0 :
			if (this.nbTrackAudio){
				var media = createPannelRemote.call(this, "audio", transaction.to.name, transaction, remoteStream)
				/*var ele = $(document.createElement("div"));
				var ico = $(document.createElement("span"));
				ico.addClass("fa fa-headphones");
				ele.append(ico);
				var media = this.buildAudio();	
				ele.append(media);
				ele.addClass("audio-container col-md-6 col-xs-8 col-centered");
				
				this.remoteSpace.append(ele);
				this.users[transaction.to.name] = ele ;*/
			}
			break;
		default:
			var media = createPannelRemote.call(this, "video", transaction.to.name, transaction, remoteStream)
			/*var media = this.buildVideo();	
			var ele = $(document.createElement("div"));
			ele.append(media);
			ele.addClass("video-container col-md-6 col-xs-8 col-centered");
			this.remoteSpace.append(ele);
			this.users[transaction.to.name] = ele ;*/
			break;
	};
	
	//this.buildControls(transaction.to.name, transaction, ele,  media.get(0), remoteStream);

	if (this.settings.chat){
		//this.addUserChat(transaction.to.name)	
	}
	return media.get(0);

};

mediaView.prototype.buildControls = function(name, transaction, container, media , mediaStream ){

	var vidControls = $(document.createElement('span')).addClass('video-controls');
	container.append(vidControls);
	var stack = $(document.createElement('span')).addClass('control-button fa-stack fa-3x');
	stack.append($(document.createElement('i')).addClass('fa fa-circle-thin fa-stack-2x'));
	stack.append($(document.createElement('i')).addClass('fa fa-microphone fa-stack-1x'));
	vidControls.append(stack);
	stack.click(function(event){
		$(event.currentTarget).find('.fa-microphone').toggleClass('fa-microphone-slash');
		var mute = $(event.currentTarget).find('.fa-microphone').hasClass('fa-microphone-slash');
		this.mute(media, mute, mediaStream.audiotracks);
	}.bind(this));

	var text = $(document.createElement('span')).addClass('controls-identity').text(name);
	vidControls.append(text);

	var stack = $(document.createElement('span')).addClass('control-button fa-stack fa-3x');
	stack.append($(document.createElement('i')).addClass('fa fa-circle-thin fa-stack-2x'));
	stack.append($(document.createElement('i')).addClass('fa fa-phone fa-stack-1x'));
	vidControls.append(stack);
	stack.click(function(){
		if(transaction) transaction.by(transaction.callId);
	});

	vidControls.hide();

	container.mouseover(function(){
		vidControls.show();
	});

	container.mouseout(function(){
		vidControls.hide();
	});

	return vidControls;
};

mediaView.prototype.buildVideo = function(){
	var media =  $(document.createElement("video"));
	//media.addClass("embed-responsive-item");
	media.attr("controls",false)
	media.get(0).onvolumechange = function(event){
		//console.log(this.volume)
	};
	return media ; 

};

mediaView.prototype.buildAudio = function(){
	var media =  $(document.createElement("audio"));
	//media.addClass("embed-responsive-item");
	return media ;
};


