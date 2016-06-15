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
	this.settings.containerUserSpace.append(row);
	this.videoSpace = $(document.createElement("div"));
	this.videoSpace.addClass("video-container col-md-12 col-xs-8 col-centered");	
	row.append(this.videoSpace);
	if (this.settings.chat){
		this.addChatSpace(row)	
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
		this.addUserChat(name)	
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
		this.addUserChat(transaction.to.name)	
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
	media.addClass("video img img-responsive");
	media.attr("controls",false)
		media.get(0).onvolumechange = function(event){
			//console.log(this.volume)
		};
	return media ; 

};

mediaView.prototype.buildAudio = function(){
	var media =  $(document.createElement("audio"));
	media.addClass("audio img img-responsive");
	return media ;
};


var webRTC = null;
var mv = null;



$(window).unload( function(){
	if (webRTC){
		//webRTC.byAll();	
	}
});

/*$( document ).ready(function(){
	var userName = $("#userName").html();

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

	mv = new mediaView({
		containerUserSpace:$("#myDiv"),
		containerRemoteSpace:$("#remoteDiv")
	});

		//var server = "/realtime"
		var server = "/secure/realtime";
		var service = new stage.realtime(server ,{
			// fire when 401 http code
			onUnauthorized:function(authenticate, realtime){
				console.log("PASS")
				authenticate.register("admin", "admin");
			},
		    // fire when authetification success or not authenticate
		    onAuthorized:function(authenticate, realtime){
			    //stage.ui.log("WELCOME TO REAL TIME  WEBRTC ")
		    },
		    // fire when error
		    onError:function(code, realtime ,message){
			    //console.log(arguments)
			    //stage.ui.log(message);
			    switch (code){
				    case 500:
					    //try to subcribe
					    //realtime.subscribe("OPENSIP");
					    break;
				    case 403:
					    break;
			    }
		    },

		    // fire when socket connection ready 
		    onHandshake:function(message, socket, realtime){
			    stage.ui.info("HANSHAKE OK");
		    },
		    // fire when service is ready
		    onConnect:function(message, realtime){
			    stage.ui.log("CONNECT ON : "+realtime.publicAddress);
			    if (message.data.OPENSIP){
				    realtime.subscribe("OPENSIP");
			    }
		    },
		    onDisconnect:function(){
			    //webRTC.byAll();
			    stage.ui.info("Disconnect realtime service");
		    },
		    // fire when socket close
		    onClose:function(){
			    stage.ui.info( "onCLose");
			    if(webRTC){

			    }
		    },
		    // fire when service subcribed 
		    onSubscribe:function(service, message, realtime){
			    stage.ui.info( "SUBSCRIBE service : " + service);

			    if ( service  === "OPENSIP"){
				    //console.log(realtime);
				    var domain = realtime.services["OPENSIP"].domain ;
				    var port = realtime.services["OPENSIP"].port ;
				    var url = "sip://"+domain+":"+port ;
				    delete webRTC ;
				    webRTC = new stage.webRtc(realtime.services["OPENSIP"].domain, realtime, {
					    protocol:"SIP",
					   sipPort:realtime.services["OPENSIP"].port,
					   sipTransport:realtime.services["OPENSIP"].type,
					   onRegister:function(user, webrtc){
						   //console.log(webrtc)
						   //stage.ui.log("register User "+user.name);
						   user.mediaStream.getUserMedia({
								audio:true,
								video:true
							},
							function(mediaStream){
							   //console.log(mediaStream)
							   //var vid = buildVideo("myVideo_"+user.name, "video", $("#myDiv"));
							   var vid = mv.AddUserMedia("video", user.name, mediaStream);
							   mediaStream.attachMediaStream(vid);
						   });
					   },
					   onRemoteStream:function(event, remoteStream, transaction){
						   //console.log("PASS attachMediaStream ")
						   //var vid = buildVideo("remoteVideo_"+transaction.to.name, "video", $("#remoteDiv"));
						   //$("#remoteDiv").append(vid)
						   var vid = mv.AddRemoteMedia(remoteStream, transaction, remoteStream);
						   remoteStream.attachMediaStream(vid);
					   },	
					   onOffer:function(message, user, transac){
						   stage.ui.Confirm("APPEL ENTRANT","call from :"+message.fromName,function(cancel, accept){
							   if (cancel){
								   //TODO DECLINED
								   message.transaction.createResponse(603, "Declined");
								   message.transaction.sendResponse();
							   }
							   if (accept){
								   transac.setRemoteDescription("offer", user, message.rawBody, message.dialog);
							   }
						   })
					   },	
					   onRinging:function(user){
						   stage.ui.info(user+" Sonne !!!");
					   },
					   onOffHook:function(user){
						   stage.ui.info(user+" a decroché !!!");	
					   },
					   onOnHook:function(user){
						   stage.ui.info(user+" a racroché !!!");	
						   mv.removeRemoteMedia(user);
					   },
					   onDecline:function(user, code, message){
						   stage.ui.info(user+" a refusé");
					   },
					   onError:function(method, code, message){
						   switch (method){
							   case "INVITE" :
								   switch (code){
									   case 404 :
										   stage.ui.info(message.toName+" n'est pas en ligne" )
											   break;
									   case 408 :
										   stage.ui.info(message.toName+" ne repond pas" )
											   break;
									   default:
										   stage.ui.info(message.toName+": "+ message.statusLine.message)
									   		   break;
								   }
								   break;
							   default:
								   console.log(arguments);	
						   }
						   //console.log(message.toName)
					   }
				    });
				    webRTC.register(userName, "1234");
			    }	
		    },
		    // fire when service unsubcribed 
		    onUnsubscribe:function(service, message, realtime){
			    //webRTC.byAll();
			    stage.ui.info( "UNSUBSCRIBE service : " + service);
			    //try re subscribe
			    //realtime.subscribe("OPENSIP");
		    }
		});
	service.start();
});


*/


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
			webRTC.register(userName, "1234");
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

		//var server = "/realtime"
		var server = "/secure/realtime";
		var service = new stage.realtime(server ,{
		    // fire when 401 http code
		    onUnauthorized:function(authenticate, realtime){
			App.notify.logger(" REAL TIME  WEBRTC Unauthorized")
		    },
		    // fire when authetification success or not authenticate
		    onAuthorized:function(authenticate, realtime){
			    App.notify.logger("WELCOME TO REAL TIME  WEBRTC ")
		    },
		    // fire when error
		    onError:function(code, realtime ,message){
			    //console.log(arguments)
			    //stage.ui.log(message);
			    switch (code){
				    case 500:
					    //try to subcribe
					    //realtime.subscribe("OPENSIP");
					    break;
				    case 403:
					    break;
			    }
		    },

		    // fire when socket connection ready 
		    onHandshake:function(message, socket, realtime){
			    App.notify.logger("HANSHAKE OK");
		    },
		    // fire when service is ready
		    onConnect:function(message, realtime){
			    App.notify.logger("CONNECT ON : "+realtime.publicAddress);
			    if (message.data.OPENSIP){
				    realtime.subscribe("OPENSIP");
			    }
		    },
		    onDisconnect:function(){
			    //webRTC.byAll();
			    App.notify.logger("Disconnect realtime service");
		    },
		    // fire when socket close
		    onClose:function(){
			    App.notify.logger( "onCLose");
			    if(webRTC){

			    }
		    },
		    // fire when service subcribed 
		    onSubscribe:function(service, message, realtime){
			    App.notify.logger( "SUBSCRIBE service : " + service);

			    if ( service  === "OPENSIP"){
				    //console.log(realtime);
				    var domain = realtime.services["OPENSIP"].domain ;
				    var port = realtime.services["OPENSIP"].port ;
				    var url = "sip://"+domain+":"+port ;
				    delete webRTC ;
				    webRTC = new stage.webRtc(realtime.services["OPENSIP"].domain, realtime, {
					   protocol:"SIP",
					   sipPort:realtime.services["OPENSIP"].port,
					   sipTransport:realtime.services["OPENSIP"].type,
					   onRegister:function(user, webrtc){
						   //console.log(webrtc)
						   App.notify.logger("register User "+user.name);
						   user.mediaStream.getUserMedia({
								audio:true,
								video:true
							},
							function(mediaStream){
							   	//console.log(mediaStream)
							   	//var vid = buildVideo("myVideo_"+user.name, "video", $("#myDiv"));
							   	var vid = mv.AddUserMedia("video", user.name, mediaStream, webrtc);
							   	mediaStream.attachMediaStream(vid);

								var track2 = mix.createTrack(mediaStream,{
									filter		: false,
									panner		: false,
									analyser	: true,
									onReady		:function(media){
									    // not patch on audio output my microphone 
									    //media.play();
									    intervalSpectrumIdUser = setInterval(function(){
										    drawSpectrum($('#canvas').get(0) ,media.analyser);
									    }, 30);
									}	
								});

						   });
					   },

					   onQuit:function(webrtc){
						mv.removeUserMedia()
						delete mv ;
						clearInterval( intervalSpectrumIdUser );
						mv = new mediaView({
							containerUserSpace:$("#myDiv"),
							containerRemoteSpace:$("#remoteDiv")
						});

					   },
					   onRemoteStream:function(event, remoteStream, transaction){
						   //console.log("PASS attachMediaStream ")
						   //var vid = buildVideo("remoteVideo_"+transaction.to.name, "video", $("#remoteDiv"));
						   //$("#remoteDiv").append(vid)
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
					   onOffer:function(message, user, transac){
						   /*stage.ui.Confirm("APPEL ENTRANT","call from :"+message.fromName,function(cancel, accept){
							   if (cancel){
								   //TODO DECLINED
								   message.transaction.createResponse(603, "Declined");
								   message.transaction.sendResponse();
							   }
							   if (accept){
								   transac.setRemoteDescription("offer", user, message.rawBody, message.dialog);
							   }
						   })*/
							console.log(message)
							var res = confirm("APPEL ENTRANT call from : "+message.fromName ) ; 
							if (res) {
								transac.setRemoteDescription("offer", user, message.rawBody, message.dialog);
							}else{
								message.dialog.invite({
									code:603,
									message:"Declined"	
								})
							}

					   },	
					   onRinging:function(user){
						   App.notify.logger(user+" Sonne !!!");
					   },
					   onOffHook:function(user){
						   App.notify.logger(user+" a decroché !!!");	
					   },
					   onOnHook:function(user){
						   App.notify.logger(user+" a racroché !!!");	
						   mv.removeRemoteMedia(user);
					   },
					   onDecline:function(user, code, message){
						   App.notify.logger(user+" a refusé");
					   },
					   onError:function(method, code, message){
						   switch (method){
							   case "INVITE" :
								   switch (code){
									   case 404 :
										   App.notify.logger(message.toName+" n'est pas en ligne" )
											   break;
									   case 408 :
										   App.notify.logger(message.toName+" ne repond pas" )
											   break;
									   default:
										   App.notify.logger(message.toName+": "+ message.statusLine.message)
									   		   break;
								   }
								   break;
							   default:
								   console.log(arguments);	
						   }
					   }
				    });
			    }	
		    },
		    // fire when service unsubcribed 
		    onUnsubscribe:function(service, message, realtime){
			    //webRTC.byAll();
			    App.notify.logger( "UNSUBSCRIBE service : " + service);
			    //try re subscribe
			    //realtime.subscribe("OPENSIP");
		    }
		});
		service.start();
	

			
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
	//this.syslog = new stage.syslog(settingsSyslog);
};

