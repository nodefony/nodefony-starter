/**
 *
 *	@module Nodefony
 *
 *
 */
var fs = require("fs");
var util = require('util');
var path = require("path");

var nodefony = function(){


	/**
	 *	The class is a **`Nodefony Nodefony `** .
	 *	@class Nodefony
	 *	@constructor
	 *	@module Nodefony
	 *	
	 */
	var Nodefony = function(){
		this.io = {};
		this.version="1.0";
		this.crypto={};
		this.bundles={};
		this.controllers={};
		this.templatings={};
		this.services= {};
		this.entities={};
		this.fixtures={};
		this.commands={};
		this.enginesOrm={};
	};

	/**
	 *	@method require
	 */
	Nodefony.prototype.require = function(){} ;

	/**
	 *	@method provide
	 */
	Nodefony.prototype.provide = function(){} ;

	/**
	 *	@method typeOf
	 *	@param  value
         *	@return {String} type of value
	 */
	Nodefony.prototype.typeOf  = function(value){
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


	/**
 	 * extend jquery for nodejs only 
	 * @method extend
	 *
 	 */
	Nodefony.prototype.extend = function(){
		// copy reference to target object
		var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options, name, src, copy;
	
		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		}
		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" &&  typeof(target) !== "function" ) {
			target = {};
		}
		// extend jQuery itself if only one argument is passed
		if ( length === i ) {
			target = this;
			--i;
		}
		for ( ; i < length; i++ ) {
			// Only deal with non-null/undefined values
			if ( (options = arguments[ i ]) != null ) {
				// Extend the base object
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];
	
					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}
	
					// Recurse if we're merging object values
					if ( deep && copy && typeof copy === "object" && !copy.nodeType) {
						var clone;
						if ( src ) {
							clone = src;
						} else if ( this.typeOf(copy) === "array" ) {
							clone = [];
						} else if ( this.typeOf(copy) === "object" ) {
							clone = {};
						} else {
							clone = copy;
						}
	
						// Never move original objects, clone them
						target[ name ] = nodefony.extend( deep, clone, copy );
	
					// Don't bring in undefined values
					} else if ( copy !== undefined ) {
							target[ name ] = copy;
					}
				}
			}
		}
		// Return the modified object
		return target;
	};

	
	/**
 	 *  Register Nodefony Library element
	 *  @method register
	 *  @param {String} name
	 *  @param {Function} closure
	 *
 	 */	
	Nodefony.prototype.register=function(name, closure){
		if (typeof closure === "function") {
			// exec closure 
			var register = closure(this, name);
		} else {
			var register = closure;
		}
		return this[name] = register;
	};

	/**
 	 *  Register Nodefony Bundle 
	 *  @method registerBundle
	 *  @param {String} name
	 *  @param {Function} closure
	 *
 	 */
	Nodefony.prototype.registerBundle=function(name, closure){
		return this.bundles[name] = closure();
	};

	/**
 	 *  Register Nodefony controller
	 *  @method registerController
	 *  @param {String} name
	 *  @param {Function} closure
	 *
 	 */
	Nodefony.prototype.registerController=function(name, closure){
		var controller = this.controllers[name] = closure();
		controller.prototype.name = name ;
		return controller;
	};

	/**
 	 *  Register Nodefony Template
	 *  @method registerTemplate
	 *  @param {String} name
	 *  @param {Function} closure
	 *
 	 */
	Nodefony.prototype.registerTemplate=function(name, closure){
		return this.templatings[name] = closure();
	};

	/**
 	 *  Register Nodefony service 
	 *  @method registerService
	 *  @param {String} name
	 *  @param {Function} closure
	 *
 	 */
	Nodefony.prototype.registerService=function(name, closure){
		return this.services[name] = closure();
	};

	/**
 	 *  Register Nodefony entity 
	 *  @method registerEntity
	 *  @param {String} name
	 *  @param {Function} closure
	 *
 	 */
	Nodefony.prototype.registerEntity=function(name, closure){
		return this.entities[name] = closure();
	};
	
	/**
 	 *  Register Nodefony fixture 
	 *  @method registerFixture
	 *  @param {String} name
	 *  @param {Function} closure
	 *
 	 */
	Nodefony.prototype.registerFixture=function(name, closure){
		return this.fixtures[name] = closure();
	};

	/**
 	 *  Register Nodefony command 
	 *  @method registerCommand
	 *  @param {String} name
	 *  @param {Function} closure
	 *
 	 */
	Nodefony.prototype.registerCommand=function(name, closure){
		return this.commands[name] = closure();	
	}	

	return new Nodefony();
}();
