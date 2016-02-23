
/***** NODEFONY  CONCAT : stage.js  *******/
/**
 *
 *	@module library
 *	@namespace stage
 *
 */
var stage = function(){


	// Traf indexOf IE8 
	var arrayProto = Array.prototype;

	var indexOf = function(){
		if (arrayProto.indexOf){
			return ;		
		}
		arrayProto.indexOf =  function( value, startIndex){
			var index = startIndex == null ? 0 : (startIndex < 0 ? Math.max(0, this.length + startIndex) : startIndex);
			for (var i = index; i < this.length; i++) {
				if (i in this && this[i] === value)
					return i;
			}
			return -1;
		}
	}();

	var typeOf = function(value){
		var t = typeof value;
		if (t === 'object'){
			if (value === null ) return "object";
			if (value instanceof Array ||
				(!(value instanceof Object) &&
           				(Object.prototype.toString.call((value)) === '[object Array]') ||
           				typeof value.length === 'number' &&
           				typeof value.splice !== 'undefined' &&
           				typeof value.propertyIsEnumerable !== 'undefined' &&
           				!value.propertyIsEnumerable('splice')
          			))
			{
				return "array";
			}
			if (!(value instanceof Object) &&
          			(Object.prototype.toString.call((value)) === '[object Function]' ||
          				typeof value.call !== 'undefined' &&
          				typeof value.propertyIsEnumerable !== 'undefined' &&
          				!value.propertyIsEnumerable('call'))
			) {
        			return 'function';
      			}
			if (value.nodeType === 1 )
				return "element";
			if (value.nodeType === 9)
				return "document";
			if (value === window)
				return "window";
			if (value instanceof Date)
				return "date";
			if (value.callee)
				return "arguments";
			if (value instanceof SyntaxError)
				return "SyntaxError";
			if (value instanceof Error)
				return "Error";
		} else {
			if (t === 'function' && typeof value.call === 'undefined') {
    				return 'object';
			}
		}
  		return t;
	};

	var getBrowser = function(){
		if (navigator.userAgent.indexOf('MSIE') > -1){
			return "MSIE";
		}
		if (navigator.userAgent.indexOf('Firefox') > -1){
			return "Firefox";
		}
		if (navigator.userAgent.indexOf('Chrome') > -1){
			return "Chrome";
		}
		if (navigator.userAgent.indexOf('Safari') > -1){
			return "Safari";
		}
		if (navigator.userAgent.indexOf('Opera') > -1){
			return "Opera";
		}
		if (navigator.userAgent.indexOf('Iceweasel') > -1){
			return "Firefox";
		}
		return "undefined";
	}();

	var getBrowserVersion = function(){

		if (/MSIE (\d+\.\d+);/.test(navigator.userAgent))
			return new Number(RegExp.$1)

		if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent))
			return new Number(RegExp.$1)

		if (/Chrome[\/\s](\d+\.\d+)/.test(navigator.userAgent))
		//if (/Chrome[\/\s](\d+\.\d+\.?\d+)/.test(navigator.userAgent))
			return new Number(RegExp.$1)

		if (/Safari[\/\s](\d+\.\d+)/.test(navigator.userAgent))
			if (/Version[\/\s](\d+\.\d+)/.test(navigator.userAgent))
				return new Number(RegExp.$1)

		if (/Opera[\/\s](\d+\.\d+)/.test(navigator.userAgent))
			if (/Version[\/\s](\d+\.\d+)/.test(navigator.userAgent))
				return new Number(RegExp.$1)

		if (/Iceweasel[\/\s](\d+\.\d+)/.test(navigator.userAgent))
			return new Number(RegExp.$1)

		return "undefined"; 
	}();

	var useragent = navigator.userAgent.toLowerCase();

	/**
	 *	stage class   
	 *	The class is a **`stage client side `** .
	 *	@class stage
	 *	@constructor
	 *	@module library
	 *	@param {Object} jQuery
	 *	
	 */
	var stage = function(jQuery){
		
		this.typeOf = typeOf ;
		this.extend = jQuery.extend ;
		this.crypto = {};
		this.modules = {};
		this.controllers = {};
		this.browser = {
			navigator:getBrowser,
			version:getBrowserVersion,
			Ie:/msie/.test( useragent ) && !/opera/.test( useragent ),
			Gecko:navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') === -1,
			Webkit:/webkit/.test( useragent ),
			Opera:Object.prototype.toString.call(window.opera) == '[object Opera]',
			platform:navigator.userAgent.match(/ip(?:ad|od|hone)/) ? 'ios' : (navigator.userAgent.match(/(?:webos|android)/) || navigator.platform.toLowerCase().match(/mac|win|linux/) || ['other'])[0]
		};
	};

	stage.prototype.version = "1.0";
	stage.prototype.require = function(){};
	stage.prototype.provide = function(){};
	
	stage.prototype.register = function(name, closure){
		if (typeof closure === "function") {
			// exec closure 
			var register = closure(this, name);
		} else {
			var register = closure;
		}
		return this[name] = register;
	};

	stage.prototype.registerModule = function(name, closure){
		return this.register.call(this.modules, name, closure);
	};

	stage.prototype.registerController = function(name, closure){
		return this.register.call(this.controllers, name, closure);
	};


	stage.prototype.basename = function(path) {
		return path.replace(/\\/g,'/').replace( /.*\//, '' );
	};
 
	stage.prototype.dirname= function dirname(path) {
		return path.replace(/\\/g,'/').replace(/\/[^\/]*$/, '');
	};


	try{
		jQuery;		
		
	}catch(e){
		throw new Error("Before kernel loading you should have jQuery registred " + e);
	}
	return new stage(jQuery)

}();

/***** NODEFONY  CONCAT : function.js  *******/
/**
 *
 * @module library
 * @namespace functions
 * 
 */

stage.register("functions" , function(){

	
	var nativeBind = function(){
		return (!! Function.prototype.bind)  
	}();

	// Context tools
	var bind = function(){

		var mergeArg = function(){
			if ( Array.prototype.unshift ){
				return function(tab, args){
					Array.prototype.unshift.apply(tab, args);
				}
			}
			return function(tab, args){
				for ( var i = args.length ; i > 0; i-- ){
					Array.prototype.splice.call(tab, 0, 0, args[i-1] );
				}
			}
		}()
		
		return function(){
			var func = this;
			var context = Array.prototype.shift.call(arguments);
			var args = arguments;
			return function (){
				mergeArg(arguments, args);
				return func.apply(context, arguments)
			}
		}
	}();
	
	if ( ! nativeBind )
		Function.prototype.bind = bind;

	// IE specificity
	var recIECopy = function(head, proto, bck){
		if(proto.__proto__){
			recIECopy(head, proto.__proto__, bck);
		}
		
		for(var f in proto){
			if(!bck[f]){			
				if(f != "__proto__"){
					//console.log(f);
					if(stage.typeOf(proto[f]) == "function"){
						//head[f] = proto[f].setContext(head);
						head[f] = proto[f].bind(head);
					}else{
						head[f] = proto[f];
					}
				}
			}		
		}
	};
	
	// IE specificity
	var recIECopySuper = function(head, proto, context){
		if(proto.__proto__){
			recIECopySuper(head, proto.__proto__, context);
		}
		for(var f in proto){					
			if(f != "__proto__"){
				if(stage.typeOf(proto[f]) == "function" && f != "constructor" ){
					//head[f] = proto[f].setContext(context);
					head[f] = proto[f].bind(context);
				}
			}				
		}			
	};

	// Optimized for simple heritage
 	var heriteSimple = function(){
 		
 		if(stage.browser.Ie){
 			
 			// IE specificity
 			return function(){
				if ( ! arguments[0] || ! arguments[1] ){
					throw new Error ("stage HERITE CLASS NOT DEFINED !!!!");
				}	
 				var args = arguments;
	
				// Extend prototype 		
				var proto = new function(){}();
				proto["__proto__"] = stage.extend({},arguments[0].prototype);
				if(!proto["__proto__"]["__proto__"]){
					proto["__proto__"]["__proto__"] = arguments[1].prototype;
				}else{
					proto["__proto__"]["__proto__"] = stage.extend(proto["__proto__"]["__proto__"],arguments[1].prototype);
				}
				
								
				// Create returned new class
				var klass = function(){					
					
					// Backup prototype and constructor of super class to allow overload
					this.$super = {
						constructor : args[1].prototype.constructor.bind(this)
					};										
					recIECopySuper(this.$super, args[1].prototype, this );						
					
					
					// Copy functions to head instance
					var bck = {};
					for(var j in this){
						if(stage.typeOf(this[j]) == "function"){
							bck[j] = true;
						}
					} 
					recIECopy(this, this, bck);														
					
					// Call constructor class in new object context			
					args[0].prototype.constructor.apply(this,arguments);					
					
					// Delete backup of prototype and constructor super class
					// Must be used only in constructor of returned class, but can be backup in var
					delete this.$super;											
				}				
				
				// Copy extended prototype in new class prototype
				klass.prototype = proto;
				// Copy constructor in new class returned
				klass.prototype.constructor = klass;				
				return klass; 			
 			}
 			
		}else{
 		
 			return function(){ 				
				if ( ! arguments[0] || ! arguments[1]){
					throw new Error ("stage HERITE MOTHER CLASS NOT DEFINED !!!!");
				}
 				var args = arguments;
	
				// Extend prototype 		
				var proto = new function(){}();
				proto["__proto__"] = stage.extend({},arguments[0].prototype);
				//proto["__proto__"] = arguments[0].prototype;
				proto["__proto__"]["__proto__"] = arguments[1].prototype;
								
				// Create returned new class
				var klass = function(){					
					
					// Backup prototype and constructor of super class to allow overload
					this.$super = {
						constructor : args[1].prototype.constructor.bind(this)
					};
					
					// Set context of all super class methods
					for(var f in args[1].prototype.constructor.prototype){
						if(args[1].prototype[f] && typeof(args[1].prototype.constructor.prototype[f]) == "function" && f != "constructor" ){
							this.$super[f] =  args[1].prototype.constructor.prototype[f].bind(this);
						}					
					}					
					
					// Call constructor class in new object context			
					args[0].prototype.constructor.apply(this,arguments);
					
					// Delete backup of prototype and constructor super class
					// Must be used only in constructor of returned class, but can be backup in var
					delete this.$super;											
				}
							
				
				// Copy extended prototype in new class prototype
				klass.prototype = proto;
				// Copy constructor in new class returned
				klass.prototype.constructor = klass;	
					
				return klass; 				
 			}			
 		}		
 	}();


	// Multiple heritage
	var recHeriteMultiple = function(){
		
		if(stage.browser.Ie){
			
			// IE specificity
			return function(i, args, proto, head, tab){
			
				proto["__proto__"] = stage.extend({},args[(args.length - i)].prototype);
			
				if(i>1){			
						
					if(i != args.length)
						tab.push( args[(args.length - i)].prototype.constructor );
					var res = recHeriteMultiple( i-1, args, proto.__proto__, head, tab);				
					
					return res;
				}else{
					
					tab.push( args[(args.length - i)].prototype.constructor );
											
					var klass = function(){					
						
						this.$super = [];					
						
						for(var sup in tab){
							
							this.$super[sup] = stage.extend({}, tab[sup].prototype);
							this.$super[sup].constructor =  tab[sup].bind(this);
							
							for(var f in this.$super[sup]){
								if( typeof(this.$super[sup][f]) == "function" && f != "constructor"){
									this.$super[sup][f] =  this.$super[sup][f].bind(this);	
								}					
							}												
						}				
									
						args[0].prototype.constructor.apply(this,arguments);
						
						// IE copy
						var bck = {};
						for(var j in this){
							if(stage.typeOf(this[j]) == "function"){
								bck[j] = true;
							}
						}
						recIECopy(this, this, bck);	
										
						delete this.$super;											
					}		
					klass.prototype = head;
					klass.prototype.constructor = klass;
					return klass;
				}
			}		
		}
	
		return function(i, args, proto, head, tab){		
			
			proto["__proto__"] = stage.extend({},args[(args.length - i)].prototype);
			
			if(i>1){			
					
				if(i != args.length)
					tab.push( args[(args.length - i)].prototype.constructor );
				var res = recHeriteMultiple( i-1, args, proto.__proto__, head, tab);				
				
				return res;
			}else{
				
				tab.push( args[(args.length - i)].prototype.constructor );
										
				var klass = function(){					
					
					this.$super = [];					
					
					for(var sup in tab){
						
						this.$super[sup] = stage.extend({}, tab[sup].prototype);
						this.$super[sup].constructor =  tab[sup].bind(this);
						
						for(var f in this.$super[sup]){
							if( typeof(this.$super[sup][f]) == "function" && f != "constructor"){
								this.$super[sup][f] =  this.$super[sup][f].bind(this);	
							}					
						}												
					}				
								
					args[0].prototype.constructor.apply(this,arguments);				
					delete this.$super;											
				}		
				klass.prototype = head;
				klass.prototype.constructor = klass;
				
				return klass;
			}
		}
	}();

	var herite = function(){	
		if(arguments.length>2){				
			var proto = new function(){}();
   			return recHeriteMultiple(arguments.length, arguments, proto, proto, new Array() );			
		}else{
			// Optimized for simple heritage
   			return heriteSimple.apply(this, arguments);			
		}    	
	};

	Function.prototype.herite = function(){
		Array.prototype.splice.call(arguments, 0, 0, this );
		return herite.apply(this,arguments);
	};

	return {
		herite:	herite
	}

});

/***** NODEFONY  CONCAT : notificationsCenter.js  *******/
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

/***** NODEFONY  CONCAT : syslog.js  *******/
/*
 * Depandances PROVIDE :
 * =====================
 */
stage.provide("syslog");
/*
 * Depandances REQUIRE :
 * =====================
 */



/*
 *
 *
 *
 */
