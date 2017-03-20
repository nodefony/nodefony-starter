const events = require('events');


nodefony.register("notificationsCenter",function(){

	var regListenOn = /^on(.*)$/;
	var defaultNbListeners = 20 ;
	
	var Notification = class Notification {

		constructor(settings, context, nbListener) {
			this.event = new events.EventEmitter();	
			this.setMaxListeners(nbListener || defaultNbListeners);
			if (settings) {
				this.settingsToListen(settings, context);
			}
		}

		/**
	 	*
	 	*	@method setMaxListeners 
	 	*
	 	*/
		setMaxListeners (){
			return this.event.setMaxListeners.apply(this.event, arguments);	
		}

		/**
	 	*
	 	*	@method listen 
	 	*
	 	*/
		listen (context, eventName, callback) {
			var event = arguments[1];
			var ContextClosure = this;
			if ( callback instanceof Function ){
				this.event.addListener(eventName, callback.bind(context));
			}
			return function() {
				Array.prototype.unshift.call(arguments, event);
				return ContextClosure.fire.apply(ContextClosure, arguments);
			};
		}

		on (eventName, callback) {
			var event = arguments[1];
			var ContextClosure = this;
			if ( callback instanceof Function ){
				this.event.addListener(eventName, callback);
				return function() {
					Array.prototype.unshift.call(arguments, event);
					return ContextClosure.fire.apply(ContextClosure, arguments);
				};
			}
			throw new Error("notificationsCenter  callback must be a function"); 
		}

		/**
	 	*
	 	*	@method once 
	 	*
	 	*/ 
		once (context, eventName, callback){
			var event = arguments[1];
			var ContextClosure = this;
			if ( callback instanceof Function ){
				this.event.once(eventName, callback.bind(context));
			}
			return function() {
				Array.prototype.unshift.call(arguments, event);
				return ContextClosure.fire.apply(ContextClosure, arguments);
			};
			//return this.event.once.apply(this.event, arguments);	
		}

		/**
	 	*
	 	*	@method fire 
	 	*
	 	*/
		fire () {
			var ret = false;
			try {
				return this.event.emit.apply(this.event, arguments);
			} catch (e) {
				if(e.stack){
					console.error(e.message);
					console.error(e.stack);
					throw e ;
				}else{
					console.error(e);
					throw e ;
				}
			}
			return ret;
		}

		
		/**
	 	*
	 	*	@method settingsToListen 
	 	*
	 	*/
		settingsToListen (localSettings, context) {
			for (var i in localSettings) {
				var res = regListenOn.exec(i);
				if (!res){
					continue;
				}
				this.listen(context || this, res[0], localSettings[i]);
			}
		}

		/**
	 	*
	 	*	@method unListen 
	 	*
	 	*/
		unListen (){
			return this.event.removeListener.apply(this.event, arguments);	
		}

		/**
	 	*
	 	*	@method removeAllListeners 
	 	*
	 	*/ 
		removeAllListeners (){
			return this.event.removeAllListeners.apply(this.event, arguments);	
		}
	};
	return {
		notification:Notification,
		/**
		 *
		 *	@method create 
		 *
		 */
		create: function(settings, context, nbListener) {
			return new Notification(settings, context, nbListener);
		}	
	};
});
