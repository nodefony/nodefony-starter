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
			$('#containerStart').hide();
			$('#containerDemo').show();
			webRTC.register( userName );
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
				user.mediaStream.getUserMedia({
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
			onRemoteStream : function(event, remoteStream/*.urlStream*/, webrtc){
				var vid = mv.AddRemoteMedia(remoteStream, webrtc);
				remoteStream.attachMediaStream(vid);
				var track = mix.createTrack(remoteStream,{
					filter		: false,
					panner		: false,
					analyser	: true,
					onReady		:function(media){
						media.play();
						var intervalSpectrumId = setInterval(function(){
							drawSpectrum($('#canvas2').get(0) ,media.analyser);
						}, 30);
					}	
				});					
			},
			onRinging:function(user, message){
				console.log( user + " Sonne");
			},
			onTrying:function(user, message){
				//console.log( user + " Communication ");
			},
			onOffHook:function(user){
				console.log(user + " à Décrocher");
			},
			onOnHook:function(user){
				console.log( user +" à Racrocher");
				mv.removeRemoteMedia(user);
			},
			onDecline:function(user, code, message){
				console.log(user + " à Décliner");
			},
			onError:function(method, code, message){
				 switch (method){
					case "INVITE" :
						switch (code){
							case 404 :
								stage.ui.log(message.response.to+" n'est pas en ligne" );
							break;
							case 408 :
								stage.ui.log(message.response.to+" ne repond pas" );
							break;
							default:
								stage.ui.log(message.response.to+": "+ message.response.message);
							break;
						}
					break;
					case "REGISTER" :
						switch (code){
							case 409 :
								stage.ui.log(message.response.to+" :" + message.response.message );
							break;
							default:
								stage.ui.log(message.response.to+": "+ message.response.message);
							break;
						}
					break;
					default:
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
		}


		/* ---------------------------------------------- /*
		 * WOW Animation When You Scroll
		/* ---------------------------------------------- */

		wow = new WOW({
			mobile: false
		});
		wow.init();

	},
	onGetConfigError:function(module) {
	}
});



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
		this.rowRemote = $(document.createElement("div"));
		this.rowRemote.addClass("row");
		this.remoteSpace.append(this.rowRemote);

	};

	mediaView.prototype.removeRemoteMedia = function(user){
		if (user in this.users){
			this.users[user].remove();
			delete this.users[user];
		}
	};

	mediaView.prototype.AddRemoteMedia = function(remoteStream,  transaction){
		this.nbTrackVideo =  remoteStream.videotracks.length ;
		this.nbTrackAudio =  remoteStream.audiotracks.length ;

		switch (this.nbTrackVideo){
			case 0 :
				if (this.nbTrackAudio){
					
					var ele = $(document.createElement("div"));
					var ico = $(document.createElement("span"));
					ico.addClass("fa fa-headphones");
					ele.append(ico);
					var media = this.buildAudio();	
					ele.append(media);
					ele.addClass("audio-container col-md-6 col-xs-8 col-centered");
					
					this.remoteSpace.append(ele);
					this.users[transaction.to.name] = ele ;
				}
				break;
			default:
				var media = this.buildVideo();	
				var ele = $(document.createElement("div"));
				ele.append(media);
				ele.addClass("video-container col-md-6 col-xs-8 col-centered");
				this.remoteSpace.append(ele);
				this.users[transaction.to.name] = ele ;
				break;
		};
		
		this.buildControls(transaction.to.name, transaction, ele,  media.get(0), remoteStream);

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
		media.addClass("embed-responsive-item");
		media.attr("controls",false)
		media.get(0).onvolumechange = function(event){
			//console.log(this.volume)
		};
		return media ; 

	};

	mediaView.prototype.buildAudio = function(){
		var media =  $(document.createElement("audio"));
		media.addClass("embed-responsive-item");
		return media ;
	};