stage.register("syslog", function(){


   	/*
    	 * default settings
    	 * <pre>
    	 *   moduleName:      "stage"
    	 *   maxStack:        100
    	 *   rateLimit:       false
    	 *   burstLimit:      3
    	 *   defaultSeverity: "DEBUG"
   	 *   checkConditions: "&&"
   	 *   async:         false
    	 *
    	 * </pre>
    	 */
   	var defaultSettings = {
           	moduleName:"SYSLOG",
		maxStack: 100,
		rateLimit:false,
		burstLimit:3,
		defaultSeverity:"DEBUG",
		checkConditions:"&&",
		async:false
   	};

   	/*
    	 * Severity syslog
    	 * <pre>
    	 *    EMERGENCY   = 0
    	 *    ALERT       = 1
    	 *    CRITIC      = 2
    	 *    ERROR       = 3
    	 *    WARNING     = 4
    	 *    NOTICE      = 5
    	 *    INFO        = 6
    	 *    DEBUG       = 7
    	 * </pre>
    	 */
   	var sysLogSeverity = [
           	"EMERGENCY",
           	"ALERT",
           	"CRITIC",
           	"ERROR",
           	"WARNING",
           	"NOTICE",
           	"INFO",
           	"DEBUG"
   	];
   	sysLogSeverity["EMERGENCY"]=0;
   	sysLogSeverity["ALERT"]=1;
   	sysLogSeverity["CRITIC"]=2;
   	sysLogSeverity["ERROR"]=3;
   	sysLogSeverity["WARNING"]=4;
   	sysLogSeverity["NOTICE"]=5;
   	sysLogSeverity["INFO"]=6;
   	sysLogSeverity["DEBUG"]=7;



   	/**
    	 *  Protocol Data Unit
     	 * @class  PDU
    	 * @constructor
    	 * @module library
    	 * @return {PDU}
    	 */
   	var PDU = function(){
       		var guid = 0;
       		return function(pci, severity, moduleName, msgid, msg, date){
			/* timeStamp @type Date*/
               		this.timeStamp = new Date(date).getTime() || new Date().getTime();
           		/* uid */
               		this.uid =  ++guid;
           		/* severity */
               		this.severity = translateSeverity(severity);
           		/* severityName */
               		this.severityName = sysLogSeverity[this.severity];
            		/* typePayload */
               		this.typePayload = stage.typeOf(pci);
           		/*
             		* protocole controle information
             		* @type Void
             		*/
               		this.payload = pci;
           		/* moduleName */
               		this.moduleName = moduleName;
           		/* msgid */
               		this.msgid = msgid || "";
           		/* msg */
               		this.msg = msg || "";	
       		}
   	}();
   	stage.PDU = PDU;
   	/**
    	 * Get Date in string format
    	 * @method getDate
    	 * @return {String} a date in string format .
    	 */
   	PDU.prototype.getDate = function(){
       		return new Date(this.timeStamp).toTimeString();
   	};

   	/**
    	 * get a string representating the PDU protocole
    	 * @method toString
    	 * @return {String}  .
    	 */
   	PDU.prototype.toString = function(){

       		return  "TimeStamp:"+this.getDate() +
           		"  Log:" +this.payload +
           		"  ModuleName:" +this.moduleName +
           		"  SeverityName:"+this.severityName+
           		"  MessageID:"+this.msgid +
           		"  UID:"+this.uid +
                   	"  Message:"+this.msg;
   	};

	PDU.prototype.parseJson = function(str){
		try {
			var json = JSON.parse(str);
			for (var ele in json){
				if (ele in this){
					this[ele] = json[ele];
				}
			}
		}catch(e){
			throw e
		}
		return json
	};



   	var operators = {
       		"<":function(ele1, ele2){ return ele1 < ele2},
       		">":function(ele1, ele2){ return ele1 > ele2},
       		"<=":function(ele1, ele2){ return ele1 <= ele2},
       		">=":function(ele1, ele2){ return ele1 >= ele2},
       		"==":function(ele1, ele2){ return ele1 === ele2},
       		"!=":function(ele1, ele2){ return ele1 !== ele2},
		"RegExp":function(ele1, ele2){return  ( ele2.test(ele1) )}
   	}

   	var conditionsObj = {
       		severity:function(pdu, condition){
           		if (condition.operator !== "=="){
               			//console.log(pdu.severity);
               			//console.log(condition.data)
               			return  operators[condition.operator](pdu.severity, condition.data)
           		}else{
               			for (var sev in condition.data){
                   			if ( sev === pdu.severityName)
                       				return true
               			}
           		}
           		return false
       		},
       		msgid:function(pdu, condition){
			if (condition.operator !== "=="){
				return operators[condition.operator](pdu.msgid, condition.data)
			}else{
           			for (var sev in condition.data){
               				if ( sev === pdu.msgid)
                   				return true
           			}
			}
           		return false
       		},
       		date:function(pdu, condition){
           		return  operators[condition.operator](pdu.timeStamp, condition.data)
       		}
   	}

   	var logicCondition ={
       		"&&" : function(myConditions, pdu){
           		var res= null
           			for (var ele in myConditions){
               				var res = conditionsObj[ele](pdu, myConditions[ele] )
               					//console.log("condition :" +ele +"  "+res)
               					if ( ! res ){
                   					break;
               					}
           			}
           		return res
       		},
       		"||" : function(myConditions, pdu){
           		var res= null
           			for (var ele in myConditions){
               				var res = conditionsObj[ele](pdu, myConditions[ele] )
               					if ( res ){
                   					break;
               					}
           			}
           		return res
       		}
   	}

   	var checkFormatSeverity = function(ele){
       		var res = false;
       		switch ( stage.typeOf(ele) ){
           		case "string":
               			res = ele.split(/,| /);
           			break;
           		case "number" :
               			res = ele;
           			break;
			default:
				throw new Error("checkFormatSeverity bad format "+stage.typeOf(ele)+" : " + ele);
       		}
       		return res;
   	}

   	var checkFormatDate = function(ele){
       		var res = false;
       		switch ( stage.typeOf(ele) ){
           		case "date":
               			res = ele.getTime();
           			break;
           		case "string":
               			res = new Date(ele);
           			break;
			default:
				throw new Error("checkFormatDate bad format "+stage.typeOf(ele)+" : " + ele);
       		}
       		return res;
   	}

	var checkFormatMsgId = function(ele){
		var res = false;
       		switch ( stage.typeOf(ele) ){
           		case "string":
               			res = ele.split(/,| /);
           			break;
           		case "number" :
               			res = ele;
           			break;
			case "object" :
				if (ele instanceof RegExp ){
					res = ele;
				}
			break;
			default:
				throw new Error("checkFormatMsgId bad format "+stage.typeOf(ele)+" : " + ele);
       		}
       		return res;

	}

   	var severityToString = function(severity){
       		var myint = parseInt(severity,10) ;
       		if (! isNaN(myint)){
           		var ele = sysLogSeverity[myint];
       		}else{
           		var ele = severity;
       		}
       		if (ele in sysLogSeverity)
           		return ele;
        	return false;
   	};


   	var sanitizeConditions = function(settingsCondition){
       		var res = true;
       		if (stage.typeOf(settingsCondition) !== "object" )
           		return false;
       		for (var ele in settingsCondition){
           		if (! ele in conditionsObj){
               			return false;
           		}
           		var condi = settingsCondition[ele];

           		if (condi.operator && ! (condi.operator in operators) ){
				throw new Error("Contitions bad operator : " + condi.operator );
           		}
           		if ( condi.data ){
               			switch (ele){
                   			case "severity":
                       				if (condi.operator){
                           				res = checkFormatSeverity(condi.data);
                           				if (res !== false){
                               					condi.data = sysLogSeverity[severityToString(res[0])];
                           				}else{
                               					return false
                           				}
                       				}else{
                           				condi.operator = "==";
                           				res = checkFormatSeverity(condi.data);
                           				if (res !== false){
                               					condi.data = {};
                               					if (stage.typeOf(res) === "array"){
                                   					for (var i = 0 ; i < res.length; i++){
                                       						var mySeverity = severityToString(res[i]) ;
                                       						if (mySeverity){
                                           						condi.data[mySeverity] = sysLogSeverity[mySeverity];
                                       						}else{
                                           						return false;
                                       						}
                                   					}
                               					}else{
                                   					return false;
                               					}
                           				}else{
                               					return false
                           				}
                       				}
                   				break;
                   			case "msgid":
						if ( ! condi.operator){
							condi.operator = "==";	
						}
						res = checkFormatMsgId(condi.data);
                       				if (res !== false){
                           				if (stage.typeOf(res) === "array"){
								condi.data = {};
                               					for (var i = 0 ; i < res.length; i++){
                                   					condi.data[res[i]] = "||";
                               					}
                           				}else{
								condi.data = res;	
							}
                       				}else{
                           				return false
                       				}
                   				break;
                   			case "date":
                       				res =checkFormatDate(condi.data);
                       				if (res)
                           				condi.data = res;
                       				else
                           				return false;
                   				break;
                   			default:
                       				return false;
               			}
           		}else{
               			return false;
           		}
       		}
       		return settingsCondition ;
       		//console.log(settingsCondition);
   	};


   	var translateSeverity = function(severity){
       		if (severity in sysLogSeverity){
           		if (typeof severity === 'number')
               			var myseverity = sysLogSeverity[sysLogSeverity[severity]]
           		else
               			var myseverity = sysLogSeverity[severity];
       		}else{
			if (! severity)
				return null;
			else
				throw new Error ("not stage syslog severity :"+severity);
       		}
       		return myseverity;
   	};

   	var createPDU = function(payload, severity, moduleName, msgid, msg){
       		if ( ! severity ){
               		var myseverity = sysLogSeverity[this.settings.defaultSeverity];
           	}else{
           		var myseverity = severity;
           	}
       		return new PDU(payload, myseverity,
                           	moduleName,
                           	msgid,
                           	msg);
   	};

   	/**
    	 * A class for product log in stage.
    	 * @example
    	 *
    	 *    var ERROR_DEFINE = {
    	 *       '-101': 'I18N string'
    	 *    };
    	 *
    	 *    var settings = {
    	 *        rateLimit:100,
    	 *        burstLimit:10,
    	 *        moduleName:"LIVE",
    	 *        defaultSeverity:"ERROR"
    	 *    };
   	 *
    	 *    var logIntance = new stage.syslog(settings);
    	 *
    	 *
    	 *    controller.logIntance.listen(context,function(pdu){
    	 *        logView(pdu)
    	 *    } )
    	 *
    	 *    controller.logIntance.listenWithConditions(context,{
    	 *        checkConditions: "&&",
   	 *        severity:{
   	 *            data:"CRITIC,ERROR"
   	 *            //data:"1,7"
   	 *        },
   	 *        date:{
   	 *            operator:">=",
   	 *            data:new Date()
   	 *        },
   	 *        msgid:{
   	 *            data:"myFunction"
   	 *        }
   	 *
    	 *
    	 *    },function(pdu){
    	 *        logView(pdu)
    	 *    } )
    	 *
    	 *
    	 *    var myFunction = function(error){
    	 *        controller.logIntance.logger(error, "ERROR", "myFunction", ERROR_DEFINE[error] );
    	 *    }
    	 *
    	 *
    	 *
    	 *    @class syslog
   	 *    @module library
    	 *    @constructor
    	 *    @param {Object} settings The settings to extend.
    	 *    @return syslog
    	 */
   	var syslog = function(settings){

       		this.mother = this.$super;
       		/*
         	 * mother class notification center
         	 */
       		this.mother.constructor(settings);
       		/**
             	 * extended settings
        	 * @property settings
             	 * @type Object
             	 * @see defaultSettings
             	 */
           	this.settings = stage.extend({},defaultSettings, settings);
       		/**
             	 * ring buffer structure container instances of PDU
        	 * @property ringStack
             	 * @type Array
             	 */
           	this.ringStack = new Array();
       		/**
             	 * Ratelimit  Management log printed
        	 * @property burstPrinted
             	 * @type Number
             	 */
           	this.burstPrinted = 0;
       		/**
             	 * Ratelimit  Management log dropped
        	 * @property missed
             	 * @type Number
             	 */
           	this.missed =0;
       		/**
             	 * Management log invalid
        	 * @property invalid
             	 * @type Number
             	 */
       		this.invalid = 0;

       		/**
             	 * Counter log valid
        	 * @property valid
             	 * @type Number
             	 */
       		this.valid = 0;
       		/**
             	 * Ratelimit  Management begin of burst
        	 * @property start
             	 * @private
             	 * @type Number
             	 */
           	this.start = 0;

       		this.fire = this.settings.async ? this.mother.fireAsync : this.mother.fire ;
   	}.herite(stage.notificationsCenter.notification);



   	syslog.prototype.pushStack = function(pdu){
       		if (this.ringStack.length === this.settings.maxStack){
               		this.ringStack.shift();
           	}
       		var index = this.ringStack.push(pdu);
       		//console.log(this);
       		this.valid++;
       		return index;
   	};
   	/**
     	 * logger message
    	 * @method logger
     	 * @param {void} payload payload for log. protocole controle information
     	 * @param {Number || String} severity severity syslog like.
     	 * @param {String} msgid informations for message. example(Name of function for debug)
     	 * @param {String} msg  message to add in log. example (I18N)
     	 */
   	syslog.prototype.logger = function(payload, severity, msgid, msg){
           	if (this.settings.rateLimit){
               		var now = new Date().getTime();
               		this.start = this.start || now;
               		if (now > this.start + this.settings.rateLimit){
               			this.burstPrinted = 0;
               			this.missed =0;
               			this.start = 0;
               		}
               		if(this.settings.burstLimit && this.settings.burstLimit > this.burstPrinted ){
               			try {
                   			if (payload instanceof  PDU ){
                       				var pdu = payload
                   			}else{
                       				var pdu = createPDU.call(this, payload, severity, this.settings.moduleName, msgid, msg);
                   			}
               			}catch(e){
                   			this.invalid++;
                   			return "INVALID"
               			}
               			this.pushStack( pdu);
               			this.fire("onLog", pdu);
               			this.burstPrinted++;
               			return "ACCEPTED";
               		}
               		this.missed++;
               		return "DROPPED";
           	}else{
           		try {
               			if (payload instanceof  PDU ){
                   			var pdu = payload;
               			}else{
                   			var pdu = createPDU.call(this, payload, severity, this.settings.moduleName, msgid, msg);
               			}
           		}catch(e){
               			this.invalid++;
               			return "INVALID";
           		}
               		this.pushStack( pdu);
               		this.fire("onLog", pdu);
           		return "ACCEPTED";
           	}
   	}



   	/**
     	 * Clear stack of logs
     	 *
     	 * @method clearLogStack
      	 *
      	 *
     	 *
     	 */
   	syslog.prototype.clearLogStack = function(){
       		this.ringStack.length = 0;
   	}

   	/**
     	 * get hitory of stack
    	 * @method getLogStack
      	 * @param {Number} start .
     	 * @param {Number} end .
     	 * @return {array} new array between start end
     	 * @return {PDU} pdu
     	 */
   	syslog.prototype.getLogStack = function(start, end, contition){
		if (contition){
			var stack = this.getLogs(contition) ; 
		}else{
			var stack = this.ringStack ;
		}
           	if ( arguments.length  === 0)
               		return stack[stack.length-1];
           	if ( ! end)
               		return stack.slice(start);
           	if (start === end)
               		return stack[stack.length - start-1];
		return stack.slice(start, end );
   	}


   	/**
     	 * get logs with conditions
    	 * @method getLogs
      	 * @param {Object} conditions .
     	 * @return {array} new array with matches conditions
     	 */
   	syslog.prototype.getLogs = function(conditions, stack){
		var myStack = stack || this.ringStack ;
       		if ( conditions.checkConditions && conditions.checkConditions in logicCondition ){
           		var myFuncCondition = logicCondition[conditions.checkConditions];
           		delete conditions.checkConditions;
       		}else{
           		var myFuncCondition = logicCondition[this.settings.checkConditions];
       		}
       		var tab = [];
		try {
			var Conditions = sanitizeConditions(conditions);
		}catch(e){
			throw new Error("registreNotification conditions format error: "+ e);
		}
       		if (Conditions){
           		for (var i = 0 ; i<myStack.length; i++){
               			var res = myFuncCondition(Conditions,myStack[i])
               				if (res)
                   				tab.push(myStack[i]);
           		}
       		}
       		return tab;
   	};


   	/**
     	 * take the stack and build a JSON string
    	 * @method logToJson
     	 * @return {String} string in JSON format
     	 */
   	syslog.prototype.logToJson = function(conditions){
       		if (conditions)
           		var stack = this.getLogs(conditions)
       		else
           		var stack = this.ringStack
           			return JSON.stringify(stack);
   	};

   	/**
    	 * load the stack as JSON string
   	 * @method loadStack
   	 * @param {Object} json or string stack serialize
	 * @param {boolean} fire conditions events  .
	 * @param {function} callback before fire conditions events
    	 * @return {String}
    	 */
   	syslog.prototype.loadStack = function(stack, doEvent, beforeConditions){
       		if (! stack )
           		throw new Error("syslog loadStack : not stack in arguments ")
               			switch(stage.typeOf(stack)){
                   			case "string" :
                       				try {
							//console.log(stack);
                           				var st = JSON.parse(stack);
                           				return arguments.callee.call(this, st, doEvent);
                       				}catch(e){
                           				throw e;
                       				}
                       				break;
                   			case "array" :
                   			case "object" :
                       				try {
                           				for(var i= 0 ; i<stack.length ; i++){
                               					var pdu = new PDU(stack[i].payload, stack[i].severity, stack[i].moduleName || this.settings.moduleName , stack[i].msgid, stack[i].msg, stack[i].timeStamp)
                                   				this.pushStack( pdu);

                                   				if (doEvent) {
									if (beforeConditions && typeof beforeConditions  === "function")
										beforeConditions.call(this, pdu, stack[i]);
                                       					this.fire("onLog", pdu);
                                   				}
                           				}
                       				}catch(e){
                           				throw e;
                       				}
                       				break;
                   			default :
                       				throw new Error("syslog loadStack : bad stack in arguments type")
               			};
               	return st || stack;
   	};

   	
   	/**
     	 *
     	 *    @method  listenWithConditions
     	 *
     	 */
   	syslog.prototype.listenWithConditions = function(context, conditions, callback  ){
       		if ( conditions.checkConditions && conditions.checkConditions in logicCondition ){
           		var myFuncCondition = logicCondition[conditions.checkConditions];
           		delete conditions.checkConditions;
       		}else{
           		var myFuncCondition = logicCondition[this.settings.checkConditions];
       		}
		try {
			var Conditions = sanitizeConditions(conditions);
		}catch(e){
			throw new Error("registreNotification conditions format error: "+ e);	
		}
       		if (Conditions){
			var func = function(pdu){
               			var res = myFuncCondition(Conditions, pdu)
               			if (res){
                   			callback.apply(context || this, arguments)
               			}
           		};
           		this.mother.listen(this, "onLog", func);
			return func ;
       		}
   	};

	return syslog;

});


/***** NODEFONY  CONCAT : xml.js  *******/
/*
 *
 *
 *
 *
 *
 *
 *
 */

stage.register("xml", function(){

	/**
   	* \brief changes the given string to XML doc.
   	*
   	* \param string an XML string
   	* \return  the document  node root
   	*/
  	var stringToDocumentXML = function(){

		if ( ! document.implementation.createDocument){
			return function(str){
				var doc = createDocument();
				doc.async="false";
				doc.loadXML(str);
				return doc;
			}
		}
		
		return function(str){
    			try{
				var oDomDoc = (new DOMParser()).parseFromString(str, 'application/xml');
      			}catch(e){
				throw Error('xml function stringToDocumentXML : '+e);
      			}
			return oDomDoc;
		}
  	}();
  	
  	var getDocumentRoot = function(doc){ 
		var type = stage.typeOf(doc);
		if ( type === "document" ){
			return (doc.documentElement || doc.childNodes[0]);		
		}
		if ( type === "element" ){
			var myDoc = doc.ownerDocument ;
			return (myDoc.documentElement || myDoc.childNodes[0]);
		}
  	};





	//parseXML
	var parseXml = function( xml ){
		switch (stage.typeOf(xml)){
			case "string":
				var root = getDocumentRoot(stringToDocumentXML(xml));
			break;
			case "document":
				var root = getDocumentRoot(xml);
			break;
			case "element":
				var root = xml;
			break;
			default:
				throw new Error("parseXml  bad type arguments");
		
		}
		return parseDOM( root );
	};

	var __force_array = null;
	var parseDOM = function(root){
		if ( ! root ) return null;
		var force_array = null;
		__force_array = {};
        	if ( force_array ) {
            		for( var i=0; i<force_array.length; i++ ) {
                		__force_array[force_array[i]] = 1;
            		}
        	}

        	var json = parseNode( root );   // parse root node
        	if ( __force_array[root.nodeName] ) {
            		json = [ json ];
        	}
        	if ( root.nodeType != 11 ) {            // DOCUMENT_FRAGMENT_NODE
            		var tmp = {};
            		tmp[root.nodeName] = json;          // root nodeName
            		json = tmp;
        	}
        	return json;
	};


	var attr_prefix ="@";
	var name_space = ":";
	var parseNode = function(node){
		if ( ! node ) return null;
		switch( node.nodeType ){
			// COMMENT_NODE
			case 7:
				return null;
			// TEXT_NODE 
			case 3:
			// CDATA_SECTION_NODE
			case 4:
				if ( node.nodeValue.match( /[^\x00-\x20]/ ) )
					return node.nodeValue;
				return null;
			break;		
		}
		var ret = null;
		var data = {};	

		// parse Attributes 
		if ( node.attributes && node.attributes.length ){
			ret = {};
			for ( var i=0; i<node.attributes.length; i++ ) {
				var key = node.attributes[i].nodeName;
                		if ( typeof(key) !== "string" ) continue;
                		var val =  node.attributes[i].value || node.attributes[i].nodeValue;
                		if ( ! val ) continue;
                		key = attr_prefix + key;
                		if ( typeof(data[key]) == "undefined" ) data[key] = 0;
                		data[key] ++;
				addNode( ret, key, data[key], val );
			}
			//console.log(data)
		}

		if ( node.childNodes && node.childNodes.length ) {
            		var textonly = true;
            		if ( ret ) textonly = false;        // some attributes exists
            		for ( var i=0; i<node.childNodes.length && textonly; i++ ) {
                		var ntype = node.childNodes[i].nodeType;
                		if ( ntype == 3 || ntype == 4 ) continue;
                		textonly = false;
            		}
            		if ( textonly ) {
                		if ( ! ret ) ret = "";
                		for ( var i=0; i<node.childNodes.length; i++ ) {
                    			ret += node.childNodes[i].nodeValue;
                		}
            		} else {
                		if ( ! ret ) ret = {};
                		for ( var i=0; i<node.childNodes.length; i++ ) {
                    			var key = node.childNodes[i].nodeName;
                    			if ( typeof(key) !== "string" ) continue;
                    			var val = parseNode( node.childNodes[i] );
                    			if ( ! val ) continue;
                    			if ( typeof(data[key]) === "undefined" ) data[key] = 0;
                    			data[key] ++;
                    			addNode( ret, key, data[key], val );
                		}
            		}
        	}
		return ret;
	};

	var addNode = function ( hash, key, cnts, val ) {
        	key = removeColon(key);
        	if ( __force_array && __force_array[key] ) {
            		if ( cnts == 1 ) hash[key] = [];
            		hash[key][hash[key].length] = val;      // push
        	} else if ( cnts == 1 ) {                   // 1st sibling
            		hash[key] = val;
        	} else if ( cnts == 2 ) {                   // 2nd sibling
            		hash[key] = [ hash[key], val ];
        	} else {                                    // 3rd sibling and more
            		hash[key][hash[key].length] = val;
        	}
	};
	
	var removeColon = function(name){
		return name ? (name.replace(':',name_space)): name;
	};



	return {
		parseXml:parseXml
		//parseNode:parseDOM,
	  	//stringToDocumentXML : stringToDocumentXML ,
	  	//getDocumentRoot :getDocumentRoot
	
	
	}


});

