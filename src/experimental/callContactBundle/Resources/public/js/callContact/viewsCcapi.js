
stage.register.call(callContact, 'viewsCcapi', function(){
	
	
	var viewsCcapi = function(container, contentContainer){
		
		this.container = container;
		this.contentContainer = contentContainer;
		
		this.timers = {};

		this.container.addClass('dial-ccapi');
	};	

	viewsCcapi.prototype.registerPage = function(config, callback){
		//return;
		this.contentContainer.append('<div id="registrationBlock" class="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3">\
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
					<div class="form-group has-info m-t-lg">\
						<label class="control-label col-sm-4" for="tel">Téléphone</label>\
					    <div class="col-sm-8">\
					      <input type="text" id="tel" name="tel" value="" class="form-control no-b" placeholder="" />\
					    </div>\
					</div>\
	        		<div class="row m-t-xxl">\
	        			<div class="col-md-offset-3 col-md-6">\
	        				<button id="valid" class="btn btn-xl btn-info btn-block"> validation </button>\
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
	
	var getAgentHeader = function(){
		
		this.ccapiContentContainer.append(
			'<div class="dial-row-header row-fluid bg-white">\
					<div class="col-xs-12 m-t-sm">\
					<div class="dial-logo"></div>\
					<div class="dial-info" title="Afficher l’aide <br> contextuelle"></div>\
				</div>\
			</div>\
			<div class="row-fluid" style="height: 100px;">\
				<div class="avatar-container">\
					<div class="avatar-bg"></div>\
					<div class="avatar"></div>\
					<div class="avatar-info">\
						<div class="avatar-fname">CousCous</div>\
						<div class="avatar-lname">Merguez</div>\
						<div class="avatar-tel">+03306891433678</div>\
					</div>\
					<div class="avatar-camembert"></div>\
				</div>\
			</div>'
		);
		
		$('.avatar-camembert').click(function(ev){
			setViewCcapiStats.call(this, $(ev.currentTarget));	
		}.bind(this));
	};
	
	var setViewCcapiPause = function(){
		this.status = "PAUSE";
		this.ccapiContentContainer.empty();
		getAgentHeader.call(this);
		this.ccapiContentContainer.append(
			'<div class="ccapi-status-pause">\
				<div class="ccapi-pause-icon" title="Changer l’état de l’agent"></div>\
				<div class="ccapi-pause-word">PAUSE</div>\
				<div class="ccapi-timer"></div>\
			</div>'
		);
		$('.ccapi-pause-icon').click(function(){
			setViewCcapiStatus.call(this);
		}.bind(this));
		
		ccapiTimer.call(this, $('.ccapi-timer'), 'pause');	
	};
	
	var setViewCcapiDispo = function(){
		this.status = "DISPO";
		this.ccapiContentContainer.empty();
		getAgentHeader.call(this);
		this.ccapiContentContainer.append(
			'<div class="ccapi-status-dispo">\
				<div class="ccapi-dispo-icon" title="Changer l’état de l’agent"></div>\
				<div class="ccapi-dispo-word">DISPONIBLE</div>\
				<div class="ccapi-timer"></div>\
			</div>'
		);
		
		$('.ccapi-dispo-icon').click(function(){
			setViewCcapiStatus.call(this, $('.ccapi-content'));
		}.bind(this));
		
		ccapiTimer.call(this, $('.ccapi-timer'), 'dispo');	
	};
	
	var setViewCcapiOutcall = function(){
		this.status = "OUTCALL";
		this.ccapiContentContainer.empty();
		getAgentHeader.call(this);
		this.ccapiContentContainer.append(
			'<div class="ccapi-status-outcall">\
				<div class="ccapi-outcall-icon" title="Changer l’état de l’agent"></div>\
				<div class="ccapi-outcall-word">APPEL SORTANT</div>\
				<div class="ccapi-timer"></div>\
			</div>\
			<div class="dial-row-header row-fluid bg-white p-sm m-t-xxl m-b-sm" style="height: 65px;">\
				<div class="col-xs-2 text-center">\
					<div class="dropup">\
						<div class="dropdown-toggle pointer" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
							<div class="input-dialpad fa fa-keyboard-o fa-2x m-t-xs"></div>\
						</div>\
						<ul class="dropdown-menu dropdown-menu-dialpad p-5">\
				    		<li class="text-center dialpad"></li>\
				    	</ul>\
					</div>\
				</div>\
				<div class="col-xs-8">\
					<input type="text" class="form-control" id="numToCall" value="" />\
				</div>\
				<div class="col-xs-2 text-center">\
					<div class="call-rounded-button"></div>\
				</div>\
			</div>'
		);
		
		$('.ccapi-outcall-icon').click(function(){
			setViewCcapiStatus.call(this, $('.ccapi-content'));
		}.bind(this));
		
		var dialPad = new callContact.dialPad($('.dialpad'), $('#numToCall'));
		dialPad.build(function(ev){
			console.log($(ev.currentTarget).attr('rel'));
			ev.stopPropagation();
		}.bind(this));
		
		ccapiTimer.call(this, $('.ccapi-timer'), 'outcall');	
	};
	
	var time2Digits = function(value){
		return ("0" + value).slice(-2);
	};
	
	var getTime = function(start){
		var end = new Date();
		var hourDiff = end - start; //in ms
		var secDiff = hourDiff / 1000; //in s
		var minDiff = hourDiff / 60 / 1000; //in minutes
		var hDiff = hourDiff / 3600 / 1000; //in hours
		var hours = Math.floor(hDiff);
		var minutes = Math.floor(minDiff - 60 * hours);
		var seconds = Math.floor(secDiff - 3600 * hours - 60 * minutes);
		return time2Digits(hours) + ':' + time2Digits(minutes) + ':' + time2Digits(seconds);
	};
	
	var ccapiTimer = function(container, init){
		
		name = name || "intervalTimer";
		var start = (this.timers[name] ? this.timers[name].start : new Date());		
		container.html(getTime(start));
		this.timers[name] = {
			start: start,
			native: setInterval(function(){
				container.html(getTime(start));
			}, 1000)
		}
	};
	
	var removeAllCcapiTimer = function(){
		for(var key in this.timers){
			clearInterval(this.timers[key].native);
			delete this.timers[key];
		}
	};
	
	var menuHeader = function(title, backCallback){
		this.ccapiContentContainer.append(
			'<div class="dial-row-header row-fluid bg-white">\
				<div class="col-xs-12 m-t-sm">\
				<div class="dial-back"></div>\
				<div class="dial-title">' + title + '</div>\
				<div class="dial-info"></div>\
			</div>'
		);
		
		if(backCallback) $('.dial-back').click(backCallback);
	};
	
	var setViewCcapiStatus = function(){
		
		this.ccapiContentContainer.empty();
		menuHeader.call(this, "vos status", function(){
			switch(this.status){
				case "DISPO" :
					setViewCcapiDispo.call(this);
					break;
				case "PAUSE" :
					setViewCcapiDispo.call(this);
					break;
				case "OUTCALL" :
					setViewCcapiOutcall.call(this);
					break;
			}
		}.bind(this))
		this.ccapiContentContainer.append(
			'<div class="ccapi-status-actions">\
				<div class="ccapi-status-action-dispo">disponible</div>\
				<div class="ccapi-status-action-disconnect">déconnecter</div>\
				<div class="ccapi-status-action-pause">pause</div>\
			</div>'
		);
		
		$('.ccapi-status-action-dispo').click(function(){
			removeAllCcapiTimer.call(this);
			setViewCcapiDispo.call(this);
		}.bind(this));
		
		$('.ccapi-status-action-pause').click(function(){
			removeAllCcapiTimer.call(this);
			setViewCcapiPause.call(this);	
		}.bind(this));
	};
	
	var setViewCcapiQueue = function(){
		//FAIRE AJAX ICI ...
		this.ccapiContentContainer.empty();
		menuHeader.call(this, "vos files", function(){
			setViewCcapiStatus.call(this);
		}.bind(this));
		this.ccapiContentContainer.append(
			'<div class="ccapi-queue">\
				<div class="ccapi-queue-line">\
					<div class="ccapi-queue-button">FA1</div>\
				<div class="ccapi-queue-agent">0</div>\
					<div class="ccapi-queue-phone">0</div>\
				</div>\
				<div class="ccapi-queue-line">\
					<div class="ccapi-queue-button">FA2</div>\
					<div class="ccapi-queue-agent">10</div>\
					<div class="ccapi-queue-phone">1</div>\
				</div>\
			</div>'
		);
	};
	
	var setDonutStat = function(elm){
		Morris.Donut({
		    element: elm,
		    data: [
		      {label: 'Jam', value: 25 },
		      {label: 'Frosted', value: 40 },
		      {label: 'Custard', value: 25 },
		      {label: 'Sugar', value: 10 }
		    ],
		    formatter: function (y) { return y + "%" }
		  });
	};
	
	var setViewCcapiStats = function(){
		this.ccapiContentContainer.empty();
		menuHeader.call(this, "statistiques", function(){
			setViewCcapiStatus.call(this);
		}.bind(this));
		this.ccapiContentContainer.append('<div class="ccapi-stats"><div id="donut"></div></div>');
		
		setDonutStat('donut');
	};
	
	viewsCcapi.prototype.mediaPage = function(api){
		
		this.contentContainer.append(
			'<div class="dial-table">\
				<div class="ccapi-content dial-table-row"></div>\
				<div class="row dial-table-row dial-row-button">\
					<div class="col-xs-6 dial-call pointer" title="Nombre d’agents disponibles sur les files de l’agent.<br>Donne aussi accès au détail par file d’attente">0</div>\
					<div class="col-xs-6 dial-agent pointer" title="Nombre d’agents disponibles sur les files de l’agent.<br>Donne aussi accès au détail par file d’attente">0</div>\
				</div>\
				<div class="row dial-table-row dial-row-button">\
					<div class="col-xs-6 dial-mode">\
						<div class="dial-phone" title="Traitement des appels sortants"></div>\
					</div>\
					<div class="col-xs-6 dial-mode">\
						<div class="dial-sms" title="Cette fonction sera<br/>bientôt acitvée"></div>\
					</div>\
				</div>\
			</div>'
		);
		
		this.ccapiContentContainer = $('.ccapi-content');	
		
		setViewCcapiPause.call(this);
		
		$('.dial-call, .dial-agent').click(function(){
			setViewCcapiQueue.call(this);	
		}.bind(this));
		
		$('.dial-phone').click(function(){
			removeAllCcapiTimer.call(this);
			setViewCcapiOutcall.call(this);
		}.bind(this));
		
	};	
	
	return viewsCcapi;
});
