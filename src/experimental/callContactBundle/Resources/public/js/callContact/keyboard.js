	stage.register.call(callContact, 'keyboard', function(){



	var defaultSettings = {
		//type : "SIPINFO"	// RTPEVENT
		bindNativeKeyboard:true
	};


	var keyboard = function( kernel, settings){

		this.settings = stage.extend({}, defaultSettings, settings)
		this.kernel = kernel ;
		this.notificationCenter = stage.notificationsCenter.create(this.settings, this);

		//this.notificationCenter.listen(this, "onKeyPress") ;//, function(code, key, event){console.log(code)})
		if ( this.settings.bindNativeKeyboard ){
			this.bindNative();
		}
		this.textZone = null;

		this.listen(this, "onKeyPress", function(code , selecKey , event){
			this.blinkTouch( {
				Signal:selecKey,
				Duration:500
			});
		})
	}

	keyboard.prototype.listen = function(){
		return this.notificationCenter.listen.apply(this.notificationCenter, arguments);
	};

	keyboard.prototype.fire = function(){
		return this.notificationCenter.fire.apply(this.notificationCenter, arguments);
	};

	var key = {
		"0":48,
		"1":49,
		"2":50,
		"3":51,
		"4":52,
		"5":53,
		"6":54,
		"7":55,
		"8":56,
		"9":57,
		"*":42,
		"#":35
	}

	keyboard.prototype.plug = function(container){
		var touch = $(".touch") ;
		this.textZone = $(".input") ;
		//var eleTextzone = this.textZone.get(0);

		touch.click(function(event){
			var selecKey = $(event.target).attr("value") ;
			var value =  this.textZone.val();
			if ( selecKey in key ){
				this.textZone.val(value+selecKey);
			}
			if ( selecKey in key){
				this.fire("onKeyPress", key[selecKey] , selecKey , event )
			}else{
				this.fire("onKeyPress", selecKey , selecKey , event )
			}

		}.bind(this))

		this.onHook = $(".touch span[value='onHook']").hide() ;
		this.offHook = $(".touch span[value='offHook']");

		this.fire("onPlug", touch ) ;
		this.alertEle = $("#alertKeyboard").hide();

	}


	keyboard.prototype.bindNative = function(){
		$( document ).keypress(function(event){
			switch(event.which){
				case 35:
				case 42:
				case 48:
				case 49:
				case 50:
				case 51:
				case 52:
				case 53:
				case 54:
				case 55:
				case 56:
				case 57:
					this.fire("onKeyPress", event.which, event.key , event ) ;
				break;
				default:
					console.log("DROP NATIVE KEY")
			}
		}.bind(this))
	}

	keyboard.prototype.clear = function(){
		this.textZone.val("");
	}

	keyboard.prototype.logger = function(data, severity, hideAfter){

		if ( ! data ) return ;
		switch(severity){
			case "INFO":
			break;
			case "ERROR":
			break;
			case "WARNING":
			break;
			case "SUCCEES":
			break;
			default:
		}
		if ( hideAfter === undefined ) hideAfter = true ;
		this.alertEle.html(data).fadeIn();
		if ( hideAfter ){
			setTimeout(function(){
				this.alertEle.fadeOut(1000)
			}.bind(this), 6000)
		}
	}


	keyboard.prototype.reset = function(textZone, fade){
		if ( textZone )
			this.clear();
		this.onHook.hide();
		this.offHook.show();
		if ( fade ){
			this.alertEle.fadeOut(5000);
		}else{
			this.alertEle.hide();
		}
	}

	keyboard.prototype.blinkTouch = function(tone){
		var selector = ".touch span[value='"+tone.Signal+"']"
		$(selector).css("background-color", "#efefef");
		var int = parseInt( tone.Duration, 10 ) ;
		setTimeout(function(){
			$(selector).css("background-color", "#fff");
		}, int)

	}

	keyboard.prototype.open = function(){

	}

	keyboard.prototype.close = function(){

	}


	return keyboard ;

});