/***** NODEFONY  CONCAT : io.js  *******/
/*
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
stage.provide("io");



stage.require("jquery");



stage.register("io",function(){




	var isSameOrigin = function (url) {
		var loc = window.location;
		var a = urlToOject(url);
		return a.hostname == loc.hostname &&
			a.port == loc.port &&
			a.protocol == loc.protocol;
	};

	var isSecure = function(url){
		var loc = window.location;
		var a = urlToOject(url);
		return a.protocol === "https:" ;
	}

	/*
 	 *
 	 *   CLASS AUTHENTICATE
 	 *
 	 *
 	 *	EVENTS
 	 *
 	 *	onError: 
 	 *
 	 *
 	 *	onSuccess:
 	 *
 	 *
 	 */

	var authenticate = function(url, request, settings ){
		this.url = typeof url === "object" ? url : stage.io.urlToOject(url) ;
		this.crossDomain = ! stage.io.isSameOrigin(url);
		// notification center
		this.notificationCenter = stage.notificationsCenter.create(settings);
		// get header WWW-Authenticate
		var authenticate = request["WWW-Authenticate"].split(" ") ;
		//  get type authentification
		var authType = Array.prototype.shift.call(authenticate);
		var headers = request["WWW-Authenticate"].replace(authType+" ","") 
		//console.log(authType);
		this.method = "POST";
		var body = request.body;

		// intance of authentication
		var auth = this.getAuthenticationType(authType);
		this.authentication = new auth(this.url,  this.method, headers, body )
		this.ajax = false;
		if (settings.ajax){
			this.ajax = true;
		}
	};

	authenticate.prototype.getAuthenticationType = function(type){
		if (type in stage.io.authentication){
			return stage.io.authentication[type];
		}else{
			throw new Error("SSE client can't negociate : "+type )
		}
	};

	authenticate.prototype.register = function(username, password){

		var line = this.authentication.getAuthorization(username, password);
		this.notificationCenter.fire("onRegister", this, line);	
		if (this.ajax){
			$.ajax({
				type:		this.method,
				url:		this.url.href,
				cache:		false,
				crossDomain:	this.crossDomain ? false : true ,
				error:function(obj, type, message){
					this.notificationCenter.fire("onError", obj, type, message);	
				}.bind(this),
				beforeSend:function(xhr){
					xhr.setRequestHeader("Authorization", line );
					//if (this.crossDomain)
						//xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
				}.bind(this),
				success:function(data, state, obj){
					this.notificationCenter.fire("onSuccess", data, state, obj);
				}.bind(this)
			});
		}		
	};


	/**
 	 * We need our custom method because encodeURIComponent is too aggressive and doesn't follow
 	 * http://www.ietf.org/rfc/rfc3986.txt with regards to the character set (pchar) allowed in path
 	 * segments:
 	 *    segment       = *pchar
 	 *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
 	 *    pct-encoded   = "%" HEXDIG HEXDIG
 	 *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
 	 *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
 	 *                     / "*" / "+" / "," / ";" / "="
 	 */
	 var encodeUriSegment = function(val) {
  		return encodeUriQuery(val, true).
             		replace(/%26/gi, '&').
             		replace(/%3D/gi, '=').
             		replace(/%2B/gi, '+');
	};


	/**
 	 * This method is intended for encoding *key* or *value* parts of query component. We need a custom
 	 * method because encodeURIComponent is too aggressive and encodes stuff that doesn't have to be
 	 * encoded per http://tools.ietf.org/html/rfc3986:
 	 *    query       = *( pchar / "/" / "?" )
 	 *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
 	 *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
 	 *    pct-encoded   = "%" HEXDIG HEXDIG
 	 *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
 	 *                     / "*" / "+" / "," / ";" / "="
 	 */
	 var encodeUriQuery = function (val, pctEncodeSpaces) {
  		return encodeURIComponent(val).
             		replace(/%40/gi, '@').
             		replace(/%3A/gi, ':').
             		replace(/%24/g, '$').
             		replace(/%2C/gi, ',').
             		replace(/%3B/gi, ';').
             		replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
	};

	
	var regSearch = /^\?(.*)/ ;
	var parseKeyValue = function(search){
		//console.log(search)
		var test = regSearch.exec(search) ;
		//console.log(test)
		if (test){
			search = test[1];	
		}
		var obj = {}, key_value, key;
		var tab = (search|| "").split('&') ;
		if (tab.length){
			for (var i = 0 ; i< tab.length;i++){
				try {
					var key_value = tab[i].replace(/\+/g,'%20').split('=');
					var key = decodeURIComponent(key_value[0]); 
					//console.log(key_value)
					//console.log(key)
					if ( key ){
						var val =  decodeURIComponent(key_value[1])
						if ( ! Object.prototype.hasOwnProperty.call(obj, key) ){
							obj[key] = val;
						}else{
							switch (stage.typeOf(obj[key])){
								case "array":
									obj[key].push(val);
								break;
								default:
									obj[key] = [obj[key],val];
							}
						}
					}
				}catch (e){
					//invalid
				}
			}
		}
		return obj	
	};

	var toKeyValue = function(obj){
		var parts = [];
		for (var ele in obj){
			switch(stage.typeOf(obj[ele])){
				case "array":
					for (var i = 0 ; i<obj[ele].length ;i++){
						parts.push(encodeUriQuery(ele, true) + (obj[ele][i] === true ? '' : '=' + encodeUriQuery(obj[ele][i], true)));	
					}
				break;
				case "string":
				case "boolean":
					parts.push( encodeUriQuery(ele, true) + (obj[ele] === true ? '' : '=' + encodeUriQuery(obj[ele], true)) );
				break;
				default:
					continue ;
			}
		}
		return parts.length ? parts.join('&') : '';
  	};


	var getHeaderJSON = function(xhr) {
  		var json = xhr.getResponseHeader("X-Json"); 
  		if (json) {
			try {
				return JSON.parse(json)
			}catch(e){
				return json;
			}
  		}
		return null;
	};

   

	var urlToOject = function(url){
		var result = {};

		var anchor = document.createElement('a');
		anchor.href = url;

		var keys = 'protocol hostname host pathname port search hash href'.split(' ');
		for (keyIndex in keys) {
			var currentKey = keys[keyIndex]; 
			result[currentKey] = anchor[currentKey];
		}

		result.toString = function() { return anchor.href; };
		result.requestUri = result.pathname + result.search;  

		result.basename = result.pathname.replace(/\\/g,'/').replace( /.*\//, '' ) ;
		result.dirname = result.pathname.replace(/\\/g,'/').replace(/\/[^\/]*$/, '') ;

		return result;	
	};

	var nativeWebSocket = window.WebSocket  ? true : false ; 

	var transportCore = function(url, settings, context){
		this.$super.constructor(settings, context || this);	
		// Manage Url
		if (url){
			this.url = urlToOject(url);
			this.crossDomain = !isSameOrigin(url);
			this.error = null;
		}else{
			this.fire("onError", new Error("Transport URL not defined") );
		}
	}.herite(stage.notificationsCenter.notification);

	return {
		nativeWebSocket: nativeWebSocket,
		urlToOject: urlToOject,
		parseKeyValue:parseKeyValue,
		toKeyValue:toKeyValue,
		encodeUriSegment:encodeUriSegment,
		encodeUriQuery:encodeUriQuery,
		getHeaderJSON: getHeaderJSON,
		isSameOrigin: isSameOrigin,
		isSecure:isSecure,
		protocols: {},
		authentication: {
			authenticate: authenticate,
			mechanisms: {}
		},
		transport: transportCore,
		transports: {}
	}

});



/***** NODEFONY  CONCAT : base64.js  *******/
/*
 *
 *
 *
 *
 *
 *
 *
 */
stage.provide("base64");



stage.register.call(stage.crypto, "base64", function(){

	// private property
	var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

	// public method for encoding
	var encode64 = function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = _utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
        			enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
        			enc4 = 64;
			}

			output = output +
			_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
			_keyStr.charAt(enc3) + _keyStr.charAt(enc4);

		}
		return output;
	};

    	// public method for decoding
	var decode64 = function (input) {
        	 var output = "";
        	 var chr1, chr2, chr3;
        	 var enc1, enc2, enc3, enc4;
        	 var i = 0;

        	 input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        	 while (i < input.length) {

            		 enc1 = _keyStr.indexOf(input.charAt(i++));
            		 enc2 = _keyStr.indexOf(input.charAt(i++));
            		 enc3 = _keyStr.indexOf(input.charAt(i++));
            		 enc4 = _keyStr.indexOf(input.charAt(i++));

            		 chr1 = (enc1 << 2) | (enc2 >> 4);
            		 chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            		 chr3 = ((enc3 & 3) << 6) | enc4;

            		 output = output + String.fromCharCode(chr1);

            		 if (enc3 != 64) {
                		 output = output + String.fromCharCode(chr2);
            		 }
            		 if (enc4 != 64) {
                		 output = output + String.fromCharCode(chr3);
            		 }

        	 }

        	 if (i != input.length) {
			 throw new Error ("BASE64_BROKEN : There were invalid base64 characters in the input text.\n" +
	              			"Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
	              			"Expect errors in decoding.");
        	 }

        	 output = _utf8_decode(output);

        	 return output;

    	 };

	
	var decode =  function(input, arrayBuffer) {
		//get last chars to see if are valid
		var lkey1 = _keyStr.indexOf(input.charAt(input.length-1));		 
		var lkey2 = _keyStr.indexOf(input.charAt(input.length-2));		 

		var bytes = (input.length/4) * 3;
		if (lkey1 == 64) bytes--; //padding chars, so skip
		if (lkey2 == 64) bytes--; //padding chars, so skip

		var uarray;
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		var j = 0;

		if (arrayBuffer)
			uarray = new Uint8Array(arrayBuffer);
		else
			uarray = new Uint8Array(bytes);

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		for (i=0; i<bytes; i+=3) {	
			//get the 3 octects in 4 ascii chars
			enc1 = _keyStr.indexOf(input.charAt(j++));
			enc2 = _keyStr.indexOf(input.charAt(j++));
			enc3 = _keyStr.indexOf(input.charAt(j++));
			enc4 = _keyStr.indexOf(input.charAt(j++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			uarray[i] = chr1;			
			if (enc3 != 64) uarray[i+1] = chr2;
			if (enc4 != 64) uarray[i+2] = chr3;
		}
		return uarray;	
	}




    	 // private method for UTF-8 encoding
	var _utf8_encode = function (string) {
        	string = string.replace(/\r\n/g,"\n");
        	var utftext = "";

        	for (var n = 0; n < string.length; n++) {

            		var c = string.charCodeAt(n);

            		if (c < 128) {
                		utftext += String.fromCharCode(c);
            		}
            		else if((c > 127) && (c < 2048)) {
                		utftext += String.fromCharCode((c >> 6) | 192);
                		utftext += String.fromCharCode((c & 63) | 128);
            		}
            		else {
                		utftext += String.fromCharCode((c >> 12) | 224);
                		utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                		utftext += String.fromCharCode((c & 63) | 128);
            		};

        	};
        	return utftext;
    	};

    	// private method for UTF-8 decoding
	var _utf8_decode = function(utftext){
        	var string = "";
        	var i = 0;
        	var c = 0;
		//var c1 = 0;
		var c2 = 0;

        	while ( i < utftext.length ) {

            		c = utftext.charCodeAt(i);

            		if (c < 128) {
                		string += String.fromCharCode(c);
                		i++;
            		}
            		else if((c > 191) && (c < 224)) {
                		c2 = utftext.charCodeAt(i+1);
                		string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                		i += 2;
            		}
            		else {
                		c2 = utftext.charCodeAt(i+1);
                		var c3 = utftext.charCodeAt(i+2);
                		string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                		i += 3;
            		}

        	}
        	return string;
    	};


	/* will return a  Uint8Array type */
	var decodeArrayBuffer =  function(input) {
		var bytes = (input.length/4) * 3;
		var ab = new ArrayBuffer(bytes);
		decode(input, ab);
		return ab;
	};


	return {
		decodeArrayBuffer:decodeArrayBuffer,
		encode:encode64,
		decode:decode64
	}
});



/***** NODEFONY  CONCAT : md5.js  *******/


/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
stage.provide("md5");


stage.register.call(stage.crypto, "md5", function(){

	/*
 	 * Configurable variables. You may need to tweak these to be compatible with
 	 * the server-side, but the defaults work in most cases.
 	 */
	var hexcase = 0;   /* hex output format. 0 - lowercase; 1 - uppercase        */
	var b64pad  = "";  /* base-64 pad character. "=" for strict RFC compliance   */

	/*
 	 * Perform a simple self-test to see if the VM is working
 	 */
	var md5_vm_test = function()
	{
  		return hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72";
	}

	/*
 	* Calculate the MD5 of a raw string
 	*/
	var rstr_md5 = function(s)
	{
  		return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
	}

	/*
 	* Calculate the HMAC-MD5, of a key and some data (raw strings)
 	*/
	var rstr_hmac_md5 = function (key, data)
	{
  		var bkey = rstr2binl(key);
  		if(bkey.length > 16) bkey = binl_md5(bkey, key.length * 8);

  		var ipad = Array(16), opad = Array(16);
  		for(var i = 0; i < 16; i++)
  		{
    			ipad[i] = bkey[i] ^ 0x36363636;
    			opad[i] = bkey[i] ^ 0x5C5C5C5C;
  		}

  		var hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
  		return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
	}



	/*
 	 * Convert a raw string to a hex string
 	 */
	var rstr2hex = function(input)
	{
  		//try { hexcase } catch(e) { hexcase=0; }
  		var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  		var output = "";
  		var x;
  		for(var i = 0; i < input.length; i++)
  		{
    			x = input.charCodeAt(i);
    			output += hex_tab.charAt((x >>> 4) & 0x0F)
           			+  hex_tab.charAt( x        & 0x0F);
  		}
  		return output;
	}

	/*
 	 * Convert a raw string to a base-64 string
 	 */
	var rstr2b64 = function(input)
	{
  		//try { b64pad } catch(e) { b64pad=''; }
  		var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  		var output = "";
  		var len = input.length;
  		for(var i = 0; i < len; i += 3)
  		{
    			var triplet = (input.charCodeAt(i) << 16)
                		| (i + 1 < len ? input.charCodeAt(i+1) << 8 : 0)
                		| (i + 2 < len ? input.charCodeAt(i+2)      : 0);
    			for(var j = 0; j < 4; j++)
    			{
      				if(i * 8 + j * 6 > input.length * 8) output += b64pad;
      				else output += tab.charAt((triplet >>> 6*(3-j)) & 0x3F);
    			}
  		}
  		return output;
	}

	/*
 	 * Convert a raw string to an arbitrary string encoding
 	 */
	var rstr2any = function (input, encoding)
	{
  		var divisor = encoding.length;
  		var i, j, q, x, quotient;

  		/* Convert to an array of 16-bit big-endian values, forming the dividend */
  		var dividend = Array(Math.ceil(input.length / 2));
  		for(i = 0; i < dividend.length; i++)
  		{
    			dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
  		}

  		/*
   		 * Repeatedly perform a long division. The binary array forms the dividend,
   		 * the length of the encoding is the divisor. Once computed, the quotient
   		 * forms the dividend for the next step. All remainders are stored for later
   		 * use.
   		 */
  		var full_length = Math.ceil(input.length * 8 /
                                (Math.log(encoding.length) / Math.log(2)));
  		var remainders = Array(full_length);
  		for(j = 0; j < full_length; j++)
  		{
    			quotient = Array();
    			x = 0;
    			for(i = 0; i < dividend.length; i++)
    			{
      				x = (x << 16) + dividend[i];
      				q = Math.floor(x / divisor);
      				x -= q * divisor;
      				if(quotient.length > 0 || q > 0)
        				quotient[quotient.length] = q;
    			}
    			remainders[j] = x;
    			dividend = quotient;
  		}

  		/* Convert the remainders to the output string */
  		var output = "";
  		for(i = remainders.length - 1; i >= 0; i--)
    			output += encoding.charAt(remainders[i]);

  		return output;
	}
	
	/*
 	 * Encode a string as utf-8.
 	 * For efficiency, this assumes the input is valid utf-16.
 	 */
	var str2rstr_utf8 = function (input)
	{
  		var output = "";
  		var i = -1;
  		var x, y;

  		while(++i < input.length)
  		{
    			/* Decode utf-16 surrogate pairs */
    			x = input.charCodeAt(i);
    			y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
    			if(0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF)
    			{
      				x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
      				i++;
    			}

    			/* Encode output as utf-8 */
    			if(x <= 0x7F)
      				output += String.fromCharCode(x);
    			else if(x <= 0x7FF)
      				output += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F),
                                    		0x80 | ( x         & 0x3F));
    			else if(x <= 0xFFFF)
      				output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                                    		0x80 | ((x >>> 6 ) & 0x3F),
                                    		0x80 | ( x         & 0x3F));
    			else if(x <= 0x1FFFFF)
      				output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                                    		0x80 | ((x >>> 12) & 0x3F),
                                    		0x80 | ((x >>> 6 ) & 0x3F),
                                    		0x80 | ( x         & 0x3F));
  		}
  		return output;
	}

	/*
 	 * Encode a string as utf-16
 	 */
	var str2rstr_utf16le = function (input)
	{
  		var output = "";
  		for(var i = 0; i < input.length; i++)
    			output += String.fromCharCode( input.charCodeAt(i)        & 0xFF,
                                  	(input.charCodeAt(i) >>> 8) & 0xFF);
  		return output;
	}

	var str2rstr_utf16be = function (input)
	{
  		var output = "";
  		for(var i = 0; i < input.length; i++)
    			output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF,
                                   	input.charCodeAt(i)        & 0xFF);
  		return output;
	}

	/*
 	 * Convert a raw string to an array of little-endian words
 	 * Characters >255 have their high-byte silently ignored.
 	 */
	var rstr2binl = function (input)
	{
  		var output = Array(input.length >> 2);
  		for(var i = 0; i < output.length; i++)
    			output[i] = 0;
  		for(var i = 0; i < input.length * 8; i += 8)
    			output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (i%32);
  		return output;
	}

	/*
 	 * Convert an array of little-endian words to a string
 	 */
	var binl2rstr = function (input)
	{
  		var output = "";
  		for(var i = 0; i < input.length * 32; i += 8)
    			output += String.fromCharCode((input[i>>5] >>> (i % 32)) & 0xFF);
  		return output;
	}

	/*
 	 * Calculate the MD5 of an array of little-endian words, and a bit length.
 	 */
	var binl_md5 = function (x, len)
	{
  		/* append padding */
  		x[len >> 5] |= 0x80 << ((len) % 32);
  		x[(((len + 64) >>> 9) << 4) + 14] = len;

  		var a =  1732584193;
  		var b = -271733879;
  		var c = -1732584194;
  		var d =  271733878;

  		for(var i = 0; i < x.length; i += 16)
  		{
    			var olda = a;
    			var oldb = b;
    			var oldc = c;
    			var oldd = d;

    			a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    			d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    			c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    			b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    			a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    			d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    			c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    			b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    			a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    			d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    			c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    			b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    			a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    			d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    			c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    			b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    			a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    			d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    			c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    			b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    			a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    			d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    			c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    			b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    			a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    			d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    			c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    			b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    			a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    			d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    			c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    			b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    			a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    			d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    			c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    			b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    			a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    			d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    			c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    			b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    			a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    			d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    			c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    			b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    			a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    			d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    			c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    			b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    			a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    			d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    			c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    			b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    			a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    			d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    			c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    			b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    			a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    			d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    			c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    			b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    			a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    			d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    			c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    			b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    			a = safe_add(a, olda);
    			b = safe_add(b, oldb);
    			c = safe_add(c, oldc);
    			d = safe_add(d, oldd);
  		}
  		return Array(a, b, c, d);
	}

	/*
 	 * These functions implement the four basic operations the algorithm uses.
 	 */
	var md5_cmn = function (q, a, b, x, s, t)
	{
  		return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
	}
	var md5_ff = function (a, b, c, d, x, s, t)
	{
  		return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
	}
	var md5_gg = function (a, b, c, d, x, s, t)
	{
  		return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
	}
	var md5_hh = function (a, b, c, d, x, s, t)
	{
  		return md5_cmn(b ^ c ^ d, a, b, x, s, t);
	}
	var md5_ii = function (a, b, c, d, x, s, t)
	{
  		return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
	}

	/*
 	 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 	 * to work around bugs in some JS interpreters.
 	 */
	var safe_add = function (x, y)
	{
  		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  		return (msw << 16) | (lsw & 0xFFFF);
	}

	/*
 	 * Bitwise rotate a 32-bit number to the left.
 	 */
	var bit_rol = function (num, cnt)
	{
  		return (num << cnt) | (num >>> (32 - cnt));
	}

	return {
 		hex_md5:function(s){ 
			return rstr2hex(rstr_md5(str2rstr_utf8(s)));
		},
		hex_md5_noUTF8:function(s){ 
			return rstr2hex(rstr_md5(s)); 
		},
		str_md5:function(s){ 
			return rstr_md5(str2rstr_utf8(s)); 
		},
 		b64_md5:function(s){ 
			return rstr2b64(rstr_md5(str2rstr_utf8(s)));
		},
 		any_md5:function(s, e){
			return rstr2any(rstr_md5(str2rstr_utf8(s)), e); 
		},
 		hex_hmac_md5:function(k, d){
			return rstr2hex(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d))); 
		},
		str_hmac_md5:function(k, d){
			return rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)); 
		},
 		b64_hmac_md5:function(k, d){
			return rstr2b64(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)));
		},
 		any_hmac_md5:function(k, d, e){ 
			return rstr2any(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)), e);
		}
	}
})


