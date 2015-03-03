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

$( document ).ready(function(){
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

	var server = "/realtime"
		var service = new stage.realtime(server ,{
			// fire when 401 http code
			onUnauthorized:function(authenticate, realtime){
				authenticate.register("admin", "admin");
			},
		    // fire when authetification success or not authenticate
		    onAuthorized:function(authenticate, realtime){
			    //stage.ui.log("WELCOME TO REAL TIME stage WEBRTC ")
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
			    //stage.ui.info("HANSHAKE OK");
		    },
		    // fire when service is ready
		    onConnect:function(message, realtime){
			    //stage.ui.log("CONNECT ON : "+realtime.publicAddress);
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
			    //stage.ui.info( "SUBSCRIBE service : " + service);

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
						   stage.ui.log(user+" a refusé");
					   },
					   onError:function(method, code, message){
						   switch (method){
							   case "INVITE" :
								   switch (code){
									   case 404 :
										   stage.ui.log(message.toName+" n'est pas en ligne" )
											   break;
									   case 408 :
										   stage.ui.log(message.toName+" ne repond pas" )
											   break;
									   default:
										   stage.ui.log(message.toName+": "+ message.statusLine.message)
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

