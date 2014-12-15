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