/***** NODEFONY  CONCAT : digestMd5.js  *******/
/*
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
stage.provide("digest-md5");


stage.require("md5");
stage.require("base64");


stage.register.call(stage.io.authentication.mechanisms, "Digest",function(){

	var keyWord= {
		realm:true,
		qop:true,
		charset:true,
		algorithm:true,
		nonce:true
	}

	var reg =/^([^=]+)=(.+)$/;
	var parserAuthenticate = function(str){
		var ret = str.replace(/"/g,"");
		ret = ret.replace(/Digest /g,"");
		var head = ret.split(",");
		var obj = {}
		for (var i= 0 ; i < head.length ; i++){
			var res = reg.exec(head[i]);
			if (res && res[1])
				obj[res[1]] = res[2]
		}	
		return obj
	}

	var MD5 = stage.crypto.md5.hex_md5_noUTF8 ;
	var BASE64 = stage.crypto.base64.encode ;
	var DBASE64 = stage.crypto.base64.decode;

	var generateA1 = function(username, realm, password, nonce, cnonce){
		if (cnonce)
			var A1 = username + ":" + realm + ":" + password + ":" + nonce+ ":" + cnonce ;
		else
			var A1 = username + ":" + realm + ":" + password ;//+ ":" + nonce ;
		return MD5(A1); 
	};

	var generateA2 = function(method, uri, entity_body, qop){
		var A2 = "";
		if( ! qop || qop ===  "auth"){
			A2 = method +":" + uri ;
		} else if(qop === "auth-int"){
			if( entity_body ){
				var entity = MD5(entity_body);
				A2 = method + ":" + uri + ":" + entity ; 
			}else{
				A2 = method + ":" + uri + ":" + "d41d8cd98f00b204e9800998ecf8427e" ;
			}
		}
		return MD5(A2);
	};

	var responseDigest = function(A1, nonce, noncecount, cnonce, qop, A2){
		var res = "";
		if(qop === "auth" || qop === "auth-int"){
			res = A1 + ":" + nonce +":" + noncecount +":" + cnonce +":" + qop + ":" + A2 ;
		}else{
			res = A1 + ":" + nonce + ":" + A2 ;
		}
		return MD5(res);
	};


	var digestMd5 = function(url, method, headers, body){
		this.method = method ;
		this.entity_body = body;
		this.url = url;
		this.uri = this.url.requestUri;
		this.protocol = this.url.protocol.replace(":","");
		this.host = this.url.host;
		switch (typeof headers){
			case "object":
				this.parseChallenge(headers);
 			break;	
			default:
				throw new Error("digetMD5 bad format header")
		}
	}

	digestMd5.prototype.parseChallenge = function(headers){
		//console.log(headers)
		var parsing = {};
		switch (typeof headers){
			case "string" : 
			//TODO
				throw new Error("digetMD5 bad format challenge")
			break;	
			case "object" :
				for (var ele in headers ){
					switch (ele){
						case "challenge":
							if (typeof headers.challenge === "string"){
								try{
									this.challengeB64 = DBASE64(headers.challenge);
								}catch(e){
									this.challengeB64 = headers.challenge ;
									//throw new Error("DIGEST MD5 ERROR DECODE BAS64")	
								}
							
							}
						break;
						default:
							parsing[ele] = headers[ele];
							
					};
				}
			break;	
			default:
				throw new Error("digetMD5 bad format challenge")
		}
		var challenge = stage.extend(parserAuthenticate(this.challengeB64), parsing )
		//var challenge = parserAuthenticate(this.challengeB64);
		//console.log(challenge)
		for (var name in challenge){
			if (name in keyWord){
				this[name] = challenge[name];
			}else{
				console.warn("digestMd5 parser challenge header name dropped: "+name)
			}	
		}
	};


	digestMd5.prototype.generateAuthorization = function(username, password){

		var line = 'Digest username="'+username+'"';
		if (! this.realm){
			this.realm = username+"@"+this.url.host ;
		}

		var res ={
			nonce:'"'+this.nonce+'"',
			realm:'"'+this.realm+'"',
			response:null
		}

		this["digest-uri"] = this.protocol+"/"+this.host;
		//this["digest-uri"] = '"'+this.protocol+"/"+this.uri+'"';

		res["digest-uri"] = '"'+this["digest-uri"]+'"';

		/*if (this.charset){
			res["charset"]=this.charset;
		}*/

		if (this.qop){
			this.cnonce = BASE64( Math.floor( (Math.random()*100000000)) .toString() ) ;
			res["cnonce"]='"'+this.cnonce+'"';
			res["qop"]=this.qop;
		}
		if (this.opaque){
			res["opaque"]=this.opaque;
		}

		this.nc = "00000001";
		res["nc"]=this.nc;

		this.A1 = generateA1(username, this.realm, password/*, this.nonce, this.cnonce*/);	
		this.A2 = generateA2(this.method, this["digest-uri"], this.entity_body, this.qop);


		res.response = responseDigest(this.A1, this.nonce, this.nc, this.cnonce, this.qop, this.A2);	
		// generate Authorization 

		for (var ele in res){
			line+=","+ele+"="+res[ele];
		}
		//console.log(line)
		var toSend = BASE64(line);
		return toSend
				
	};


	stage.io.authentication["Digest"] = digestMd5 ;
	

	return digestMd5

})

/***** NODEFONY  CONCAT : sasl.js  *******/
/*
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
stage.provide("sasl");


stage.require("io");
stage.require("digest-md5");


stage.register.call(stage.io.authentication, "SASL",function(){

	

	var reg =/^([^=]+)=(.+)$/;
	var parserSasl = function(str){
		//console.log(str)
		var ret = str.replace(/"/g,"");
		var head = ret.split(",");
		var obj = {}
		for (var i= 0 ; i < head.length ; i++){
			var res = reg.exec(head[i])
			if (res && res[1])
				obj[res[1]] = res[2]
		}	
		return obj;
	};


	var Sasl = function(url , method, headers, body){
		this.method = method;
		this.url = url;
		this.headers = parserSasl(headers);
		this.body = body ;
		this.mechanisms = this.headers.mechanisms;
		var mechanism = this.getBestMechanism(this.mechanisms);
		if (mechanism){
			delete this.headers.mechanisms
			this.bestMechanism = mechanism.name
			this.mechanism = new mechanism.Class(this.url, this.method, this.headers, this.body);	
		}else{
			throw new Error("SALS mechanism not found")	
		}
	}
	
	Sasl.prototype.name= "sasl";


	Sasl.prototype.getBestMechanism = function(mechanism){
		var goodM = null;
		switch (typeof mechanism){
			case "object" :
				for (var i= 0 ; i < mechanism.length ; i++){
					if (mechanism[i] in stage.io.authentication.mechanisms){
						var goodM = stage.io.authentication.mechanisms[mechanism[i]];
						var name = mechanism[i];
						break;
					}
				}
			break;
			case "string" :
				//console.log(mechanism.split(" "));
				return this.getBestMechanism( mechanism.split(" ") );
			break;
			default:
				throw new Error("FORMAT SALS mechanism bad format")
		
		}
		return {
			name:name,
			Class:goodM
		}
	};

	Sasl.prototype.getAuthorization = function(user, password){
		return  'SASL mechanism="'+this.bestMechanism+'",'+this.mechanism.generateAuthorization(user, password);
	}


	
	return Sasl

})

/***** NODEFONY  CONCAT : socket.js  *******/
/*
 *
 *
 *
 *
 *
 */

stage.provide("socket");

stage.register.call(stage.io, "socket", function(){


	var defaultSettings = {
		type:"websocket", //   websocket | poll | longPoll 
	}


	var bestTransport = function(){
	
	}; 



	var socket = function(url, localSettings){

		this.settings = stage.extend({}, defaultSettings, localSettings);
		this.$super.constructor(this.settings, this);	

		switch (this.settings.type){
			case "websocket":
				this.socket = stage.io.transports.websocket ; 
			break;
			case "poll":
				this.socket = stage.io.transports.ajax ;
			break;
			case "longPoll":
				this.socket = stage.io.transports.ajax ;
			break;
		}

		this.listen(this, "onConnect");
		this.listen(this, "onClose");
		this.listen(this, "onError");
		this.listen(this, "onMessage");
		this.listen(this, "onTimeout");

	}.herite(stage.notificationsCenter.notification);


	socket.prototype.write = function(settings){
		this.transport.send();
	};

	socket.prototype.close = function(settings){
		this.transport.close();
	};

	socket.prototype.connect = function(url, settings){

		this.transport = new this.socket(url, settings);
		this.transport.onmessage = this.listen(this, "onMessage");
		
	};


	socket.prototype.destroy = function(settings){
		this.transport = null ;
		this.clearNotifications();
	}



	return socket ;


});

/***** NODEFONY  CONCAT : bayeux.js  *******/
/*
 *
 *	CLIENT
 *
 */

stage.register.call(stage.io.protocols, "bayeux",function(){

	var clientsCapabilities = function(){
		var tab = [];
		var websocket = stage.io.nativeWebSocket ? tab.push("websocket") : null ;
		var poll = stage.io.poll ? tab.push("poll") : null ;
		var longPoll = stage.io.longPoll ?  tab.push("long-polling") : null ; 
		var jsonp = stage.io.jsonp ?  tab.push("callback-polling") : null ; 
		return tab ;
	}();

	var onHandshakeResponse = function(message){
		if ( message.successful ){
			try {
				var socket  = this.getBestConnection(message.supportedConnectionTypes);
				this.socket = new socket.Class( socket.url );
				this.socket.onmessage = function(message){
					if (message.data )
						this.onMessage(message.data);
				}.bind(this); 
				this.socket.onopen = function(){
					this.socket.send( this.connect(message) );	
					this.notificationCenter.fire("onHandshake", message, this.socket);
				}.bind(this);
				this.socket.onerror = this.notificationCenter.listen(this, "onError");
				this.socket.onclose = function(err){
					delete this.socket ;
					this.notificationCenter.fire("onClose",err );
				}.bind(this)
			}catch(e){
				throw new Error (e)
			}
		}else{
			onError.call(this, message);
		}	
	};

	var reconnect  = function(){
		this.reconnect = true;
		this.notificationCenter.fire("reConnect", this);	
	};

	var onConnectResponse = function(message){
		if ( message.successful ){
			this.connected = true;	
			this.idconnection = message.clientId ;
			if ( message.advice ){
				for (var ele in message.advice ){
					switch(ele){
						case "reconnect" :
							if (message.advice[ele] === "retry" ){
								if ( ! this.reconnect ){
									this.notificationCenter.listen(this,"onClose", reconnect);
								}
							}
						break;
					}
				}
			}
			this.notificationCenter.fire("onConnect", message);
		}else{
			this.connected = false;	
			onError.call(this, message);
		}
	};

	var onDisconnectResponse = function(message){
		if ( message.successful ){
			if (this.socket){
				this.socket.close();
				this.socket = null ;
				this.notificationCenter.fire("onDisconnect", message)
			}
		}else{
			onError.call(this, message);
		}
	};

	var onSubscribeResponse = function(message){
		if ( message.successful ){
			this.notificationCenter.fire("onSubscribe", message);
		}else{
			onError.call(this, message);
		}
	};

	var onUnsubscribeResponse = function(message){
		if ( message.successful ){
			this.notificationCenter.fire("onUnsubscribe", message);
		}else{
			onError.call(this, message);
		}
	};

	var onError = function(message){
		if (message.error){
			try{ 
				switch (stage.typeOf(message.error)) {
					case "string":
						var res = message.error.split(":");
						var code = res[0];
						var arg = res[1];
						var mess = res[2];
					break;
					case "object":
						if (message.error){
							return arguments.callee.call(this, message.error)
						}
					break;
					case "Error":
						message.error = "500::"+message.error.message;
						return arguments.callee.call(this, message.error)
					break;
					default:
						throw new Error("Bad protocole error BAYEUX");
					
				}
				this.notificationCenter.fire("onError", code, arg, mess);
			}catch(e){
				throw new Error("Bad protocole error BAYEUX"+ e);
			}
		}
	};

	/*
 	 *	BAYEUX PROTOCOL
 	 *
 	 */
	var bayeux = function(url){
		this.name = "bayeux" ;	
		this.notificationCenter = stage.notificationsCenter.create(this.settings, this);
		this.url = url ; 
		this.socket = null;
		this.connected = false;
		this.request = {
			version:"1.0"
		}
	};

	bayeux.prototype.getBestConnection = function(supportedConnectionTypes){
		if (this.url.protocol === "https:" || this.url.protocol === "wss:")
			this.url.protocol = "wss:";
		else
			this.url.protocol = "ws:";
		this.socketType = "WEBSOCKET";
		return {
			Class: window.WebSocket,
			url:this.url.protocol+"//"+this.url.host+this.url.requestUri
		}	
	};

	bayeux.prototype.build = function(obj){
		var res = [];
		res.push(obj)
		return res ;
	};

	bayeux.prototype.handshake = function(){
		var req = JSON.stringify( stage.extend({}, this.request , {
			channel : "/meta/handshake",
			minimumVersion: "1.0",
			supportedConnectionTypes:clientsCapabilities
		}));
		return this.send(req);	
	};

	bayeux.prototype.connect = function(message){
		return JSON.stringify({
			channel: "/meta/connect",
			clientId: message.clientId,
			connectionType: this.socketType
		})
	};

	bayeux.prototype.stopReConnect = function(message){
		this.notificationCenter.unListen("onClose", reconnect);
	};


	bayeux.prototype.disconnect =function(){
		return JSON.stringify({
			channel: "/meta/disconnect",
			clientId: this.idconnection,
		});	
	};

	bayeux.prototype.subscribe = function(name, data){
		return JSON.stringify({
			channel: "/meta/subscribe",
			clientId: this.idconnection,
			subscription: "/service/"+name,
			data:data
		});
	};

	bayeux.prototype.unSubscribe = function(name, clientId, data){
		return JSON.stringify({
			channel: "/meta/unsubscribe",
			clientId: clientId,
			subscription: "/service/"+name,
			data:data
		});
	};

	bayeux.prototype.sendMessage = function(service, data, clientId){
		return JSON.stringify({
			channel: "/service/"+service,
			clientId: clientId,
			id: new Date().getTime(),
			data:data
		});	
	};

	bayeux.prototype.onMessage = function(message){
		//console.log(message)
		try {
			if (typeof message === "string" ){
				message = JSON.parse(message);
			}
		}catch (e){
			message.error = e ;
			onError.call(this, message);
			return ;
		}
		switch (message.channel){
			case "/meta/handshake":
				return onHandshakeResponse.call(this, message);
			break;
			case "/meta/connect":
				return onConnectResponse.call(this, message);
			break;
			case "/meta/disconnect":
				return onDisconnectResponse.call(this, message);
			break;
			case "/meta/subscribe":
				return onSubscribeResponse.call(this, message);
			break;
			case "/meta/unsubscribe":
				return onUnsubscribeResponse.call(this, message);
			break;
			default:
				// /some/channel
				this.notificationCenter.fire("onMessage", message);
		}
	};

	bayeux.prototype.send = function(data){
		if ( this.socket ){
			return this.socket.send(data);	
		}
		return $.ajax({
            		method: 'POST',
		        cache:false,
            		url: this.url.href ,
		        dataType:"json",
		        contentType:"application/json",
		        data : data,		        
			success:function(data, type, xhr){
				this.onMessage(data);			
			}.bind(this),
            		error: function(obj, type, message) {
				this.notificationCenter.fire('onError', obj, type, message);
            		}.bind(this)
        	});
	};

	return bayeux ;
});


/***** NODEFONY  CONCAT : realtime.js  *******/
/*
 *
 *
 *
 *
 *
 *
 */
