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
 *
 *
 *
 */

nodefony.provide("functions");

nodefony.register("functions" , function(){


	// Multiple heritage
	var recHeriteMultiple = function(){
		proto["__proto__"] = nodefony.extend({},args[(args.length - i)].prototype);
		
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
					
					this.$super[sup] = nodefony.extend({}, tab[sup].prototype);
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
	};


	// Optimized for simple heritage
 	var heriteSimple = function(){
		if ( ! arguments[0] || ! arguments[1]){
			throw new Error (" HERITE MOTHER CLASS NOT DEFINED !!!!");
		}
 		var args = arguments;

		// Extend prototype 		
		var proto = new function(){}();
		proto["__proto__"] = nodefony.extend({},arguments[0].prototype);
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
		isFunction: function(obj){
			return typeof(obj) === "function"; 
		},
		herite:	herite
	}

})
