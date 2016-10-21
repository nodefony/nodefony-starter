
stage.register.call(callContact, 'viewsDefault', function(){

	var viewsDefault = function(container, contentContainer){

		this.container = container;
		this.contentContainer = contentContainer;
	};

	viewsDefault.prototype.registerPage = function(config, callback){

		this.contentContainer.append('<div class="dial-table">\
			<div id="registrationBlock" class="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3">\
				<h1 class="block text-info text-center m-t-lg">IDENTIFICATION</h1>\
				<h4 class="wrapper strong text-info text-center">\
					Veuillez inserez vos paramêtres de connection \
					<a href="#" class="pull-right text-primary text-xl"><i class="glyphicon glyphicon-question-sign"></i></a>\
				</h4> \
				<div class="account-wall m-t-xxl">\
		            <div id="dialRegistration" class="form-horizontal">\
		        		<div class="form-group has-info m-t-lg">\
							<label class="control-label col-sm-4" for="login">Login</label>\
							<div class="col-sm-8">\
							  <input type="text" id="login" name="login" value="' + config.userConfig.publicIdentity + '" class="form-control no-b" placeholder="" />\
							</div>\
						</div>\
		        		<div class="form-group has-info m-t-lg">\
							<label class="control-label col-sm-4" for="password">Mot de passe</label>\
						    <div class="col-sm-8">\
						      <input type="text" id="password" name="password" value="" class="form-control no-b" placeholder="" />\
						    </div>\
						</div>\
		        		<div class="row m-t-xxl">\
		        			<div class="col-md-offset-3 col-md-6">\
		        				<button id="valid" class="btn btn-xl btn-info btn-block"> validation </button>\
		        			</div>\
		        		</div>\
		            </div>\
				</div>\
			</div>\
		</div>');

		$("#login, #password").keyup(function(e){
			var code = (e.keyCode ? e.keyCode : e.which);
		    if (code==13) {
		    	$("#valid").click();
		    }
		});

		$("#valid").click(function(event){
			event.preventDefault();
			callback($('#login').val(), $('#password').val());
		});

	};

	viewsDefault.prototype.mediaPage = function(api){

		/*if(urlSubscriber){
			var searchInvite = $('<select/>', {type: "text", class: "form-control", id: "remoteUserToCall", "placeholder": "Identifiant"}).append(
				$('<option/>', {value: "", text: "Choisir un invité"})
			);
		} else {*/
			var searchInvite = '<input type="text" class="form-control input" id="remoteUserToCall" placeholder="Identifiant" />';
		//}

		this.contentContainer
		.append(
			'<div class="dial-table">\
				<div class="container-fluid">\
					'+ api.settings.userConfig.publicIdentity + ' : ' + api.settings.userConfig.displayName+'\
				</div>\
				<div class="row">\
					<div class="col-md-12">\
						<div id="alertKeyboard" class="alert alert-info">\
						</div>\
					</div>\
				</div>\
				<div class="masterAudioMix"></div>\
				<div class="localUser"></div>\
				<div class="keyboard text-center">\
					<div class="container-fluid">\
						<div class="row-fluid m-t-lg text-center">\
							<div class="col-xs-6">\
								' + searchInvite + '\
							</div>\
							<div class="col-xs-3">\
								<button class="btn btn-sm btn-info btn-clear" type="button"><i class="fa fa-eraser fa-2x"></i>\</button>\
							</div>\
							<div class="col-xs-3">\
								<button class="btn btn-sm btn-info btn-clear" type="button" data-toggle="collapse" href="#collapseKeyboard" aria-expanded="false" aria-controls="collapseKeyboard">\
									<i class="fa fa-keyboard-o fa-2x"></i>\
								</button>\
							</div>\
						</div>\
					</div>\
					<div class="collapse in" id="collapseKeyboard">\
						<div id="keyboard">\
	            			<div class="row keyboard-line">\
	                		<div class="col-md-4 col-sm-4 col-xs-4 touch">\
	                    		<span value="1" >1</span>\
	                		</div>\
	                		<div class="col-md-4 col-sm-4 col-xs-4 touch">\
	                    		<span value="2">2</span>\
	                		</div>\
	                		<div class="col-md-4 col-sm-4 col-xs-4 touch">\
	                    		<span value="3">3</span>\
	                		</div>\
	            			</div>\
	            			<div class="row keyboard-line">\
	                		<div class="col-md-4 col-sm-4 col-xs-4 touch">\
	                    		<span value="4">4</span>\
	                		</div>\
	                		<div class="col-md-4 col-sm-4 col-xs-4 touch">\
	                    		<span value="5">5</span>\
	                		</div>\
	                		<div class="col-md-4 col-sm-4 col-xs-4 touch">\
	                    		<span value="6">6</span>\
	                		</div>\
	            			</div>\
	            			<div class="row keyboard-line">\
	                		<div class="col-md-4 col-sm-4 col-xs-4 touch">\
	                    		<span value="7">7</span>\
	                		</div>\
	                		<div class="col-md-4 col-sm-4 col-xs-4 touch">\
	                    		<span value="8">8</span>\
	                		</div>\
	                		<div class="col-md-4 col-sm-4 col-xs-4 touch">\
	                    		<span value="9">9</span>\
	                		</div>\
	            			</div>\
	            			<div class="row keyboard-line">\
	                		<div class="col-md-4 col-sm-4 col-xs-4 touch">\
	                    		<span value="*">*</span>\
	                		</div>\
	                		<div class="col-md-4 col-sm-4 col-xs-4 touch">\
	                    		<span value="0">0</span>\
	                		</div>\
	                		<div class="col-md-4 col-sm-4 col-xs-4 touch">\
	                    		<span value="#">#</span>\
	                		</div>\
	            			</div>\
	            			<div class="row keyboard-line">\
	                		<div class="col-md-4 col-sm-4 col-xs-4 "></div>\
	                		<div class="col-md-4 col-sm-4 col-xs-4 touch">\
	                    		<span class="key-green" value="offHook" title="Appeler" ><i class="fa fa-phone" aria-hidden="true" value="offHook" ></i></span>\
	                    		<span class="key-red" value="onHook" title="Annuler" ><i class="fa fa-phone" aria-hidden="true" value="onHook" ></i></span>\
	                		</div>\
	                		<div class="col-md-4 col-sm-4 col-xs-4 touch">\
	                		</div>\
	            			</div>\
	        			</div>\
        			</div>\
				</div>\
				<div class="userSeparator"></div>\
				<div class="remoteUsers"></div>\
			</div>'
		);


		//view masterAudioMix
		App.masterAudioMix = new callContact.masterAudioMix();
		App.masterAudioMix.build($('.masterAudioMix'));

		// view TRansaction
		//App.viewTransac = new viewTransac();




		// KEYBOARD
		App.keyboard = new callContact.keyboard(App, {

			onKeyPress:function(code, key , event){
				switch(key){
					case "offHook" :
						var user = $('#remoteUserToCall').val() ;
						if ( ! user ) {
							this.logger("Entrer un contact !! ", "INFO" ) ;
							return ;
						}
						//App.viewTransac = new viewTransac();
						api.fire("onInvite", user );
						this.onHook.hide();
						this.offHook.hide();
						this.logger("Appel  : " + user, "INFO", false );
					break;
					case "onHook":
						//console.log( this.dialog.status )
						if ( this.transaction.dialog && this.transaction.dialog.status === this.transaction.dialog.statusCode.ESTABLISHED ){
							this.transaction.bye();
						}else{
							if ( this.transaction ){
								this.transaction.cancel();
								this.reset(true);
								/*** WEBAUDIO ***/
								App.mixer.ringing.stop();
								App.mixer.ring.stop();
								App.mixer.ringing.playBusy(3000);
								return ;
							}
						}
						this.textZone.val("");
						this.onHook.hide();
						this.offHook.show();
					break;
					default:
						api.fire("onKeyPress", code, key , event);
						/*** WEBAUDIO ***/
						if (this.transaction ){
							if ( this.transaction.dialog && this.transaction.dialog.status === this.transaction.dialog.statusCode.ESTABLISHED ){
								App.mixer.dtmf.play(key, 500);
							}
						}
				}
			}
		});
		// MANAGE EVENTS WEBRTC
		App.keyboard.plug( $(".keyboard") );

		api.webrtc.listen(App, "onOnHook" , function(transaction){
			// raccrocher
			//console.log(name)
			this.views.clearRemoteUser();

			this.keyboard.reset(true);
			this.keyboard.logger(transaction.to.displayName + " a racroché", "INFO");
			this.keyboard.transaction = null;
		});

		api.webrtc.listen(App, "onOffHook" , function(transaction){
			// in line
			this.keyboard.onHook.show();
			this.keyboard.offHook.hide();
			this.keyboard.logger("En ligne avec  : " + transaction.to.displayName, "INFO");

			/*** WEBAUDIO ***/
			this.mixer.ringing.stop();
			this.mixer.ring.stop();
		});

		api.webrtc.listen(App, "onRinging" , function(user , transation){
			this.keyboard.logger( user + " Sonne !!", "INFO", false );

			/*** WEBAUDIO ***/
			this.mixer.ringing.play(25000);
		});

		api.webrtc.listen(App, "onError" , function(user){
			this.keyboard.reset(true);
			this.keyboard.transaction = null ;
		});

		api.webrtc.listen(App, "onOffer" , function(webrtc, transac){
			//console.log("onOffer WEBRTC");
			//console.log(arguments);
			this.logWebrtc( transac, "DEBUG");

			/*** KEYBOARD ***/
			this.keyboard.textZone.val(transac.to.name);
			this.keyboard.onHook.hide();
			this.keyboard.offHook.hide();
			this.keyboard.logger("Appel de : " + transac.to.displayName , "INFO");
			this.keyboard.transaction = transac ;

			/*** WEBAUDIO ***/
			this.mixer.ring.play(25000);
		});

		api.webrtc.listen(App, "onCancel" , function(user){

			if(this.confirm) {
				this.confirm.cancel();
				this.confirm = null;
			}
			/*** KEYBOARD ***/
			this.keyboard.reset(true);

			/*** WEBAUDIO ***/
			this.mixer.ringing.stop();
			this.mixer.ring.stop();
			this.mixer.ringing.playBusy(3000);
		});

		api.webrtc.listen(App, "onDtmf", function(tone){
			this.keyboard.blinkTouch(tone);
			App.mixer.dtmf.play(tone.key, tone.duration);
		});

		api.webrtc.listen(App, "onInvite", function(transaction, to, description){
			console.log('onInvite WEBRTC');
			//console.log(arguments);
			//this.webrtc.createOffer(user);

			/*** KEYBOARD ***/
			this.keyboard.onHook.show();
			this.keyboard.offHook.hide();
			this.keyboard.transaction = transaction ;

		});

		api.webrtc.listen(App, "onDecline", function(webrtc, transac){

			this.logWebrtc( "onDecline "+ transac.to.displayName,"DEBUG");
			callContact.tools.alert('INVITATION', "L'utilisateur " + transac.to.displayName + " a refusé votre invitation.", 'md', null, 'warning');

			/*** KEYBOARD ***/
			this.keyboard.reset(true);
			this.keyboard.logger(transac.to.displayName + " a decliné l invitation ", "INFO");

			/*** WEBAUDIO ***/
			this.mixer.ringing.stop();
			this.mixer.ringing.playBusy(3000);
		});

		api.webrtc.listen(App, "onDeclineOffer", function(webrtc, transac){
			this.keyboard.reset(true);
			//this.logger(transac.to.displayName + " a decliné l invitation ", "INFO");
			/*** WEBAUDIO ***/
			this.mixer.ring.stop();
		});

		api.webrtc.listen(App, "onAccept", function(webrtc, transac){
			/*** WEBAUDIO ***/
			this.mixer.ring.stop();
		});

		api.webrtc.listen(App, "onMediaSucces" ,function(mediaStream, user){


			// CREATE NEW STREAM with audio track buid by webaudio API for mixing
			// MIXER track test music
	        var tr = this.mixer.aux1.createTrack( '/webAudioApiBundle/music/Chico_Buarque.mp3', {
	            name:'Chico Buarque',
	            panner: false,
	        });
	        tr.listen(this, "onReady", function(track){
	                track.play(0, true)
	        });
			// MIXER add video
	        /*var tr = this.mixer.aux1.createTrack( '/webAudioApiBundle/music/oceans-clip.webm', {
	            name:'myVideo',
	            panner: false,
	        });
	        tr.listen(this, "onReady", function(track){
	                track.play(0, true)
	        });
			console.log(tr)*/

			//MIXER track userMedia in webaudio mixer
			var track = this.mixer.aux1.createTrack( mediaStream ,{
				name: user.displayName,
				panner: false,
			}) ;
			track.play();

			// TRANSFORM AUDIONODE in mediaStream
			//var dest =  App.mixer.mediaMix.masterBus.createMediaStreamDestination();
			var dest =  App.mixer.aux1.createMediaStreamDestination();

			// add video track to new stream
			var videoTrack = mediaStream.getVideoTracks() ;
			if ( videoTrack ){
				dest.stream.addTrack( videoTrack[0] ) ;
			}

			//plug mixer  to webrtc
			mediaStream.setStream(dest.stream);
			user.stream = dest.stream ;
		});

		// MANAGE EVENTS API
		api.listen(App.keyboard, "onErrorView" , function(method, code, message, api){
			switch(method){
				case 'INVITE' :
					switch(code){
						case 404 :
						case 408 :
							this.reset();
						default:
							this.reset();
					}
					break;
				default:
			}
			switch(code){
				default:
					if ( code > 400 ){
						this.logger(message, "ERROR");
					}
					if ( code > 200){
						this.logger(message, "SUCCEES");
					}
					if ( code > 100){
						this.logger(message, "INFO");
					}
			}
		});

		$('.btn-clear').click(function(){
			App.keyboard.clear();
		}.bind(this));

		/*if(urlSubscriber){
			$.ajax({
				url: urlSubscriber,
				success: function(data){
					//console.log(api);
					$.each(data.data, function(index, value){
						if(api.settings.SIPProxyUrl == value.domain){ // METTRE EN PLACE LA COMPARAISON DU CURRENT USER
							$('#remoteUserToCall').append($('<option/>', {value: value.username, text: value.username}));
						}
					});
				}
			});
		}*/
	};


	return viewsDefault;
});