stage.register("realtime",function(){



	var defaultSettings = {
	
	};

	var settingsSyslog = {
		moduleName:"REALTIME",
		defaultSeverity:"INFO"
	};

	var realtime = function(urlServer, settings){
		if (! urlServer)
			throw new Error("realtime url server is not defined")
		this.settings = stage.extend({}, defaultSettings, settings); 
		this.notificationCenter = stage.notificationsCenter.create(this.settings, this);
		this.syslog =  new stage.syslog(settingsSyslog);
		this.url = stage.io.urlToOject(urlServer) ;
		//this.crossDomain =  ! stage.io.isSameOrigin(this.url.href);	
		this.protocol = new stage.io.protocols.bayeux(this.url); 
		this.services = null;
		this.subscribedService = {};
		this.nbSubscribed = 0 ;
		this.connected = false ;
		this.publicAddress = null;
		this.domain = null;

		/*
 		 *	EVENT REALTIME
 		 */
		this.notificationCenter.listen(this, "onAuthorized", function(){
			this.protocol.handshake(this.url.href)
		});

		/*
 		 *	EVENTS PROTOCOL BAYEUX
 		 */
		this.protocol.notificationCenter.listen(this, "onMessage", this.onMessage);
		this.protocol.notificationCenter.listen(this, "onHandshake", function(message, socket){
			if (message.ext && message.ext.address){
				var addr = JSON.parse(message.ext.address);
				this.publicAddress = addr.remoteAddress ;
				this.domain = addr.host;
			}
			this.notificationCenter.fire("onHandshake", message, socket, this)	
		});
		this.protocol.notificationCenter.listen(this, "onConnect", function(message){
			this.services = message.data;
			this.connected = true ;
			if (message.ext && message.ext.address){
				var addr = JSON.parse(message.ext.address);
				this.publicAddress = addr.remoteAddress ;
				this.domain = addr.host;
			}
			this.notificationCenter.fire("onConnect", message, this)
		}); 
		this.protocol.notificationCenter.listen(this, "onDisconnect", function(message){
			this.services = message.data;
			this.connected = false ;
			this.notificationCenter.fire("onDisconnect", message, this)
		});
		this.protocol.notificationCenter.listen(this, "reConnect", function(bayeux){
			setTimeout(function(){
				this.start();
			}.bind(this), 60000)
		});
		this.protocol.notificationCenter.listen(this, "onSubscribe", function(message){
			var service = message.subscription.split("/")[2];
			this.subscribedService[service] = message ;
			this.nbSubscribed ++ ;
			this.notificationCenter.fire("onSubscribe", service, message, this)
		}); 
		this.protocol.notificationCenter.listen(this, "onUnsubscribe", function(message){
			var service = message.subscription.split("/")[2];
			delete this.subscribedService[service];
			this.nbSubscribed -- ;
			this.notificationCenter.fire("onUnSubscribe", service, message, this)
		});
		this.protocol.notificationCenter.listen(this, "onError", function(code, arg, message){
			this.notificationCenter.fire("onError", code, arg, message);
		}); 
		this.protocol.notificationCenter.listen(this, "onClose", function(message){
			this.connected = false ;
			this.notificationCenter.fire("onClose", message);
			for(var service in this.subscribedService ){
				//this.unSubscribe(service);
				delete this.subscribedService[service];
			}
		});

		//this.start();	
	};

	realtime.prototype.listen = function(){
		return 	this.notificationCenter.listen.apply(this.notificationCenter, arguments);
	};

	realtime.prototype.unListen = function(){
		return 	this.notificationCenter.unListen.apply(this.notificationCenter, arguments);
	};


	realtime.prototype.start = function(){
		if ( this.connected ){
			//throw new Error("connection already started");
			this.notificationCenter.fire("onError", 500, this, "connection already started");
			return false;
		}
		var statusCode  = {
			
                	401: function(request, type, message) {
				var auth = request.getResponseHeader("WWW-Authenticate");
				var res = request.responseText;
				var obj =  {
					"WWW-Authenticate":request.getResponseHeader("WWW-Authenticate"),
					body:request.responseText
				}
				this.authenticate = new stage.io.authentication.authenticate(this.url, obj, {
					ajax:true,
					onSuccess:function(data, type, xhr){
						this.notificationCenter.fire('onAuthorized',data, type, xhr);
					}.bind(this),
					onError:function(obj, type, message){
						var res = stage.io.getHeaderJSON(obj);
						if (res){
							this.notificationCenter.fire('onError',401, obj, res)	
						}else{
							this.notificationCenter.fire('onError',401, obj, message)
						}
					}.bind(this)
				});
				this.notificationCenter.fire('onUnauthorized', this.authenticate , this);
                	}.bind(this),
			404:function(obj, type, message){
				// '404 - realtimeD server not available'
				this.notificationCenter.fire('onError',404, obj, message );	
			}.bind(this),
                	503: function(obj, type, message) {
				//  '503 - Service Unavailable'
			    	this.notificationCenter.fire('onError',503, obj, message);
                	}.bind(this)   
            	};

		return $.ajax({
            		method: 'GET',
		        cache:false,
            		url: this.url.href ,
            		statusCode:statusCode,
		        success:function(data, type, xhr){
				this.notificationCenter.fire('onAuthorized',data, type, xhr);
			}.bind(this),
            		error: function(obj, type, message) {
				if (obj.status in statusCode )
					return ;
				this.notificationCenter.fire('onError', obj.status, obj, message);
            		}.bind(this)
        	});
	};


	realtime.prototype.subscribe = function(name, data){
		if ( ! this.connected ){
			this.notificationCenter.fire('onError', 500, this, "Not connected");
			return false;
		}
		if ( name in this.services ){
			if (name in this.subscribedService ){
				this.notificationCenter.fire('onError', 500, this, "already subscribed");
				return false;
			}
			return send.call(this,  this.protocol.subscribe(name, data) ) ;	
		}	
		this.notificationCenter.fire('onError', 500, this, "service : "+ name + " not exist");	
		return false ;
	};

	realtime.prototype.unSubscribe = function(name, data){
		if ( ! this.connected ){
			this.notificationCenter.fire('onError', 500, this, "Not connected");	
			return false;
		}
		if ( name in this.services ){
			
			if (  name in this.subscribedService ){
				var clientId = this.subscribedService[name].clientId;
				return send.call(this,  this.protocol.unSubscribe(name, clientId, data) ) ;	
			}else{
				this.notificationCenter.fire('onError', 500, this, "service : "+ name + " not subcribed");	
				return false;
			}
		}
		this.notificationCenter.fire('onError', 404, this, "service : "+ name + " not exist");	
		return false;
	};

	var send = function(data){
		this.protocol.send(data)	
	};


	realtime.prototype.sendMessage = function(service , data){
		if ( ! this.connected ){
			this.notificationCenter.fire('onError', 500, this, "Not connected");	
			return false;
		}
		if ( service in this.services ){
			if (service in this.subscribedService ){
				var clientId = this.subscribedService[service].clientId;
				try {
					var proto = this.protocol.sendMessage(service, data, clientId) ;
					send.call(this,  proto );
					return JSON.parse(proto).id	
				}catch(e){
					this.fire("onError",500, e, e.message);
				}
			}else{
				this.notificationCenter.fire('onError', 500, this, "service : "+ service + " not subcribed");	
				return false;
			}
		}else{
			this.fire("onError",404, this, "service :"+service + " not exit");
		}
		return false;
	};


	realtime.prototype.stop = function(){
		if (  this.connected ){
			this.protocol.stopReConnect();
			for(var service in this.subscribedService ){
				//this.unSubscribe(service);
				delete this.subscribedService[service];
			}
			
			return send.call(this, this.protocol.disconnect() );
		}
		throw new Error("connection already stoped");
	};

	realtime.prototype.onMessage = function(message){
		if (message.error){
			if (message.channel)
				this.notificationCenter.fire("onError", message.error);
			else
				this.notificationCenter.fire("onError",message.id, message.successful );		
		}else{
			if (message.channel)
				this.notificationCenter.fire("onMessage", message.channel.split("/")[2], message.data);
			else
				this.notificationCenter.fire("onMessage",message.id, message.successful);
	
		}
	};



	return realtime ;

});

/***** NODEFONY  CONCAT : autoload.js  *******/
/*
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

stage.register("autoload", function(){

	var genarateId = function(){
		return new Date().getTime();
	};


	var loader = function(){
		
		var AJAX = {
			css : {
				mineType :	"text/css",
				tag:		"style",
				media:		"screen",
				type:		"stylesheet",
				position:	"HEAD"
			},
			js:{
				mineType :	"text/javascript",
				tag:		"script",
				position:	"BODY"
			}
		};

		var SCRIPT = {
			css : {
				mineType :	"text/css",
				tag:		"link",
				media:		"screen",
				type:		"stylesheet",
				position:	"HEAD"
			},
			js:{
				mineType :	"text/javascript",
				tag:		"script",
				position:	"BODY"
			}
		};

		var insert = function(position, script){
			switch(position){
				case "HEAD" :
					var head = document.getElementsByTagName('head')[0];
					head.appendChild(script);
				break;
				case "BODY" :
					var body = document.getElementsByTagName('body')[0]
					body.appendChild(script);
				break;
			}
		};


		return function(src, tag , id, transport, callback){
			//if (tag == "js") transport = "ajax";
			//if (tag == "css") transport = "ajax";
			switch (tag){
				case "js":
					/*var def = AJAX[tag];
					var script = document.createElement(def.tag);
					script.setAttribute('type', def.mineType);
					script.setAttribute('id', id + '_'+tag);
					if ( tag === "css" ){
						script.setAttribute('media', def.media);
					}
					$.ajax(src, {
						async:false,
						//cache:true,
						dataType:"text",
						success:function(data, status, xhr){
							this.cache[id] = script ;
							insert(def.position, script);
							$(script).text(data);
							this.logger("LOAD FILE :" + src,"DEBUG");
							callback(null, xhr);
						}.bind(this),
						error:function(xhr, status, message){
							this.logger(src+" :" +message,"ERROR");
							callback(message, xhr);
						}.bind(this)
					});*/
					 
					return $.ajax({
						url: src,
					        async:false,
						dataType: "script",
						success: function(data, status, xhr){
							//this.logger("LOAD FILE :" + src,"DEBUG");
							callback(null, xhr);	
						}.bind(this),
						error:function(xhr, status, message){
							this.logger(src+" :" +message,"ERROR");
							callback(message, xhr);
						}.bind(this)
					});
					



				break;
				case "css":
					var def = SCRIPT[tag];
					var script = document.createElement(def.tag);
					script.setAttribute('type', def.mineType);
					script.setAttribute('id', id + '_'+tag);
					if ( tag === "css" ){
						script.setAttribute('media', def.media);
						script.href = src;/*+ '?time=' + id;*/
						script.rel = def.type;
						script.async = false;
					}
					if (tag === "js"){
						script.src = src;/*+ '?time=' + id;*/
						script.async = false;
					}
					script.onload = function(){
						this.cache[id] = script;
						this.logger("LOAD FILE :" + src,"DEBUG");
						callback(null, script);
					}.bind(this);
					script.onerror = function(error){
						this.logger(src ,"ERROR");
						callback(error, script);
					}.bind(this);
					insert(def.position, script);
				break;
				default:
					this.logger( new Error ("autoload  type transport error "), "ERROR" );
					return null;
			}
			return script ;
		}
	}();
	

	var defaultSetting = {
		transport:"script",
		prefix:null
	};

	var autoload = function(kernel, settings){
		this.settings = jQuery.extend({}, defaultSetting, settings)
		this.cache = {};
		this.prefix = this.settings.prefix  ;
		this.syslog = kernel.syslog || null ;
		this.transport = this.settings.transport ;
	};

	var regType = /(.*)\.(js)$|(.*)\.(css)$/;
	autoload.prototype.load = function(file, callback){
		var id = genarateId();
		var res = regType.exec(file);
		if ( ! res) {
			this.logger("autoload error type file  ","ERROR")
			return null;
		}
		var script = loader.call(this, file, res[2] || res[4] , id, this.transport, callback)
		return id 
	};

	autoload.prototype.logger = function(pci, severity, msgid,  msg){
		if (this.syslog){
			if (! msgid) msgid = "AUTOLOADER  ";
			return this.syslog.logger(pci, severity , msgid,  msg);
		}else{
			console.log(pci);
		}
	};

	autoload.prototype.unLoad = function(id, callback){
		if (id in this.cache){
			var tag = this.cache[id]
			tag.parentNode.removeChild(tag);
			delete tag;
			delete 	this.cache[id] ;	
			return callback(id);
		}else{
			this.logger("Autoload unLoad no tag find :" +id ,"ERROR")
		}
	};

	return autoload ; 

});

/***** NODEFONY  CONCAT : kernel.js  *******/
/*
 *
 *
 *
 *	KERNEL stage JS
 *
 *
 *
 */

stage.register("kernel",function(){

	var settingsSyslog = {
		//rateLimit:100,
		//burstLimit:10,
		moduleName:"KERNEL",
		defaultSeverity:"INFO"
	};

	var defaultSettings = {
		debug:false,
		location:{
			html5Mode:false,
			hashPrefix:"/"
		}
	};

	var Kernel = function(environment, settings){
		this.container = null; 
		this.modules = {};
		this.settings = stage.extend(true, {}, defaultSettings , settings );
		this.environment = environment;
		this.debug = this.settings.debug ;
		this.booted = false;
		this.container = new stage.Container();
		this.container.set("kernel", this);
		this.isDomReady = false;
		this.uiContainer = null;

		// syslog
		this.syslog = this.initializeLog(settingsSyslog);
		this.container.set("syslog", this.syslog);

		// autoloader
		this.autoloader = new stage.autoload(this, {
			transport:"script"
		});
		this.container.set("autoloader", this.autoloader);

		// notificationsCenter
		this.notificationsCenter =  stage.notificationsCenter.create();
		this.container.set("notificationsCenter", this.notificationsCenter);
		
		// location
		this.initLocation();

		// Router
		this.initRouter();

		// template
		this.initTwig();

		// translation i18n
		this.initTranslation();

		// Service REST
		this.initRest()

		// EVENT NATIF
		$(document).ready(this.listen(this, "onDomReady", this.domReady));
		$(window).resize(this.listen(this,"onResize"));
		$(window).unload(this.listen(this,"onUnLoad"));	
		$(window).load(this.listen(this,"onLoad"));	

		//BOOT	
		this.listen(this, "onBoot" , this.boot)
		//READY
		this.listen(this, "onReady" , this.ready)

		this.notificationsCenter.settingsToListen(this.settings, this);
	};


	Kernel.prototype.set = function(name, value){
		return this.container.set(name, value);	
	};

	Kernel.prototype.get = function(name, value){
		return this.container.get(name, value);	
	};
		
	Kernel.prototype.setParameters =function(name, value){
		return this.container.setParameters(name, value);	
	};

	Kernel.prototype.getParameters = function(name){
		return this.container.getParameters(name);	
	};

	Kernel.prototype.initRouter = function(){
		this.router = new stage.router(this, this.container);
		this.container.set("router", this.router);
	};


	Kernel.prototype.initLocation = function(){
		this.locationService = new stage.location(this, this.settings.location) ;
		this.container.set("location", this.locationService);
	};


	Kernel.prototype.initRest = function(){
		if (stage.Rest) {
			this.restService = new stage.Rest(this.container);
			this.set("rest", this.restService);
		}
	};

	Kernel.prototype.initTranslation = function(){
		if ( ! stage.i18n ){
 		       	this.logger("you must load transation i18n services js file !!!!!", "ERROR")
			return
		}
		this.i18n = new stage.i18n(this, this.container);

		this.container.set("i18n", this.i18n);
	};

	/*
 	 *	OVERRIDE TWIG IMPORT TEMPLATE
 	 */
	var loadRemoteTwig = function(Twig, location, params, callback, error_callback){
		var id  = params.id,
		method      = params.method,
		async       = params.async,
		precompiled = params.precompiled,
		template    = null;

		// Default to async
		if (async === undefined) async = true;

		// Default to the URL so the template is cached.
		if (id === undefined) {
			id = location;
		}
		params.id = id;

		// Check for existing template
		if (Twig.cache && Twig.Templates.registry.hasOwnProperty(id)) {
			// A template is already saved with the given id.
			if (callback) {
				callback(Twig.Templates.registry[id]);
			}
			return Twig.Templates.registry[id];
		}
		//console.log(params.async)
		$.ajax({
			url:location,
			async:async,
			success:function(mydata, status, xhr){
				var moduleName = this.getModuleName( location )
			        if (precompiled === true) {
					mydata = JSON.parse(mydata);
				}
				params.url = location;
				params.data = mydata;
				template = new Twig.Template(params);
				if (this.modules[moduleName]){
					var module = this.modules[moduleName] ;
					var name = module.getTemplateName(location)
					module.registerTemplate(name, template, "template")
				}
				if (callback) {
					callback(template);
				}
			}.bind(this),
			error: function(xrh, status, message){
				error_callback(xrh, status, message)
			}.bind(this)
		})
		if (async === false) {
			return template;
		} else {
			// placeholder for now, should eventually return a deferred object.
			return true;
		}	
	};
	
	Kernel.prototype.initTwig = function(){
		this.logger("INITIALIZE TWIG SERVICE", "DEBUG");
		if (this.environment === "dev"){
			window.Twig.cache = false ;	
		}
		this.templateEngine = twig ; 
		//extended log error traf
		window.Twig.extend(function(Twig){
			Twig.log.error = function(message){
				this.logger(message, "ERROR");
			}.bind(this)
		}.bind(this));

		window.Twig.extend(function(Twig){
			Twig.Templates.loadRemote = loadRemoteTwig.bind(this, Twig) 
		}.bind(this));

		//extended FUNCTION
		window.Twig.extendFunction("controller", function() {
			var pattern = Array.prototype.shift.call(arguments);
			var sp = pattern.split(":");
			var module = this.getModule(sp[0]);
			if (module){
				var controller = module.getController(sp[1]);
				if (controller){
					var action = sp[2];
					if ( controller[action] ){
						return controller[action].apply(controller, arguments);	
					}
				}
			}
		}.bind(this));
		this.container.set("twig", this.templateEngine);
		return this.templateEngine ;

	};

	Kernel.prototype.domReady = function(){
		if ( ! this.booted ) return ; 
		this.logger("domReady", "DEBUG");
		this.fire("onDomLoad", this);
		var element = this.uiContainer ? $(this.uiContainer) : $("body");
		try {
			if ( this.modules["app"] ){
				this.modules["app"].initialize(element);	
			}		
			for (var module in this.modules){
				if (module === "app") continue;
				this.modules[module].initialize(element);
			}	
			this.fire("onReady", this);
			this.isDomReady = true;
		}catch(e){
			this.logger(e,"ERROR");
		}
	};

	
	Kernel.prototype.listen = function(){
		return this.notificationsCenter.listen.apply(this.notificationsCenter, arguments);
	}

	Kernel.prototype.fire = function(event){
		this.logger("EVENT : " + event,"DEBUG");
		return this.notificationsCenter.fire.apply(this.notificationsCenter, arguments);
	};

	Kernel.prototype.getModule = function(name){
		return this.modules[name] ;
	};
	
	Kernel.prototype.logger = function(pci, severity, msgid,  msg){
		if (! msgid) msgid = "KERNEL "
		return this.syslog.logger(pci, severity, msgid,  msg);
	};

	Kernel.prototype.initializeLog = function(settings){
		
		var syslog =  new stage.syslog(settings);
		if (this.environment === "dev"){
		// CRITIC ERROR
			syslog.listenWithConditions(this,{
				severity:{
					data:"CRITIC,ERROR"
				}		
			},function(pdu){
					console.log(pdu.payload)
				if (pdu.payload.stack ){
						console.error( "SYSLOG " + pdu.severityName +" " + pdu.msgid + " "+new Date(pdu.timeStamp) + " " + pdu.msg+" : "+  pdu.payload.stack);
				}else{
					console.error( "SYSLOG " + pdu.severityName +" " + pdu.msgid + " "+new Date(pdu.timeStamp) + " " + pdu.msg+" : "+  pdu.payload);	
				}
				/*if (pdu.typePayload === "Error" ){
					if (pdu.payload.stack ){
						console.error( "SYSLOG " + pdu.severityName +" " + pdu.msgid + " "+new Date(pdu.timeStamp) + " " + pdu.msg+" : "+  pdu.payload.stack);
					}
					return;
				}
				console.error( "SYSLOG " + pdu.severityName +" " + pdu.msgid + " "+new Date(pdu.timeStamp) + " " + pdu.msg+" : "+  pdu.payload);*/	
			});
			// INFO DEBUG
			var data ;
			this.debug ? data = "INFO,DEBUG" : data = "INFO" ;
			syslog.listenWithConditions(this,{
				severity:{
					data:data
				}		
			},function(pdu){
				console.info( "SYSLOG " + pdu.severityName +" " + pdu.msgid + " "+new Date(pdu.timeStamp) + " " + pdu.msg+" : "+ pdu.payload);
			});
			syslog.listenWithConditions(this,{
				severity:{
					data:"WARNING"
				}		
			},function(pdu){
				console.warn( "SYSLOG " + pdu.severityName +" " + pdu.msgid + " "+new Date(pdu.timeStamp) + " " + pdu.msg+" : "+ pdu.payload);
			});
		}
		return syslog;
	};

	Kernel.prototype.boot = function(){
		this.booted = true;
	};

	Kernel.prototype.ready = function(){
		//this.fire("onUrlChange", this.router.url() )
	};

	Kernel.prototype.loadModule = function(url, settings){
		var res = stage.io.urlToOject(url);
		var moduleName = res.basename ;
				
		return $.ajax(url,stage.extend( {
			cache:false,
			method:"GET",
			//async:false,
			dataType:"xml",
			success:function(data, status, xhr){
				try {
					//FIXME try to parse with url
					var res = stage.xml.parseXml(data);
					var moduleName = res.module["@id"];
					var type = res.module["@type"];
					var moduleSrc = res.module["@src"];
				 
					switch ( type ){
						case "application/javascript" :
							if ( moduleSrc ){
								if (moduleName in this.modules) {
									this.modules[moduleName].initialize();
									this.modules[moduleName].fire("onInitialize", moduleName);	
									this.fire("onInitializeModule", moduleName);	
								} else {							
									this.autoloader.load(moduleSrc, function(error, transport){
										if (error){
											this.fire("onError", error);
											throw error;
										}
										this.registerModule(moduleName, res);
										if (moduleName === "app")
											this.fire("onBoot", this);
									}.bind(this));
								}
							}
						break;
					}
				}catch(e){
					this.logger(e, "ERROR");
					this.fire("onError", e);
					throw e ;
				}
			}.bind(this),
			error:function(xhr, status, message){
				this.fire("onGetConfigError", moduleName);
				this.fire("onError", message);	
			}.bind(this)
		}, settings))
	};

	Kernel.prototype.registerModule = function(name, xml){
		if (name in stage.modules){
			var kernelcontext = this;
			var Class = stage.modules[name].herite(stage.Module);
			this.container.addScope(name);
			Class.prototype.name = name;
			try {
				if (this.isDomReady){
						this.modules[name] = new Class(this, xml,{
							onReady:function(){
								if (this.initialize){
									try {
										this.initialize();
										this.fire("onInitialize", name);	
										kernelcontext.fire("onInitializeModule", name);
									}catch(e){
										this.logger("INITIALIZE MODULE : "+name +" "+e, "ERRROR");
										throw e;
									}
										
								}
							}});	
					
					
				}else{
					this.modules[name] = new Class(this, xml);
				}
				this.container.set(name, this.modules[name]);
			}catch(e){
				this.logger("INSTANCE MODULE : "+name +" "+e, "ERRROR")
				throw e;
			}
		}
	};

	Kernel.prototype.getModuleName = function(url){
		var module = stage.dirname(url);
		var tab = module.split("/")
		return tab[tab.indexOf("Resources")-1];
	};

	return  Kernel;
});

