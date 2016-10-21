

var App = new stage.appKernel(null, callContact.env, {
	debug: callContact.debug,
	location:{
		html5Mode:false
	},
	onLoad:function(kernel){

	},

	onReady:function(kernel){

		/*console.log('onReady');
		console.log(kernel);
		console.log(stage);
		this.notify = new stage.notify(kernel);
		console.log(this.notify);*/

	},

	onBoot:function(kernel){

		//console.log('onBoot');
		//console.log(kernel);
		//console.log(stage);

		//console.log(this.notify);

		kernel.info = function(message, severity){
			this.logger(message, severity || "INFO" , "NOTIFY");
		}.bind(kernel);


		//if ( this.environment == "dev" ){
			var settingsSyslog = {
				//rateLimit:100,
				//burstLimit:10,
				moduleName:"CALLCONTACT",
				defaultSeverity:"INFO"
			};

			this.initApiLog(settingsSyslog);
			this.console = new callContact.console(this);
		//}


	},

	onUnLoad:function(){
		console.log("onUnLoad")	;
		if ( this.api ){
			this.api.close() ;
		}
	},

	onDomLoad:function(kernel){

		$('.reloadPage').click(function(){location.reload();});

		this.views = new callContact.views();

		this.console.init(function(state){
			//console.log('state : ' + state + ' : ' + $('#consoleAction').bootstrapSwitch('state'));
			//$('#consoleAction').bootstrapSwitch('state', state);
			if(state != $('#consoleAction').bootstrapSwitch('state')) {
				$('#consoleAction').bootstrapSwitch('toggleState');
			}

			/*console.log('console init');
			this.console[$('#consoleAction').get(0).checked ? 'consoleOpen' : 'consoleClose']();*/

		}.bind(this));



		this.views.setDisconnected($('.connectIcon'));

		this.views.waitingPage('En attente de connection');

		$.ajax({
			// FIXME
			url: urlConf,
			success: function(data){
				//console.log(data)
				switch(data.api ){
					case "TFM" :
						this.api = new stage.TFM(kernel, data);
					break;
					case "CCAPI":
						this.api = new stage.CCAPI(kernel, data);
					break;
					case "NODEFONY":
						this.api = new stage.NODEFONY(kernel, data);
					break;
					default:
						this.info("API NOT IMPLEMENTED !!!!");

				}

				this.views.setApiName(data.api, this.api);

				//this.webRTCActionControl = new callContact.webRTCActionControl(this.api);

				this.api.listen(this, "onConnect" , function(transport, api){
					//console.log("onConnect");
					//console.log(data);
					this.logApi('connect:' + api.name);
					this.views.setConnected($('.connectIcon'), urlWebsocket);
					this.views.registerPage(data, function(login, password){
						//console.log(arguments);
						api.register(login, password );
					}.bind(this));
					this.mixer = new callContact.audioMix(this.api.settings);
				}.bind(this));

				this.api.listen(this, "onDisconnect" , function(transport, api){
					this.views.setDisconnected($('.connectIcon'));
					//this.api.unRegister() ;
				}.bind(this));

				this.api.listen(this, "onClose" , function(transport, api){
					console.log("onClose");
					//this.views.setDisconnected($('.connectIcon'));
					window.location.reload();
				}.bind(this));


				this.api.listen(this, "onRegister" , function(user, webrtc){
					this.logWebrtc("REGISTER :" + user.name);
					this.user = user;
					this.webrtc = webrtc;
				}.bind(this));


				this.api.listen(this, "onUnRegister", function(message, webrtc){
					console.log("onUnRegister")
					//window.location.reload();
					this.views.registerPage(data, function(login, password){
						//console.log(arguments);
						this.api.register(login, password);
					}.bind(this));
				}.bind(this));


				this.api.listen(this, "onMedia" , function(stream, api){
					//console.log("onMedia");
					this.views.mediaPage(api);

					//var state = stream.videotracks.length ? 'video' : 'audio' ;
					this.logWebrtc( stream,"DEBUG");

					var media = callContact.getMediaView(stream, {container: this.views.getLocalUserContainer()});
					var localPlayer = media.createPlayer('LocalUser', this.user, stream, this.api);

					//if(localPlayer) this.views.appendMediaTolocalUser(localPlayer);

				}.bind(this));


				this.api.listen(this, "onRemote" , function( event, remoteStream, transaction, webrtc){


					switch(transaction.RTCPeerConnection.remoteDescription.type){

						case "offer" :

							this.confirm = callContact.tools.confirm(
								'Demande de connection',
								"l'utilisateur " + transaction.to.displayName || 'NULL' + "désire que vous vous joignez à sa conférence.<br/>Acceptez-vous ?",
								function(){

									//var state = remoteStream.videotracks.length ? 'video' : 'audio' ;
									this.logWebrtc( transaction,"DEBUG");

									//var media = new ( callContact.getMediaView(state) )();
									//var localPlayer = media.createPlayer('RemoteUser', transaction.to, remoteStream, this.api);

									var media = callContact.getMediaView(remoteStream, {container: this.views.getRemoteUserContainer()});
									var remotePlayer = media.createPlayer('RemoteUser', transaction.to, remoteStream, this.api, transaction);
									//this.views.appendMediaToRemoteUsers(localPlayer);

									this.api.webrtc.fire("onAccept", webrtc, transaction );
								}.bind(this),
								function(){
									this.api.webrtc.fire("onDeclineOffer",  webrtc, transaction  )
								}.bind(this),
								'md',
								'info'
							);

							break;

						case "answer" :
							var media = callContact.getMediaView(remoteStream, {container: this.views.getRemoteUserContainer()});
							var localPlayer = media.createPlayer('RemoteUser', transaction.to, remoteStream, this.api, transaction);
							break;
					}


				}.bind(this));

				// EVENT DE LA VUE
				this.api.listen(this, "onInvite" , function(user){
					this.webrtc.createOffer(user);

				}.bind(this));

				// GESTION DE ERREURS
				this.api.listen(this, "onError" , function(Class,  error){

					switch (true){
						case ( Class instanceof  stage.webRtc ) :
							kernel.logger( error.message, 'CRITIC' );
							callContact.tools.alert('ERREUR',error.message , 'md', null, 'error');
						break ;
						case ( Class instanceof  stage.io.protocols.sip ) :

							switch(error.method){
								case 'REGISTER' :
									switch(error.code){
										case 401 :
											callContact.tools.alert('IDENTIFICATION', "Problème d'identification, veuillez recommencer.", 'md', null, 'warning');
											break;
										case 404 :
											callContact.tools.alert('IDENTIFICATION', "Problème d'identification, Utilisateur : "+error.toName +" " +error.statusLine.message , 'md', null, 'warning');
											break;
										default:
											kernel.logger(error.toName+": "+ error.statusLine.message,'CRITIC' );
											//kernel.logger(JSON.stringify(message), 'CRITIC');
									}
								break;
								case 'INVITE' :
									switch(error.code){
										case 404 :
										case 408 :
											var content = (error.code == 404 ? "L'utilisateur " + error.toName + " n'est pas en ligne." : "L'utilisateur " + error.toName + " ne repond pas.");
											this.api.fire("onErrorView", error.method, error.code, content, this);
											callContact.tools.alert('INVITATION', "Problème d'invitation : <br/>" + content, 'md', null, 'warning');
											break;
										default:
											//console.log(message)
											this.api.fire("onErrorView", error.method, error.code, "Erreur server : "+error.code, this);
											kernel.logger(error.toName+": "+ error.statusLine.message, 'CRITIC' );
											//kernel.logger(JSON.stringify(message), 'CRITIC');
									}
								break;
								default:
									if( error instanceof Error )
										callContact.tools.alert('SIP ERROR',  error.message , 'md', null, 'error');
									if ( error.method && error.statusLine )
										callContact.tools.alert('SIP ERROR', error.method + " : " + error.statusLine.message , 'md', null, 'error');
							}

						break ;
						case ( Class instanceof stage.Transaction ) :
							kernel.logger( error.message, 'CRITIC' );
							callContact.tools.alert('ERREUR', error.message , 'md', null, 'error');
						break ;
						case ( Class instanceof  Error ) :
							kernel.logger( error.message, 'CRITIC' );
							callContact.tools.alert('ERREUR', error.message , 'md', null, 'error');
						break ;
						case ( typeof Class === "string" ) :
							kernel.logger( Class, 'CRITIC' );
						break;
						default :
							console.log(arguments) ;
					}
				});

				this.api.listen(this, "onMessage" , function(message){
					this.logSip({
						event:"onMessage",
						message:message
					}, "DEBUG");
				});

				this.api.listen(this, "onSend" , function(message){
					this.logSip({
						event:"onSend",
						message:message
					}, "DEBUG");
				});

				this.api.listen(this, "onKeyPress", function(code, key, event){
					this.api.webrtc.fire("onKeyPress", code, key, event ) ;
				});


			}.bind(this)
		});

	}
});
