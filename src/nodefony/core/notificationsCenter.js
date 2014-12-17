var events = require('events');


nodefony.register("notificationsCenter",function(){

	var regListenOn = /^on(.*)$/;


	var defaultNbListeners = 20 ;
			

	var Notification = function(settings, context, nbListener){
		this.event = new events.EventEmitter();	
		this.setMaxListeners(nbListener || defaultNbListeners);
		if (settings) {
			this.settingsToListen(settings, context);
		}
	};

	Notification.prototype.setMaxListeners = function(nb){
		return this.event.setMaxListeners(nb);
	};

	/**
	 *
	 *	@method listen 
	 *
	 */
	Notification.prototype.listen = function(context, eventName, callback) {
		var event = arguments[1];
		var ContextClosure = this;
		if ( callback instanceof Function )
			this.event.addListener(eventName, callback.bind(context))	
		return function() {
			Array.prototype.unshift.call(arguments, event)
			return ContextClosure.fire.apply(ContextClosure, arguments);
		}
	};

	/**
	 *
	 *	@method fire 
	 *
	 */
	Notification.prototype.fire = function(eventName) {
		var ret = false;
		try {
			return this.event.emit.apply(this.event, arguments)
		} catch (e) {
			if(e.stack){
				console.error(e.message)
				console.error(e.stack);
			}else{
				throw new Error(e);
			}
		}
		return ret;
	};

	/**
	 *
	 *	@method once 
	 *
	 */ 
	Notification.prototype.once =function(){
		return this.event.once.apply(this.event, arguments);	
	};


	/**
	 *
	 *	@method settingsToListen 
	 *
	 */
	Notification.prototype.settingsToListen = function(localSettings, context) {
		for (var i in localSettings) {
			var res = regListenOn.exec(i);
			if (!res)
				continue;
			this.listen(context || this, res[0], localSettings[i]);
		}
	};

	/**
	 *
	 *	@method unListen 
	 *
	 */
	Notification.prototype.unListen =function(){
		return this.event.removeListener.apply(this.event, arguments);	
	};




	/**
	 *
	 *	@method removeAllListeners 
	 *
	 */ 
	Notification.prototype.removeAllListeners =function(){
		return this.event.removeAllListeners.apply(this.event, arguments);	
	};

	/**
	 *
	 *	@method listeners 
	 *
	 */ 
	Notification.prototype.removeAllListeners =function(){
		return this.event.listeners.apply(this.event, arguments);	
	};

	/**
	 *
	 *	@method setMaxListeners 
	 *
	 */
	Notification.prototype.setMaxListeners =function(){
		return this.event.setMaxListeners.apply(this.event, arguments);	
	};
	
	

	return {
	
		notification:Notification,
		/**
		 *
		 *	@method create 
		 *
		 */
		create: function(settings, context) {
			return new Notification(settings, context);
		}	
	
	};

})