/***** NODEFONY  CONCAT : appKernel.js  *******/
/*
 *
 *
 *
 *
 */
stage.register("appKernel",function(){

	var appKernel = function(url, environnement, settings){

		var kernel = this.$super ;
		kernel.constructor(environnement, settings);
		if ( url ){
			this.loadModule(url,{
				async:false
			});
		}else{
			this.fire("onBoot", this);
		}
			
	}.herite(stage.kernel);

	return appKernel;
});


/***** NODEFONY  CONCAT : container.js  *******/
/*
 *
 *
 *
 *
 *
 */

stage.register("Container", function(){


	



	/*
 	 *
 	 *	CONTAINER CLASS
 	 *
 	 */
	var ISDefined = function(ele){
		if (ele !== null && ele !== undefined )
			return true
		return false;
	}

	var parseParameterString = function(str, value){
		switch( stage.typeOf(str) ){
			case "string" :
				return arguments.callee.call(this,str.split(".") , value);
			break;
			case "array" :
				switch(str.length){
					case 1 :
						var ns = Array.prototype.shift.call(str);
						if ( ! this[ns] ){
							this[ns] = value;
						}else{
							if ( ISDefined(value) ){
								this[ns] = value;
							}else{
								return this[ns];
							}
						}
						return value ;
					break;
					default :
						var ns = Array.prototype.shift.call(str);
						if ( ! this[ns] && ISDefined(value) ){
							this[ns] = {};
						}
						return arguments.callee.call(this[ns], str, value);	
				}
			break;
			default:
				return false;
		}
	};

	var Container = function(){
		this.protoService = function(){};
		this.protoParameters = function(){};
		this.scope = {};
		this.services = new this.protoService();
		this.parameters = new this.protoParameters();
	};
	

	Container.prototype.logger = function(pci, severity, msgid,  msg){
		var syslog = this.get("syslog");
		if (! msgid) msgid = "CONTAINER SERVICES ";
		return syslog.logger(pci, severity, msgid,  msg);
	};

	Container.prototype.set = function(name, object){
		return this.protoService.prototype[name] = object;
	};

	Container.prototype.get = function(name){
		if (name in this.services){
			return this.services[name];
		}
		return null;
		//this.logger("GET : " + name+" don't exist", "WARNING");	
	};

	Container.prototype.has = function(name){
		return this.services[name];
	};

	Container.prototype.addScope = function(name){
		return  this.scope[name] = [];
	}

	Container.prototype.enterScope = function(name){
		var sc = new Scope(name, this)
		var index = this.scope[name].push( sc );
		sc.index = index;
		return sc;
	}

	Container.prototype.leaveScope = function(scope){
    		var sc = this.scope[scope.name].splice(scope.index-1, 1);
    		//delete scope;
		return sc[0].parent;
	};


	Container.prototype.setParameters = function(name, str){
		if (typeof name !== "string"){
			this.logger(new Error("setParameters : container parameter name must be a string"));
			return false;
		}
		if ( ! ISDefined(str) ){
			this.logger(new Error("setParameters : "+name+" container parameter value must be define"));
			return false;
		}
		if ( parseParameterString.call(this.protoParameters.prototype, name, str) === str ){
			return str;
		}else{
			this.logger(new Error("container parameter "+ name+" parse error"));
			return false;
		}
	};

	Container.prototype.getParameters = function(name){
		if (typeof name !== "string"){
			this.logger(new Error("container parameter name must be a string"));
			return false;
		}
		//return parseParameterString.call(this.protoParameters.prototype, name, null);  
		return parseParameterString.call(this.parameters, name, null);  
	};



	/*
 	 *
 	 *	SCOPE CLASS
 	 *
 	 */

	var Scope = function(name, parent){
    		this.name = name;
		this.parent = parent;
    		this.mother = this.$super;
    		this.mother.constructor();
    		this.services = new parent.protoService();
    		this.parameters = new parent.protoParameters();
    		this.scope = parent.scope;
	}.herite(Container);

	Scope.prototype.set = function(name, obj){
    		this.services[name] = obj ;
    		return this.mother.set(name, obj);
	};

	Scope.prototype.setParameters = function(name, str){
		if ( parseParameterString.call(this.parameters, name, str) === str ){
			return this.mother.setParameters(name, str);
		}else{
			this.logger(new Error("container parameter "+ name+" parse error"));
			return false;
		}
	};

	Scope.prototype.leaveScope = function(name){
    		this.mother.leaveScope(this)
	};


	return Container;
});

/***** NODEFONY  CONCAT : routerService.js  *******/
stage.register("router",function(){
		
		

	var decode = function(str) {
		try {
			return decodeURIComponent(str);
		} catch(err) {
			return str;
		}
	};


	var Route = function(id, path, defaultParams){
		this.id = id ;
		this.path = path;
		this.template = null;	
		this.controller =null;
		this.defaults =  defaultParams;
		this.variables = [];
		this.pattern = this.compile();
	};

	Route.prototype.compile = function(){
		var pattern = this.path.replace(/(\/)?(\.)?\{([^}]+)\}(?:\(([^)]*)\))?(\?)?/g, function(match, slash, dot, key, capture, opt, offset) {
			var incl = (this.path[match.length+offset] || '/') === '/';
			this.variables.push(key);
			return (incl ? '(?:' : '')+(slash || '')+(incl ? '' : '(?:')+(dot || '')+'('+(capture || '[^/]+')+'))'+(opt || '');
		}.bind(this));
		pattern = pattern.replace(/([\/.])/g, '\\$1').replace(/\*/g, '(.+)');
		this.pattern = new RegExp('^'+pattern+'[\\/]?$', 'i');
		return this.pattern ;	
	};

	Route.prototype.match = function(url){
		var res = url.match(this.pattern);
		//console.log(res)
		if (!res) {
			return res;
		}
		var map = [];
		var tab = res.slice(1) ;
		for (var i = 0 ; i<tab.length; i++){
			var k = this.variables[i] || 'wildcard';
			var param = tab[i] && decode(tab[i]);
			//var index = map.push( map[k] ? [].concat(map[k]).concat(param) : param );
			var index = map.push( param )
			map[k] = map[index-1] ;

		}
		/*res.slice(1).forEach(function(param, i) {
			var k = this.variables[i] || 'wildcard';
			param = param && decode(param);
			//var index = map.push( map[k] ? [].concat(map[k]).concat(param) : param );
			var index = map.push( param )
			map[k] = map[index-1] ;
		}.bind(this));*/
		if ( map && map.wildcard) {
			map['*'] = map.wildcard;
		}
		return map;
	};


	var Resolver = function(container){
		this.container = container;
		this.resolve = false;
		this.kernel = this.container.get("kernel");
		this.defaultAction = null;
		this.defaultView = null;
		this.variables = new Array();
		this.router = this.container.get("router")
		this.browser = this.container.get("browser")
		//this.notificationsCenter = this.container.get("notificationsCenter") ;
	
	};

	Resolver.prototype.match = function(route, url){
		var match = route.match(url); 
		if ( match ){
			this.variables = match;
			this.url = url;
			this.route = route;
			this.parsePathernController(route.defaults.controller)
		}		
		return match;
	};


	var regModuleName = /^(.*)Module[\.js]{0,3}$/;
	Resolver.prototype.getModuleName = function(str){
		var ret = regModuleName.exec(str);
		if (ret)
			return  ret[1] ;
		else
			throw "BAD MODULE PATTERN ";
	};

	Resolver.prototype.getController = function(name){
		return this.module.controllers[name+"Controller"];
	};

	Resolver.prototype.getAction = function(name){
		var ele = name+"Action" ;
		if ( ele in this.controller ){
			return this.controller[ele]
		}
		return null;
	};

	Resolver.prototype.getDefaultView = function(controller, action){
		var res = this.module.name+"Module"+":"+controller+":"+action+".html.twig";
		return res ; 
	};


	Resolver.prototype.parsePathernController = function(pattern){
		if (typeof pattern !== "string"){
			throw new Error("Resolver : pattern : "+pattern +" MUST be a string");	
		}
		this.route = this.router.getRouteByPattern(pattern);
		var tab = pattern.split(":")
		try {
			this.module = this.kernel.getModule( this.getModuleName(tab[0]) );
		}catch(e){
			throw new Error("Resolver pattern error module :  " + pattern + " : " +e );
		}
		if ( this.module ){
			this.controller = this.getController(tab[1]);
			if ( this.controller ){
				if (tab[2]){
					this.action = this.getAction(tab[2]);
					if (! this.action ){
						throw new Error("Resolver :In CONTROLLER: "+ tab[1] +" ACTION  :"+tab[2] + " not exist");
					}
				}else{
					this.action = null;	
				}
			}else{
				throw new Error("Resolver :controller not exist :"+tab[1] );
			}
			this.defaultView = this.getDefaultView(tab[1], tab[2] );
			this.resolve = true;
		}else{
			//this.logger("Resolver : not exist :"+tab[0] , "ERROR")
			throw new Error("Resolver : module not exist :"+tab[0] );
		}
	};
	
	Resolver.prototype.callController = function(arg){
		try{
			var ret = this.action.apply(this.controller, arg || [])	
		}catch(e){
			this.controller.logger.call(this.controller, e, "ERROR");	
			throw e;
		}
		return ret;
	};



	/*
	 *	ROUTER
	 */

	var cacheState = function(){
		var cacheState = window.history.state === undefined ? null : window.history.state;	
		return cacheState ;
	}

	var nativeHistory = !!(window.history && window.history.pushState );

	var service = function(kernel, container){
		this.kernel = kernel ;
		this.container = container ;
		this.notificationsCenter = this.container.get("notificationsCenter");
		this.syslog = kernel.syslog ;	
		this.routes = {};
		this.routePattern = {};
		this.location = this.get("location");
		this.browser = this.get("browser");

		/*
 		 * Extend Twig js	
 		 */
		window.Twig.extendFunction("path", function(name, variables, host){
			try {
				if (host){
					return  this.generateUrl.apply(this, arguments);	
				}else{
					var generatedPath = this.generateUrl.apply(this, arguments);
					return generatedPath?"#"+generatedPath:"";
				}
			}catch(e){
				this.logger(e.error)
				throw e.error
			}
		}.bind(this));

		this.notificationsCenter.listen(this,"onUrlChange" , function(url, lastUrl, absUrl ,cache){
			try{
				var res = this.resolve(url);
				if(! res.resolve ){
					this.forward("appModule:app:404");
					return ;
				}
				var last = this.resolveRoute(lastUrl) 
				if (last){
					this.notificationsCenter.fire("onRouteChange",{id:res.route.id, route:res.route, args:res.variables} ,{id:last.route.id, route:last.route, args:last.variables});
				}
			}catch (e){
				this.logger(e, "ERROR");
			}
		});
	};

	service.prototype.createRoute = function(id, path, defaultParams){
		if (id in this.routes ){
			this.logger("CREATE ROUTE : "+ id + "Already exist ", "ERROR");	
		}
		var route  = new Route(id, path, defaultParams);
		this.routes[id] = route;
		this.routePattern[this.routes[id].defaults.controller] = {
			route:this.routes[id],
 		        path:path	
		}
		this.logger("CREATE ROUTE : "+ id, "DEBUG");
		return route ;
	};

	service.prototype.getRoute = function(name){
		if (this.routes[name])
			return this.routes[name];
		return null;
	};



	service.prototype.resolveRoute = function(url){
		var resolver = new Resolver(this.container);
		var res = [];
		for (var routes in this.routes){
			var route = this.routes[routes];
			try {
				res = resolver.match(route, url);
				if (res){
					return resolver ; 
				}
			}catch(e){
				continue ;
			}
		}
		return null;
	};
	
	var regSerch = /(.*)\?.*$/;
	service.prototype.resolve = function(url){
		//console.log("RESOLVE " +url)
		//console.log(regSerch.exec(url) );
		var test = regSerch.exec(url) ;
		if ( test )
			url = test[1] ;
		var resolver = new Resolver(this.container);
		var res = [];
		for (var routes in this.routes){
			var route = this.routes[routes];
			try {
				res = resolver.match(route, url);
				if (res){
					this.notificationsCenter.fire("onBeforeAction", url, resolver );
					var ret = resolver.callController( res)
					this.notificationsCenter.fire("onAfterAction", url, resolver, ret );
					break;
				}
			}catch(e){
				this.logger("RESOLVE URL : "+ url + " " + e,"ERROR")
				this.forward("appModule:app:500", [e]);
			}
		}
		return resolver;
	};

	service.prototype.getRouteByPattern = function(pattern, args){
		//console.log(pattern)
		//console.log(this.routePattern)
		if (pattern in this.routePattern){
			//console.log("FIND")
			var route = this.routePattern[pattern].route ;
			return route;
		}
			//console.log("NOT FIND")
		return null;
	};

	service.prototype.resolvePattern = function(pattern){
		var resolver = new Resolver(this.container);	
		var route = resolver.parsePathernController(pattern);
		return resolver;
	};

	service.prototype.forward = function(pattern, args){
		var resolver = this.resolvePattern(pattern);
		if (resolver.resolve){
			try {
				if (resolver.route){
					this.logger("FORWARD PATTERN : "+ pattern + "  FIND ROUTE ==> REDIRECT ","DEBUG")
					this.redirect(resolver.route.path);
					//this.location.url(resolver.route.path);
					//this.logger("FORWARD PATTERN : "+ pattern + " find ROUTE : "+resolver.route.path +" redirect to URL :" + this.location.absUrl(),"DEBUG")
					//this.browser.url(this.location.absUrl(), true);
				}else{
					this.logger("FORWARD PATTERN : "+ pattern + "  NO ROUTE FIND  ==> CALL CONTROLLER"  , "DEBUG")
					var ret = resolver.callController(args);	
				}
			}catch(e){
				this.logger("FORWARD "+ pattern +" CALL CONTROLER  "+ resolver.controller.name +" : "+e,"ERROR")
				this.forward("appModule:app:500", [e]);
			}
		}else{
			this.logger("Router Can't resolve : "+pattern ,"ERROR");
		}
		return false;	
	};
	
	service.prototype.redirect = function(url){
		this.location.url(url);
		this.logger("REDIRECT URL : "+ url  +" BROWSER  URL :" + this.location.absUrl(),"DEBUG")
		this.browser.url(this.location.absUrl() , true);
	};
		
	service.prototype.generateUrl = function(name, variables, host){
		var route =  this.getRoute(name) ;
		if (! route ){
			this.logger("no route to host  :"+ name, "WARNING")
			//throw {error:"no route to host  "+ name};
			return null ; 
		}
		var path = route.path;
		if ( route.variables.length ){
			if (! variables  ){
				var txt = "";
				for (var i= 0 ; i < route.variables.length ;i++ ){
					txt += "{"+route.variables[i]+"} ";
				}
				this.logger("router generate path route '"+ name + "' must have variable "+ txt, "ERROR")
				return null;
			}
			for (var ele in variables ){
				if (ele === "_keys") continue ;
				var index = route.variables.indexOf(ele);
				if ( index >= 0 ){
					path = path.replace("{"+ele+"}",  variables[ele]);
				}else{
					this.logger("router generate path route '"+ name + "' don't  have variable "+ ele, "WARNING")
					return null;
				}	
			}	
		}
		if (host)
			return host+"#"+path ;
		return path ;
	};


	service.prototype.logger = function(pci, severity, msgid,  msg){
		if (! msgid) msgid = "ROUTER "
		return this.syslog.logger(pci, severity, msgid,  msg);
	};

	service.prototype.listen = function(){
		return this.notificationsCenter.listen.apply(this.notificationsCenter, arguments);
	};

	service.prototype.fire = function(){
		return this.notificationsCenter.fire.apply(this.notificationsCenter, arguments);
	
	};

	
	service.prototype.set = function(name, value){
		return this.container.set(name, value);	
	};

	service.prototype.get = function(name, value){
		return this.container.get(name, value);	
	};

		
	service.prototype.setParameters =function(name, value){
		return this.container.setParameters(name, value);	
	};

	service.prototype.getParameters = function(name){
		return this.container.getParameters
	};

	return service;		
		
});

