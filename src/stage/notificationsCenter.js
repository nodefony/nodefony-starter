/**
 * @module library
 * @namespace NotificationCenter
 * 
 */
stage.provide("notificationsCenter");
 
 
 
stage.register("notificationsCenter", function(){
 
  
        var regListenOn = /^on(.*)$/;
   
       /**
         *      Events  
         *
         *      @class Notification
         *      @module library
         *      @param {Object} settings Object to pass to `settingToListen` method
         *      @param {Object} context  to apply `settingToListen` 
         *
         *      @example
         *
         *      
         */
        var Notification = function(settings, context) {
                this.events = {};
                this.garbageEvent = {};
                if (settings) {
                        this.settingsToListen(settings, context);
                }
        };
 
        /**
         *
         *      @method listen 
         *
         */
        Notification.prototype.listen = function(context, eventName, callback) {
                var event = arguments[1];
                var ContextClosure = this;
                if (! this.events[eventName]) {
                        this.events[eventName] = [];
                        this.garbageEvent[eventName] = [];
                }
                if (typeof callback === 'function') {
                        this.garbageEvent[eventName].push(callback);
                        this.events[eventName].push(function(args) {
                                callback.apply(context, args);
                        });
                }
                return function() {
                        Array.prototype.unshift.call(arguments, event)
                        return ContextClosure.fire.apply(ContextClosure, arguments);
                }
        };
 
        /**
         *
         *      @method clearNotifications 
         *
         */
        Notification.prototype.clearNotifications = function(eventName) {
                if (eventName){
                        if (this.events[eventName]) {
                                while (this.events[eventName].length > 0) {
                                        this.events[eventName].pop();
                                        this.garbageEvent[eventName].pop();
                                }
                                delete this.events[eventName];
                                delete this.garbageEvent[eventName];
                        }
                }else{
                        delete this.events ;
                        delete this.garbageEvent ;
                        this.events = {};
                        this.garbageEvent = {};
                }
        };
 
        /**
         *
         *      @method fire 
         *
         */
        Notification.prototype.fire = function(eventName) {
                var ret = true;
                if (this.events[eventName]) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        for (var i = 0; i < this.events[eventName].length; i++) {
                                try {
                                        ret = this.events[eventName][i](args);
                                        if (ret) {
                                                break;
                                        }
                                } catch (e) {
                                        throw new Error(e);
                                }
                        }
                }
                return ret;
        };
 
        /**
         *
         *      @method settingsToListen 
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
 
        Notification.prototype.unListen =function(eventName, callback){
		if ( this.events[eventName] ){
			if (callback){
                        	for (var i=0 ; i < this.garbageEvent[eventName].length ; i++){
                                	if ( this.garbageEvent[eventName][i] === callback ){
						this.events[eventName].splice(i, 1);
						this.garbageEvent[eventName].splice(i, 1);
                                	}
                        	}
			}else{
				return this.clearNotifications(eventName);	
			}
                }else{
			return this.clearNotifications();	
		}
        };

        return {
                notification:Notification,
                /**
                 *
                 *      @method create 
                 *
                 */
                create: function(settings, context) {
                        return new Notification(settings, context);
                }
        };
 
});