mediaView.prototype.logger = function(){
	//return this.syslog.apply(this.syslog, arguments);
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

mediaView.prototype.AddUserMedia = function(type, name, mediaStream, webrtc){
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
	
	this.buildControls(name, null, this.videoSpace, null, mediaStream, webrtc);
	
	if (this.settings.chat){
		//this.addUserChat(name)	
	}
	return this.mediaElement
};

mediaView.prototype.removeUserMedia = function(){
	$(this.videoSpace).remove()
	this.removeAllMedias();
}

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
};

mediaView.prototype.removeAllMedias = function(){
	for (var user in this.users){
		this.removeRemoteMedia(user);
	}
}

mediaView.prototype.removeRemoteMedia = function(user){
	if (user in this.users){
		this.users[user].container.remove();
		delete this.users[user];
	}
};


mediaView.prototype.createPannelRemote = function(type, user, transaction, remoteStream){

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
				var media = this.createPannelRemote( "audio", transaction.to.name, transaction, remoteStream)
				
			}
			break;
		default:
			var media = this.createPannelRemote("video", transaction.to.name, transaction, remoteStream)
			break;
	};

	if (this.settings.chat){
		//this.addUserChat(transaction.to.name)	
	}
	return media.get(0);

};

mediaView.prototype.buildControls = function(name, transaction, container, media , mediaStream, webrtc ){

	var vidControls = $(document.createElement('span')).addClass('video-controls');
	container.append(vidControls);
	if ( transaction ){ 
		vidControls.css({bottom: "90px"});
	}
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
		if ( webrtc ){
			webrtc.quit();	
		}
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