/***** NODEFONY  CONCAT : controller.js  *******/
/*
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

stage.register("Controller",function(){


	var Controller = function(container, module){

		this.notificationsCenter = this.get("notificationsCenter");
		this.kernel = this.get("kernel");	
		this.i18n = this.kernel.i18n;
		this.router = this.kernel.router;
	};

	Controller.prototype.redirect = function(url){
		return this.router.redirect.apply(this.router, arguments)
	};

	/*
	 *
	 *
	 */
	Controller.prototype.forward = function(pattern, args){
		return this.router.forward(pattern, args)
	};

	/*
	 *
	 *
	 */
	Controller.prototype.generateUrl = function(name, variables, absolute){
		if (absolute === true){
			var url = this.router.url().split("#");
			absolute = this.router.url[0];
		}
		return this.router.generateUrl.apply(this.router, arguments);
	};

	Controller.prototype.evalInContext = function(js, context){
		var func = function(context) { 
			var $controller = context;
			return function(js){
				"use strict";
				return eval(js);
			}
		}(this);
		try {
			return func.call( context || this , jQuery.trim( js ));
		}catch(e){
			this.logger("DOM PARSER TWIG ERROR " + e, "ERROR");	
		}
	};


	var tabFxEvent = ["stage-click", "stage-dblclick", "stage-focus", "stage-blur", "stage-mouseover", "stage-mouseout", "stage-mouseenter", "stage-mouseleave", "stage-change"];
	Controller.prototype.domParser = function(domElement){
		var controller = this ;
		domElement.find('[' + tabFxEvent.join('],[') + ']').each(function(index, ele){
			
			var attributes = ele.attributes;
			var jElement = $(ele);
			var ctrl = jElement.closest('[stage-ctrl]');
			if(ctrl.length){
				var pattern = $(ctrl).attr("stage-ctrl") ;
				try {
					var scope = controller.router.resolvePattern(pattern).controller;
				}catch (e){
					controller.logger("DOM PARSER ERROR : " + e , "ERROR")
					return ;
				}
			} else {
				var scope = controller;
			}
			for(var i = 0; i < attributes.length; i++){
				var attribute = attributes[i];
				if(tabFxEvent.indexOf(attribute.name) > -1){
					var ff = function(){
						var content = attribute.value;
						jElement.on(attribute.name.replace('stage-', ''), function(){
							scope.evalInContext(content, this);
						});
					}();
				}
			}
		});
		
	};



	/*
	 *
	 *
	 */
	Controller.prototype.render = function(element, partial, type){
		var ele = $(element);
		try {
			switch (type){
				case "append":
					ele.append(partial) ;
				break;
				case "prepend":
					ele.prepend(partial) ;
				break;
				default:
					ele.empty();
					ele.html(partial);

			}
			return this.domParser(ele);
		}catch(e){
			this.logger("DOM PARSER TWIG ERROR : "+e, "ERROR") ;
		}

	};


	Controller.prototype.renderPartial = function(pattern, obj){
		try {
			var template = this.module.getTemplatePattern(pattern);
			return template.render(obj);
		}catch(e){
			this.logger(e, "ERROR")
		}
	};

	Controller.prototype.set = function(name, value){
		return this.container.set(name, value);	
	};

	Controller.prototype.get = function(name, value){
		return this.container.get(name, value);	
	};

		
	Controller.prototype.setParameters =function(name, value){
		return this.container.setParameters(name, value);	
	};

	Controller.prototype.getParameters = function(name){
		return this.container.getParameters(name);	
	};


	Controller.prototype.logger = function(pci, severity, msgid,  msg){
		var syslog = this.get("syslog");
		if (! msgid) msgid = "MODULE: " +this.module.name +" CONTROLLER: "+this.name ;
		return syslog.logger(pci, severity, msgid,  msg);
	};


	Controller.prototype.listen = function(){
		return this.notificationsCenter.listen.apply(this.notificationsCenter, arguments);
	}

	Controller.prototype.fire = function(event){
		return this.notificationsCenter.fire.apply(this.notificationsCenter, arguments);
	};



	return Controller

});




/***** NODEFONY  CONCAT : module.js  *******/
/*
 *
 *
 */

stage.register("Module" , function(){

	var modelModule = function(config){
		this.rootName = "module";
		var documentXml = this.parser(config);		
		//this.name = this.config.name["@short"];
		this.name = documentXml.module['@id'];
	};

	modelModule.prototype.parser = function(ele){
		switch ( stage.typeOf(ele) ){
			case "document" :
				var res  = stage.xml.parseXml(ele) ; 
			break;
			case "object" :	
				res = ele ;
			break;
		}
		if ( !  res[ this.rootName ])
			throw new Error ("BAD MODULE CONFIG ");
		this.config = res[ this.rootName ] ; 
		return res;
	};

	modelModule.prototype.registerScript = function( src){
		this.autoloader.load( src, function(error, transport){
			if (error){
				this.logger(error, "ERROR");
 			       	return ;
			}
			this.logger("LOAD SCRIPT : "+src ,"DEBUG");
		}.bind(this));
	};

	modelModule.prototype.registerStyle = function( src){
		//this.kernel.autoloader.load( src, function(error, transport){
		this.autoloader.load( src, function(error, transport){
			if (error){
				this.logger(error, "ERROR");
 			       	return ;
			}
			this.logger("LOAD STYLE : "+src ,"DEBUG");
		}.bind(this));
	};
	
	modelModule.prototype.cacheFont = function( src){
		$.ajax({
			async: false,
			cache: true,
			url: src,
			beforeSend: function ( xhr ) {
				xhr.overrideMimeType("application/octet-stream");
			},
			success: function(){
				this.logger("LOAD FONT : " + src, "DEBUG");
			}.bind(this),
			error: function(){
				this.logger(src + " : " + message, "ERROR");
			}.bind(this)
		})
	};

	var urlParser = function(container, url, name, template, obj){
  		var index = url.indexOf("views") ;
  		if (index < 0 ){
    			var text = "URL TEMPLATE BAD PATH :" + url ;
    			this.logger(text ,"ERROR")
    			throw new Error(text) ;
  		}
  		var res = url.slice(index+"views".length+1).split("/");
  		res.pop();
  		if (res.length){
    			var obj = container ;
    			for (var i = 0; i<res.length;i++){
      				if ( obj[res[i]] ){
        				if (i !== res.length-1){	
        					obj = obj[res[i]] ;
        				}else{
          					obj[res[i]][name] = template;
        				}
      				}else{
        				if (i !== res.length-1){
        					obj[res[i]] = {};	
        					obj = obj[res[i]] ;
        				}else{
          					obj[res[i]] = {};
          					obj[res[i]][name] = template;
        				}
      				}
    			}
  		}else{
    			container[name] = template ;
  		}
	};

	modelModule.prototype.registerTemplate = function(name, src, type){
		//console.log("NAME :" + name)
		switch(type){
			case "application/twig":
				//var obj = urlParser.call(this, this.templates, src, name);
				this.twig({
					id: this.name+":"+name,
					href: src,
					async: false,
					//debug:true,
					load:function(template){
						urlParser.call(this, this.templates, src, name , template )
						this.logger("LOAD TEMPLATE : "+name +" ==>"+src ,"DEBUG");
						//console.log(this.templates)
						//obj[name] = template;
						//console.log(template.extend)
						//this.templateEngine
					}.bind(this),
					error:function(xrh, status, message){
						this.logger("TEMPLATE :" + src + " : "+ message, "ERROR")
					}.bind(this)
				});
			break;
			case "text/html":
			break;
			case "application/xml":
			case "text/xml":
			break;
			case "template":
				var obj = urlParser.call(this, this.templates, src.url, name, src);
				//obj[name] = src;
				this.logger("LOAD IMPORT TEMPLATE : "+name +" ==>"+src.url ,"DEBUG");
			break;
			default :
				arguments.callee.call(this, name, src, "application/twig" );
			break
		}
	};

	modelModule.prototype.registerView = function(name, src, type){
		switch(type){
			case "text/javascript":
			case "application/javascript":
				this.autoloader.load( src, function(error, transport){
					if (error){
						this.logger(error, "ERROR");
						return ;
					}
					//this.views[name] = new ;
					var Class = stage.views[name];
					this.views[name] = new Class(this.container, this);
					this.logger("LOAD VIEW : "+src ,"DEBUG");
				}.bind(this));
			break;
			default:
		}
	};

	modelModule.prototype.registerController = function(name, src){
		this.autoloader.load( src, function(error, transport){
			if (error){
				this.logger(error, "ERROR")
				throw error;
			}
			this.logger("LOAD CONTROLLER : "+name +" ==>"+src ,"DEBUG");
			var Class = stage.controllers[name].herite(stage.Controller);
			Class.prototype.container = this.container ;
			Class.prototype.name = name ;
			Class.prototype.module = this ;
			this.controllers[name] = new Class(this.container, this);
		}.bind(this))	
	};
	
	modelModule.prototype.initialiseRest = function(name, url, optionsGlobal){
		var rest = this.kernel.restService ;
		var ele = rest.addApi(name, url, optionsGlobal);
		this.kernel.set(name, ele);
	};

	var regI18n = new RegExp("^(.*)\.(.._..)\.(.*)$");
	modelModule.prototype.registerTranslation = function(src, type){
		var service = this.get("i18n");
		if (! service){
			this.logger("SERVICE I18N not loaded abort load Translation : "+src,"WARNING");
			return ;
		}
		$.ajax({
			url:src,
			async:false,
			success:function(data, status, xhr){
				var name = stage.basename(src) ;
				this.logger("LOAD TRANSLATION "+ type +" : "+name +" URL = "+src ,"DEBUG");
				var res = regI18n.exec(name);	
				if ( ! res ){
					this.logger("SERVICE I18N  abort load Translation : "+src+ " Bad File name format","WARNING");
					return;
				}
				var domain = res[1];
				var locale = res[2];
				service.registerI18n(name, locale, domain, data);
			}.bind(this),
			dataType: type || "json",
			error:function(xhr, status, err){
				this.logger(err, "ERROR")
			}.bind(this)	
		})	
	};

	modelModule.prototype.reader = function(){
		
		var root = this.config;
		for (var node in this.config){
			
			switch ( node ){
				case "content" :
				break;
				case "controllers":
					
					var controllers = root[node].controller;
					if(controllers){
						var tab = stage.typeOf(controllers) === "object" ? [controllers] : controllers ;
						for (var i = 0 ; i < tab.length ; i++){
							var name = tab[i]["@name"];
							var src = tab[i]["@src"];
							this.registerController(name, src)
						}
					}
					
				break;
				case "views":
					var views = root[node].view;
					if(views){
						var tab = stage.typeOf(views) === "object" ? [views] : views ;
						for (var i = 0 ; i < tab.length ; i++){
							var name = tab[i]["@name"];
							var src = tab[i]["@src"];
							var type = tab[i]["@type"];
							this.registerView(name, src, type);
						}
					}
					
				break;
				case "modules":
					var modules = root[node].module;
					if(modules){
						var tab = stage.typeOf(modules) === "object" ? [modules] : modules ;
						for (var i = 0 ; i < tab.length ; i++){
							//var name = tab[i]["@name"];
							var url = tab[i]["@href"];
							if ( ! this.isDomReady){
								this.kernel.listen(this,"onBoot",function(url){
									this.kernel.loadModule(url, {
										async:false
									});
								}.bind(this, url))
							}else{
								this.kernel.loadModule(url);
							}
						}
					}
					
				break;
				case "templates":
					var templates = root[node].template;
					if(templates){
						var tab = stage.typeOf(templates) === "object" ? [templates] : templates ;
						for (var i = 0 ; i < tab.length ; i++){
							var name = tab[i]["@name"];
							
							var src = tab[i]["@src"];
							var type = tab[i]["@type"];
							if ( ! name){
								name = this.getTemplateName(src)	
							}
							this.registerTemplate(name, src, type);
						}
					}
						
				break;
				case "styles":
					var styles = root[node].style;
					if(styles){
						var tab = stage.typeOf(styles) === "object" ? [styles] : styles ;
						for (var i = 0 ; i < tab.length ; i++){
							var src = tab[i]["@src"];
							this.registerStyle(src);
						}
					}
					
				break;
				case "scripts":
					var scripts = root[node].script;
					if(scripts){
						var tab = stage.typeOf(scripts) === "object" ? [scripts] : scripts ;
						for (var i = 0 ; i < tab.length ; i++){
							var src = tab[i]["@src"];
							this.registerScript(src);
						}
					}
					
				break;
				case "fonts":
					var fonts = root[node].font;
					if(fonts){
						var tab = stage.typeOf(fonts) === "object" ? [fonts] : fonts ;
						for (var i = 0 ; i < tab.length ; i++){
							var src = tab[i]["@src"];
							this.cacheFont(src);
						}
					}
					
				break;
				case "translations":
					var translations = root[node].translation;
					if(translations){
						var tab = stage.typeOf(translations) === "object" ? [translations] : translations ;
						for (var i = 0 ; i < tab.length ; i++){
							var src = tab[i]["@src"];
							var type = tab[i]["@type"];
							this.registerTranslation(src, type );
						}
					}
					
				break;
				case "icon" :
					this.icon = root[node]["@src"];
				break;
				/*case "name" :
					console.log(root[node])
					this.name = root[node]["@short"];
				break;*/
				case "preference":
				break;
				case "author":
					var author = root[node];
					this.author = author["#text"];
					this.emailAuthor = author["@email"];
					this.authorLink = author["@href"];
				break;
				case "description":
					this.description = root[node];
					break;
				case "api":
					//console.log(root[node]);
					for(var ele in root[node]){
						var mvc = root[node][ele];
						var tab = stage.typeOf(mvc) === "object" ? [mvc] : mvc;
						for(var i = 0; i < tab.length; i++){
							if(ele === "rest"){
								if( this.kernel.restService )
									this.initialiseRest(tab[i]["@name"], tab[i]["@url"]);
								else
									this.logger("Api " + ele + " SERVICE REST NOT FOUND" ,"ERROR")
							} else {
								this.logger("Api " + ele + " not exist for modules" ,"ERROR");
							}
						}
					}
					break;
				break;
				case "routes":
					var routes = root[node].route;
					switch(stage.typeOf( routes)){
						case "array":
							for (var i = 0 ;i<routes.length; i++){
								var id = routes[i]["@id"];
								var path = routes[i]["@path"];
								var defaultParam = {};
								switch(stage.typeOf( routes[i]["default"])){
									case "array":
										for (var j=0 ;j<routes[i]["default"].length;j++){
											defaultParam[routes[i]["default"][j]["@key"]] =  routes[i]["default"][j]["#text"];
											//console.log(defaultParam)
										}
									break;
									case "object":
										if (routes[i]["default"]["@key"])
											defaultParam[routes[i]["default"]["@key"]] = routes[i]["default"]["#text"];
									break;
								}
								this.routes[id] = this.router.createRoute(id, path, defaultParam);	

							}
						break;
						case "object":
							for (var route in routes){
								switch (route){
									case "@id":
										var id = routes[route];
									break;
									case "@path":
										var path = routes[route];
									break;
									case "default":
										var defaultParam = {};
										switch(stage.typeOf( routes[route] )){
											case "array":
												for (var j=0 ;j<routes[route].length;j++){
													defaultParam[routes[route][j]["@key"]] =  routes[route][j]["#text"];
												}
											break;
											case "object":
												defaultParam[routes[route]["@key"]] = routes[route]["#text"]
											break;
										}
									break;
								}
							}
							this.routes[id] = this.router.createRoute(id, path, defaultParam);
						break
					}
				break;
			}
		}
	};

	var Module = function(kernel, config, settings){

		this.kernel = kernel;
		this.container = kernel.container;
		this.syslog = this.get("syslog");
		this.logger("REGISTER MODULE "+this.name, "DEBUG");
		this.autoloader = new stage.autoload(this, {
			transport:"script"
		});
		this.views = {};
		this.controllers = {};
		this.templates = {};
		this.routes = {};

		this.twig = this.get("twig");
		
		this.model = this.$super ;
		this.model.constructor(config);
		this.setParameters("module."+this.name, this.config);
		this.set(this.name, this);
		this.boot(settings);

	}.herite(modelModule);

	Module.prototype.getController = function(name){
		return this.controllers[name];
	};

	Module.prototype.getTemplate = function(name){
		return this.templates[name];
	};

	Module.prototype.getTemplateName = function(url){
		var name = stage.basename(url);
		var index = name.indexOf(".");
		if (index < 0)
			return url;
		return name.slice(0, name.indexOf(".") );
	};

	var regPattern = /(.*)Module:(.*):(.*)$/;
	Module.prototype.getTemplatePattern = function(pattern){
		var res  = regPattern.exec(pattern);
		if ( ! res ){
			var txt = "IN PATTERN :" + pattern +" BAD FORMAT " ;
			this.logger(txt,"ERROR")
			throw new Error(txt);
		}
		var moduleName = res[1];
		var pathName = res[2];
		var templateName = res[3];	
		var module = this.kernel.getModule(moduleName);
		if ( ! module ){
			var txt = "IN PATTERN :" + pattern +" MODULE :"+ moduleName +" not defined" ;
			this.logger(txt,"ERROR")
			throw new Error(txt);
		}
		var obj = module.templates ;
		if (pathName !== ""){
			var tab = pathName.split("/");
			for (var i = 0 ; i<tab.length ; i++){
				if (tab[i]){
					if (tab[i] in obj){
						obj = obj[tab[i]];
					}else{
						var txt = "IN PATTERN :" + pattern +" pathName :"+ pathName +" not defined" ;
						this.logger(txt,"ERROR")
						throw new Error(txt);
					}
				}
			}
		}
		if (templateName !== "" ){
			var name = this.getTemplateName(templateName);
			if (obj[name]){
				return obj[name];
			}else{
				var txt = "IN PATTERN :" + pattern +" MODULE :"+ moduleName +"  template : "+ templateName +" not defined" ;
				this.logger(txt,"ERROR")
				throw new Error(txt);	
			}
		}else{
			if (obj["index"]){
				return obj["index"];
			}else{
				var txt = "IN PATTERN :" + pattern +" MODULE :"+ moduleName +" default template not defined" ;
				this.logger(txt,"ERROR")
				throw new Error(txt);	
			}
		}
	};

	Module.prototype.getView = function(name){
		return this.views[name];
	};

	Module.prototype.boot = function(settings){
		this.logger("BOOT "+ this.name , "DEBUG");
		this.container = this.kernel.container.enterScope(this.name);
		this.notificationsCenter = stage.notificationsCenter.create(settings,this);
		this.set("notificationsCenter", this.notificationsCenter);
		this.router = this.kernel.router ;

		try {
			this.fire("onBoot", this);	
			this.reader();
			this.fire("onReady",this);
		}catch (e){
			this.logger("MODULE : "+ this.name +"  "+e, "ERROR");
			throw e;
		}
	};

	Module.prototype.listen = function(){
		return this.notificationsCenter.listen.apply(this.notificationsCenter, arguments);
	};

	Module.prototype.fire = function(event){
		this.logger(event+" : "+ this.name , "DEBUG", "EVENT MODULE")
		return this.notificationsCenter.fire.apply(this.notificationsCenter, arguments);
	};

	Module.prototype.logger = function(pci, severity, msgid,  msg){
		if (! msgid) msgid = "MODULE  "+this.name;
			return this.syslog.logger(pci, severity, msgid,  msg);	
	};

	/**
	 *	@method get
	 *	@param {String} name of service
         */
	Module.prototype.get = function(name){
		return this.container.get(name);
	};

	/**
	 *	@method set
	 *	@param {String} name of service
	 *	@param {Object} instance of service
         */
	Module.prototype.set = function(name, obj){
		return this.container.set(name, obj);
	};

	Module.prototype.setParameters =function(name, value){
		return this.container.setParameters(name, value);	
	};

	Module.prototype.getParameters = function(name){
		return this.container.getParameters(name);	
	};


	return Module;	
		
})

