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
	var Nodefony = class Nodefony {

		constructor() {
			this.io = {};
			this.context = {};
			this.session = {
				storage:{}
			};
			this.bundles={};
			this.templatings={};
			this.services= {};
		}


		isFunction  (it) {
			return Object.prototype.toString.call(it) === '[object Function]';
		}

		isArray  (it) {
			return Object.prototype.toString.call(it) === '[object Array]';
		}

		/**
	 	*	@method require
	 	*/
		require (){ } ;

		/**
	 	*	@method provide
	 	*/
		provide (){ } ;

		/**
	 	*	@method typeOf
	 	*	@param  value
         	*	@return {String} type of value
	 	*/
		typeOf (value){
			var t = typeof value;
			if (t === 'object'){

				if (value === null ) return "object";

				if ( this.isArray( value ) ){
					return "array";
				}
				if ( this.isFunction( value ) ) {
        				return 'function';
      				}
				if (value instanceof Date )
					return "date";
				if ( value.callee )
					return "arguments";
				if (value instanceof SyntaxError )
					return "SyntaxError";
				if (value instanceof Error )
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
		extend (){

			var options, name, src, copy, copyIsArray, clone,
				target = arguments[ 0 ] || {},
				i = 1,
				length = arguments.length,
				deep = false;

			// Handle a deep copy situation
			if ( typeof target === "boolean" ) {
				deep = target;
				// Skip the boolean and the target
				target = arguments[ i ] || {};
				i++;
			}
			// Handle case when target is a string or something (possible in deep copy)
			if ( typeof target !== "object" &&  this.isFunction ( target ) ) {
				target = {};
			}
			// Extend jQuery itself if only one argument is passed
			if ( i === length ) {
				target = this;
				i--;
			}
			for ( ; i < length; i++ ) {

				// Only deal with non-null/undefined values
				if ( ( options = arguments[ i ] ) != null ) {

					// Extend the base object
					for ( name in options ) {
						src = target[ name ];
						copy = options[ name ];

						// Prevent never-ending loop
						if ( target === copy ) {
							continue;
						}

						// Recurse if we're merging plain objects or arrays
						var bool = this.typeOf( copy ) 
						if ( deep && copy && ( bool === "object" ||
							( copyIsArray = (bool === "array") ) ) ) {

							if ( copyIsArray ) {
								copyIsArray = false;
								clone = src && bool === "array" ? src : [];

							} else {
								clone = src && bool === "object" ? src : {};
							}

							// Never move original objects, clone them
							target[ name ] = this.extend( deep, clone, copy );

						// Don't bring in undefined values
						} else if ( copy !== undefined ) {
							target[ name ] = copy;
						}
					}
				}
			}
			// Return the modified object
			return target;
		}


		/**
 	 	*  Register Nodefony Library element
	 	*  @method register
	 	*  @param {String} name
	 	*  @param {Function} closure
	 	*
 	 	*/	
		register (name, closure){
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
		registerBundle (name, closure){
			if (typeof closure === "function" ){
				return this.bundles[name] = closure();	
			}
			throw new Error( "Register bundle : "+ name +"  error bundle bad format" );
		};


		/**
 	 	*  Register Nodefony controller
	 	*  @method registerController
	 	*  @param {String} name
	 	*  @param {Function} closure
	 	*
 	 	*/
		registerController (name, closure){
			if (typeof closure === "function" ){
				//controller.prototype.name = name ;
				return  closure();
			}
			throw new Error( "Register Controller : "+ name +"  error Controller bad format" );
		};

		/**
 	 	*  Register Nodefony Template
	 	*  @method registerTemplate
	 	*  @param {String} name
	 	*  @param {Function} closure
	 	*
 	 	*/
		registerTemplate (name, closure){
			return this.templatings[name] = closure();
		};

		/**
 	 	*  Register Nodefony service 
	 	*  @method registerService
	 	*  @param {String} name
	 	*  @param {Function} closure
	 	*
 	 	*/
		registerService (name, closure){
			if ( name in this.services ){
				throw new Error( "Service name : "+ name +" already exit in application !!! ");
			}
			if (typeof closure === "function" ){
				return this.services[name] = closure();
			}
			throw new Error( "Register Service : "+ name +"  error Service bad format" );
		};


		/**
 	 	*  Register Nodefony entity 
	 	*  @method registerEntity
	 	*  @param {String} name
	 	*  @param {Function} closure
	 	*
 	 	*/
		registerEntity (name, closure){
			if (typeof closure === "function" ){
				return  closure();
				//return this.entities[name] = closure();
			}
			throw new Error( "Register Entity : "+ name +"  error Entity bad format" );
			
		};
		
		/**
 	 	*  Register Nodefony fixture 
	 	*  @method registerFixture
	 	*  @param {String} name
	 	*  @param {Function} closure
	 	*
 	 	*/
		registerFixture (name, closure){
			if (typeof closure === "function" ){
				return  closure();
				//return this.fixtures[name] = closure();
			}
			throw new Error( "Register fixtures : "+ name +"  error fixtures bad format" );
		};

		/**
 	 	*  Register Nodefony command 
	 	*  @method registerCommand
	 	*  @param {String} name
	 	*  @param {Function} closure
	 	*
 	 	*/
		registerCommand (name, closure){
			if (typeof closure === "function" ){
				return  closure();
				//return this.commands[name] = closure();	
			}
			throw new Error( "Register commands : "+ name +"  error commands bad format" );
		}	
	};
	
	return new Nodefony();
}();