/***** NODEFONY  CONCAT : translationService.js  *******/
stage.register("i18n",function(){

	var translate = {};


	var translateDispo = {
		fr_FR:"français",
		en_EN:"english"
	};

	var regNavLang = /(..)-?.*/;

	var service = function(kernel, container){
		this.container = container;	
		this.syslog = this.container.get("syslog");
		this.logger("INITIALIZE I18N SERVICE", "DEBUG");
		this.kernel = kernel ;

		this.container.setParameters("translate", translate);
		this.defaultDomain = this.trans_default_domain();
		var locale = navigator.language || navigator.userLanguage ;
		var res = regNavLang.exec(locale);
		if (res){
			locale = res[1]
			this.defaultLocale  = locale+"_"+locale.toUpperCase();
			translate[this.defaultLocale] = {};
		}else{
			this.defaultLocale = "fr_FR";	
		}

		this.kernel.listen(this, "onBoot",function(){
			this.boot();
		}.bind(this))	
	};

	service.prototype.logger = function(pci, severity, msgid,  msg){
		if (! msgid) msgid = "SERVICE I18N "
		return this.syslog.logger(pci, severity, msgid,  msg);
	};


	

	service.prototype.boot = function(){
		//GET APP locale
		if ( this.container.getParameters("module.app") )
			this.defaultLocale = this.container.getParameters("module.app").locale;

		if  ( ! translate[this.defaultLocale])
			translate[this.defaultLocale] = {};

		this.logger("DEFAULT LOCALE APPLICATION ==> " + this.defaultLocale ,"DEBUG");
		//this.logger("//FIXME LOCALE getLang in controller etc ..." ,"WARNING");
		if (window.Twig){
			window.Twig.extendFunction("getLangs", this.getLangs.bind(this));
			window.Twig.extendFunction("trans_default_domain", this.trans_default_domain.bind(this));
			window.Twig.extendFilter("trans", this.translation.bind(this));
			window.Twig.extendFunction("trans", this.translation.bind(this));
			window.Twig.extendFilter("getLangs", this.getLangs.bind(this));
		}
	};

	service.prototype.getLangs = function(locale, data){
		var obj = [];
		for ( var ele in translateDispo){
			obj.push({
				name:translateDispo[ele],
				value:ele
			})	
		}
		return obj;
	};


	service.prototype.registerI18n = function(name, locale, domain, data){
		if ( locale ){
			if( !translate[locale] )
				translate[locale] = stage.extend(true, {}, translate[this.defaultLocale]);	
		}
		if ( domain ){
			if( !translate[locale][domain] )
				translate[locale][domain] = stage.extend(true, {}, translate[this.defaultLocale][domain]);
			stage.extend(true, translate[locale][domain], data);		
		}else{
			stage.extend(true, translate[locale], data);	
		} 
	};




	service.prototype.trans_default_domain = function(domain){
		if ( ! domain ){
			return this.defaultDomain = "messages" ; 
		}
		return this.defaultDomain = domain ;
	};

	/*
 	 *
 	 *
 	 *
 	 *
 	 */
	service.prototype.translation = function(value, args){
		
		var defaulDomain = ( args && args[1] ) ? args[1] : this.defaultDomain ;
		var str = this.container.getParameters("translate."+this.defaultLocale+"."+defaulDomain+"."+value) || value;
		if (args){
			if (args[0]){
				for (var ele in args[0]){
					str = str.replace(ele, args[0][ele])
				}
			}
		}
		return str;
	};

	return service;


});

/***** NODEFONY  CONCAT : locationService.js  *******/
stage.register("location",function(){


	var nativeHistory = !!(window.history && window.history.pushState );
	var PATH_MATCH = /^([^\?#]*)(\?([^#]*))?(#(.*))?$/;
	var DEFAULT_PORTS = {'http': 80, 'https': 443};



	var changeUrl = function(event){
		var cache = null ;
		var location = this.kernel.locationService ;
		var url = this.url();

		if ( ( url === this.lastUrl && url === this.location.href ) && this.lastUrl !== location.initialUrl){ 
			//console.log(" changeUrl PASS SAME")
			return;
		}

		if ( ! event ){
			this.kernel.logger(" FORCE URL CHANGE BROWER EVENT NOT FIRE" , "WARNING" );
			//console.log(location.url())
			var newUrl = location.url() ;
			this.kernel.notificationsCenter.fire("onUrlChange", newUrl , this.lastHash, url ,cache)
			this.lastUrlr= url;
			this.lastHash = newUrl ;
			return ;
		}
		//console.log("change URL :" + url +" IINIT "+location.initialUrl)
		//console.log("change LAST URL :" + this.lastUrl)
		var parse = location.parse(url);
		//console.log(location)
		if ( ! parse ){
			this.kernel.notificationsCenter.fire("onUrlChange", "", this.lastHash, url,  cache)
			this.lastUrl = "";
			this.lastHash = "";
			return ;
		}

		var newUrl = location.url() ;
		
		this.kernel.notificationsCenter.fire("onUrlChange", newUrl, this.lastHash , url ,cache)
		this.lastUrl = url;
		this.lastHash = newUrl ;
	};

	var browser = function(kernel, settings){
		this.location = window.location;
		this.history = window.History;
		this.lastUrl = this.url();
		this.kernel = 	kernel ;
		$(window).bind('hashchange', changeUrl.bind(this)); 
		//if (nativeHistory){
		//	$(window).bind('popstate', changeUrl.bind(this))
		//}
	};

	browser.prototype.url = function(options){
		if (nativeHistory && options.html5Mode){
			return function(url, replace, state){
				//TODO
				/*if (this.location !== window.location) this.location = window.location;
				if (this.history !== window.History) this.history = window.History;

				if (url){
					this.kernel.logger(replace ? "REPLACE URL : " + url : "CHANGE URL : " + url,"WARNING")
						this.history[replace ? 'replaceState' : 'pushState'](state, '', url);
				}else{
					return this.location.href.replace(/%27/g,"'");	
				}*/
			}
		}else{
			return function(url, replace, state){
				
				if (url){
				if (this.kernel && this.kernel.get("location") )

					if (this.location !== window.location) this.location = window.location;
					var same = ( url === this.lastUrl && url === this.location.href ? true : false );
					if (this.history !== window.history) this.history = window.history;
					this.kernel.logger(replace ? "REPLACE URL : " + url : "CHANGE URL : " + url,"WARNING");
					if ( same ){
						if  (  url === this.kernel.locationService.initialUrl ){
								//FORCE changeUrl 
								changeUrl.call(this)
						}
						return url ;
					}
					//console.log(url)
					if ( replace ){
						this.location.replace(url);	
						return url ;
					}
					return this.location.href = url;				
				}else{
					return this.location.href.replace(/%27/g,"'");	
				}			
			}
		}
	};


	/*
 	 *	CLASS LOCATION
 	 *
 	 */


	var serverBase = function (url) {
		return url.substring(0, url.indexOf('/', url.indexOf('//') + 2));
	};

	var beginsWith = function(begin, whole) {
  		if (whole.indexOf(begin) === 0) {
    			return whole.substr(begin.length);
  		}
	}

	var Location = function(browser, base, kernel, settings){
		this.settings = settings
		this.kernel = kernel;
		this.browser = browser ;
		this.container = this.kernel.container ;
		this.replace = false ;
		
		this.initialUrl = this.browser.url();
		this.base = base
		this.hashPrefix = "#"+this.settings.hashPrefix ;
		this.proto = this.stripFile(this.base);
		this.parseAbsoluteUrl(this.initialUrl);
		this.parse(this.initialUrl);


		// rewrite hashbang url <> html5 url
		//var abs = this.absUrl();
		//if ( abs != this.initialUrl) {
		//	this.browser.url(abs, true);
		//}
	};
	
	Location.prototype.logger = function(pci, severity, msgid,  msg){
		if (! msgid) msgid = "SERVICE LOCATION "
		return this.kernel.syslog.logger(pci, severity, msgid,  msg);
	};

	Location.prototype.listen = function(){
		return this.kernel.notificationsCenter.listen.apply(this.kernel.notificationsCenter, arguments);
	};

	Location.prototype.fire = function(){
		return this.kernel.notificationsCenter.fire.apply(this.kernel.notificationsCenter, arguments);
	
	};

	Location.prototype.set = function(name, value){
		return this.container.set(name, value);	
	};

	Location.prototype.get = function(name, value){
		return this.container.get(name, value);	
	};

	Location.prototype.absUrl = function(){
		return this._absUrl ;
	};

	Location.prototype.url = function(url){
		if (typeof url === "undefined")
			return this._url;
		var match = PATH_MATCH.exec(url);
		if (match[1]) this.path(decodeURIComponent(match[1]));
		if (match[2] || match[1]) this.search(match[3] || '');
		this.hash(match[5] || '');
	};

	Location.prototype.protocol = function(){
		return this._protocol;	
	};


	Location.prototype.host = function(){
		return this._host;	
	};

	Location.prototype.port = function(){
		return this._port ;	
	};

	Location.prototype.path = function(path){
		if (typeof path === "undefined"){
			return this._path ;
		}
		this._path = path ;
		try {
			this.change();
		}catch(e){
			this.logger(e,"ERROR");
			throw e
		}
		return this._path;
	};

	Location.prototype.search = function(search){
		if (typeof search === "undefined"){
			return this._search ;
		}
		this._search = search ;
		try {
			this.change();
		}catch(e){
			this.logger(e,"ERROR");
			throw e
		}
		return this._search;

		
	};
	
	Location.prototype.hash = function(hash){
		if (typeof hash === "undefined"){
			return this._hash ;
		}
		this._hash = hash ;
		try {
			this.change();
		}catch(e){
			this.logger(e,"ERROR");
			throw e
		}
		return this._hash;
	};	

	Location.prototype.state = function(){
	
	};

	Location.prototype.replace = function(value){
		if (value)
			return  this.replace = value ;	
		return this.replace ;
	};

	Location.prototype.encodePath = function(path) {
  		var segments = path.split('/');
      		var i = segments.length;

  		while (i--) {
    			segments[i] = stage.io.encodeUriSegment(segments[i]);
  		}

  		return segments.join('/');
	};


	Location.prototype.stripFile = function(url){
		return url.substr(0, stripHash(url).lastIndexOf('/') + 1);
	};


	var stripHash = function(url){
		var index = url.indexOf('#');
  		return index == -1 ? url : url.substr(0, index);
	};

	// parsing end URL ex : http://domain.com:port(/path)(?search)(#hash)
	Location.prototype.parseRelativeUrl = function(relativeUrl){
		//console.log("relative :" + relativeUrl)
		var prefixed = (relativeUrl.charAt(0) !== '/');
		if (prefixed) {
			relativeUrl = '/' + relativeUrl;
		}
		var resolve = stage.io.urlToOject(relativeUrl);
		//console.log(resolve)
		this._path = decodeURIComponent(prefixed && resolve.pathname.charAt(0) === '/' ?
			resolve.pathname.substring(1) : resolve.pathname);
		this._search = stage.io.parseKeyValue(resolve.search);
		this._hash = decodeURIComponent(resolve.hash);

		// make sure path starts with '/';
		if (typeof this._path !== "undefined" && this._path.charAt(0) != '/') {
			this._path = '/' + this._path;
		}
		//console.log("PATH:" + this._path)
	};

	// parsing begin URL ex : (http)://(domain.com):(port)
	Location.prototype.parseAbsoluteUrl = function(absoluteUrl){
		var resolve = stage.io.urlToOject(absoluteUrl);
  		this._protocol = resolve.protocol.replace(":", "");
  		this._host = resolve.hostname;
  		this._port = parseInt(resolve.port, 10) || DEFAULT_PORTS[this._protocol] ||null;
	};

	/**
 	 * LocationHashbangUrl represents url
 	 * This object is exposed as $location service when developer doesn't opt into html5 mode.
 	 * It also serves as the base class for html5 mode fallback on legacy browsers.
 	 *
 	 * @constructor
 	 * @param {string} appBase application base URL
 	 * @param {string} hashPrefix hashbang prefix
 	*/
	var LocationHashbangUrl= function(browser, base, kernel, settings) {
		this.mother = this.$super
		this.mother.constructor(browser, base, kernel, settings);
	}.herite(Location);

	LocationHashbangUrl.prototype.parse = function(url){
		//console.log("URL to parse LocationHashbangUrl  :" + url)
		//console.log("base : " + this.base)
		//console.log("beginsWith BASE : "+beginsWith(this.base, url))
		//console.log("beginsWith PROTO  :"+beginsWith(this.proto, url))
		var withoutBaseUrl = beginsWith(this.base, url) || beginsWith(this.proto, url);
		//console.log("withoutBaseUrl : " +withoutBaseUrl)
		var withoutHashUrl = withoutBaseUrl.charAt(0) == '#'
			? beginsWith(this.hashPrefix, withoutBaseUrl)
			: "";

    		if (typeof withoutHashUrl !== "string") {
			this.logger('Invalid url '+url+', missing hash prefix ' +this.hashPrefix , "ERROR");
      			return null; 
    		}
		//console.log("withoutHashUrl : " +withoutHashUrl)
    		this.parseRelativeUrl(withoutHashUrl);
		return this.change();
	};
	
	LocationHashbangUrl.prototype.change = function(){
		var search = stage.io.toKeyValue(this._search);
		//console.log(this._search)
		//var hash = this._hash ? '#' + stage.io.encodeUriSegment(this._hash) : '';

		var hash = this._hash ? '#' + this._hash : '';

		//console.log(this._path)
		this._url = this.encodePath(this._path) + (search ? '?' + search : '') + hash		
		//console.log(this._url)
		//var temp = (this._url ? this.hashPrefix + this._url : '').replace("//","/");
		//this._absUrl = this.base + temp;	
		//console.log( this.hashPrefix)
		//console.log( this._url)
		this._absUrl = this.base + (this._url ? "#" + this._url : '');	
		//console.log("URL :"+ this._url)
		//console.log("HASH :"+ this._hash)
		//console.log("ABSURL :"+ this._absUrl)
		//console.log("PATH :"+ this._path)
		return this;
	};


	/**
 	 * LocationHashbangInHtml5Url represents url
 	 * This object is exposed as location service when html5 history api is enabled but the browser
 	 * does not support it.
 	 *
 	 * @constructor
 	 * @param {string} appBase application base URL
 	 * @param {string} hashPrefix hashbang prefix
 	*/
	var LocationHashbangInHtml5Url = function(browser, base, kernel, settings){
	
		this.mother = this.$super
		this.mother.constructor(browser, base, kernel, settings);
	}.herite(LocationHashbangUrl);


	LocationHashbangInHtml5Url.prototype.parse = function(url){
		return this.change();
	};
	
	LocationHashbangInHtml5Url.prototype.change = function(){
		return this;
	};

	/**
 	 * LocationHtml5Url represents an url
 	 * This object is exposed as location service when HTML5 mode is enabled and supported
 	 *
 	 * @constructor
 	 * @param {string} appBase application base URL
 	 * @param {string} basePrefix url path prefix
 	*/
	var LocationHtml5Url= function(browser, base, kernel, settings) {
		this.mother = this.$super
		this.mother.constructor(browser, base, kernel, settings);
	}.herite(Location);


	LocationHtml5Url.prototype.parse = function(url){
		var pathUrl = beginsWith(this.proto, url);
		if (pathUrl){
			this.parseRelativeUrl(pathUrl);
		}
		if (! this._path)
			this._path = "/"
		return this.change();
	};
	
	LocationHtml5Url.prototype.change = function(){
		var search = stage.io.toKeyValue(this._search);
		var hash = this._hash ? '#' + stage.io.encodeUriSegment(this._hash) : '';
		this._url = this.encodePath(this._path) + (search ? '?' + search : '') + hash;
		this._absUrl = this.proto + this._url.substr(1);
		return this
	};

	/*
 	 *	SERVICE LOCATION
 	 */

	var defaultSettings = {
		html5Mode:true,
		hashPrefix:"/"
	};

	var service = function(kernel, settings){
	
		var options = $.extend(defaultSettings, settings)
			
		browser.prototype.url = browser.prototype.url(options);
		var browserService = new browser(kernel, options);
		kernel.set("browser", browserService);
		var initialUrl = browserService.url();
		var baseHref = options.base || "" ;

		if (options.html5Mode) {
			var mode = nativeHistory ? LocationHtml5Url : LocationHashbangInHtml5Url;
			var base = serverBase(initialUrl) + (baseHref || '/');
		}else{
			var mode = LocationHashbangUrl ;
			var base = stripHash(initialUrl);
		}
		
		return new mode(browserService, base, kernel, options);
	}; 
	
	return service;

});





