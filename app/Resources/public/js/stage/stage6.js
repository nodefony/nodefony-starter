(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["stage"] = factory();
	else
		root["stage"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 59);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["$"] = __webpack_require__(40);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */


var logDisabled_ = true;

// Utility methods.
var utils = {
  disableLog: function(bool) {
    if (typeof bool !== 'boolean') {
      return new Error('Argument type: ' + typeof bool +
          '. Please use a boolean.');
    }
    logDisabled_ = bool;
    return (bool) ? 'adapter.js logging disabled' :
        'adapter.js logging enabled';
  },

  log: function() {
    if (typeof window === 'object') {
      if (logDisabled_) {
        return;
      }
      if (typeof console !== 'undefined' && typeof console.log === 'function') {
        console.log.apply(console, arguments);
      }
    }
  },

  /**
   * Extract browser version out of the provided user agent string.
   *
   * @param {!string} uastring userAgent string.
   * @param {!string} expr Regular expression used as match criteria.
   * @param {!number} pos position in the version string to be returned.
   * @return {!number} browser version.
   */
  extractVersion: function(uastring, expr, pos) {
    var match = uastring.match(expr);
    return match && match.length >= pos && parseInt(match[pos], 10);
  },

  /**
   * Browser detector.
   *
   * @return {object} result containing browser and version
   *     properties.
   */
  detectBrowser: function() {
    // Returned result object.
    var result = {};
    result.browser = null;
    result.version = null;

    // Fail early if it's not a browser
    if (typeof window === 'undefined' || !window.navigator) {
      result.browser = 'Not a browser.';
      return result;
    }

    // Firefox.
    if (navigator.mozGetUserMedia) {
      result.browser = 'firefox';
      result.version = this.extractVersion(navigator.userAgent,
          /Firefox\/(\d+)\./, 1);
    } else if (navigator.webkitGetUserMedia) {
      // Chrome, Chromium, Webview, Opera, all use the chrome shim for now
      if (window.webkitRTCPeerConnection) {
        result.browser = 'chrome';
        result.version = this.extractVersion(navigator.userAgent,
          /Chrom(e|ium)\/(\d+)\./, 2);
      } else { // Safari (in an unpublished version) or unknown webkit-based.
        if (navigator.userAgent.match(/Version\/(\d+).(\d+)/)) {
          result.browser = 'safari';
          result.version = this.extractVersion(navigator.userAgent,
            /AppleWebKit\/(\d+)\./, 1);
        } else { // unknown webkit-based browser.
          result.browser = 'Unsupported webkit-based browser ' +
              'with GUM support but no WebRTC support.';
          return result;
        }
      }
    } else if (navigator.mediaDevices &&
        navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) { // Edge.
      result.browser = 'edge';
      result.version = this.extractVersion(navigator.userAgent,
          /Edge\/(\d+).(\d+)$/, 2);
    } else if (navigator.mediaDevices &&
        navigator.userAgent.match(/AppleWebKit\/(\d+)\./)) {
        // Safari, with webkitGetUserMedia removed.
      result.browser = 'safari';
      result.version = this.extractVersion(navigator.userAgent,
          /AppleWebKit\/(\d+)\./, 1);
    } else { // Default fallthrough: not supported.
      result.browser = 'Not a supported browser.';
      return result;
    }

    return result;
  },

  // shimCreateObjectURL must be called before shimSourceObject to avoid loop.

  shimCreateObjectURL: function() {
    if (!(typeof window === 'object' && window.HTMLMediaElement &&
          'srcObject' in window.HTMLMediaElement.prototype)) {
      // Only shim CreateObjectURL using srcObject if srcObject exists.
      return undefined;
    }

    var nativeCreateObjectURL = URL.createObjectURL.bind(URL);
    var nativeRevokeObjectURL = URL.revokeObjectURL.bind(URL);
    var streams = new Map(), newId = 0;

    URL.createObjectURL = function(stream) {
      if ('getTracks' in stream) {
        var url = 'polyblob:' + (++newId);
        streams.set(url, stream);
        console.log('URL.createObjectURL(stream) is deprecated! ' +
                    'Use elem.srcObject = stream instead!');
        return url;
      }
      return nativeCreateObjectURL(stream);
    };
    URL.revokeObjectURL = function(url) {
      nativeRevokeObjectURL(url);
      streams.delete(url);
    };

    var dsc = Object.getOwnPropertyDescriptor(window.HTMLMediaElement.prototype,
                                              'src');
    Object.defineProperty(window.HTMLMediaElement.prototype, 'src', {
      get: function() {
        return dsc.get.apply(this);
      },
      set: function(url) {
        this.srcObject = streams.get(url) || null;
        return dsc.set.apply(this, [url]);
      }
    });

    var nativeSetAttribute = HTMLMediaElement.prototype.setAttribute;
    HTMLMediaElement.prototype.setAttribute = function() {
      if (arguments.length === 2 &&
          ('' + arguments[0]).toLowerCase() === 'src') {
        this.srcObject = streams.get(arguments[1]) || null;
      }
      return nativeSetAttribute.apply(this, arguments);
    };
  }
};

// Export.
module.exports = {
  log: utils.log,
  disableLog: utils.disableLog,
  browserDetails: utils.detectBrowser(),
  extractVersion: utils.extractVersion,
  shimCreateObjectURL: utils.shimCreateObjectURL,
  detectBrowser: utils.detectBrowser.bind(utils)
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var randomFromSeed = __webpack_require__(49);

var ORIGINAL = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
var alphabet;
var previousSeed;

var shuffled;

function reset() {
    shuffled = false;
}

function setCharacters(_alphabet_) {
    if (!_alphabet_) {
        if (alphabet !== ORIGINAL) {
            alphabet = ORIGINAL;
            reset();
        }
        return;
    }

    if (_alphabet_ === alphabet) {
        return;
    }

    if (_alphabet_.length !== ORIGINAL.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. You submitted ' + _alphabet_.length + ' characters: ' + _alphabet_);
    }

    var unique = _alphabet_.split('').filter(function(item, ind, arr){
       return ind !== arr.lastIndexOf(item);
    });

    if (unique.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. These characters were not unique: ' + unique.join(', '));
    }

    alphabet = _alphabet_;
    reset();
}

function characters(_alphabet_) {
    setCharacters(_alphabet_);
    return alphabet;
}

function setSeed(seed) {
    randomFromSeed.seed(seed);
    if (previousSeed !== seed) {
        reset();
        previousSeed = seed;
    }
}

function shuffle() {
    if (!alphabet) {
        setCharacters(ORIGINAL);
    }

    var sourceArray = alphabet.split('');
    var targetArray = [];
    var r = randomFromSeed.nextValue();
    var characterIndex;

    while (sourceArray.length > 0) {
        r = randomFromSeed.nextValue();
        characterIndex = Math.floor(r * sourceArray.length);
        targetArray.push(sourceArray.splice(characterIndex, 1)[0]);
    }
    return targetArray.join('');
}

function getShuffled() {
    if (shuffled) {
        return shuffled;
    }
    shuffled = shuffle();
    return shuffled;
}

/**
 * lookup shuffled letter
 * @param index
 * @returns {string}
 */
function lookup(index) {
    var alphabetShuffled = getShuffled();
    return alphabetShuffled[index];
}

module.exports = {
    characters: characters,
    seed: setSeed,
    lookup: lookup,
    shuffled: getShuffled
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname) {(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory((function webpackLoadOptionalExternalModule() { try { return __webpack_require__(8); } catch(e) {} }()), __webpack_require__(4));
	else if(typeof define === 'function' && define.amd)
		define(["fs", "path"], factory);
	else if(typeof exports === 'object')
		exports["Twig"] = factory((function webpackLoadOptionalExternalModule() { try { return require("fs"); } catch(e) {} }()), require("path"));
	else
		root["Twig"] = factory(root["fs"], root["path"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_19__, __WEBPACK_EXTERNAL_MODULE_20__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Twig.js
	 *
	 * @copyright 2011-2016 John Roepke and the Twig.js Contributors
	 * @license   Available under the BSD 2-Clause License
	 * @link      https://github.com/twigjs/twig.js
	 */

	var Twig = {
	    VERSION: '0.10.2'
	};

	__webpack_require__(1)(Twig);
	__webpack_require__(2)(Twig);
	__webpack_require__(3)(Twig);
	__webpack_require__(5)(Twig);
	__webpack_require__(6)(Twig);
	__webpack_require__(7)(Twig);
	__webpack_require__(17)(Twig);
	__webpack_require__(18)(Twig);
	__webpack_require__(21)(Twig);
	__webpack_require__(22)(Twig);
	__webpack_require__(23)(Twig);
	__webpack_require__(24)(Twig);
	__webpack_require__(25)(Twig);
	__webpack_require__(26)(Twig);
	__webpack_require__(27)(Twig);

	module.exports = Twig.exports;


/***/ },
/* 1 */
/***/ function(module, exports) {

	// ## twig.core.js
	//
	// This file handles template level tokenizing, compiling and parsing.
	module.exports = function (Twig) {
	    "use strict";

	    Twig.trace = false;
	    Twig.debug = false;

	    // Default caching to true for the improved performance it offers
	    Twig.cache = true;

	    Twig.noop = function() {};

	    Twig.placeholders = {
	        parent: "{{|PARENT|}}"
	    };

	    /**
	     * Fallback for Array.indexOf for IE8 et al
	     */
	    Twig.indexOf = function (arr, searchElement /*, fromIndex */ ) {
	        if (Array.prototype.hasOwnProperty("indexOf")) {
	            return arr.indexOf(searchElement);
	        }
	        if (arr === void 0 || arr === null) {
	            throw new TypeError();
	        }
	        var t = Object(arr);
	        var len = t.length >>> 0;
	        if (len === 0) {
	            return -1;
	        }
	        var n = 0;
	        if (arguments.length > 0) {
	            n = Number(arguments[1]);
	            if (n !== n) { // shortcut for verifying if it's NaN
	                n = 0;
	            } else if (n !== 0 && n !== Infinity && n !== -Infinity) {
	                n = (n > 0 || -1) * Math.floor(Math.abs(n));
	            }
	        }
	        if (n >= len) {
	            // console.log("indexOf not found1 ", JSON.stringify(searchElement), JSON.stringify(arr));
	            return -1;
	        }
	        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
	        for (; k < len; k++) {
	            if (k in t && t[k] === searchElement) {
	                return k;
	            }
	        }
	        if (arr == searchElement) {
	            return 0;
	        }
	        // console.log("indexOf not found2 ", JSON.stringify(searchElement), JSON.stringify(arr));

	        return -1;
	    }

	    Twig.forEach = function (arr, callback, thisArg) {
	        if (Array.prototype.forEach ) {
	            return arr.forEach(callback, thisArg);
	        }

	        var T, k;

	        if ( arr == null ) {
	          throw new TypeError( " this is null or not defined" );
	        }

	        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
	        var O = Object(arr);

	        // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
	        // 3. Let len be ToUint32(lenValue).
	        var len = O.length >>> 0; // Hack to convert O.length to a UInt32

	        // 4. If IsCallable(callback) is false, throw a TypeError exception.
	        // See: http://es5.github.com/#x9.11
	        if ( {}.toString.call(callback) != "[object Function]" ) {
	          throw new TypeError( callback + " is not a function" );
	        }

	        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
	        if ( thisArg ) {
	          T = thisArg;
	        }

	        // 6. Let k be 0
	        k = 0;

	        // 7. Repeat, while k < len
	        while( k < len ) {

	          var kValue;

	          // a. Let Pk be ToString(k).
	          //   This is implicit for LHS operands of the in operator
	          // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
	          //   This step can be combined with c
	          // c. If kPresent is true, then
	          if ( k in O ) {

	            // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
	            kValue = O[ k ];

	            // ii. Call the Call internal method of callback with T as the this value and
	            // argument list containing kValue, k, and O.
	            callback.call( T, kValue, k, O );
	          }
	          // d. Increase k by 1.
	          k++;
	        }
	        // 8. return undefined
	    };

	    Twig.merge = function(target, source, onlyChanged) {
	        Twig.forEach(Object.keys(source), function (key) {
	            if (onlyChanged && !(key in target)) {
	                return;
	            }

	            target[key] = source[key]
	        });

	        return target;
	    };

	    /**
	     * Exception thrown by twig.js.
	     */
	    Twig.Error = function(message) {
	       this.message = message;
	       this.name = "TwigException";
	       this.type = "TwigException";
	    };

	    /**
	     * Get the string representation of a Twig error.
	     */
	    Twig.Error.prototype.toString = function() {
	        var output = this.name + ": " + this.message;

	        return output;
	    };

	    /**
	     * Wrapper for logging to the console.
	     */
	    Twig.log = {
	        trace: function() {if (Twig.trace && console) {console.log(Array.prototype.slice.call(arguments));}},
	        debug: function() {if (Twig.debug && console) {console.log(Array.prototype.slice.call(arguments));}}
	    };


	    if (typeof console !== "undefined") {
	        if (typeof console.error !== "undefined") {
	            Twig.log.error = function() {
	                console.error.apply(console, arguments);
	            }
	        } else if (typeof console.log !== "undefined") {
	            Twig.log.error = function() {
	                console.log.apply(console, arguments);
	            }
	        }
	    } else {
	        Twig.log.error = function(){};
	    }

	    /**
	     * Wrapper for child context objects in Twig.
	     *
	     * @param {Object} context Values to initialize the context with.
	     */
	    Twig.ChildContext = function(context) {
	        var ChildContext = function ChildContext() {};
	        ChildContext.prototype = context;
	        return new ChildContext();
	    };

	    /**
	     * Container for methods related to handling high level template tokens
	     *      (for example: {{ expression }}, {% logic %}, {# comment #}, raw data)
	     */
	    Twig.token = {};

	    /**
	     * Token types.
	     */
	    Twig.token.type = {
	        output:                 'output',
	        logic:                  'logic',
	        comment:                'comment',
	        raw:                    'raw',
	        output_whitespace_pre:  'output_whitespace_pre',
	        output_whitespace_post: 'output_whitespace_post',
	        output_whitespace_both: 'output_whitespace_both',
	        logic_whitespace_pre:   'logic_whitespace_pre',
	        logic_whitespace_post:  'logic_whitespace_post',
	        logic_whitespace_both:  'logic_whitespace_both'
	    };

	    /**
	     * Token syntax definitions.
	     */
	    Twig.token.definitions = [
	        {
	            type: Twig.token.type.raw,
	            open: '{% raw %}',
	            close: '{% endraw %}'
	        },
	        {
	            type: Twig.token.type.raw,
	            open: '{% verbatim %}',
	            close: '{% endverbatim %}'
	        },
	        // *Whitespace type tokens*
	        //
	        // These typically take the form `{{- expression -}}` or `{{- expression }}` or `{{ expression -}}`.
	        {
	            type: Twig.token.type.output_whitespace_pre,
	            open: '{{-',
	            close: '}}'
	        },
	        {
	            type: Twig.token.type.output_whitespace_post,
	            open: '{{',
	            close: '-}}'
	        },
	        {
	            type: Twig.token.type.output_whitespace_both,
	            open: '{{-',
	            close: '-}}'
	        },
	        {
	            type: Twig.token.type.logic_whitespace_pre,
	            open: '{%-',
	            close: '%}'
	        },
	        {
	            type: Twig.token.type.logic_whitespace_post,
	            open: '{%',
	            close: '-%}'
	        },
	        {
	            type: Twig.token.type.logic_whitespace_both,
	            open: '{%-',
	            close: '-%}'
	        },
	        // *Output type tokens*
	        //
	        // These typically take the form `{{ expression }}`.
	        {
	            type: Twig.token.type.output,
	            open: '{{',
	            close: '}}'
	        },
	        // *Logic type tokens*
	        //
	        // These typically take a form like `{% if expression %}` or `{% endif %}`
	        {
	            type: Twig.token.type.logic,
	            open: '{%',
	            close: '%}'
	        },
	        // *Comment type tokens*
	        //
	        // These take the form `{# anything #}`
	        {
	            type: Twig.token.type.comment,
	            open: '{#',
	            close: '#}'
	        }
	    ];


	    /**
	     * What characters start "strings" in token definitions. We need this to ignore token close
	     * strings inside an expression.
	     */
	    Twig.token.strings = ['"', "'"];

	    Twig.token.findStart = function (template) {
	        var output = {
	                position: null,
	                close_position: null,
	                def: null
	            },
	            i,
	            token_template,
	            first_key_position,
	            close_key_position;

	        for (i=0;i<Twig.token.definitions.length;i++) {
	            token_template = Twig.token.definitions[i];
	            first_key_position = template.indexOf(token_template.open);
	            close_key_position = template.indexOf(token_template.close);

	            Twig.log.trace("Twig.token.findStart: ", "Searching for ", token_template.open, " found at ", first_key_position);

	            //Special handling for mismatched tokens
	            if (first_key_position >= 0) {
	                //This token matches the template
	                if (token_template.open.length !== token_template.close.length) {
	                    //This token has mismatched closing and opening tags
	                    if (close_key_position < 0) {
	                        //This token's closing tag does not match the template
	                        continue;
	                    }
	                }
	            }
	            // Does this token occur before any other types?
	            if (first_key_position >= 0 && (output.position === null || first_key_position < output.position)) {
	                output.position = first_key_position;
	                output.def = token_template;
	                output.close_position = close_key_position;
	            } else if (first_key_position >= 0 && output.position !== null && first_key_position === output.position) {
	                /*This token exactly matches another token,
	                greedily match to check if this token has a greater specificity*/
	                if (token_template.open.length > output.def.open.length) {
	                    //This token's opening tag is more specific than the previous match
	                    output.position = first_key_position;
	                    output.def = token_template;
	                    output.close_position = close_key_position;
	                } else if (token_template.open.length === output.def.open.length) {
	                    if (token_template.close.length > output.def.close.length) {
	                        //This token's opening tag is as specific as the previous match,
	                        //but the closing tag has greater specificity
	                        if (close_key_position >= 0 && close_key_position < output.close_position) {
	                            //This token's closing tag exists in the template,
	                            //and it occurs sooner than the previous match
	                            output.position = first_key_position;
	                            output.def = token_template;
	                            output.close_position = close_key_position;
	                        }
	                    } else if (close_key_position >= 0 && close_key_position < output.close_position) {
	                        //This token's closing tag is not more specific than the previous match,
	                        //but it occurs sooner than the previous match
	                        output.position = first_key_position;
	                        output.def = token_template;
	                        output.close_position = close_key_position;
	                    }
	                }
	            }
	        }

	        delete output['close_position'];

	        return output;
	    };

	    Twig.token.findEnd = function (template, token_def, start) {
	        var end = null,
	            found = false,
	            offset = 0,

	            // String position variables
	            str_pos = null,
	            str_found = null,
	            pos = null,
	            end_offset = null,
	            this_str_pos = null,
	            end_str_pos = null,

	            // For loop variables
	            i,
	            l;

	        while (!found) {
	            str_pos = null;
	            str_found = null;
	            pos = template.indexOf(token_def.close, offset);

	            if (pos >= 0) {
	                end = pos;
	                found = true;
	            } else {
	                // throw an exception
	                throw new Twig.Error("Unable to find closing bracket '" + token_def.close +
	                                "'" + " opened near template position " + start);
	            }

	            // Ignore quotes within comments; just look for the next comment close sequence,
	            // regardless of what comes before it. https://github.com/justjohn/twig.js/issues/95
	            if (token_def.type === Twig.token.type.comment) {
	              break;
	            }
	            // Ignore quotes within raw tag
	            // Fixes #283
	            if (token_def.type === Twig.token.type.raw) {
	                break;
	            }

	            l = Twig.token.strings.length;
	            for (i = 0; i < l; i += 1) {
	                this_str_pos = template.indexOf(Twig.token.strings[i], offset);

	                if (this_str_pos > 0 && this_str_pos < pos &&
	                        (str_pos === null || this_str_pos < str_pos)) {
	                    str_pos = this_str_pos;
	                    str_found = Twig.token.strings[i];
	                }
	            }

	            // We found a string before the end of the token, now find the string's end and set the search offset to it
	            if (str_pos !== null) {
	                end_offset = str_pos + 1;
	                end = null;
	                found = false;
	                while (true) {
	                    end_str_pos = template.indexOf(str_found, end_offset);
	                    if (end_str_pos < 0) {
	                        throw "Unclosed string in template";
	                    }
	                    // Ignore escaped quotes
	                    if (template.substr(end_str_pos - 1, 1) !== "\\") {
	                        offset = end_str_pos + 1;
	                        break;
	                    } else {
	                        end_offset = end_str_pos + 1;
	                    }
	                }
	            }
	        }
	        return end;
	    };

	    /**
	     * Convert a template into high-level tokens.
	     */
	    Twig.tokenize = function (template) {
	        var tokens = [],
	            // An offset for reporting errors locations in the template.
	            error_offset = 0,

	            // The start and type of the first token found in the template.
	            found_token = null,
	            // The end position of the matched token.
	            end = null;

	        while (template.length > 0) {
	            // Find the first occurance of any token type in the template
	            found_token = Twig.token.findStart(template);

	            Twig.log.trace("Twig.tokenize: ", "Found token: ", found_token);

	            if (found_token.position !== null) {
	                // Add a raw type token for anything before the start of the token
	                if (found_token.position > 0) {
	                    tokens.push({
	                        type: Twig.token.type.raw,
	                        value: template.substring(0, found_token.position)
	                    });
	                }
	                template = template.substr(found_token.position + found_token.def.open.length);
	                error_offset += found_token.position + found_token.def.open.length;

	                // Find the end of the token
	                end = Twig.token.findEnd(template, found_token.def, error_offset);

	                Twig.log.trace("Twig.tokenize: ", "Token ends at ", end);

	                tokens.push({
	                    type:  found_token.def.type,
	                    value: template.substring(0, end).trim()
	                });

	                if (template.substr( end + found_token.def.close.length, 1 ) === "\n") {
	                    switch (found_token.def.type) {
	                        case "logic_whitespace_pre":
	                        case "logic_whitespace_post":
	                        case "logic_whitespace_both":
	                        case "logic":
	                            // Newlines directly after logic tokens are ignored
	                            end += 1;
	                            break;
	                    }
	                }

	                template = template.substr(end + found_token.def.close.length);

	                // Increment the position in the template
	                error_offset += end + found_token.def.close.length;

	            } else {
	                // No more tokens -> add the rest of the template as a raw-type token
	                tokens.push({
	                    type: Twig.token.type.raw,
	                    value: template
	                });
	                template = '';
	            }
	        }

	        return tokens;
	    };


	    Twig.compile = function (tokens) {
	        try {

	            // Output and intermediate stacks
	            var output = [],
	                stack = [],
	                // The tokens between open and close tags
	                intermediate_output = [],

	                token = null,
	                logic_token = null,
	                unclosed_token = null,
	                // Temporary previous token.
	                prev_token = null,
	                // Temporary previous output.
	                prev_output = null,
	                // Temporary previous intermediate output.
	                prev_intermediate_output = null,
	                // The previous token's template
	                prev_template = null,
	                // Token lookahead
	                next_token = null,
	                // The output token
	                tok_output = null,

	                // Logic Token values
	                type = null,
	                open = null,
	                next = null;

	            var compile_output = function(token) {
	                Twig.expression.compile.apply(this, [token]);
	                if (stack.length > 0) {
	                    intermediate_output.push(token);
	                } else {
	                    output.push(token);
	                }
	            };

	            var compile_logic = function(token) {
	                // Compile the logic token
	                logic_token = Twig.logic.compile.apply(this, [token]);

	                type = logic_token.type;
	                open = Twig.logic.handler[type].open;
	                next = Twig.logic.handler[type].next;

	                Twig.log.trace("Twig.compile: ", "Compiled logic token to ", logic_token,
	                                                 " next is: ", next, " open is : ", open);

	                // Not a standalone token, check logic stack to see if this is expected
	                if (open !== undefined && !open) {
	                    prev_token = stack.pop();
	                    prev_template = Twig.logic.handler[prev_token.type];

	                    if (Twig.indexOf(prev_template.next, type) < 0) {
	                        throw new Error(type + " not expected after a " + prev_token.type);
	                    }

	                    prev_token.output = prev_token.output || [];

	                    prev_token.output = prev_token.output.concat(intermediate_output);
	                    intermediate_output = [];

	                    tok_output = {
	                        type: Twig.token.type.logic,
	                        token: prev_token
	                    };
	                    if (stack.length > 0) {
	                        intermediate_output.push(tok_output);
	                    } else {
	                        output.push(tok_output);
	                    }
	                }

	                // This token requires additional tokens to complete the logic structure.
	                if (next !== undefined && next.length > 0) {
	                    Twig.log.trace("Twig.compile: ", "Pushing ", logic_token, " to logic stack.");

	                    if (stack.length > 0) {
	                        // Put any currently held output into the output list of the logic operator
	                        // currently at the head of the stack before we push a new one on.
	                        prev_token = stack.pop();
	                        prev_token.output = prev_token.output || [];
	                        prev_token.output = prev_token.output.concat(intermediate_output);
	                        stack.push(prev_token);
	                        intermediate_output = [];
	                    }

	                    // Push the new logic token onto the logic stack
	                    stack.push(logic_token);

	                } else if (open !== undefined && open) {
	                    tok_output = {
	                        type: Twig.token.type.logic,
	                        token: logic_token
	                    };
	                    // Standalone token (like {% set ... %}
	                    if (stack.length > 0) {
	                        intermediate_output.push(tok_output);
	                    } else {
	                        output.push(tok_output);
	                    }
	                }
	            };

	            while (tokens.length > 0) {
	                token = tokens.shift();
	                prev_output = output[output.length - 1];
	                prev_intermediate_output = intermediate_output[intermediate_output.length - 1];
	                next_token = tokens[0];
	                Twig.log.trace("Compiling token ", token);
	                switch (token.type) {
	                    case Twig.token.type.raw:
	                        if (stack.length > 0) {
	                            intermediate_output.push(token);
	                        } else {
	                            output.push(token);
	                        }
	                        break;

	                    case Twig.token.type.logic:
	                        compile_logic.call(this, token);
	                        break;

	                    // Do nothing, comments should be ignored
	                    case Twig.token.type.comment:
	                        break;

	                    case Twig.token.type.output:
	                        compile_output.call(this, token);
	                        break;

	                    //Kill whitespace ahead and behind this token
	                    case Twig.token.type.logic_whitespace_pre:
	                    case Twig.token.type.logic_whitespace_post:
	                    case Twig.token.type.logic_whitespace_both:
	                    case Twig.token.type.output_whitespace_pre:
	                    case Twig.token.type.output_whitespace_post:
	                    case Twig.token.type.output_whitespace_both:
	                        if (token.type !== Twig.token.type.output_whitespace_post && token.type !== Twig.token.type.logic_whitespace_post) {
	                            if (prev_output) {
	                                //If the previous output is raw, pop it off
	                                if (prev_output.type === Twig.token.type.raw) {
	                                    output.pop();

	                                    //If the previous output is not just whitespace, trim it
	                                    if (prev_output.value.match(/^\s*$/) === null) {
	                                        prev_output.value = prev_output.value.trim();
	                                        //Repush the previous output
	                                        output.push(prev_output);
	                                    }
	                                }
	                            }

	                            if (prev_intermediate_output) {
	                                //If the previous intermediate output is raw, pop it off
	                                if (prev_intermediate_output.type === Twig.token.type.raw) {
	                                    intermediate_output.pop();

	                                    //If the previous output is not just whitespace, trim it
	                                    if (prev_intermediate_output.value.match(/^\s*$/) === null) {
	                                        prev_intermediate_output.value = prev_intermediate_output.value.trim();
	                                        //Repush the previous intermediate output
	                                        intermediate_output.push(prev_intermediate_output);
	                                    }
	                                }
	                            }
	                        }

	                        //Compile this token
	                        switch (token.type) {
	                            case Twig.token.type.output_whitespace_pre:
	                            case Twig.token.type.output_whitespace_post:
	                            case Twig.token.type.output_whitespace_both:
	                                compile_output.call(this, token);
	                                break;
	                            case Twig.token.type.logic_whitespace_pre:
	                            case Twig.token.type.logic_whitespace_post:
	                            case Twig.token.type.logic_whitespace_both:
	                                compile_logic.call(this, token);
	                                break;
	                        }

	                        if (token.type !== Twig.token.type.output_whitespace_pre && token.type !== Twig.token.type.logic_whitespace_pre) {
	                            if (next_token) {
	                                //If the next token is raw, shift it out
	                                if (next_token.type === Twig.token.type.raw) {
	                                    tokens.shift();

	                                    //If the next token is not just whitespace, trim it
	                                    if (next_token.value.match(/^\s*$/) === null) {
	                                        next_token.value = next_token.value.trim();
	                                        //Unshift the next token
	                                        tokens.unshift(next_token);
	                                    }
	                                }
	                            }
	                        }

	                        break;
	                }

	                Twig.log.trace("Twig.compile: ", " Output: ", output,
	                                                 " Logic Stack: ", stack,
	                                                 " Pending Output: ", intermediate_output );
	            }

	            // Verify that there are no logic tokens left in the stack.
	            if (stack.length > 0) {
	                unclosed_token = stack.pop();
	                throw new Error("Unable to find an end tag for " + unclosed_token.type +
	                                ", expecting one of " + unclosed_token.next);
	            }
	            return output;
	        } catch (ex) {
	            if (this.options.rethrow) {
	                throw ex
	            }
	            else {
	                Twig.log.error("Error compiling twig template " + this.id + ": ");
	                if (ex.stack) {
	                    Twig.log.error(ex.stack);
	                } else {
	                    Twig.log.error(ex.toString());
	                }
	            }
	        }
	    };

	    /**
	     * Parse a compiled template.
	     *
	     * @param {Array} tokens The compiled tokens.
	     * @param {Object} context The render context.
	     *
	     * @return {string} The parsed template.
	     */
	    Twig.parse = function (tokens, context, allow_async) {
	        var that = this,
	            output = [],

	            // Store any error that might be thrown by the promise chain.
	            err = null,

	            // This will be set to is_async if template renders synchronously
	            is_async = true,
	            promise = null,

	            // Track logic chains
	            chain = true;


	        function handleException(ex) {
	            if (that.options.rethrow) {
	                throw ex;
	            }
	            else {
	                Twig.log.error("Error parsing twig template " + that.id + ": ");
	                if (ex.stack) {
	                    Twig.log.error(ex.stack);
	                } else {
	                    Twig.log.error(ex.toString());
	                }

	                if (Twig.debug) {
	                    return ex.toString();
	                }
	            }
	        }

	        promise = Twig.async.forEach(tokens, function parseToken(token) {
	            Twig.log.debug("Twig.parse: ", "Parsing token: ", token);

	            switch (token.type) {
	                case Twig.token.type.raw:
	                    output.push(Twig.filters.raw(token.value));
	                    break;

	                case Twig.token.type.logic:
	                    var logic_token = token.token;

	                    return Twig.logic.parseAsync.apply(that, [logic_token, context, chain])
	                    .then(function(logic) {
	                        if (logic.chain !== undefined) {
	                            chain = logic.chain;
	                        }
	                        if (logic.context !== undefined) {
	                            context = logic.context;
	                        }
	                        if (logic.output !== undefined) {
	                            output.push(logic.output);
	                        }
	                    });
	                    break;

	                case Twig.token.type.comment:
	                    // Do nothing, comments should be ignored
	                    break;

	                //Fall through whitespace to output
	                case Twig.token.type.output_whitespace_pre:
	                case Twig.token.type.output_whitespace_post:
	                case Twig.token.type.output_whitespace_both:
	                case Twig.token.type.output:
	                    Twig.log.debug("Twig.parse: ", "Output token: ", token.stack);
	                    // Parse the given expression in the given context
	                    return Twig.expression.parseAsync.apply(that, [token.stack, context])
	                    .then(function(o) {
	                        output.push(o);
	                    });
	            }
	        })
	        .then(function() {
	            output = Twig.output.apply(that, [output]);
	            is_async = false;
	            return output;
	        })
	        .catch(function(e) {
	            if (allow_async)
	                handleException(e);

	            err = e;
	        });

	        // If `allow_async` we will always return a promise since we do not
	        // know in advance if we are going to run asynchronously or not.
	        if (allow_async)
	            return promise;

	        // Handle errors here if we fail synchronously.
	        if (err !== null)
	            return handleException(err);

	        // If `allow_async` is not true we should not allow the user
	        // to use asynchronous functions or filters.
	        if (is_async)
	            throw new Twig.Error('You are using Twig.js in sync mode in combination with async extensions.');

	        return output;
	    };

	    /**
	     * Tokenize and compile a string template.
	     *
	     * @param {string} data The template.
	     *
	     * @return {Array} The compiled tokens.
	     */
	    Twig.prepare = function(data) {
	        var tokens, raw_tokens;

	        // Tokenize
	        Twig.log.debug("Twig.prepare: ", "Tokenizing ", data);
	        raw_tokens = Twig.tokenize.apply(this, [data]);

	        // Compile
	        Twig.log.debug("Twig.prepare: ", "Compiling ", raw_tokens);
	        tokens = Twig.compile.apply(this, [raw_tokens]);

	        Twig.log.debug("Twig.prepare: ", "Compiled ", tokens);

	        return tokens;
	    };

	    /**
	     * Join the output token's stack and escape it if needed
	     *
	     * @param {Array} Output token's stack
	     *
	     * @return {string|String} Autoescaped output
	     */
	    Twig.output = function(output) {
	        if (!this.options.autoescape) {
	            return output.join("");
	        }

	        var strategy = 'html';
	        if(typeof this.options.autoescape == 'string')
	            strategy = this.options.autoescape;

	        // [].map would be better but it's not supported by IE8-
	        var escaped_output = [];
	        Twig.forEach(output, function (str) {
	            if (str && (str.twig_markup !== true && str.twig_markup != strategy)) {
	                str = Twig.filters.escape(str, [ strategy ]);
	            }
	            escaped_output.push(str);
	        });
	        return Twig.Markup(escaped_output.join(""));
	    }

	    // Namespace for template storage and retrieval
	    Twig.Templates = {
	        /**
	         * Registered template loaders - use Twig.Templates.registerLoader to add supported loaders
	         * @type {Object}
	         */
	        loaders: {},

	        /**
	         * Registered template parsers - use Twig.Templates.registerParser to add supported parsers
	         * @type {Object}
	         */
	        parsers: {},

	        /**
	         * Cached / loaded templates
	         * @type {Object}
	         */
	        registry: {}
	    };

	    /**
	     * Is this id valid for a twig template?
	     *
	     * @param {string} id The ID to check.
	     *
	     * @throws {Twig.Error} If the ID is invalid or used.
	     * @return {boolean} True if the ID is valid.
	     */
	    Twig.validateId = function(id) {
	        if (id === "prototype") {
	            throw new Twig.Error(id + " is not a valid twig identifier");
	        } else if (Twig.cache && Twig.Templates.registry.hasOwnProperty(id)) {
	            throw new Twig.Error("There is already a template with the ID " + id);
	        }
	        return true;
	    }

	    /**
	     * Register a template loader
	     *
	     * @example
	     * Twig.extend(function(Twig) {
	     *    Twig.Templates.registerLoader('custom_loader', function(location, params, callback, error_callback) {
	     *        // ... load the template ...
	     *        params.data = loadedTemplateData;
	     *        // create and return the template
	     *        var template = new Twig.Template(params);
	     *        if (typeof callback === 'function') {
	     *            callback(template);
	     *        }
	     *        return template;
	     *    });
	     * });
	     *
	     * @param {String} method_name The method this loader is intended for (ajax, fs)
	     * @param {Function} func The function to execute when loading the template
	     * @param {Object|undefined} scope Optional scope parameter to bind func to
	     *
	     * @throws Twig.Error
	     *
	     * @return {void}
	     */
	    Twig.Templates.registerLoader = function(method_name, func, scope) {
	        if (typeof func !== 'function') {
	            throw new Twig.Error('Unable to add loader for ' + method_name + ': Invalid function reference given.');
	        }
	        if (scope) {
	            func = func.bind(scope);
	        }
	        this.loaders[method_name] = func;
	    };

	    /**
	     * Remove a registered loader
	     *
	     * @param {String} method_name The method name for the loader you wish to remove
	     *
	     * @return {void}
	     */
	    Twig.Templates.unRegisterLoader = function(method_name) {
	        if (this.isRegisteredLoader(method_name)) {
	            delete this.loaders[method_name];
	        }
	    };

	    /**
	     * See if a loader is registered by its method name
	     *
	     * @param {String} method_name The name of the loader you are looking for
	     *
	     * @return {boolean}
	     */
	    Twig.Templates.isRegisteredLoader = function(method_name) {
	        return this.loaders.hasOwnProperty(method_name);
	    };

	    /**
	     * Register a template parser
	     *
	     * @example
	     * Twig.extend(function(Twig) {
	     *    Twig.Templates.registerParser('custom_parser', function(params) {
	     *        // this template source can be accessed in params.data
	     *        var template = params.data
	     *
	     *        // ... custom process that modifies the template
	     *
	     *        // return the parsed template
	     *        return template;
	     *    });
	     * });
	     *
	     * @param {String} method_name The method this parser is intended for (twig, source)
	     * @param {Function} func The function to execute when parsing the template
	     * @param {Object|undefined} scope Optional scope parameter to bind func to
	     *
	     * @throws Twig.Error
	     *
	     * @return {void}
	     */
	    Twig.Templates.registerParser = function(method_name, func, scope) {
	        if (typeof func !== 'function') {
	            throw new Twig.Error('Unable to add parser for ' + method_name + ': Invalid function regerence given.');
	        }

	        if (scope) {
	            func = func.bind(scope);
	        }

	        this.parsers[method_name] = func;
	    };

	    /**
	     * Remove a registered parser
	     *
	     * @param {String} method_name The method name for the parser you wish to remove
	     *
	     * @return {void}
	     */
	    Twig.Templates.unRegisterParser = function(method_name) {
	        if (this.isRegisteredParser(method_name)) {
	            delete this.parsers[method_name];
	        }
	    };

	    /**
	     * See if a parser is registered by its method name
	     *
	     * @param {String} method_name The name of the parser you are looking for
	     *
	     * @return {boolean}
	     */
	    Twig.Templates.isRegisteredParser = function(method_name) {
	        return this.parsers.hasOwnProperty(method_name);
	    };

	    /**
	     * Save a template object to the store.
	     *
	     * @param {Twig.Template} template   The twig.js template to store.
	     */
	    Twig.Templates.save = function(template) {
	        if (template.id === undefined) {
	            throw new Twig.Error("Unable to save template with no id");
	        }
	        Twig.Templates.registry[template.id] = template;
	    };

	    /**
	     * Load a previously saved template from the store.
	     *
	     * @param {string} id   The ID of the template to load.
	     *
	     * @return {Twig.Template} A twig.js template stored with the provided ID.
	     */
	    Twig.Templates.load = function(id) {
	        if (!Twig.Templates.registry.hasOwnProperty(id)) {
	            return null;
	        }
	        return Twig.Templates.registry[id];
	    };

	    /**
	     * Load a template from a remote location using AJAX and saves in with the given ID.
	     *
	     * Available parameters:
	     *
	     *      async:       Should the HTTP request be performed asynchronously.
	     *                      Defaults to true.
	     *      method:      What method should be used to load the template
	     *                      (fs or ajax)
	     *      parser:      What method should be used to parse the template
	     *                      (twig or source)
	     *      precompiled: Has the template already been compiled.
	     *
	     * @param {string} location  The remote URL to load as a template.
	     * @param {Object} params The template parameters.
	     * @param {function} callback  A callback triggered when the template finishes loading.
	     * @param {function} error_callback  A callback triggered if an error occurs loading the template.
	     *
	     *
	     */
	    Twig.Templates.loadRemote = function(location, params, callback, error_callback) {
	        var loader;

	        // Default to async
	        if (params.async === undefined) {
	            params.async = true;
	        }

	        // Default to the URL so the template is cached.
	        if (params.id === undefined) {
	            params.id = location;
	        }

	        // Check for existing template
	        if (Twig.cache && Twig.Templates.registry.hasOwnProperty(params.id)) {
	            // A template is already saved with the given id.
	            if (typeof callback === 'function') {
	                callback(Twig.Templates.registry[params.id]);
	            }
	            // TODO: if async, return deferred promise
	            return Twig.Templates.registry[params.id];
	        }

	        //if the parser name hasn't been set, default it to twig
	        params.parser = params.parser || 'twig';

	        // Assume 'fs' if the loader is not defined
	        loader = this.loaders[params.method] || this.loaders.fs;
	        return loader.apply(this, arguments);
	    };

	    // Determine object type
	    function is(type, obj) {
	        var clas = Object.prototype.toString.call(obj).slice(8, -1);
	        return obj !== undefined && obj !== null && clas === type;
	    }

	    /**
	     * Create a new twig.js template.
	     *
	     * Parameters: {
	     *      data:   The template, either pre-compiled tokens or a string template
	     *      id:     The name of this template
	     *      blocks: Any pre-existing block from a child template
	     * }
	     *
	     * @param {Object} params The template parameters.
	     */
	    Twig.Template = function ( params ) {
	        var data = params.data,
	            id = params.id,
	            blocks = params.blocks,
	            macros = params.macros || {},
	            base = params.base,
	            path = params.path,
	            url = params.url,
	            name = params.name,
	            method = params.method,
	            // parser options
	            options = params.options;

	        // # What is stored in a Twig.Template
	        //
	        // The Twig Template hold several chucks of data.
	        //
	        //     {
	        //          id:     The token ID (if any)
	        //          tokens: The list of tokens that makes up this template.
	        //          blocks: The list of block this template contains.
	        //          base:   The base template (if any)
	        //            options:  {
	        //                Compiler/parser options
	        //
	        //                strict_variables: true/false
	        //                    Should missing variable/keys emit an error message. If false, they default to null.
	        //            }
	        //     }
	        //

	        this.id     = id;
	        this.method = method;
	        this.base   = base;
	        this.path   = path;
	        this.url    = url;
	        this.name   = name;
	        this.macros = macros;
	        this.options = options;

	        this.reset(blocks);

	        if (is('String', data)) {
	            this.tokens = Twig.prepare.apply(this, [data]);
	        } else {
	            this.tokens = data;
	        }

	        if (id !== undefined) {
	            Twig.Templates.save(this);
	        }
	    };

	    Twig.Template.prototype.reset = function(blocks) {
	        Twig.log.debug("Twig.Template.reset", "Reseting template " + this.id);
	        this.blocks = {};
	        this.importedBlocks = [];
	        this.originalBlockTokens = {};
	        this.child = {
	            blocks: blocks || {}
	        };
	        this.extend = null;
	    };

	    Twig.Template.prototype.render = function (context, params, allow_async) {
	        params = params || {};

	        var that = this,

	            // Store any error that might be thrown by the promise chain.
	            err = null,

	            // This will be set to is_async if template renders synchronously
	            is_async = true,
	            promise = null,

	            result,
	            url;

	        this.context = context || {};

	        // Clear any previous state
	        this.reset();
	        if (params.blocks) {
	            this.blocks = params.blocks;
	        }
	        if (params.macros) {
	            this.macros = params.macros;
	        }

	        var cb = function(output) {
	            // Does this template extend another
	            if (that.extend) {
	                var ext_template;

	                // check if the template is provided inline
	                if ( that.options.allowInlineIncludes ) {
	                    ext_template = Twig.Templates.load(that.extend);
	                    if ( ext_template ) {
	                        ext_template.options = that.options;
	                    }
	                }

	                // check for the template file via include
	                if (!ext_template) {
	                    url = Twig.path.parsePath(that, that.extend);

	                    ext_template = Twig.Templates.loadRemote(url, {
	                        method: that.getLoaderMethod(),
	                        base: that.base,
	                        async:  false,
	                        id:     url,
	                        options: that.options
	                    });
	                }

	                that.parent = ext_template;

	                return that.parent.renderAsync(that.context, {
	                    blocks: that.blocks
	                });
	            }

	            if (params.output == 'blocks') {
	                return that.blocks;
	            } else if (params.output == 'macros') {
	                return that.macros;
	            } else {
	                return output;
	            }
	        };

	        promise = Twig.parseAsync.apply(this, [this.tokens, this.context])
	        .then(cb)
	        .then(function(v) {
	            is_async = false;
	            result = v;
	            return v;
	        })
	        .catch(function(e) {
	            if (allow_async)
	                throw e;

	            err = e;
	        })

	        // If `allow_async` we will always return a promise since we do not
	        // know in advance if we are going to run asynchronously or not.
	        if (allow_async)
	            return promise;

	        // Handle errors here if we fail synchronously.
	        if (err !== null)
	            throw err;

	        // If `allow_async` is not true we should not allow the user
	        // to use asynchronous functions or filters.
	        if (is_async)
	            throw new Twig.Error('You are using Twig.js in sync mode in combination with async extensions.');

	        return result;
	    };

	    Twig.Template.prototype.importFile = function(file) {
	        var url, sub_template;
	        if (!this.url && this.options.allowInlineIncludes) {
	            file = this.path ? Twig.path.parsePath(this, file) : file;
	            sub_template = Twig.Templates.load(file);

	            if (!sub_template) {
	                sub_template = Twig.Templates.loadRemote(url, {
	                    id: file,
	                    method: this.getLoaderMethod(),
	                    async: false,
	                    path: file,
	                    options: this.options
	                });

	                if (!sub_template) {
	                    throw new Twig.Error("Unable to find the template " + file);
	                }
	            }

	            sub_template.options = this.options;

	            return sub_template;
	        }

	        url = Twig.path.parsePath(this, file);

	        // Load blocks from an external file
	        sub_template = Twig.Templates.loadRemote(url, {
	            method: this.getLoaderMethod(),
	            base: this.base,
	            async: false,
	            options: this.options,
	            id: url
	        });

	        return sub_template;
	    };

	    Twig.Template.prototype.importBlocks = function(file, override) {
	        var sub_template = this.importFile(file),
	            context = this.context,
	            that = this,
	            key;

	        override = override || false;

	        sub_template.render(context);

	        // Mixin blocks
	        Twig.forEach(Object.keys(sub_template.blocks), function(key) {
	            if (override || that.blocks[key] === undefined) {
	                that.blocks[key] = sub_template.blocks[key];
	                that.importedBlocks.push(key);
	            }
	        });
	    };

	    Twig.Template.prototype.importMacros = function(file) {
	        var url = Twig.path.parsePath(this, file);

	        // load remote template
	        var remoteTemplate = Twig.Templates.loadRemote(url, {
	            method: this.getLoaderMethod(),
	            async: false,
	            id: url
	        });

	        return remoteTemplate;
	    };

	    Twig.Template.prototype.getLoaderMethod = function() {
	        if (this.path) {
	            return 'fs';
	        }
	        if (this.url) {
	            return 'ajax';
	        }
	        return this.method || 'fs';
	    };

	    Twig.Template.prototype.compile = function(options) {
	        // compile the template into raw JS
	        return Twig.compiler.compile(this, options);
	    };

	    /**
	     * Create safe output
	     *
	     * @param {string} Content safe to output
	     *
	     * @return {String} Content wrapped into a String
	     */

	    Twig.Markup = function(content, strategy) {
	        if(typeof strategy == 'undefined') {
	            strategy = true;
	        }

	        if (typeof content === 'string' && content.length > 0) {
	            content = new String(content);
	            content.twig_markup = strategy;
	        }
	        return content;
	    };

	    return Twig;

	};


/***/ },
/* 2 */
/***/ function(module, exports) {

	// ## twig.compiler.js
	//
	// This file handles compiling templates into JS
	module.exports = function (Twig) {
	    /**
	     * Namespace for compilation.
	     */
	    Twig.compiler = {
	        module: {}
	    };

	    // Compile a Twig Template to output.
	    Twig.compiler.compile = function(template, options) {
	        // Get tokens
	        var tokens = JSON.stringify(template.tokens)
	            , id = template.id
	            , output;

	        if (options.module) {
	            if (Twig.compiler.module[options.module] === undefined) {
	                throw new Twig.Error("Unable to find module type " + options.module);
	            }
	            output = Twig.compiler.module[options.module](id, tokens, options.twig);
	        } else {
	            output = Twig.compiler.wrap(id, tokens);
	        }
	        return output;
	    };

	    Twig.compiler.module = {
	        amd: function(id, tokens, pathToTwig) {
	            return 'define(["' + pathToTwig + '"], function (Twig) {\n\tvar twig, templates;\ntwig = Twig.twig;\ntemplates = ' + Twig.compiler.wrap(id, tokens) + '\n\treturn templates;\n});';
	        }
	        , node: function(id, tokens) {
	            return 'var twig = require("twig").twig;\n'
	                + 'exports.template = ' + Twig.compiler.wrap(id, tokens)
	        }
	        , cjs2: function(id, tokens, pathToTwig) {
	            return 'module.declare([{ twig: "' + pathToTwig + '" }], function (require, exports, module) {\n'
	                        + '\tvar twig = require("twig").twig;\n'
	                        + '\texports.template = ' + Twig.compiler.wrap(id, tokens)
	                    + '\n});'
	        }
	    };

	    Twig.compiler.wrap = function(id, tokens) {
	        return 'twig({id:"'+id.replace('"', '\\"')+'", data:'+tokens+', precompiled: true});\n';
	    };

	    return Twig;
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// ## twig.expression.js
	//
	// This file handles tokenizing, compiling and parsing expressions.
	module.exports = function (Twig) {
	    "use strict";

	    function parseParams(thisArg, params, context) {
	        if (params)
	            return Twig.expression.parseAsync.apply(thisArg, [params, context]);

	        return Twig.Promise.resolve(false);
	    }

	    /**
	     * Namespace for expression handling.
	     */
	    Twig.expression = { };

	    __webpack_require__(4)(Twig);

	    /**
	     * Reserved word that can't be used as variable names.
	     */
	    Twig.expression.reservedWords = [
	        "true", "false", "null", "TRUE", "FALSE", "NULL", "_context", "and", "b-and", "or", "b-or", "b-xor", "in", "not in", "if"
	    ];

	    /**
	     * The type of tokens used in expressions.
	     */
	    Twig.expression.type = {
	        comma:      'Twig.expression.type.comma',
	        operator: {
	            unary:  'Twig.expression.type.operator.unary',
	            binary: 'Twig.expression.type.operator.binary'
	        },
	        string:     'Twig.expression.type.string',
	        bool:       'Twig.expression.type.bool',
	        slice:      'Twig.expression.type.slice',
	        array: {
	            start:  'Twig.expression.type.array.start',
	            end:    'Twig.expression.type.array.end'
	        },
	        object: {
	            start:  'Twig.expression.type.object.start',
	            end:    'Twig.expression.type.object.end'
	        },
	        parameter: {
	            start:  'Twig.expression.type.parameter.start',
	            end:    'Twig.expression.type.parameter.end'
	        },
	        subexpression: {
	            start:  'Twig.expression.type.subexpression.start',
	            end:    'Twig.expression.type.subexpression.end'
	        },
	        key: {
	            period:   'Twig.expression.type.key.period',
	            brackets: 'Twig.expression.type.key.brackets'
	        },
	        filter:     'Twig.expression.type.filter',
	        _function:  'Twig.expression.type._function',
	        variable:   'Twig.expression.type.variable',
	        number:     'Twig.expression.type.number',
	        _null:     'Twig.expression.type.null',
	        context:    'Twig.expression.type.context',
	        test:       'Twig.expression.type.test'
	    };

	    Twig.expression.set = {
	        // What can follow an expression (in general)
	        operations: [
	            Twig.expression.type.filter,
	            Twig.expression.type.operator.unary,
	            Twig.expression.type.operator.binary,
	            Twig.expression.type.array.end,
	            Twig.expression.type.object.end,
	            Twig.expression.type.parameter.end,
	            Twig.expression.type.subexpression.end,
	            Twig.expression.type.comma,
	            Twig.expression.type.test
	        ],
	        expressions: [
	            Twig.expression.type._function,
	            Twig.expression.type.bool,
	            Twig.expression.type.string,
	            Twig.expression.type.variable,
	            Twig.expression.type.number,
	            Twig.expression.type._null,
	            Twig.expression.type.context,
	            Twig.expression.type.parameter.start,
	            Twig.expression.type.array.start,
	            Twig.expression.type.object.start,
	            Twig.expression.type.subexpression.start,
	            Twig.expression.type.operator.unary
	        ]
	    };

	    // Most expressions allow a '.' or '[' after them, so we provide a convenience set
	    Twig.expression.set.operations_extended = Twig.expression.set.operations.concat([
	                    Twig.expression.type.key.period,
	                    Twig.expression.type.key.brackets,
	                    Twig.expression.type.slice]);

	    // Some commonly used compile and parse functions.
	    Twig.expression.fn = {
	        compile: {
	            push: function(token, stack, output) {
	                output.push(token);
	            },
	            push_both: function(token, stack, output) {
	                output.push(token);
	                stack.push(token);
	            }
	        },
	        parse: {
	            push: function(token, stack, context) {
	                stack.push(token);
	            },
	            push_value: function(token, stack, context) {
	                stack.push(token.value);
	            }
	        }
	    };

	    // The regular expressions and compile/parse logic used to match tokens in expressions.
	    //
	    // Properties:
	    //
	    //      type:  The type of expression this matches
	    //
	    //      regex: One or more regular expressions that matche the format of the token.
	    //
	    //      next:  Valid tokens that can occur next in the expression.
	    //
	    // Functions:
	    //
	    //      compile: A function that compiles the raw regular expression match into a token.
	    //
	    //      parse:   A function that parses the compiled token into output.
	    //
	    Twig.expression.definitions = [
	        {
	            type: Twig.expression.type.test,
	            regex: /^is\s+(not)?\s*([a-zA-Z_][a-zA-Z0-9_]*(\s?as)?)/,
	            next: Twig.expression.set.operations.concat([Twig.expression.type.parameter.start]),
	            compile: function(token, stack, output) {
	                token.filter   = token.match[2];
	                token.modifier = token.match[1];
	                delete token.match;
	                delete token.value;
	                output.push(token);
	            },
	            parse: function(token, stack, context) {
	                var value = stack.pop();

	                return parseParams(this, token.params, context)
	                .then(function(params) {
	                    var result = Twig.test(token.filter, value, params);

	                    if (token.modifier == 'not') {
	                        stack.push(!result);
	                    } else {
	                        stack.push(result);
	                    }
	                });
	            }
	        },
	        {
	            type: Twig.expression.type.comma,
	            // Match a comma
	            regex: /^,/,
	            next: Twig.expression.set.expressions.concat([Twig.expression.type.array.end, Twig.expression.type.object.end]),
	            compile: function(token, stack, output) {
	                var i = stack.length - 1,
	                    stack_token;

	                delete token.match;
	                delete token.value;

	                // pop tokens off the stack until the start of the object
	                for(;i >= 0; i--) {
	                    stack_token = stack.pop();
	                    if (stack_token.type === Twig.expression.type.object.start
	                            || stack_token.type === Twig.expression.type.parameter.start
	                            || stack_token.type === Twig.expression.type.array.start) {
	                        stack.push(stack_token);
	                        break;
	                    }
	                    output.push(stack_token);
	                }
	                output.push(token);
	            }
	        },
	        {
	            /**
	             * Match a number (integer or decimal)
	             */
	            type: Twig.expression.type.number,
	            // match a number
	            regex: /^\-?\d+(\.\d+)?/,
	            next: Twig.expression.set.operations,
	            compile: function(token, stack, output) {
	                token.value = Number(token.value);
	                output.push(token);
	            },
	            parse: Twig.expression.fn.parse.push_value
	        },
	        {
	            type: Twig.expression.type.operator.binary,
	            // Match any of ?:, +, *, /, -, %, ~, <, <=, >, >=, !=, ==, **, ?, :, and, b-and, or, b-or, b-xor, in, not in
	            // and, or, in, not in can be followed by a space or parenthesis
	            regex: /(^\?\:|^(b\-and)|^(b\-or)|^(b\-xor)|^[\+\-~%\?]|^[\:](?!\d\])|^[!=]==?|^[!<>]=?|^\*\*?|^\/\/?|^(and)[\(|\s+]|^(or)[\(|\s+]|^(in)[\(|\s+]|^(not in)[\(|\s+]|^\.\.)/,
	            next: Twig.expression.set.expressions,
	            transform: function(match, tokens) {
	                switch(match[0]) {
	                    case 'and(':
	                    case 'or(':
	                    case 'in(':
	                    case 'not in(':
	                        //Strip off the ( if it exists
	                        tokens[tokens.length - 1].value = match[2];
	                        return match[0];
	                        break;
	                    default:
	                        return '';
	                }
	            },
	            compile: function(token, stack, output) {
	                delete token.match;

	                token.value = token.value.trim();
	                var value = token.value,
	                    operator = Twig.expression.operator.lookup(value, token);

	                Twig.log.trace("Twig.expression.compile: ", "Operator: ", operator, " from ", value);

	                while (stack.length > 0 &&
	                       (stack[stack.length-1].type == Twig.expression.type.operator.unary || stack[stack.length-1].type == Twig.expression.type.operator.binary) &&
	                            (
	                                (operator.associativity === Twig.expression.operator.leftToRight &&
	                                 operator.precidence    >= stack[stack.length-1].precidence) ||

	                                (operator.associativity === Twig.expression.operator.rightToLeft &&
	                                 operator.precidence    >  stack[stack.length-1].precidence)
	                            )
	                       ) {
	                     var temp = stack.pop();
	                     output.push(temp);
	                }

	                if (value === ":") {
	                    // Check if this is a ternary or object key being set
	                    if (stack[stack.length - 1] && stack[stack.length-1].value === "?") {
	                        // Continue as normal for a ternary
	                    } else {
	                        // This is not a ternary so we push the token to the output where it can be handled
	                        //   when the assocated object is closed.
	                        var key_token = output.pop();

	                        if (key_token.type === Twig.expression.type.string ||
	                                key_token.type === Twig.expression.type.variable) {
	                            token.key = key_token.value;
	                        } else if (key_token.type === Twig.expression.type.number) {
	                            // Convert integer keys into string keys
	                            token.key = key_token.value.toString();
	                        } else if (key_token.expression &&
	                            (key_token.type === Twig.expression.type.parameter.end ||
	                            key_token.type == Twig.expression.type.subexpression.end)) {
	                            token.params = key_token.params;
	                        } else {
	                            throw new Twig.Error("Unexpected value before ':' of " + key_token.type + " = " + key_token.value);
	                        }

	                        output.push(token);
	                        return;
	                    }
	                } else {
	                    stack.push(operator);
	                }
	            },
	            parse: function(token, stack, context) {
	                if (token.key) {
	                    // handle ternary ':' operator
	                    stack.push(token);
	                } else if (token.params) {
	                    // handle "{(expression):value}"
	                    return Twig.expression.parseAsync.apply(this, [token.params, context])
	                    .then(function(key) {
	                        token.key = key;
	                        stack.push(token);

	                        //If we're in a loop, we might need token.params later, especially in this form of "(expression):value"
	                        if (!context.loop) {
	                            delete(token.params);
	                        }
	                    });
	                } else {
	                    Twig.expression.operator.parse(token.value, stack);
	                }
	            }
	        },
	        {
	            type: Twig.expression.type.operator.unary,
	            // Match any of not
	            regex: /(^not\s+)/,
	            next: Twig.expression.set.expressions,
	            compile: function(token, stack, output) {
	                delete token.match;

	                token.value = token.value.trim();
	                var value = token.value,
	                    operator = Twig.expression.operator.lookup(value, token);

	                Twig.log.trace("Twig.expression.compile: ", "Operator: ", operator, " from ", value);

	                while (stack.length > 0 &&
	                       (stack[stack.length-1].type == Twig.expression.type.operator.unary || stack[stack.length-1].type == Twig.expression.type.operator.binary) &&
	                            (
	                                (operator.associativity === Twig.expression.operator.leftToRight &&
	                                 operator.precidence    >= stack[stack.length-1].precidence) ||

	                                (operator.associativity === Twig.expression.operator.rightToLeft &&
	                                 operator.precidence    >  stack[stack.length-1].precidence)
	                            )
	                       ) {
	                     var temp = stack.pop();
	                     output.push(temp);
	                }

	                stack.push(operator);
	            },
	            parse: function(token, stack, context) {
	                Twig.expression.operator.parse(token.value, stack);
	            }
	        },
	        {
	            /**
	             * Match a string. This is anything between a pair of single or double quotes.
	             */
	            type: Twig.expression.type.string,
	            // See: http://blog.stevenlevithan.com/archives/match-quoted-string
	            regex: /^(["'])(?:(?=(\\?))\2[\s\S])*?\1/,
	            next: Twig.expression.set.operations_extended,
	            compile: function(token, stack, output) {
	                var value = token.value;
	                delete token.match

	                // Remove the quotes from the string
	                if (value.substring(0, 1) === '"') {
	                    value = value.replace('\\"', '"');
	                } else {
	                    value = value.replace("\\'", "'");
	                }
	                token.value = value.substring(1, value.length-1).replace( /\\n/g, "\n" ).replace( /\\r/g, "\r" );
	                Twig.log.trace("Twig.expression.compile: ", "String value: ", token.value);
	                output.push(token);
	            },
	            parse: Twig.expression.fn.parse.push_value
	        },
	        {
	            /**
	             * Match a subexpression set start.
	             */
	            type: Twig.expression.type.subexpression.start,
	            regex: /^\(/,
	            next: Twig.expression.set.expressions.concat([Twig.expression.type.subexpression.end]),
	            compile: function(token, stack, output) {
	                token.value = '(';
	                output.push(token);
	                stack.push(token);
	            },
	            parse: Twig.expression.fn.parse.push
	        },
	        {
	            /**
	             * Match a subexpression set end.
	             */
	            type: Twig.expression.type.subexpression.end,
	            regex: /^\)/,
	            next: Twig.expression.set.operations_extended,
	            validate: function(match, tokens) {
	                // Iterate back through previous tokens to ensure we follow a subexpression start
	                var i = tokens.length - 1,
	                    found_subexpression_start = false,
	                    next_subexpression_start_invalid = false,
	                    unclosed_parameter_count = 0;

	                while(!found_subexpression_start && i >= 0) {
	                    var token = tokens[i];

	                    found_subexpression_start = token.type === Twig.expression.type.subexpression.start;

	                    // If we have previously found a subexpression end, then this subexpression start is the start of
	                    // that subexpression, not the subexpression we are searching for
	                    if (found_subexpression_start && next_subexpression_start_invalid) {
	                        next_subexpression_start_invalid = false;
	                        found_subexpression_start = false;
	                    }

	                    // Count parameter tokens to ensure we dont return truthy for a parameter opener
	                    if (token.type === Twig.expression.type.parameter.start) {
	                        unclosed_parameter_count++;
	                    } else if (token.type === Twig.expression.type.parameter.end) {
	                        unclosed_parameter_count--;
	                    } else if (token.type === Twig.expression.type.subexpression.end) {
	                        next_subexpression_start_invalid = true;
	                    }

	                    i--;
	                }

	                // If we found unclosed parameters, return false
	                // If we didnt find subexpression start, return false
	                // Otherwise return true

	                return (found_subexpression_start && (unclosed_parameter_count === 0));
	            },
	            compile: function(token, stack, output) {
	                // This is basically a copy of parameter end compilation
	                var stack_token,
	                    end_token = token;

	                stack_token = stack.pop();
	                while(stack.length > 0 && stack_token.type != Twig.expression.type.subexpression.start) {
	                    output.push(stack_token);
	                    stack_token = stack.pop();
	                }

	                // Move contents of parens into preceding filter
	                var param_stack = [];
	                while(token.type !== Twig.expression.type.subexpression.start) {
	                    // Add token to arguments stack
	                    param_stack.unshift(token);
	                    token = output.pop();
	                }

	                param_stack.unshift(token);

	                var is_expression = false;

	                //If the token at the top of the *stack* is a function token, pop it onto the output queue.
	                // Get the token preceding the parameters
	                stack_token = stack[stack.length-1];

	                if (stack_token === undefined ||
	                    (stack_token.type !== Twig.expression.type._function &&
	                    stack_token.type !== Twig.expression.type.filter &&
	                    stack_token.type !== Twig.expression.type.test &&
	                    stack_token.type !== Twig.expression.type.key.brackets)) {

	                    end_token.expression = true;

	                    // remove start and end token from stack
	                    param_stack.pop();
	                    param_stack.shift();

	                    end_token.params = param_stack;

	                    output.push(end_token);
	                } else {
	                    // This should never be hit
	                    end_token.expression = false;
	                    stack_token.params = param_stack;
	                }
	            },
	            parse: function(token, stack, context) {
	                var new_array = [],
	                    array_ended = false,
	                    value = null;

	                if (token.expression) {
	                    return Twig.expression.parseAsync.apply(this, [token.params, context])
	                    .then(function(value) {
	                        stack.push(value);
	                    });
	                } else {
	                    throw new Twig.Error("Unexpected subexpression end when token is not marked as an expression");
	                }
	            }
	        },
	        {
	            /**
	             * Match a parameter set start.
	             */
	            type: Twig.expression.type.parameter.start,
	            regex: /^\(/,
	            next: Twig.expression.set.expressions.concat([Twig.expression.type.parameter.end]),
	            validate: function(match, tokens) {
	                var last_token = tokens[tokens.length - 1];
	                // We can't use the regex to test if we follow a space because expression is trimmed
	                return last_token && (Twig.indexOf(Twig.expression.reservedWords, last_token.value.trim()) < 0);
	            },
	            compile: Twig.expression.fn.compile.push_both,
	            parse: Twig.expression.fn.parse.push
	        },
	        {
	            /**
	             * Match a parameter set end.
	             */
	            type: Twig.expression.type.parameter.end,
	            regex: /^\)/,
	            next: Twig.expression.set.operations_extended,
	            compile: function(token, stack, output) {
	                var stack_token,
	                    end_token = token;

	                stack_token = stack.pop();
	                while(stack.length > 0 && stack_token.type != Twig.expression.type.parameter.start) {
	                    output.push(stack_token);
	                    stack_token = stack.pop();
	                }

	                // Move contents of parens into preceding filter
	                var param_stack = [];
	                while(token.type !== Twig.expression.type.parameter.start) {
	                    // Add token to arguments stack
	                    param_stack.unshift(token);
	                    token = output.pop();
	                }
	                param_stack.unshift(token);

	                var is_expression = false;

	                // Get the token preceding the parameters
	                token = output[output.length-1];

	                if (token === undefined ||
	                    (token.type !== Twig.expression.type._function &&
	                    token.type !== Twig.expression.type.filter &&
	                    token.type !== Twig.expression.type.test &&
	                    token.type !== Twig.expression.type.key.brackets)) {

	                    end_token.expression = true;

	                    // remove start and end token from stack
	                    param_stack.pop();
	                    param_stack.shift();

	                    end_token.params = param_stack;

	                    output.push(end_token);

	                } else {
	                    end_token.expression = false;
	                    token.params = param_stack;
	                }
	            },
	            parse: function(token, stack, context) {
	                var new_array = [],
	                    array_ended = false,
	                    value = null;

	                if (token.expression) {
	                    return Twig.expression.parseAsync.apply(this, [token.params, context])
	                    .then(function(value) {
	                        stack.push(value);
	                    });
	                } else {

	                    while (stack.length > 0) {
	                        value = stack.pop();
	                        // Push values into the array until the start of the array
	                        if (value && value.type && value.type == Twig.expression.type.parameter.start) {
	                            array_ended = true;
	                            break;
	                        }
	                        new_array.unshift(value);
	                    }

	                    if (!array_ended) {
	                        throw new Twig.Error("Expected end of parameter set.");
	                    }

	                    stack.push(new_array);
	                }
	            }
	        },
	        {
	            type: Twig.expression.type.slice,
	            regex: /^\[(\d*\:\d*)\]/,
	            next: Twig.expression.set.operations_extended,
	            compile: function(token, stack, output) {
	                var sliceRange = token.match[1].split(':');

	                //sliceStart can be undefined when we pass parameters to the slice filter later
	                var sliceStart = (sliceRange[0]) ? parseInt(sliceRange[0]) : undefined;
	                var sliceEnd = (sliceRange[1]) ? parseInt(sliceRange[1]) : undefined;

	                token.value = 'slice';
	                token.params = [sliceStart, sliceEnd];

	                //sliceEnd can't be undefined as the slice filter doesn't check for this, but it does check the length
	                //of the params array, so just shorten it.
	                if (!sliceEnd) {
	                    token.params = [sliceStart];
	                }

	                output.push(token);
	            },
	            parse: function(token, stack, context) {
	                var input = stack.pop(),
	                    params = token.params;

	                stack.push(Twig.filter.apply(this, [token.value, input, params]));
	            }
	        },
	        {
	            /**
	             * Match an array start.
	             */
	            type: Twig.expression.type.array.start,
	            regex: /^\[/,
	            next: Twig.expression.set.expressions.concat([Twig.expression.type.array.end]),
	            compile: Twig.expression.fn.compile.push_both,
	            parse: Twig.expression.fn.parse.push
	        },
	        {
	            /**
	             * Match an array end.
	             */
	            type: Twig.expression.type.array.end,
	            regex: /^\]/,
	            next: Twig.expression.set.operations_extended,
	            compile: function(token, stack, output) {
	                var i = stack.length - 1,
	                    stack_token;
	                // pop tokens off the stack until the start of the object
	                for(;i >= 0; i--) {
	                    stack_token = stack.pop();
	                    if (stack_token.type === Twig.expression.type.array.start) {
	                        break;
	                    }
	                    output.push(stack_token);
	                }
	                output.push(token);
	            },
	            parse: function(token, stack, context) {
	                var new_array = [],
	                    array_ended = false,
	                    value = null;

	                while (stack.length > 0) {
	                    value = stack.pop();
	                    // Push values into the array until the start of the array
	                    if (value.type && value.type == Twig.expression.type.array.start) {
	                        array_ended = true;
	                        break;
	                    }
	                    new_array.unshift(value);
	                }
	                if (!array_ended) {
	                    throw new Twig.Error("Expected end of array.");
	                }

	                stack.push(new_array);
	            }
	        },
	        // Token that represents the start of a hash map '}'
	        //
	        // Hash maps take the form:
	        //    { "key": 'value', "another_key": item }
	        //
	        // Keys must be quoted (either single or double) and values can be any expression.
	        {
	            type: Twig.expression.type.object.start,
	            regex: /^\{/,
	            next: Twig.expression.set.expressions.concat([Twig.expression.type.object.end]),
	            compile: Twig.expression.fn.compile.push_both,
	            parse: Twig.expression.fn.parse.push
	        },

	        // Token that represents the end of a Hash Map '}'
	        //
	        // This is where the logic for building the internal
	        // representation of a hash map is defined.
	        {
	            type: Twig.expression.type.object.end,
	            regex: /^\}/,
	            next: Twig.expression.set.operations_extended,
	            compile: function(token, stack, output) {
	                var i = stack.length-1,
	                    stack_token;

	                // pop tokens off the stack until the start of the object
	                for(;i >= 0; i--) {
	                    stack_token = stack.pop();
	                    if (stack_token && stack_token.type === Twig.expression.type.object.start) {
	                        break;
	                    }
	                    output.push(stack_token);
	                }
	                output.push(token);
	            },
	            parse: function(end_token, stack, context) {
	                var new_object = {},
	                    object_ended = false,
	                    token = null,
	                    token_key = null,
	                    has_value = false,
	                    value = null;

	                while (stack.length > 0) {
	                    token = stack.pop();
	                    // Push values into the array until the start of the object
	                    if (token && token.type && token.type === Twig.expression.type.object.start) {
	                        object_ended = true;
	                        break;
	                    }
	                    if (token && token.type && (token.type === Twig.expression.type.operator.binary || token.type === Twig.expression.type.operator.unary) && token.key) {
	                        if (!has_value) {
	                            throw new Twig.Error("Missing value for key '" + token.key + "' in object definition.");
	                        }
	                        new_object[token.key] = value;

	                        // Preserve the order that elements are added to the map
	                        // This is necessary since JavaScript objects don't
	                        // guarantee the order of keys
	                        if (new_object._keys === undefined) new_object._keys = [];
	                        new_object._keys.unshift(token.key);

	                        // reset value check
	                        value = null;
	                        has_value = false;

	                    } else {
	                        has_value = true;
	                        value = token;
	                    }
	                }
	                if (!object_ended) {
	                    throw new Twig.Error("Unexpected end of object.");
	                }

	                stack.push(new_object);
	            }
	        },

	        // Token representing a filter
	        //
	        // Filters can follow any expression and take the form:
	        //    expression|filter(optional, args)
	        //
	        // Filter parsing is done in the Twig.filters namespace.
	        {
	            type: Twig.expression.type.filter,
	            // match a | then a letter or _, then any number of letters, numbers, _ or -
	            regex: /^\|\s?([a-zA-Z_][a-zA-Z0-9_\-]*)/,
	            next: Twig.expression.set.operations_extended.concat([
	                    Twig.expression.type.parameter.start]),
	            compile: function(token, stack, output) {
	                token.value = token.match[1];
	                output.push(token);
	            },
	            parse: function(token, stack, context) {
	                var that = this,
	                    input = stack.pop();

	                return parseParams(this, token.params, context)
	                .then(function(params) {
	                    return Twig.filter.apply(that, [token.value, input, params]);
	                })
	                .then(function(value) {
	                    stack.push(value);
	                });
	            }
	        },
	        {
	            type: Twig.expression.type._function,
	            // match any letter or _, then any number of letters, numbers, _ or - followed by (
	            regex: /^([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/,
	            next: Twig.expression.type.parameter.start,
	            validate: function(match, tokens) {
	                // Make sure this function is not a reserved word
	                return match[1] && (Twig.indexOf(Twig.expression.reservedWords, match[1]) < 0);
	            },
	            transform: function(match, tokens) {
	                return '(';
	            },
	            compile: function(token, stack, output) {
	                var fn = token.match[1];
	                token.fn = fn;
	                // cleanup token
	                delete token.match;
	                delete token.value;

	                output.push(token);
	            },
	            parse: function(token, stack, context) {

	                var that = this,
	                    fn = token.fn,
	                    value;

	                return parseParams(this, token.params, context)
	                .then(function(params) {
	                    if (Twig.functions[fn]) {
	                        // Get the function from the built-in functions
	                        value = Twig.functions[fn].apply(that, params);

	                    } else if (typeof context[fn] == 'function') {
	                        // Get the function from the user/context defined functions
	                        value = context[fn].apply(context, params);

	                    } else {
	                        throw new Twig.Error(fn + ' function does not exist and is not defined in the context');
	                    }

	                    return value;
	                })
	                .then(function(result) {
	                    stack.push(result);
	                });
	            }
	        },

	        // Token representing a variable.
	        //
	        // Variables can contain letters, numbers, underscores and
	        // dashes, but must start with a letter or underscore.
	        //
	        // Variables are retrieved from the render context and take
	        // the value of 'undefined' if the given variable doesn't
	        // exist in the context.
	        {
	            type: Twig.expression.type.variable,
	            // match any letter or _, then any number of letters, numbers, _ or -
	            regex: /^[a-zA-Z_][a-zA-Z0-9_]*/,
	            next: Twig.expression.set.operations_extended.concat([
	                    Twig.expression.type.parameter.start]),
	            compile: Twig.expression.fn.compile.push,
	            validate: function(match, tokens) {
	                return (Twig.indexOf(Twig.expression.reservedWords, match[0]) < 0);
	            },
	            parse: function(token, stack, context) {
	                // Get the variable from the context
	                return Twig.expression.resolveAsync.apply(this, [context[token.value], context])
	                .then(function(value) {
	                    stack.push(value);
	                });
	            }
	        },
	        {
	            type: Twig.expression.type.key.period,
	            regex: /^\.([a-zA-Z0-9_]+)/,
	            next: Twig.expression.set.operations_extended.concat([
	                    Twig.expression.type.parameter.start]),
	            compile: function(token, stack, output) {
	                token.key = token.match[1];
	                delete token.match;
	                delete token.value;

	                output.push(token);
	            },
	            parse: function(token, stack, context, next_token) {
	                var that = this,
	                    key = token.key,
	                    object = stack.pop(),
	                    value;

	                return parseParams(this, token.params, context)
	                .then(function(params) {
	                    if (object === null || object === undefined) {
	                        if (that.options.strict_variables) {
	                            throw new Twig.Error("Can't access a key " + key + " on an null or undefined object.");
	                        } else {
	                            value = undefined;
	                        }
	                    } else {
	                        var capitalize = function (value) {
	                            return value.substr(0, 1).toUpperCase() + value.substr(1);
	                        };

	                        // Get the variable from the context
	                        if (typeof object === 'object' && key in object) {
	                            value = object[key];
	                        } else if (object["get" + capitalize(key)] !== undefined) {
	                            value = object["get" + capitalize(key)];
	                        } else if (object["is" + capitalize(key)] !== undefined) {
	                            value = object["is" + capitalize(key)];
	                        } else {
	                            value = undefined;
	                        }
	                    }

	                    // When resolving an expression we need to pass next_token in case the expression is a function
	                    return Twig.expression.resolveAsync.apply(that, [value, context, params, next_token, object]);
	                })
	                .then(function(result) {
	                    stack.push(result);
	                });
	            }
	        },
	        {
	            type: Twig.expression.type.key.brackets,
	            regex: /^\[([^\]\:]*)\]/,
	            next: Twig.expression.set.operations_extended.concat([
	                    Twig.expression.type.parameter.start]),
	            compile: function(token, stack, output) {
	                var match = token.match[1];
	                delete token.value;
	                delete token.match;

	                // The expression stack for the key
	                token.stack = Twig.expression.compile({
	                    value: match
	                }).stack;

	                output.push(token);
	            },
	            parse: function(token, stack, context, next_token) {
	                // Evaluate key
	                var that = this,
	                    params = null,
	                    object,
	                    value;

	                return parseParams(this, token.params, context)
	                .then(function(parameters) {
	                    params = parameters;
	                    return Twig.expression.parseAsync.apply(that, [token.stack, context]);
	                })
	                .then(function(key) {
	                    object = stack.pop();

	                    if (object === null || object === undefined) {
	                        if (that.options.strict_variables) {
	                            throw new Twig.Error("Can't access a key " + key + " on an null or undefined object.");
	                        } else {
	                            return null;
	                        }
	                    }

	                    // Get the variable from the context
	                    if (typeof object === 'object' && key in object) {
	                        value = object[key];
	                    } else {
	                        value = null;
	                    }

	                    // When resolving an expression we need to pass next_token in case the expression is a function
	                    return Twig.expression.resolveAsync.apply(that, [value, object, params, next_token]);
	                })
	                .then(function(result) {
	                    stack.push(result);
	                });
	            }
	        },
	        {
	            /**
	             * Match a null value.
	             */
	            type: Twig.expression.type._null,
	            // match a number
	            regex: /^(null|NULL|none|NONE)/,
	            next: Twig.expression.set.operations,
	            compile: function(token, stack, output) {
	                delete token.match;
	                token.value = null;
	                output.push(token);
	            },
	            parse: Twig.expression.fn.parse.push_value
	        },
	        {
	            /**
	             * Match the context
	             */
	            type: Twig.expression.type.context,
	            regex: /^_context/,
	            next: Twig.expression.set.operations_extended.concat([
	                    Twig.expression.type.parameter.start]),
	            compile: Twig.expression.fn.compile.push,
	            parse: function(token, stack, context) {
	                stack.push(context);
	            }
	        },
	        {
	            /**
	             * Match a boolean
	             */
	            type: Twig.expression.type.bool,
	            regex: /^(true|TRUE|false|FALSE)/,
	            next: Twig.expression.set.operations,
	            compile: function(token, stack, output) {
	                token.value = (token.match[0].toLowerCase( ) === "true");
	                delete token.match;
	                output.push(token);
	            },
	            parse: Twig.expression.fn.parse.push_value
	        }
	    ];

	    /**
	     * Resolve a context value.
	     *
	     * If the value is a function, it is executed with a context parameter.
	     *
	     * @param {string} key The context object key.
	     * @param {Object} context The render context.
	     */
	    Twig.expression.resolveAsync = function(value, context, params, next_token, object) {
	        if (typeof value == 'function') {
	            var promise = Twig.Promise.resolve(params);

	            /*
	            If value is a function, it will have been impossible during the compile stage to determine that a following
	            set of parentheses were parameters for this function.

	            Those parentheses will have therefore been marked as an expression, with their own parameters, which really
	            belong to this function.

	            Those parameters will also need parsing in case they are actually an expression to pass as parameters.
	             */
	            if (next_token && next_token.type === Twig.expression.type.parameter.end) {
	                //When parsing these parameters, we need to get them all back, not just the last item on the stack.
	                var tokens_are_parameters = true;

	                promise = promise.then(function() {
	                    return next_token.params && Twig.expression.parseAsync.apply(this, [next_token.params, context, tokens_are_parameters]);
	                })
	                .then(function(p) {
	                    //Clean up the parentheses tokens on the next loop
	                    next_token.cleanup = true;

	                    return p;
	                });
	            }

	            return promise.then(function(params) {
	                return value.apply(object || context, params || []);
	            });
	        } else {
	            return Twig.Promise.resolve(value);
	        }
	    };

	    Twig.expression.resolve = function(value, context, params, next_token, object) {
	        var is_async = true,
	            result;

	        Twig.expression.resolveAsync.apply(this, [value, context, params, next_token, object])
	        .then(function(r) {
	            is_async = false;
	            result = r;
	        });

	        if (is_async)
	            throw new Twig.Error('You are using Twig.js in sync mode in combination with async extensions.');

	        return result;
	    }

	    /**
	     * Registry for logic handlers.
	     */
	    Twig.expression.handler = {};

	    /**
	     * Define a new expression type, available at Twig.logic.type.{type}
	     *
	     * @param {string} type The name of the new type.
	     */
	    Twig.expression.extendType = function (type) {
	        Twig.expression.type[type] = "Twig.expression.type." + type;
	    };

	    /**
	     * Extend the expression parsing functionality with a new definition.
	     *
	     * Token definitions follow this format:
	     *  {
	     *      type:     One of Twig.expression.type.[type], either pre-defined or added using
	     *                    Twig.expression.extendType
	     *
	     *      next:     Array of types from Twig.expression.type that can follow this token,
	     *
	     *      regex:    A regex or array of regex's that should match the token.
	     *
	     *      compile: function(token, stack, output) called when this token is being compiled.
	     *                   Should return an object with stack and output set.
	     *
	     *      parse:   function(token, stack, context) called when this token is being parsed.
	     *                   Should return an object with stack and context set.
	     *  }
	     *
	     * @param {Object} definition A token definition.
	     */
	    Twig.expression.extend = function (definition) {
	        if (!definition.type) {
	            throw new Twig.Error("Unable to extend logic definition. No type provided for " + definition);
	        }
	        Twig.expression.handler[definition.type] = definition;
	    };

	    // Extend with built-in expressions
	    while (Twig.expression.definitions.length > 0) {
	        Twig.expression.extend(Twig.expression.definitions.shift());
	    }

	    /**
	     * Break an expression into tokens defined in Twig.expression.definitions.
	     *
	     * @param {string} expression The string to tokenize.
	     *
	     * @return {Array} An array of tokens.
	     */
	    Twig.expression.tokenize = function (expression) {
	        var tokens = [],
	            // Keep an offset of the location in the expression for error messages.
	            exp_offset = 0,
	            // The valid next tokens of the previous token
	            next = null,
	            // Match information
	            type, regex, regex_array,
	            // The possible next token for the match
	            token_next,
	            // Has a match been found from the definitions
	            match_found, invalid_matches = [], match_function;

	        match_function = function () {
	            var match = Array.prototype.slice.apply(arguments),
	                string = match.pop(),
	                offset = match.pop();

	            Twig.log.trace("Twig.expression.tokenize",
	                           "Matched a ", type, " regular expression of ", match);

	            if (next && Twig.indexOf(next, type) < 0) {
	                invalid_matches.push(
	                    type + " cannot follow a " + tokens[tokens.length - 1].type +
	                           " at template:" + exp_offset + " near '" + match[0].substring(0, 20) +
	                           "...'"
	                );
	                // Not a match, don't change the expression
	                return match[0];
	            }

	            // Validate the token if a validation function is provided
	            if (Twig.expression.handler[type].validate &&
	                    !Twig.expression.handler[type].validate(match, tokens)) {
	                return match[0];
	            }

	            invalid_matches = [];

	            tokens.push({
	                type:  type,
	                value: match[0],
	                match: match
	            });

	            match_found = true;
	            next = token_next;
	            exp_offset += match[0].length;

	            // Does the token need to return output back to the expression string
	            // e.g. a function match of cycle( might return the '(' back to the expression
	            // This allows look-ahead to differentiate between token types (e.g. functions and variable names)
	            if (Twig.expression.handler[type].transform) {
	                return Twig.expression.handler[type].transform(match, tokens);
	            }
	            return '';
	        };

	        Twig.log.debug("Twig.expression.tokenize", "Tokenizing expression ", expression);

	        while (expression.length > 0) {
	            expression = expression.trim();
	            for (type in Twig.expression.handler) {
	                if (Twig.expression.handler.hasOwnProperty(type)) {
	                    token_next = Twig.expression.handler[type].next;
	                    regex = Twig.expression.handler[type].regex;
	                    Twig.log.trace("Checking type ", type, " on ", expression);
	                    if (regex instanceof Array) {
	                        regex_array = regex;
	                    } else {
	                        regex_array = [regex];
	                    }

	                    match_found = false;
	                    while (regex_array.length > 0) {
	                        regex = regex_array.pop();
	                        expression = expression.replace(regex, match_function);
	                    }
	                    // An expression token has been matched. Break the for loop and start trying to
	                    //  match the next template (if expression isn't empty.)
	                    if (match_found) {
	                        break;
	                    }
	                }
	            }
	            if (!match_found) {
	                if (invalid_matches.length > 0) {
	                    throw new Twig.Error(invalid_matches.join(" OR "));
	                } else {
	                    throw new Twig.Error("Unable to parse '" + expression + "' at template position" + exp_offset);
	                }
	            }
	        }

	        Twig.log.trace("Twig.expression.tokenize", "Tokenized to ", tokens);
	        return tokens;
	    };

	    /**
	     * Compile an expression token.
	     *
	     * @param {Object} raw_token The uncompiled token.
	     *
	     * @return {Object} The compiled token.
	     */
	    Twig.expression.compile = function (raw_token) {
	        var expression = raw_token.value,
	            // Tokenize expression
	            tokens = Twig.expression.tokenize(expression),
	            token = null,
	            output = [],
	            stack = [],
	            token_template = null;

	        Twig.log.trace("Twig.expression.compile: ", "Compiling ", expression);

	        // Push tokens into RPN stack using the Shunting-yard algorithm
	        // See http://en.wikipedia.org/wiki/Shunting_yard_algorithm

	        while (tokens.length > 0) {
	            token = tokens.shift();
	            token_template = Twig.expression.handler[token.type];

	            Twig.log.trace("Twig.expression.compile: ", "Compiling ", token);

	            // Compile the template
	            token_template.compile && token_template.compile(token, stack, output);

	            Twig.log.trace("Twig.expression.compile: ", "Stack is", stack);
	            Twig.log.trace("Twig.expression.compile: ", "Output is", output);
	        }

	        while(stack.length > 0) {
	            output.push(stack.pop());
	        }

	        Twig.log.trace("Twig.expression.compile: ", "Final output is", output);

	        raw_token.stack = output;
	        delete raw_token.value;

	        return raw_token;
	    };


	    /**
	     * Parse an RPN expression stack within a context.
	     *
	     * @param {Array} tokens An array of compiled expression tokens.
	     * @param {Object} context The render context to parse the tokens with.
	     *
	     * @return {Object} The result of parsing all the tokens. The result
	     *                  can be anything, String, Array, Object, etc... based on
	     *                  the given expression.
	     */
	    Twig.expression.parse = function (tokens, context, tokens_are_parameters, allow_async) {
	        var that = this;

	        // If the token isn't an array, make it one.
	        if (!(tokens instanceof Array)) {
	            tokens = [tokens];
	        }

	        // The output stack
	        var stack = [],
	            next_token,
	            output = null,
	            promise = null,
	            is_async = true,
	            token_template = null,
	            loop_token_fixups = [];

	        promise = Twig.async.forEach(tokens, function (token, index) {
	            //If the token is marked for cleanup, we don't need to parse it
	            if (token.cleanup) {
	                return;
	            }

	            var result = null;

	            //Determine the token that follows this one so that we can pass it to the parser
	            if (tokens.length > index + 1) {
	                next_token = tokens[index + 1];
	            }

	            token_template = Twig.expression.handler[token.type];

	            if (token_template.parse)
	                result = token_template.parse.apply(that, [token, stack, context, next_token]);

	            //Store any binary tokens for later if we are in a loop.
	            if (context.loop && token.type === Twig.expression.type.operator.binary) {
	                loop_token_fixups.push(token);
	            }

	            return result;
	        })
	        .then(function() {
	            //Check every fixup and remove "key" as long as they still have "params". This covers the use case where
	            //a ":" operator is used in a loop with a "(expression):" statement. We need to be able to evaluate the expression
	            Twig.forEach(loop_token_fixups, function (loop_token_fixup) {
	                if (loop_token_fixup.params && loop_token_fixup.key) {
	                    delete loop_token_fixup["key"];
	                }
	            });

	            //If parse has been called with a set of tokens that are parameters, we need to return the whole stack,
	            //wrapped in an Array.
	            if (tokens_are_parameters) {
	                var params = [];
	                while (stack.length > 0) {
	                    params.unshift(stack.pop());
	                }

	                stack.push(params);
	            }

	            if (allow_async)
	                return Twig.Promise.resolve(stack.pop());
	        })
	        .then(function(v) {
	            is_async = false;
	            return v;
	        });

	        if (allow_async)
	            return promise;

	        if (is_async)
	            throw new Twig.Error('You are using Twig.js in sync mode in combination with async extensions.');

	        // Pop the final value off the stack
	        return stack.pop();
	    };

	    return Twig;

	};


/***/ },
/* 4 */
/***/ function(module, exports) {

	// ## twig.expression.operator.js
	//
	// This file handles operator lookups and parsing.
	module.exports = function (Twig) {
	    "use strict";

	    /**
	     * Operator associativity constants.
	     */
	    Twig.expression.operator = {
	        leftToRight: 'leftToRight',
	        rightToLeft: 'rightToLeft'
	    };

	    var containment = function(a, b) {
	        if (b === undefined || b === null) {
	            return null;
	        } else if (b.indexOf !== undefined) {
	            // String
	            return a === b || a !== '' && b.indexOf(a) > -1;
	        } else {
	            var el;
	            for (el in b) {
	                if (b.hasOwnProperty(el) && b[el] === a) {
	                    return true;
	                }
	            }
	            return false;
	        }
	    };

	    /**
	     * Get the precidence and associativity of an operator. These follow the order that C/C++ use.
	     * See http://en.wikipedia.org/wiki/Operators_in_C_and_C++ for the table of values.
	     */
	    Twig.expression.operator.lookup = function (operator, token) {
	        switch (operator) {
	            case "..":
	                token.precidence = 20;
	                token.associativity = Twig.expression.operator.leftToRight;
	                break;

	            case ',':
	                token.precidence = 18;
	                token.associativity = Twig.expression.operator.leftToRight;
	                break;

	            // Ternary
	            case '?:':
	            case '?':
	            case ':':
	                token.precidence = 16;
	                token.associativity = Twig.expression.operator.rightToLeft;
	                break;

	            case 'or':
	                token.precidence = 14;
	                token.associativity = Twig.expression.operator.leftToRight;
	                break;

	            case 'and':
	                token.precidence = 13;
	                token.associativity = Twig.expression.operator.leftToRight;
	                break;

	            case 'b-or':
	                token.precidence = 12;
	                token.associativity = Twig.expression.operator.leftToRight;
	                break;

	            case 'b-xor':
	                token.precidence = 11;
	                token.associativity = Twig.expression.operator.leftToRight;
	                break;

	            case 'b-and':
	                token.precidence = 10;
	                token.associativity = Twig.expression.operator.leftToRight;
	                break;

	            case '==':
	            case '!=':
	                token.precidence = 9;
	                token.associativity = Twig.expression.operator.leftToRight;
	                break;

	            case '<':
	            case '<=':
	            case '>':
	            case '>=':
	            case 'not in':
	            case 'in':
	                token.precidence = 8;
	                token.associativity = Twig.expression.operator.leftToRight;
	                break;

	            case '~': // String concatination
	            case '+':
	            case '-':
	                token.precidence = 6;
	                token.associativity = Twig.expression.operator.leftToRight;
	                break;

	            case '//':
	            case '**':
	            case '*':
	            case '/':
	            case '%':
	                token.precidence = 5;
	                token.associativity = Twig.expression.operator.leftToRight;
	                break;

	            case 'not':
	                token.precidence = 3;
	                token.associativity = Twig.expression.operator.rightToLeft;
	                break;

	            default:
	                throw new Twig.Error("Failed to lookup operator: " + operator + " is an unknown operator.");
	        }
	        token.operator = operator;
	        return token;
	    };

	    /**
	     * Handle operations on the RPN stack.
	     *
	     * Returns the updated stack.
	     */
	    Twig.expression.operator.parse = function (operator, stack) {
	        Twig.log.trace("Twig.expression.operator.parse: ", "Handling ", operator);
	        var a, b, c;

	        if (operator === '?') {
	            c = stack.pop();
	        }

	        b = stack.pop();
	        if (operator !== 'not') {
	            a = stack.pop();
	        }

	        if (operator !== 'in' && operator !== 'not in') {
	            if (a && Array.isArray(a)) {
	                a = a.length;
	            }

	            if (b && Array.isArray(b)) {
	                b = b.length;
	            }
	        }

	        switch (operator) {
	            case ':':
	                // Ignore
	                break;

	            case '?:':
	                if (Twig.lib.boolval(a)) {
	                    stack.push(a);
	                } else {
	                    stack.push(b);
	                }
	                break;
	            case '?':
	                if (a === undefined) {
	                    //An extended ternary.
	                    a = b;
	                    b = c;
	                    c = undefined;
	                }

	                if (Twig.lib.boolval(a)) {
	                    stack.push(b);
	                } else {
	                    stack.push(c);
	                }
	                break;

	            case '+':
	                b = parseFloat(b);
	                a = parseFloat(a);
	                stack.push(a + b);
	                break;

	            case '-':
	                b = parseFloat(b);
	                a = parseFloat(a);
	                stack.push(a - b);
	                break;

	            case '*':
	                b = parseFloat(b);
	                a = parseFloat(a);
	                stack.push(a * b);
	                break;

	            case '/':
	                b = parseFloat(b);
	                a = parseFloat(a);
	                stack.push(a / b);
	                break;

	            case '//':
	                b = parseFloat(b);
	                a = parseFloat(a);
	                stack.push(Math.floor(a / b));
	                break;

	            case '%':
	                b = parseFloat(b);
	                a = parseFloat(a);
	                stack.push(a % b);
	                break;

	            case '~':
	                stack.push( (a != null ? a.toString() : "")
	                          + (b != null ? b.toString() : "") );
	                break;

	            case 'not':
	            case '!':
	                stack.push(!Twig.lib.boolval(b));
	                break;

	            case '<':
	                stack.push(a < b);
	                break;

	            case '<=':
	                stack.push(a <= b);
	                break;

	            case '>':
	                stack.push(a > b);
	                break;

	            case '>=':
	                stack.push(a >= b);
	                break;

	            case '===':
	                stack.push(a === b);
	                break;

	            case '==':
	                stack.push(a == b);
	                break;

	            case '!==':
	                stack.push(a !== b);
	                break;

	            case '!=':
	                stack.push(a != b);
	                break;

	            case 'or':
	                stack.push(a || b);
	                break;

	            case 'b-or':
	                stack.push(a | b);
	                break;

	            case 'b-xor':
	                stack.push(a ^ b);
	                break;

	            case 'and':
	                stack.push(a && b);
	                break;

	            case 'b-and':
	                stack.push(a & b);
	                break;

	            case '**':
	                stack.push(Math.pow(a, b));
	                break;

	            case 'not in':
	                stack.push( !containment(a, b) );
	                break;

	            case 'in':
	                stack.push( containment(a, b) );
	                break;

	            case '..':
	                stack.push( Twig.functions.range(a, b) );
	                break;

	            default:
	                debugger;
	                throw new Twig.Error("Failed to parse operator: " + operator + " is an unknown operator.");
	        }
	    };

	    return Twig;

	};


/***/ },
/* 5 */
/***/ function(module, exports) {

	// ## twig.filters.js
	//
	// This file handles parsing filters.
	module.exports = function (Twig) {

	    // Determine object type
	    function is(type, obj) {
	        var clas = Object.prototype.toString.call(obj).slice(8, -1);
	        return obj !== undefined && obj !== null && clas === type;
	    }

	    Twig.filters = {
	        // String Filters
	        upper:  function(value) {
	            if ( typeof value !== "string" ) {
	               return value;
	            }

	            return value.toUpperCase();
	        },
	        lower: function(value) {
	            if ( typeof value !== "string" ) {
	               return value;
	            }

	            return value.toLowerCase();
	        },
	        capitalize: function(value) {
	            if ( typeof value !== "string" ) {
	                 return value;
	            }

	            return value.substr(0, 1).toUpperCase() + value.toLowerCase().substr(1);
	        },
	        title: function(value) {
	            if ( typeof value !== "string" ) {
	               return value;
	            }

	            return value.toLowerCase().replace( /(^|\s)([a-z])/g , function(m, p1, p2){
	                return p1 + p2.toUpperCase();
	            });
	        },
	        length: function(value) {
	            if (Twig.lib.is("Array", value) || typeof value === "string") {
	                return value.length;
	            } else if (Twig.lib.is("Object", value)) {
	                if (value._keys === undefined) {
	                    return Object.keys(value).length;
	                } else {
	                    return value._keys.length;
	                }
	            } else {
	                return 0;
	            }
	        },

	        // Array/Object Filters
	        reverse: function(value) {
	            if (is("Array", value)) {
	                return value.reverse();
	            } else if (is("String", value)) {
	                return value.split("").reverse().join("");
	            } else if (is("Object", value)) {
	                var keys = value._keys || Object.keys(value).reverse();
	                value._keys = keys;
	                return value;
	            }
	        },
	        sort: function(value) {
	            if (is("Array", value)) {
	                return value.sort();
	            } else if (is('Object', value)) {
	                // Sorting objects isn't obvious since the order of
	                // returned keys isn't guaranteed in JavaScript.
	                // Because of this we use a "hidden" key called _keys to
	                // store the keys in the order we want to return them.

	                delete value._keys;
	                var keys = Object.keys(value),
	                    sorted_keys = keys.sort(function(a, b) {
	                        var a1, a2;

	                        // if a and b are comparable, we're fine :-)
	                        if((value[a] > value[b]) == !(value[a] <= value[b])) {
	                            return value[a] > value[b] ? 1 :
				           value[a] < value[b] ? -1 :
					   0;
	                        }
	                        // if a and b can be parsed as numbers, we can compare
	                        // their numeric value
	                        else if(!isNaN(a1 = parseFloat(value[a])) &&
	                                !isNaN(b1 = parseFloat(value[b]))) {
	                            return a1 > b1 ? 1 :
				           a1 < b1 ? -1 :
					   0;
	                        }
	                        // if one of the values is a string, we convert the
	                        // other value to string as well
	                        else if(typeof value[a] == 'string') {
	                            return value[a] > value[b].toString() ? 1 :
	                                   value[a] < value[b].toString() ? -1 :
					   0;
	                        }
	                        else if(typeof value[b] == 'string') {
	                            return value[a].toString() > value[b] ? 1 :
	                                   value[a].toString() < value[b] ? -1 :
					   0;
	                        }
	                        // everything failed - return 'null' as sign, that
	                        // the values are not comparable
	                        else {
	                            return null;
	                        }
	                    });
	                value._keys = sorted_keys;
	                return value;
	            }
	        },
	        keys: function(value) {
	            if (value === undefined || value === null){
	                return;
	           }

	            var keyset = value._keys || Object.keys(value),
	                output = [];

	            Twig.forEach(keyset, function(key) {
	                if (key === "_keys") return; // Ignore the _keys property
	                if (value.hasOwnProperty(key)) {
	                    output.push(key);
	                }
	            });
	            return output;
	        },
	        url_encode: function(value) {
	            if (value === undefined || value === null){
	                return;
	            }

	            var result = encodeURIComponent(value);
	            result = result.replace("'", "%27");
	            return result;
	        },
	        join: function(value, params) {
	            if (value === undefined || value === null){
	                return;
	            }

	            var join_str = "",
	                output = [],
	                keyset = null;

	            if (params && params[0]) {
	                join_str = params[0];
	            }
	            if (is("Array", value)) {
	                output = value;
	            } else {
	                keyset = value._keys || Object.keys(value);
	                Twig.forEach(keyset, function(key) {
	                    if (key === "_keys") return; // Ignore the _keys property
	                    if (value.hasOwnProperty(key)) {
	                        output.push(value[key]);
	                    }
	                });
	            }
	            return output.join(join_str);
	        },
	        "default": function(value, params) {
	            if (params !== undefined && params.length > 1) {
	                throw new Twig.Error("default filter expects one argument");
	            }
	            if (value === undefined || value === null || value === '' ) {
	                if (params === undefined) {
	                    return '';
	                }

	                return params[0];
	            } else {
	                return value;
	            }
	        },
	        json_encode: function(value) {
	            if(value === undefined || value === null) {
	                return "null";
	            }
	            else if ((typeof value == 'object') && (is("Array", value))) {
	                output = [];

	                Twig.forEach(value, function(v) {
	                    output.push(Twig.filters.json_encode(v));
	                });

	                return "[" + output.join(",") + "]";
	            }
	            else if (typeof value == 'object') {
	                var keyset = value._keys || Object.keys(value),
	                output = [];

	                Twig.forEach(keyset, function(key) {
	                    output.push(JSON.stringify(key) + ":" + Twig.filters.json_encode(value[key]));
	                });

	                return "{" + output.join(",") + "}";
	            }
	            else {
	                return JSON.stringify(value);
	            }
	        },
	        merge: function(value, params) {
	            var obj = [],
	                arr_index = 0,
	                keyset = [];

	            // Check to see if all the objects being merged are arrays
	            if (!is("Array", value)) {
	                // Create obj as an Object
	                obj = { };
	            } else {
	                Twig.forEach(params, function(param) {
	                    if (!is("Array", param)) {
	                        obj = { };
	                    }
	                });
	            }
	            if (!is("Array", obj)) {
	                obj._keys = [];
	            }

	            if (is("Array", value)) {
	                Twig.forEach(value, function(val) {
	                    if (obj._keys) obj._keys.push(arr_index);
	                    obj[arr_index] = val;
	                    arr_index++;
	                });
	            } else {
	                keyset = value._keys || Object.keys(value);
	                Twig.forEach(keyset, function(key) {
	                    obj[key] = value[key];
	                    obj._keys.push(key);

	                    // Handle edge case where a number index in an object is greater than
	                    //   the array counter. In such a case, the array counter is increased
	                    //   one past the index.
	                    //
	                    // Example {{ ["a", "b"]|merge({"4":"value"}, ["c", "d"])
	                    // Without this, d would have an index of "4" and overwrite the value
	                    //   of "value"
	                    var int_key = parseInt(key, 10);
	                    if (!isNaN(int_key) && int_key >= arr_index) {
	                        arr_index = int_key + 1;
	                    }
	                });
	            }

	            // mixin the merge arrays
	            Twig.forEach(params, function(param) {
	                if (is("Array", param)) {
	                    Twig.forEach(param, function(val) {
	                        if (obj._keys) obj._keys.push(arr_index);
	                        obj[arr_index] = val;
	                        arr_index++;
	                    });
	                } else {
	                    keyset = param._keys || Object.keys(param);
	                    Twig.forEach(keyset, function(key) {
	                        if (!obj[key]) obj._keys.push(key);
	                        obj[key] = param[key];

	                        var int_key = parseInt(key, 10);
	                        if (!isNaN(int_key) && int_key >= arr_index) {
	                            arr_index = int_key + 1;
	                        }
	                    });
	                }
	            });
	            if (params.length === 0) {
	                throw new Twig.Error("Filter merge expects at least one parameter");
	            }

	            return obj;
	        },
	        date: function(value, params) {
	            var date = Twig.functions.date(value);
	            var format = params && params.length ? params[0] : 'F j, Y H:i';
	            return Twig.lib.date(format, date);
	        },

	        date_modify: function(value, params) {
	            if (value === undefined || value === null) {
	                return;
	            }
	            if (params === undefined || params.length !== 1) {
	                throw new Twig.Error("date_modify filter expects 1 argument");
	            }

	            var modifyText = params[0], time;

	            if (Twig.lib.is("Date", value)) {
	                time = Twig.lib.strtotime(modifyText, value.getTime() / 1000);
	            }
	            if (Twig.lib.is("String", value)) {
	                time = Twig.lib.strtotime(modifyText, Twig.lib.strtotime(value));
	            }
	            if (Twig.lib.is("Number", value)) {
	                time = Twig.lib.strtotime(modifyText, value);
	            }

	            return new Date(time * 1000);
	        },

	        replace: function(value, params) {
	            if (value === undefined||value === null){
	                return;
	            }

	            var pairs = params[0],
	                tag;
	            for (tag in pairs) {
	                if (pairs.hasOwnProperty(tag) && tag !== "_keys") {
	                    value = Twig.lib.replaceAll(value, tag, pairs[tag]);
	                }
	            }
	            return value;
	        },

	        format: function(value, params) {
	            if (value === undefined || value === null){
	                return;
	            }

	            return Twig.lib.vsprintf(value, params);
	        },

	        striptags: function(value) {
	            if (value === undefined || value === null){
	                return;
	            }

	            return Twig.lib.strip_tags(value);
	        },

	        escape: function(value, params) {
	            if (value === undefined|| value === null){
	                return;
	            }

	            var strategy = "html";
	            if(params && params.length && params[0] !== true)
	                strategy = params[0];

	            if(strategy == "html") {
	                var raw_value = value.toString().replace(/&/g, "&amp;")
	                            .replace(/</g, "&lt;")
	                            .replace(/>/g, "&gt;")
	                            .replace(/"/g, "&quot;")
	                            .replace(/'/g, "&#039;");
	                return Twig.Markup(raw_value, 'html');
	            } else if(strategy == "js") {
	                var raw_value = value.toString();
	                var result = "";

	                for(var i = 0; i < raw_value.length; i++) {
	                    if(raw_value[i].match(/^[a-zA-Z0-9,\._]$/))
	                        result += raw_value[i];
	                    else {
	                        var char_code = raw_value.charCodeAt(i);

	                        if(char_code < 0x80)
	                            result += "\\x" + char_code.toString(16).toUpperCase();
	                        else
	                            result += Twig.lib.sprintf("\\u%04s", char_code.toString(16).toUpperCase());
	                    }
	                }

	                return Twig.Markup(result, 'js');
	            } else if(strategy == "css") {
	                var raw_value = value.toString();
	                var result = "";

	                for(var i = 0; i < raw_value.length; i++) {
	                    if(raw_value[i].match(/^[a-zA-Z0-9]$/))
	                        result += raw_value[i];
	                    else {
	                        var char_code = raw_value.charCodeAt(i);
	                        result += "\\" + char_code.toString(16).toUpperCase() + " ";
	                    }
	                }

	                return Twig.Markup(result, 'css');
	            } else if(strategy == "url") {
	                var result = Twig.filters.url_encode(value);
	                return Twig.Markup(result, 'url');
	            } else if(strategy == "html_attr") {
	                var raw_value = value.toString();
	                var result = "";

	                for(var i = 0; i < raw_value.length; i++) {
	                    if(raw_value[i].match(/^[a-zA-Z0-9,\.\-_]$/))
	                        result += raw_value[i];
	                    else if(raw_value[i].match(/^[&<>"]$/))
	                        result += raw_value[i].replace(/&/g, "&amp;")
	                                .replace(/</g, "&lt;")
	                                .replace(/>/g, "&gt;")
	                                .replace(/"/g, "&quot;");
	                    else {
	                        var char_code = raw_value.charCodeAt(i);

	                        // The following replaces characters undefined in HTML with
	                        // the hex entity for the Unicode replacement character.
	                        if(char_code <= 0x1f && char_code != 0x09 && char_code != 0x0a && char_code != 0x0d)
	                            result += "&#xFFFD;";
	                        else if(char_code < 0x80)
	                            result += Twig.lib.sprintf("&#x%02s;", char_code.toString(16).toUpperCase());
	                        else
	                            result += Twig.lib.sprintf("&#x%04s;", char_code.toString(16).toUpperCase());
	                    }
	                }

	                return Twig.Markup(result, 'html_attr');
	            } else {
	                throw new Twig.Error("escape strategy unsupported");
	            }
	        },

	        /* Alias of escape */
	        "e": function(value, params) {
	            return Twig.filters.escape(value, params);
	        },

	        nl2br: function(value) {
	            if (value === undefined || value === null){
	                return;
	            }
	            var linebreak_tag = "BACKSLASH_n_replace",
	                br = "<br />" + linebreak_tag;

	            value = Twig.filters.escape(value)
	                        .replace(/\r\n/g, br)
	                        .replace(/\r/g, br)
	                        .replace(/\n/g, br);

	            value = Twig.lib.replaceAll(value, linebreak_tag, "\n");

	            return Twig.Markup(value);
	        },

	        /**
	         * Adapted from: http://phpjs.org/functions/number_format:481
	         */
	        number_format: function(value, params) {
	            var number = value,
	                decimals = (params && params[0]) ? params[0] : undefined,
	                dec      = (params && params[1] !== undefined) ? params[1] : ".",
	                sep      = (params && params[2] !== undefined) ? params[2] : ",";

	            number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
	            var n = !isFinite(+number) ? 0 : +number,
	                prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
	                s = '',
	                toFixedFix = function (n, prec) {
	                    var k = Math.pow(10, prec);
	                    return '' + Math.round(n * k) / k;
	                };
	            // Fix for IE parseFloat(0.55).toFixed(0) = 0;
	            s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
	            if (s[0].length > 3) {
	                s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
	            }
	            if ((s[1] || '').length < prec) {
	                s[1] = s[1] || '';
	                s[1] += new Array(prec - s[1].length + 1).join('0');
	            }
	            return s.join(dec);
	        },

	        trim: function(value, params) {
	            if (value === undefined|| value === null){
	                return;
	            }

	            var str = Twig.filters.escape( '' + value ),
	                whitespace;
	            if ( params && params[0] ) {
	                whitespace = '' + params[0];
	            } else {
	                whitespace = ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
	            }
	            for (var i = 0; i < str.length; i++) {
	                if (whitespace.indexOf(str.charAt(i)) === -1) {
	                    str = str.substring(i);
	                    break;
	                }
	            }
	            for (i = str.length - 1; i >= 0; i--) {
	                if (whitespace.indexOf(str.charAt(i)) === -1) {
	                    str = str.substring(0, i + 1);
	                    break;
	                }
	            }
	            return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
	        },

	        truncate: function (value, params) {
	            var length = 30,
	                preserve = false,
	                separator = '...';

	            value =  value + '';
	            if (params) {
	                if (params[0]) {
	                    length = params[0];
	                }
	                if (params[1]) {
	                    preserve = params[1];
	                }
	                if (params[2]) {
	                    separator = params[2];
	                }
	            }

	            if (value.length > length) {

	                if (preserve) {
	                    length = value.indexOf(' ', length);
	                    if (length === -1) {
	                        return value;
	                    }
	                }

	                value =  value.substr(0, length) + separator;
	            }

	            return value;
	        },

	        slice: function(value, params) {
	            if (value === undefined || value === null) {
	                return;
	            }
	            if (params === undefined || params.length < 1) {
	                throw new Twig.Error("slice filter expects at least 1 argument");
	            }

	            // default to start of string
	            var start = params[0] || 0;
	            // default to length of string
	            var length = params.length > 1 ? params[1] : value.length;
	            // handle negative start values
	            var startIndex = start >= 0 ? start : Math.max( value.length + start, 0 );

	            if (Twig.lib.is("Array", value)) {
	                var output = [];
	                for (var i = startIndex; i < startIndex + length && i < value.length; i++) {
	                    output.push(value[i]);
	                }
	                return output;
	            } else if (Twig.lib.is("String", value)) {
	                return value.substr(startIndex, length);
	            } else {
	                throw new Twig.Error("slice filter expects value to be an array or string");
	            }
	        },

	        abs: function(value) {
	            if (value === undefined || value === null) {
	                return;
	            }

	            return Math.abs(value);
	        },

	        first: function(value) {
	            if (is("Array", value)) {
	                return value[0];
	            } else if (is("Object", value)) {
	                if ('_keys' in value) {
	                    return value[value._keys[0]];
	                }
	            } else if ( typeof value === "string" ) {
	                return value.substr(0, 1);
	            }

	            return;
	        },

	        split: function(value, params) {
	            if (value === undefined || value === null) {
	                return;
	            }
	            if (params === undefined || params.length < 1 || params.length > 2) {
	                throw new Twig.Error("split filter expects 1 or 2 argument");
	            }
	            if (Twig.lib.is("String", value)) {
	                var delimiter = params[0],
	                    limit = params[1],
	                    split = value.split(delimiter);

	                if (limit === undefined) {

	                    return split;

	                } else if (limit < 0) {

	                    return value.split(delimiter, split.length + limit);

	                } else {

	                    var limitedSplit = [];

	                    if (delimiter == '') {
	                        // empty delimiter
	                        // "aabbcc"|split('', 2)
	                        //     -> ['aa', 'bb', 'cc']

	                        while(split.length > 0) {
	                            var temp = "";
	                            for (var i=0; i<limit && split.length > 0; i++) {
	                                temp += split.shift();
	                            }
	                            limitedSplit.push(temp);
	                        }

	                    } else {
	                        // non-empty delimiter
	                        // "one,two,three,four,five"|split(',', 3)
	                        //     -> ['one', 'two', 'three,four,five']

	                        for (var i=0; i<limit-1 && split.length > 0; i++) {
	                            limitedSplit.push(split.shift());
	                        }

	                        if (split.length > 0) {
	                            limitedSplit.push(split.join(delimiter));
	                        }
	                    }

	                    return limitedSplit;
	                }

	            } else {
	                throw new Twig.Error("split filter expects value to be a string");
	            }
	        },
	        last: function(value) {
	            if (Twig.lib.is('Object', value)) {
	                var keys;

	                if (value._keys === undefined) {
	                    keys = Object.keys(value);
	                } else {
	                    keys = value._keys;
	                }

	                return value[keys[keys.length - 1]];
	            }

	            // string|array
	            return value[value.length - 1];
	        },
	        raw: function(value) {
	            return Twig.Markup(value);
	        },
	        batch: function(items, params) {
	            var size = params.shift(),
	                fill = params.shift(),
	                result,
	                last,
	                missing;

	            if (!Twig.lib.is("Array", items)) {
	                throw new Twig.Error("batch filter expects items to be an array");
	            }

	            if (!Twig.lib.is("Number", size)) {
	                throw new Twig.Error("batch filter expects size to be a number");
	            }

	            size = Math.ceil(size);

	            result = Twig.lib.chunkArray(items, size);

	            if (fill && items.length % size != 0) {
	                last = result.pop();
	                missing = size - last.length;

	                while (missing--) {
	                    last.push(fill);
	                }

	                result.push(last);
	            }

	            return result;
	        },
	        round: function(value, params) {
	            params = params || [];

	            var precision = params.length > 0 ? params[0] : 0,
	                method = params.length > 1 ? params[1] : "common";

	            value = parseFloat(value);

	            if(precision && !Twig.lib.is("Number", precision)) {
	                throw new Twig.Error("round filter expects precision to be a number");
	            }

	            if (method === "common") {
	                return Twig.lib.round(value, precision);
	            }

	            if(!Twig.lib.is("Function", Math[method])) {
	                throw new Twig.Error("round filter expects method to be 'floor', 'ceil', or 'common'");
	            }

	            return Math[method](value * Math.pow(10, precision)) / Math.pow(10, precision);
	        }
	    };

	    Twig.filter = function(filter, value, params) {
	        if (!Twig.filters[filter]) {
	            throw "Unable to find filter " + filter;
	        }
	        return Twig.filters[filter].apply(this, [value, params]);
	    };

	    Twig.filter.extend = function(filter, definition) {
	        Twig.filters[filter] = definition;
	    };

	    return Twig;

	};


/***/ },
/* 6 */
/***/ function(module, exports) {

	// ## twig.functions.js
	//
	// This file handles parsing filters.
	module.exports = function (Twig) {
	    /**
	     * @constant
	     * @type {string}
	     */
	    var TEMPLATE_NOT_FOUND_MESSAGE = 'Template "{name}" is not defined.';

	    // Determine object type
	    function is(type, obj) {
	        var clas = Object.prototype.toString.call(obj).slice(8, -1);
	        return obj !== undefined && obj !== null && clas === type;
	    }

	    Twig.functions = {
	        //  attribute, block, constant, date, dump, parent, random,.

	        // Range function from http://phpjs.org/functions/range:499
	        // Used under an MIT License
	        range: function (low, high, step) {
	            // http://kevin.vanzonneveld.net
	            // +   original by: Waldo Malqui Silva
	            // *     example 1: range ( 0, 12 );
	            // *     returns 1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
	            // *     example 2: range( 0, 100, 10 );
	            // *     returns 2: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
	            // *     example 3: range( 'a', 'i' );
	            // *     returns 3: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
	            // *     example 4: range( 'c', 'a' );
	            // *     returns 4: ['c', 'b', 'a']
	            var matrix = [];
	            var inival, endval, plus;
	            var walker = step || 1;
	            var chars = false;

	            if (!isNaN(low) && !isNaN(high)) {
	                inival = parseInt(low, 10);
	                endval = parseInt(high, 10);
	            } else if (isNaN(low) && isNaN(high)) {
	                chars = true;
	                inival = low.charCodeAt(0);
	                endval = high.charCodeAt(0);
	            } else {
	                inival = (isNaN(low) ? 0 : low);
	                endval = (isNaN(high) ? 0 : high);
	            }

	            plus = ((inival > endval) ? false : true);
	            if (plus) {
	                while (inival <= endval) {
	                    matrix.push(((chars) ? String.fromCharCode(inival) : inival));
	                    inival += walker;
	                }
	            } else {
	                while (inival >= endval) {
	                    matrix.push(((chars) ? String.fromCharCode(inival) : inival));
	                    inival -= walker;
	                }
	            }

	            return matrix;
	        },
	        cycle: function(arr, i) {
	            var pos = i % arr.length;
	            return arr[pos];
	        },
	        dump: function() {
	            var EOL = '\n',
	                indentChar = '  ',
	                indentTimes = 0,
	                out = '',
	                args = Array.prototype.slice.call(arguments),
	                indent = function(times) {
	                    var ind  = '';
	                    while (times > 0) {
	                        times--;
	                        ind += indentChar;
	                    }
	                    return ind;
	                },
	                displayVar = function(variable) {
	                    out += indent(indentTimes);
	                    if (typeof(variable) === 'object') {
	                        dumpVar(variable);
	                    } else if (typeof(variable) === 'function') {
	                        out += 'function()' + EOL;
	                    } else if (typeof(variable) === 'string') {
	                        out += 'string(' + variable.length + ') "' + variable + '"' + EOL;
	                    } else if (typeof(variable) === 'number') {
	                        out += 'number(' + variable + ')' + EOL;
	                    } else if (typeof(variable) === 'boolean') {
	                        out += 'bool(' + variable + ')' + EOL;
	                    }
	                },
	                dumpVar = function(variable) {
	                    var i;
	                    if (variable === null) {
	                        out += 'NULL' + EOL;
	                    } else if (variable === undefined) {
	                        out += 'undefined' + EOL;
	                    } else if (typeof variable === 'object') {
	                        out += indent(indentTimes) + typeof(variable);
	                        indentTimes++;
	                        out += '(' + (function(obj) {
	                            var size = 0, key;
	                            for (key in obj) {
	                                if (obj.hasOwnProperty(key)) {
	                                    size++;
	                                }
	                            }
	                            return size;
	                        })(variable) + ') {' + EOL;
	                        for (i in variable) {
	                            out += indent(indentTimes) + '[' + i + ']=> ' + EOL;
	                            displayVar(variable[i]);
	                        }
	                        indentTimes--;
	                        out += indent(indentTimes) + '}' + EOL;
	                    } else {
	                        displayVar(variable);
	                    }
	                };

	            // handle no argument case by dumping the entire render context
	            if (args.length == 0) args.push(this.context);

	            Twig.forEach(args, function(variable) {
	                dumpVar(variable);
	            });

	            return out;
	        },
	        date: function(date, time) {
	            var dateObj;
	            if (date === undefined || date === null || date === "") {
	                dateObj = new Date();
	            } else if (Twig.lib.is("Date", date)) {
	                dateObj = date;
	            } else if (Twig.lib.is("String", date)) {
	                if (date.match(/^[0-9]+$/)) {
	                    dateObj = new Date(date * 1000);
	                }
	                else {
	                    dateObj = new Date(Twig.lib.strtotime(date) * 1000);
	                }
	            } else if (Twig.lib.is("Number", date)) {
	                // timestamp
	                dateObj = new Date(date * 1000);
	            } else {
	                throw new Twig.Error("Unable to parse date " + date);
	            }
	            return dateObj;
	        },
	        block: function(block) {
	            if (this.originalBlockTokens[block]) {
	                return Twig.logic.parse.apply(this, [this.originalBlockTokens[block], this.context]).output;
	            } else {
	                return this.blocks[block];
	            }
	        },
	        parent: function() {
	            // Add a placeholder
	            return Twig.placeholders.parent;
	        },
	        attribute: function(object, method, params) {
	            if (Twig.lib.is('Object', object)) {
	                if (object.hasOwnProperty(method)) {
	                    if (typeof object[method] === "function") {
	                        return object[method].apply(undefined, params);
	                    }
	                    else {
	                        return object[method];
	                    }
	                }
	            }
	            // Array will return element 0-index
	            return object[method] || undefined;
	        },
	        max: function(values) {
	            if(Twig.lib.is("Object", values)) {
	                delete values["_keys"];
	                return Twig.lib.max(values);
	            }

	            return Twig.lib.max.apply(null, arguments);
	        },
	        min: function(values) {
	            if(Twig.lib.is("Object", values)) {
	                delete values["_keys"];
	                return Twig.lib.min(values);
	            }

	            return Twig.lib.min.apply(null, arguments);
	        },
	        template_from_string: function(template) {
	            if (template === undefined) {
	                template = '';
	            }
	            return Twig.Templates.parsers.twig({
	                options: this.options,
	                data: template
	            });
	        },
	        random: function(value) {
	            var LIMIT_INT31 = 0x80000000;

	            function getRandomNumber(n) {
	                var random = Math.floor(Math.random() * LIMIT_INT31);
	                var limits = [0, n];
	                var min = Math.min.apply(null, limits),
	                    max = Math.max.apply(null, limits);
	                return min + Math.floor((max - min + 1) * random / LIMIT_INT31);
	            }

	            if(Twig.lib.is("Number", value)) {
	                return getRandomNumber(value);
	            }

	            if(Twig.lib.is("String", value)) {
	                return value.charAt(getRandomNumber(value.length-1));
	            }

	            if(Twig.lib.is("Array", value)) {
	                return value[getRandomNumber(value.length-1)];
	            }

	            if(Twig.lib.is("Object", value)) {
	                var keys = Object.keys(value);
	                return value[keys[getRandomNumber(keys.length-1)]];
	            }

	            return getRandomNumber(LIMIT_INT31-1);
	        },

	        /**
	         * Returns the content of a template without rendering it
	         * @param {string} name
	         * @param {boolean} [ignore_missing=false]
	         * @returns {string}
	         */
	        source: function(name, ignore_missing) {
	            var templateSource;
	            var templateFound = false;
	            var isNodeEnvironment = typeof module !== 'undefined' && typeof module.exports !== 'undefined' && typeof window === 'undefined';
	            var loader;
	            var path;

	            //if we are running in a node.js environment, set the loader to 'fs' and ensure the
	            // path is relative to the CWD of the running script
	            //else, set the loader to 'ajax' and set the path to the value of name
	            if (isNodeEnvironment) {
	                loader = 'fs';
	                path = __dirname + '/' + name;
	            } else {
	                loader = 'ajax';
	                path = name;
	            }

	            //build the params object
	            var params = {
	                id: name,
	                path: path,
	                method: loader,
	                parser: 'source',
	                async: false,
	                fetchTemplateSource: true
	            };

	            //default ignore_missing to false
	            if (typeof ignore_missing === 'undefined') {
	                ignore_missing = false;
	            }

	            //try to load the remote template
	            //
	            //on exception, log it
	            try {
	                templateSource = Twig.Templates.loadRemote(name, params);

	                //if the template is undefined or null, set the template to an empty string and do NOT flip the
	                // boolean indicating we found the template
	                //
	                //else, all is good! flip the boolean indicating we found the template
	                if (typeof templateSource === 'undefined' || templateSource === null) {
	                    templateSource = '';
	                } else {
	                    templateFound = true;
	                }
	            } catch (e) {
	                Twig.log.debug('Twig.functions.source: ', 'Problem loading template  ', e);
	            }

	            //if the template was NOT found AND we are not ignoring missing templates, return the same message
	            // that is returned by the PHP implementation of the twig source() function
	            //
	            //else, return the template source
	            if (!templateFound && !ignore_missing) {
	                return TEMPLATE_NOT_FOUND_MESSAGE.replace('{name}', name);
	            } else {
	                return templateSource;
	            }
	        }
	    };

	    Twig._function = function(_function, value, params) {
	        if (!Twig.functions[_function]) {
	            throw "Unable to find function " + _function;
	        }
	        return Twig.functions[_function](value, params);
	    };

	    Twig._function.extend = function(_function, definition) {
	        Twig.functions[_function] = definition;
	    };

	    return Twig;

	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	// ## twig.lib.js
	//
	// This file contains 3rd party libraries used within twig.
	//
	// Copies of the licenses for the code included here can be found in the
	// LICENSES.md file.
	//

	module.exports = function(Twig) {

	    // Namespace for libraries
	    Twig.lib = { };

	    Twig.lib.sprintf = __webpack_require__(8);
	    Twig.lib.vsprintf = __webpack_require__(9);
	    Twig.lib.round = __webpack_require__(10);
	    Twig.lib.max = __webpack_require__(11);
	    Twig.lib.min = __webpack_require__(12);
	    Twig.lib.strip_tags = __webpack_require__(13);
	    Twig.lib.strtotime = __webpack_require__(14);
	    Twig.lib.date = __webpack_require__(15);
	    Twig.lib.boolval = __webpack_require__(16);

	    Twig.lib.is = function(type, obj) {
	        var clas = Object.prototype.toString.call(obj).slice(8, -1);
	        return obj !== undefined && obj !== null && clas === type;
	    };

	    // shallow-copy an object
	    Twig.lib.copy = function(src) {
	        var target = {},
	            key;
	        for (key in src)
	            target[key] = src[key];

	        return target;
	    };

	    Twig.lib.extend = function (src, add) {
	        var keys = Object.keys(add),
	            i;

	        i = keys.length;

	        while (i--) {
	            src[keys[i]] = add[keys[i]];
	        }

	        return src;
	    };

	    Twig.lib.replaceAll = function(string, search, replace) {
	        return string.split(search).join(replace);
	    };

	    // chunk an array (arr) into arrays of (size) items, returns an array of arrays, or an empty array on invalid input
	    Twig.lib.chunkArray = function (arr, size) {
	        var returnVal = [],
	            x = 0,
	            len = arr.length;

	        if (size < 1 || !Twig.lib.is("Array", arr)) {
	            return [];
	        }

	        while (x < len) {
	            returnVal.push(arr.slice(x, x += size));
	        }

	        return returnVal;
	    };

	    return Twig;
	};


/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function sprintf() {
	  //  discuss at: http://locutus.io/php/sprintf/
	  // original by: Ash Searle (http://hexmen.com/blog/)
	  // improved by: Michael White (http://getsprink.com)
	  // improved by: Jack
	  // improved by: Kevin van Zonneveld (http://kvz.io)
	  // improved by: Kevin van Zonneveld (http://kvz.io)
	  // improved by: Kevin van Zonneveld (http://kvz.io)
	  // improved by: Dj
	  // improved by: Allidylls
	  //    input by: Paulo Freitas
	  //    input by: Brett Zamir (http://brett-zamir.me)
	  //   example 1: sprintf("%01.2f", 123.1)
	  //   returns 1: '123.10'
	  //   example 2: sprintf("[%10s]", 'monkey')
	  //   returns 2: '[    monkey]'
	  //   example 3: sprintf("[%'#10s]", 'monkey')
	  //   returns 3: '[####monkey]'
	  //   example 4: sprintf("%d", 123456789012345)
	  //   returns 4: '123456789012345'
	  //   example 5: sprintf('%-03s', 'E')
	  //   returns 5: 'E00'

	  var regex = /%%|%(\d+\$)?([-+'#0 ]*)(\*\d+\$|\*|\d+)?(?:\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g;
	  var a = arguments;
	  var i = 0;
	  var format = a[i++];

	  var _pad = function _pad(str, len, chr, leftJustify) {
	    if (!chr) {
	      chr = ' ';
	    }
	    var padding = str.length >= len ? '' : new Array(1 + len - str.length >>> 0).join(chr);
	    return leftJustify ? str + padding : padding + str;
	  };

	  var justify = function justify(value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
	    var diff = minWidth - value.length;
	    if (diff > 0) {
	      if (leftJustify || !zeroPad) {
	        value = _pad(value, minWidth, customPadChar, leftJustify);
	      } else {
	        value = [value.slice(0, prefix.length), _pad('', diff, '0', true), value.slice(prefix.length)].join('');
	      }
	    }
	    return value;
	  };

	  var _formatBaseX = function _formatBaseX(value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
	    // Note: casts negative numbers to positive ones
	    var number = value >>> 0;
	    prefix = prefix && number && {
	      '2': '0b',
	      '8': '0',
	      '16': '0x'
	    }[base] || '';
	    value = prefix + _pad(number.toString(base), precision || 0, '0', false);
	    return justify(value, prefix, leftJustify, minWidth, zeroPad);
	  };

	  // _formatString()
	  var _formatString = function _formatString(value, leftJustify, minWidth, precision, zeroPad, customPadChar) {
	    if (precision !== null && precision !== undefined) {
	      value = value.slice(0, precision);
	    }
	    return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
	  };

	  // doFormat()
	  var doFormat = function doFormat(substring, valueIndex, flags, minWidth, precision, type) {
	    var number, prefix, method, textTransform, value;

	    if (substring === '%%') {
	      return '%';
	    }

	    // parse flags
	    var leftJustify = false;
	    var positivePrefix = '';
	    var zeroPad = false;
	    var prefixBaseX = false;
	    var customPadChar = ' ';
	    var flagsl = flags.length;
	    var j;
	    for (j = 0; j < flagsl; j++) {
	      switch (flags.charAt(j)) {
	        case ' ':
	          positivePrefix = ' ';
	          break;
	        case '+':
	          positivePrefix = '+';
	          break;
	        case '-':
	          leftJustify = true;
	          break;
	        case "'":
	          customPadChar = flags.charAt(j + 1);
	          break;
	        case '0':
	          zeroPad = true;
	          customPadChar = '0';
	          break;
	        case '#':
	          prefixBaseX = true;
	          break;
	      }
	    }

	    // parameters may be null, undefined, empty-string or real valued
	    // we want to ignore null, undefined and empty-string values
	    if (!minWidth) {
	      minWidth = 0;
	    } else if (minWidth === '*') {
	      minWidth = +a[i++];
	    } else if (minWidth.charAt(0) === '*') {
	      minWidth = +a[minWidth.slice(1, -1)];
	    } else {
	      minWidth = +minWidth;
	    }

	    // Note: undocumented perl feature:
	    if (minWidth < 0) {
	      minWidth = -minWidth;
	      leftJustify = true;
	    }

	    if (!isFinite(minWidth)) {
	      throw new Error('sprintf: (minimum-)width must be finite');
	    }

	    if (!precision) {
	      precision = 'fFeE'.indexOf(type) > -1 ? 6 : type === 'd' ? 0 : undefined;
	    } else if (precision === '*') {
	      precision = +a[i++];
	    } else if (precision.charAt(0) === '*') {
	      precision = +a[precision.slice(1, -1)];
	    } else {
	      precision = +precision;
	    }

	    // grab value using valueIndex if required?
	    value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];

	    switch (type) {
	      case 's':
	        return _formatString(value + '', leftJustify, minWidth, precision, zeroPad, customPadChar);
	      case 'c':
	        return _formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
	      case 'b':
	        return _formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
	      case 'o':
	        return _formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
	      case 'x':
	        return _formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
	      case 'X':
	        return _formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).toUpperCase();
	      case 'u':
	        return _formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
	      case 'i':
	      case 'd':
	        number = +value || 0;
	        // Plain Math.round doesn't just truncate
	        number = Math.round(number - number % 1);
	        prefix = number < 0 ? '-' : positivePrefix;
	        value = prefix + _pad(String(Math.abs(number)), precision, '0', false);
	        return justify(value, prefix, leftJustify, minWidth, zeroPad);
	      case 'e':
	      case 'E':
	      case 'f': // @todo: Should handle locales (as per setlocale)
	      case 'F':
	      case 'g':
	      case 'G':
	        number = +value;
	        prefix = number < 0 ? '-' : positivePrefix;
	        method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
	        textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
	        value = prefix + Math.abs(number)[method](precision);
	        return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
	      default:
	        return substring;
	    }
	  };

	  return format.replace(regex, doFormat);
	};
	//# sourceMappingURL=sprintf.js.map

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function vsprintf(format, args) {
	  //  discuss at: http://locutus.io/php/vsprintf/
	  // original by: ejsanders
	  //   example 1: vsprintf('%04d-%02d-%02d', [1988, 8, 1])
	  //   returns 1: '1988-08-01'

	  var sprintf = __webpack_require__(8);

	  return sprintf.apply(this, [format].concat(args));
	};
	//# sourceMappingURL=vsprintf.js.map

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function round(value, precision, mode) {
	  //  discuss at: http://locutus.io/php/round/
	  // original by: Philip Peterson
	  //  revised by: Onno Marsman (https://twitter.com/onnomarsman)
	  //  revised by: T.Wild
	  //  revised by: Rafał Kukawski (http://blog.kukawski.pl)
	  //    input by: Greenseed
	  //    input by: meo
	  //    input by: William
	  //    input by: Josep Sanz (http://www.ws3.es/)
	  // bugfixed by: Brett Zamir (http://brett-zamir.me)
	  //      note 1: Great work. Ideas for improvement:
	  //      note 1: - code more compliant with developer guidelines
	  //      note 1: - for implementing PHP constant arguments look at
	  //      note 1: the pathinfo() function, it offers the greatest
	  //      note 1: flexibility & compatibility possible
	  //   example 1: round(1241757, -3)
	  //   returns 1: 1242000
	  //   example 2: round(3.6)
	  //   returns 2: 4
	  //   example 3: round(2.835, 2)
	  //   returns 3: 2.84
	  //   example 4: round(1.1749999999999, 2)
	  //   returns 4: 1.17
	  //   example 5: round(58551.799999999996, 2)
	  //   returns 5: 58551.8

	  var m, f, isHalf, sgn; // helper variables
	  // making sure precision is integer
	  precision |= 0;
	  m = Math.pow(10, precision);
	  value *= m;
	  // sign of the number
	  sgn = value > 0 | -(value < 0);
	  isHalf = value % 1 === 0.5 * sgn;
	  f = Math.floor(value);

	  if (isHalf) {
	    switch (mode) {
	      case 'PHP_ROUND_HALF_DOWN':
	        // rounds .5 toward zero
	        value = f + (sgn < 0);
	        break;
	      case 'PHP_ROUND_HALF_EVEN':
	        // rouds .5 towards the next even integer
	        value = f + f % 2 * sgn;
	        break;
	      case 'PHP_ROUND_HALF_ODD':
	        // rounds .5 towards the next odd integer
	        value = f + !(f % 2);
	        break;
	      default:
	        // rounds .5 away from zero
	        value = f + (sgn > 0);
	    }
	  }

	  return (isHalf ? value : Math.round(value)) / m;
	};
	//# sourceMappingURL=round.js.map

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	module.exports = function max() {
	  //  discuss at: http://locutus.io/php/max/
	  // original by: Onno Marsman (https://twitter.com/onnomarsman)
	  //  revised by: Onno Marsman (https://twitter.com/onnomarsman)
	  // improved by: Jack
	  //      note 1: Long code cause we're aiming for maximum PHP compatibility
	  //   example 1: max(1, 3, 5, 6, 7)
	  //   returns 1: 7
	  //   example 2: max([2, 4, 5])
	  //   returns 2: 5
	  //   example 3: max(0, 'hello')
	  //   returns 3: 0
	  //   example 4: max('hello', 0)
	  //   returns 4: 'hello'
	  //   example 5: max(-1, 'hello')
	  //   returns 5: 'hello'
	  //   example 6: max([2, 4, 8], [2, 5, 7])
	  //   returns 6: [2, 5, 7]

	  var ar;
	  var retVal;
	  var i = 0;
	  var n = 0;
	  var argv = arguments;
	  var argc = argv.length;
	  var _obj2Array = function _obj2Array(obj) {
	    if (Object.prototype.toString.call(obj) === '[object Array]') {
	      return obj;
	    } else {
	      var ar = [];
	      for (var i in obj) {
	        if (obj.hasOwnProperty(i)) {
	          ar.push(obj[i]);
	        }
	      }
	      return ar;
	    }
	  };
	  var _compare = function _compare(current, next) {
	    var i = 0;
	    var n = 0;
	    var tmp = 0;
	    var nl = 0;
	    var cl = 0;

	    if (current === next) {
	      return 0;
	    } else if ((typeof current === 'undefined' ? 'undefined' : _typeof(current)) === 'object') {
	      if ((typeof next === 'undefined' ? 'undefined' : _typeof(next)) === 'object') {
	        current = _obj2Array(current);
	        next = _obj2Array(next);
	        cl = current.length;
	        nl = next.length;
	        if (nl > cl) {
	          return 1;
	        } else if (nl < cl) {
	          return -1;
	        }
	        for (i = 0, n = cl; i < n; ++i) {
	          tmp = _compare(current[i], next[i]);
	          if (tmp === 1) {
	            return 1;
	          } else if (tmp === -1) {
	            return -1;
	          }
	        }
	        return 0;
	      }
	      return -1;
	    } else if ((typeof next === 'undefined' ? 'undefined' : _typeof(next)) === 'object') {
	      return 1;
	    } else if (isNaN(next) && !isNaN(current)) {
	      if (current === 0) {
	        return 0;
	      }
	      return current < 0 ? 1 : -1;
	    } else if (isNaN(current) && !isNaN(next)) {
	      if (next === 0) {
	        return 0;
	      }
	      return next > 0 ? 1 : -1;
	    }

	    if (next === current) {
	      return 0;
	    }

	    return next > current ? 1 : -1;
	  };

	  if (argc === 0) {
	    throw new Error('At least one value should be passed to max()');
	  } else if (argc === 1) {
	    if (_typeof(argv[0]) === 'object') {
	      ar = _obj2Array(argv[0]);
	    } else {
	      throw new Error('Wrong parameter count for max()');
	    }
	    if (ar.length === 0) {
	      throw new Error('Array must contain at least one element for max()');
	    }
	  } else {
	    ar = argv;
	  }

	  retVal = ar[0];
	  for (i = 1, n = ar.length; i < n; ++i) {
	    if (_compare(retVal, ar[i]) === 1) {
	      retVal = ar[i];
	    }
	  }

	  return retVal;
	};
	//# sourceMappingURL=max.js.map

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	module.exports = function min() {
	  //  discuss at: http://locutus.io/php/min/
	  // original by: Onno Marsman (https://twitter.com/onnomarsman)
	  //  revised by: Onno Marsman (https://twitter.com/onnomarsman)
	  // improved by: Jack
	  //      note 1: Long code cause we're aiming for maximum PHP compatibility
	  //   example 1: min(1, 3, 5, 6, 7)
	  //   returns 1: 1
	  //   example 2: min([2, 4, 5])
	  //   returns 2: 2
	  //   example 3: min(0, 'hello')
	  //   returns 3: 0
	  //   example 4: min('hello', 0)
	  //   returns 4: 'hello'
	  //   example 5: min(-1, 'hello')
	  //   returns 5: -1
	  //   example 6: min([2, 4, 8], [2, 5, 7])
	  //   returns 6: [2, 4, 8]

	  var ar;
	  var retVal;
	  var i = 0;
	  var n = 0;
	  var argv = arguments;
	  var argc = argv.length;
	  var _obj2Array = function _obj2Array(obj) {
	    if (Object.prototype.toString.call(obj) === '[object Array]') {
	      return obj;
	    }
	    var ar = [];
	    for (var i in obj) {
	      if (obj.hasOwnProperty(i)) {
	        ar.push(obj[i]);
	      }
	    }
	    return ar;
	  };

	  var _compare = function _compare(current, next) {
	    var i = 0;
	    var n = 0;
	    var tmp = 0;
	    var nl = 0;
	    var cl = 0;

	    if (current === next) {
	      return 0;
	    } else if ((typeof current === 'undefined' ? 'undefined' : _typeof(current)) === 'object') {
	      if ((typeof next === 'undefined' ? 'undefined' : _typeof(next)) === 'object') {
	        current = _obj2Array(current);
	        next = _obj2Array(next);
	        cl = current.length;
	        nl = next.length;
	        if (nl > cl) {
	          return 1;
	        } else if (nl < cl) {
	          return -1;
	        }
	        for (i = 0, n = cl; i < n; ++i) {
	          tmp = _compare(current[i], next[i]);
	          if (tmp === 1) {
	            return 1;
	          } else if (tmp === -1) {
	            return -1;
	          }
	        }
	        return 0;
	      }
	      return -1;
	    } else if ((typeof next === 'undefined' ? 'undefined' : _typeof(next)) === 'object') {
	      return 1;
	    } else if (isNaN(next) && !isNaN(current)) {
	      if (current === 0) {
	        return 0;
	      }
	      return current < 0 ? 1 : -1;
	    } else if (isNaN(current) && !isNaN(next)) {
	      if (next === 0) {
	        return 0;
	      }
	      return next > 0 ? 1 : -1;
	    }

	    if (next === current) {
	      return 0;
	    }

	    return next > current ? 1 : -1;
	  };

	  if (argc === 0) {
	    throw new Error('At least one value should be passed to min()');
	  } else if (argc === 1) {
	    if (_typeof(argv[0]) === 'object') {
	      ar = _obj2Array(argv[0]);
	    } else {
	      throw new Error('Wrong parameter count for min()');
	    }

	    if (ar.length === 0) {
	      throw new Error('Array must contain at least one element for min()');
	    }
	  } else {
	    ar = argv;
	  }

	  retVal = ar[0];

	  for (i = 1, n = ar.length; i < n; ++i) {
	    if (_compare(retVal, ar[i]) === -1) {
	      retVal = ar[i];
	    }
	  }

	  return retVal;
	};
	//# sourceMappingURL=min.js.map

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function strip_tags(input, allowed) {
	  // eslint-disable-line camelcase
	  //  discuss at: http://locutus.io/php/strip_tags/
	  // original by: Kevin van Zonneveld (http://kvz.io)
	  // improved by: Luke Godfrey
	  // improved by: Kevin van Zonneveld (http://kvz.io)
	  //    input by: Pul
	  //    input by: Alex
	  //    input by: Marc Palau
	  //    input by: Brett Zamir (http://brett-zamir.me)
	  //    input by: Bobby Drake
	  //    input by: Evertjan Garretsen
	  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
	  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
	  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
	  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
	  // bugfixed by: Eric Nagel
	  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
	  // bugfixed by: Tomasz Wesolowski
	  //  revised by: Rafał Kukawski (http://blog.kukawski.pl)
	  //   example 1: strip_tags('<p>Kevin</p> <br /><b>van</b> <i>Zonneveld</i>', '<i><b>')
	  //   returns 1: 'Kevin <b>van</b> <i>Zonneveld</i>'
	  //   example 2: strip_tags('<p>Kevin <img src="someimage.png" onmouseover="someFunction()">van <i>Zonneveld</i></p>', '<p>')
	  //   returns 2: '<p>Kevin van Zonneveld</p>'
	  //   example 3: strip_tags("<a href='http://kvz.io'>Kevin van Zonneveld</a>", "<a>")
	  //   returns 3: "<a href='http://kvz.io'>Kevin van Zonneveld</a>"
	  //   example 4: strip_tags('1 < 5 5 > 1')
	  //   returns 4: '1 < 5 5 > 1'
	  //   example 5: strip_tags('1 <br/> 1')
	  //   returns 5: '1  1'
	  //   example 6: strip_tags('1 <br/> 1', '<br>')
	  //   returns 6: '1 <br/> 1'
	  //   example 7: strip_tags('1 <br/> 1', '<br><br/>')
	  //   returns 7: '1 <br/> 1'

	  // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
	  allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');

	  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
	  var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;

	  return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
	    return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
	  });
	};
	//# sourceMappingURL=strip_tags.js.map

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function strtotime(text, now) {
	  //  discuss at: http://locutus.io/php/strtotime/
	  // original by: Caio Ariede (http://caioariede.com)
	  // improved by: Kevin van Zonneveld (http://kvz.io)
	  // improved by: Caio Ariede (http://caioariede.com)
	  // improved by: A. Matías Quezada (http://amatiasq.com)
	  // improved by: preuter
	  // improved by: Brett Zamir (http://brett-zamir.me)
	  // improved by: Mirko Faber
	  //    input by: David
	  // bugfixed by: Wagner B. Soares
	  // bugfixed by: Artur Tchernychev
	  // bugfixed by: Stephan Bösch-Plepelits (http://github.com/plepe)
	  //      note 1: Examples all have a fixed timestamp to prevent
	  //      note 1: tests to fail because of variable time(zones)
	  //   example 1: strtotime('+1 day', 1129633200)
	  //   returns 1: 1129719600
	  //   example 2: strtotime('+1 week 2 days 4 hours 2 seconds', 1129633200)
	  //   returns 2: 1130425202
	  //   example 3: strtotime('last month', 1129633200)
	  //   returns 3: 1127041200
	  //   example 4: strtotime('2009-05-04 08:30:00 GMT')
	  //   returns 4: 1241425800
	  //   example 5: strtotime('2009-05-04 08:30:00+00')
	  //   returns 5: 1241425800
	  //   example 6: strtotime('2009-05-04 08:30:00+02:00')
	  //   returns 6: 1241418600
	  //   example 7: strtotime('2009-05-04T08:30:00Z')
	  //   returns 7: 1241425800

	  var parsed;
	  var match;
	  var today;
	  var year;
	  var date;
	  var days;
	  var ranges;
	  var len;
	  var times;
	  var regex;
	  var i;
	  var fail = false;

	  if (!text) {
	    return fail;
	  }

	  // Unecessary spaces
	  text = text.replace(/^\s+|\s+$/g, '').replace(/\s{2,}/g, ' ').replace(/[\t\r\n]/g, '').toLowerCase();

	  // in contrast to php, js Date.parse function interprets:
	  // dates given as yyyy-mm-dd as in timezone: UTC,
	  // dates with "." or "-" as MDY instead of DMY
	  // dates with two-digit years differently
	  // etc...etc...
	  // ...therefore we manually parse lots of common date formats
	  var pattern = new RegExp(['^(\\d{1,4})', '([\\-\\.\\/:])', '(\\d{1,2})', '([\\-\\.\\/:])', '(\\d{1,4})', '(?:\\s(\\d{1,2}):(\\d{2})?:?(\\d{2})?)?', '(?:\\s([A-Z]+)?)?$'].join(''));
	  match = text.match(pattern);

	  if (match && match[2] === match[4]) {
	    if (match[1] > 1901) {
	      switch (match[2]) {
	        case '-':
	          // YYYY-M-D
	          if (match[3] > 12 || match[5] > 31) {
	            return fail;
	          }

	          return new Date(match[1], parseInt(match[3], 10) - 1, match[5], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
	        case '.':
	          // YYYY.M.D is not parsed by strtotime()
	          return fail;
	        case '/':
	          // YYYY/M/D
	          if (match[3] > 12 || match[5] > 31) {
	            return fail;
	          }

	          return new Date(match[1], parseInt(match[3], 10) - 1, match[5], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
	      }
	    } else if (match[5] > 1901) {
	      switch (match[2]) {
	        case '-':
	          // D-M-YYYY
	          if (match[3] > 12 || match[1] > 31) {
	            return fail;
	          }

	          return new Date(match[5], parseInt(match[3], 10) - 1, match[1], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
	        case '.':
	          // D.M.YYYY
	          if (match[3] > 12 || match[1] > 31) {
	            return fail;
	          }

	          return new Date(match[5], parseInt(match[3], 10) - 1, match[1], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
	        case '/':
	          // M/D/YYYY
	          if (match[1] > 12 || match[3] > 31) {
	            return fail;
	          }

	          return new Date(match[5], parseInt(match[1], 10) - 1, match[3], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
	      }
	    } else {
	      switch (match[2]) {
	        case '-':
	          // YY-M-D
	          if (match[3] > 12 || match[5] > 31 || match[1] < 70 && match[1] > 38) {
	            return fail;
	          }

	          year = match[1] >= 0 && match[1] <= 38 ? +match[1] + 2000 : match[1];
	          return new Date(year, parseInt(match[3], 10) - 1, match[5], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
	        case '.':
	          // D.M.YY or H.MM.SS
	          if (match[5] >= 70) {
	            // D.M.YY
	            if (match[3] > 12 || match[1] > 31) {
	              return fail;
	            }

	            return new Date(match[5], parseInt(match[3], 10) - 1, match[1], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
	          }
	          if (match[5] < 60 && !match[6]) {
	            // H.MM.SS
	            if (match[1] > 23 || match[3] > 59) {
	              return fail;
	            }

	            today = new Date();
	            return new Date(today.getFullYear(), today.getMonth(), today.getDate(), match[1] || 0, match[3] || 0, match[5] || 0, match[9] || 0) / 1000;
	          }

	          // invalid format, cannot be parsed
	          return fail;
	        case '/':
	          // M/D/YY
	          if (match[1] > 12 || match[3] > 31 || match[5] < 70 && match[5] > 38) {
	            return fail;
	          }

	          year = match[5] >= 0 && match[5] <= 38 ? +match[5] + 2000 : match[5];
	          return new Date(year, parseInt(match[1], 10) - 1, match[3], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
	        case ':':
	          // HH:MM:SS
	          if (match[1] > 23 || match[3] > 59 || match[5] > 59) {
	            return fail;
	          }

	          today = new Date();
	          return new Date(today.getFullYear(), today.getMonth(), today.getDate(), match[1] || 0, match[3] || 0, match[5] || 0) / 1000;
	      }
	    }
	  }

	  // other formats and "now" should be parsed by Date.parse()
	  if (text === 'now') {
	    return now === null || isNaN(now) ? new Date().getTime() / 1000 | 0 : now | 0;
	  }
	  if (!isNaN(parsed = Date.parse(text))) {
	    return parsed / 1000 | 0;
	  }
	  // Browsers !== Chrome have problems parsing ISO 8601 date strings, as they do
	  // not accept lower case characters, space, or shortened time zones.
	  // Therefore, fix these problems and try again.
	  // Examples:
	  //   2015-04-15 20:33:59+02
	  //   2015-04-15 20:33:59z
	  //   2015-04-15t20:33:59+02:00
	  pattern = new RegExp(['^([0-9]{4}-[0-9]{2}-[0-9]{2})', '[ t]', '([0-9]{2}:[0-9]{2}:[0-9]{2}(\\.[0-9]+)?)', '([\\+-][0-9]{2}(:[0-9]{2})?|z)'].join(''));
	  match = text.match(pattern);
	  if (match) {
	    // @todo: time zone information
	    if (match[4] === 'z') {
	      match[4] = 'Z';
	    } else if (match[4].match(/^([+-][0-9]{2})$/)) {
	      match[4] = match[4] + ':00';
	    }

	    if (!isNaN(parsed = Date.parse(match[1] + 'T' + match[2] + match[4]))) {
	      return parsed / 1000 | 0;
	    }
	  }

	  date = now ? new Date(now * 1000) : new Date();
	  days = {
	    'sun': 0,
	    'mon': 1,
	    'tue': 2,
	    'wed': 3,
	    'thu': 4,
	    'fri': 5,
	    'sat': 6
	  };
	  ranges = {
	    'yea': 'FullYear',
	    'mon': 'Month',
	    'day': 'Date',
	    'hou': 'Hours',
	    'min': 'Minutes',
	    'sec': 'Seconds'
	  };

	  function lastNext(type, range, modifier) {
	    var diff;
	    var day = days[range];

	    if (typeof day !== 'undefined') {
	      diff = day - date.getDay();

	      if (diff === 0) {
	        diff = 7 * modifier;
	      } else if (diff > 0 && type === 'last') {
	        diff -= 7;
	      } else if (diff < 0 && type === 'next') {
	        diff += 7;
	      }

	      date.setDate(date.getDate() + diff);
	    }
	  }

	  function process(val) {
	    // @todo: Reconcile this with regex using \s, taking into account
	    // browser issues with split and regexes
	    var splt = val.split(' ');
	    var type = splt[0];
	    var range = splt[1].substring(0, 3);
	    var typeIsNumber = /\d+/.test(type);
	    var ago = splt[2] === 'ago';
	    var num = (type === 'last' ? -1 : 1) * (ago ? -1 : 1);

	    if (typeIsNumber) {
	      num *= parseInt(type, 10);
	    }

	    if (ranges.hasOwnProperty(range) && !splt[1].match(/^mon(day|\.)?$/i)) {
	      return date['set' + ranges[range]](date['get' + ranges[range]]() + num);
	    }

	    if (range === 'wee') {
	      return date.setDate(date.getDate() + num * 7);
	    }

	    if (type === 'next' || type === 'last') {
	      lastNext(type, range, num);
	    } else if (!typeIsNumber) {
	      return false;
	    }

	    return true;
	  }

	  times = '(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec' + '|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?' + '|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)';
	  regex = '([+-]?\\d+\\s' + times + '|' + '(last|next)\\s' + times + ')(\\sago)?';

	  match = text.match(new RegExp(regex, 'gi'));
	  if (!match) {
	    return fail;
	  }

	  for (i = 0, len = match.length; i < len; i++) {
	    if (!process(match[i])) {
	      return fail;
	    }
	  }

	  return date.getTime() / 1000;
	};
	//# sourceMappingURL=strtotime.js.map

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function date(format, timestamp) {
	  //  discuss at: http://locutus.io/php/date/
	  // original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
	  // original by: gettimeofday
	  //    parts by: Peter-Paul Koch (http://www.quirksmode.org/js/beat.html)
	  // improved by: Kevin van Zonneveld (http://kvz.io)
	  // improved by: MeEtc (http://yass.meetcweb.com)
	  // improved by: Brad Touesnard
	  // improved by: Tim Wiel
	  // improved by: Bryan Elliott
	  // improved by: David Randall
	  // improved by: Theriault (https://github.com/Theriault)
	  // improved by: Theriault (https://github.com/Theriault)
	  // improved by: Brett Zamir (http://brett-zamir.me)
	  // improved by: Theriault (https://github.com/Theriault)
	  // improved by: Thomas Beaucourt (http://www.webapp.fr)
	  // improved by: JT
	  // improved by: Theriault (https://github.com/Theriault)
	  // improved by: Rafał Kukawski (http://blog.kukawski.pl)
	  // improved by: Theriault (https://github.com/Theriault)
	  //    input by: Brett Zamir (http://brett-zamir.me)
	  //    input by: majak
	  //    input by: Alex
	  //    input by: Martin
	  //    input by: Alex Wilson
	  //    input by: Haravikk
	  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
	  // bugfixed by: majak
	  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
	  // bugfixed by: Brett Zamir (http://brett-zamir.me)
	  // bugfixed by: omid (http://locutus.io/php/380:380#comment_137122)
	  // bugfixed by: Chris (http://www.devotis.nl/)
	  //      note 1: Uses global: locutus to store the default timezone
	  //      note 1: Although the function potentially allows timezone info
	  //      note 1: (see notes), it currently does not set
	  //      note 1: per a timezone specified by date_default_timezone_set(). Implementers might use
	  //      note 1: $locutus.currentTimezoneOffset and
	  //      note 1: $locutus.currentTimezoneDST set by that function
	  //      note 1: in order to adjust the dates in this function
	  //      note 1: (or our other date functions!) accordingly
	  //   example 1: date('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h', 1062402400)
	  //   returns 1: '07:09:40 m is month'
	  //   example 2: date('F j, Y, g:i a', 1062462400)
	  //   returns 2: 'September 2, 2003, 12:26 am'
	  //   example 3: date('Y W o', 1062462400)
	  //   returns 3: '2003 36 2003'
	  //   example 4: var $x = date('Y m d', (new Date()).getTime() / 1000)
	  //   example 4: $x = $x + ''
	  //   example 4: var $result = $x.length // 2009 01 09
	  //   returns 4: 10
	  //   example 5: date('W', 1104534000)
	  //   returns 5: '52'
	  //   example 6: date('B t', 1104534000)
	  //   returns 6: '999 31'
	  //   example 7: date('W U', 1293750000.82); // 2010-12-31
	  //   returns 7: '52 1293750000'
	  //   example 8: date('W', 1293836400); // 2011-01-01
	  //   returns 8: '52'
	  //   example 9: date('W Y-m-d', 1293974054); // 2011-01-02
	  //   returns 9: '52 2011-01-02'
	  //        test: skip-1 skip-2 skip-5

	  var jsdate, f;
	  // Keep this here (works, but for code commented-out below for file size reasons)
	  // var tal= [];
	  var txtWords = ['Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	  // trailing backslash -> (dropped)
	  // a backslash followed by any character (including backslash) -> the character
	  // empty string -> empty string
	  var formatChr = /\\?(.?)/gi;
	  var formatChrCb = function formatChrCb(t, s) {
	    return f[t] ? f[t]() : s;
	  };
	  var _pad = function _pad(n, c) {
	    n = String(n);
	    while (n.length < c) {
	      n = '0' + n;
	    }
	    return n;
	  };
	  f = {
	    // Day
	    d: function d() {
	      // Day of month w/leading 0; 01..31
	      return _pad(f.j(), 2);
	    },
	    D: function D() {
	      // Shorthand day name; Mon...Sun
	      return f.l().slice(0, 3);
	    },
	    j: function j() {
	      // Day of month; 1..31
	      return jsdate.getDate();
	    },
	    l: function l() {
	      // Full day name; Monday...Sunday
	      return txtWords[f.w()] + 'day';
	    },
	    N: function N() {
	      // ISO-8601 day of week; 1[Mon]..7[Sun]
	      return f.w() || 7;
	    },
	    S: function S() {
	      // Ordinal suffix for day of month; st, nd, rd, th
	      var j = f.j();
	      var i = j % 10;
	      if (i <= 3 && parseInt(j % 100 / 10, 10) === 1) {
	        i = 0;
	      }
	      return ['st', 'nd', 'rd'][i - 1] || 'th';
	    },
	    w: function w() {
	      // Day of week; 0[Sun]..6[Sat]
	      return jsdate.getDay();
	    },
	    z: function z() {
	      // Day of year; 0..365
	      var a = new Date(f.Y(), f.n() - 1, f.j());
	      var b = new Date(f.Y(), 0, 1);
	      return Math.round((a - b) / 864e5);
	    },

	    // Week
	    W: function W() {
	      // ISO-8601 week number
	      var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3);
	      var b = new Date(a.getFullYear(), 0, 4);
	      return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
	    },

	    // Month
	    F: function F() {
	      // Full month name; January...December
	      return txtWords[6 + f.n()];
	    },
	    m: function m() {
	      // Month w/leading 0; 01...12
	      return _pad(f.n(), 2);
	    },
	    M: function M() {
	      // Shorthand month name; Jan...Dec
	      return f.F().slice(0, 3);
	    },
	    n: function n() {
	      // Month; 1...12
	      return jsdate.getMonth() + 1;
	    },
	    t: function t() {
	      // Days in month; 28...31
	      return new Date(f.Y(), f.n(), 0).getDate();
	    },

	    // Year
	    L: function L() {
	      // Is leap year?; 0 or 1
	      var j = f.Y();
	      return j % 4 === 0 & j % 100 !== 0 | j % 400 === 0;
	    },
	    o: function o() {
	      // ISO-8601 year
	      var n = f.n();
	      var W = f.W();
	      var Y = f.Y();
	      return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0);
	    },
	    Y: function Y() {
	      // Full year; e.g. 1980...2010
	      return jsdate.getFullYear();
	    },
	    y: function y() {
	      // Last two digits of year; 00...99
	      return f.Y().toString().slice(-2);
	    },

	    // Time
	    a: function a() {
	      // am or pm
	      return jsdate.getHours() > 11 ? 'pm' : 'am';
	    },
	    A: function A() {
	      // AM or PM
	      return f.a().toUpperCase();
	    },
	    B: function B() {
	      // Swatch Internet time; 000..999
	      var H = jsdate.getUTCHours() * 36e2;
	      // Hours
	      var i = jsdate.getUTCMinutes() * 60;
	      // Minutes
	      // Seconds
	      var s = jsdate.getUTCSeconds();
	      return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
	    },
	    g: function g() {
	      // 12-Hours; 1..12
	      return f.G() % 12 || 12;
	    },
	    G: function G() {
	      // 24-Hours; 0..23
	      return jsdate.getHours();
	    },
	    h: function h() {
	      // 12-Hours w/leading 0; 01..12
	      return _pad(f.g(), 2);
	    },
	    H: function H() {
	      // 24-Hours w/leading 0; 00..23
	      return _pad(f.G(), 2);
	    },
	    i: function i() {
	      // Minutes w/leading 0; 00..59
	      return _pad(jsdate.getMinutes(), 2);
	    },
	    s: function s() {
	      // Seconds w/leading 0; 00..59
	      return _pad(jsdate.getSeconds(), 2);
	    },
	    u: function u() {
	      // Microseconds; 000000-999000
	      return _pad(jsdate.getMilliseconds() * 1000, 6);
	    },

	    // Timezone
	    e: function e() {
	      // Timezone identifier; e.g. Atlantic/Azores, ...
	      // The following works, but requires inclusion of the very large
	      // timezone_abbreviations_list() function.
	      /*              return that.date_default_timezone_get();
	       */
	      var msg = 'Not supported (see source code of date() for timezone on how to add support)';
	      throw new Error(msg);
	    },
	    I: function I() {
	      // DST observed?; 0 or 1
	      // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
	      // If they are not equal, then DST is observed.
	      var a = new Date(f.Y(), 0);
	      // Jan 1
	      var c = Date.UTC(f.Y(), 0);
	      // Jan 1 UTC
	      var b = new Date(f.Y(), 6);
	      // Jul 1
	      // Jul 1 UTC
	      var d = Date.UTC(f.Y(), 6);
	      return a - c !== b - d ? 1 : 0;
	    },
	    O: function O() {
	      // Difference to GMT in hour format; e.g. +0200
	      var tzo = jsdate.getTimezoneOffset();
	      var a = Math.abs(tzo);
	      return (tzo > 0 ? '-' : '+') + _pad(Math.floor(a / 60) * 100 + a % 60, 4);
	    },
	    P: function P() {
	      // Difference to GMT w/colon; e.g. +02:00
	      var O = f.O();
	      return O.substr(0, 3) + ':' + O.substr(3, 2);
	    },
	    T: function T() {
	      // The following works, but requires inclusion of the very
	      // large timezone_abbreviations_list() function.
	      /*              var abbr, i, os, _default;
	      if (!tal.length) {
	        tal = that.timezone_abbreviations_list();
	      }
	      if ($locutus && $locutus.default_timezone) {
	        _default = $locutus.default_timezone;
	        for (abbr in tal) {
	          for (i = 0; i < tal[abbr].length; i++) {
	            if (tal[abbr][i].timezone_id === _default) {
	              return abbr.toUpperCase();
	            }
	          }
	        }
	      }
	      for (abbr in tal) {
	        for (i = 0; i < tal[abbr].length; i++) {
	          os = -jsdate.getTimezoneOffset() * 60;
	          if (tal[abbr][i].offset === os) {
	            return abbr.toUpperCase();
	          }
	        }
	      }
	      */
	      return 'UTC';
	    },
	    Z: function Z() {
	      // Timezone offset in seconds (-43200...50400)
	      return -jsdate.getTimezoneOffset() * 60;
	    },

	    // Full Date/Time
	    c: function c() {
	      // ISO-8601 date.
	      return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb);
	    },
	    r: function r() {
	      // RFC 2822
	      return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb);
	    },
	    U: function U() {
	      // Seconds since UNIX epoch
	      return jsdate / 1000 | 0;
	    }
	  };

	  var _date = function _date(format, timestamp) {
	    jsdate = timestamp === undefined ? new Date() // Not provided
	    : timestamp instanceof Date ? new Date(timestamp) // JS Date()
	    : new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
	    ;
	    return format.replace(formatChr, formatChrCb);
	  };

	  return _date(format, timestamp);
	};
	//# sourceMappingURL=date.js.map

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function boolval(mixedVar) {
	  // original by: Will Rowe
	  //   example 1: boolval(true)
	  //   returns 1: true
	  //   example 2: boolval(false)
	  //   returns 2: false
	  //   example 3: boolval(0)
	  //   returns 3: false
	  //   example 4: boolval(0.0)
	  //   returns 4: false
	  //   example 5: boolval('')
	  //   returns 5: false
	  //   example 6: boolval('0')
	  //   returns 6: false
	  //   example 7: boolval([])
	  //   returns 7: false
	  //   example 8: boolval('')
	  //   returns 8: false
	  //   example 9: boolval(null)
	  //   returns 9: false
	  //   example 10: boolval(undefined)
	  //   returns 10: false
	  //   example 11: boolval('true')
	  //   returns 11: true

	  if (mixedVar === false) {
	    return false;
	  }

	  if (mixedVar === 0 || mixedVar === 0.0) {
	    return false;
	  }

	  if (mixedVar === '' || mixedVar === '0') {
	    return false;
	  }

	  if (Array.isArray(mixedVar) && mixedVar.length === 0) {
	    return false;
	  }

	  if (mixedVar === null || mixedVar === undefined) {
	    return false;
	  }

	  return true;
	};
	//# sourceMappingURL=boolval.js.map

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = function(Twig) {
	    'use strict';

	    Twig.Templates.registerLoader('ajax', function(location, params, callback, error_callback) {
	        var template,
	            xmlhttp,
	            precompiled = params.precompiled,
	            parser = this.parsers[params.parser] || this.parser.twig;

	        if (typeof XMLHttpRequest === "undefined") {
	            throw new Twig.Error('Unsupported platform: Unable to do ajax requests ' +
	                                 'because there is no "XMLHTTPRequest" implementation');
	        }

	        xmlhttp = new XMLHttpRequest();
	        xmlhttp.onreadystatechange = function() {
	            var data = null;

	            if(xmlhttp.readyState === 4) {
	                if (xmlhttp.status === 200 || (window.cordova && xmlhttp.status == 0)) {
	                    Twig.log.debug("Got template ", xmlhttp.responseText);

	                    if (precompiled === true) {
	                        data = JSON.parse(xmlhttp.responseText);
	                    } else {
	                        data = xmlhttp.responseText;
	                    }

	                    params.url = location;
	                    params.data = data;

	                    template = parser.call(this, params);

	                    if (typeof callback === 'function') {
	                        callback(template);
	                    }
	                } else {
	                    if (typeof error_callback === 'function') {
	                        error_callback(xmlhttp);
	                    }
	                }
	            }
	        };
	        xmlhttp.open("GET", location, !!params.async);
	        xmlhttp.send();

	        if (params.async) {
	            // TODO: return deferred promise
	            return true;
	        } else {
	            return template;
	        }
	    });

	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(Twig) {
	    'use strict';

	    var fs, path;

	    try {
	    	// require lib dependencies at runtime
	    	fs = __webpack_require__(19);
	    	path = __webpack_require__(20);
	    } catch (e) {
	    	// NOTE: this is in a try/catch to avoid errors cross platform
	    }

	    Twig.Templates.registerLoader('fs', function(location, params, callback, error_callback) {
	        var template,
	            data = null,
	            precompiled = params.precompiled,
	            parser = this.parsers[params.parser] || this.parser.twig;

	        if (!fs || !path) {
	            throw new Twig.Error('Unsupported platform: Unable to load from file ' +
	                                 'because there is no "fs" or "path" implementation');
	        }

	        var loadTemplateFn = function(err, data) {
	            if (err) {
	                if (typeof error_callback === 'function') {
	                    error_callback(err);
	                }
	                return;
	            }

	            if (precompiled === true) {
	                data = JSON.parse(data);
	            }

	            params.data = data;
	            params.path = params.path || location;

	            // template is in data
	            template = parser.call(this, params);

	            if (typeof callback === 'function') {
	                callback(template);
	            }
	        };
	        params.path = params.path || location;

	        if (params.async) {
	            fs.stat(params.path, function (err, stats) {
	                if (err || !stats.isFile()) {
	                    if (typeof error_callback === 'function') {
	                        error_callback(new Twig.Error('Unable to find template file ' + params.path));
	                    }
	                    return;
	                }
	                fs.readFile(params.path, 'utf8', loadTemplateFn);
	            });
	            // TODO: return deferred promise
	            return true;
	        } else {
	            try {
	                if (!fs.statSync(params.path).isFile()) {
	                    throw new Twig.Error('Unable to find template file ' + params.path);
	                }
	            } catch (err) {
	                throw new Twig.Error('Unable to find template file ' + params.path);
	            }
	            data = fs.readFileSync(params.path, 'utf8');
	            loadTemplateFn(undefined, data);
	            return template
	        }
	    });

	};


/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = __webpack_require__(8);

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = __webpack_require__(4);

/***/ },
/* 21 */
/***/ function(module, exports) {

	// ## twig.logic.js
	//
	// This file handles tokenizing, compiling and parsing logic tokens. {% ... %}
	module.exports = function (Twig) {
	    "use strict";

	    /**
	     * Namespace for logic handling.
	     */
	    Twig.logic = {};

	    /**
	     * Logic token types.
	     */
	    Twig.logic.type = {
	        if_:       'Twig.logic.type.if',
	        endif:     'Twig.logic.type.endif',
	        for_:      'Twig.logic.type.for',
	        endfor:    'Twig.logic.type.endfor',
	        else_:     'Twig.logic.type.else',
	        elseif:    'Twig.logic.type.elseif',
	        set:       'Twig.logic.type.set',
	        setcapture:'Twig.logic.type.setcapture',
	        endset:    'Twig.logic.type.endset',
	        filter:    'Twig.logic.type.filter',
	        endfilter: 'Twig.logic.type.endfilter',
	        shortblock: 'Twig.logic.type.shortblock',
	        block:     'Twig.logic.type.block',
	        endblock:  'Twig.logic.type.endblock',
	        extends_:  'Twig.logic.type.extends',
	        use:       'Twig.logic.type.use',
	        include:   'Twig.logic.type.include',
	        spaceless: 'Twig.logic.type.spaceless',
	        endspaceless: 'Twig.logic.type.endspaceless',
	        macro:     'Twig.logic.type.macro',
	        endmacro:  'Twig.logic.type.endmacro',
	        import_:   'Twig.logic.type.import',
	        from:      'Twig.logic.type.from',
	        embed:     'Twig.logic.type.embed',
	        endembed:  'Twig.logic.type.endembed'
	    };


	    // Regular expressions for handling logic tokens.
	    //
	    // Properties:
	    //
	    //      type:  The type of expression this matches
	    //
	    //      regex: A regular expression that matches the format of the token
	    //
	    //      next:  What logic tokens (if any) pop this token off the logic stack. If empty, the
	    //             logic token is assumed to not require an end tag and isn't push onto the stack.
	    //
	    //      open:  Does this tag open a logic expression or is it standalone. For example,
	    //             {% endif %} cannot exist without an opening {% if ... %} tag, so open = false.
	    //
	    //  Functions:
	    //
	    //      compile: A function that handles compiling the token into an output token ready for
	    //               parsing with the parse function.
	    //
	    //      parse:   A function that parses the compiled token into output (HTML / whatever the
	    //               template represents).
	    Twig.logic.definitions = [
	        {
	            /**
	             * If type logic tokens.
	             *
	             *  Format: {% if expression %}
	             */
	            type: Twig.logic.type.if_,
	            regex: /^if\s+([\s\S]+)$/,
	            next: [
	                Twig.logic.type.else_,
	                Twig.logic.type.elseif,
	                Twig.logic.type.endif
	            ],
	            open: true,
	            compile: function (token) {
	                var expression = token.match[1];
	                // Compile the expression.
	                token.stack = Twig.expression.compile.apply(this, [{
	                    type:  Twig.expression.type.expression,
	                    value: expression
	                }]).stack;
	                delete token.match;
	                return token;
	            },
	            parse: function (token, context, chain) {
	                var that = this;

	                return Twig.expression.parseAsync.apply(this, [token.stack, context])
	                .then(function(result) {
	                    chain = true;

	                    if (Twig.lib.boolval(result)) {
	                        chain = false;

	                        return Twig.parseAsync.apply(that, [token.output, context]);
	                    }

	                    return '';
	                })
	                .then(function(output) {
	                    return {
	                        chain: chain,
	                        output: output
	                    };
	                });
	            }
	        },
	        {
	            /**
	             * Else if type logic tokens.
	             *
	             *  Format: {% elseif expression %}
	             */
	            type: Twig.logic.type.elseif,
	            regex: /^elseif\s+([^\s].*)$/,
	            next: [
	                Twig.logic.type.else_,
	                Twig.logic.type.elseif,
	                Twig.logic.type.endif
	            ],
	            open: false,
	            compile: function (token) {
	                var expression = token.match[1];
	                // Compile the expression.
	                token.stack = Twig.expression.compile.apply(this, [{
	                    type:  Twig.expression.type.expression,
	                    value: expression
	                }]).stack;
	                delete token.match;
	                return token;
	            },
	            parse: function (token, context, chain) {
	                var that = this;

	                return Twig.expression.parseAsync.apply(this, [token.stack, context])
	                .then(function(result) {
	                    if (chain && Twig.lib.boolval(result)) {
	                        chain = false;

	                        return Twig.parseAsync.apply(that, [token.output, context]);
	                    }

	                    return '';
	                })
	                .then(function(output) {
	                    return {
	                        chain: chain,
	                        output: output
	                    }
	                });
	            }
	        },
	        {
	            /**
	             * Else if type logic tokens.
	             *
	             *  Format: {% elseif expression %}
	             */
	            type: Twig.logic.type.else_,
	            regex: /^else$/,
	            next: [
	                Twig.logic.type.endif,
	                Twig.logic.type.endfor
	            ],
	            open: false,
	            parse: function (token, context, chain) {
	                var promise = Twig.Promise.resolve('');

	                if (chain) {
	                    promise = Twig.parseAsync.apply(this, [token.output, context]);
	                }

	                return promise.then(function(output) {
	                    return {
	                        chain: chain,
	                        output: output
	                    };
	                });
	            }
	        },
	        {
	            /**
	             * End if type logic tokens.
	             *
	             *  Format: {% endif %}
	             */
	            type: Twig.logic.type.endif,
	            regex: /^endif$/,
	            next: [ ],
	            open: false
	        },
	        {
	            /**
	             * For type logic tokens.
	             *
	             *  Format: {% for expression %}
	             */
	            type: Twig.logic.type.for_,
	            regex: /^for\s+([a-zA-Z0-9_,\s]+)\s+in\s+([^\s].*?)(?:\s+if\s+([^\s].*))?$/,
	            next: [
	                Twig.logic.type.else_,
	                Twig.logic.type.endfor
	            ],
	            open: true,
	            compile: function (token) {
	                var key_value = token.match[1],
	                    expression = token.match[2],
	                    conditional = token.match[3],
	                    kv_split = null;

	                token.key_var = null;
	                token.value_var = null;

	                if (key_value.indexOf(",") >= 0) {
	                    kv_split = key_value.split(',');
	                    if (kv_split.length === 2) {
	                        token.key_var = kv_split[0].trim();
	                        token.value_var = kv_split[1].trim();
	                    } else {
	                        throw new Twig.Error("Invalid expression in for loop: " + key_value);
	                    }
	                } else {
	                    token.value_var = key_value;
	                }

	                // Valid expressions for a for loop
	                //   for item     in expression
	                //   for key,item in expression

	                // Compile the expression.
	                token.expression = Twig.expression.compile.apply(this, [{
	                    type:  Twig.expression.type.expression,
	                    value: expression
	                }]).stack;

	                // Compile the conditional (if available)
	                if (conditional) {
	                    token.conditional = Twig.expression.compile.apply(this, [{
	                        type:  Twig.expression.type.expression,
	                        value: conditional
	                    }]).stack;
	                }

	                delete token.match;
	                return token;
	            },
	            parse: function (token, context, continue_chain) {
	                // Parse expression
	                var output = [],
	                    len,
	                    index = 0,
	                    keyset,
	                    that = this,
	                    conditional = token.conditional,
	                    buildLoop = function(index, len) {
	                        var isConditional = conditional !== undefined;
	                        return {
	                            index: index+1,
	                            index0: index,
	                            revindex: isConditional?undefined:len-index,
	                            revindex0: isConditional?undefined:len-index-1,
	                            first: (index === 0),
	                            last: isConditional?undefined:(index === len-1),
	                            length: isConditional?undefined:len,
	                            parent: context
	                        };
	                    },
	                    // run once for each iteration of the loop
	                    loop = function(key, value) {
	                        var inner_context = Twig.ChildContext(context);

	                        inner_context[token.value_var] = value;

	                        if (token.key_var) {
	                            inner_context[token.key_var] = key;
	                        }

	                        // Loop object
	                        inner_context.loop = buildLoop(index, len);

	                        var promise = conditional === undefined ?
	                            Twig.Promise.resolve(true) :
	                            Twig.expression.parseAsync.apply(that, [conditional, inner_context]);

	                        promise.then(function(condition) {
	                            if (!condition)
	                                return;

	                            return Twig.parseAsync.apply(that, [token.output, inner_context])
	                            .then(function(o) {
	                                output.push(o);
	                                index += 1;
	                            });
	                        })
	                        .then(function() {
	                            // Delete loop-related variables from the context
	                            delete inner_context['loop'];
	                            delete inner_context[token.value_var];
	                            delete inner_context[token.key_var];

	                            // Merge in values that exist in context but have changed
	                            // in inner_context.
	                            Twig.merge(context, inner_context, true);
	                        });
	                    };


	                return Twig.expression.parseAsync.apply(this, [token.expression, context])
	                .then(function(result) {
	                    if (Twig.lib.is('Array', result)) {
	                        len = result.length;
	                        Twig.async.forEach(result, function (value) {
	                            var key = index;

	                            return loop(key, value);
	                        });
	                    } else if (Twig.lib.is('Object', result)) {
	                        if (result._keys !== undefined) {
	                            keyset = result._keys;
	                        } else {
	                            keyset = Object.keys(result);
	                        }
	                        len = keyset.length;
	                        Twig.forEach(keyset, function(key) {
	                            // Ignore the _keys property, it's internal to twig.js
	                            if (key === "_keys") return;

	                            loop(key,  result[key]);
	                        });
	                    }

	                    // Only allow else statements if no output was generated
	                    continue_chain = (output.length === 0);

	                    return {
	                        chain: continue_chain,
	                        output: Twig.output.apply(that, [output])
	                    };
	                });
	            }
	        },
	        {
	            /**
	             * End if type logic tokens.
	             *
	             *  Format: {% endif %}
	             */
	            type: Twig.logic.type.endfor,
	            regex: /^endfor$/,
	            next: [ ],
	            open: false
	        },
	        {
	            /**
	             * Set type logic tokens.
	             *
	             *  Format: {% set key = expression %}
	             */
	            type: Twig.logic.type.set,
	            regex: /^set\s+([a-zA-Z0-9_,\s]+)\s*=\s*([\s\S]+)$/,
	            next: [ ],
	            open: true,
	            compile: function (token) {
	                var key = token.match[1].trim(),
	                    expression = token.match[2],
	                    // Compile the expression.
	                    expression_stack  = Twig.expression.compile.apply(this, [{
	                        type:  Twig.expression.type.expression,
	                        value: expression
	                    }]).stack;

	                token.key = key;
	                token.expression = expression_stack;

	                delete token.match;
	                return token;
	            },
	            parse: function (token, context, continue_chain) {
	                var key = token.key;

	                return Twig.expression.parseAsync.apply(this, [token.expression, context])
	                .then(function(value) {
	                    if (value === context) {
	                        /*  If storing the context in a variable, it needs to be a clone of the current state of context.
	                            Otherwise we have a context with infinite recursion.
	                            Fixes #341
	                        */
	                        value = Twig.lib.copy(value);
	                    }

	                    context[key] = value;

	                    return {
	                        chain: continue_chain,
	                        context: context
	                    };
	                });
	            }
	        },
	        {
	            /**
	             * Set capture type logic tokens.
	             *
	             *  Format: {% set key %}
	             */
	            type: Twig.logic.type.setcapture,
	            regex: /^set\s+([a-zA-Z0-9_,\s]+)$/,
	            next: [
	                Twig.logic.type.endset
	            ],
	            open: true,
	            compile: function (token) {
	                var key = token.match[1].trim();

	                token.key = key;

	                delete token.match;
	                return token;
	            },
	            parse: function (token, context, continue_chain) {
	                var that = this,
	                    key = token.key;

	                return Twig.parseAsync.apply(this, [token.output, context])
	                .then(function(value) {
	                    // set on both the global and local context
	                    that.context[key] = value;
	                    context[key] = value;

	                    return {
	                        chain: continue_chain,
	                        context: context
	                    };
	                });
	            }
	        },
	        {
	            /**
	             * End set type block logic tokens.
	             *
	             *  Format: {% endset %}
	             */
	            type: Twig.logic.type.endset,
	            regex: /^endset$/,
	            next: [ ],
	            open: false
	        },
	        {
	            /**
	             * Filter logic tokens.
	             *
	             *  Format: {% filter upper %} or {% filter lower|escape %}
	             */
	            type: Twig.logic.type.filter,
	            regex: /^filter\s+(.+)$/,
	            next: [
	                Twig.logic.type.endfilter
	            ],
	            open: true,
	            compile: function (token) {
	                var expression = "|" + token.match[1].trim();
	                // Compile the expression.
	                token.stack = Twig.expression.compile.apply(this, [{
	                    type:  Twig.expression.type.expression,
	                    value: expression
	                }]).stack;
	                delete token.match;
	                return token;
	            },
	            parse: function (token, context, chain) {
	                return Twig.parseAsync.apply(this, [token.output, context])
	                .then(function(unfiltered) {
	                    var stack = [{
	                        type: Twig.expression.type.string,
	                        value: unfiltered
	                    }].concat(token.stack);

	                    return Twig.expression.parseAsync.apply(that, [stack, context]);
	                })
	                .then(function(output) {
	                    return {
	                        chain: chain,
	                        output: output
	                    }
	                });
	            }
	        },
	        {
	            /**
	             * End filter logic tokens.
	             *
	             *  Format: {% endfilter %}
	             */
	            type: Twig.logic.type.endfilter,
	            regex: /^endfilter$/,
	            next: [ ],
	            open: false
	        },
	        {
	            /**
	             * Block logic tokens.
	             *
	             *  Format: {% block title %}
	             */
	            type: Twig.logic.type.block,
	            regex: /^block\s+([a-zA-Z0-9_]+)$/,
	            next: [
	                Twig.logic.type.endblock
	            ],
	            open: true,
	            compile: function (token) {
	                token.block = token.match[1].trim();
	                delete token.match;
	                return token;
	            },
	            parse: function (token, context, chain) {
	                var that = this,
	                    block_output,
	                    output,
	                    promise = Twig.Promise.resolve(),
	                    isImported = Twig.indexOf(this.importedBlocks, token.block) > -1,
	                    hasParent = this.blocks[token.block] && Twig.indexOf(this.blocks[token.block], Twig.placeholders.parent) > -1;

	                // Don't override previous blocks unless they're imported with "use"
	                // Loops should be exempted as well.
	                if (this.blocks[token.block] === undefined || isImported || hasParent || context.loop || token.overwrite) {
	                    if (token.expression) {
	                        promise = Twig.expression.parseAsync.apply(this, [token.output, context])
	                        .then(function(value) {
	                            return Twig.expression.parseAsync.apply(that, [{
	                                type: Twig.expression.type.string,
	                                value: value
	                            }, context]);
	                        });
	                    } else {
	                        promise = Twig.parseAsync.apply(this, [token.output, context])
	                        .then(function(value) {
	                            return Twig.expression.parseAsync.apply(that, [{
	                                type: Twig.expression.type.string,
	                                value: value
	                            }, context]);
	                        });
	                    }

	                    promise = promise.then(function(block_output) {
	                        if (isImported) {
	                            // once the block is overridden, remove it from the list of imported blocks
	                            that.importedBlocks.splice(that.importedBlocks.indexOf(token.block), 1);
	                        }

	                        if (hasParent) {
	                            that.blocks[token.block] = Twig.Markup(that.blocks[token.block].replace(Twig.placeholders.parent, block_output));
	                        } else {
	                            that.blocks[token.block] = block_output;
	                        }

	                        that.originalBlockTokens[token.block] = {
	                            type: token.type,
	                            block: token.block,
	                            output: token.output,
	                            overwrite: true
	                        };
	                    });
	                }

	                return promise.then(function() {
	                    // Check if a child block has been set from a template extending this one.
	                    if (that.child.blocks[token.block]) {
	                        output = that.child.blocks[token.block];
	                    } else {
	                        output = that.blocks[token.block];
	                    }

	                    return {
	                        chain: chain,
	                        output: output
	                    };
	                });
	            }
	        },
	        {
	            /**
	             * Block shorthand logic tokens.
	             *
	             *  Format: {% block title expression %}
	             */
	            type: Twig.logic.type.shortblock,
	            regex: /^block\s+([a-zA-Z0-9_]+)\s+(.+)$/,
	            next: [ ],
	            open: true,
	            compile: function (token) {
	                token.expression = token.match[2].trim();

	                token.output = Twig.expression.compile({
	                    type: Twig.expression.type.expression,
	                    value: token.expression
	                }).stack;

	                token.block = token.match[1].trim();
	                delete token.match;
	                return token;
	            },
	            parse: function (token, context, chain) {
	                return Twig.logic.handler[Twig.logic.type.block].parse.apply(this, arguments);
	            }
	        },
	        {
	            /**
	             * End block logic tokens.
	             *
	             *  Format: {% endblock %}
	             */
	            type: Twig.logic.type.endblock,
	            regex: /^endblock(?:\s+([a-zA-Z0-9_]+))?$/,
	            next: [ ],
	            open: false
	        },
	        {
	            /**
	             * Block logic tokens.
	             *
	             *  Format: {% extends "template.twig" %}
	             */
	            type: Twig.logic.type.extends_,
	            regex: /^extends\s+(.+)$/,
	            next: [ ],
	            open: true,
	            compile: function (token) {
	                var expression = token.match[1].trim();
	                delete token.match;

	                token.stack   = Twig.expression.compile.apply(this, [{
	                    type:  Twig.expression.type.expression,
	                    value: expression
	                }]).stack;

	                return token;
	            },
	            parse: function (token, context, chain) {
	                var template,
	                    that = this,
	                    innerContext = Twig.ChildContext(context);

	                // Resolve filename
	                return Twig.expression.parseAsync.apply(this, [token.stack, context])
	                .then(function(file) {
	                    // Set parent template
	                    that.extend = file;

	                    if (file instanceof Twig.Template) {
	                        template = file;
	                    } else {
	                        // Import file
	                        template = that.importFile(file);
	                    }

	                    // Render the template in case it puts anything in its context
	                    return template.renderAsync(innerContext);
	                })
	                .then(function() {
	                    // Extend the parent context with the extended context
	                    Twig.lib.extend(context, innerContext);

	                    return {
	                        chain: chain,
	                        output: ''
	                    };
	                });
	            }
	        },
	        {
	            /**
	             * Block logic tokens.
	             *
	             *  Format: {% use "template.twig" %}
	             */
	            type: Twig.logic.type.use,
	            regex: /^use\s+(.+)$/,
	            next: [ ],
	            open: true,
	            compile: function (token) {
	                var expression = token.match[1].trim();
	                delete token.match;

	                token.stack = Twig.expression.compile.apply(this, [{
	                    type:  Twig.expression.type.expression,
	                    value: expression
	                }]).stack;

	                return token;
	            },
	            parse: function (token, context, chain) {
	                var that = this;

	                // Resolve filename
	                return Twig.expression.parseAsync.apply(this, [token.stack, context])
	                .then(function(file) {
	                    // Import blocks
	                    that.importBlocks(file);

	                    return {
	                        chain: chain,
	                        output: ''
	                    };
	                });
	            }
	        },
	        {
	            /**
	             * Block logic tokens.
	             *
	             *  Format: {% includes "template.twig" [with {some: 'values'} only] %}
	             */
	            type: Twig.logic.type.include,
	            regex: /^include\s+(.+?)(?:\s|$)(ignore missing(?:\s|$))?(?:with\s+([\S\s]+?))?(?:\s|$)(only)?$/,
	            next: [ ],
	            open: true,
	            compile: function (token) {
	                var match = token.match,
	                    expression = match[1].trim(),
	                    ignoreMissing = match[2] !== undefined,
	                    withContext = match[3],
	                    only = ((match[4] !== undefined) && match[4].length);

	                delete token.match;

	                token.only = only;
	                token.ignoreMissing = ignoreMissing;

	                token.stack = Twig.expression.compile.apply(this, [{
	                    type:  Twig.expression.type.expression,
	                    value: expression
	                }]).stack;

	                if (withContext !== undefined) {
	                    token.withStack = Twig.expression.compile.apply(this, [{
	                        type:  Twig.expression.type.expression,
	                        value: withContext.trim()
	                    }]).stack;
	                }

	                return token;
	            },
	            parse: function (token, context, chain) {
	                // Resolve filename
	                var innerContext = {},
	                    i,
	                    template,
	                    that = this,
	                    promise = Twig.Promise.resolve();

	                if (!token.only) {
	                    innerContext = Twig.ChildContext(context);
	                }

	                if (token.withStack !== undefined) {
	                    promise = Twig.expression.parseAsync.apply(this, [token.withStack, context])
	                    .then(function(withContext) {
	                        for (i in withContext) {
	                            if (withContext.hasOwnProperty(i))
	                                innerContext[i] = withContext[i];
	                        }
	                    });
	                }

	                return promise
	                .then(function() {
	                    return Twig.expression.parseAsync.apply(that, [token.stack, context]);
	                })
	                .then(function(file) {
	                    if (file instanceof Twig.Template) {
	                        template = file;
	                    } else {
	                        // Import file
	                        try {
	                            template = that.importFile(file);
	                        } catch (err) {
	                            if (token.ignoreMissing) {
	                                return '';
	                            }

	                            throw err;
	                        }
	                    }

	                    return template.renderAsync(innerContext);
	                })
	                .then(function(output) {
	                    return {
	                        chain: chain,
	                        output: output
	                    };
	                });
	            }
	        },
	        {
	            type: Twig.logic.type.spaceless,
	            regex: /^spaceless$/,
	            next: [
	                Twig.logic.type.endspaceless
	            ],
	            open: true,

	            // Parse the html and return it without any spaces between tags
	            parse: function (token, context, chain) {
	                // Parse the output without any filter
	                return Twig.parseAsync.apply(this, [token.output, context])
	                .then(function(unfiltered) {
	                    var // A regular expression to find closing and opening tags with spaces between them
	                        rBetweenTagSpaces = />\s+</g,
	                        // Replace all space between closing and opening html tags
	                        output = unfiltered.replace(rBetweenTagSpaces,'><').trim();
	                        // Rewrap output as a Twig.Markup
	                        output = Twig.Markup(output);
	                    return {
	                        chain: chain,
	                        output: output
	                    };
	                });
	            }
	        },

	        // Add the {% endspaceless %} token
	        {
	            type: Twig.logic.type.endspaceless,
	            regex: /^endspaceless$/,
	            next: [ ],
	            open: false
	        },
	        {
	            /**
	             * Macro logic tokens.
	             *
	             * Format: {% maro input(name, value, type, size) %}
	             *
	             */
	            type: Twig.logic.type.macro,
	            regex: /^macro\s+([a-zA-Z0-9_]+)\s*\(\s*((?:[a-zA-Z0-9_]+(?:,\s*)?)*)\s*\)$/,
	            next: [
	                Twig.logic.type.endmacro
	            ],
	            open: true,
	            compile: function (token) {
	                var macroName = token.match[1],
	                    parameters = token.match[2].split(/[\s,]+/);

	                //TODO: Clean up duplicate check
	                for (var i=0; i<parameters.length; i++) {
	                    for (var j=0; j<parameters.length; j++){
	                        if (parameters[i] === parameters[j] && i !== j) {
	                            throw new Twig.Error("Duplicate arguments for parameter: "+ parameters[i]);
	                        }
	                    }
	                }

	                token.macroName = macroName;
	                token.parameters = parameters;

	                delete token.match;
	                return token;
	            },
	            parse: function (token, context, chain) {
	                var template = this;
	                this.macros[token.macroName] = function() {
	                    // Pass global context and other macros
	                    var macroContext = {
	                        _self: template.macros
	                    }
	                    // Add parameters from context to macroContext
	                    for (var i=0; i<token.parameters.length; i++) {
	                        var prop = token.parameters[i];
	                        if(typeof arguments[i] !== 'undefined') {
	                            macroContext[prop] = arguments[i];
	                        } else {
	                            macroContext[prop] = undefined;
	                        }
	                    }

	                    // Render
	                    return Twig.parseAsync.apply(template, [token.output, macroContext]);
	                };

	                return {
	                    chain: chain,
	                    output: ''
	                };

	            }
	        },
	        {
	            /**
	             * End macro logic tokens.
	             *
	             * Format: {% endmacro %}
	             */
	             type: Twig.logic.type.endmacro,
	             regex: /^endmacro$/,
	             next: [ ],
	             open: false
	        },
	        {
	            /*
	            * import logic tokens.
	            *
	            * Format: {% import "template.twig" as form %}
	            */
	            type: Twig.logic.type.import_,
	            regex: /^import\s+(.+)\s+as\s+([a-zA-Z0-9_]+)$/,
	            next: [ ],
	            open: true,
	            compile: function (token) {
	                var expression = token.match[1].trim(),
	                    contextName = token.match[2].trim();
	                delete token.match;

	                token.expression = expression;
	                token.contextName = contextName;

	                token.stack = Twig.expression.compile.apply(this, [{
	                    type: Twig.expression.type.expression,
	                    value: expression
	                }]).stack;

	                return token;
	            },
	            parse: function (token, context, chain) {
	                var that = this,
	                    output = { chain: chain, output: '' };

	                if (token.expression === '_self') {
	                    context[token.contextName] = this.macros;
	                    return Twig.Promise.resolve(output);
	                }

	                return Twig.expression.parseAsync.apply(this, [token.stack, context])
	                .then(function(file) {
	                    return that.importFile(file || token.expression);
	                })
	                .then(function(template) {
	                    context[token.contextName] = template.renderAsync({}, {output: 'macros'});

	                    return output;
	                });
	            }
	        },
	        {
	            /*
	            * from logic tokens.
	            *
	            * Format: {% from "template.twig" import func as form %}
	            */
	            type: Twig.logic.type.from,
	            regex: /^from\s+(.+)\s+import\s+([a-zA-Z0-9_, ]+)$/,
	            next: [ ],
	            open: true,
	            compile: function (token) {
	                var expression = token.match[1].trim(),
	                    macroExpressions = token.match[2].trim().split(/\s*,\s*/),
	                    macroNames = {};

	                for (var i=0; i<macroExpressions.length; i++) {
	                    var res = macroExpressions[i];

	                    // match function as variable
	                    var macroMatch = res.match(/^([a-zA-Z0-9_]+)\s+as\s+([a-zA-Z0-9_]+)$/);
	                    if (macroMatch) {
	                        macroNames[macroMatch[1].trim()] = macroMatch[2].trim();
	                    }
	                    else if (res.match(/^([a-zA-Z0-9_]+)$/)) {
	                        macroNames[res] = res;
	                    }
	                    else {
	                        // ignore import
	                    }

	                }

	                delete token.match;

	                token.expression = expression;
	                token.macroNames = macroNames;

	                token.stack = Twig.expression.compile.apply(this, [{
	                    type: Twig.expression.type.expression,
	                    value: expression
	                }]).stack;

	                return token;
	            },
	            parse: function (token, context, chain) {
	                var that = this,
	                    promise = Twig.Promise.resolve(this.macros);

	                if (token.expression !== "_self") {
	                    promise = Twig.expression.parseAsync.apply(this, [token.stack, context])
	                    .then(function(file) {
	                        return that.importFile(file || token.expression);
	                    })
	                    .then(function(template) {
	                        return template.renderAsync({}, {output: 'macros'});
	                    });
	                }

	                return promise
	                .then(function(macros) {
	                    for (var macroName in token.macroNames) {
	                        if (macros.hasOwnProperty(macroName)) {
	                            context[token.macroNames[macroName]] = macros[macroName];
	                        }
	                    }

	                    return {
	                        chain: chain,
	                        output: ''
	                    }
	                });
	            }
	        },
	        {
	            /**
	             * The embed tag combines the behaviour of include and extends.
	             * It allows you to include another template's contents, just like include does.
	             *
	             *  Format: {% embed "template.twig" [with {some: 'values'} only] %}
	             */
	            type: Twig.logic.type.embed,
	            regex: /^embed\s+(.+?)(?:\s|$)(ignore missing(?:\s|$))?(?:with\s+([\S\s]+?))?(?:\s|$)(only)?$/,
	            next: [
	                Twig.logic.type.endembed
	            ],
	            open: true,
	            compile: function (token) {
	                var match = token.match,
	                    expression = match[1].trim(),
	                    ignoreMissing = match[2] !== undefined,
	                    withContext = match[3],
	                    only = ((match[4] !== undefined) && match[4].length);

	                delete token.match;

	                token.only = only;
	                token.ignoreMissing = ignoreMissing;

	                token.stack = Twig.expression.compile.apply(this, [{
	                    type:  Twig.expression.type.expression,
	                    value: expression
	                }]).stack;

	                if (withContext !== undefined) {
	                    token.withStack = Twig.expression.compile.apply(this, [{
	                        type:  Twig.expression.type.expression,
	                        value: withContext.trim()
	                    }]).stack;
	                }

	                return token;
	            },
	            parse: function (token, context, chain) {
	                // Resolve filename
	                var innerContext = {},
	                    that = this,
	                    i,
	                    template,
	                    promise = Twig.Promise.resolve();

	                if (!token.only) {
	                    for (i in context) {
	                        if (context.hasOwnProperty(i))
	                            innerContext[i] = context[i];
	                    }
	                }

	                if (token.withStack !== undefined) {
	                    promise = Twig.expression.parseAsync.apply(this, [token.withStack, context])
	                    .then(function(withContext) {
	                        for (i in withContext) {
	                            if (withContext.hasOwnProperty(i))
	                                innerContext[i] = withContext[i];
	                        }
	                    });
	                }

	                return promise.then(function() {
	                    return Twig.expression.parseAsync.apply(that, [token.stack, innerContext]);
	                })
	                .then(function(file) {
	                    if (file instanceof Twig.Template) {
	                        template = file;
	                    } else {
	                        // Import file
	                        try {
	                            template = that.importFile(file);
	                        } catch (err) {
	                            if (token.ignoreMissing) {
	                                return '';
	                            }

	                            throw err;
	                        }
	                    }

	                    // reset previous blocks
	                    that.blocks = {};

	                    // parse tokens. output will be not used
	                    return Twig.parseAsync.apply(that, [token.output, innerContext])
	                    .then(function() {
	                        // render tempalte with blocks defined in embed block
	                        return template.renderAsync(innerContext, {'blocks':that.blocks});
	                    });
	                })
	                .then(function(output) {
	                    return {
	                        chain: chain,
	                        output: output
	                    };
	                });
	            }
	        },
	        /* Add the {% endembed %} token
	         *
	         */
	        {
	            type: Twig.logic.type.endembed,
	            regex: /^endembed$/,
	            next: [ ],
	            open: false
	        }

	    ];


	    /**
	     * Registry for logic handlers.
	     */
	    Twig.logic.handler = {};

	    /**
	     * Define a new token type, available at Twig.logic.type.{type}
	     */
	    Twig.logic.extendType = function (type, value) {
	        value = value || ("Twig.logic.type" + type);
	        Twig.logic.type[type] = value;
	    };

	    /**
	     * Extend the logic parsing functionality with a new token definition.
	     *
	     * // Define a new tag
	     * Twig.logic.extend({
	     *     type: Twig.logic.type.{type},
	     *     // The pattern to match for this token
	     *     regex: ...,
	     *     // What token types can follow this token, leave blank if any.
	     *     next: [ ... ]
	     *     // Create and return compiled version of the token
	     *     compile: function(token) { ... }
	     *     // Parse the compiled token with the context provided by the render call
	     *     //   and whether this token chain is complete.
	     *     parse: function(token, context, chain) { ... }
	     * });
	     *
	     * @param {Object} definition The new logic expression.
	     */
	    Twig.logic.extend = function (definition) {

	        if (!definition.type) {
	            throw new Twig.Error("Unable to extend logic definition. No type provided for " + definition);
	        } else {
	            Twig.logic.extendType(definition.type);
	        }
	        Twig.logic.handler[definition.type] = definition;
	    };

	    // Extend with built-in expressions
	    while (Twig.logic.definitions.length > 0) {
	        Twig.logic.extend(Twig.logic.definitions.shift());
	    }

	    /**
	     * Compile a logic token into an object ready for parsing.
	     *
	     * @param {Object} raw_token An uncompiled logic token.
	     *
	     * @return {Object} A compiled logic token, ready for parsing.
	     */
	    Twig.logic.compile = function (raw_token) {
	        var expression = raw_token.value.trim(),
	            token = Twig.logic.tokenize.apply(this, [expression]),
	            token_template = Twig.logic.handler[token.type];

	        // Check if the token needs compiling
	        if (token_template.compile) {
	            token = token_template.compile.apply(this, [token]);
	            Twig.log.trace("Twig.logic.compile: ", "Compiled logic token to ", token);
	        }

	        return token;
	    };

	    /**
	     * Tokenize logic expressions. This function matches token expressions against regular
	     * expressions provided in token definitions provided with Twig.logic.extend.
	     *
	     * @param {string} expression the logic token expression to tokenize
	     *                (i.e. what's between {% and %})
	     *
	     * @return {Object} The matched token with type set to the token type and match to the regex match.
	     */
	    Twig.logic.tokenize = function (expression) {
	        var token = {},
	            token_template_type = null,
	            token_type = null,
	            token_regex = null,
	            regex_array = null,
	            regex = null,
	            match = null;

	        // Ignore whitespace around expressions.
	        expression = expression.trim();

	        for (token_template_type in Twig.logic.handler) {
	            if (Twig.logic.handler.hasOwnProperty(token_template_type)) {
	                // Get the type and regex for this template type
	                token_type = Twig.logic.handler[token_template_type].type;
	                token_regex = Twig.logic.handler[token_template_type].regex;

	                // Handle multiple regular expressions per type.
	                regex_array = [];
	                if (token_regex instanceof Array) {
	                    regex_array = token_regex;
	                } else {
	                    regex_array.push(token_regex);
	                }

	                // Check regular expressions in the order they were specified in the definition.
	                while (regex_array.length > 0) {
	                    regex = regex_array.shift();
	                    match = regex.exec(expression.trim());
	                    if (match !== null) {
	                        token.type  = token_type;
	                        token.match = match;
	                        Twig.log.trace("Twig.logic.tokenize: ", "Matched a ", token_type, " regular expression of ", match);
	                        return token;
	                    }
	                }
	            }
	        }

	        // No regex matches
	        throw new Twig.Error("Unable to parse '" + expression.trim() + "'");
	    };

	    /**
	     * Parse a logic token within a given context.
	     *
	     * What are logic chains?
	     *      Logic chains represent a series of tokens that are connected,
	     *          for example:
	     *          {% if ... %} {% else %} {% endif %}
	     *
	     *      The chain parameter is used to signify if a chain is open of closed.
	     *      open:
	     *          More tokens in this chain should be parsed.
	     *      closed:
	     *          This token chain has completed parsing and any additional
	     *          tokens (else, elseif, etc...) should be ignored.
	     *
	     * @param {Object} token The compiled token.
	     * @param {Object} context The render context.
	     * @param {boolean} chain Is this an open logic chain. If false, that means a
	     *                        chain is closed and no further cases should be parsed.
	     */
	    Twig.logic.parse = function (token, context, chain, allow_async) {
	        var output = '',
	            promise,
	            is_async = true,
	            token_template;

	        context = context || { };

	        Twig.log.debug("Twig.logic.parse: ", "Parsing logic token ", token);

	        token_template = Twig.logic.handler[token.type];

	        if (token_template.parse) {
	            output = token_template.parse.apply(this, [token, context, chain]);
	        }

	        promise = Twig.isPromise(output) ? output : Twig.Promise.resolve(output);

	        promise.then(function(o) {
	            is_async = false;
	            output = o;
	        });

	        if (allow_async)
	            return promise || Twig.Promise.resolve(output);

	        if (is_async)
	            throw new Twig.Error('You are using Twig.js in sync mode in combination with async extensions.');

	        return output;
	    };

	    return Twig;

	};


/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = function(Twig) {
	    'use strict';

	    Twig.Templates.registerParser('source', function(params) {
	        return params.data || '';
	    });
	};


/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = function(Twig) {
	    'use strict';

	    Twig.Templates.registerParser('twig', function(params) {
	        return new Twig.Template(params);
	    });
	};


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	// ## twig.path.js
	//
	// This file handles path parsing
	module.exports = function (Twig) {
	    "use strict";

	    /**
	     * Namespace for path handling.
	     */
	    Twig.path = {};

	    /**
	     * Generate the canonical version of a url based on the given base path and file path and in
	     * the previously registered namespaces.
	     *
	     * @param  {string} template The Twig Template
	     * @param  {string} file     The file path, may be relative and may contain namespaces.
	     *
	     * @return {string}          The canonical version of the path
	     */
	     Twig.path.parsePath = function(template, file) {
	        var namespaces = null,
	            file = file || "";

	        if (typeof template === 'object' && typeof template.options === 'object') {
	            namespaces = template.options.namespaces;
	        }

	        if (typeof namespaces === 'object' && (file.indexOf('::') > 0) || file.indexOf('@') >= 0){
	            for (var k in namespaces){
	                if (namespaces.hasOwnProperty(k)) {
	                    file = file.replace(k + '::', namespaces[k]);
	                    file = file.replace('@' + k, namespaces[k]);
	                }
	            }

	            return file;
	        }

	        return Twig.path.relativePath(template, file);
	    };

	    /**
	     * Generate the relative canonical version of a url based on the given base path and file path.
	     *
	     * @param {Twig.Template} template The Twig.Template.
	     * @param {string} file The file path, relative to the base path.
	     *
	     * @return {string} The canonical version of the path.
	     */
	    Twig.path.relativePath = function(template, file) {
	        var base,
	            base_path,
	            sep_chr = "/",
	            new_path = [],
	            file = file || "",
	            val;

	        if (template.url) {
	            if (typeof template.base !== 'undefined') {
	                base = template.base + ((template.base.charAt(template.base.length-1) === '/') ? '' : '/');
	            } else {
	                base = template.url;
	            }
	        } else if (template.path) {
	            // Get the system-specific path separator
	            var path = __webpack_require__(20),
	                sep = path.sep || sep_chr,
	                relative = new RegExp("^\\.{1,2}" + sep.replace("\\", "\\\\"));
	            file = file.replace(/\//g, sep);

	            if (template.base !== undefined && file.match(relative) == null) {
	                file = file.replace(template.base, '');
	                base = template.base + sep;
	            } else {
	                base = path.normalize(template.path);
	            }

	            base = base.replace(sep+sep, sep);
	            sep_chr = sep;
	        } else if ((template.name || template.id) && template.method && template.method !== 'fs' && template.method !== 'ajax') {
	            // Custom registered loader
	            base = template.base || template.name || template.id;
	        } else {
	            throw new Twig.Error("Cannot extend an inline template.");
	        }

	        base_path = base.split(sep_chr);

	        // Remove file from url
	        base_path.pop();
	        base_path = base_path.concat(file.split(sep_chr));

	        while (base_path.length > 0) {
	            val = base_path.shift();
	            if (val == ".") {
	                // Ignore
	            } else if (val == ".." && new_path.length > 0 && new_path[new_path.length-1] != "..") {
	                new_path.pop();
	            } else {
	                new_path.push(val);
	            }
	        }

	        return new_path.join(sep_chr);
	    };

	    return Twig;
	};


/***/ },
/* 25 */
/***/ function(module, exports) {

	// ## twig.tests.js
	//
	// This file handles expression tests. (is empty, is not defined, etc...)
	module.exports = function (Twig) {
	    "use strict";
	    Twig.tests = {
	        empty: function(value) {
	            if (value === null || value === undefined) return true;
	            // Handler numbers
	            if (typeof value === "number") return false; // numbers are never "empty"
	            // Handle strings and arrays
	            if (value.length && value.length > 0) return false;
	            // Handle objects
	            for (var key in value) {
	                if (value.hasOwnProperty(key)) return false;
	            }
	            return true;
	        },
	        odd: function(value) {
	            return value % 2 === 1;
	        },
	        even: function(value) {
	            return value % 2 === 0;
	        },
	        divisibleby: function(value, params) {
	            return value % params[0] === 0;
	        },
	        defined: function(value) {
	            return value !== undefined;
	        },
	        none: function(value) {
	            return value === null;
	        },
	        'null': function(value) {
	            return this.none(value); // Alias of none
	        },
	        'same as': function(value, params) {
	            return value === params[0];
	        },
	        sameas: function(value, params) {
	            console.warn('`sameas` is deprecated use `same as`');
	            return Twig.tests['same as'](value, params);
	        },
	        iterable: function(value) {
	            return value && (Twig.lib.is("Array", value) || Twig.lib.is("Object", value));
	        }
	        /*
	        constant ?
	         */
	    };

	    Twig.test = function(test, value, params) {
	        if (!Twig.tests[test]) {
	            throw "Test " + test + " is not defined.";
	        }
	        return Twig.tests[test](value, params);
	    };

	    Twig.test.extend = function(test, definition) {
	        Twig.tests[test] = definition;
	    };

	    return Twig;
	};


/***/ },
/* 26 */
/***/ function(module, exports) {

	// ## twig.async.js
	//
	// This file handles asynchronous tasks within twig.
	module.exports = function (Twig) {
	    "use strict";

	    Twig.parseAsync = function (tokens, context) {
	        return Twig.parse.apply(this, [tokens, context, true]);
	    }

	    Twig.expression.parseAsync = function (tokens, context, tokens_are_parameters) {
	        return Twig.expression.parse.apply(this, [tokens, context, tokens_are_parameters, true]);
	    }

	    Twig.logic.parseAsync = function (token, context, chain) {
	        return Twig.logic.parse.apply(this, [token, context, chain, true]);
	    }

	    Twig.Template.prototype.renderAsync = function (context, params) {
	        return this.render(context, params, true);
	    }

	    Twig.async = {};

	    /**
	     * Checks for `thenable` objects
	     */
	    Twig.isPromise = function(obj) {
	        return obj && (typeof obj.then == 'function');
	    }

	    /**
	     * An alternate implementation of a Promise that does not fully follow
	     * the spec, but instead works fully synchronous while still being
	     * thenable.
	     *
	     * These promises can be mixed with regular promises at which point
	     * the synchronous behaviour is lost.
	     */
	    Twig.Promise = function(executor) {
	        // State
	        var state = 'unknown';
	        var value = null;
	        var handlers = null;

	        function changeState(newState, v) {
	            state = newState;
	            value = v;
	            notify();
	        };
	        function onResolve(v) { changeState('resolve', v); }
	        function onReject(e) { changeState('reject', e); }

	        function notify() {
	            if (!handlers) return;

	            Twig.forEach(handlers, function(h) {
	                append(h.resolve, h.reject);
	            });
	            handlers = null;
	        }

	        function append(onResolved, onRejected) {
	            var h = {
	                resolve: onResolved,
	                reject: onRejected
	            };

	            // The promise has yet to be rejected or resolved.
	            if (state == 'unknown') {
	                handlers = handlers || [];
	                return handlers.push(h);
	            }

	            // The state has been changed to either resolve, or reject
	            // which means we should call the handler.
	            if (h[state])
	                h[state](value);
	        }

	        function run(fn, resolve, reject) {
	            var done = false;
	            try {
	                fn(function(v) {
	                    if (done) return;
	                    done = true;
	                    resolve(v);
	                }, function(e) {
	                    if (done) return;
	                    done = true;
	                    reject(e);
	                });
	            } catch(e) {
	                done = true;
	                reject(e);
	            }
	        }

	        function ready(result) {
	            try {
	                if (!Twig.isPromise(result)) {
	                    return onResolve(result);
	                }

	                run(result.then.bind(result), ready, onReject);
	            } catch (e) {
	                onReject(e);
	            }
	        }

	        run(executor, ready, onReject);

	        return {
	            then: function(onResolved, onRejected) {
	                var hasResolved = typeof onResolved == 'function';
	                var hasRejected = typeof onRejected == 'function';

	                return new Twig.Promise(function(resolve, reject) {
	                    append(function(result) {
	                        if (hasResolved) {
	                            try {
	                                resolve(onResolved(result));
	                            } catch (e) {
	                                reject(e);
	                            }
	                        } else {
	                            resolve(result);
	                        }
	                    }, function(err) {
	                        if (hasRejected) {
	                            try {
	                                resolve(onRejected(err));
	                            } catch (e) {
	                                reject(e);
	                            }
	                        } else {
	                            reject(err);
	                        }
	                    });
	                });
	            },
	            catch: function(onRejected) {
	                return this.then(null, onRejected);
	            }
	        };
	    }

	    Twig.Promise.resolve = function(value) {
	        return new Twig.Promise(function(resolve) {
	            resolve(value);
	        });
	    };

	    Twig.Promise.reject = function(e) {
	        return new Twig.Promise(function(resolve, reject) {
	            reject(e);
	        });
	    };

	    Twig.Promise.all = function(promises) {
	        const results = [];

	        return Twig.async.forEach(promises, function(p, index) {
	            if (!Twig.isPromise(p)) {
	                results[index] = p;
	                return;
	            }

	            return p.then(function(v) {
	                results[index] = v;
	            });
	        })
	        .then(function() {
	            return results;
	        });
	    };

	    /**
	    * Go over each item in a fashion compatible with Twig.forEach,
	    * allow the function to return a promise or call the third argument
	    * to signal it is finished.
	    *
	    * Each item in the array will be called sequentially.
	    */
	    Twig.async.forEach = function forEachAsync(arr, callback) {
	        var arg_index = 0;
	        var callbacks = {};
	        var promise = new Twig.Promise(function(resolve, reject) {
	            callbacks = {
	                resolve: resolve,
	                reject: reject
	            };
	        });

	        function fail(err) {
	            callbacks.reject(err);
	        }

	        function next(value) {
	            if (!Twig.isPromise(value))
	                return iterate();

	            value.then(next, fail);
	        }

	        function iterate() {
	            var index = arg_index++;

	            if (index == arr.length) {
	                callbacks.resolve();
	                return;
	            }

	            next(callback(arr[index], index));
	        }

	        iterate();

	        return promise;
	    };

	    return Twig;

	};


/***/ },
/* 27 */
/***/ function(module, exports) {

	// ## twig.exports.js
	//
	// This file provides extension points and other hooks into the twig functionality.

	module.exports = function (Twig) {
	    "use strict";
	    Twig.exports = {
	        VERSION: Twig.VERSION
	    };

	    /**
	     * Create and compile a twig.js template.
	     *
	     * @param {Object} param Paramteres for creating a Twig template.
	     *
	     * @return {Twig.Template} A Twig template ready for rendering.
	     */
	    Twig.exports.twig = function twig(params) {
	        'use strict';
	        var id = params.id,
	            options = {
	                strict_variables: params.strict_variables || false,
	                // TODO: turn autoscape on in the next major version
	                autoescape: params.autoescape != null && params.autoescape || false,
	                allowInlineIncludes: params.allowInlineIncludes || false,
	                rethrow: params.rethrow || false,
	                namespaces: params.namespaces
	            };

	        if (Twig.cache && id) {
	            Twig.validateId(id);
	        }

	        if (params.debug !== undefined) {
	            Twig.debug = params.debug;
	        }
	        if (params.trace !== undefined) {
	            Twig.trace = params.trace;
	        }

	        if (params.data !== undefined) {
	            return Twig.Templates.parsers.twig({
	                data: params.data,
	                path: params.hasOwnProperty('path') ? params.path : undefined,
	                module: params.module,
	                id:   id,
	                options: options
	            });

	        } else if (params.ref !== undefined) {
	            if (params.id !== undefined) {
	                throw new Twig.Error("Both ref and id cannot be set on a twig.js template.");
	            }
	            return Twig.Templates.load(params.ref);
	        
	        } else if (params.method !== undefined) {
	            if (!Twig.Templates.isRegisteredLoader(params.method)) {
	                throw new Twig.Error('Loader for "' + params.method + '" is not defined.');
	            }
	            return Twig.Templates.loadRemote(params.name || params.href || params.path || id || undefined, {
	                id: id,
	                method: params.method,
	                parser: params.parser || 'twig',
	                base: params.base,
	                module: params.module,
	                precompiled: params.precompiled,
	                async: params.async,
	                options: options

	            }, params.load, params.error);

	        } else if (params.href !== undefined) {
	            return Twig.Templates.loadRemote(params.href, {
	                id: id,
	                method: 'ajax',
	                parser: params.parser || 'twig',
	                base: params.base,
	                module: params.module,
	                precompiled: params.precompiled,
	                async: params.async,
	                options: options

	            }, params.load, params.error);

	        } else if (params.path !== undefined) {
	            return Twig.Templates.loadRemote(params.path, {
	                id: id,
	                method: 'fs',
	                parser: params.parser || 'twig',
	                base: params.base,
	                module: params.module,
	                precompiled: params.precompiled,
	                async: params.async,
	                options: options

	            }, params.load, params.error);
	        }
	    };

	    // Extend Twig with a new filter.
	    Twig.exports.extendFilter = function(filter, definition) {
	        Twig.filter.extend(filter, definition);
	    };

	    // Extend Twig with a new function.
	    Twig.exports.extendFunction = function(fn, definition) {
	        Twig._function.extend(fn, definition);
	    };

	    // Extend Twig with a new test.
	    Twig.exports.extendTest = function(test, definition) {
	        Twig.test.extend(test, definition);
	    };

	    // Extend Twig with a new definition.
	    Twig.exports.extendTag = function(definition) {
	        Twig.logic.extend(definition);
	    };

	    // Provide an environment for extending Twig core.
	    // Calls fn with the internal Twig object.
	    Twig.exports.extend = function(fn) {
	        fn(Twig);
	    };


	    /**
	     * Provide an extension for use with express 2.
	     *
	     * @param {string} markup The template markup.
	     * @param {array} options The express options.
	     *
	     * @return {string} The rendered template.
	     */
	    Twig.exports.compile = function(markup, options) {
	        var id = options.filename,
	            path = options.filename,
	            template;

	        // Try to load the template from the cache
	        template = new Twig.Template({
	            data: markup,
	            path: path,
	            id: id,
	            options: options.settings['twig options']
	        }); // Twig.Templates.load(id) ||

	        return function(context) {
	            return template.render(context);
	        };
	    };

	    /**
	     * Provide an extension for use with express 3.
	     *
	     * @param {string} path The location of the template file on disk.
	     * @param {Object|Function} The options or callback.
	     * @param {Function} fn callback.
	     * 
	     * @throws Twig.Error
	     */
	    Twig.exports.renderFile = function(path, options, fn) {
	        // handle callback in options
	        if (typeof options === 'function') {
	            fn = options;
	            options = {};
	        }

	        options = options || {};

	        var settings = options.settings || {};

	        var params = {
	            path: path,
	            base: settings.views,
	            load: function(template) {
	                // render and return template as a simple string, see https://github.com/twigjs/twig.js/pull/348 for more information
	                fn(null, '' + template.render(options));
	            }
	        };

	        // mixin any options provided to the express app.
	        var view_options = settings['twig options'];

	        if (view_options) {
	            for (var option in view_options) {
	                if (view_options.hasOwnProperty(option)) {
	                    params[option] = view_options[option];
	                }
	            }
	        }

	        Twig.exports.twig(params);
	    };

	    // Express 3 handler
	    Twig.exports.__express = Twig.exports.renderFile;

	    /**
	     * Shoud Twig.js cache templates.
	     * Disable during development to see changes to templates without
	     * reloading, and disable in production to improve performance.
	     *
	     * @param {boolean} cache
	     */
	    Twig.exports.cache = function(cache) {
	        Twig.cache = cache;
	    };

	    //We need to export the path module so we can effectively test it
	    Twig.exports.path = Twig.path;

	    //Export our filters.
	    //Resolves #307
	    Twig.exports.filters = Twig.filters;

	    return Twig;
	};


/***/ }
/******/ ])
});
;
/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(42)))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(46);


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var randomByte = __webpack_require__(48);

function encode(lookup, number) {
    var loopCounter = 0;
    var done;

    var str = '';

    while (!done) {
        str = str + lookup( ( (number >> (4 * loopCounter)) & 0x0f ) | randomByte() );
        done = number < (Math.pow(16, loopCounter + 1 ) );
        loopCounter++;
    }
    return str;
}

module.exports = encode;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports =  function(stage){
 
	'use strict';
  
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
	 const Notification = class Notification  {
		
		constructor(settings, context){
			this.events = {};
                	this.garbageEvent = {};
                	if (settings) {
                        	this.settingsToListen(settings, context);
                	}
		}

		/**
         	 *
         	 *      @method listen 
         	 *
         	 */
		listen (context, eventName, callback){
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
                        	Array.prototype.unshift.call(arguments, event);
                        	return ContextClosure.fire.apply(ContextClosure, arguments);
                	};
		}

		/**
         	 *
         	 *      @method clearNotifications 
         	 *
         	 */
        	clearNotifications (eventName) {
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
        	}

		/**
         	 *
         	 *      @method fire 
         	 *
         	 */
        	fire (eventName) {
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
						console.log(e)
                                        	throw new Error(e);
                                	}
                        	}
                	}
                	return ret;
        	}

        	/**
         	 *
         	 *      @method settingsToListen 
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

        	unListen (eventName, callback){
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
        	}
	}

        stage.notificationsCenter = {
                notification:Notification,
                create: function(settings, context) {
                        return new Notification(settings, context);
                }
        };

	return Notification ;
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {module.exports = function (){

	'use strict';

	var version = "0.0.1";

	// Traf indexOf IE8 
	var arrayProto = Array.prototype;

	var indexOf = function(){
		if (arrayProto.indexOf){
			return ;		
		}
		arrayProto.indexOf =  function( value, startIndex){
			var index = ( startIndex ) === null ? 0 : (startIndex < 0 ? Math.max(0, this.length + startIndex) : startIndex);
			for (var i = index; i < this.length; i++) {
				if (i in this && this[i] === value){
					return i;
				}
			}
			return -1;
		};
	}();

	var typeOf = function(value){
		var t = typeof value;
		if (t === 'object'){
			if (value === null ) {return "object";}
			if (value instanceof Array ||
				(!(value instanceof Object) &&
           				(Object.prototype.toString.call((value)) === '[object Array]') ||
           				typeof value.length === 'number' &&
           				typeof value.splice !== 'undefined' &&
           				typeof value.propertyIsEnumerable !== 'undefined' &&
           				!value.propertyIsEnumerable('splice')
          			)){
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
			if (value.nodeType === 1 ){
				return "element";
			}
			if (value.nodeType === 9){
				return "document";
			}
			if (value === window){
				return "window";
			}
			if (value instanceof Date){
				return "date";
			}
			if (value.callee){
				return "arguments";
			}
			if (value instanceof SyntaxError){
				return "SyntaxError";
			}
			if (value instanceof Error){
				return "Error";
			}
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

		if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){
			return parseInt(RegExp.$1, 10);
		}
		if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)){
			return parseInt(RegExp.$1, 10);
		}

		if (/Chrome[\/\s](\d+\.\d+)/.test(navigator.userAgent)){
		//if (/Chrome[\/\s](\d+\.\d+\.?\d+)/.test(navigator.userAgent))
			return parseInt(RegExp.$1,10);
		}

		if (/Safari[\/\s](\d+\.\d+)/.test(navigator.userAgent)){
			if (/Version[\/\s](\d+\.\d+)/.test(navigator.userAgent)){
				return parseInt(RegExp.$1,10);
			}
		}

		if (/Opera[\/\s](\d+\.\d+)/.test(navigator.userAgent)){
			if (/Version[\/\s](\d+\.\d+)/.test(navigator.userAgent)){
				return parseInt(RegExp.$1,10);
			}
		}

		if (/Iceweasel[\/\s](\d+\.\d+)/.test(navigator.userAgent)){
			return parseInt(RegExp.$1, 10);
		}

		return "undefined"; 
	}();

	var useragent = navigator.userAgent.toLowerCase();

	/**
	 *	stage class   
	 *	The class is a **`stage client side `** .
	 *	@class stage
	 *	@constructor
	 *	@module library
	 *	
	 */
	var Stage = class Stage  {

		constructor(){
			this.version = version; 
			this.typeOf = typeOf ;
			this.extend = jQuery.extend ;
			this.crypto = {};
			this.modules = {};
			this.media = {};
			this.structs ={} ;
			this.controllers = {};
			this.browser = {
				navigator:getBrowser,
				version:getBrowserVersion,
				Ie:/msie/.test( useragent ) && !/opera/.test( useragent ),
				Gecko:navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') === -1,
				Webkit:/webkit/.test( useragent ),
				Opera:Object.prototype.toString.call(window.opera) === '[object Opera]',
				platform:navigator.userAgent.match(/ip(?:ad|od|hone)/) ? 'ios' : (navigator.userAgent.match(/(?:webos|android)/) || navigator.platform.toLowerCase().match(/mac|win|linux/) || ['other'])[0]
			};
		}

		register (name, closure){
			if (typeof closure === "function") {
				// exec closure 
				var register = closure(this, name);
			} else {
				var register = closure;
			}
			return this[name] = register;
		}

		registerModule (name, closure){
			return this.register.call(this.modules, name, closure);
		}

		registerController (name, closure){
			return this.register.call(this.controllers, name, closure);
		}

		basename (path) {
			return path.replace(/\\/g,'/').replace( /.*\//, '' );
		}

		dirname (path) {
			return path.replace(/\\/g,'/').replace(/\/[^\/]*$/, '');
		}

	};
	return  new Stage();
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 11 */
/***/ (function(module, exports) {

/*
 *
 *
 *
 *
 *
 *
 *
 */


module.exports =  function(stage){

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


	stage.crypto.base64 =  {
		decodeArrayBuffer:decodeArrayBuffer,
		encode:encode64,
		decode:decode64
	};

	return stage.crypto.base64 ;
};




/***/ }),
/* 12 */
/***/ (function(module, exports) {

/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

module.exports =  function(stage){

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
  		return rstr2hex("abc").toLowerCase() === "900150983cd24fb0d6963f7d28e17f72";
	};

	/*
 	* Calculate the MD5 of a raw string
 	*/
	var rstr_md5 = function(s)
	{
  		return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
	};

	/*
 	* Calculate the HMAC-MD5, of a key and some data (raw strings)
 	*/
	var rstr_hmac_md5 = function (key, data)
	{
  		var bkey = rstr2binl(key);
  		if(bkey.length > 16) {
			bkey = binl_md5(bkey, key.length * 8);
		}
  		var ipad = Array(16), opad = Array(16);
  		for(var i = 0; i < 16; i++)
  		{
    			ipad[i] = bkey[i] ^ 0x36363636;
    			opad[i] = bkey[i] ^ 0x5C5C5C5C;
  		}

  		var hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
  		return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
	};

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
    			output += hex_tab.charAt((x >>> 4) & 0x0F) + hex_tab.charAt( x  & 0x0F);
  		}
  		return output;
	};

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
      				if(i * 8 + j * 6 > input.length * 8){
					output += b64pad;
      				}else {
					output += tab.charAt((triplet >>> 6*(3-j)) & 0x3F);
				}
    			}
  		}
  		return output;
	};

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
      				if(quotient.length > 0 || q > 0){
        				quotient[quotient.length] = q;
				}
    			}
    			remainders[j] = x;
    			dividend = quotient;
  		}

  		/* Convert the remainders to the output string */
  		var output = "";
  		for(i = remainders.length - 1; i >= 0; i--){
    			output += encoding.charAt(remainders[i]);
		}
  		return output;
	};
	
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
    			if(x <= 0x7F){
      				output += String.fromCharCode(x);
    			}else if(x <= 0x7FF){
      				output += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F),
                                    		0x80 | ( x         & 0x3F));
    			}else if(x <= 0xFFFF){
      				output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                                    		0x80 | ((x >>> 6 ) & 0x3F),
                                    		0x80 | ( x         & 0x3F));
    			}else if(x <= 0x1FFFFF){
      				output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                                    		0x80 | ((x >>> 12) & 0x3F),
                                    		0x80 | ((x >>> 6 ) & 0x3F),
                                    		0x80 | ( x         & 0x3F));
			}
  		}
  		return output;
	};

	/*
 	 * Encode a string as utf-16
 	 */
	var str2rstr_utf16le = function (input)
	{
  		var output = "";
  		for(var i = 0; i < input.length; i++){
    			output += String.fromCharCode( input.charCodeAt(i)        & 0xFF,
                                  	(input.charCodeAt(i) >>> 8) & 0xFF);
		}
  		return output;
	};

	var str2rstr_utf16be = function (input)
	{
  		var output = "";
  		for(var i = 0; i < input.length; i++){
    			output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF,
                                   	input.charCodeAt(i)        & 0xFF);
		}
  		return output;
	};

	/*
 	 * Convert a raw string to an array of little-endian words
 	 * Characters >255 have their high-byte silently ignored.
 	 */
	var rstr2binl = function (input)
	{
  		var output = Array(input.length >> 2);
  		for(var i = 0; i < output.length; i++){
    			output[i] = 0;
		}
  		for(var i = 0; i < input.length * 8; i += 8){
    			output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (i%32);
		}
  		return output;
	};

	/*
 	 * Convert an array of little-endian words to a string
 	 */
	var binl2rstr = function (input)
	{
  		var output = "";
  		for(var i = 0; i < input.length * 32; i += 8){
    			output += String.fromCharCode((input[i>>5] >>> (i % 32)) & 0xFF);
		}
  		return output;
	};

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
	};

	/*
 	 * These functions implement the four basic operations the algorithm uses.
 	 */
	var md5_cmn = function (q, a, b, x, s, t)
	{
  		return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
	};
	var md5_ff = function (a, b, c, d, x, s, t)
	{
  		return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
	};
	var md5_gg = function (a, b, c, d, x, s, t)
	{
  		return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
	};
	var md5_hh = function (a, b, c, d, x, s, t)
	{
  		return md5_cmn(b ^ c ^ d, a, b, x, s, t);
	};
	var md5_ii = function (a, b, c, d, x, s, t)
	{
  		return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
	};

	/*
 	 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 	 * to work around bugs in some JS interpreters.
 	 */
	var safe_add = function (x, y)
	{
  		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  		return (msw << 16) | (lsw & 0xFFFF);
	};

	/*
 	 * Bitwise rotate a 32-bit number to the left.
 	 */
	var bit_rol = function (num, cnt)
	{
  		return (num << cnt) | (num >>> (32 - cnt));
	};

	stage.crypto.md5 = {
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
	};
	return stage.crypto.md5 ; 
};



/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports =  function(stage){

	var keyWord= {
		realm:true,
		qop:true,
		charset:true,
		algorithm:true,
		nonce:true
	};

	var reg =/^([^=]+)=(.+)$/;
	var parserAuthenticate = function(str){
		var ret = str.replace(/"/g,"");
		ret = ret.replace(/Digest /g,"");
		var head = ret.split(",");
		var obj = {};
		for (var i= 0 ; i < head.length ; i++){
			var res = reg.exec(head[i]);
			if (res && res[1]){
				obj[res[1]] = res[2];
			}
		}	
		return obj;
	};

	var MD5 = stage.crypto.md5.hex_md5_noUTF8 ;
	var BASE64 = stage.crypto.base64.encode ;
	var DBASE64 = stage.crypto.base64.decode;

	var generateA1 = function(username, realm, password, nonce, cnonce){
		var A1 = null ;
		if (cnonce){
			A1 = username + ":" + realm + ":" + password + ":" + nonce+ ":" + cnonce ;
		}else{
			A1 = username + ":" + realm + ":" + password ;//+ ":" + nonce ;
		}
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

	/*
 	 *
 	 */
	const digestMd5 = class digestMd5  {

		constructor(url, method, headers, body){
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
					throw new Error("digetMD5 bad format header");
			}	
		}

		parseChallenge (headers){
			//console.log(headers)
			var parsing = {};
			switch (typeof headers){
				case "string" : 
					//TODO
					throw new Error("digetMD5 bad format challenge");
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

						}
					}
					break;	
				default:
					throw new Error("digetMD5 bad format challenge");
			}
			var challenge = stage.extend(parserAuthenticate(this.challengeB64), parsing );
			//var challenge = parserAuthenticate(this.challengeB64);
			//console.log(challenge)
			for (var name in challenge){
				if (name in keyWord){
					this[name] = challenge[name];
				}else{
					console.warn("digestMd5 parser challenge header name dropped: "+name);
				}	
			}
		}

		generateAuthorization (username, password){

			var line = 'Digest username="'+username+'"';
			if (! this.realm){
				this.realm = username+"@"+this.url.host ;
			}

			var res ={
				nonce:'"'+this.nonce+'"',
				realm:'"'+this.realm+'"',
				response:null
			};

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
			return toSend;

		}
	};

	stage.io.authentication.Digest = digestMd5 ;
	stage.io.authentication.mechanisms.Digest = digestMd5 ;
	return digestMd5;

};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports =  function(stage){
	
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


	var Sasl = class Sasl  {

		constructor(url, method, headers, body){
			this.method = method;
			this.url = url;
			this.name = "sasl" ;
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

		getBestMechanism (mechanism){
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

		getAuthorization (user, password){
			return  'SASL mechanism="'+this.bestMechanism+'",'+this.mechanism.generateAuthorization(user, password);
		}

	};

	stage.io.authentication.SASL = Sasl ;
	
	return Sasl ;

};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {module.exports =  function(stage){

	'use strict';

	var isSameOrigin = function (url) {
		var loc = window.location;
		var a = urlToOject(url);
		return a.hostname === loc.hostname &&
			a.port == loc.port &&
			a.protocol === loc.protocol;
	};

	var isSecure = function(url){
		var loc = window.location;
		var a = urlToOject(url);
		return a.protocol === "https:" ;
	};

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
	var authenticate = class authenticate  {

		constructor(url, request, settings){
			this.url = typeof url === "object" ? url : stage.io.urlToOject(url) ;
			this.crossDomain = ! stage.io.isSameOrigin(url);
			// notification center
			this.notificationCenter = stage.notificationsCenter.create(settings);
			// get header WWW-Authenticate
			var authenticate = request["WWW-Authenticate"].split(" ") ;
			//  get type authentification
			var authType = Array.prototype.shift.call(authenticate);
			var headers = request["WWW-Authenticate"].replace(authType+" ","");
				//console.log(authType);
				this.method = "POST";
			var body = request.body;

			// intance of authentication
			var auth = this.getAuthenticationType(authType);
			this.authentication = new auth(this.url,  this.method, headers, body );
				this.ajax = false;
			if (settings.ajax){
				this.ajax = true;
			}
		}
		
		getAuthenticationType (type){
			if (type in stage.io.authentication){
				return stage.io.authentication[type];
			}else{
				throw new Error("SSE client can't negociate : "+type );
			}
		}

		register (username, password){
			var line = this.authentication.getAuthorization(username, password);
			this.notificationCenter.fire("onRegister", this, line);	
			if (this.ajax){
				$.ajax({
					type:		this.method,
					url:		this.url.href,
					cache:		false,
					crossDomain:	this.crossDomain ? false : true ,
					error:(obj, type, message) => {
						this.notificationCenter.fire("onError", obj, type, message);	
					},
					beforeSend:(xhr) => {
						xhr.setRequestHeader("Authorization", line );
						//if (this.crossDomain)
						//xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
					},
					success:(data, state, obj) => {
						this.notificationCenter.fire("onSuccess", data, state, obj);
					}
				});
			}		
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
						var val =  decodeURIComponent(key_value[1]);
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
		return obj;
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
				return JSON.parse(json);
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
		for (var keyIndex in keys) {
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

	var transportCore = class transportCore  extends stage.notificationsCenter.notification {

		constructor(url, settings, context){
			super(settings, context );	
			// Manage Url
			if (url){
				this.url = urlToOject(url);
				this.crossDomain = !isSameOrigin(url);
				this.error = null;
			}else{
				this.fire("onError", new Error("Transport URL not defined") );
			}	
		}
	};
	
	stage.io = {
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
	};

	return stage.io ;
};



/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {module.exports =  function(stage){

	'use strict';

	var clientsCapabilities = function(){
		var tab = [];
		var ws =  stage.io.nativeWebSocket  ? tab.push("websocket") : null ;
		var poll = stage.io.poll ? tab.push("poll") : null ;
		var lpoll =stage.io.longPoll ?  tab.push("long-polling") : null ; 
		var jsonp = stage.io.jsonp ?  tab.push("callback-polling") : null ; 
		return tab ;
	}();

	var onHandshakeResponse = function(message){
		if ( message.successful ){
			try {
				var socket  = this.getBestConnection(message.supportedConnectionTypes);
				this.socket = new socket.Class( socket.url );
				this.socket.onmessage = (message) => {
					if (message.data ){
						this.onMessage(message.data);
					}
				}; 
				this.socket.onopen = () => {
					this.socket.send( this.connect(message) );	
					this.notificationCenter.fire("onHandshake", message, this.socket);
				};
				this.socket.onerror = this.notificationCenter.listen(this, "onError");
				this.socket.onclose = (err) => {
					delete this.socket ;
					this.notificationCenter.fire("onClose",err );
				};
			}catch(e){
				throw new Error (e);
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
				this.notificationCenter.fire("onDisconnect", message);
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
							return onError.call(this, message.error);
						}
					break;
					case "Error":
						message.error = "500::"+message.error.message;
						return onError.call(this, message.error);
					default:
						throw new Error("Bad protocole error BAYEUX");
					
				}
				return this.notificationCenter.fire("onError", code, arg, mess);
			}catch(e){
				throw new Error("Bad protocole error BAYEUX"+ e);
			}
		}
	};

	/*
 	 *	BAYEUX PROTOCOL
 	 *
 	 */
	const bayeux = class bayeux {
		
		constructor(url){
			this.name = "bayeux" ;	
			this.notificationCenter = stage.notificationsCenter.create(this.settings, this);
			this.url = url ; 
			this.socket = null;
			this.connected = false;
			this.request = {
				version:"1.0"
			};
		}

		getBestConnection (supportedConnectionTypes){
			if (this.url.protocol === "https:" || this.url.protocol === "wss:"){
				this.url.protocol = "wss:";
			}else{
				this.url.protocol = "ws:";
			}
			this.socketType = "WEBSOCKET";
			return {
				Class: window.WebSocket,
				url:this.url.protocol+"//"+this.url.host+this.url.requestUri
			};	
		}

		build (obj){
			var res = [];
			res.push(obj);
			return res ;
		}

		handshake (){
			var req = JSON.stringify( stage.extend({}, this.request , {
				channel : "/meta/handshake",
			    minimumVersion: "1.0",
			    supportedConnectionTypes:clientsCapabilities
			}));
			return this.send(req);	
		}

		connect (message){
			return JSON.stringify({
				channel: "/meta/connect",
			       clientId: message.clientId,
			       connectionType: this.socketType
			});
		}

		stopReConnect (message){
			this.notificationCenter.unListen("onClose", reconnect);
		}

		disconnect (){
			return JSON.stringify({
				channel: "/meta/disconnect",
			       clientId: this.idconnection,
			});	
		}

		subscribe (name, data){
			return JSON.stringify({
				channel: "/meta/subscribe",
			       clientId: this.idconnection,
			       subscription: "/service/"+name,
			       data:data
			});
		}

		unSubscribe (name, clientId, data){
			return JSON.stringify({
				channel: "/meta/unsubscribe",
			       clientId: clientId,
			       subscription: "/service/"+name,
			       data:data
			});
		}

		sendMessage (service, data, clientId){
			return JSON.stringify({
				channel: "/service/"+service,
			       clientId: clientId,
			       id: new Date().getTime(),
			       data:data
			});	
		}

		onMessage (message){
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
				case "/meta/connect":
					return onConnectResponse.call(this, message);
				case "/meta/disconnect":
					return onDisconnectResponse.call(this, message);
				case "/meta/subscribe":
					return onSubscribeResponse.call(this, message);
				case "/meta/unsubscribe":
					return onUnsubscribeResponse.call(this, message);
				default:
					// /some/channel
					this.notificationCenter.fire("onMessage", message);
			}
		}

		send (data){
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
			       success:(data, type, xhr) => {
				       this.onMessage(data);			
			       },
            		       error: (obj, type, message) => {
				       this.notificationCenter.fire('onError', obj, type, message);
            		       }
        		});
		}
	};

	stage.io.protocols.bayeux = bayeux ;
	return bayeux ;
};


/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports =  function(stage){

	'use strict';


	var defaultAparser = function(value, block){
		if ( value ){
			return value ;
		}
		return null ;
	};

	var rtpmapParser = function(value, block){
		 //a=rtpmap:<payload type> <encoding name>/<clock rate>[/<encoding parameters>]
		if ( value ){
			var obj = {
				payloadType		: null,
				encodingName		: null,
				clockRate		: null,
				encodingParameters	: null,
				raw			: value
			};
			var res = value.split(" ");
			for (var i = 0 ; i< res.length ; i++){
				switch (i){
					case 0 :
						obj.payloadType = res[i] ;
					break;
					case 1 :
						var ret = res[i].split("/");
						obj.encodingName = ret[0] ;
						if (ret[1]){
							obj.clockRate = ret[1];	
						}
						if (ret[2]){
							obj.encodingParameters = ret[2] ;
						}
					break;
				}
			}
			
			if ( ! ( obj.encodingName in block.rtpmap ) ){
				var index = block.rtpmap.push(obj) ;
				block.rtpmap["rtpmap_"+obj.payloadType] = block.rtpmap[index-1] ;
			}
			return obj ;
		}
		return null;
	};

	var candidateParser = function(value, block){
		/* a=candidate:0 1 UDP 2122252543 169.254.105.57 65488 typ host	
		 * a=candidate:6glsxoSzDfHGkyMz 1 UDP 2130706431 93.20.94.1 35796 typ host
		 * a=candidate:2 1 UDP 1694498815 192.0.2.3 45664 typ srflx raddr 10.0.1.1 rport 8998
		 * a=candidate:86628240 1 udp 2122260223 192.168.10.234 64435 typ host generation 0 network-id 3
		 * 
		 * 
 		 * 
 		 *
		 *   candidate-attribute   = "candidate" ":" 
		 *	   foundation SP 
		 *	   component-id SP
                 *         transport SP
                 *         priority SP
                 *         connection-address SP     ;from RFC 4566
                 *         port         ;port from RFC 4566 SP 
                 *         cand-type     
                 *          [SP rel-addr]
                 *          [SP rel-port]
                 *          *(SP extension-att-name SP
                 *               extension-att-value)
                 */               
		if ( value ){
			
			var obj = {
				foundation		: null,
				componentId		: null,
				transport		: null,
				transportExt		: null,
				priority		: null,
				connectionAddress	: null,
				port			: null,
				candidateType		: null,
				remoteAddr		: null,
				remotePort		: null,
				generation		: null,
				networkId		: null,
				raw			: value
			};
			var res = value.split(" ");
			for (var i = 0 ; i< res.length ; i++){
				switch (i){
					case 0 :
						obj.foundation = res[i] ;
					break;
					case 1 :
						obj.componentId = res[i] ;
					break;
					case 2 :
						obj.transport = res[i] ;
						var ret = res[i].split("/");
						obj.transport = ret[0] ;
						if (ret[1]){
							obj.transportExt = ret[1];	
						}
					break;
					case 3 :
						obj.priority = res[i] ;
					break;
					case 4 :
						obj.connectionAddress = res[i] ;
					break;
					case 5 :
						obj.port = res[i] ;
					break;
					default :
						switch ( res[i] ){
							case "typ" :
								obj.candidateType = res[i+1] ;	
							break ;
							case "raddr" :
								obj.remoteAddr = res[i+1] ;
							break ;
							case "rport" :
								obj.remotePort = res[i+1] ;
							break ;
							case "generation" :
								obj.generation = res[i+1] ;
							break ;
							case "network-id" :
								obj.networkId = res[i+1] ;
							break ;
						}
					break;	
				}
			}
			block.candidates.push(obj);
			return value ;
		}
		return null;
	};

	var aAttribute = {
		"cat"		: defaultAparser,
		"keywds"	: defaultAparser,
		"tool"		: defaultAparser,
		"ptime"		: defaultAparser,
		"maxptime"	: defaultAparser,
		"rtpmap"	: rtpmapParser,
		"orient"	: defaultAparser,
		"type"		: defaultAparser,
		"charset"	: defaultAparser,
		"sdplang"	: defaultAparser,
		"lang"		: defaultAparser,
		"framerate"	: defaultAparser,
		"quality"	: defaultAparser,
		"fmtp"		: defaultAparser,
		"candidate"	: candidateParser	
	};
	
	var aAttributeDirection = {
		"recvonly"	: defaultAparser,
		"sendrecv"	: defaultAparser,
		"sendonly"	: defaultAparser,
		"inactive"	: defaultAparser
	};

	/*
 	 *	SDP PROTOCOL
 	 *
 	 */
	var parserSdp  = class parserSdp {
		
		constructor(body){
			if ( ! body ){
				throw new Error("SDP parser no data found !! ") ;
			}
			//this.line = body.split("\n");
			//this.nbLines = this.line.length ;
			//this.size = body.length ;
			this.raw = body ;
			this.blocks = [];
			this.sessionBlock = null;
			this.audioBlock = null;
			this.videoBlock = null;
			this.detectBlocks();
			this.parseBlocks();
		}

		detectBlocks (){
			var line = this.raw.split("\n");
			var nbLines = line.length ;
			var first = 0 ;
			var m = null ;
			for (var i = 0 ; i< nbLines ; i++){
				var res = line[i].split("=");
				var key = res[0].replace(/ |\n|\r/g,"") ;
				var value = res[1] ;
				let data = null ;
				let size = null ;
				let media = null ;
				let type = null ;
				switch(key){
					case "m":
						if (first == 0 ){
							data = line.slice(first, i);
							size = data.length ;
						}else{
							data = line.slice(first+1, i);
							size = data.length ;
						}
						let parseM = this.parseMline(m) ;
						if ( parseM ){
							media = parseM ;	
							type = parseM.media ;
						}else{
							media = null ;
							type = "session" ;
						}
						this.blocks.push({
							type		: type,
							direction	: null,
							//start		: first,
							//end		: i,
							data		: data,
							//size		: size,
							media		: media,
							information	: "",
							attributes	: [],
							bandwidths	: [],
							candidates	: [],
							connection	: null,
							encryption	: null
						});
						first = i ;
						m = value ; 	
						break;
				}
			}	
			var data = line.slice(first+1, nbLines) ;
			var size = data.length ;
			var media = null ;
			var type = null ;
			var parseM = this.parseMline(m) ;
			if ( parseM ){
				media = parseM ;
				type = parseM.media ;	
			}else{
				media = null ;
				type = "session" ;
			}
			this.blocks.push({
				type		: type,
				direction	: null,
				//start		: first,
				//end		: nbLines,
				data		: data,
				//size		: size,
				media		: media,
				information	: "",
				attributes	: [],
				bandwidths	: [],
				candidates	: [],
				connection	: null,
				encryption	: null
			});
		}

		parseMline (data){
			// RFC https://tools.ietf.org/html/rfc4566#section-5.14
			//=<media> <port>/<number of ports> <proto> <fmt> ...
			if ( data ){
				var obj = {
					media	: "",
					port	: "",
					nbPort	: 0,
					proto	: "",
					fmt	: [],
					raw	: data
				};
				var res = data.split(" ");
				for (var i = 0 ; i< res.length ; i++){
					switch (i){
						case 0 :
							obj.media = res[i] ;
							break;
						case 1 :
							var ret = res[i].split("/");
							obj.port = ret[0] ;
							if (ret[1]){
								obj.nbPort = ret[1];	
							}else{
								obj.nbPort = 1;
							}
							break;
						case 2 :
							obj.proto = res[i] ;
							break;
						default:
							obj.fmt.push(res[i]);	
					}
				}
				return obj ;
			}
			return null;
		}

		parseAline (data, block){
			//a=<attribute>:<value>
			var obj = {};
			if (  ! data ){
				return obj ;
			}
			var res = data.split(":");
			var attribute = res[0].replace(/ |\n|\r/g,"");
			var value = res[1] ;
			if (  aAttribute[attribute] ){
				obj[attribute] = aAttribute[attribute](value, block);
			}else{
				switch (attribute){
					case "setup":
						obj[attribute] = value;	
						block["setup"] = value;
						break;
					default:
						if (  aAttributeDirection[attribute] ){
							var ele = aAttributeDirection[attribute](attribute, block); 
							obj[attribute] = ele;	
							block.direction = ele ; 
						}else{
							obj[attribute] = value ;
						}
				}
			}
			return obj ;
		}

		parseCline (data){
			//c=<nettype> <addrtype> <connection-address>
			if ( data ){
				var obj = {
					nettype		: null,
					addrtype	: null,
					address		: null,
					raw		: data
				};
				var res = data.split(" ");
				for (var i = 0 ; i< res.length ; i++){
					switch (i){
						case 0 :
							obj.nettype = res[i] ;
							break;
						case 1 :
							obj.addrtype = res[i] ;

							break;
						case 2 :
							obj.address = res[i] ;
							break;
					}
				}
				return obj ;
			}
			return null;
		}

		parseOline (data){
			//o=<username> <sess-id> <sess-version> <nettype> <addrtype> <unicast-address>
			if ( data ){
				var obj = {
					username		: null,
					sessId			: null,
					sessVersion		: null,
					nettype			: null,
					addrtype		: null,
					unicastAddr		: null,
					raw			: data
				};
				var res = data.split(" ");
				for (var i = 0 ; i< res.length ; i++){
					switch (i){
						case 0 :
							obj.username = res[i] ;
							break;
						case 1 :
							obj.sessId = res[i] ;
							break;
						case 2 :
							obj.sessVersion = res[i] ;
							break;
						case 3 :
							obj.nettype = res[i] ;
							break;
						case 4 :
							obj.addrtype = res[i] ;
							break;
						case 5 :
							obj.unicastAddr = res[i] ;
							break;
					}
				}
				return obj ;
			}
			return null;
		}

		/*
 	 	 *	TIME DESCRIPTION
 	 	 */
		parseTline (data){
			//t=<start-time> <stop-time>
			if ( data ){
				var obj = {
					start		: null,
					stop		: null,
					raw		: data
				};
				var res = data.split(" ");
				for (var i = 0 ; i< res.length ; i++){
					switch (i){
						case 0 :
							obj.start = res[i] ;
							break;
						case 1 :
							obj.stop = res[i] ;
							break;
					}
				}
				return obj ;
			}
			return null;
		}

		parseRline (data){
			//r=<repeat interval> <active duration> <offsets from start-time>
			if ( data ){
				var obj = {
					interval	: null,
					duration	: null,
					offsets		: null,
					raw		: data
				};
				var res = data.split(" ");
				for (var i = 0 ; i< res.length ; i++){
					switch (i){
						case 0 :
							obj.interval = res[i] ;
							break;
						case 1 :
							obj.duration = res[i] ;
							break;
						case 2 :
							obj.offsets = res[i] ;
							break;
					}
				}
				return obj ;
			}
			return null;
		}

		/** BLOCK MEDIA
 	 	 *    Media description, if present
	 	 *  m=  (media name and transport address)
	 	 *  i= (media title)
	 	 *  c= (connection information -- optional if included at
	 	 *     session level)
	 	 *  b= (zero or more bandwidth information lines)
	 	 *  k= (encryption key)
	 	 *  a= (zero or more media attribute lines)
	 	 */
		blockMediaParser ( block ){
			block["rtpmap"] = [] ;
			for (var j = 0 ; j < block.data.length ; j++){ 
				var res = block.data[j].split("=");
				var key = res[0].replace(/ |\n|\r/g,"") ;
				var value = res[1] ;	
				switch(key){
					case "a" :
						block.attributes.push( this.parseAline(value, block ) ) ;
						break;
					case "c":
						block.connection = this.parseCline(value) ;
						break;
					case "i" :
						block.information = value ;
						break;
					case "b" :
						block.bandwidths.push(value);
						break;
					case "k" :
						block.encryption = value ;
						break;
				}
			}
			return block ;
		}

		/*  BLOCK SESSION
 	 	 *    session description
         	 *  v=  (protocol version)
         	 *  o=  (originator and session identifier)
         	 *  s=  (session name)
         	 *  i= (session information)
         	 *  u= (URI of description)
         	 *  e= (email address)
         	 *  p= (phone number)
         	 *  c= (connection information -- not required if included in
         	 *     all media)
         	 *  b= (zero or more bandwidth information lines)
         	 *     One or more time descriptions ("t=" and "r=" lines; see below)
         	 *  z= (time zone adjustments)
         	 *  k= (encryption key)
         	 *  a= (zero or more session attribute lines)
         	 *     Zero or more media descriptions
	 	 */
		blockSessionParser (block){
			block["protocol"] = null ;
			block["originator"] = null ;
			block["timeZone"] = null ;
			block["sessionName"] = null ;
			block["originator"] = null ;
			block["protocol"] = null ;
			block["uri"] = null ;
			block["phoneNumber"] = null ;
			block["email"] = null ;
			block["timeDescription"] = null;
			block["timeRepeat"] = null;

			for (var j = 0 ; j < block.data.length ; j++){ 
				var res = block.data[j].split("=");
				var key = res[0].replace(/ |\n|\r/g,"") ;
				var value = res[1] ;	
				switch(key){
					case "v" :
						block.protocol = value ;
						break;
					case "o" :
						block.originator = this.parseOline( value ) ;
						break;
					case "s" :
						block.sessionName = value ;
						break;
					case "u" :
						block.uri = value ;
						break;
					case "e" :
						block.email = value ;
						break;
					case "p" :
						block.phoneNumber = value ;
						break;
					case "z" :
						block.timeZone = value ;
						break;
					case "a" :
						block.attributes.push( this.parseAline(value, block) ) ;
						break;
					case "c":
						block.connection = this.parseCline(value) ;
						break;
					case "i" :
						block.information = value ;
						break;
					case "b" :
						block.bandwidths.push(value);
						break;
					case "k" :
						block.encryption = value ;
						break;
						// TIME DESCRIPTION
					case "t" :
						block.timeDescription = this.parseTline(value);
						break ;
					case "r" :
						block.timeRepeat = this.parseRline(value);
						break ;
				}
			}
			return block ;
		}

		parseBlocks (){
			for (var i = 0 ; i< this.blocks.length ; i++){
				switch( this.blocks[i].type ){
					case "session" :
						this.sessionBlock = this.blockSessionParser( this.blocks[i] );
						break;
					case "audio" :
						this.audioBlock = this.blockMediaParser( this.blocks[i] );
						break;
					case "video" :
						this.videoBlock = this.blockMediaParser( this.blocks[i] );
						break;
				}
			}
		}
	};

	stage.io.protocols.sdp = parserSdp ;
	
	return parserSdp ;
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {module.exports =  function(stage){

	'use strict';

	/*
 	 *
 	 *	DIGEST authenticate
 	 *
 	 *
 	 */
	var stringify = function(value){
		return '"'+value+'"';
	};

	var reg =/^([^=]+)=(.+)$/;
	var parserAuthenticate = function(str){
		var ret = str.replace(/"/g,"");
		ret = ret.replace(/Digest /g,"");
		var head = ret.split(",");
		var obj = [];
		for (var i= 0 ; i < head.length ; i++){
			var res = reg.exec(head[i]);
			var key = res[1].replace(/ |\n|\r/g,"");
			if (res && key){
				obj[key] = res[2];
			}
		}	
		return obj;
	};

	var MD5 = stage.crypto.md5.hex_md5_noUTF8 ;
	//var BASE64 = stage.crypto.base64.encode ;

	var digest = {
		generateA1:function(username, realm, password, nonce, cnonce){
			var A1 = null ;
			if (cnonce){
				A1 = username + ":" + realm + ":" + password + ":" + nonce+ ":" + cnonce ;
			}else{
				A1 = username + ":" + realm + ":" + password ;//+ ":" + nonce ;
			}
			//console.log(A1)
			return MD5(A1); 
		},
		generateA2:function(method, uri, entity_body, qop){
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
			//console.log(A2)
			return MD5(A2);
		},
		generateResponse:function(A1, nonce, noncecount, cnonce, qop, A2){
			var res = "";
			if(qop === "auth" || qop === "auth-int"){
				res = A1 + ":" + nonce +":" + noncecount +":" + cnonce +":" + qop + ":" + A2 ;
			}else{
				res = A1 + ":" + nonce + ":" + A2 ;
			}
			//console.log(res)
			return MD5(res);
		}		
	};


	var authenticate  = class authenticate {

		constructor(dialog, username, password){
			
			this.dialog = dialog ;
			this.userName = username ;
			this.password = password;
			this.uri = "sip:" +this.dialog.sip.server ;	
			this.realm = "nodefony.com";
			this.nonce = null;
			this.cnonce =null;
			this.nonceCount = null;
			this.qop =null;
			this.algorithm = null;
			this.entity_body = null;
		}

		register (message, type){
			/*if (transaction.sended){
				console.log("WWW-Authenticate error")
				return ;
			}*/	
			//console.log("AUTH REGISTER")
			//console.log(message);
			var head = message.authenticate ;	
			this.realm = head.realm	;
			this.nonce = head.nonce;
			this.cnonce = head.cnonce;
			this.qop = head.qop;
			this.algorithm = head.Digestalgorithm ? head.Digestalgorithm : "md5" ;	
			if ( message.rawBody ){
				this.entity_body = message.rawBody;
			}
			switch (this.algorithm.toLowerCase()){
				case "md5" :
					this.response = this.digestMD5(message.method);
				break;
			}

			var method ="";
			if ( ! type ){
				method = "Authorization: ";
			}else{
				if ( type === "proxy"){
					method = "Proxy-Authorization: ";
				}else{
					method = "Authorization: ";	
				}
			}
			var line = "Digest username=" +stringify(this.userName)+", realm="+stringify(this.realm)+ ", nonce=" + stringify(this.nonce) +", uri="+stringify(this.uri)+", algorithm="+this.algorithm+", response="+stringify(this.response);
			this.lineResponse = method + line ; 

			//var transac = message.transaction ;
			var transac = this.dialog.createTransaction(message.transaction.to);
			this.dialog.tagTo = null ;	
			//this.dialog.sip.fire("onInitCall", this.dialog.toName, this.dialog, transac);
			var request = transac.createRequest(this.dialog.body, this.dialog.bodyType);
			request.header.response=this.lineResponse;
			request.send();
			return transac ;

		}
		
		digestMD5 (method){
			var A1 = digest.generateA1(this.userName, this.realm, this.password, this.nonce, this.cnonce );
			var A2 = digest.generateA2(method, this.uri, this.entity_body, this.qop );
			return  digest.generateResponse(A1, this.nonce, this.nonceCount, this.cnonce, this.qop, A2);
		}
	};


	/*
 	 *
 	 * CLASS PARSER HEADER SIP
 	 *
 	 *
 	 */
	//var regContact = /.*<(sip:.*)>(.*)|.*<(sips:.*)>(.*)/g;
	var regHeaders = {
		line:/\r\n|\r|\n/,
		headName:/: */,
		Allow:/, */,
		Via:/; */,
		CallId:/^(.*)@.*$/,
		algorithm:/= */,
		fromTo:/<sip:(.*)@(.*)>/,
		fromToG:/(.*)?<sip:(.*)@(.*)>/
	};

	var parsefromTo = function(type, value){
		var sp = value.split(";");
		this.message[type+"Tag"] = null;
		var res = sp.shift();
		var res2 = regHeaders.fromTo.exec(res);
		//console.log(regHeaders.fromToG.exec(res))
		//console.log(res2)
		this.message[type+"Name"] = (res2.length > 2)  ? res2[1].replace(/ |\n|\r/g,"").replace(/"/g,"") : "" ;
 	        this.message[type] =  res2[1].replace(" ","") +"@"+ res2[2].replace(/ |\n|\r/g,"") ;
		var ret = regHeaders.fromToG.exec(res) ;	
		if ( ret && ret[1] ){
			var displayName =  ret[1].replace(/"/g,"")  ;
			//this.message[type+"Name"] = displayName ;
			this.message[type+"NameDisplay"] = displayName ;
			//console.log(displayName)
		}

		for (var i = 0 ; i < sp.length ;i++){
			var res3 = sp[i].split("=");
			if(res3[0].replace(/ |\n|\r/g,"") === "tag"){
				this.message[type+"Tag"] = res3[1] ;
			}else{
				this.message[res3[0]] = res3[1] ;
			}
		}
		return value;
	};


	var headerSip  = class headerSip {

		constructor(message, header){
			this.rawHeader = {} ;
			this.message = message; 
			this.method = null; 
			this.firstLine = null;
			this.branch = null ;
			this.Via = [];
			this.routes = [];
			this.recordRoutes = [];
			if (header && typeof header === "string"){
				try {
					this.parse(header);
				}catch(e){
					console.log(e);
					throw new Error("PARSE ERROR MESSAGE SIP", 500);
				}
			}
		}

		parse (header){
			var tab = header.split(regHeaders.line);
			var type = tab.shift();
			this.firstLine = type.split(" ");
			$.each(tab, (Index, ele) => {
				var res = regHeaders.headName.exec(ele);
				var size = res[0].length;
				var headName = res.input.substr(0,res.index);
				var headValue = res.input.substr(res.index+size);
				this.rawHeader[headName] = headValue ;
				var func = "set"+headName;
				if (func === "setVia"){
					var index = this.Via.push(headValue);	
					this[headName][index-1] = this[func](headValue, ele);
				}else{
					this[headName] = headValue;
					if (this[func]){
						this[headName] = this[func](headValue);	
					}	
				}
			});
			if (!this["Content-Type"]){
				this.message.contentType = null;
			}else{
				this.message.contentType = this["Content-Type"] ;
			}
		}

		setFrom (value){
			parsefromTo.call(this, "from", value);
			return value;
		}

		setTo (value){
			parsefromTo.call(this, "to", value);
			return value;
		}

		"setWWW-Authenticate" (value){
			this.message.authenticate = parserAuthenticate(value);
			/*var ele ={};
		  	var res = value.split(",")
		  	for (var i=0 ; i < res.length ;i++){
		  	var ret = regHeaders.algorithm.exec(res[i]);
		  	var size = ret[0].length;
		  	var headName = ret.input.substr(0,ret.index).replace(" ","");
		  	var headValue = ret.input.substr(ret.index+size).replace(/"/g,"");
		  	ele[headName] = headValue.replace(/"/g,"");
		  	}
		  	this.message.authenticate = ele ;*/
			return value;
		}

		"setProxy-Authenticate" (value){
			this.message.authenticate = parserAuthenticate(value);
			return value;
		}

		"setRecord-Route" (value){
			this.recordRoutes.push(value);
			return value ;
		}

		"setRoute" (value){
			this.routes.push(value);
			return value ;
		}

		setDate (value){
			try{
				this.message.date = new Date(value);
			}
			catch(e){
				this.message.date = value;
			}
			return value;
		}

		"setCall-ID" (value){
			this.message.callId = value ;
			return value ;
			/*this.callIdRaw = value ;
		  	var res = regHeaders.CallId.exec(value);	
		  	if (res){
		  	this.message.callId =res[1]; 
		  	return res[1];

		  	}else{
		  	this.message.callId =value;	
		  	return value;
		  	}*/
		}

		setCSeq (value){
			var res = value.split(" ");
			this.message.cseq = parseInt(res[0],10);
			this.message.method = res[1];
			return value;
		}

		/*setContact (value){
	  		var parseValue = value.replace(regContact,"$1");
	  		console.log(parseValue)
	  		var sp = parseValue.split(";");
	  		var contact = sp.shift();
 	  		var tab = contact.split(":");	
	  		this.message.contact  = tab[0];
	  		this.message.rport = tab[1];
	  		for (var i = 0 ; i < sp.length ;i++){
	  		var res3 = sp[i].split("=");
			//console.log(res3[0] +" : "+  res3[1] );
			this["contact"+res3[0]] = res3[1]; 
			}
			return value; 
		}*/


		setContact (value){
			var regContact = /.*<(sips?:.*)>.*/g;
			//console.log(value)
			var parseValue = regContact.exec(value) ;
			//console.log(parseValue)
			if ( parseValue  ){
				this.message.contact = parseValue[1] ;
			}
			/*if ( parseValue[2] ){
		  	console.log(parseValue[2])
		  	var clean = parseValue[2].replace("^;(.*)","$1")
		  	var sp = clean.split(";");

		  	for (var i = 0 ; i < sp.length ;i++){
		  	var res3 = sp[i].split("=");
		  	console.log(res3[0] +" : "+  res3[1] );
			//this["contact"+res3[0]] = res3[1]; 
			}
			}*/
			return value; 
		}

		setAllow (value){
			if (value ){
				return this.Allow.split(regHeaders.Allow);
			}else{
				return this.Allow;
			}
		}

		setSupported (value){
			if (value ){
				return this.Supported.split(regHeaders.Allow);
			}else{
				return this.Supported;
			}
		}

		setVia (value,raw){
			if (value){
				var res = value.split(regHeaders.Via);
				var obj = {
					line :Array.prototype.shift.call(res),
					raw:raw
				};
				for (var i = 0 ; i< res.length ;i++){
					var tab = res[i].split('=');
					if ( tab ){
						if (tab[0] === "branch"){
							if ( ! this.branch ){
								this.branch = tab[1];
							}
						}
						obj[tab[0]] = tab[1];
					}
				}
				return obj;
			}else{
				return value;
			}
		}
	};
	
				
	/*
 	 *
 	 * CLASS PARSER BODY SIP
 	 *
 	 *
 	 *
 	 */
	var bodySip  = class bodySip {

		constructor(message, body){
			this.message = message ;
			this.message.rawBody = body ;
			this.size = this.message.contentLength;
			if ( this.size !== body.length ){
				throw new Error("BAD SIZE SIP BODY ");
			}
			if (body){
				this.parse(this.message.contentType, body);
			}
		}

		parse (type, body){
			switch (type){
				case "application/sdp":
					this.sdpParser(body);
				break;
				case "application/dtmf-relay":
					this.dtmfParser(body);
				break;
				default:
					this.body = body;
			}
		}
		
		sdpParser (body){
			// Parser SDP
			this.body = body || "" ;
			if ( ! body ){
				this.sdp  = null ; 	
			}else{
				try {
					this.sdp = new stage.io.protocols.sdp(body);
					//console.log(this.sdp)
				}catch(e){
					throw e ;
				}
			}
		}

		dtmfParser (body){
			// Parser DTMF
			this.body = body || "" ;
			if ( ! body ){
				this.dtmf  = null ; 	
			}else{
				// Parser dtmf 
				var obj = {};
				var line = body.split("\n");
				for (var i = 0 ; i< line.length ; i++){
					var res = line[i].split("=");
					obj[res[0].replace(/ |\n|\r/g,"")] = res[1];
				}
				this.dtmf = obj ;
			}
		}
	};


	/*
 	 *
 	 * CLASS REQUEST
 	 *
 	 *
 	 *
 	 */
	var endline = "\r\n";
	var endHeader = "\r\n\r\n";

	var sipRequest  = class sipRequest {

		constructor(transaction, bodyMessage, typeBody){
			this.transaction = transaction;
			this["request-port"] = this.transaction.dialog.sip.serverPort ; 
			
			this.type = "request";
			this.requestLine ={}; 
			this.buildRequestline();

			this.header = {};
			this.buildHeader();

			this.buildBody(bodyMessage || "", typeBody) ;
		}

		buildRequestline (){
			this.requestLine.method = this.transaction.method.toUpperCase();
			this.requestLine.version = this.transaction.dialog.sip.version ;
		}

		getRequestline (uri){
			switch (this.transaction.method){
				case "REGISTER":
					this["request-uri"] = "sip:"+this.transaction.dialog.sip.server ;
					return  this.transaction.method + " "+ this["request-uri"] + " " + this.requestLine.version + endline ;
				case "INVITE":
				case "BYE":
				case "NOTIFY":
				case "INFO":
				case "CANCEL":
				case "ACK":
					this["request-uri"] = this.transaction.dialog["request-uri"]  ;
					return this.transaction.method + " " + this["request-uri"] +" " + this.requestLine.version + endline ;
			}
		}
		
		buildHeader (){
			//FIXE ME RPORT IN VIA PARSER 
			//console.log(this.transaction.dialog.sip.rport)
			
			var rport = this.transaction.dialog.sip.rport ;
			var ip = this.transaction.dialog.sip.publicAddress;

			//if ( rport ){
				//this.header.via  = "Via: "+this.transaction.dialog.sip.version+"/"+this.transaction.dialog.sip.settings.transport+" " +ip+":"+rport+";"+"branch="+this.transaction.branch;
				this.header.via  = "Via: "+this.transaction.dialog.sip.via+";"+"branch="+this.transaction.branch;
			//}else{
				//this.header.via  = "Via: "+this.transaction.dialog.sip.version+"/"+this.transaction.dialog.sip.settings.transport+" " +ip+":"+this["request-port"]+";"+"branch="+this.transaction.branch;	
			//}	
			this.header.cseq = "CSeq: "+this.transaction.dialog.cseq + " " + this.transaction.method;

			this.header.from = "From: " +this.transaction.dialog.from + ";tag="+this.transaction.dialog.tagFrom ;

			var tagTo = this.transaction.dialog.tagTo ? ";tag="+this.transaction.dialog.tagTo : "" ;
			this.header.to = "To: "+ this.transaction.to  + tagTo;

			this.header.callId = "Call-ID: " + this.transaction.dialog.callId;
			this.header.expires = "Expires: " + this.transaction.dialog.expires;
			this.header.maxForward = "Max-Forwards: " + this.transaction.dialog.maxForward;
			this.header.userAgent = "User-Agent: " + this.transaction.dialog.sip.settings.userAgent;

			this.header.contact = "Contact: "+this.transaction.dialog.contact;

			if (  this.transaction.dialog.routes && this.transaction.dialog.routes.length){
				this.header.routes = [];
				for (var i = this.transaction.dialog.routes.length - 1 ; i >= 0 ; i--){
					this.header.routes.push( "Route: "+ this.transaction.dialog.routes[i] ) ; 		
				}
			}
		}

		getHeader (){
			var head = "";
			for (var line in this.header ){
				switch ( stage.typeOf( this.header[line] ) ){
					case "string":
						head+=this.header[line]+endline;
					break;
					case "array":
						for (var i = 0 ; i <  this.header[line].length ; i++){
							head+=this.header[line][i] + endline ;
						}
					break;
				}
			}
			return head ;
		}

		buildBody (body, type){
			this.header.contentLength  = "Content-Length: " + body.length ;
			if (type){
				this.header.contentType  = "Content-Type: " + type ;
			}
			this.body = body || "" ;
		}

		getBody (){
			return this.body ;
		}

		getMessage (){
			//console.log(this.getRequestline() + this.getHeader() + endline + this.getBody())
			//console.log(this.getRequestline() + this.getHeader() + endline + this.getBody())
			return this.rawResponse = this.getRequestline() + this.getHeader() + endline + this.getBody() ;
		}

		send (){
			return this.transaction.send( this.getMessage() );	
		}
	};


	/*
 	 *
 	 * CLASS RESPONSE
 	 *
 	 *
 	 *
 	 */
	var codeMessage = {
		200	:	"OK"
	};

	var sipResponse  = class sipResponse {
	
		constructor(message, code ,messageCode, bodyMessage, typeBody){
			this.message = message ;
			this.transaction = message.transaction;
			this.dialog = message.dialog;
			this.responseLine ={}; 
			this.buildResponseLine(code ,messageCode);
			this.header =[];// message.header.messageHeaders;
			this.buildHeader(message);
			this.buildBody(bodyMessage || "", typeBody) ;
		}

	
		buildHeader (message){
			for ( var head in  message.rawHeader){
				var i = 0 ;
				switch (head){
					case "Allow":
					case "Supported":
						var ptr = "";
						for ( i = 0 ; i< message.header[head].length ; i++){
							if ( i < message.header[head].length - 1 ){
								ptr += message.header[head][i] + ",";
							}else{
								ptr += message.header[head][i] ;
							}
						}
						this.header.push( head + ": "+ptr);
					break;
					case "Via":
						if ( this.responseLine.code == "487"  ) {
							for ( i = 0 ; i < this.dialog[head].length ; i++){
								this.header.push(this.dialog[head][i].raw);	
							}	
						}else{
							for ( i = 0 ; i< message.header[head].length ; i++){
								this.header.push(message.header[head][i].raw);	
							}
						}
					break;
					case "User-Agent" :
						this.header.push( "User-Agent: " + this.transaction.dialog.sip.settings.userAgent);
					break;
					case "Contact":
						/*var rport = this.transaction.dialog.sip.rport ;
						var ip = this.transaction.dialog.sip.publicAddress;
						if ( rport ){
							this.header.push( "Contact: <sip:" +this.transaction.to+"@"+ip+":"+rport+";transport="+this.transaction.dialog.sip.settings.transport.toLowerCase()+">");
						}else{
							this.header.push( "Contact: <sip:" +this.transaction.to+"@"+ip+";transport="+this.transaction.dialog.sip.settings.transport.toLowerCase()+">");
						}*/
						this.header.push( "Contact: "+this.dialog.contact );
					break;
					case "To":
						//console.log(message.header[head] )
						//console.log(this.dialog.sip.displayName )
						var ret = regHeaders.fromToG.exec( message.header[head] ) ;	
						//console.log(ret)
						if ( ret &&  ( ! ret[1] ) ){
							//console.log("traff to")
							message.header[head] = '"'+this.dialog.sip.displayName+'"'+message.header[head] ;	
						}
						//console.log(message.header[head])
						if ( !  message.header[head].match(/;tag=/) ){
							this.header.push(head + ": "+message.header[head]+ ( this.transaction.dialog.tagFrom ? ";tag="+this.transaction.dialog.tagFrom : "" ) );
						}else{
							this.header.push( head + ": "+message.header[head]);	
						}	
					break;
					case "Record-Route":
						for ( i = this.message.dialog.routes.length - 1  ; i >= 0 ; i--){
							this.header.push(head + ": "+ this.message.header.recordRoutes[i]);	
						}
					break;
					case "CSeq":
						if ( this.responseLine.code == "487" && this.dialog.method === "CANCEL"){
							this.header.push( head + ": "+message.header[head].replace("CANCEL", "INVITE"));	
						}else{
							this.header.push( head + ": "+message.header[head]);
						}
					break;
					case "Content-Type": 
					case "Organization": 
					case "Server": 
					case "Content-Length":
					break;
					default :
						this.header.push( head + ": "+message.header[head]);
				}
			}
		}
		
		getHeader (){
			var head = "";
			for (var line in this.header ){
				head+=this.header[line]+endline;
			}
			return head ;
		}

		buildBody (body, type){
			this.header.contentLength  = "Content-Length: " + body.length ;
			if (type){
				this.header.contentType  = "Content-Type: " + type ;
			}
			this.body = body || "" ;
		}

		getBody (){
			return this.body ;
		}

		buildResponseLine (code, messageCode){
			this.responseLine.method = this.transaction.method.toUpperCase();
			this.responseLine.version = this.transaction.dialog.sip.version ;
			this.responseLine.code = code ;
			this.responseLine.message = messageCode || codeMessage[code] ;
		}

		getResponseline (){
			if (this.responseLine.method == "ACK"){
				return 	this.responseLine.method +" "+ "sip:"+this.transaction.from+"@"+this.transaction.dialog.sip.server +" "+this.responseLine.version + endline ;		
			}
			return  this.responseLine.version + " " + this.responseLine.code + " " + this.responseLine.message +  endline ;	
		}

		getMessage (){
			//console.log("RESPONSE : " +this.getResponseline() + this.getHeader() + endline + this.getBody())
			return this.rawResponse = this.getResponseline() + this.getHeader() + endline + this.getBody() ;
		}

		send (){
			return this.transaction.send( this.getMessage() );	
		}
	};


	/*
 	 *
 	 * CLASS TRANSACTION
 	 *
 	 *
 	 */
	var generateHex = function(){
		return Math.floor(Math.random()*167772150000000).toString(16) ;
	};

	const Transaction  = class Transaction {

		constructor(to, dialog){
			this.dialog = dialog ;	
			if ( to instanceof Message){
				this.hydrate(to);
			}else{
				this.to = to ;
				this.from = dialog.from ;
				this.method = dialog.method;
				this.branch = this.generateBranchId() ;
			}
			this.responses = {};
			this.requests = {};	
			this.interval = null;
		}

		hydrate (message){
			this.message = message;
			if ( message.type === "REQUEST" ){
				this.to = this.dialog.to;
				this.from = this.dialog.from;
				this.method = this.dialog.method;
				this.branch = this.message.header.branch;	 
			}
			if ( message.type === "RESPONSE" ){
				this.to = this.dialog.to;
				this.from = this.dialog.from;
				this.method = this.dialog.method;
				this.branch = this.message.header.branch;
			}
		}
		
		generateBranchId (){
			var hex = generateHex();
			if ( hex.length === 12 ){
				return "z9hG4bK"+hex;
			}else{
				return this.generateBranchId() ;
			}
		}

		createRequest (body, typeBody){
			if (this.method != "ACK" && this.method != "CANCEL" ){
				this.dialog.incCseq();
			}
			this.request = new sipRequest(this, body || "", typeBody);
			this.message = null;
			return this.request ;
		}

		createResponse (code ,message, body, typeBody){
			if (this.method === "INVITE" || this.method === "ACK" ){
				switch ( true ){
					case code < 200 : 
						this.dialog.status = this.dialog.statusCode.EARLY ; 
					break;
					case code < 300 :
						this.dialog.status = this.dialog.statusCode.ESTABLISHED ;
					break;
					default:
						this.dialog.status = this.dialog.statusCode.TERMINATED ;	
				}
			}
			this.response = new sipResponse(this.message, code, message, body , typeBody );
			return this.response ;
		}

		send (message){
			return this.dialog.sip.send( message );
		}

		cancel (){
			this.method = "CANCEL";
			this.dialog.routes = null ;
			this.dialog.tagTo = "" ;
			var request = this.createRequest();
			request.send();
			this.dialog.status = this.dialog.statusCode.CANCEL ;
			return request ;
		}

		decline (){
			var ret = this.createResponse(
				603,
				"Declined"	
			);
			ret.send();
			return ret ;
		}

		clear (){
			// CLEAR INTERVAL	
			if (this.interval){
				clearInterval(this.interval);
			}
		}
	};

	/*
 	 *
 	 * CLASS DIALOG
 	 *
 	 */
	var statusCode = {
		INITIAL:	0,
		EARLY:		1,	// on 1xx
		ESTABLISHED:	2,	// on 200 ok
		TERMINATED:	3,	// on by	
		CANCEL:		4	// cancel
	};

	const Dialog  = class Dialog {

		constructor(method, sip){
			this.sip = sip;
			this.transactions = {};
			this.statusCode = statusCode ;
			this.status = this.statusCode.INITIAL ;
			this.routes = null ;
			this.from = this.sip.from;
			this.maxForward = this.sip.settings.maxForward;
 			this.expires = this.sip.settings.expires;
			this.tagFrom = this.generateTag() ;
			this.cseq = this.generateCseq();
			if (method instanceof Message ){
				this.hydrate( method );
			}else{
			
				this.method = method;
			
				this.callId = this.generateCallId(); 
				this.status = this.statusCode.INITIAL ;
			 	
				this.to = null ;
				this.tagTo = null ; 
				
			}
			//this.contact = this.sip.generateContact( null, null, true) ;
			this.contact = this.sip.contact;
		}
	
		hydrate (message){

			if ( message.type === "REQUEST" ){
				this.cseq = message.cseq; 
				this.method = message.method ;
				this.callId = message.callId;

				// to
				if ( message.fromNameDisplay ){
					this.to = '"'+message.fromNameDisplay+'"' + "<sip:"+message.from+">" ;
				}else{
					this.to = "<sip:"+message.from+">" ;	
				}
				this.toName = message.fromName;
				this.tagTo = message.fromTag || this.generateTag() ; 
				//from
				this.tagFrom = message.toTag || this.tagFrom;
 		        	if (message.toNameDisplay){
					this.from ='"'+message.toNameDisplay+'"' + '<sip:'+message.to+'>';
				}else{
					this.from = "<sip:"+message.to+">";
				}	
				this.fromName= message.toName; 


				// manage routes
				if ( message.header.recordRoutes.length ){
					this.routes = message.header.recordRoutes.reverse();  	
				}

				// FIXME if (  ! this["request-uri"] &&  message.contact ) 
				if (  message.contact ){
					//this["request-uri"] =  message.contact + ":" + message.rport
					this["request-uri"] =  message.contact ;
				}

			}
			if ( message.type === "RESPONSE" ){
				this.cseq = message.cseq;
				if ( !  this.callId ){
					this.callId = message.callId;
				}
				if ( !  this.to ){
					if ( message.toNameDisplay ){
						this.to =  '"'+message.toNameDisplay+'"' + "<sip:"+message.to+">" ;
					}else{
						this.to =  "<sip:"+message.to+">" ;
					}
				}else{
					if ( message.toNameDisplay ){
						this.to =  '"'+message.toNameDisplay+'"' + "<sip:"+message.to+">" ;
					}
				}

				if ( message.toTag ){
					this.tagTo = message.toTag ;	
				}
				if ( message.fromTag ){
					this.tagFrom = message.fromTag ;	
				}
				// FIXME if (  ! this["request-uri"] &&  message.contact ) 
				if (  message.contact ){
					//this["request-uri"] =  message.contact + ":" + message.rport
					this["request-uri"] =  message.contact ;
				}

				// manage routes
				if ( message.header.recordRoutes.length ){
					this.routes = message.header.recordRoutes ;	
				}
			}
		}

		generateCallId (){
			return parseInt(Math.random()*1000000000,10);
		}

		generateTag (){
			return "nodefony"+parseInt(Math.random()*1000000000,10);
		}

		generateCseq (){
			return 1;
		}

		incCseq (){
			this.cseq = this.cseq + 1 ;
			return this.cseq ;
		}

		getTransaction (id){
			if ( id in this.transactions ){
				return this.transactions[id] ;
			}
			return null ;	
		}

		createTransaction (to){
			this.currentTransaction = new Transaction( to || this.to , this);
			console.log("SIP NEW TRANSACTION :" + this.currentTransaction.branch);
			this.transactions[this.currentTransaction.branch] = this.currentTransaction;
			return this.currentTransaction;	
		}

		register (){
			var trans = this.createTransaction(this.from);
			this.to = this.from ;
			var request = trans.createRequest();
			request.send();
			return trans;

		}

		unregister (){
			this.expires = 0 ;
			this.contact = "*" ;
			var trans = this.createTransaction(this.from);
			this.to = this.from ;
			var request = trans.createRequest();
			request.send();
			return trans;		
		}

		ack (message){
			if ( ! this["request-uri"] ){
				this["request-uri"] = this.sip["request-uri"] ;
			}
			//this.method = "ACK" ;
			var trans = this.createTransaction();	
			trans.method = "ACK" ;
			var request = trans.createRequest();
			request.send();
			return request ;
		}

		invite (userTo, description, type){

			if ( this.status  === this.statusCode.CANCEL ){
				return null ;
			}
			console.log("SIP INVITE DIALOG");
			if ( userTo ){
				this.to = "<sip:"+userTo+">" ;
			}
			this.method = "INVITE" ;
			if ( ! this["request-uri"] ){
				this["request-uri"] = "sip:"+userTo ;
			}

			if ( description.sdp ){
				this.bodyType = "application/sdp" ;
				this.body = description.sdp ;
			}else{
				this.bodyType = type ;
				this.body = description ;
			}
			var trans = this.createTransaction(this.to);
			var request = trans.createRequest(this.body, this.bodyType);
			request.send();
			return trans;

		}

		notify (userTo, notify, typeNotify){
			this.method = "NOTIFY" ;	
			if ( userTo ){
				this.to = "<sip:"+userTo+">" ;
			}
			if ( ! this["request-uri"] ){
				this["request-uri"] = "sip:"+userTo ;
			}
			if (typeNotify){
				this.bodyType = typeNotify ;
			}
			if ( notify ){
				this.body = notify ;
			}
			var trans = this.createTransaction(this.to);
			var request = trans.createRequest(this.body, this.bodyType);
			request.send();
			return this;

		}

		info ( info, typeInfo){
			this.method = "INFO" ;	

			if (typeInfo){
				this.bodyType = typeInfo ;
			}
			if ( info ){
				this.body = info ;
			}
			var trans = this.createTransaction(this.to);
			var request = trans.createRequest(this.body, this.bodyType);
			request.send();
			return this;

		}

		bye (){
			this.method = "BYE" ;
			var trans = this.createTransaction();
			var request = trans.createRequest();
			request.send();
			return this;

		}

		clear (id){
			if ( id ){
				if (this.transactions[id]){
					this.transactions[id].clear();
				}else{
					throw new Error("TRANSACTION not found :" + id);
				}
			}else{
				for ( var transac in this.transactions ){
					this.transactions[transac].clear();	
				}	
			}
		}
	};
	


	/*
 	 *
 	 *	MESSAGE SIP 
 	 *
 	 *
 	 */ 
	var firstline = function(firstLine){
		var method = firstLine[0];	
		var code = firstLine[1];
		if ( method === "BYE" && ! code){
			code = 200 ;
		}
		var message = "";
		for (var i = 2 ;i<firstLine.length;i++){
			message+=firstLine[i]+" ";	
		}
		return {
			method : method,
			code : code,
			message : message
		};	
	};

	var regSIP = /\r\n\r\n/ ;
	var Message  = class Message {

		constructor(message, sip){	
			this.sip = sip ;
			if (message){
				this.rawMessage = message ;
				this.header = null;
				this.body = null;
				this.statusLine = null;
				this.contentLength = 0 ;
				this.code = null ;
				this.statusLine = "" ;	
				this.split = message.split( regSIP );
				if (this.split.length && this.split.length <= 2){ 
					try {
						this.parseHeader();
						this.contentLength = parseInt(this.header["Content-Length"], 10) ;
						this.parseBody();	
						this.statusLine =firstline(this.header.firstLine); 
						this.code = parseInt( this.statusLine.code, 10);
						this.getType(); 
					}catch(e){
						throw e;
					}

					this.rawHeader = this.header.rawHeader ;
					//console.log(this.rawHeader)
				}
				this.getDialog();
				this.getTransaction();

			}else{
				throw new Error( "BAD FORMAT MESSAGE SIP no message" , 500);
			}
		}

		getType ( ){
			if ( this.code ){
				if ( ( typeof this.code ) === "number" &&  ! isNaN (this.code) ){
					this.type = "RESPONSE" ;
				}else{
					throw new Error("BAD FORMAT MESSAGE SIP message code   ") ;	
				}
			}else{
				if ( this.method ){
					this.type = "REQUEST" ;
				}else{
					this.type = null ;
					throw new Error("BAD FORMAT MESSAGE SIP message type not defined  ") ;
				}
			}
		}

		parseBody ( ){
			if ( this.split[1] ){
				this.body = new bodySip(this, this.split[1]);
			}else{
				this.body = new bodySip(this, ""); 
			}
		}

		parseHeader ( ){
			if ( this.split[0] ){
				this.header = new headerSip(this, this.split[0]);
			}else{
				throw ("BAD FORMAT MESSAGE SIP no header ", 500);
			}	
		}

		getContact (){
			return this.contact;
		}

		getHeader (){
			return this.header;
		}

		getBody (){
			return this.body;
		}

		getStatusLine (){
			return this.statusLine;
		}

		getCode (){
			return this.code ;
		}

		getDialog (){
			if (  this.header["Call-ID"] ){
				this.dialog = this.sip.getDialog( this.header["Call-ID"] ) ;
				if ( ! this.dialog ){
					this.dialog = this.sip.createDialog(this);
				}else{
					console.log("SIP HYDRATE DIALOG :" + this.dialog.callId);
					this.dialog.hydrate(this);	
				}
				return this.dialog ;
			} else{
				throw new Error("BAD FORMAT SIP MESSAGE no Call-ID" , 500);
			}
		}

		getTransaction (){
			if ( this.header.branch ){
				if ( ! this.dialog ){
					this.getDialog();
				}
				if ( this.dialog ){
					this.transaction = this.dialog.getTransaction( this.header.branch ) ;
					if ( ! this.transaction ){
						this.transaction = this.dialog.createTransaction(this);	
					}else{
						console.log("SIP HYDRATE TRANSACTION :" + this.transaction.branch);
						this.transaction.hydrate(this);	
					}
				}else{
					this.transaction = null ;
				}
				return this.transaction ;
			}else{
				// TODO CSEQ mandatory
				console.log( this.rawMessage );
				throw new Error("BAD FORMAT SIP MESSAGE no Branch" , 500);
			}	
		}
	};

	/*
 	 *
 	 *
 	 *	CLASS SIP 
 	 *
 	 *
 	 */
	// entry point response transport
	var onMessage = function(response){
		
		console.log("RECIEVE SIP MESSAGE ");	
		console.log(response);	

		var message = null ;
		var res = null ;
		try {
			//console.log(this.fragment)
			if ( this.fragment ){
				this.lastResponse += response;
				//console.log(this.lastResponse);
			}else{
				this.lastResponse = response ;
			}
			message = new Message(this.lastResponse, this);
			this.fragment = false ;
		}catch(e){
			console.log(e);
			// bad split 
			for ( var i = 0 ; i < e.length ; i++){
				if ( e[i] ){
					try {
						onMessage.call(this, e[i]);			
						continue;
					}catch(e){
						//console.log("FRAGMENTE")
						this.fragment = true ;	
						return ;		
					}
				}
			}	
			return ;
		}
		this.fire("onMessage", message.rawMessage);	
		//console.log( message.type + " : " + response);
		
		switch (message.method){
			case "REGISTER" :
				this.rport = message.header.Via[0].rport;
				if (this.rport ){
					this["request-uri"] =  "sip:"+this.userName+"@"+this.publicAddress+":"+ this.rport +";transport="+this.transportType;	
				}
				var transaction = null ;
				switch ( message.code ){
					case 401 :
					case 407 :
						if (this.registered === 200 ) {
							if ( this.registerInterval ){
								clearInterval(this.registerInterval);
							}
							this.registerInterval = null ;	
						}else{
							
							if ( this.registered === 401 || this.registered === 407){
								if ( this.registerInterval ){
									clearInterval(this.registerInterval);
								}
								this.registerInterval = null ;	
								this.registered = null;
								this.notificationsCenter.fire("onError", this, message);
								break; 
							}
							this.registered = message.code ;
						}

						delete this.authenticate ;
						this.authenticate = null;	
						this.authenticate = new authenticate(message.dialog, this.userName , this.settings.password) ;
						transaction = this.authenticate.register(message, message.code === 407 ? "proxy" : null);
						
					break;	
					case 403 :
						this.registered = message.code ;
						//console.log("Forbidden (bad auth)")
						delete this.authenticate ;
						this.authenticate = null;
						this.notificationsCenter.fire("onError", this, message);
					break;	
					case 404 :
						this.registered = message.code ;
						delete this.authenticate ;
						this.authenticate = null;
						this.notificationsCenter.fire("onError", this, message);
					break;
					case 200 :
						if ( this.registerInterval ){
							clearInterval( this.registerInterval );	
						}
						if ( ! message.contact ){
							this.registered = "404" ;
							this.notificationsCenter.fire("onUnRegister",this, message);
							return ;
						}
						if (this.registered === 401 || this.registered === null ) {
							this.notificationsCenter.fire("onRegister", this, message);
						}
						this.registered = message.code ;
						this.registerInterval = setInterval(() => {
							this.register(this.userName, this.settings.password);
						} ,  this.settings.expires * 900  );
					break;
					default:
						this.registered = message.code ;
						delete this.authenticate ;
						this.authenticate = null;
						//console.log(message);
						this.notificationsCenter.fire("on"+message.code, this, message);
					break;
				}
			break;
			case "INVITE" :
				//this.rport = message.rport || this.rport;

				switch ( message.type ){
					case "REQUEST":
						if ( message.dialog.status === message.dialog.statusCode.INITIAL ){
							this.fire("onInitCall", message.dialog.toName, message.dialog, message.transaction);
							if ( message.header.Via ){
								message.dialog.Via = message.header.Via ;	
							}
							this.notificationsCenter.fire("onInvite", message, message.dialog);
						}else{
							//console.log(message.dialog.statusCode[message.dialog.status])
							if ( message.dialog.status === message.dialog.statusCode.ESTABLISHED ){
								this.notificationsCenter.fire("onInvite", message, message.dialog);
							}else{
								var ret = message.transaction.createResponse(200, "OK");
								ret.send();
							}
						}
					break;
					case "RESPONSE":
						if ( message.code >= 200 ){
							message.dialog.ack(message);	
						}
						switch(message.code){
							case 407 :
							case 401 :
								delete this.authenticate ;
								this.authenticate = null;
								this.authenticate = new authenticate(message.dialog, this.userName , this.settings.password) ;
								transaction = this.authenticate.register(message, message.code === 407 ? "proxy" : null);
								this.fire("onInitCall", message.dialog.toName, message.dialog, transaction);
							break;
							case 180 : 
								this.notificationsCenter.fire("onRinging",this, message);
								message.dialog.status = message.dialog.statusCode.EARLY ;
							break;
							case 100 : 
								this.notificationsCenter.fire("onTrying",this, message);
								message.dialog.status = message.dialog.statusCode.EARLY ;
							break;
							case 200 :
								this.notificationsCenter.fire("onCall",message);
								message.dialog.status = message.dialog.statusCode.ESTABLISHED ;
							break;
							case 486 : 
							case 603 : 
								this.notificationsCenter.fire("onDecline", message);
							break;
							case 403 :
								this.authenticate = false;
								this.notificationsCenter.fire("onError", this, message);
							break;
							case 487 :
								// ACK !!
							break;
							case 404 :
							case 477 :
							case 480 :
							case 484 :
							case 488 :
								this.notificationsCenter.fire("onError",this, message);
							break;
							case 408 :
								this.notificationsCenter.fire("onTimeout",this, message);
							break;
							case 500 :
								this.notificationsCenter.fire("onError",this, message);
							break;
							default:
								this.notificationsCenter.fire("on"+message.code, this, message);
							break;
						}
					break;
					default:
						// error BAD FORMAT
				}
			break;
			case "ACK" :
				//console.log("ACK");
				//TODO manage interval messages timer retransmission 
			break;
			case "BYE" :
				switch(message.code){
					case 200 :
						//console.log("200")
						this.notificationsCenter.fire("onBye",message);
					break;
					default :
						this.notificationsCenter.fire("onBye",message);
						if ( message.type === "REQUEST" ){
                                                        res = message.transaction.createResponse(200,"OK");
                                                        res.send();
                                                }
				}
			break;
			case "INFO" :
				switch ( message.type ){
					case "REQUEST":
						//console.log("SIP   :"+ message.method + " "+" type: "+message.contentType );
						this.notificationsCenter.fire("onInfo",message);	
						res = message.transaction.createResponse(200, "OK");
						res.send();
					break;
					case "RESPONSE":
						//console.log("SIP   :"+ message.method + " "+" code:"+message.code );
						this.notificationsCenter.fire("onDrop",message);
					break;
				}
			break;

			case "CANCEL" :
				switch ( message.type ){
					case "REQUEST":
						this.notificationsCenter.fire("onCancel",message);
						res = message.transaction.createResponse(200, "OK");
						res.send();
						message.dialog.status = message.dialog.statusCode.CANCEL ;
						res = message.transaction.createResponse(487, "Request Terminated");
						res.send();
						message.dialog.status = message.dialog.statusCode.TERMINATED  ;

					break;
					case "RESPONSE":
						
						this.notificationsCenter.fire("onDrop",message);
					break;
				}
			break;
			case "REFER":
				console.log("SIP REFER NOT ALLOWED :"+ message.method );
				this.notificationsCenter.fire("onDrop",message);	
			break;
			default:
				console.log("SIP DROP :"+ message.method + " "+" code:"+message.code );
				this.notificationsCenter.fire("onDrop",message);
				// TODO RESPONSE WITH METHOD NOT ALLOWED 
		}
	};

	var onStart = function(){
		this.fire("onStart",this);
	};

	var onStop = function(){
		this.stop();	
	};

	var defaultSettings = {
		expires		: 200,		// en secondes
		maxForward	: 70,
		version		: "SIP/2.0",
		userAgent	: "nodefony",
	 	portServer	: "5060",
	 	userName	: "userName",		
		displayName	: "",
	 	pwd		: "password",
		transport	: "TCP"
	};
		

	// CLASS
	const SIP  = class SIP {

		constructor(server, transport, settings){
			this.settings = stage.extend({}, defaultSettings, settings);
			//this.settings.url = stage.io.urlToOject(url)
			this.notificationsCenter = stage.notificationsCenter.create(this.settings, this);
			this.dialogs = {};
			this.version = this.settings.version;

			//
			this.server = server ;
			this.serverPort = this.settings.portServer;

			this.authenticate = false;

			// REGISTER
			this.registerInterval = null;
			this.registered = null ;

			// TRANSPORT
			this.transport = transport ;
			if ( this.transport ){
				this.initTransport();
			}
			this.transportType = this.settings.transport.toLowerCase() ;

			this.contact = null ;
			this.via = null ;
			// IDENTIFIANT
			//  USER
			//this.userName = this.settings.userName ;
			//this.from = "<sip:"+this.userName+"@"+this.publicAddress+">" ; 
			//this.contact = this.generateContact();
			//this["request-uri"] =  "sip:"+this.userName+"@"+this.publicAddress+";transport="+this.transportType ;	
		}

		generateInvalid (){
			return parseInt(Math.random()*1000000000,10)+".nodefony.invalid" ;
		}

		generateVia (addr){
			if ( this.rport ){
				return  this.version+"/"+this.settings.transport+" " +addr+";rport" ;
			}else{
				return  this.version+"/"+this.settings.transport+" " +addr ;
			}
		}

		generateContact ( userName, password , force, settings){
			if ( userName ) {
				this.userName = userName  ;
				if ( settings && settings.displayName ){
					this.displayName = settings.displayName ; 
				}else{
					this.displayName = userName ;
				}
				this.from = '"'+this.displayName+'"'+'<sip:'+this.userName+'@'+this.publicAddress+'>' ;
				this["request-uri"] =  "sip:"+this.userName+"@"+this.publicAddress+";transport="+this.transportType ;
				if ( password ){
					this.settings.password = password ;
				}
			}

			if ( ! this.contact  || force ){
				var invalid = null ;
				switch ( this.transportType ){
					case "ws":
					case "wss":
						invalid = this.generateInvalid() ;
						this.via = this.generateVia(invalid);
						if ( this.rport ){
							return  '"'+this.displayName+'"'+"<sip:"+this.userName+"@"+ invalid +":"+ this.rport +";transport="+this.transportType+">" ;
						}else{
							return  '"'+this.displayName+'"'+"<sip:"+this.userName+"@"+ invalid +";transport="+this.transportType+">" ; 
						}
						break;
					case "tcp" :
					case "udp" :
						invalid = this.generateInvalid() ;
						this.via = this.generateVia(invalid);
						//this.via = this.generateVia(this.publicAddress);
						if ( this.rport ){
							return  '"'+this.displayName+'"'+"<sip:"+this.userName+"@"+invalid+":"+this.rport+";transport="+this.transportType+">" ;
						}else{
							return  '"'+this.displayName+'"'+"<sip:"+this.userName+"@"+invalid+";transport="+this.transportType+">" ;
						}
						break;
					default :
						throw new Error("SIP TRANSPORT TYPE NOT ALLOWED") ;
				}
			}
			return this.contact ;
		}

		getDialog (id){
			if ( id in this.dialogs ){
				return this.dialogs[id] ;
			}
			return null ;	
		}

		initTransport (transport){
			if ( transport ){
				this.transport = transport ; 
			}

			// GET REMOTE IP
			if (this.transport.publicAddress){
				this.publicAddress = this.transport.domain.hostname ;	
				this.publicAddress = this.server ;
			}else{
				this.publicAddress = this.server ;	
			}

			switch(this.settings.transport) {
				// realtime nodefony
				case "TCP" :
				case "UDP" :
					this.transport.listen(this, "onSubscribe", function(service, message){
						if (service === "SIP" || service === "OPENSIP"){
							onStart.call(this, message);
						}
					} );

					this.transport.listen(this, "onUnsubscribe", function(service, message){
						if (service === "SIP" || service === "OPENSIP"){
							onStop.call(this, message);
						}
					} );
					this.transport.listen(this, "onMessage", function(service, message){
						if (service === "SIP" || service === "OPENSIP"){
							onMessage.call(this, message);
						}
					} );

					this.transport.listen(this, "onClose", function( message){
						this.quit(message);
					} );
					break;
				case "WS":
				case "WSS":
					this.transport.listen(this, "onMessage",  function( message){
						//this.notificationsCenter.fire("onMessage",message.data);
						onMessage.call(this, message.data);
					});
					this.transport.listen(this, "onError",function( message ){
						this.notificationsCenter.fire("onError", this.transport, message);
					});
					this.transport.listen(this, "onConnect", function(message){
						this.connect(message);
					});
					this.transport.listen(this, "onClose", function( message){
						this.quit(message);
					} );
					break;
				default :
					this.fire("onError", new Error("TRANSPORT LAYER NOT DEFINED") ) ;
			}
		}

		clear (){
			if ( this.registerInterval  ){
				clearInterval(this.registerInterval);
			}
			//TODO
			//clean all setinterval	
			for (var dia in this.dialogs){
				this.dialogs[dia].clear();	
			}
		}

		quit (message){
			this.fire("onQuit",this, message);
			this.unregister();
			this.clear();
		}

		connect (message){
			this.fire("onConnect",this, message);
		}

		listen (){
			return this.notificationsCenter.listen.apply(this.notificationsCenter, arguments);
		}

		fire (){
			return this.notificationsCenter.fire.apply(this.notificationsCenter, arguments);
		}

		createDialog (method){
			var dialog = new Dialog( method , this);
			console.log("SIP NEW DIALOG :" + dialog.callId);
			this.dialogs[dialog.callId] = dialog;
			return dialog ;
		}

		register (userName, password, settings){
			console.log("TRY TO REGISTER SIP : " + userName + password);
			this.contact = this.generateContact(userName, password, false, settings);
			this.diagRegister = this.createDialog("REGISTER");
			this.diagRegister.register();
			return this.diagRegister;
		}

		unregister (){
			var diagRegister = this.createDialog("REGISTER");
			diagRegister.unregister();
			return diagRegister;
		}

		invite (userTo, description){
			var diagInv = this.createDialog("INVITE");
			var transaction = diagInv.invite( userTo+"@"+this.publicAddress , description);
			diagInv.toName = userTo ;
			this.fire("onInitCall", userTo ,diagInv, transaction);
			return diagInv; 
		}

		notify (userTo, description, type){
			var diagNotify = this.createDialog("NOTIFY");
			diagNotify.notify( userTo+"@"+this.publicAddress , description, type);
			return diagNotify; 
		}

		send (data){
			console.log("SIP SEND : " +data);
				this.fire("onSend", data) ;
			this.transport.send( data );
		}

		bye (callId){
			for ( var dialog in this.dialogs ){
				if (   callId ){
					if ( this.dialogs[dialog].callId === callId && this.dialogs[dialog].method !== "REGISTER" && this.dialogs[dialog].status === this.dialogs[dialog].statusCode.ESTABLISHED   ){
						this.dialogs[dialog].bye();
						break ;
					}
				}else{
					this.dialogs[dialog].bye();
				}
			}
		}
	};

	stage.io.protocols.sip = SIP ;	
	return SIP ;
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {module.exports =  function(stage){
 
	'use strict';

	var defaultSettings = {
	
	};

	var settingsSyslog = {
		moduleName:"REALTIME",
		defaultSeverity:"INFO"
	};

	var send = function(data){
		this.protocol.send(data)	
	};


	var realtime = class realtime  {

		constructor(urlServer, settings){
			if (! urlServer){
				throw new Error("realtime url server is not defined");
			}
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
				setTimeout(() => {
					this.start();
				}, 60000)
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
		}

		listen (){
			return 	this.notificationCenter.listen.apply(this.notificationCenter, arguments);
		}

		unListen (){
			return 	this.notificationCenter.unListen.apply(this.notificationCenter, arguments);
		}

		start (){
			if ( this.connected ){
				//throw new Error("connection already started");
				this.notificationCenter.fire("onError", 500, this, "connection already started");
				return false;
			}
			var statusCode  = {
				
                		401: (request, type, message) => {
					var auth = request.getResponseHeader("WWW-Authenticate");
					var res = request.responseText;
					var obj =  {
						"WWW-Authenticate":request.getResponseHeader("WWW-Authenticate"),
						body:request.responseText
					}
					this.authenticate = new stage.io.authentication.authenticate(this.url, obj, {
						ajax:true,
						onSuccess:(data, type, xhr) => {
							this.notificationCenter.fire('onAuthorized',data, type, xhr);
						},
						onError:(obj, type, message) => {
							var res = stage.io.getHeaderJSON(obj);
							if (res){
								this.notificationCenter.fire('onError',401, obj, res)	
							}else{
								this.notificationCenter.fire('onError',401, obj, message)
							}
						}
					});
					this.notificationCenter.fire('onUnauthorized', this.authenticate , this);
                		},
				404:(obj, type, message) => {
					// '404 - realtimeD server not available'
					this.notificationCenter.fire('onError',404, obj, message );	
				},
                		503: (obj, type, message) => {
					//  '503 - Service Unavailable'
			    		this.notificationCenter.fire('onError',503, obj, message);
                		}   
            		};

			return $.ajax({
            			method: 'GET',
		        	cache:false,
            			url: this.url.href ,
            			statusCode:statusCode,
		        	success:(data, type, xhr) => {
					this.notificationCenter.fire('onAuthorized',data, type, xhr);
				},
            			error: (obj, type, message) => {
					if (obj.status in statusCode )
						return ;
					this.notificationCenter.fire('onError', obj.status, obj, message);
            			}
        		});
		}

		subscribe (name, data){
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
		}

		unSubscribe (name, data){
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
		}

		sendMessage (service , data){
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
		}

		stop (){
			if (  this.connected ){
				this.protocol.stopReConnect();
				for(var service in this.subscribedService ){
					//this.unSubscribe(service);
					delete this.subscribedService[service];
				}
				return send.call(this, this.protocol.disconnect() );
			}
			throw new Error("connection already stoped");
		}

		onMessage (message){
			if (message.error){
				if (message.channel){
					this.notificationCenter.fire("onError", message.error);
				}else{
					this.notificationCenter.fire("onError",message.id, message.successful );		
				}
			}else{
				if (message.channel){
					this.notificationCenter.fire("onMessage", message.channel.split("/")[2], message.data);
				}else{
					this.notificationCenter.fire("onMessage",message.id, message.successful);
				}
			}
		}
	};

	stage.realtime = realtime ;
	return realtime ;
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {module.exports =  function(stage){


	var defaultSettings = {
		delay: 0,
		async: false,
		
		ajax: {
			cache: true,
			dataType: 'json',
			type: 'GET',
			contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
		}
	};
	
	var pollAction = function(ajaxConfig){
		ajaxConfig.data = this.data.get();
		this.transport = jQuery.ajax(ajaxConfig);
	};
	
	var pollling = function(ajaxConfig){
		
		if(this.settings.delay){
			this.timer = setTimeout(pollAction.bind(this, ajaxConfig), this.settings.delay);	
		} else {
			pollAction.call(this, ajaxConfig);
		}		
	};
	
	/*
 	 *
 	 *
 	 */
	var longPoll = class longPoll extends stage.io.transports.poll  {

		constructor(url, settings){
			super(url, settings);
			this.settings = stage.extend(true, {}, defaultSettings, settings);
		}

		start (){
			var ajaxConfig = this.buildAjaxSettings();
			this.transport = null;
			ajaxConfig.complete = (xhr, status) => {
				pollling.call(this, ajaxConfig);
			};
			pollling.call(this, ajaxConfig);
			return this;
		}

		stop (){
			this.transport.abort();
			this.transport = null;

			if(this.timer){
				clearTimeout(this.timer);
			}
			this.connectState = false;
			this.fire('onStop', this);
			return this;
		}
	}

	stage.io.transports.longPoll = longPoll ;
	return longPoll;
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {module.exports =  function(stage){

	var defaultSettings = {
		delay: 1000,
		async : true,
		
		ajax: {
			cache: true,
			dataType: 'json',
			type: 'GET',
			contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
		}
	};

	var pollling = function(ajaxConfig){
		
		var tokenKey = (new Date()).getTime();
		ajaxConfig.data = this.data.get();
		var transport = jQuery.ajax(ajaxConfig);
		transport.tokenKey = tokenKey;
		this.transport[tokenKey] = transport;
	};
	
	/*
 	 *
 	 */
	var httpData = class httpData  {
		constructor(contentType, method){
			this.reset();
			if(contentType) {
				this.contentType = contentType;
			}
			if(method) {
				this.method = method;
			}
		}

		add (data, permanent){
			this[permanent ? "permanent" : "transient"] = data;
		}

		get (){

	    		var data = (this.transient ? this.transient : this.permanent);
	    		this.transient = '';
        		//return this.contentType.search('json') >= 0 && typeof(data) == 'object' && this.method.toUpperCase() != 'GET' ? JSON.stringify(data) : data;
	    		switch(this.contentType.split(';')[0].replace(/ /g, '')){
	    			case 'application/json':
	    			case 'text/json':
	    				if(this.method.toUpperCase() != 'GET' && typeof(data) == 'object'){
	    					data = JSON.stringify(data);
	    				} 
	    				break;
	    		}

	    		return data;
		}

		reset (){
	    		this.contentType = '';
	    		this.method = 'GET';
			this.permanent = '';
			this.transient = '';
		}

	};

	/*
	 *	EVENT :
	 *		onStart
	 *		onStop
	 *		onMessage
	 *		onError 
	 */
	var poll = class poll extends stage.io.transport  {

		constructor(url, settings){
			super(url, settings);
			this.settings = jQuery.extend(true, {}, defaultSettings, settings);
			this.data = new httpData(this.settings.ajax.contentType, this.settings.ajax.type);
			this.connectState = false;	
		}

		buildAjaxSettings (){

			var settings = jQuery.extend(true, {}, this.settings.ajax,{
				url: this.url.href,
			    crossDomain: this.crossDomain,
			    beforeSend: function(xhr){
				    if ( ! this.connectState){
					    this.fire.call(this, "onStart", this);
					    this.connectState = true;
				    }
			    }.bind(this),
			    success: function(data, state, xhr){
				    this.fire("onMessage", data , this, xhr);
			    }.bind(this),
			    error: function(xhr, status, error){
				    switch(status){
					    case 'abort':
						    this.fire("onAbort", error, this, xhr);	
						    break;

					    case 'timeout':
						    this.fire("onTimeout", error, this, xhr);	
						    break;

					    default:
						    this.fire("onError", error, this, xhr);
				    }
			    }.bind(this)
			});
			return settings;
		}

		start (){

			var ajaxConfig = this.buildAjaxSettings();

			this.transport = {};
			ajaxConfig.complete = function(xhr, status){
				if(this.transport[xhr.tokenKey]) delete this.transport[xhr.tokenKey];
			}.bind(this);
			pollling.call(this, ajaxConfig);
			this.idInterval = setInterval(pollling.bind(this, ajaxConfig), this.settings.delay);

			return this;
		}

		setData (data, permanent){
			this.data.add(data, permanent);
			return this;
		}

		stop (){

			if (Object.keys(this.transport).length > 0){
				for(var tokenKey in this.transport){
					this.transport[tokenKey].abort();
					delete this.transport[tokenKey];
				}
			}

			if(this.idInterval) {
				clearInterval(this.idInterval);
				this.idInterval = null;
			}

			this.connectState = false;

			this.fire('onStop', this);
			return this;
		}

		destroy (){
			this.close();
			return this;
		}
	};	
	
	stage.io.transports.poll = poll ;
	return poll;
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports =  function(stage){

	var defaultSettings = {
		type:"websocket" //   websocket | poll | longPoll 
	};

	var bestTransport = function(){
	
	}; 

	var socket = class socket extends stage.notificationsCenter.notification  {

		constructor(url, localSettings){

			var settings = stage.extend({}, defaultSettings, localSettings);

			super(settings);	

			this.settings = settings ;

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
		}

		write(settings){
			this.transport.send();
		}

		close (settings){
			this.transport.close();
		}

		connect (url, settings){
			this.transport = new this.socket(url, settings);
			this.transport.onmessage = this.listen(this, "onMessage");
		}

		destroy (settings){
			this.transport = null ;
			this.clearNotifications();
		}
	};

	stage.io.socket = socket ;
	return socket ;

};


/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports =  function(stage){

	/*
 	 *
 	 */
	var websocket = class websocket extends stage.io.transport  {

		constructor(url, settings){
			if (url){
				super(url, settings);
				this.connect(url, settings);
			}else{
				super();
				this.socket = null;
			}
		}

		connect (url, settings){
			this.socket = new WebSocket(url, settings.protocol );
			this.socket.onmessage = this.listen(this, "onMessage");
			this.socket.onerror = this.listen(this, "onError");
			this.socket.onopen = this.listen(this, "onConnect");
			this.socket.onclose = this.listen(this, "onClose");
			return this.socket ;
		}


		close (url, settings){
			this.socket.close();
		}

		send (data){
			this.socket.send(data);
		}

		destroy (data){
			delete this.socket ;
			this.socket = null;
		}
	};

	stage.io.transports.websocket = websocket ;

	return websocket;
};


/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports =  function(stage){

	'use strict';

		 
	var appKernel = class appKernel extends  stage.kernel  {

		constructor(url, environnement, settings){

			switch (arguments.length){
				case 0 :
					url = null ;
					environnement = "prod" ;
					settings = {} ;
				break;
				case 1 :
					environnement = url ;
					settings = {} ;
				break;
				case 2:
					settings = environnement;
					environnement = url;
					url = null ;
				break
			}
			super(environnement, settings);
			if ( url ){
				this.loadModule(url,{
					async:false
				});
			}else{
				this.fire("onBoot", this);
			}
		}
	};

	stage.appKernel = appKernel ;
	return appKernel ;
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($, jQuery) {const shortId = __webpack_require__(5);

module.exports =  function(stage){

	'use strict';

	var generateId = function(){
		return shortId.generate();
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
						success: (data, status, xhr) => {
							//this.logger("LOAD FILE :" + src,"DEBUG");
							callback(null, xhr);	
						},
						error:(xhr, status, message) => {
							this.logger(src+" :" +message,"ERROR");
							callback(message, xhr);
						}
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
					script.onload = () => {
						this.cache[id] = script;
						this.logger("LOAD FILE :" + src,"DEBUG");
						callback(null, script);
					};
					script.onerror = (error) => {
						this.logger(src ,"ERROR");
						callback(error, script);
					};
					insert(def.position, script);
				break;
				default:
					this.logger( new Error ("autoload  type transport error "), "ERROR" );
					return null;
			}
			return script ;
		}
	}();



	/*
 	 *
 	 * CLASS AUTOLOAD
 	 *
 	 */
	var defaultSetting = {
		transport:"script",
		prefix:null
	};

	var regType = /(.*)\.(js)$|(.*)\.(css)$/;

	var autoload = class autoload {

		constructor(kernel, settings){
			this.settings = jQuery.extend({}, defaultSetting, settings)
			this.cache = {};
			this.prefix = this.settings.prefix  ;
			this.syslog = kernel.syslog || null ;
			this.transport = this.settings.transport ;
			this.logger("INITIALIZE AUTOLOAD SERVICE", "DEBUG");
		}

		load (file, callback){
			var id = generateId();
			var res = regType.exec(file);
			if ( ! res) {
				this.logger("autoload error type file  ","ERROR")
				return null;
			}
			var script = loader.call(this, file, res[2] || res[4] , id, this.transport, callback)
			return id 
		}

		logger (pci, severity, msgid,  msg){
			if (this.syslog){
				if (! msgid) msgid = "AUTOLOADER  ";
				return this.syslog.logger(pci, severity , msgid,  msg);
			}else{
				console.log(pci);
			}
		}

		unLoad (id, callback){
			if (id in this.cache){
				var tag = this.cache[id]
				tag.parentNode.removeChild(tag);
				delete 	this.cache[id] ;	
				return callback(id);
			}else{
				this.logger("Autoload unLoad no tag find :" +id ,"ERROR")
			}
		}
	};

	stage.autoload =  autoload ;
	return autoload ; 
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(0)))

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

const shortId = __webpack_require__(5);

module.exports =  function(stage){

	'use strict';


	var ISDefined = function(ele){
		if (ele !== null && ele !== undefined ){
			return true ;
		}
		return false;
	};

	var generateId = function(){
		return shortId.generate();
	};

	var parseParameterString = function(str, value){
		var ns = null ; 
		switch( stage.typeOf(str) ){
			case "string" :
				return parseParameterString.call(this,str.split(".") , value);
			case "array" :
				switch(str.length){
					case 1 :
						ns = Array.prototype.shift.call(str);
						if ( ! this[ns] ){
							this[ns] = value;
						}else{
							if ( ISDefined(value) ){
								this[ns] = value ;
							}else{
								return this[ns];
							}
						}
						return value ;
					default :
						ns = Array.prototype.shift.call(str);
						if ( ! this[ns] && ISDefined(value)  ){
							this[ns] = {};
						}
						return parseParameterString.call(this[ns], str, value);	
				}
			break;
			default:
				return false;
		}
	};

	/*
 	 *
 	 *	CONTAINER CLASS
 	 *
 	 */
	var Container = class Container {

		constructor (services, parameters){
			this.protoService = function(){};
			this.protoParameters = function(){};
			this.scope = {};
			this.services = new this.protoService();
			if (services && typeof services === "object"){
				for (var service in services){
					this.set(service, services[service]);
				}
			}
			this.parameters = new this.protoParameters();
			if (parameters && typeof parameters === "object"){
				for (var parameter in parameters){
					this.set(parameter, parameters[parameter]);
				}
			}
		}

		logger (pci, severity, msgid,  msg){
			var syslog = this.get("syslog");
			if (! msgid) { msgid = "CONTAINER SERVICES "; }
			return syslog.logger(pci, severity, msgid,  msg);
		}

		set (name, object){
			return this.protoService.prototype[name] = object;
		}

		get (name){
			if (name in this.services){
				return this.services[name];
			}
			return null;
			//this.logger("GET : " + name+" don't exist", "WARNING");	
		}

		has (name){
			return this.services[name];
		}

		addScope (name){
			if (! this.scope[name] ){
				return  this.scope[name] = {};
			}
			return this.scope[name];
		}

		enterScope (name){
			var sc = new Scope(name, this);
			this.scope[name][sc.id] = sc ;
			return sc;
		}

		enterScopeExtended (name){
			var sc = new ExtendedScope(name, this);
			this.scope[name][sc.id] = sc ;
			return sc;
		}

		leaveScope (scope){
			if ( this.scope[scope.name] ){
				var sc = this.scope[scope.name][scope.id];
				if (sc){
					sc.clean();
					//console.log("pass leaveScope "+ scope.id)
					delete this.scope[scope.name][scope.id];
					sc= null ;
				}
				//console.log(this.scope)
			}
		}

		removeScope (name){
			if ( this.scope[name] ){
				for( var scope in this.scope[name] ){
					this.leaveScope(this.scope[name][scope]) ;
				}
				delete this.scope[name] ;
			}
		}

		setParameters (name, str){
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
		}

		getParameters (name){
			if (typeof name !== "string"){
				this.logger(new Error("container parameter name must be a string"));
				return false;
			}
			//return parseParameterString.call(this.protoParameters.prototype, name, null);  
			return parseParameterString.call(this.parameters, name, null);  
		}
	};

	/*
 	 *
 	 *	SCOPE CLASS
 	 *
 	 */

	var Scope = class Scope extends Container {

		constructor( name, parent){
    			super();
    			this.name = name;
			this.parent = parent;
    			this.services = new parent.protoService();
    			this.parameters = new parent.protoParameters();
    			this.scope = parent.scope;
			this.id = generateId();

		}

		set (name, obj){
    			this.services[name] = obj ;
    			return super.set(name, obj);
		}

		clean (){
			this.services = null ; 
			delete this.services ;
			this.parameters = null ;
			delete this.parameters ;
		}

		setParameters (name, str){
			if ( parseParameterString.call(this.parameters, name, str) === str ){
				return super.setParameters(name, str);
			}else{
				this.logger(new Error("container parameter "+ name+" parse error"));
				return false;
			}
		}
	};

	/*
 	 *
 	 *	ExtendedScope CLASS
 	 *
 	 */
	var ExtendedScope = class ExtendedScope extends Container {

		constructor (name, parent){
    			super();
    			this.name = name;
			this.parent = parent;
    			this.services = new parent.protoService();
    			this.parameters = new parent.protoParameters();
    			this.scope = parent.scope;
			this.id = generateId();

			this.protoService = function(){};
			this.protoService.prototype = stage.extend({},this.parent.protoService.prototype);

			this.protoParameters = function(){};
			this.protoParameters.prototype = stage.extend({},this.parent.protoParameters.prototype) ;
		}

		clean (){
			this.services = null ; 
			delete this.services ;
			this.parameters = null ;
			delete this.parameters ;
			this.protoService = null ;
			this.protoParameters = null ;
		}


		set (name, obj){
    			this.services[name] = obj ;
    			return super.set(name, obj);
		}

		setParameters (name, str){
			if ( parseParameterString.call(this.parameters, name, str) === str ){
				return super.setParameters(name, str);
			}else{
				this.logger(new Error("container parameter "+ name+" parse error"));
				return false;
			}
		}
	};
	
	stage.Container = Container ;
	return Container;
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery, $) {module.exports =  function(stage){

	'use strict';


	/*
 	 *
 	 *	CLASS CONTROLLER
 	 *
 	 */
	var tabFxEvent = ["stage-click", "stage-dblclick", "stage-focus", "stage-blur", "stage-mouseover", "stage-mouseout", "stage-mouseenter", "stage-mouseleave", "stage-change"];

	var Controller = class Controller extends stage.Service{

		constructor(name, container, module){
			super(name, container, container.get("notificationsCenter") );
			this.module = module ; 
			this.i18n = this.kernel.i18n;
			this.router = this.kernel.router;
		}
		
		redirect (url){
			return this.router.redirect.apply(this.router, arguments)
		}

		/*
	 	*
	 	*
	 	*/
		forward (pattern, args){
			return this.router.forward(pattern, args)
		}

		/*
	 	*
	 	*
	 	*/
		generateUrl (name, variables, absolute){
			if (absolute === true){
				var url = this.router.url().split("#");
				absolute = this.router.url[0];
			}
			return this.router.generateUrl.apply(this.router, arguments);
		}

		evalInContext (js, context){
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
		}


		domParser (domElement){
			domElement.find('[' + tabFxEvent.join('],[') + ']').each((index, ele) => {
				var attributes = ele.attributes;
				var jElement = $(ele);
				var ctrl = jElement.closest('[stage-ctrl]');
				var scope = null ;
				if(ctrl.length){
					var pattern = $(ctrl).attr("stage-ctrl") ;
					try {
						scope = this.router.resolvePattern(pattern).controller;
					}catch (e){
						this.logger("DOM PARSER ERROR : " + e , "ERROR")
						return ;
					}
				} else {
					scope = this;
				}
				for(var i = 0; i < attributes.length; i++){
					var attribute = attributes[i];
					if(tabFxEvent.indexOf(attribute.name) > -1){
						var ele = function(){
							var content = attribute.value;
							jElement.on(attribute.name.replace('stage-', ''), function(){
								scope.evalInContext(content, this);
							});
						}();
					}
				}
			});
		}

		/*
	 	*
	 	*
	 	*/
		render (element, partial, type){
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

		}

		renderPartial (pattern, obj){
			try {
				var template = this.module.getTemplatePattern(pattern);
				return template.render(obj);
			}catch(e){
				this.logger(e, "ERROR")
			}
		}
	};

	stage.Controller = Controller ;
	return Controller ;
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(0)))

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {const Twig = __webpack_require__(3);

module.exports =  function(stage){

	'use strict';

	var settingsSyslog = {
		//rateLimit:100,
		//burstLimit:10,
		moduleName:"KERNEL",
		defaultSeverity:"INFO"
	};

	var defaultSettings = {
		debug:false,
		router:true,
		i18n:true,
		location:{
			html5Mode:false,
			hashPrefix:"/"
		}
	};

	var defaultEnvEnable = {
		dev:		true,
		development:	true,	
		prod:		true,
		production:	true,	
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
			success:(mydata, status, xhr) => {
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
			},
			error: (xrh, status, message) => {
				error_callback(xrh, status, message)
			}
		})
		if (async === false) {
			return template;
		} else {
			// placeholder for now, should eventually return a deferred object.
			return true;
		}	
	};

	/*
	*
	*	KERNEL CLASS	
	*/

	var Kernel = class Kernel  extends stage.Service {

		constructor(environment, settings){

			super("KERNEL",null, null ,{
				syslog:settingsSyslog
			});

			this.container.set("kernel", this);

			this.modules = {};
			this.settings = stage.extend(true, {}, defaultSettings , settings );

			if ( environment in defaultEnvEnable ){
				switch ( environment ){
					case "dev" :
					case "development" :
						this.environment = "dev";
					break;
					case "prod" :
					case "production" :
						this.environment = "prod";
					break;
				}
			}else{
				this.logger("Bad Variable environment :" + environment,"WARNING");
				this.environment = "prod";
			}

			this.debug = this.settings.debug ;
			this.booted = false;
			this.isDomReady = false;
			this.uiContainer = null;

			// syslog
			this.initializeLog(settingsSyslog);

			// autoloader
			this.autoloader = new stage.autoload(this, {
				transport:"script"
			});
			this.container.set("autoloader", this.autoloader);

			
			// Router
			this.initRouter();

			// template
			this.initTwig();

			// translation i18n
			this.initTranslation();

			// Service REST
			this.initRest()

			// EVENT NATIF
			$(document).ready( this.listen(this, "onDomReady", this.domReady) );
			$(window).resize( this.listen(this,"onResize") );
			$(window).on( "unload",  this.unLoad.bind(this) );
			$(window).on( "load", this.onLoad.bind(this) );

			//BOOT	
			this.listen(this, "onBoot" , this.boot)
			//READY
			this.listen(this, "onReady" , this.ready)

			this.notificationsCenter.settingsToListen(this.settings, this);
		}
		
		initRouter (){
			if ( this.settings.router ){
				// location
				this.initLocation();
				this.router = new stage.router(this, this.container);
				this.container.set("router", this.router);
			}
		}

		initLocation (){
			this.locationService = new stage.location(this, this.settings.location) ;
			this.container.set("location", this.locationService);
		}

		initRest (){
			if (stage.Rest) {
				this.restService = new stage.Rest(this.container);
				this.set("rest", this.restService);
			}
		}

		initTranslation (){
			if ( this.settings.i18n ){
				if ( ! stage.i18n ){
 		       			this.logger("you must load transation i18n services js file !!!!!", "ERROR")
					return;
				}
				this.i18n = new stage.i18n(this, this.container);
				this.container.set("i18n", this.i18n);
			}
		}

		initTwig (){
			this.logger("INITIALIZE TWIG SERVICE", "DEBUG");
			if (this.environment === "dev"){
				Twig.cache = false ;	
			}
			this.templateEngine = Twig.twig  ; 
			//extended log error traf
			Twig.extend((Twig) => {
				Twig.log.error = (message) => {
					this.logger(message, "ERROR");
				}
			});

			Twig.extend((Twig) => {
				Twig.Templates.loadRemote = loadRemoteTwig.bind(this, Twig) 
			});

			//extended FUNCTION
			Twig.extendFunction("controller", function() {
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
		}

		domReady (){
			if ( ! this.booted ) return ; 
			this.logger("domReady", "DEBUG");
			this.fire("onDomLoad", this);
			var element = this.uiContainer ? $(this.uiContainer) : $("body");
			try {
				if ( this.modules.app ){
					this.modules.app.initialize(element);	
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
		}

		onLoad (event){
			this.fire("onLoad", this, event);	
		}

		unLoad (event){
			this.fire("onUnLoad", this, event);	
		}
	
		getModule (name){
			return this.modules[name] ;
		}

		initializeLog (settings){
			if (this.environment === "dev"){
				// CRITIC ERROR
				this.syslog.listenWithConditions(this,{
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
				this.syslog.listenWithConditions(this,{
					severity:{
						data:data
					}		
				},function(pdu){
					console.info( "SYSLOG " + pdu.severityName +" " + pdu.msgid + " "+new Date(pdu.timeStamp) + " " + pdu.msg+" : "+ pdu.payload);
				});
				this.syslog.listenWithConditions(this,{
					severity:{
						data:"WARNING"
					}		
				},function(pdu){
					console.warn( "SYSLOG " + pdu.severityName +" " + pdu.msgid + " "+new Date(pdu.timeStamp) + " " + pdu.msg+" : "+ pdu.payload);
				});
			}
			return this.syslog;
		}

		boot (){
			this.booted = true;
		}

		ready (){
			//this.fire("onUrlChange", this.router.url() )
		}

		loadModule (url, settings){
			var res = stage.io.urlToOject(url);
			var moduleName = res.basename ;
					
			return $.ajax(url,stage.extend( {
				cache:false,
				method:"GET",
				//async:false,
				dataType:"xml",
				success:(data, status, xhr) => {
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
										this.autoloader.load(moduleSrc, (error, transport) => {
											if (error){
												this.fire("onError", error);
												throw error;
											}
											this.registerModule(moduleName, res);
											if (moduleName === "app")
												this.fire("onBoot", this);
										});
									}
								}
							break;
						}
					}catch(e){
						this.logger(e, "ERROR");
						this.fire("onError", e);
						throw e ;
					}
				},
				error:(xhr, status, message) => {
					this.fire("onGetConfigError", moduleName);
					this.fire("onError", message);	
				}
			}, settings))
		}

		registerModule (name, xml){
			if (name in stage.modules){
				var kernelcontext = this;
				var Class = stage.modules[name]; //.herite(stage.Module);
				this.container.addScope(name);
				Class.prototype.name = name;
				try {
					if (this.isDomReady){
						this.modules[name] = new Class(this, xml,{
							onReady:() => {
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
		}

		getModuleName (url){
			var module = stage.dirname(url);
			var tab = module.split("/")
			return tab[tab.indexOf("Resources")-1];
		}
	};

	stage.kernel = Kernel ;
	return  Kernel;
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {module.exports =  function(stage){

	'use strict';

	var nativeHistory = !!(window.history && window.history.pushState );
	var PATH_MATCH = /^([^\?#]*)(\?([^#]*))?(#(.*))?$/;
	var DEFAULT_PORTS = {'http': 80, 'https': 443};


	/*
 	 *	CLASS BROWSER
 	 *
 	 */

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


	var myurl = function(options){
		if (nativeHistory && options.html5Mode){
			return function (url, replace, state) {
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
			return function (url, replace, state)  {
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

	var urlBrowser = null ;
	var browser = class browser {

		constructor(kernel, settings){
			this.location = window.location;
			this.history = window.History;
			urlBrowser = myurl.call(this, settings);
			this.lastUrl = this.url();
			this.kernel = 	kernel ;
			$(window).bind('hashchange', changeUrl.bind(this)); 
			//if (nativeHistory){
			//	$(window).bind('popstate', changeUrl.bind(this))
			//}
		}

		url (url, replace, state){
			return urlBrowser.call(this, url, replace, state);		
		}

	};



	/*
 	 *	CLASS LOCATION
 	 *
 	 */


	
	var beginsWith = function(begin, whole) {
  		if (whole.indexOf(begin) === 0) {
    			return whole.substr(begin.length);
  		}
	};

	var stripHash = function(url){
		var index = url.indexOf('#');
  		return index == -1 ? url : url.substr(0, index);
	};


	var Location = class Location  extends stage.Service {


		constructor(browser, base, kernel, settings){
			super("LOCATION", kernel.container, kernel.notificationsCenter );
			this.settings = settings
			this.browser = browser ;
			this.replace = false ;
			
			this.initialUrl = this.browser.url();
			this.base = base
			this.hashPrefix = "#"+this.settings.hashPrefix ;
			this.proto = this.stripFile(this.base);
			this.parseAbsoluteUrl(this.initialUrl);
			this.parse(this.initialUrl);
			this.logger("INITIALIZE LOCATION SERVICE", "DEBUG");

			// rewrite hashbang url <> html5 url
			//var abs = this.absUrl();
			//if ( abs != this.initialUrl) {
			//	this.browser.url(abs, true);
			//}
		}
		
		absUrl (){
			return this._absUrl ;
		}

		url (url){
			if (typeof url === "undefined")
				return this._url;
			var match = PATH_MATCH.exec(url);
			if (match[1]) this.path(decodeURIComponent(match[1]));
			if (match[2] || match[1]) this.search(match[3] || '');
			this.hash(match[5] || '');
		}

		protocol (){
			return this._protocol;	
		}

		host (){
			return this._host;	
		}

		port (){
			return this._port ;	
		}

		path (path){
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
		}

		search (search){
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

			
		}
		
		hash (hash){
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
		}	

		state (){
		
		}

		replace (value){
			if (value)
				return  this.replace = value ;	
			return this.replace ;
		}

		encodePath (path) {
  			var segments = path.split('/');
      			var i = segments.length;

  			while (i--) {
    				segments[i] = stage.io.encodeUriSegment(segments[i]);
  			}

  			return segments.join('/');
		}

		stripFile (url){
			return url.substr(0, stripHash(url).lastIndexOf('/') + 1);
		}
	
		// parsing end URL ex : http://domain.com:port(/path)(?search)(#hash)
		parseRelativeUrl (relativeUrl){
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
		}

		// parsing begin URL ex : (http)://(domain.com):(port)
		parseAbsoluteUrl (absoluteUrl){
			var resolve = stage.io.urlToOject(absoluteUrl);
  			this._protocol = resolve.protocol.replace(":", "");
  			this._host = resolve.hostname;
  			this._port = parseInt(resolve.port, 10) || DEFAULT_PORTS[this._protocol] ||null;
		}
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
	var LocationHashbangUrl = class LocationHashbangUrl extends  Location  {

		constructor(browser, base, kernel, settings) {
			super(browser, base, kernel, settings);
		}

		parse (url){
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
		}
		
		change (){
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
		}
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
	var LocationHashbangInHtml5Url = class LocationHashbangInHtml5Url extends  LocationHashbangUrl  {

		constructor(browser, base, kernel, settings){
			super(browser, base, kernel, settings);
		}

		parse (url){
			return this.change();
		}
		
		change(){
			return this;
		}
	};

	/**
 	 * LocationHtml5Url represents an url
 	 * This object is exposed as location service when HTML5 mode is enabled and supported
 	 *
 	 * @constructor
 	 * @param {string} appBase application base URL
 	 * @param {string} basePrefix url path prefix
 	*/
	var LocationHtml5Url = class LocationHtml5Url extends Location  {

		constructor (browser, base, kernel, settings) {
			super(browser, base, kernel, settings);
		}

		parse (url){
			var pathUrl = beginsWith(this.proto, url);
			if (pathUrl){
				this.parseRelativeUrl(pathUrl);
			}
			if (! this._path)
				this._path = "/"
			return this.change();
		}
		
		change (){
			var search = stage.io.toKeyValue(this._search);
			var hash = this._hash ? '#' + stage.io.encodeUriSegment(this._hash) : '';
			this._url = this.encodePath(this._path) + (search ? '?' + search : '') + hash;
			this._absUrl = this.proto + this._url.substr(1);
			return this
		}
	};


	/*
 	 *	SERVICE LOCATION
 	 */

	var defaultSettings = {
		html5Mode:true,
		hashPrefix:"/"
	};

	var serverBase = function (url) {
		return url.substring(0, url.indexOf('/', url.indexOf('//') + 2));
	};

	var service = function(kernel, settings){
	
		var options = $.extend(defaultSettings, settings)
			
		var browserService = new browser(kernel, options);
		kernel.set("browser", browserService);
		var initialUrl = browserService.url();
		var baseHref = options.base || "" ;
		var mode = null ;
		var base = null ;

		if (options.html5Mode) {
			mode = nativeHistory ? LocationHtml5Url : LocationHashbangInHtml5Url;
			base = serverBase(initialUrl) + (baseHref || '/');
		}else{
			mode = LocationHashbangUrl ;
			base = stripHash(initialUrl);
		}
		
		return new mode(browserService, base, kernel, options);
	}; 
	
	stage.location = service ;
	return service;
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {module.exports =  function(stage){

	'use strict';

	/*
 	 *
 	 *	Model
 	 *
 	 */

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

	var regI18n = new RegExp("^(.*)\.(.._..)\.(.*)$");

	var modelModule = class modelModule {

		constructor(config){
			this.rootName = "module";
			var documentXml = this.parser(config);		
			//this.name = this.config.name["@short"];
			this.name = documentXml.module['@id'];
		}

		parser (ele){
			switch ( stage.typeOf(ele) ){
				case "document" :
					var res  = stage.xml.parseXml(ele) ; 
					break;
				case "object" :	
					res = ele ;
					break;
			}
			if ( !  res[ this.rootName ]){
				throw new Error ("BAD MODULE CONFIG ");
			}
			this.config = res[ this.rootName ] ; 
			return res;
		}

		registerScript ( src){
			this.autoloader.load( src, (error, transport) => {
				if (error){
					this.logger(error, "ERROR");
 			       		return ;
				}
				this.logger("LOAD SCRIPT : "+src ,"DEBUG");
			});
		}

		registerStyle ( src){
			this.autoloader.load( src, (error, transport) => {
				if (error){
					this.logger(error, "ERROR");
 			       		return ;
				}
				this.logger("LOAD STYLE : "+src ,"DEBUG");
			});
		}

		cacheFont ( src){
			$.ajax({
				async: false,
			cache: true,
			url: src,
			beforeSend:  ( xhr ) =>  {
				xhr.overrideMimeType("application/octet-stream");
			},
			success: () => {
				this.logger("LOAD FONT : " + src, "DEBUG");
			},
			error: (e) => {
				console.log(e);
				this.logger(src + " : " + message, "ERROR");
			}
			});
		}

		registerTemplate (name, src, type){
			//console.log("NAME :" + name)
			switch(type){
				case "application/twig":
					//var obj = urlParser.call(this, this.templates, src, name);
					this.twig({
						id: this.name+":"+name,
					href: src,
					async: false,
					//debug:true,
					load:(template) => {
						urlParser.call(this, this.templates, src, name , template )
						this.logger("LOAD TEMPLATE : "+name +" ==>"+src ,"DEBUG");
					//console.log(this.templates)
					//obj[name] = template;
					//console.log(template.extend)
					//this.templateEngine
					},
					error:(xrh, status, message) => {
						this.logger("TEMPLATE :" + src + " : "+ message, "ERROR")
					}
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
					this.registerTemplate( name, src, "application/twig" );
					break
			}
		}

		registerView (name, src, type){
			switch(type){
				case "text/javascript":
				case "application/javascript":
					this.autoloader.load( src, (error, transport) => {
						if (error){
							this.logger(error, "ERROR");
							return ;
						}
						//this.views[name] = new ;
						var Class = stage.views[name];
						this.views[name] = new Class(this.container, this);
						this.logger("LOAD VIEW : "+src ,"DEBUG");
					});
					break;
				default:
			}
		}

		registerController (name, src){
			this.autoloader.load( src, (error, transport) => {
				if (error){
					this.logger(error, "ERROR")
					throw error;
				}
				try {
					var Class = stage.controllers[name]; 
					this.controllers[name] = new Class(name, this.container, this);
					this.logger("LOAD CONTROLLER : "+name +" ==>"+src ,"DEBUG");
				}catch(e){
					throw e ;
				}
			});
		}

		initialiseRest (name, url, optionsGlobal){
			var rest = this.kernel.restService ;
			var ele = rest.addApi(name, url, optionsGlobal);
			this.kernel.set(name, ele);
		}

		registerTranslation (src, type){
			var service = this.get("i18n");
			if (! service){
				this.logger("SERVICE I18N not loaded abort load Translation : "+src,"WARNING");
				return ;
			}
			$.ajax({
				url:src,
				async:false,
				success:(data, status, xhr) => {
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
				},
				dataType: type || "json",
				error:(xhr, status, err) => {
					this.logger(err, "ERROR")
				}	
			});
		}

		reader (){
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
		}
	};


	/*
 	*
 	*	CLASS Module
 	*
 	*/
	var regPattern = /(.*)Module:(.*):(.*)$/;

	var Module = class Module extends  modelModule  {

		constructor(kernel, config, settings){
			super(config);
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

			this.setParameters("module."+this.name, this.config);
			this.set(this.name, this);
			this.boot(settings);
		}

		listen (){
			return this.notificationsCenter.listen.apply(this.notificationsCenter, arguments);
		}

		fire (event){
			this.logger(event+" : "+ this.name , "DEBUG", "EVENT MODULE")
				return this.notificationsCenter.fire.apply(this.notificationsCenter, arguments);
		}

		logger (pci, severity, msgid,  msg){
			if (! msgid) msgid = "MODULE  "+this.name;
			return this.syslog.logger(pci, severity, msgid,  msg);	
		}

		/**
	 		*	@method get
	 		*	@param {String} name of service
         		*/
		get (name){
			return this.container.get(name);
		}

		/**
	 		*	@method set
	 		*	@param {String} name of service
	 		*	@param {Object} instance of service
         		*/
		set (name, obj){
			return this.container.set(name, obj);
		}

		setParameters (name, value){
			return this.container.setParameters(name, value);	
		}

		getParameters (name){
			return this.container.getParameters(name);	
		}

		getController (name){
			return this.controllers[name];
		}

		getTemplate (name){
			return this.templates[name];
		}

		getTemplateName (url){
			var name = stage.basename(url);
			var index = name.indexOf(".");
			if (index < 0)
				return url;
			return name.slice(0, name.indexOf(".") );
		}

		getTemplatePattern (pattern){
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
		}

		getView (name){
			return this.views[name];
		}

		boot (settings){
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
		}
	};

	stage.Module = Module; 
	return Module ;
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

const  Twig = __webpack_require__(3);

module.exports =  function(stage){

	'use strict';
			
	/*
 	 *
 	 *	ROUTE
 	 *
 	 */

	var decode = function(str) {
		try {
			return decodeURIComponent(str);
		} catch(err) {
			return str;
		}
	};
	var Route = class Route {

		constructor(id, path, defaultParams){
			this.id = id ;
			this.path = path;
			this.template = null;	
			this.controller =null;
			this.defaults =  defaultParams;
			this.variables = [];
			this.pattern = this.compile();
		};

		compile (){
			var pattern = this.path.replace(/(\/)?(\.)?\{([^}]+)\}(?:\(([^)]*)\))?(\?)?/g, (match, slash, dot, key, capture, opt, offset) =>  {
				var incl = (this.path[match.length+offset] || '/') === '/';
				this.variables.push(key);
				return (incl ? '(?:' : '')+(slash || '')+(incl ? '' : '(?:')+(dot || '')+'('+(capture || '[^/]+')+'))'+(opt || '');
			});
			pattern = pattern.replace(/([\/.])/g, '\\$1').replace(/\*/g, '(.+)');
			this.pattern = new RegExp('^'+pattern+'[\\/]?$', 'i');
			return this.pattern ;	
		}

		match (url){
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
			if ( map && map.wildcard) {
				map['*'] = map.wildcard;
			}
			return map;
		}
	};

	/*
 	 *
 	 *	RESOLVER
 	 *
 	 */
	var regModuleName = /^(.*)Module[\.js]{0,3}$/;
	var Resolver = class Resolver {

		constructor(container){
			this.container = container;
			this.resolve = false;
			this.kernel = this.container.get("kernel");
			this.defaultAction = null;
			this.defaultView = null;
			this.variables = new Array();
			this.router = this.container.get("router")
			this.browser = this.container.get("browser")
			//this.notificationsCenter = this.container.get("notificationsCenter") ;
		
		}

		match (route, url){
			var match = route.match(url); 
			if ( match ){
				this.variables = match;
				this.url = url;
				this.route = route;
				this.parsePathernController(route.defaults.controller)
			}		
			return match;
		}


		getModuleName (str){
			var ret = regModuleName.exec(str);
			if (ret){
				return  ret[1] ;
			}else{
				throw "BAD MODULE PATTERN ";
			}
		}

		getController (name){
			return this.module.controllers[name+"Controller"];
		}

		getAction (name){
			var ele = name+"Action" ;
			if ( ele in this.controller ){
				return this.controller[ele]
			}
			return null;
		}

		getDefaultView (controller, action){
			var res = this.module.name+"Module"+":"+controller+":"+action+".html.twig";
			return res ; 
		}

		parsePathernController (pattern){
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
		}
		
		callController (arg){
			try{
				var ret = this.action.apply(this.controller, arg || [])	
			}catch(e){
				this.controller.logger.call(this.controller, e, "ERROR");	
				throw e;
			}
			return ret;
		}
	};

	/*
	 *	ROUTER
	 */

	var cacheState = function(){
		var cacheState = window.history.state === undefined ? null : window.history.state;	
		return cacheState ;
	}

	var nativeHistory = !!(window.history && window.history.pushState );
	var regSerch = /(.*)\?.*$/;

	var service = class service  extends stage.Service {

		constructor(kernel, container){

			super("ROUTER", container );
			//this.kernel = kernel ;
			//this.container = container ;
			//this.notificationsCenter = this.container.get("notificationsCenter");
			//this.syslog = kernel.syslog ;	
			this.routes = {};
			this.routePattern = {};
			this.location = this.get("location");
			this.browser = this.get("browser");
			this.logger("INITIALIZE ROUTER SERVICE", "DEBUG");

			/*
 		 	* Extend Twig js	
 		 	*/
			Twig.extendFunction("path", (name, variables, host) => {
				try {
					if (host){
						return  this.generateUrl.call(this, name, variables, host);	
					}else{
						var generatedPath = this.generateUrl.call(this, name, variables, host);
						return generatedPath?"#"+generatedPath:"";
					}
				}catch(e){
					this.logger(e.error)
					throw e.error
				}
			});

			this.notificationsCenter.listen(this,"onUrlChange" , (url, lastUrl, absUrl ,cache) => {
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
		}
		
		createRoute (id, path, defaultParams){
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
		}

		getRoute (name){
			if (this.routes[name])
				return this.routes[name];
			return null;
		}

		resolveRoute (url){
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
		}
		
		resolve (url){
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
		}

		getRouteByPattern (pattern, args){
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

		resolvePattern (pattern){
			var resolver = new Resolver(this.container);	
			var route = resolver.parsePathernController(pattern);
			return resolver;
		};

		forward (pattern, args){
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
		
		redirect (url){
			this.location.url(url);
			this.logger("REDIRECT URL : "+ url  +" BROWSER  URL :" + this.location.absUrl(),"DEBUG")
			this.browser.url(this.location.absUrl() , true);
		};
			
		generateUrl (name, variables, host){
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
			if (host){
				return host+"#"+path ;
			}
			return path ;
		}
	};

	stage.router = service ;
	return service ; 

};


/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports =  function(stage){

	'use strict';

	var settingsSyslog = {
		//rateLimit:100,
		//burstLimit:10,
		moduleName:"SERVICE ",
		defaultSeverity:"INFO"
	};

	var defaultOptions = {
	};


	const Service = class Service {
	
		constructor(name, container, notificationsCenter, options ){

			if (name){
				this.name = name ;
			}
			options = stage.extend( {}, defaultOptions, options) ;

			if ( container instanceof stage.Container  ){
				this.container = container ;
			}else{
				if ( container ){
					throw new Error ("Service stage container not valid must be instance of stage.Container");
				}
				this.container = new stage.Container(); 
				this.container.set("container", this.container);
			}
			this.kernel = this.container.get("kernel");
			this.syslog = this.container.get("syslog");
			if ( ! this.syslog ){
				this.settingsSyslog = stage.extend({}, settingsSyslog , {
					moduleName: this.name	
				},options.syslog || {} );
				this.syslog = new stage.syslog( this.settingsSyslog );	
				this.set("syslog", this.syslog);
			}else{
				this.settingsSyslog = this.syslog.settings ;	
			}
			if ( notificationsCenter instanceof stage.notificationsCenter.notification ){
				this.notificationsCenter = notificationsCenter ;
			}else{
				if ( notificationsCenter ){
					throw new Error ("Service stage notificationsCenter not valid must be instance of stage.notificationsCenter.notification");
				}
				this.notificationsCenter = this.container.get("notificationsCenter");
				if ( ! this.notificationsCenter ){
					this.notificationsCenter = stage.notificationsCenter.create(options, this);
					if (! this.kernel ){
						this.set("notificationsCenter", this.notificationsCenter);
					}else{
						if ( this.kernel.container !== this.container ){
							this.set("notificationsCenter", this.notificationsCenter);
						}
					}
				}
			}	
		}

		getName (){
			return this.name;
		}

		clean(){
			this.settingsSyslog = null ;
			delete this.settingsSyslog ;
			this.syslog = null  ;
			delete this.syslog ;
			this.removeAllListeners();
			this.notificationsCenter = null ;
			delete this.notificationsCenter ;
			this.container = null ;
			delete this.container ;
			this.kernel = null ;
			delete this.kernel ;
		}
	
		logger(pci, severity, msgid,  msg){
			try {
				if (! msgid) { msgid = "SERVICE " + this.name + " "; }
				return this.syslog.logger(pci, severity, msgid,  msg);	
			}catch(e){
				console.log(pci);
			}
		}

		/**
	 	*	@method fire
	 	*	@param {String} event name 
	 	*	@param {Arguments} ... arguments to inject  
         	*/
		fire (){
			//this.logger(ev, "DEBUG", "EVENT KERNEL")
			return this.notificationsCenter.fire.apply(this.notificationsCenter, arguments);
		}

		/**
	 	*	@method listen
	 	*	@param {Oject} context
	 	*	@param {String} eventName
	 	*	@param {Function} listener
         	*/
		listen (){
			return this.notificationsCenter.listen.apply(this.notificationsCenter, arguments);
		}

		/**
	 	*	@method removeListener
	 	*	@param {Oject} eventName 
	 	*	@param {String} listener
         	*/
		removeListener (){
			return this.notificationsCenter.unListen.apply(this.notificationsCenter, arguments);
		}

		/**
	 	*	@method removeAllListeners
         	*/
		removeAllListeners (){
			return this.notificationsCenter.clearNotifications.apply(this.notificationsCenter, arguments);
		}

		/**
	 	 *	@method get
	 	 *	@param {String} name of service
         	 */
		get (name){
			if (this.container){
				return this.container.get(name);
			}
			return null;
		}

		/**
	 	*	@method set
	 	*	@param {String} name of service
	 	*	@param {Object} instance of service
         	*/
		set (name, obj){
			if (this.container){
				return this.container.set(name, obj);
			}
			return null;
		}

		getParameters (){
			return this.container.getParameters.apply(this.container , arguments);
		}

		setParameters (){
			return this.container.setParameters.apply(this.container ,arguments);
		}

		has (){
			return this.container.has.apply(this.container ,arguments);	
		}
	};

	stage.Service = Service;	
	return Service ;
};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var Twig = __webpack_require__(3);

module.exports =  function(stage){

	'use strict';


	var translate = {};


	var translateDispo = {
		fr_FR:"français",
		en_EN:"english"
	};

	var regNavLang = /(..)-?.*/;


	var service = class service extends stage.Service {

		constructor(kernel, container){

			super("I18N", container, container.get("notificationsCenter"));

			this.logger("INITIALIZE I18N SERVICE", "DEBUG");

			this.container.setParameters("translate", translate);
			this.defaultDomain = this.trans_default_domain();
			var locale = navigator.language || navigator.userLanguage ;
			var res = regNavLang.exec(locale);
			if (res){
                                this.defaultLocale = res[1]+"_"+locale.toUpperCase();
			}else{
				this.defaultLocale = "fr_FR";	
			}

                        translate[this.defaultLocale] = {};

			this.listen(this, "onBoot",() => {
				this.boot();
			})	
		}

		
		boot (){
			//GET APP locale
			if ( this.kernel.modules.app &&  this.container.getParameters("module.app") ){
				this.defaultLocale = this.container.getParameters("module.app").locale || this.defaultLocale;
			}

			if  ( ! translate[this.defaultLocale]){
				translate[this.defaultLocale] = {};
			}

			this.logger("DEFAULT LOCALE APPLICATION ==> " + this.defaultLocale ,"DEBUG");
			if (Twig){
				Twig.extendFunction("getLangs", this.getLangs.bind(this));
				Twig.extendFunction("trans_default_domain", this.trans_default_domain.bind(this));
				Twig.extendFilter("trans", this.translation.bind(this));
				Twig.extendFunction("trans", this.translation.bind(this));
				Twig.extendFilter("getLangs", this.getLangs.bind(this));
			}
		}

		getLangs (locale, data){
			var obj = [];
			for ( var ele in translateDispo){
				obj.push({
					name:translateDispo[ele],
					value:ele
				});	
			}
			return obj;
		}


		registerI18n (name, locale, domain, data){
			if ( locale ){
				if( !translate[locale] )
					translate[locale] = stage.extend(true, {}, translate[this.defaultLocale]);	
			}
			if ( domain ){
				if( !translate[locale][domain] ){
					translate[locale][domain] = stage.extend(true, {}, translate[this.defaultLocale][domain]);
				}
				stage.extend(true, translate[locale][domain], data);		
			}else{
				stage.extend(true, translate[locale], data);	
			} 
		}

		trans_default_domain (domain){
			if ( ! domain ){
				return this.defaultDomain = "messages" ; 
			}
			return this.defaultDomain = domain ;
		}

		/*
 	 	*
 	 	*
 	 	*
 	 	*
 	 	*/
		translation (value, args){
			
			var defaulDomain = ( args && args[1] ) ? args[1] : this.defaultDomain ;
			var str = this.container.getParameters("translate."+this.defaultLocale+"."+defaulDomain+"."+value) || value;
			if (args){
				if (args[0]){
					for (var ele in args[0]){
						str = str.replace(ele, args[0][ele]);
					}
				}
			}
			return str;
		}
	};

	stage.i18n = service ;

	return service;
};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(51);

module.exports =  function(stage){

	'use strict';

	var audioContext = null ;

	var webAudioApi = function(){
		audioContext = window.AudioContext || window.webkitAudioContext  ;
		if (audioContext)
			return true;
		return false;
	}();

	// UDPATER
 	var mediaStream = null ;
	var getMediaStream =null;

	var updaterMedia = function(){
		// MediaStream	API
		try {
			if (stage.browser.Webkit){

				getMediaStream = function(stream){
					return URL.createObjectURL(stream);
				};

				mediaStream =  webkitMediaStream ;
  				// The representation of tracks in a stream is changed in M26.
  				// Unify them for earlier Chrome versions in the coexisting period.
  				if (!webkitMediaStream.prototype.getVideoTracks) {
					webkitMediaStream.prototype.getVideoTracks = function() {
						return this.videoTracks;
					};
					webkitMediaStream.prototype.getAudioTracks = function() {
						return this.audioTracks;
					};
  				}
				return true;
			}
			if (stage.browser.Gecko){

				getMediaStream = function(stream){
					return window.URL.createObjectURL(stream);
				};

				mediaStream =  MediaStream ;
  				// Fake get{Video,Audio}Tracks
				if (!MediaStream.prototype.getVideoTracks) {
					MediaStream.prototype.getVideoTracks = function() {
						return [];
					};
				}
				if (!MediaStream.prototype.getAudioTracks) {
					MediaStream.prototype.getAudioTracks = function() {
						return [];
					};
				}
				return true;
			}
			if (stage.browser.Opera){
				//getUserMedia = navigator.getUserMedia ;
				getMediaStream = function(stream){
					return stream;
				};
				// Fake get{Video,Audio}Tracks
				if (!MediaStream.prototype.getVideoTracks) {
					MediaStream.prototype.getVideoTracks = function() {
						return [];
					};
				}
				if (!MediaStream.prototype.getAudioTracks) {
					MediaStream.prototype.getAudioTracks = function() {
						return [];
					};
				}
				return true;
			}
			console.error("Browser does not appear to be mediaStream-capable");
			throw("Browser does not appear to be mediaStream-capable");
		}catch(e){
			throw(e);
		}
	}();

	/*
 	 *	MEDIA STREAM
 	 *
 	 *
 	 *
 	 *
 	 */
	var defaultSettingsStream = {
		audio:true,
		video:true
	};
		
	/*var attachMediaStream = function(){
		if (stage.browser.Webkit || stage.browser.Opera){
			return function(element){
				// Attach a media stream to an element.
				this.mediaElement = element;
				this.mediaElement.srcObject = this.stream ;
				//element.src = this.getMediaStream(this.stream);
				this.mediaElement.play();
			}
		}
		if (stage.browser.Gecko){
			return function(element){
				// Attach a media stream to an element.
				this.mediaElement = element;
				this.mediaElement.srcObject = this.stream ;
				//element.mozSrcObject = this.stream;
				this.mediaElement.play();
			}
		}
  	}();*/

	//FIXME
	/*var reattachMediaStream = function (){
		if (stage.browser.Webkit){
			return function(to){
				// reattach a media stream to an element.
				this.mediaElement.src = this.getMediaStream(this.stream);
				//to.src = this.mediaElement.src;
				this.mediaElement.play()
				//this.mediaElement = to;
			}
		}
		if (stage.browser.Gecko){
			return function(to){
				// reattach a media stream to an element.
				to.mozSrcObject = this.mediaElement.mozSrcObject;
				to.play();
				this.mediaElement = to;
			}
		}
  	}();*/

	var mediaStream = class mediaStream  {

		constructor(mediaElement, settings){
			this.settings = stage.extend({},defaultSettingsStream, settings)
			this.notificationsCenter = stage.notificationsCenter.create(this.settings, this);
			this.urlStream = null;
			this.stream = this.settings.stream ? this.setStream(this.settings.stream):null;
			this.mediaElement = mediaElement ? mediaElement : null ;
			this.getMediaStream = getMediaStream ;
		}

		getUserMedia (settings, success, error){

			if (settings){
				this.settings = stage.extend( {}, defaultSettingsStream, settings)
				this.notificationsCenter.settingsToListen(settings);
			}
			return navigator.getUserMedia({
					video:this.settings.video,
					audio:this.settings.audio
				},
				(stream) => {
					this.setStream(stream);
					if (success)
						success(this);
					this.notificationsCenter.fire("onSucces", stream, this);
				},
				(e) => {
					if (error){
						error(e);
					}
					this.notificationsCenter.listen(this, "onError")
				}
			);
		}

		setStream (stream){
			this.stream = stream ;
			this.urlStream = this.getMediaStream(stream);
			this.videotracks = this.getVideoTracks();
			this.audiotracks = this.getAudioTracks();
			return stream ;
		}

		stop (){
			if (this.stream){
				this.stream.stop();
			}
		}

		attachMediaStream (element){
			this.mediaElement = element;
			this.mediaElement.srcObject = this.stream ;
			//element.mozSrcObject = this.stream;
			this.mediaElement.play(); 
  		}

		reattachMediaStream (stream){
			this.stream = stream;
			this.attachMediaStream(this.mediaElement);
  		}
			
		getVideoTracks (){
			return this.stream.getVideoTracks();
		}

		getAudioTracks (){
			return this.stream.getAudioTracks();
		}

		/*startRecording (stream){
			var mediaStreamSource = this.audioContext.createMediaStreamSource(stream);
			console.log(mediaStreamSource);
			mediaStreamSource.connect(this.audioContext.destination);
			this.recorder = new Recorder(mediaStreamSource);
		}
		stopRecording (){
			this.recorder.stop();
			this.recorder.exportWAV((stream) => {
				this.recordSource = window.URL.createObjectURL(stream);
			});
		}*/
	};



	/*
 	 *
 	 *	TRACK
 	 *	
 	 *
 	 */
	var trackSettings = {
		gain		: true,
		panner		: true,
		filter		: false,
		analyser	: false,
		connect		: true,
	};

	var Track = class Track {

		constructor(media, bus, settings){
			this.media = media ;
			this.bus = bus ;
			this.settings = stage.extend({}, trackSettings, settings);
			this.audioNodes = {} ;
			this.audioBus = {};
			this.transport = null;
			this.context = bus.audioContext ;

			this.source = null;
			this.buffer = null;
			this.out = null ;
			this.in = null ;

			this.name = this.settings.name ;
			this.id = this.generateId();

			this.sync = 0;
			this.retry = 0;
			this.ready = false ;
			this.muted = false ;
			this.currentTime = 0 ;
			this.eventsManager = stage.notificationsCenter.create(this.settings, this);
			this.createNodes();

			if ( this.settings.connect ){
				this.connect(this.bus.in);
			}

			this.listen(this, "onReady" , function(){
				this.bus.mixer.fire('onReadyTrack', this.bus, this);
			})

			var type = stage.typeOf(media) ;
			switch ( type ){
				case "object" :
					switch (true ){
						case  media instanceof mediaStream :
							this.mediaType = "stream" ;
							this.buffer = media.stream;
							this.url = stage.io.urlToOject(media.urlStream);
							this.ready = true;
							this.fire("onReady", this);
						break;
						case  media instanceof AudioNode :
							this.mediaType = "audioNode" ;
							this.buffer = media ;
							this.ready = true;
							this.fire("onReady", this);
						break;
						default :
							var error = new Error ("media type not allowed ") ;
							this.fire("onError",  error) ;
							throw error ;
					}
				break;
				case "element":
					this.mediaType = "element";
					/*this.media.onloadstart = () => {
						console.log("loadstart");
					}
					this.media.onloadeddata = () => {
						console.log("onloadeddata");
					}*/	
					this.media.oncanplay= () => {
						this.connectSource( this.media );
						this.ready = true;
						this.fire("onReady", this);
					}

				break;
				case "string" :
					this.url = stage.io.urlToOject(media);
					this.load(media);
				break;
				default :
					var error = new Error ("Track media type error") ;
					this.fire("onError",  error) ;
					throw error ;
			}
		}

		generateId (){
			return parseInt(Math.random()*1000000000,10);
		}

		setName (name){
			this.name = name ;
		}

		listen (){
			return this.eventsManager.listen.apply(this.eventsManager, arguments);
		}

		unListen (){
			return this.eventsManager.unListen.apply(this.eventsManager, arguments);
		}

		fire (){
			return this.eventsManager.fire.apply(this.eventsManager, arguments);
		}

		createNodes (){

			this.audioNodes["mute"] = this.bus.createGain() ;
			this.in = this.audioNodes["mute"];
			this.out = this.audioNodes["mute"];

			if (this.settings.gain){
				this.audioNodes["gain"] = this.bus.createGain() ;
				this.out.connect( this.audioNodes["gain"] )
				this.out = this.audioNodes["gain"];
			}
			if (this.settings.filter){
				this.audioNodes["filter"]  = this.bus.createFilter();
				this.out.connect(this.audioNodes["filter"])
				this.out = this.audioNodes["filter"] ;
			}

			if (this.settings.panner){
				this.audioNodes["panner"]  = this.bus.createStereoPanner();
				this.out.connect( this.audioNodes["panner"] );
				this.out = this.audioNodes["panner"] ;
			}
			if (this.settings.analyser){
				this.audioNodes["analyser"] = this.bus.createAnalyser();
				this.audioNodes["analyser"].smoothingTimeConstant = 0.85;
				this.out.connect( this.audioNodes["analyser"] );
			}
		}

		setGain (value) {
			this.audioNodes.gain.gain.value = value ;
			this.fire("onSetGain", value);
			return this;
  		}

		getGain () {
			return this.audioNodes.gain.gain.value  ;
  		}

		mute () {
			this.audioNodes.mute.gain.value = 0;
			this.muted = true;
			this.fire("onMute",this);
			return this;
  		}

		unmute (){
			this.audioNodes.mute.gain.value = 1;
			this.muted = false;
			this.fire("onUnMute",this);
			return this;
  		}

		pause (when) {
			switch ( this.mediaType ){
				case "element":
					this.media.pause();
					this.fire("onPause",this);
				break;
				default:
					if ( this.source ) {
						if (this.source.node && this.source.playbackState == this.source.node.PLAYING_STATE) {
							this.source.node.stop( when || 0 );
						}
						this.disconnectSource();
						this.fire("onPause",this);
					}
			}
			return this;
  		}

		play ( time , loop) {
			switch ( this.mediaType ){
				case "element":
					this.media.play();
					this.fire("onPlay",this)
				break;
				default: 
					this.pause().connectSource();
	  				if ( loop )
 						this.source.loop = true;
 	 				if ( this.source.noteOn )
 		 				this.source.noteOn(this.context.currentTime, time);
 	 				if ( this.source.start )
 		 				this.source.start(this.context.currentTime, time)
					}
					this.fire("onPlay",this)
			return this ;
  		}

		connectSource (){
			this.source = this.createSource();
			this.source.connect( this.in );
		}

		disconnectSource (){
			this.source.disconnect( this.in );
			this.source = null;
			this.fire("onDisconnectSource",this)
		}

		connect (audioNode){
			this.destination = audioNode ;
			this.out.connect(audioNode);
			this.fire("onConnect", audioNode, this);
		}

		disconnect (){
			this.out.disconnect( this.destination );
			this.destination = null ;
			this.fire("onDisconnect",  this);
		}

		createSource ( buffer ){
			//console.log(arguments);
			switch ( this.mediaType ){
				case "audioNode":
					var source = buffer || this.buffer ;
				break;
				case "video":
				case "audio":
					var source = this.context.createBufferSource();
					source.buffer = buffer || this.buffer;
				break;
				case "decode" :
					this.rawBuffer = buffer ;
					this.urlStream = URL.createObjectURL ( new Blob([this.rawBuffer]) )
					this.context.decodeAudioData(buffer,
						(decoded) => {
							this.buffer = decoded ;
							this.ready = true;
							this.fire("onReady", this);
						},
						(error) => {
							console.log(arguments)
							this.eventsManager.fire("onError", this, error);
							// only on error attempt to sync on frame boundary
							//if(this.syncStream()) this.createSource(type, buffer);
						}
					);
				break;
				case "stream":
					var source = this.context.createMediaStreamSource(buffer || this.buffer);
				break;
				case "element":
					var source = this.context.createMediaElementSource(this.media);
				break;
			}
			return source;
		}

		syncStream (){
			var buf8 = new Uint8Array(this.buffer);
    			Uint8Array.prototype.indexOf = Array.prototype.indexOf;
    			var i=this.sync, b=buf8;
    			while(1) {
        			this.retry++;nodeGain
        			i=b.indexOf(0xFF,i); if(i==-1 || (b[i+1] & 0xE0 == 0xE0 )) break;
        			i++;
    			}
    			if(i!=-1) {
        			var tmp=this.buffer.slice(i); //carefull there it returns copy
        			delete(this.buffer); this.buffer=null;
        			this.buffer=tmp;
        			this.sync=i;
        			return true;
    			}
    			return false;
		}

		load  (url) {
			this.transport = new XMLHttpRequest();
			this.transport.open("GET", url, true);
			this.transport.responseType = "arraybuffer";
			this.transport.onload = () => {
		    	// Asynchronously decode the audio file data in request.response
				this.mediaType = "decode" ;
				this.createSource( this.transport.response ) ;
				this.contentType = this.transport.getResponseHeader("content-type").split(";")[0];
				switch(this.contentType){
					case (/audio\/.*/.test(this.contentType) ? this.contentType : null ) :
						this.mediaType = "audio" ;
					break;
					case (/video\/.*/.test(this.contentType) ? this.contentType : null ) :
						this.mediaType = "video" ;
					break;
				}
		  	};

			this.transport.onerror = () => {
				console.error('BufferLoader: XHR error');
			}

			this.transport.send();
		}
	};

	/*
	 *
	 *	CLASS AUDIOBUS
	 *
	 */
	 var defaultAudioBusSettings = {
		 panner: false,
		 analyser:false
	 };

	 var audioBus = class audioBus  {

		constructor(name, mixer, settings){
			this.name = name ;
			this.mixer = mixer ;
			this.settings = stage.extend({}, defaultAudioBusSettings, settings);
			this.eventsManager = stage.notificationsCenter.create(this.settings, this);
			this.audioContext = new audioContext();
			this.tracks = [];
			this.nbTracks = 0 ;
			this.audioNodes = {} ;
			this.in = null ;
			this.out = null ;
			this.destination = null ;
			this.muted = false;
			this.createNodes();
		}

		listen (){
			return this.eventsManager.listen.apply(this.eventsManager, arguments);
		}

		unListen (){
			return this.eventsManager.unListen.apply(this.eventsManager, arguments);
		}

		fire (){
			return this.eventsManager.fire.apply(this.eventsManager, arguments);
		}

		createNodes (){
			// mute
			this.audioNodes["mute"] = this.createGain();
			this.in = this.audioNodes["mute"];

			// gain
			this.audioNodes["gain"] = this.createGain();
			this.in.connect( this.audioNodes["gain"] );
			this.out = this.audioNodes["gain"];

			// analyseur stéreo
			if ( this.settings.analyser ){
				this.audioNodes["splitter"]= this.createChannelSplitter(2);
				this.out.connect( this.audioNodes["splitter"] );
				this.audioNodes["analyserLeft"] = this.createAnalyser();
				this.audioNodes["analyserLeft"].smoothingTimeConstant = 0.85;
				this.audioNodes["splitter"].connect(this.audioNodes["analyserLeft"], 0, 0);

				this.audioNodes["analyserRight"] = this.createAnalyser();
				this.audioNodes["analyserRight"].smoothingTimeConstant = 0.85;
				this.audioNodes["splitter"].connect(this.audioNodes["analyserRight"], 1, 0);
			}

			// panoramique
			if ( this.settings.panner ){
				this.audioNodes["panner"]  = this.createStereoPanner();
				this.out.connect( this.audioNodes["panner"] );
				this.out = this.audioNodes["panner"] ;
			}
		}

		connect(audioNode){
			this.destination = audioNode ;
			this.out.connect(audioNode);
			this.fire("onConnect", audioNode, this)
		}

		disconnect (audioNode){
			if ( this.destination ){
				this.out.disconnect(this.destination);
				this.destination = null;
				this.fire("onDisconnect",  this);
			}
		}

		setGain (value) {
			this.audioNodes.gain.gain.value = value ;
			this.fire("onSetGain", value);
			return this;
  		}

		getGain () {
			return this.audioNodes.gain.gain.value  ;
  		}

		mute () {
			this.audioNodes.mute.gain.value = 0;
			this.muted = true;
			this.fire("onMute",this);
			return this;
  		}

		unmute (){
			this.audioNodes.mute.gain.value = 1;
			this.muted = false;
			this.fire("onUnMute",this);
			return this;
  		}

		createGain (){
			return this.audioContext.createGain();
		}

		createPanner (){
			return this.audioContext.createPanner();
		}

		createStereoPanner (){
			return this.audioContext.createStereoPanner();
		}

		createFilter (){
			return this.audioContext.createBiquadFilter();
		}

		createAnalyser (){
			return this.audioContext.createAnalyser();
		}

		createChannelSplitter (nbChannel){
			return this.audioContext.createChannelSplitter(nbChannel);
		}

		createChannelMerger (nbChannel){
			return this.audioContext.createChannelMerger(nbChannel);
		}

		createOscillator (){
			return this.audioContext.createOscillator();
		}

		createMediaStreamDestination (){
			var destination = this.audioContext.createMediaStreamDestination();
			this.disconnect();
			this.connect(destination);
			return destination ;
		}

		createTrack (media, settings){
			var track = new Track(media, this, settings );
			this.tracks.push(track);
			this.nbTracks++ ;
			this.fire("onCreateTrack", track , this) ;
			return track ;
		}
		
		removeTrack (track){
			var ele = null ;
			switch (true){
				case track instanceof Track :
					for (var i = 0 ; i < this.tracks.length ; i++){
						if ( this.tracks[i] === track ){
							var name = track.name ;
							track.pause();
							track.disconnect();
							// remove from tab
							ele = this.tracks.splice( i, 1 );
							this.nbTracks--;
							this.fire("onRemoveTrack", ele[0] , this) ;
							delete ele[0] ;
							break ;
						}
					}
				break ;	
				case typeof track === "number" :
				case typeof track === "string" :
					var name = track ;
					for (var i = 0 ; i < this.tracks.length ; i++){
						if ( this.tracks[i].name === name ){
							this.tracks[i].pause();
							this.tracks[i].disconnect();
							// remove from tab
							ele = this.tracks.splice( i, 1 );
							this.nbTracks--;
							this.fire("onRemoveTrack", ele[0] , this) ;
							delete ele[0] ;
							break ;
						}
					}
				break;
			}
			if ( ! ele )
				throw new Error ("this track doesn't exist in  bus : " + this.name)
			return true ;
		}
	};


	/*
	 *
	 *
	 *	MEDIA MIX
	 *
	 *
	 */
	var mixSettings = {};

	var mediaMix = class mediaMix  {

		constructor(settings){
			
			this.audioBus = {} ;
			this.nbBus = 0 ;
			this.settings = stage.extend({}, mixSettings, settings);
			this.eventsManager = new stage.notificationsCenter.create(this.settings, this);

	 		this.createAudioBus("MASTER", {
				panner:true,
				analyser:true
			});
			this.masterBus = this.audioBus["MASTER"];

			this.tracks = this.masterBus.tracks;
			this.audioContext = this.masterBus.audioContext ;
			this.muted = this.masterBus.muted;
			this.panner = this.masterBus.audioNodes.panner ;
			this.analyserLeft = this.masterBus.audioNodes["analyserLeft"];
			this.analyserRight = this.masterBus.audioNodes["analyserRight"];
			this.gain = this.masterBus.audioNodes["gain"];

			this.connect(this.audioContext.destination);
		}

		listen (){
			return this.eventsManager.listen.apply(this.eventsManager, arguments);
		}

		unListen (){
			return this.eventsManager.unListen.apply(this.eventsManager, arguments);
		}

		fire (){
			return this.eventsManager.fire.apply(this.eventsManager, arguments);
		}

		createAudioBus (name, settings){
			try {
				var bus = new audioBus(name, this , settings );
			}catch(e){
					throw e ;
			}
			this.audioBus[name] = bus ;
			this.nbBus++ ;
			bus.listen(this, "onCreateTrack", function(track, bus){
				this.fire("onCreateTrack", track, bus, this)
			})
			bus.listen(this, "onRemoveTrack", function(track, bus){
				this.fire("onRemoveTrack", track, bus, this)
			})
			return bus ;
		}

		removeAudioBus (bus){
			var ele = null ;
			switch (true){
				case bus instanceof audioBus :
					
				break ;	
				case typeof track === "number" :
				case typeof track === "string" :
					
				break;
			}
			if ( ! ele ){
				throw new Error ("remove bus : this bus doesn't exist in  mixer  ");
			}
			return true ;
		}

		connect (audioNode){
			this.destination = audioNode ;
			var ret = this.masterBus.connect(audioNode);
			this.fire("onConnect", audioNode, this)
			return ret;
		}

		disconnect (){
			this.masterBus.disconnect();
			this.destination = null ;
			this.fire("onDisconnect",  this);
		}

		setGain (value) {
			this.masterBus.setGain(value);
			return this;
  		}

		getGain () {
			return this.masterBus.getGain();
  		}

		mute () {
			this.masterBus.mute();
			this.muted = this.masterBus.muted ;
			return this;
  		}

		unmute (){
			this.masterBus.unmute();
			this.muted = this.masterBus.muted ;
			return this;
  		}

		createTrack (media, settings){
			return this.masterBus.createTrack(media, settings);
		}

		removeTrack (track){
			return this.masterBus.removeTrack(track)
		}

		playTracks (time, loop){
			for (var i = 0 ; i<this.tracks.length ; i++){
				this.tracks[i].play( time, loop );
			}
		}

		createGain (){
			return this.audioContext.createGain();
		}

		createPanner (){
			return this.audioContext.createPanner();
		}

		createStereoPanner (){
			return this.audioContext.createStereoPanner();
		}

		createFilter (){
			return this.audioContext.createBiquadFilter();
		}

		createAnalyser (){
			return this.audioContext.createAnalyser();
		}

		createChannelSplitter (nbChannel){
			return this.audioContext.createChannelSplitter(nbChannel);
		}

		createChannelMerger(nbChannel){
			return this.audioContext.createChannelMerger(nbChannel);
		}

		createOscillator(){
			return this.audioContext.createOscillator();
		}
	};

	stage.media = {
		mediaStream		: mediaStream,
		webAudioApi		: webAudioApi,
		mediaMix		: mediaMix,
		Track			: Track,
		audioBus		: audioBus

	}
	return stage.media ;
};


/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports =  function(stage){

	'use strict';


	// FIXME CALLBACK SDP PARSER
	var parseSdp = function(description){
		var sdpLines = description.sdp.split('\r\n');
		var newline = "";
		// Search for m line.
		for (var i = 0; i < sdpLines.length; i++) {
			var line = sdpLines[i];
			switch (description.type ){
				case "offer":
					/*if (line.search('a=crypto') !== -1) {
						console.log("PARSE SDP DELETE CRYPTO ");
						continue ;
					}*/
					/*if (line.search('a=setup:actpass') !== -1) {
						console.log("PARSE SDP REPLACE setup :  actpass by active  ");
						line = line.replace("a=setup:actpass", "a=setup:active")
					}*/
				break;
				case "answer":
					/*if (line.search('a=crypto') !== -1) {
						console.log("PARSE SDP DELETE CRYPTO ");
						continue ;
					}*/
					/*if (line.search('a=setup:actpass') !== -1) {
						console.log("PARSE SDP REPLACE setup :  actpass by active  ");
						line = line.replace("a=setup:actpass", "a=setup:active")
					}*/
				break;
			}
			if ( i === sdpLines.length-1 ){
				newline+=line;
			}else{
				newline+=line+"\r\n";
			}
		}
		description.sdp = newline ;
		return description;
	};


	/*
 	 *
 	 *	CLASS USER
 	 *
 	 */
	var userSettings = {
		constraints	: { mandatory: { 'OfferToReceiveAudio': true, 'OfferToReceiveVideo': true } },
		//constraintsOffer: stage.browser.Gecko ? {'mandatory': {'MozDontOfferDataChannel':true}} : null
		displayName	: ""
	};

	var User = class User  {

		constructor(userName, settings){
			this.name = userName ;

			this.settings = stage.extend({}, userSettings, settings );

			this.displayName = this.settings.displayName || userName ;

			this.audio = this.settings.constraints.mandatory.OfferToReceiveAudio ;
			this.video = this.settings.constraints.mandatory.OfferToReceiveVideo ;
			this.mediaStream = null ;
			this.description = "" ;

		}

		createMediaStream (succesCallback, errorMedia){
			this.mediaStream = new stage.media.mediaStream(null, {
				audio: this.audio,
				video:this.video,
				onSucces:succesCallback,
				onError:errorMedia
			});
			return this.mediaStream ;
		}

		setDescription (desc){
			this.description = desc ;
		}
	};

	/*
 	 *
 	 *	CLASS TRANSACTION WEBRTC
 	 *
 	 */
	var Transaction = class Transaction  {
		constructor(webrtc, from, to, dialog, settings){
			this.webrtc = webrtc ;
			this.notificationsCenter = stage.notificationsCenter.create(settings || {}, this);
			this.dialog = dialog || null ;
			this.error = null ;
			if ( this.dialog ){
				this.callId = this.dialog.callId;
			}
			this.protocol =  webrtc.protocol;
			this.from = from ;
			try {
				if (to instanceof User ){
					this.to = to;
				}else{
					this.to = new User(to, settings) ;
				}
			}catch(e){
				throw e ;
			}
			this.asyncCandidates = this.webrtc.settings.asyncCandidates ;

			console.log("CREATE TRANSATION WEBRTC");
			this.RTCPeerConnection = this.createPeerConnection() ;
			this.RTCPeerConnection.addStream(this.from.stream)

			// MANAGE DTMF
			this.dtmfSender= null ;
			if ( this.webrtc.settings.dtmf ){
				try {
					this.initDtmfSender( this.from.stream );
					this.webrtc.listen(this, "onKeyPress", this.sendDtmf ) ;
					// FIXME TRY TO RECEIVE DTMF RTP-EVENT
					/*this.webrtc.listen(this, "onRemoteStream",function(event, mediaStream, transaction){
						console.log( "DTMF setRemoteStream")
						this.initDtmfReceiver( this.from.stream );
					});*/
				}catch(e){
					console.log(e) ;
					throw e ;
				}
			}

			// MANAGE CANDIDATES
			this.candidates = [];
			this.listen(this, "onIcecandidate" , function(transaction, candidates, peerConnection){
				//console.log(" onIcecandidate : " + peerConnection.localDescription.type )
				if ( this.asyncCandidates && this.candidates.length){
					//console.log( message.dailog)
					var to = this.dialog.to.replace("<sip:", "").replace(">","") ;
					console.log("CANDIDATE TO" + to)
					console.log("CANDIDATE TO" + this.to.name)
					this.dialog.invite(to, JSON.stringify(this.candidates), "ice/candidate")
				}else{
					if ( peerConnection.localDescription.type == "offer" ){
						this.sessionDescription = parseSdp.call(this, peerConnection.localDescription ) ;
						if ( this.dialog ){
							var to = this.dialog.to.replace("<sip:", "").replace(">","") ;
							console.log("CANDIDATE TO" + to)
							console.log("CANDIDATE TO" + this.to.name)
							this.dialog.invite(to, this.sessionDescription);
						}else{
							this.dialog = this.webrtc.protocol.invite(this.to.name, this.sessionDescription);
							this.callId = this.dialog.callId ;
							this.webrtc.fire("onInvite", this, this.to, this.sessionDescription );
						}
					}
					if (peerConnection.localDescription.type == "answer" ){
						this.sessionDescription = peerConnection.localDescription ;
						if ( this.sessionDescription && ! ( this.error ) )
						this.fire("onCreateAnwser", this.to, this.sessionDescription, this, this.dialog);
					}

				}
			})

			this.listen(this, "onCreateAnwser", function(to, sessionDescription, webrtcTransaction, diag){
				var response = this.dialog.currentTransaction.createResponse( 200, "OK", this.sessionDescription.sdp, "application/sdp"  );
				response.send();
			});
		}


		listen (){
			return this.notificationsCenter.listen.apply(this.notificationsCenter, arguments);
		}

		unListen (){
			return this.notificationsCenter.unListen.apply(this.notificationsCenter, arguments);
		}

		fire (){
			return this.notificationsCenter.fire.apply(this.notificationsCenter, arguments);
		}

		createPeerConnection (){
			try {
				// CREATE PeerConnection
				this.RTCPeerConnection = new RTCPeerConnection( this.webrtc.iceServers , this.webrtc.settings.optional );

				// MANAGE EVENT CANDIDATES
				this.RTCPeerConnection.onicecandidate =  (event)  => {
					// FIX firefox fire many time onicecandidate  iceGatheringState === complete
					var old = this.iceGatheringState ;
					if ( event.target ){
						this.iceGatheringState = event.target.iceGatheringState || this.RTCPeerConnection.iceGatheringState ;
					}else{
						this.iceGatheringState = this.RTCPeerConnection.iceGatheringState ;
					}
					var type = this.RTCPeerConnection.localDescription.type ;
					//console.log( this.iceGatheringState )
					//console.log( type )
					if (type === "offer"  && this.iceGatheringState === 'complete'  && old !== "complete")  {
						//console.log("PASSS CANDIDATE")
						this.fire("onIcecandidate", this, this.candidates ,this.RTCPeerConnection );
    					} else if (event && event.candidate == null) {
						// candidates null !!!
    					} else {
						console.info("WEBRTC : ADD CANDIDATE");
						if (event.candidate){
							this.candidates.push(event.candidate);
						}
						if (type === "answer"){
							this.fire("onIcecandidate", this, this.candidates ,this.RTCPeerConnection );
							this.RTCPeerConnection.onicecandidate = null ;
						}
    					}
				};

				// MANAGE STREAM
				this.RTCPeerConnection.onaddstream = (event) => {
					//console.log(event)
					this.setRemoteStream( event)
					console.log("WEBRTC : ADD STREAM ")
				};
				return this.RTCPeerConnection;
			}catch (e){
				//console.log(e)
				this.webrtc.fire("onError", this, e);
			}
		}

		// FIXME TRY TO RECEIVE DTMF RTP-EVENT
		/*initDtmfReceiver (mediaStream){
			console.log(this.RTCPeerConnection)
			if ( ! this.RTCPeerConnection.createDTMFSender ) {
				throw new Error(" RTCPeerConnection method createDTMFSender() !!!! which is not support by this browser");
			}
  			if (mediaStream !== null) {
				try {
					var remoteAudioTrack = mediaStream.getAudioTracks()[0];
					var dtmfSender = this.RTCPeerConnection.createDTMFSender(remoteAudioTrack);
					dtmfSender.ontonechange = (tone) => {
						console.log("dtmfOnToneChange")
						this.webrtc.fire("dtmfOnToneChange", tone , this);
					};
				}catch(e){
					throw e ;
				}

  			} else {
				throw new Error( 'No local stream to create DTMF Sender', 500)
  			}
		}*/

		initDtmfSender (mediaStream) {

			switch ( this.webrtc.settings.dtmf ){
				case "SIP-INFO" :
					var func = function(){} ;
					func.prototype.insertDTMF = (key, duration, gap) =>{
						var description = "Signal="+key+"\nDuration="+duration ;
						var type= "application/dtmf-relay";
						this.dialog.info( description, type)
					};
					this.dtmfSender = new func() ;
				break;
				case "RTP-EVENT" :
					if ( ! this.RTCPeerConnection.createDTMFSender ) {
						throw new Error(" RTCPeerConnection method createDTMFSender() !!!! which is not support by this browser", 500);
					}
  					if (mediaStream !== null) {
    						var localAudioTrack = mediaStream.getAudioTracks()[0];
						this.dtmfSender = this.RTCPeerConnection.createDTMFSender(localAudioTrack);
						this.dtmfSender.ontonechange = (tone) => {
							this.webrtc.fire("dtmfOnToneChange", tone , this);
						};

  					} else {
						throw new Error( 'No local stream to create DTMF Sender', 500)
  					}
				break;
			}
		}

		sendDtmf (code, key, event) {
			if ( this.dialog.status !== this.dialog.statusCode.ESTABLISHED ) {
				return ;
			}
			if (this.dtmfSender) {
				var duration = 500;
				var gap = 50;
				console.log('DTMF SEND, duration, gap: ', key, duration, gap);
				return this.dtmfSender.insertDTMF(key, duration, gap);
			}
			throw new Error(" DTMF SENDER not ready");
		}

		createOffer (){
			return  this.RTCPeerConnection.createOffer((sessionDescription) => {
				this.sessionDescription = parseSdp.call(this, sessionDescription);
				try{
					this.from.setDescription(this.RTCPeerConnection.setLocalDescription(this.sessionDescription, () => {
						// ASYNC CANDIDATES
						if (  this.asyncCandidates ){
							// INVITE
							this.dialog = this.webrtc.protocol.invite(this.to.name, this.sessionDescription);
							this.callId = this.dialog.callId ;
							this.webrtc.fire("onInvite", this, this.to, this.sessionDescription );
						}else{
							// SYNC CANDIDATES
							/*this.webrtc.listen(this, "onIcecandidate" , function(transaction, candidates, peerConnection){
								if ( peerConnection.localDescription.type == "offer" ){
									this.sessionDescription = parseSdp.call(this, peerConnection.localDescription ) ;
									if ( this.dialog ){
										var to = this.dialog.to.replace("<sip:", "").replace(">","") ;
										this.dialog.invite(to, this.sessionDescription);
									}else{
										this.dialog = this.webrtc.protocol.invite(this.to.name, this.sessionDescription);
										this.webrtc.fire("onInvite", this, this.to.name, this.sessionDescription );
										this.callId = this.dialog.callId ;
									}
								}
							})*/
						}
					},
					(error) => {
						this.error = error ;
						this.webrtc.fire("onError", this , error) ;
					}));
				}catch(e){
					throw e;
				}
			},
 			(error) => {
				this.webrtc.fire("onError", this , error) ;
			},
			this.from.settings.constraintsOffer);
		}

		setRemoteStream (event){
			if (event){
				//console.log(event.stream.getVideoTracks());
				this.to.createMediaStream(null, null);
				this.to.mediaStream.setStream(event.stream);
				var type = this.RTCPeerConnection.remoteDescription.type ;
				if (event.type === "video" || event.type === "addstream" ){
					this.webrtc.notificationsCenter.fire( "onRemoteStream", type, event, this.to.mediaStream, this);
				}
			}
			return this.to.createMediaStream ;
		}

		setRemoteDescription (type, user, description, dialog){
			//console.log("setRemoteDescription")
			this.currentTransaction = dialog.currentTransaction ;
			var desc = {
				type:type,
				sdp:description
			}
			//console.log( desc );
			var remoteDesc = parseSdp.call(this, desc);
			var ClassDesc = new RTCSessionDescription( remoteDesc );

			this.remoteDescription = this.RTCPeerConnection.setRemoteDescription(
				ClassDesc,
				() => {
					if (this.RTCPeerConnection.remoteDescription.type == "offer"){
						//console.log("WEBRTC : onRemoteDescription ");
						//this.doAnswer(dialog);
						this.webrtc.fire("onOffer", this.webrtc, this);
						this.webrtc.fire("onRemoteDescription", this.from, this, this.to);
					}else{
						this.webrtc.fire( "onOffHook", this , dialog );
					}
				},
				(error) => {
					this.error = error ;
					this.webrtc.fire( "onError", this, error )
				}
			);
			return this.remoteDescription;
		}

		doAnswer (dialog) {
			return this.RTCPeerConnection.createAnswer(
				(sessionDescription) => {
					this.from.setDescription(sessionDescription) ;
					this.RTCPeerConnection.setLocalDescription(sessionDescription, () => {
						this.sessionDescription = sessionDescription ;
						if ( this.asyncCandidates ){
							this.fire("onCreateAnwser", this.to, this.sessionDescription, this, dialog);
						}
						this.webrtc.fire( "onOffHook",this , dialog );
					},
					(error) => {
						this.error = error ;
						this.webrtc.fire( "onError", this , error);
					});
				},
				// error
				(e) => {
					this.error = e ;
					this.webrtc.fire( "onError", this ,e);
				},
				this.from.settings.constraints
			);
		}

		bye (){
			if ( this.dialog  ){
				this.dialog.bye();
			}
		}

		cancel (){
			if ( this.currentTransaction ){
				this.currentTransaction.cancel();
			}
			this.webrtc.closeTransaction(this, this.to.name)
		}

		decline (){
			if ( this.currentTransaction ){
				this.currentTransaction.decline();
			}
			this.webrtc.closeTransaction(this, this.to.name);
		}

		close (){
			console.log("WEBRTC CLOSE TRANSACTION  : "+ this.callId )
			this.RTCPeerConnection.close();
			this.webrtc.unListen( "onKeyPress", this.sendDtmf ) ;
			delete this.RTCPeerConnection ;
			return this ;
		}
	};
	
	/*
 	 *
 	 *	CLASS WEBRTC
 	 *
 	 */
	var defaultSettings = {
		audio		: true,
		video		: true,
		protocol	: "SIP",
		sipPort		: 5060,
		sipTransport	: "WSS",
		dtmf		: "SIP-INFO",	// "SIP-INFO", "RTP-EVENT"
		/*
 		 * STUN  => { iceServers: [{ url: ! stage.browser.Gecko ? 'stun:stun.l.google.com:19302' : 'stun:23.21.150.121'}] }
 		 * TURN  => { iceServers: [{ url: "turn:webrtc%40live.com@numb.viagenie.ca", credential: ""}] }
		 */ 		
		iceServers	: null,	 
		//constraints	: { mandatory: { 'OfferToReceiveAudio': true, 'OfferToReceiveVideo': true } },
		//constraintsOffer: stage.browser.Gecko ? {'mandatory': {'MozDontOfferDataChannel':true}} : null,
		//optional	: { optional: [{ "RtpDataChannels": true},{'DtlsSrtpKeyAgreement': 'true'}]}
		//optional	: stage.browser.Gecko ? { optional: [{ "RtpDataChannels": true}]} :  { optional: [{ "RtpDataChannels": true},{'DtlsSrtpKeyAgreement': 'true'}]},
		optional	: stage.browser.Gecko ? { optional: []} :  { optional: [{'DtlsSrtpKeyAgreement': 'true'}]},
		asyncCandidates : false
	};


	var WebRtc = class WebRtc  {

		constructor(server, transport, settings){
			this.settings = stage.extend(true, {}, defaultSettings, settings);
			this.notificationsCenter = stage.notificationsCenter.create(this.settings, this);
			//this.syslog = new stage.syslog(syslogSettings);
			this.protocol = null;
			this.socketState = "close" ;
			this.transactions = {};
			//this.users = {};
			this.transport = this.connect( transport ) ;
			if ( this.transport && this.transport.publicAddress ){
				this.publicAddress = this.transport.publicAddress;
				//this.publicAddress = server;
				//this.publicAddress = this.transport.domain;
			}
			this.server = server ;
			this.init();
		}

		init (){
			delete this.protocol ;
			this.protocol = null ;

			// EVENTS WEBRTC
			this.listen(this, "onInvite", function(transaction , userTo, description){
				this.transactions[transaction.callId] = transaction ;
			});

			/*this.listen(this, "onOffer", function(message , userTo, transaction){
				this.transactions[transaction.callId] = transaction ;
			});*/

			this.listen(this, "onOffer", function(webrtc, transaction){
				this.transactions[transaction.callId] = transaction ;
			});

			this.listen(this, "onAccept", function(webrtc, transac){
				transac.doAnswer(transac.dialog);
				//transac.setRemoteDescription("offer", transac.to, transac.to.description, transac.dialog);
			});

			this.listen(this, "onDeclineOffer", function(webrtc, transac){

				var ret = transac.dialog.currentTransaction.createResponse(
					603,
					"Declined"
				);
				ret.send();

				/*var ret = message.transaction.createResponse(
					603,
					"Declined"
				);
				ret.send();*/
				this.closeTransaction(transac);
			});

			// MANAGE PROTOCOL
			switch (this.settings.protocol){
				case "SIP":
					this.protocol = new stage.io.protocols.sip(this.server, this.transport,{
						portServer	: this.settings.sipPort ,
						transport	: this.settings.sipTransport,
					});

					this.protocol.listen(this, "onRegister", function(sip, message){
						switch (message.code){
							case 200 :
								this.user.createMediaStream((stream) => {
									this.user.stream = stream ;
									this.notificationsCenter.fire("onMediaSucces", this.user.mediaStream, this.user);
								},(e) => {
									this.notificationsCenter.fire("onError", this, e);
								});
								this.notificationsCenter.fire("onRegister", this.user, this);
							break;
							default :
								this.notificationsCenter.fire("onError", this.protocol, message);
							break;
						}
					});

					this.protocol.listen(this, "onUnRegister",function(sip, message){
						this.fire("onUnRegister", sip, message);
					})

					this.protocol.listen(this,"onRinging",function(sip, message){
						var transaction = this.transactions[message.callId];
						if ( transaction ){
							this.notificationsCenter.fire( "onRinging", message.toName , transaction);
						}
					});

					this.protocol.listen(this,"onTrying",function(sip, message){
						var transaction = this.transactions[message.callId];
						if ( transaction ){
							this.notificationsCenter.fire( "onTrying", message.toName , transaction);
						}
					});

					this.protocol.listen(this,"onInfo",function(message){
						var transaction = this.transactions[message.callId];
						//console.log(message);
						if (message.contentType === "application/dtmf-relay" ){
							this.fire( "onDtmf", message.body.dtmf , transaction);
						}
					});

					this.protocol.listen(this,"onCancel",function(message){
						var transaction = this.transactions[message.callId];
						if (transaction){
							this.notificationsCenter.fire( "onCancel", message.body.body , transaction );
							this.closeTransaction(transaction, message.fromName);
						}
					});

					this.protocol.listen(this, "onInvite", function(message, dialog){
						switch(message.header["Content-Type"]){
							case "application/sdp" :
								if ( message.rawBody ){

									if ( dialog.status === dialog.statusCode.INITIAL){

										// TODO MANAGE MULTI CALL

										var res = message.transaction.createResponse(100, "trying");
										res.send();

										// transaction WEBRTC
										try {
											var transac = this.createTransaction(message.fromName, dialog , {
												displayName: message.fromNameDisplay || ""
											});
											transac.to.setDescription( message.rawBody );
										}catch(e){
											var res = message.transaction.createResponse(500, e.message || e);
											res.send();
											return ;
										}

										var res = message.transaction.createResponse(180, "Ringing");
										res.send();

										try {
											transac.setRemoteDescription("offer", transac.to, transac.to.description, transac.dialog);
											//this.notificationsCenter.fire("onOffer", message, transac.to, transac);
											//this.fire("onOffer", this, transac);
										}catch(e){
											var res = message.transaction.createResponse(500, e.message || e);
											res.send();
										}

										return ;
									}
									if ( dialog.status === dialog.statusCode.ESTABLISHED){
										// HOLD THE LINE
										message.transaction.decline();
									}
								}
							break;
							case "ice/candidate" :
								if ( message.rawBody ){
									var transaction = this.transactions[message.callId];
									if ( ! transaction ) {
										var ret = message.transaction.createResponse(500, "no transaction ");
										ret.send();
										return ;
									}
									var res = JSON.parse(message.rawBody) ;
									var ret = message.transaction.createResponse(100, "trying");
									ret.send();
									for (let i=0 ; i<res.length;i++){
										var candidate = new RTCIceCandidate(res[i]);
										transaction.RTCPeerConnection.addIceCandidate(candidate,
											() =>{
												console.log("WEBRTC remote CANDIDATES   " +res[i].candidate );
											},
											(e) => {
												console.log(e);
												console.log("WEBRTC Error CANDIDATES " +res[i].candidate );
											}
										);
									}
									if ( transaction.candidates.length ){
										var ret = message.transaction.createResponse(200, "OK", JSON.stringify(transaction.candidates), "ice/candidate");
										ret.send();
										transaction.candidates= [];
									}else{
										var ret = message.transaction.createResponse(200, "OK");
										ret.send();
										//transaction.candidates= [];
										/*this.listen(this, "onIcecandidate" , function(transaction, candidates, peerConnection){
											var ret = message.transaction.createResponse(200, "OK", JSON.stringify(transaction.candidates), "ice/candidate");
											ret.send();
											transaction.candidates= [];
										});*/
									}
								}
							break;
							default:
								this.notificationsCenter.fire("onError", this.protocol,  message);

						}
					});

					this.protocol.listen(this, "onTimeout",function(sip, message){
						this.notificationsCenter.fire("onTimeout", message.method, 408, message);
					});

					this.protocol.listen(this, "onDecline",function(message){
						if ( message.callId in  this.transactions ){
							var transac =  this.transactions[message.callId];
							this.fire("onDecline", this, transac );
							this.closeTransaction(transac);
						}
					});

					this.protocol.listen(this, "onError",function(Class, message){
						this.notificationsCenter.fire("onError", Class, message);
						var transac =  this.transactions[message.callId];
						if  (transac ){
							this.closeTransaction(transac, transac.to.name);
						}
					});

					this.protocol.listen(this, "onQuit",function(protocol){
						this.close();
					});

					this.protocol.listen(this, "onInitCall",function(to, dialog, transaction){
						if ( dialog.callId in this.transactions ){
							var transac =  this.transactions[dialog.callId];
							transac.currentTransaction = transaction ;
							this.notificationsCenter.fire("onInitCall", transac );
						}
					});

					this.protocol.listen(this, "onBye",function(message){
						if ( message.callId in  this.transactions ){
							var transac =  this.transactions[message.callId];
							var name = message.fromName
						}
						if ( transac ){
							this.notificationsCenter.fire("onOnHook", transac ,message);
							this.closeTransaction(transac, name);
						}else{
							// WHEN USER LOCAL STOP REGISTRATION
							if ( message.fromName === this.user.name ){
								this.close()
							}
						}
					});

					this.protocol.listen(this, "onCall", function(message){
						var transac =  this.transactions[message.callId];
						if ( message.toNameDisplay ){
							transac.to.displayName = message.toNameDisplay ;
						}
						//var from = this.users[message.toName];
						if ( message.dialog.status === message.dialog.statusCode.EARLY && message.header["Content-Type"] == "application/sdp"){
							this.notificationsCenter.fire("onAnwer", message);
							transac.to.setDescription(message.rawBody);
							transac.setRemoteDescription("answer", transac.to, message.rawBody, message.dialog);
							/*if ( this.settings.asyncCandidates && transac.candidates.length){
								//console.log( message.dailog)
								message.dialog.invite(message.to, JSON.stringify(transac.candidates), "ice/candidate")
							}*/
							//this.notificationsCenter.fire( "onOffHook", transac , message );
						}else{

						}
						if ( message.header["Content-Type"] == "ice/candidate"){
							if (transac.candidates.length){
								var res = JSON.parse(message.rawBody) ;
								for (let i=0 ; i<res.length;i++){
									var candidate = new RTCIceCandidate(res[i]);
									transac.RTCPeerConnection.addIceCandidate(candidate,
										() => {
											//console.log("Succes Candidate")
											console.log("WEBRTC ADD remote CANDIDATES :  " + res[i].candidate);
										},
										(e) => {
											console.log(e);
											console.log("WEBRTC Error CANDIDATES " + res[i].candidate );
										}
									);
								}
							}
						}
					});

					this.protocol.listen(this, "onMessage",function(message){
						this.fire("onMessage", message);
					});

					this.protocol.listen(this, "onSend",function(message){
						this.fire("onSend", message);
					});

					this.listen(this, "onError", function(Class, error){
						switch (true){
							case ( Class instanceof  WebRtc ) :
							break ;
							case ( Class instanceof Transaction ) :
								//console.log(Class.currentTransaction )
								if ( Class.currentTransaction ){
									var response = Class.currentTransaction.createResponse( 500, error.message || error );
									response.send();
								}
								this.closeTransaction(Class, Class.to.name);
							break ;
							case ( Class instanceof  Error ) :
							break ;
						}
					});
				break;
				default:
					throw new Error("WEBRTC Protocol not found " ) ;
			}
		}

		connect (transport){
			//console.log(transport instanceof stage.realtime  )
			if ( transport ){
				transport.listen(this, "onConnect" , function(){
					this.socketState = "open" ;
				});
				transport.listen(this, "onClose" , function(){
					this.socketState = "close" ;
				})
				return 	transport ;
			}
		}

		listen (){
			return this.notificationsCenter.listen.apply(this.notificationsCenter, arguments);
		}

		unListen (){
			return this.notificationsCenter.unListen.apply(this.notificationsCenter, arguments);
		}

		fire (){
			return this.notificationsCenter.fire.apply(this.notificationsCenter, arguments);
		}

		createTransaction (userTo, dialog, settings){
			try {
				var transaction = new Transaction(this, this.user, userTo, dialog, settings);
				return transaction ;
			}catch(e){
				this.fire("onError", this, e);
				throw e ;
			}
		}

		unRegister (){
			//console.log( "WEBRTC unregister")
			this.close();
			if (this.protocol){
				this.protocol.unregister();
			}
		}

		register (userName, password, settings){
			this.user = new User(userName, settings);
			this.protocol.register( userName, password, settings )
		}


		createOffer (userTo) {
			var to = new User(userTo);
			//this.users[userTo] = to ;
			var transac = this.createTransaction(to);
			transac.createOffer();
			return transac ;
		}

		closeTransaction (transation, name) {
			if ( transation ){
				transation.close();
				delete this.transactions[transation.callId];
				//delete this.users[name];
			}
		}

		close (){
			this.fire("onQuit", this);
			for (var trans in this.transactions){
				try {
					this.transactions[trans].bye();
					this.transactions[trans].close();
				}catch(e){

				}
				delete this.transactions[trans];
			}
		}

		quit () {
			this.protocol.bye();
		}
	};

	stage.media.webrtc = WebRtc ;
	stage.media.webrtcTransaction = Transaction ;
	stage.media.userMedia = User ; 
	return WebRtc ;
};


/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports =  function(stage){

	'use strict';


	var ea = function(){
		if (stage.browser.Ie){
			return function(callback){
				var iterator = 0;
				for (var key in this.data) {
					//if ( ! Array.prototype[key] ){
					if ( this.data.hasOwnProperty(key) ){
						var value = this.data[key]; 
						var pair = [key, value];
						pair.key = key;
						pair.value = value;
						callback(pair, iterator);
					}
					iterator++;
				}
			}
		}else{
			return function(callback){
				var iterator = 0;
				for (var key in this.data) {
					var value = this.data[key]; 
					var pair = [key, value];
					pair.key = key;
					pair.value = value;
					callback(pair, iterator);
					iterator++;
				}
			}
		}
	}();


	
	var struct = class struct {

		constructor(data){
			this.data = stage.typeOf(data) === "object" ? stage.extend(true, {}, data) : {} ;
		}


		get (key){
			if ((key === null) || (key === undefined)){
				return this.data;
			}
			if ( (key in this.data)){
				return this.data[key];
			}
			return false;
		}

		set (key, value){
			if ((key !== null) || (key !== undefined)){
				return this.data[key] = value;
			}
			return false;
		}

		unset (key){
			if (key in this.data){
				delete this.data[key];
				return true
			}
			return false;
		}

		hasKey (key){
			if (key in this.data){
				return true;
			}
			return false;
		}

		clear (){
			this.data = {};
			return true;
		}
		
		clone (){
			return stage.extend(true, {}, this.data);
		}

		//TODO
		inspect (){
			
		}

		//TODO
		keys (){
		}

		//TODO
		values (){
		}

		each (){
			return ea.apply(this, arguments);	
		}

		clone (){
			return  new struct(this.data);
		}

		toObject (key){
			return stage.extend(true, {}, this.data) ;
		}


		merge (hash){
			this.data = stage.extend(true, {}, this.data, hash) ;
		}

		toJson (key){
			if (key)
				return stage.json.stringify(this.get(key));
			return stage.json.stringify(this.data);
		}

		//TODO
		toQueryString (){

		}

	};

	var obj = {
		struct:struct,
		local:{
			createHash:function(data){
				return new struct(data);
			}
		}
	};

	stage.structs.hash = obj ;
	return obj;
};


/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports =  function(stage){

	'use strict';


	var defaultSettings = {
		type:"FIFO",	
		active:true
	};


	var codeError = {
		empty:0,
		notFound:1,
		stopped:2
	};

	/*
 	*
 	*
 	*
 	*  EVENTS QUEUE : 
 	*	onQueued(queue) :	// fire when add value to queue
 	*	onDeQueued(queue) :	// fire when add value to queue
 	*	onRunStart:(queue)	// fire when begin to run along the queue
 	*	onRunFinish:(queue)	// fire when finish to run along the queue
 	*	onError(queue, error, errorCode):	// fire when an error 
 	*
 	*  ERROR CODES :
 	*	0 : 	empty
 	*	1 :	notFound
 	*	2 :	stopped
 	*
 	*  SETTINGS : default
 	*	type : "FIFO"  // "LIFO"
 	*
 	*
 	*
 	*/
	var struct = class struct {

		constructor(localSettings){
			// Manage settings
			this.settings = stage.extend( true, {}, defaultSettings, localSettings);
			this.data = [];
			this.error= null;
			this.eventsQueue = stage.createEventsManager();
		}

		listen (context, eventName, callback){
			return this.eventsQueue.listen(context, eventName, callback);
		}
		
		// TODO LIFO
		enqueue (value){
			if (this.settings.active){
				var ret = this.data.push(value);
				this.eventsQueue.fireEvent("onQueued",this);
				return ret;
			}else{
				this.error = new Error("QUEUE is stoped");
				this.eventsQueue.fireEvent("onError",this, this.error, codeError.stopped);
				return null;
			}
		}
		
		
		remove (data){
			if (this.isEmpty()) {
				this.error = new Error("QUEUE is empty")
				this.eventsQueue.fireEvent("onError",this, this.error, codeError.empty);
				return null;
			}
			if (stage.array.contain(this.data, data) )
				return stage.array.remove(this.data, data)
			this.error = new Error(data+" Not found");
			this.eventsQueue.fireEvent("onError",this, this.error, codeError.notFound);
			return null;
		}

		// TODO LIFO
		dequeue (){
			if (this.settings.active){
				if (this.isEmpty()) {
					this.error = new Error("QUEUE is empty")
					this.eventsQueue.fireEvent("onError",this, this.error, codeError.empty);
					return null;
				}
				var value = this.data[0];
				stage.array.removeIndexOf(this.data,0);
				this.eventsQueue.fireEvent("onDeQueued",this);
				return value;
			}else{
				this.error = new Error("QUEUE is stoped")
				this.eventsQueue.fireEvent("onError",this, this.error, codeError.stopped);
				return null;
			}
		}

		peek (data){
			if (this.isEmpty()) {
				return null;
			}
			return this.data[0];
		}

		purge (){
			this.data.length = 0;
		}

		isEmpty (){
			return this.data.length === 0;
		}

		count (){
			return this.data.length;
		}

		getQueue () {
			return this.data;
		}

		start () {
			this.settings.active = true;
		}

		stop (){
			this.settings.active = false;
		}

		run (callback) {
			if (this.settings.active){
				this.eventsQueue.fireEvent("onRunStart",this);
				stage.each(this.data,callback)
				this.eventsQueue.fireEvent("onRunFinish",this);
			}else{
				this.error = new Error("QUEUE is stoped")
				this.eventsQueue.fireEvent("onError",this, this.error, codeError.stopped);
				return null;
			}
		}
	};



	var createStruct = function(localSettings){
		var Structs = new struct(localSettings);	
		Structs.eventsQueue.settingsToListen(localSettings)	
		if(Structs.error){			
			Structs.eventsQueue.fireEvent("onError", Structs, Structs.error);
			return Structs;
		}	
		return Structs;
	};

	var obj = {
		struct:struct,
		local:{
			createQueue:function(localSettings){
				if (! localSettings){
					localSettings = {};
				}
				return createStruct(localSettings);
			}
		}
	};

	stage.structs.queues = obj ;
	return obj;

};


/***/ }),
/* 38 */
/***/ (function(module, exports) {



/*
 *
 *
 *
 */
module.exports =  function(stage){

	'use strict';
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
	var guid = 0;
	var PDU = class PDU {
		constructor(pci, severity, moduleName, msgid, msg, date ) {
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

		/**
    	 	* Get Date in string format
    	 	* @method getDate
    	 	* @return {String} a date in string format .
    	 	*/
   		getDate(){
       			return new Date(this.timeStamp).toTimeString();
   		}

   		/**
    	 	* get a string representating the PDU protocole
    	 	* @method toString
    	 	* @return {String}  .
    	 	*/
   		toString (){
       			return  "TimeStamp:"+this.getDate() +
           			"  Log:" +this.payload +
           			"  ModuleName:" +this.moduleName +
           			"  SeverityName:"+this.severityName+
           			"  MessageID:"+this.msgid +
           			"  UID:"+this.uid +
                   		"  Message:"+this.msg;
   		}

		parseJson (str){
			var json = null ;
			try {
				json = JSON.parse(str);
				for (var ele in json){
					if (ele in this){
						this[ele] = json[ele];
					}
				}
			}catch(e){
				throw e ;
			}
			return json ;
		}
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
	var syslog = class syslog extends stage.notificationsCenter.notification {

		constructor(settings){

       			super( settings );
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

       			this.fire = this.settings.async ? super.fireAsync : super.fire ;
   		}

   		pushStack (pdu){
       			if (this.ringStack.length === this.settings.maxStack){
               			this.ringStack.shift();
           		}
       			var index = this.ringStack.push(pdu);
       			//console.log(this);
       			this.valid++;
       			return index;
   		}

   		/**
     	 	 * logger message
    	 	 * @method logger
     	 	 * @param {void} payload payload for log. protocole controle information
     	 	 * @param {Number || String} severity severity syslog like.
     	 	 * @param {String} msgid informations for message. example(Name of function for debug)
     	 	 * @param {String} msg  message to add in log. example (I18N)
     	 	 */
   		logger (payload, severity, msgid, msg){
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
						console.error(e);
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
					console.error(e);
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
   		clearLogStack (){
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
   		getLogStack (start, end, contition){
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
   		getLogs (conditions, stack){
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
   		}


   		/**
     	 	 * take the stack and build a JSON string
    	 	 * @method logToJson
     	 	 * @return {String} string in JSON format
     	 	 */
   		logToJson (conditions){
       			if (conditions)
           			var stack = this.getLogs(conditions)
       			else
           			var stack = this.ringStack
           				return JSON.stringify(stack);
   		}

   		/**
    	 	 * load the stack as JSON string
   	 	 * @method loadStack
   	 	 * @param {Object} json or string stack serialize
	 	 * @param {boolean} fire conditions events  .
	 	 * @param {function} callback before fire conditions events
    	 	 * @return {String}
    	 	 */
   		loadStack (stack, doEvent, beforeConditions){
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
   		}


   		/**
     	 	 *
     	 	 *    @method  listenWithConditions
     	 	 *
     	 	 */
   		listenWithConditions (context, conditions, callback  ){
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
               				var res = myFuncCondition(Conditions, pdu);
               				if (res){
                   				callback.apply(context || this, arguments)
               				}
           			};
           			super.listen(this, "onLog", func);
				return func ;
       			}
   		}

	}
	stage.syslog = syslog;
	stage.PDU = PDU;
	return syslog ; 
};



/***/ }),
/* 39 */
/***/ (function(module, exports) {

/*
 *
 *
 *
 *
 *
 *
 *
 */

module.exports = function(stage){

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

	return stage.xml =  {
		parseXml:parseXml,
		//parseNode:parseDOM,
	  	stringToDocumentXML : stringToDocumentXML ,
	  	//getDocumentRoot :getDocumentRoot
	}
};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["jQuery"] = __webpack_require__(41);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * jQuery JavaScript Library v3.1.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2016-09-22T22:30Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var document = window.document;

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};



	function DOMEval( code, doc ) {
		doc = doc || document;

		var script = doc.createElement( "script" );

		script.text = code;
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.1.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
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
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
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
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = jQuery.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

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

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isArray: Array.isArray,

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {

		// As of jQuery 3.0, isNumeric is limited to
		// strings and numbers (primitives or objects)
		// that can be coerced to finite numbers (gh-2662)
		var type = jQuery.type( obj );
		return ( type === "number" || type === "string" ) &&

			// parseFloat NaNs numeric-cast false positives ("")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			!isNaN( obj - parseFloat( obj ) );
	},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {

		/* eslint-disable no-unused-vars */
		// See https://github.com/eslint/eslint/issues/6125
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}

		// Support: Android <=2.3 only (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		DOMEval( code );
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Support: IE <=9 - 11, Edge 12 - 13
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android <=4.0 only
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.3
 * https://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-08-08
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	disabledAncestor = addCombinator(
		function( elem ) {
			return elem.disabled === true && ("form" in elem || "label" in elem);
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rcssescape, fcssescape );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[i] = "#" + nid + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement("fieldset");

	try {
		return !!fn( el );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}
		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
						disabledAncestor( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( preferredDoc !== document &&
		(subWindow = document.defaultView) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( el ) {
		el.className = "i";
		return !el.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( el ) {
		el.appendChild( document.createComment("") );
		return !el.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID filter and find
	if ( support.getById ) {
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode("id");
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( (elem = elems[i++]) ) {
						node = elem.getAttributeNode("id");
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( el ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll(":enabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll(":disabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( el ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return (sel + "").replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( (oldCache = uniqueCache[ key ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( el ) {
	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( el ) {
	return el.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Simple selector that can be filtered directly, removing non-Elements
	if ( risSimple.test( qualifier ) ) {
		return jQuery.filter( qualifier, elements, not );
	}

	// Complex selector, compare the two sets, removing non-Elements
	qualifier = jQuery.filter( qualifier, elements );
	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) > -1 ) !== not && elem.nodeType === 1;
	} );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		return elem.contentDocument || jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && jQuery.isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && jQuery.isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Support: Android 4.0 only
			// Strict mode functions invoked without .call/.apply get global-object context
			resolve.call( undefined, value );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.call( undefined, value );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = jQuery.isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( jQuery.isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the master Deferred
			master = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( master.state() === "pending" ||
				jQuery.isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return master.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}

		return master.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ jQuery.camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ jQuery.camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ jQuery.camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( jQuery.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( jQuery.camelCase );
			} else {
				key = jQuery.camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			jQuery.contains( elem.ownerDocument, elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};




function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		do {

			// If previous iteration zeroed out, double until we get *something*.
			// Use string for doubling so we don't accidentally see scale as unchanged below
			scale = scale || ".5";

			// Adjust and apply
			initialInUnit = initialInUnit / scale;
			jQuery.style( elem, prop, initialInUnit + unit );

		// Update scale, tolerating zero or NaN from tween.cur()
		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
		} while (
			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
		);
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]+)/i );

var rscriptType = ( /^$|\/(?:java|ecma)script/i );



// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// Support: IE <=9 only
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

// Support: IE <=9 only
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && jQuery.nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, contains, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( jQuery.type( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )();
var documentElement = document.documentElement;



var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 only
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		// Make a writable jQuery.Event from the native event object
		var event = jQuery.event.fix( nativeEvent );

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: jQuery.isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,

	which: function( event ) {
		var button = event.button;

		// Add which for key events
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
			if ( button & 1 ) {
				return 1;
			}

			if ( button & 2 ) {
				return 3;
			}

			if ( button & 4 ) {
				return 2;
			}

			return 0;
		}

		return event.which;
	}
}, jQuery.event.addProp );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	/* eslint-disable max-len */

	// See https://github.com/eslint/eslint/issues/3229
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,

	/* eslint-enable */

	// Support: IE <=10 - 11, Edge 12 - 13
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

function manipulationTarget( elem, content ) {
	if ( jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return elem.getElementsByTagName( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.access( src );
		pdataCur = dataPriv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		isFunction = jQuery.isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( isFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( isFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rmargin = ( /^margin/ );

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		div.style.cssText =
			"box-sizing:border-box;" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;width:50%";
		div.innerHTML = "";
		documentElement.appendChild( container );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = divStyle.marginLeft === "2px";
		boxSizingReliableVal = divStyle.width === "4px";

		// Support: Android 4.0 - 4.3 only
		// Some styles come back with percentage values, even though they shouldn't
		div.style.marginRight = "50%";
		pixelMarginRightVal = divStyle.marginRight === "4px";

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	container.appendChild( div );

	jQuery.extend( support, {
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelMarginRight: function() {
			computeStyleTests();
			return pixelMarginRightVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,
		style = elem.style;

	computed = computed || getStyles( elem );

	// Support: IE <=9 only
	// getPropertyValue is only needed for .css('filter') (#12537)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

function setPositiveNumber( elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i,
		val = 0;

	// If we already have the right measurement, avoid augmentation
	if ( extra === ( isBorderBox ? "border" : "content" ) ) {
		i = 4;

	// Otherwise initialize for horizontal or vertical properties
	} else {
		i = name === "width" ? 1 : 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {

			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// At this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {

			// At this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// At this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var val,
		valueIsBorderBox = true,
		styles = getStyles( elem ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// Support: IE <=11 only
	// Running getBoundingClientRect on a disconnected node
	// in IE throws an error.
	if ( elem.getClientRects().length ) {
		val = elem.getBoundingClientRect()[ name ];
	}

	// Some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {

		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test( val ) ) {
			return val;
		}

		// Check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox &&
			( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// Use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				style[ name ] = value;
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}
		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						} ) :
						getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = extra && getStyles( elem ),
				subtract = extra && augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				);

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ name ] = value;
				value = jQuery.css( elem, name );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function raf() {
	if ( timerId ) {
		window.requestAnimationFrame( raf );
		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 13
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

			/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( jQuery.isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					jQuery.proxy( result.stop, result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	// Go to the end state if fx are off or if document is hidden
	if ( jQuery.fx.off || document.hidden ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	if ( timer() ) {
		jQuery.fx.start();
	} else {
		jQuery.timers.pop();
	}
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = window.requestAnimationFrame ?
			window.requestAnimationFrame( raf ) :
			window.setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	if ( window.cancelAnimationFrame ) {
		window.cancelAnimationFrame( timerId );
	} else {
		window.clearInterval( timerId );
	}

	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					jQuery.nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://html.spec.whatwg.org/multipage/infrastructure.html#strip-and-collapse-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnothtmlwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnothtmlwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( type === "string" ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = value.match( rnothtmlwhite ) || [];

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );




support.focusin = "onfocusin" in window;


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = jQuery.now();

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = jQuery.isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( jQuery.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( jQuery.isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 13
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce++ ) + uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( jQuery.isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" ).prop( {
					charset: s.scriptCharset,
					src: s.url
				} ).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var docElem, win, rect, doc,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		rect = elem.getBoundingClientRect();

		// Make sure element is not hidden (display: none)
		if ( rect.width || rect.height ) {
			doc = elem.ownerDocument;
			win = getWindow( doc );
			docElem = doc.documentElement;

			return {
				top: rect.top + win.pageYOffset - docElem.clientTop,
				left: rect.left + win.pageXOffset - docElem.clientLeft
			};
		}

		// Return zeros for disconnected and hidden elements (gh-2310)
		return rect;
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
		// because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume getBoundingClientRect is there when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {

			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset = {
				top: parentOffset.top + jQuery.css( offsetParent[ 0 ], "borderTopWidth", true ),
				left: parentOffset.left + jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true )
			};
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

jQuery.parseJSON = JSON.parse;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( true ) {
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
		return jQuery;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}





return jQuery;
} );


/***/ }),
/* 42 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 /* eslint-env node */


// SDP helpers.
var SDPUtils = {};

// Generate an alphanumeric identifier for cname or mids.
// TODO: use UUIDs instead? https://gist.github.com/jed/982883
SDPUtils.generateIdentifier = function() {
  return Math.random().toString(36).substr(2, 10);
};

// The RTCP CNAME used by all peerconnections from the same JS.
SDPUtils.localCName = SDPUtils.generateIdentifier();

// Splits SDP into lines, dealing with both CRLF and LF.
SDPUtils.splitLines = function(blob) {
  return blob.trim().split('\n').map(function(line) {
    return line.trim();
  });
};
// Splits SDP into sessionpart and mediasections. Ensures CRLF.
SDPUtils.splitSections = function(blob) {
  var parts = blob.split('\nm=');
  return parts.map(function(part, index) {
    return (index > 0 ? 'm=' + part : part).trim() + '\r\n';
  });
};

// Returns lines that start with a certain prefix.
SDPUtils.matchPrefix = function(blob, prefix) {
  return SDPUtils.splitLines(blob).filter(function(line) {
    return line.indexOf(prefix) === 0;
  });
};

// Parses an ICE candidate line. Sample input:
// candidate:702786350 2 udp 41819902 8.8.8.8 60769 typ relay raddr 8.8.8.8
// rport 55996"
SDPUtils.parseCandidate = function(line) {
  var parts;
  // Parse both variants.
  if (line.indexOf('a=candidate:') === 0) {
    parts = line.substring(12).split(' ');
  } else {
    parts = line.substring(10).split(' ');
  }

  var candidate = {
    foundation: parts[0],
    component: parts[1],
    protocol: parts[2].toLowerCase(),
    priority: parseInt(parts[3], 10),
    ip: parts[4],
    port: parseInt(parts[5], 10),
    // skip parts[6] == 'typ'
    type: parts[7]
  };

  for (var i = 8; i < parts.length; i += 2) {
    switch (parts[i]) {
      case 'raddr':
        candidate.relatedAddress = parts[i + 1];
        break;
      case 'rport':
        candidate.relatedPort = parseInt(parts[i + 1], 10);
        break;
      case 'tcptype':
        candidate.tcpType = parts[i + 1];
        break;
      default: // Unknown extensions are silently ignored.
        break;
    }
  }
  return candidate;
};

// Translates a candidate object into SDP candidate attribute.
SDPUtils.writeCandidate = function(candidate) {
  var sdp = [];
  sdp.push(candidate.foundation);
  sdp.push(candidate.component);
  sdp.push(candidate.protocol.toUpperCase());
  sdp.push(candidate.priority);
  sdp.push(candidate.ip);
  sdp.push(candidate.port);

  var type = candidate.type;
  sdp.push('typ');
  sdp.push(type);
  if (type !== 'host' && candidate.relatedAddress &&
      candidate.relatedPort) {
    sdp.push('raddr');
    sdp.push(candidate.relatedAddress); // was: relAddr
    sdp.push('rport');
    sdp.push(candidate.relatedPort); // was: relPort
  }
  if (candidate.tcpType && candidate.protocol.toLowerCase() === 'tcp') {
    sdp.push('tcptype');
    sdp.push(candidate.tcpType);
  }
  return 'candidate:' + sdp.join(' ');
};

// Parses an rtpmap line, returns RTCRtpCoddecParameters. Sample input:
// a=rtpmap:111 opus/48000/2
SDPUtils.parseRtpMap = function(line) {
  var parts = line.substr(9).split(' ');
  var parsed = {
    payloadType: parseInt(parts.shift(), 10) // was: id
  };

  parts = parts[0].split('/');

  parsed.name = parts[0];
  parsed.clockRate = parseInt(parts[1], 10); // was: clockrate
  // was: channels
  parsed.numChannels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
  return parsed;
};

// Generate an a=rtpmap line from RTCRtpCodecCapability or
// RTCRtpCodecParameters.
SDPUtils.writeRtpMap = function(codec) {
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  return 'a=rtpmap:' + pt + ' ' + codec.name + '/' + codec.clockRate +
      (codec.numChannels !== 1 ? '/' + codec.numChannels : '') + '\r\n';
};

// Parses an a=extmap line (headerextension from RFC 5285). Sample input:
// a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
SDPUtils.parseExtmap = function(line) {
  var parts = line.substr(9).split(' ');
  return {
    id: parseInt(parts[0], 10),
    uri: parts[1]
  };
};

// Generates a=extmap line from RTCRtpHeaderExtensionParameters or
// RTCRtpHeaderExtension.
SDPUtils.writeExtmap = function(headerExtension) {
  return 'a=extmap:' + (headerExtension.id || headerExtension.preferredId) +
       ' ' + headerExtension.uri + '\r\n';
};

// Parses an ftmp line, returns dictionary. Sample input:
// a=fmtp:96 vbr=on;cng=on
// Also deals with vbr=on; cng=on
SDPUtils.parseFmtp = function(line) {
  var parsed = {};
  var kv;
  var parts = line.substr(line.indexOf(' ') + 1).split(';');
  for (var j = 0; j < parts.length; j++) {
    kv = parts[j].trim().split('=');
    parsed[kv[0].trim()] = kv[1];
  }
  return parsed;
};

// Generates an a=ftmp line from RTCRtpCodecCapability or RTCRtpCodecParameters.
SDPUtils.writeFmtp = function(codec) {
  var line = '';
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  if (codec.parameters && Object.keys(codec.parameters).length) {
    var params = [];
    Object.keys(codec.parameters).forEach(function(param) {
      params.push(param + '=' + codec.parameters[param]);
    });
    line += 'a=fmtp:' + pt + ' ' + params.join(';') + '\r\n';
  }
  return line;
};

// Parses an rtcp-fb line, returns RTCPRtcpFeedback object. Sample input:
// a=rtcp-fb:98 nack rpsi
SDPUtils.parseRtcpFb = function(line) {
  var parts = line.substr(line.indexOf(' ') + 1).split(' ');
  return {
    type: parts.shift(),
    parameter: parts.join(' ')
  };
};
// Generate a=rtcp-fb lines from RTCRtpCodecCapability or RTCRtpCodecParameters.
SDPUtils.writeRtcpFb = function(codec) {
  var lines = '';
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
    // FIXME: special handling for trr-int?
    codec.rtcpFeedback.forEach(function(fb) {
      lines += 'a=rtcp-fb:' + pt + ' ' + fb.type +
      (fb.parameter && fb.parameter.length ? ' ' + fb.parameter : '') +
          '\r\n';
    });
  }
  return lines;
};

// Parses an RFC 5576 ssrc media attribute. Sample input:
// a=ssrc:3735928559 cname:something
SDPUtils.parseSsrcMedia = function(line) {
  var sp = line.indexOf(' ');
  var parts = {
    ssrc: parseInt(line.substr(7, sp - 7), 10)
  };
  var colon = line.indexOf(':', sp);
  if (colon > -1) {
    parts.attribute = line.substr(sp + 1, colon - sp - 1);
    parts.value = line.substr(colon + 1);
  } else {
    parts.attribute = line.substr(sp + 1);
  }
  return parts;
};

// Extracts DTLS parameters from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the fingerprint line as input. See also getIceParameters.
SDPUtils.getDtlsParameters = function(mediaSection, sessionpart) {
  var lines = SDPUtils.splitLines(mediaSection);
  // Search in session part, too.
  lines = lines.concat(SDPUtils.splitLines(sessionpart));
  var fpLine = lines.filter(function(line) {
    return line.indexOf('a=fingerprint:') === 0;
  })[0].substr(14);
  // Note: a=setup line is ignored since we use the 'auto' role.
  // Note2: 'algorithm' is not case sensitive except in Edge.
  var dtlsParameters = {
    role: 'auto',
    fingerprints: [{
      algorithm: fpLine.split(' ')[0].toLowerCase(),
      value: fpLine.split(' ')[1]
    }]
  };
  return dtlsParameters;
};

// Serializes DTLS parameters to SDP.
SDPUtils.writeDtlsParameters = function(params, setupType) {
  var sdp = 'a=setup:' + setupType + '\r\n';
  params.fingerprints.forEach(function(fp) {
    sdp += 'a=fingerprint:' + fp.algorithm + ' ' + fp.value + '\r\n';
  });
  return sdp;
};
// Parses ICE information from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the ice-ufrag and ice-pwd lines as input.
SDPUtils.getIceParameters = function(mediaSection, sessionpart) {
  var lines = SDPUtils.splitLines(mediaSection);
  // Search in session part, too.
  lines = lines.concat(SDPUtils.splitLines(sessionpart));
  var iceParameters = {
    usernameFragment: lines.filter(function(line) {
      return line.indexOf('a=ice-ufrag:') === 0;
    })[0].substr(12),
    password: lines.filter(function(line) {
      return line.indexOf('a=ice-pwd:') === 0;
    })[0].substr(10)
  };
  return iceParameters;
};

// Serializes ICE parameters to SDP.
SDPUtils.writeIceParameters = function(params) {
  return 'a=ice-ufrag:' + params.usernameFragment + '\r\n' +
      'a=ice-pwd:' + params.password + '\r\n';
};

// Parses the SDP media section and returns RTCRtpParameters.
SDPUtils.parseRtpParameters = function(mediaSection) {
  var description = {
    codecs: [],
    headerExtensions: [],
    fecMechanisms: [],
    rtcp: []
  };
  var lines = SDPUtils.splitLines(mediaSection);
  var mline = lines[0].split(' ');
  for (var i = 3; i < mline.length; i++) { // find all codecs from mline[3..]
    var pt = mline[i];
    var rtpmapline = SDPUtils.matchPrefix(
        mediaSection, 'a=rtpmap:' + pt + ' ')[0];
    if (rtpmapline) {
      var codec = SDPUtils.parseRtpMap(rtpmapline);
      var fmtps = SDPUtils.matchPrefix(
          mediaSection, 'a=fmtp:' + pt + ' ');
      // Only the first a=fmtp:<pt> is considered.
      codec.parameters = fmtps.length ? SDPUtils.parseFmtp(fmtps[0]) : {};
      codec.rtcpFeedback = SDPUtils.matchPrefix(
          mediaSection, 'a=rtcp-fb:' + pt + ' ')
        .map(SDPUtils.parseRtcpFb);
      description.codecs.push(codec);
      // parse FEC mechanisms from rtpmap lines.
      switch (codec.name.toUpperCase()) {
        case 'RED':
        case 'ULPFEC':
          description.fecMechanisms.push(codec.name.toUpperCase());
          break;
        default: // only RED and ULPFEC are recognized as FEC mechanisms.
          break;
      }
    }
  }
  SDPUtils.matchPrefix(mediaSection, 'a=extmap:').forEach(function(line) {
    description.headerExtensions.push(SDPUtils.parseExtmap(line));
  });
  // FIXME: parse rtcp.
  return description;
};

// Generates parts of the SDP media section describing the capabilities /
// parameters.
SDPUtils.writeRtpDescription = function(kind, caps) {
  var sdp = '';

  // Build the mline.
  sdp += 'm=' + kind + ' ';
  sdp += caps.codecs.length > 0 ? '9' : '0'; // reject if no codecs.
  sdp += ' UDP/TLS/RTP/SAVPF ';
  sdp += caps.codecs.map(function(codec) {
    if (codec.preferredPayloadType !== undefined) {
      return codec.preferredPayloadType;
    }
    return codec.payloadType;
  }).join(' ') + '\r\n';

  sdp += 'c=IN IP4 0.0.0.0\r\n';
  sdp += 'a=rtcp:9 IN IP4 0.0.0.0\r\n';

  // Add a=rtpmap lines for each codec. Also fmtp and rtcp-fb.
  caps.codecs.forEach(function(codec) {
    sdp += SDPUtils.writeRtpMap(codec);
    sdp += SDPUtils.writeFmtp(codec);
    sdp += SDPUtils.writeRtcpFb(codec);
  });
  var maxptime = 0;
  caps.codecs.forEach(function(codec) {
    if (codec.maxptime > maxptime) {
      maxptime = codec.maxptime;
    }
  });
  if (maxptime > 0) {
    sdp += 'a=maxptime:' + maxptime + '\r\n';
  }
  sdp += 'a=rtcp-mux\r\n';

  caps.headerExtensions.forEach(function(extension) {
    sdp += SDPUtils.writeExtmap(extension);
  });
  // FIXME: write fecMechanisms.
  return sdp;
};

// Parses the SDP media section and returns an array of
// RTCRtpEncodingParameters.
SDPUtils.parseRtpEncodingParameters = function(mediaSection) {
  var encodingParameters = [];
  var description = SDPUtils.parseRtpParameters(mediaSection);
  var hasRed = description.fecMechanisms.indexOf('RED') !== -1;
  var hasUlpfec = description.fecMechanisms.indexOf('ULPFEC') !== -1;

  // filter a=ssrc:... cname:, ignore PlanB-msid
  var ssrcs = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
  .map(function(line) {
    return SDPUtils.parseSsrcMedia(line);
  })
  .filter(function(parts) {
    return parts.attribute === 'cname';
  });
  var primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
  var secondarySsrc;

  var flows = SDPUtils.matchPrefix(mediaSection, 'a=ssrc-group:FID')
  .map(function(line) {
    var parts = line.split(' ');
    parts.shift();
    return parts.map(function(part) {
      return parseInt(part, 10);
    });
  });
  if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
    secondarySsrc = flows[0][1];
  }

  description.codecs.forEach(function(codec) {
    if (codec.name.toUpperCase() === 'RTX' && codec.parameters.apt) {
      var encParam = {
        ssrc: primarySsrc,
        codecPayloadType: parseInt(codec.parameters.apt, 10),
        rtx: {
          ssrc: secondarySsrc
        }
      };
      encodingParameters.push(encParam);
      if (hasRed) {
        encParam = JSON.parse(JSON.stringify(encParam));
        encParam.fec = {
          ssrc: secondarySsrc,
          mechanism: hasUlpfec ? 'red+ulpfec' : 'red'
        };
        encodingParameters.push(encParam);
      }
    }
  });
  if (encodingParameters.length === 0 && primarySsrc) {
    encodingParameters.push({
      ssrc: primarySsrc
    });
  }

  // we support both b=AS and b=TIAS but interpret AS as TIAS.
  var bandwidth = SDPUtils.matchPrefix(mediaSection, 'b=');
  if (bandwidth.length) {
    if (bandwidth[0].indexOf('b=TIAS:') === 0) {
      bandwidth = parseInt(bandwidth[0].substr(7), 10);
    } else if (bandwidth[0].indexOf('b=AS:') === 0) {
      bandwidth = parseInt(bandwidth[0].substr(5), 10);
    }
    encodingParameters.forEach(function(params) {
      params.maxBitrate = bandwidth;
    });
  }
  return encodingParameters;
};

// parses http://draft.ortc.org/#rtcrtcpparameters*
SDPUtils.parseRtcpParameters = function(mediaSection) {
  var rtcpParameters = {};

  var cname;
  // Gets the first SSRC. Note that with RTX there might be multiple
  // SSRCs.
  var remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
      .map(function(line) {
        return SDPUtils.parseSsrcMedia(line);
      })
      .filter(function(obj) {
        return obj.attribute === 'cname';
      })[0];
  if (remoteSsrc) {
    rtcpParameters.cname = remoteSsrc.value;
    rtcpParameters.ssrc = remoteSsrc.ssrc;
  }

  // Edge uses the compound attribute instead of reducedSize
  // compound is !reducedSize
  var rsize = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-rsize');
  rtcpParameters.reducedSize = rsize.length > 0;
  rtcpParameters.compound = rsize.length === 0;

  // parses the rtcp-mux attrіbute.
  // Note that Edge does not support unmuxed RTCP.
  var mux = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-mux');
  rtcpParameters.mux = mux.length > 0;

  return rtcpParameters;
};

// parses either a=msid: or a=ssrc:... msid lines an returns
// the id of the MediaStream and MediaStreamTrack.
SDPUtils.parseMsid = function(mediaSection) {
  var parts;
  var spec = SDPUtils.matchPrefix(mediaSection, 'a=msid:');
  if (spec.length === 1) {
    parts = spec[0].substr(7).split(' ');
    return {stream: parts[0], track: parts[1]};
  }
  var planB = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
  .map(function(line) {
    return SDPUtils.parseSsrcMedia(line);
  })
  .filter(function(parts) {
    return parts.attribute === 'msid';
  });
  if (planB.length > 0) {
    parts = planB[0].value.split(' ');
    return {stream: parts[0], track: parts[1]};
  }
};

SDPUtils.writeSessionBoilerplate = function() {
  // FIXME: sess-id should be an NTP timestamp.
  return 'v=0\r\n' +
      'o=thisisadapterortc 8169639915646943137 2 IN IP4 127.0.0.1\r\n' +
      's=-\r\n' +
      't=0 0\r\n';
};

SDPUtils.writeMediaSection = function(transceiver, caps, type, stream) {
  var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);

  // Map ICE parameters (ufrag, pwd) to SDP.
  sdp += SDPUtils.writeIceParameters(
      transceiver.iceGatherer.getLocalParameters());

  // Map DTLS parameters to SDP.
  sdp += SDPUtils.writeDtlsParameters(
      transceiver.dtlsTransport.getLocalParameters(),
      type === 'offer' ? 'actpass' : 'active');

  sdp += 'a=mid:' + transceiver.mid + '\r\n';

  if (transceiver.rtpSender && transceiver.rtpReceiver) {
    sdp += 'a=sendrecv\r\n';
  } else if (transceiver.rtpSender) {
    sdp += 'a=sendonly\r\n';
  } else if (transceiver.rtpReceiver) {
    sdp += 'a=recvonly\r\n';
  } else {
    sdp += 'a=inactive\r\n';
  }

  if (transceiver.rtpSender) {
    // spec.
    var msid = 'msid:' + stream.id + ' ' +
        transceiver.rtpSender.track.id + '\r\n';
    sdp += 'a=' + msid;

    // for Chrome.
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
        ' ' + msid;
    if (transceiver.sendEncodingParameters[0].rtx) {
      sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
          ' ' + msid;
      sdp += 'a=ssrc-group:FID ' +
          transceiver.sendEncodingParameters[0].ssrc + ' ' +
          transceiver.sendEncodingParameters[0].rtx.ssrc +
          '\r\n';
    }
  }
  // FIXME: this should be written by writeRtpDescription.
  sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
      ' cname:' + SDPUtils.localCName + '\r\n';
  if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
        ' cname:' + SDPUtils.localCName + '\r\n';
  }
  return sdp;
};

// Gets the direction from the mediaSection or the sessionpart.
SDPUtils.getDirection = function(mediaSection, sessionpart) {
  // Look for sendrecv, sendonly, recvonly, inactive, default to sendrecv.
  var lines = SDPUtils.splitLines(mediaSection);
  for (var i = 0; i < lines.length; i++) {
    switch (lines[i]) {
      case 'a=sendrecv':
      case 'a=sendonly':
      case 'a=recvonly':
      case 'a=inactive':
        return lines[i].substr(2);
      default:
        // FIXME: What should happen here?
    }
  }
  if (sessionpart) {
    return SDPUtils.getDirection(sessionpart);
  }
  return 'sendrecv';
};

SDPUtils.getKind = function(mediaSection) {
  var lines = SDPUtils.splitLines(mediaSection);
  var mline = lines[0].split(' ');
  return mline[0].substr(2);
};

SDPUtils.isRejected = function(mediaSection) {
  return mediaSection.split(' ', 2)[1] === '0';
};

// Expose public methods.
module.exports = SDPUtils;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var encode = __webpack_require__(6);
var alphabet = __webpack_require__(2);

// Ignore all milliseconds before a certain time to reduce the size of the date entropy without sacrificing uniqueness.
// This number should be updated every year or so to keep the generated id short.
// To regenerate `new Date() - 0` and bump the version. Always bump the version!
var REDUCE_TIME = 1459707606518;

// don't change unless we change the algos or REDUCE_TIME
// must be an integer and less than 16
var version = 6;

// Counter is used when shortid is called multiple times in one second.
var counter;

// Remember the last time shortid was called in case counter is needed.
var previousSeconds;

/**
 * Generate unique id
 * Returns string id
 */
function build(clusterWorkerId) {

    var str = '';

    var seconds = Math.floor((Date.now() - REDUCE_TIME) * 0.001);

    if (seconds === previousSeconds) {
        counter++;
    } else {
        counter = 0;
        previousSeconds = seconds;
    }

    str = str + encode(alphabet.lookup, version);
    str = str + encode(alphabet.lookup, clusterWorkerId);
    if (counter > 0) {
        str = str + encode(alphabet.lookup, counter);
    }
    str = str + encode(alphabet.lookup, seconds);

    return str;
}

module.exports = build;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var alphabet = __webpack_require__(2);

/**
 * Decode the id to get the version and worker
 * Mainly for debugging and testing.
 * @param id - the shortid-generated id.
 */
function decode(id) {
    var characters = alphabet.shuffled();
    return {
        version: characters.indexOf(id.substr(0, 1)) & 0x0f,
        worker: characters.indexOf(id.substr(1, 1)) & 0x0f
    };
}

module.exports = decode;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var alphabet = __webpack_require__(2);
var encode = __webpack_require__(6);
var decode = __webpack_require__(45);
var build = __webpack_require__(44);
var isValid = __webpack_require__(47);

// if you are using cluster or multiple servers use this to make each instance
// has a unique value for worker
// Note: I don't know if this is automatically set when using third
// party cluster solutions such as pm2.
var clusterWorkerId = __webpack_require__(50) || 0;

/**
 * Set the seed.
 * Highly recommended if you don't want people to try to figure out your id schema.
 * exposed as shortid.seed(int)
 * @param seed Integer value to seed the random alphabet.  ALWAYS USE THE SAME SEED or you might get overlaps.
 */
function seed(seedValue) {
    alphabet.seed(seedValue);
    return module.exports;
}

/**
 * Set the cluster worker or machine id
 * exposed as shortid.worker(int)
 * @param workerId worker must be positive integer.  Number less than 16 is recommended.
 * returns shortid module so it can be chained.
 */
function worker(workerId) {
    clusterWorkerId = workerId;
    return module.exports;
}

/**
 *
 * sets new characters to use in the alphabet
 * returns the shuffled alphabet
 */
function characters(newCharacters) {
    if (newCharacters !== undefined) {
        alphabet.characters(newCharacters);
    }

    return alphabet.shuffled();
}

/**
 * Generate unique id
 * Returns string id
 */
function generate() {
  return build(clusterWorkerId);
}

// Export all other functions as properties of the generate function
module.exports = generate;
module.exports.generate = generate;
module.exports.seed = seed;
module.exports.worker = worker;
module.exports.characters = characters;
module.exports.decode = decode;
module.exports.isValid = isValid;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var alphabet = __webpack_require__(2);

function isShortId(id) {
    if (!id || typeof id !== 'string' || id.length < 6 ) {
        return false;
    }

    var characters = alphabet.characters();
    var len = id.length;
    for(var i = 0; i < len;i++) {
        if (characters.indexOf(id[i]) === -1) {
            return false;
        }
    }
    return true;
}

module.exports = isShortId;


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var crypto = typeof window === 'object' && (window.crypto || window.msCrypto); // IE 11 uses window.msCrypto

function randomByte() {
    if (!crypto || !crypto.getRandomValues) {
        return Math.floor(Math.random() * 256) & 0x30;
    }
    var dest = new Uint8Array(1);
    crypto.getRandomValues(dest);
    return dest[0] & 0x30;
}

module.exports = randomByte;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Found this seed-based random generator somewhere
// Based on The Central Randomizer 1.3 (C) 1997 by Paul Houle (houle@msc.cornell.edu)

var seed = 1;

/**
 * return a random number based on a seed
 * @param seed
 * @returns {number}
 */
function getNextValue() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed/(233280.0);
}

function setSeed(_seed_) {
    seed = _seed_;
}

module.exports = {
    nextValue: getNextValue,
    seed: setSeed
};


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = 0;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */



// Shimming starts here.
(function() {
  // Utils.
  var utils = __webpack_require__(1);
  var logging = utils.log;
  var browserDetails = utils.browserDetails;
  // Export to the adapter global object visible in the browser.
  module.exports.browserDetails = browserDetails;
  module.exports.extractVersion = utils.extractVersion;
  module.exports.disableLog = utils.disableLog;

  // Uncomment the line below if you want logging to occur, including logging
  // for the switch statement below. Can also be turned on in the browser via
  // adapter.disableLog(false), but then logging from the switch statement below
  // will not appear.
  // require('./utils').disableLog(false);

  // Browser shims.
  var chromeShim = __webpack_require__(52) || null;
  var edgeShim = __webpack_require__(54) || null;
  var firefoxShim = __webpack_require__(56) || null;
  var safariShim = __webpack_require__(58) || null;

  // Shim browser if found.
  switch (browserDetails.browser) {
    case 'chrome':
      if (!chromeShim || !chromeShim.shimPeerConnection) {
        logging('Chrome shim is not included in this adapter release.');
        return;
      }
      logging('adapter.js shimming chrome.');
      // Export to the adapter global object visible in the browser.
      module.exports.browserShim = chromeShim;

      chromeShim.shimGetUserMedia();
      chromeShim.shimMediaStream();
      utils.shimCreateObjectURL();
      chromeShim.shimSourceObject();
      chromeShim.shimPeerConnection();
      chromeShim.shimOnTrack();
      chromeShim.shimGetSendersWithDtmf();
      break;
    case 'firefox':
      if (!firefoxShim || !firefoxShim.shimPeerConnection) {
        logging('Firefox shim is not included in this adapter release.');
        return;
      }
      logging('adapter.js shimming firefox.');
      // Export to the adapter global object visible in the browser.
      module.exports.browserShim = firefoxShim;

      firefoxShim.shimGetUserMedia();
      utils.shimCreateObjectURL();
      firefoxShim.shimSourceObject();
      firefoxShim.shimPeerConnection();
      firefoxShim.shimOnTrack();
      break;
    case 'edge':
      if (!edgeShim || !edgeShim.shimPeerConnection) {
        logging('MS edge shim is not included in this adapter release.');
        return;
      }
      logging('adapter.js shimming edge.');
      // Export to the adapter global object visible in the browser.
      module.exports.browserShim = edgeShim;

      edgeShim.shimGetUserMedia();
      utils.shimCreateObjectURL();
      edgeShim.shimPeerConnection();
      break;
    case 'safari':
      if (!safariShim) {
        logging('Safari shim is not included in this adapter release.');
        return;
      }
      logging('adapter.js shimming safari.');
      // Export to the adapter global object visible in the browser.
      module.exports.browserShim = safariShim;

      safariShim.shimGetUserMedia();
      break;
    default:
      logging('Unsupported browser!');
  }
})();


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */

var logging = __webpack_require__(1).log;
var browserDetails = __webpack_require__(1).browserDetails;

var chromeShim = {
  shimMediaStream: function() {
    window.MediaStream = window.MediaStream || window.webkitMediaStream;
  },

  shimOnTrack: function() {
    if (typeof window === 'object' && window.RTCPeerConnection && !('ontrack' in
        window.RTCPeerConnection.prototype)) {
      Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
        get: function() {
          return this._ontrack;
        },
        set: function(f) {
          var self = this;
          if (this._ontrack) {
            this.removeEventListener('track', this._ontrack);
            this.removeEventListener('addstream', this._ontrackpoly);
          }
          this.addEventListener('track', this._ontrack = f);
          this.addEventListener('addstream', this._ontrackpoly = function(e) {
            // onaddstream does not fire when a track is added to an existing
            // stream. But stream.onaddtrack is implemented so we use that.
            e.stream.addEventListener('addtrack', function(te) {
              var event = new Event('track');
              event.track = te.track;
              event.receiver = {track: te.track};
              event.streams = [e.stream];
              self.dispatchEvent(event);
            });
            e.stream.getTracks().forEach(function(track) {
              var event = new Event('track');
              event.track = track;
              event.receiver = {track: track};
              event.streams = [e.stream];
              this.dispatchEvent(event);
            }.bind(this));
          }.bind(this));
        }
      });
    }
  },

  shimGetSendersWithDtmf: function() {
    if (typeof window === 'object' && window.RTCPeerConnection &&
        !('getSenders' in RTCPeerConnection.prototype) &&
        'createDTMFSender' in RTCPeerConnection.prototype) {
      RTCPeerConnection.prototype.getSenders = function() {
        return this._senders;
      };
      var origAddStream = RTCPeerConnection.prototype.addStream;
      var origRemoveStream = RTCPeerConnection.prototype.removeStream;

      RTCPeerConnection.prototype.addStream = function(stream) {
        var pc = this;
        pc._senders = pc._senders || [];
        origAddStream.apply(pc, [stream]);
        stream.getTracks().forEach(function(track) {
          pc._senders.push({
            track: track,
            get dtmf() {
              if (this._dtmf === undefined) {
                if (track.kind === 'audio') {
                  this._dtmf = pc.createDTMFSender(track);
                } else {
                  this._dtmf = null;
                }
              }
              return this._dtmf;
            }
          });
        });
      };

      RTCPeerConnection.prototype.removeStream = function(stream) {
        var pc = this;
        pc._senders = pc._senders || [];
        origRemoveStream.apply(pc, [stream]);
        stream.getTracks().forEach(function(track) {
          var sender = pc._senders.find(function(s) {
            return s.track === track;
          });
          if (sender) {
            pc._senders.splice(pc._senders.indexOf(sender), 1); // remove sender
          }
        });
      };
    }
  },

  shimSourceObject: function() {
    if (typeof window === 'object') {
      if (window.HTMLMediaElement &&
        !('srcObject' in window.HTMLMediaElement.prototype)) {
        // Shim the srcObject property, once, when HTMLMediaElement is found.
        Object.defineProperty(window.HTMLMediaElement.prototype, 'srcObject', {
          get: function() {
            return this._srcObject;
          },
          set: function(stream) {
            var self = this;
            // Use _srcObject as a private property for this shim
            this._srcObject = stream;
            if (this.src) {
              URL.revokeObjectURL(this.src);
            }

            if (!stream) {
              this.src = '';
              return undefined;
            }
            this.src = URL.createObjectURL(stream);
            // We need to recreate the blob url when a track is added or
            // removed. Doing it manually since we want to avoid a recursion.
            stream.addEventListener('addtrack', function() {
              if (self.src) {
                URL.revokeObjectURL(self.src);
              }
              self.src = URL.createObjectURL(stream);
            });
            stream.addEventListener('removetrack', function() {
              if (self.src) {
                URL.revokeObjectURL(self.src);
              }
              self.src = URL.createObjectURL(stream);
            });
          }
        });
      }
    }
  },

  shimPeerConnection: function() {
    // The RTCPeerConnection object.
    if (!window.RTCPeerConnection) {
      window.RTCPeerConnection = function(pcConfig, pcConstraints) {
        // Translate iceTransportPolicy to iceTransports,
        // see https://code.google.com/p/webrtc/issues/detail?id=4869
        // this was fixed in M56 along with unprefixing RTCPeerConnection.
        logging('PeerConnection');
        if (pcConfig && pcConfig.iceTransportPolicy) {
          pcConfig.iceTransports = pcConfig.iceTransportPolicy;
        }

        return new webkitRTCPeerConnection(pcConfig, pcConstraints);
      };
      window.RTCPeerConnection.prototype = webkitRTCPeerConnection.prototype;
      // wrap static methods. Currently just generateCertificate.
      if (webkitRTCPeerConnection.generateCertificate) {
        Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
          get: function() {
            return webkitRTCPeerConnection.generateCertificate;
          }
        });
      }
    }

    var origGetStats = RTCPeerConnection.prototype.getStats;
    RTCPeerConnection.prototype.getStats = function(selector,
        successCallback, errorCallback) {
      var self = this;
      var args = arguments;

      // If selector is a function then we are in the old style stats so just
      // pass back the original getStats format to avoid breaking old users.
      if (arguments.length > 0 && typeof selector === 'function') {
        return origGetStats.apply(this, arguments);
      }

      // When spec-style getStats is supported, return those when called with
      // either no arguments or the selector argument is null.
      if (origGetStats.length === 0 && (arguments.length === 0 ||
          typeof arguments[0] !== 'function')) {
        return origGetStats.apply(this, []);
      }

      var fixChromeStats_ = function(response) {
        var standardReport = {};
        var reports = response.result();
        reports.forEach(function(report) {
          var standardStats = {
            id: report.id,
            timestamp: report.timestamp,
            type: {
              localcandidate: 'local-candidate',
              remotecandidate: 'remote-candidate'
            }[report.type] || report.type
          };
          report.names().forEach(function(name) {
            standardStats[name] = report.stat(name);
          });
          standardReport[standardStats.id] = standardStats;
        });

        return standardReport;
      };

      // shim getStats with maplike support
      var makeMapStats = function(stats) {
        return new Map(Object.keys(stats).map(function(key) {
          return[key, stats[key]];
        }));
      };

      if (arguments.length >= 2) {
        var successCallbackWrapper_ = function(response) {
          args[1](makeMapStats(fixChromeStats_(response)));
        };

        return origGetStats.apply(this, [successCallbackWrapper_,
            arguments[0]]);
      }

      // promise-support
      return new Promise(function(resolve, reject) {
        origGetStats.apply(self, [
          function(response) {
            resolve(makeMapStats(fixChromeStats_(response)));
          }, reject]);
      }).then(successCallback, errorCallback);
    };

    // add promise support -- natively available in Chrome 51
    if (browserDetails.version < 51) {
      ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
          .forEach(function(method) {
            var nativeMethod = RTCPeerConnection.prototype[method];
            RTCPeerConnection.prototype[method] = function() {
              var args = arguments;
              var self = this;
              var promise = new Promise(function(resolve, reject) {
                nativeMethod.apply(self, [args[0], resolve, reject]);
              });
              if (args.length < 2) {
                return promise;
              }
              return promise.then(function() {
                args[1].apply(null, []);
              },
              function(err) {
                if (args.length >= 3) {
                  args[2].apply(null, [err]);
                }
              });
            };
          });
    }

    // promise support for createOffer and createAnswer. Available (without
    // bugs) since M52: crbug/619289
    if (browserDetails.version < 52) {
      ['createOffer', 'createAnswer'].forEach(function(method) {
        var nativeMethod = RTCPeerConnection.prototype[method];
        RTCPeerConnection.prototype[method] = function() {
          var self = this;
          if (arguments.length < 1 || (arguments.length === 1 &&
              typeof arguments[0] === 'object')) {
            var opts = arguments.length === 1 ? arguments[0] : undefined;
            return new Promise(function(resolve, reject) {
              nativeMethod.apply(self, [resolve, reject, opts]);
            });
          }
          return nativeMethod.apply(this, arguments);
        };
      });
    }

    // shim implicit creation of RTCSessionDescription/RTCIceCandidate
    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
        .forEach(function(method) {
          var nativeMethod = RTCPeerConnection.prototype[method];
          RTCPeerConnection.prototype[method] = function() {
            arguments[0] = new ((method === 'addIceCandidate') ?
                RTCIceCandidate : RTCSessionDescription)(arguments[0]);
            return nativeMethod.apply(this, arguments);
          };
        });

    // support for addIceCandidate(null or undefined)
    var nativeAddIceCandidate =
        RTCPeerConnection.prototype.addIceCandidate;
    RTCPeerConnection.prototype.addIceCandidate = function() {
      if (!arguments[0]) {
        if (arguments[1]) {
          arguments[1].apply(null);
        }
        return Promise.resolve();
      }
      return nativeAddIceCandidate.apply(this, arguments);
    };
  }
};


// Expose public methods.
module.exports = {
  shimMediaStream: chromeShim.shimMediaStream,
  shimOnTrack: chromeShim.shimOnTrack,
  shimGetSendersWithDtmf: chromeShim.shimGetSendersWithDtmf,
  shimSourceObject: chromeShim.shimSourceObject,
  shimPeerConnection: chromeShim.shimPeerConnection,
  shimGetUserMedia: __webpack_require__(53)
};


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */

var logging = __webpack_require__(1).log;
var browserDetails = __webpack_require__(1).browserDetails;

// Expose public methods.
module.exports = function() {
  var constraintsToChrome_ = function(c) {
    if (typeof c !== 'object' || c.mandatory || c.optional) {
      return c;
    }
    var cc = {};
    Object.keys(c).forEach(function(key) {
      if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
        return;
      }
      var r = (typeof c[key] === 'object') ? c[key] : {ideal: c[key]};
      if (r.exact !== undefined && typeof r.exact === 'number') {
        r.min = r.max = r.exact;
      }
      var oldname_ = function(prefix, name) {
        if (prefix) {
          return prefix + name.charAt(0).toUpperCase() + name.slice(1);
        }
        return (name === 'deviceId') ? 'sourceId' : name;
      };
      if (r.ideal !== undefined) {
        cc.optional = cc.optional || [];
        var oc = {};
        if (typeof r.ideal === 'number') {
          oc[oldname_('min', key)] = r.ideal;
          cc.optional.push(oc);
          oc = {};
          oc[oldname_('max', key)] = r.ideal;
          cc.optional.push(oc);
        } else {
          oc[oldname_('', key)] = r.ideal;
          cc.optional.push(oc);
        }
      }
      if (r.exact !== undefined && typeof r.exact !== 'number') {
        cc.mandatory = cc.mandatory || {};
        cc.mandatory[oldname_('', key)] = r.exact;
      } else {
        ['min', 'max'].forEach(function(mix) {
          if (r[mix] !== undefined) {
            cc.mandatory = cc.mandatory || {};
            cc.mandatory[oldname_(mix, key)] = r[mix];
          }
        });
      }
    });
    if (c.advanced) {
      cc.optional = (cc.optional || []).concat(c.advanced);
    }
    return cc;
  };

  var shimConstraints_ = function(constraints, func) {
    constraints = JSON.parse(JSON.stringify(constraints));
    if (constraints && constraints.audio) {
      constraints.audio = constraintsToChrome_(constraints.audio);
    }
    if (constraints && typeof constraints.video === 'object') {
      // Shim facingMode for mobile, where it defaults to "user".
      var face = constraints.video.facingMode;
      face = face && ((typeof face === 'object') ? face : {ideal: face});
      var getSupportedFacingModeLies = browserDetails.version < 59;

      if ((face && (face.exact === 'user' || face.exact === 'environment' ||
                    face.ideal === 'user' || face.ideal === 'environment')) &&
          !(navigator.mediaDevices.getSupportedConstraints &&
            navigator.mediaDevices.getSupportedConstraints().facingMode &&
            !getSupportedFacingModeLies)) {
        delete constraints.video.facingMode;
        if (face.exact === 'environment' || face.ideal === 'environment') {
          // Look for "back" in label, or use last cam (typically back cam).
          return navigator.mediaDevices.enumerateDevices()
          .then(function(devices) {
            devices = devices.filter(function(d) {
              return d.kind === 'videoinput';
            });
            var back = devices.find(function(d) {
              return d.label.toLowerCase().indexOf('back') !== -1;
            }) || (devices.length && devices[devices.length - 1]);
            if (back) {
              constraints.video.deviceId = face.exact ? {exact: back.deviceId} :
                                                        {ideal: back.deviceId};
            }
            constraints.video = constraintsToChrome_(constraints.video);
            logging('chrome: ' + JSON.stringify(constraints));
            return func(constraints);
          });
        }
      }
      constraints.video = constraintsToChrome_(constraints.video);
    }
    logging('chrome: ' + JSON.stringify(constraints));
    return func(constraints);
  };

  var shimError_ = function(e) {
    return {
      name: {
        PermissionDeniedError: 'NotAllowedError',
        ConstraintNotSatisfiedError: 'OverconstrainedError'
      }[e.name] || e.name,
      message: e.message,
      constraint: e.constraintName,
      toString: function() {
        return this.name + (this.message && ': ') + this.message;
      }
    };
  };

  var getUserMedia_ = function(constraints, onSuccess, onError) {
    shimConstraints_(constraints, function(c) {
      navigator.webkitGetUserMedia(c, onSuccess, function(e) {
        onError(shimError_(e));
      });
    });
  };

  navigator.getUserMedia = getUserMedia_;

  // Returns the result of getUserMedia as a Promise.
  var getUserMediaPromise_ = function(constraints) {
    return new Promise(function(resolve, reject) {
      navigator.getUserMedia(constraints, resolve, reject);
    });
  };

  if (!navigator.mediaDevices) {
    navigator.mediaDevices = {
      getUserMedia: getUserMediaPromise_,
      enumerateDevices: function() {
        return new Promise(function(resolve) {
          var kinds = {audio: 'audioinput', video: 'videoinput'};
          return MediaStreamTrack.getSources(function(devices) {
            resolve(devices.map(function(device) {
              return {label: device.label,
                      kind: kinds[device.kind],
                      deviceId: device.id,
                      groupId: ''};
            }));
          });
        });
      },
      getSupportedConstraints: function() {
        return {
          deviceId: true, echoCancellation: true, facingMode: true,
          frameRate: true, height: true, width: true
        };
      }
    };
  }

  // A shim for getUserMedia method on the mediaDevices object.
  // TODO(KaptenJansson) remove once implemented in Chrome stable.
  if (!navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia = function(constraints) {
      return getUserMediaPromise_(constraints);
    };
  } else {
    // Even though Chrome 45 has navigator.mediaDevices and a getUserMedia
    // function which returns a Promise, it does not accept spec-style
    // constraints.
    var origGetUserMedia = navigator.mediaDevices.getUserMedia.
        bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function(cs) {
      return shimConstraints_(cs, function(c) {
        return origGetUserMedia(c).then(function(stream) {
          if (c.audio && !stream.getAudioTracks().length ||
              c.video && !stream.getVideoTracks().length) {
            stream.getTracks().forEach(function(track) {
              track.stop();
            });
            throw new DOMException('', 'NotFoundError');
          }
          return stream;
        }, function(e) {
          return Promise.reject(shimError_(e));
        });
      });
    };
  }

  // Dummy devicechange event methods.
  // TODO(KaptenJansson) remove once implemented in Chrome stable.
  if (typeof navigator.mediaDevices.addEventListener === 'undefined') {
    navigator.mediaDevices.addEventListener = function() {
      logging('Dummy mediaDevices.addEventListener called.');
    };
  }
  if (typeof navigator.mediaDevices.removeEventListener === 'undefined') {
    navigator.mediaDevices.removeEventListener = function() {
      logging('Dummy mediaDevices.removeEventListener called.');
    };
  }
};


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */


var SDPUtils = __webpack_require__(43);
var browserDetails = __webpack_require__(1).browserDetails;

// sort tracks such that they follow an a-v-a-v...
// pattern.
function sortTracks(tracks) {
  var audioTracks = tracks.filter(function(track) {
    return track.kind === 'audio';
  });
  var videoTracks = tracks.filter(function(track) {
    return track.kind === 'video';
  });
  tracks = [];
  while (audioTracks.length || videoTracks.length) {
    if (audioTracks.length) {
      tracks.push(audioTracks.shift());
    }
    if (videoTracks.length) {
      tracks.push(videoTracks.shift());
    }
  }
  return tracks;
}

// Edge does not like
// 1) stun:
// 2) turn: that does not have all of turn:host:port?transport=udp
// 3) turn: with ipv6 addresses
// 4) turn: occurring muliple times
function filterIceServers(iceServers) {
  var hasTurn = false;
  iceServers = JSON.parse(JSON.stringify(iceServers));
  return iceServers.filter(function(server) {
    if (server && (server.urls || server.url)) {
      var urls = server.urls || server.url;
      var isString = typeof urls === 'string';
      if (isString) {
        urls = [urls];
      }
      urls = urls.filter(function(url) {
        var validTurn = url.indexOf('turn:') === 0 &&
            url.indexOf('transport=udp') !== -1 &&
            url.indexOf('turn:[') === -1 &&
            !hasTurn;

        if (validTurn) {
          hasTurn = true;
          return true;
        }
        return url.indexOf('stun:') === 0 &&
            browserDetails.version >= 14393;
      });

      delete server.url;
      server.urls = isString ? urls[0] : urls;
      return !!urls.length;
    }
    return false;
  });
}

var edgeShim = {
  shimPeerConnection: function() {
    if (window.RTCIceGatherer) {
      // ORTC defines an RTCIceCandidate object but no constructor.
      // Not implemented in Edge.
      if (!window.RTCIceCandidate) {
        window.RTCIceCandidate = function(args) {
          return args;
        };
      }
      // ORTC does not have a session description object but
      // other browsers (i.e. Chrome) that will support both PC and ORTC
      // in the future might have this defined already.
      if (!window.RTCSessionDescription) {
        window.RTCSessionDescription = function(args) {
          return args;
        };
      }
      // this adds an additional event listener to MediaStrackTrack that signals
      // when a tracks enabled property was changed. Workaround for a bug in
      // addStream, see below. No longer required in 15025+
      if (browserDetails.version < 15025) {
        var origMSTEnabled = Object.getOwnPropertyDescriptor(
            MediaStreamTrack.prototype, 'enabled');
        Object.defineProperty(MediaStreamTrack.prototype, 'enabled', {
          set: function(value) {
            origMSTEnabled.set.call(this, value);
            var ev = new Event('enabled');
            ev.enabled = value;
            this.dispatchEvent(ev);
          }
        });
      }
    }

    window.RTCPeerConnection = function(config) {
      var self = this;

      var _eventTarget = document.createDocumentFragment();
      ['addEventListener', 'removeEventListener', 'dispatchEvent']
          .forEach(function(method) {
            self[method] = _eventTarget[method].bind(_eventTarget);
          });

      this.onicecandidate = null;
      this.onaddstream = null;
      this.ontrack = null;
      this.onremovestream = null;
      this.onsignalingstatechange = null;
      this.oniceconnectionstatechange = null;
      this.onicegatheringstatechange = null;
      this.onnegotiationneeded = null;
      this.ondatachannel = null;

      this.localStreams = [];
      this.remoteStreams = [];
      this.getLocalStreams = function() {
        return self.localStreams;
      };
      this.getRemoteStreams = function() {
        return self.remoteStreams;
      };

      this.localDescription = new RTCSessionDescription({
        type: '',
        sdp: ''
      });
      this.remoteDescription = new RTCSessionDescription({
        type: '',
        sdp: ''
      });
      this.signalingState = 'stable';
      this.iceConnectionState = 'new';
      this.iceGatheringState = 'new';

      this.iceOptions = {
        gatherPolicy: 'all',
        iceServers: []
      };
      if (config && config.iceTransportPolicy) {
        switch (config.iceTransportPolicy) {
          case 'all':
          case 'relay':
            this.iceOptions.gatherPolicy = config.iceTransportPolicy;
            break;
          default:
            // don't set iceTransportPolicy.
            break;
        }
      }
      this.usingBundle = config && config.bundlePolicy === 'max-bundle';

      if (config && config.iceServers) {
        this.iceOptions.iceServers = filterIceServers(config.iceServers);
      }
      this._config = config;

      // per-track iceGathers, iceTransports, dtlsTransports, rtpSenders, ...
      // everything that is needed to describe a SDP m-line.
      this.transceivers = [];

      // since the iceGatherer is currently created in createOffer but we
      // must not emit candidates until after setLocalDescription we buffer
      // them in this array.
      this._localIceCandidatesBuffer = [];
    };

    window.RTCPeerConnection.prototype._emitGatheringStateChange = function() {
      var event = new Event('icegatheringstatechange');
      this.dispatchEvent(event);
      if (this.onicegatheringstatechange !== null) {
        this.onicegatheringstatechange(event);
      }
    };

    window.RTCPeerConnection.prototype._emitBufferedCandidates = function() {
      var self = this;
      var sections = SDPUtils.splitSections(self.localDescription.sdp);
      // FIXME: need to apply ice candidates in a way which is async but
      // in-order
      this._localIceCandidatesBuffer.forEach(function(event) {
        var end = !event.candidate || Object.keys(event.candidate).length === 0;
        if (end) {
          for (var j = 1; j < sections.length; j++) {
            if (sections[j].indexOf('\r\na=end-of-candidates\r\n') === -1) {
              sections[j] += 'a=end-of-candidates\r\n';
            }
          }
        } else {
          sections[event.candidate.sdpMLineIndex + 1] +=
              'a=' + event.candidate.candidate + '\r\n';
        }
        self.localDescription.sdp = sections.join('');
        self.dispatchEvent(event);
        if (self.onicecandidate !== null) {
          self.onicecandidate(event);
        }
        if (!event.candidate && self.iceGatheringState !== 'complete') {
          var complete = self.transceivers.every(function(transceiver) {
            return transceiver.iceGatherer &&
                transceiver.iceGatherer.state === 'completed';
          });
          if (complete && self.iceGatheringStateChange !== 'complete') {
            self.iceGatheringState = 'complete';
            self._emitGatheringStateChange();
          }
        }
      });
      this._localIceCandidatesBuffer = [];
    };

    window.RTCPeerConnection.prototype.getConfiguration = function() {
      return this._config;
    };

    window.RTCPeerConnection.prototype.addStream = function(stream) {
      if (browserDetails.version >= 15025) {
        this.localStreams.push(stream);
      } else {
        // Clone is necessary for local demos mostly, attaching directly
        // to two different senders does not work (build 10547).
        // Fixed in 15025 (or earlier)
        var clonedStream = stream.clone();
        stream.getTracks().forEach(function(track, idx) {
          var clonedTrack = clonedStream.getTracks()[idx];
          track.addEventListener('enabled', function(event) {
            clonedTrack.enabled = event.enabled;
          });
        });
        this.localStreams.push(clonedStream);
      }
      this._maybeFireNegotiationNeeded();
    };

    window.RTCPeerConnection.prototype.removeStream = function(stream) {
      var idx = this.localStreams.indexOf(stream);
      if (idx > -1) {
        this.localStreams.splice(idx, 1);
        this._maybeFireNegotiationNeeded();
      }
    };

    window.RTCPeerConnection.prototype.getSenders = function() {
      return this.transceivers.filter(function(transceiver) {
        return !!transceiver.rtpSender;
      })
      .map(function(transceiver) {
        return transceiver.rtpSender;
      });
    };

    window.RTCPeerConnection.prototype.getReceivers = function() {
      return this.transceivers.filter(function(transceiver) {
        return !!transceiver.rtpReceiver;
      })
      .map(function(transceiver) {
        return transceiver.rtpReceiver;
      });
    };

    // Determines the intersection of local and remote capabilities.
    window.RTCPeerConnection.prototype._getCommonCapabilities =
        function(localCapabilities, remoteCapabilities) {
          var commonCapabilities = {
            codecs: [],
            headerExtensions: [],
            fecMechanisms: []
          };

          var findCodecByPayloadType = function(pt, codecs) {
            pt = parseInt(pt, 10);
            for (var i = 0; i < codecs.length; i++) {
              if (codecs[i].payloadType === pt ||
                  codecs[i].preferredPayloadType === pt) {
                return codecs[i];
              }
            }
          };

          var rtxCapabilityMatches = function(lRtx, rRtx, lCodecs, rCodecs) {
            var lCodec = findCodecByPayloadType(lRtx.parameters.apt, lCodecs);
            var rCodec = findCodecByPayloadType(rRtx.parameters.apt, rCodecs);
            return lCodec && rCodec &&
                lCodec.name.toLowerCase() === rCodec.name.toLowerCase();
          };

          localCapabilities.codecs.forEach(function(lCodec) {
            for (var i = 0; i < remoteCapabilities.codecs.length; i++) {
              var rCodec = remoteCapabilities.codecs[i];
              if (lCodec.name.toLowerCase() === rCodec.name.toLowerCase() &&
                  lCodec.clockRate === rCodec.clockRate) {
                if (lCodec.name.toLowerCase() === 'rtx' &&
                    lCodec.parameters && rCodec.parameters.apt) {
                  // for RTX we need to find the local rtx that has a apt
                  // which points to the same local codec as the remote one.
                  if (!rtxCapabilityMatches(lCodec, rCodec,
                      localCapabilities.codecs, remoteCapabilities.codecs)) {
                    continue;
                  }
                }
                rCodec = JSON.parse(JSON.stringify(rCodec)); // deepcopy
                // number of channels is the highest common number of channels
                rCodec.numChannels = Math.min(lCodec.numChannels,
                    rCodec.numChannels);
                // push rCodec so we reply with offerer payload type
                commonCapabilities.codecs.push(rCodec);

                // determine common feedback mechanisms
                rCodec.rtcpFeedback = rCodec.rtcpFeedback.filter(function(fb) {
                  for (var j = 0; j < lCodec.rtcpFeedback.length; j++) {
                    if (lCodec.rtcpFeedback[j].type === fb.type &&
                        lCodec.rtcpFeedback[j].parameter === fb.parameter) {
                      return true;
                    }
                  }
                  return false;
                });
                // FIXME: also need to determine .parameters
                //  see https://github.com/openpeer/ortc/issues/569
                break;
              }
            }
          });

          localCapabilities.headerExtensions
              .forEach(function(lHeaderExtension) {
                for (var i = 0; i < remoteCapabilities.headerExtensions.length;
                     i++) {
                  var rHeaderExtension = remoteCapabilities.headerExtensions[i];
                  if (lHeaderExtension.uri === rHeaderExtension.uri) {
                    commonCapabilities.headerExtensions.push(rHeaderExtension);
                    break;
                  }
                }
              });

          // FIXME: fecMechanisms
          return commonCapabilities;
        };

    // Create ICE gatherer, ICE transport and DTLS transport.
    window.RTCPeerConnection.prototype._createIceAndDtlsTransports =
        function(mid, sdpMLineIndex) {
          var self = this;
          var iceGatherer = new RTCIceGatherer(self.iceOptions);
          var iceTransport = new RTCIceTransport(iceGatherer);
          iceGatherer.onlocalcandidate = function(evt) {
            var event = new Event('icecandidate');
            event.candidate = {sdpMid: mid, sdpMLineIndex: sdpMLineIndex};

            var cand = evt.candidate;
            var end = !cand || Object.keys(cand).length === 0;
            // Edge emits an empty object for RTCIceCandidateComplete‥
            if (end) {
              // polyfill since RTCIceGatherer.state is not implemented in
              // Edge 10547 yet.
              if (iceGatherer.state === undefined) {
                iceGatherer.state = 'completed';
              }
            } else {
              // RTCIceCandidate doesn't have a component, needs to be added
              cand.component = iceTransport.component === 'RTCP' ? 2 : 1;
              event.candidate.candidate = SDPUtils.writeCandidate(cand);
            }

            // update local description.
            var sections = SDPUtils.splitSections(self.localDescription.sdp);
            if (!end) {
              sections[event.candidate.sdpMLineIndex + 1] +=
                  'a=' + event.candidate.candidate + '\r\n';
            } else {
              sections[event.candidate.sdpMLineIndex + 1] +=
                  'a=end-of-candidates\r\n';
            }
            self.localDescription.sdp = sections.join('');
            var transceivers = self._pendingOffer ? self._pendingOffer :
                self.transceivers;
            var complete = transceivers.every(function(transceiver) {
              return transceiver.iceGatherer &&
                  transceiver.iceGatherer.state === 'completed';
            });

            // Emit candidate if localDescription is set.
            // Also emits null candidate when all gatherers are complete.
            switch (self.iceGatheringState) {
              case 'new':
                if (!end) {
                  self._localIceCandidatesBuffer.push(event);
                }
                if (end && complete) {
                  self._localIceCandidatesBuffer.push(
                      new Event('icecandidate'));
                }
                break;
              case 'gathering':
                self._emitBufferedCandidates();
                if (!end) {
                  self.dispatchEvent(event);
                  if (self.onicecandidate !== null) {
                    self.onicecandidate(event);
                  }
                }
                if (complete) {
                  self.dispatchEvent(new Event('icecandidate'));
                  if (self.onicecandidate !== null) {
                    self.onicecandidate(new Event('icecandidate'));
                  }
                  self.iceGatheringState = 'complete';
                  self._emitGatheringStateChange();
                }
                break;
              case 'complete':
                // should not happen... currently!
                break;
              default: // no-op.
                break;
            }
          };
          iceTransport.onicestatechange = function() {
            self._updateConnectionState();
          };

          var dtlsTransport = new RTCDtlsTransport(iceTransport);
          dtlsTransport.ondtlsstatechange = function() {
            self._updateConnectionState();
          };
          dtlsTransport.onerror = function() {
            // onerror does not set state to failed by itself.
            dtlsTransport.state = 'failed';
            self._updateConnectionState();
          };

          return {
            iceGatherer: iceGatherer,
            iceTransport: iceTransport,
            dtlsTransport: dtlsTransport
          };
        };

    // Start the RTP Sender and Receiver for a transceiver.
    window.RTCPeerConnection.prototype._transceive = function(transceiver,
        send, recv) {
      var params = this._getCommonCapabilities(transceiver.localCapabilities,
          transceiver.remoteCapabilities);
      if (send && transceiver.rtpSender) {
        params.encodings = transceiver.sendEncodingParameters;
        params.rtcp = {
          cname: SDPUtils.localCName
        };
        if (transceiver.recvEncodingParameters.length) {
          params.rtcp.ssrc = transceiver.recvEncodingParameters[0].ssrc;
        }
        transceiver.rtpSender.send(params);
      }
      if (recv && transceiver.rtpReceiver) {
        // remove RTX field in Edge 14942
        if (transceiver.kind === 'video'
            && transceiver.recvEncodingParameters
            && browserDetails.version < 15019) {
          transceiver.recvEncodingParameters.forEach(function(p) {
            delete p.rtx;
          });
        }
        params.encodings = transceiver.recvEncodingParameters;
        params.rtcp = {
          cname: transceiver.cname
        };
        if (transceiver.sendEncodingParameters.length) {
          params.rtcp.ssrc = transceiver.sendEncodingParameters[0].ssrc;
        }
        transceiver.rtpReceiver.receive(params);
      }
    };

    window.RTCPeerConnection.prototype.setLocalDescription =
        function(description) {
          var self = this;
          var sections;
          var sessionpart;
          if (description.type === 'offer') {
            // FIXME: What was the purpose of this empty if statement?
            // if (!this._pendingOffer) {
            // } else {
            if (this._pendingOffer) {
              // VERY limited support for SDP munging. Limited to:
              // * changing the order of codecs
              sections = SDPUtils.splitSections(description.sdp);
              sessionpart = sections.shift();
              sections.forEach(function(mediaSection, sdpMLineIndex) {
                var caps = SDPUtils.parseRtpParameters(mediaSection);
                self._pendingOffer[sdpMLineIndex].localCapabilities = caps;
              });
              this.transceivers = this._pendingOffer;
              delete this._pendingOffer;
            }
          } else if (description.type === 'answer') {
            sections = SDPUtils.splitSections(self.remoteDescription.sdp);
            sessionpart = sections.shift();
            var isIceLite = SDPUtils.matchPrefix(sessionpart,
                'a=ice-lite').length > 0;
            sections.forEach(function(mediaSection, sdpMLineIndex) {
              var transceiver = self.transceivers[sdpMLineIndex];
              var iceGatherer = transceiver.iceGatherer;
              var iceTransport = transceiver.iceTransport;
              var dtlsTransport = transceiver.dtlsTransport;
              var localCapabilities = transceiver.localCapabilities;
              var remoteCapabilities = transceiver.remoteCapabilities;

              var rejected = mediaSection.split('\n', 1)[0]
                  .split(' ', 2)[1] === '0';

              if (!rejected && !transceiver.isDatachannel) {
                var remoteIceParameters = SDPUtils.getIceParameters(
                    mediaSection, sessionpart);
                var remoteDtlsParameters = SDPUtils.getDtlsParameters(
                    mediaSection, sessionpart);
                if (isIceLite) {
                  remoteDtlsParameters.role = 'server';
                }

                if (!self.usingBundle || sdpMLineIndex === 0) {
                  iceTransport.start(iceGatherer, remoteIceParameters,
                      isIceLite ? 'controlling' : 'controlled');
                  dtlsTransport.start(remoteDtlsParameters);
                }

                // Calculate intersection of capabilities.
                var params = self._getCommonCapabilities(localCapabilities,
                    remoteCapabilities);

                // Start the RTCRtpSender. The RTCRtpReceiver for this
                // transceiver has already been started in setRemoteDescription.
                self._transceive(transceiver,
                    params.codecs.length > 0,
                    false);
              }
            });
          }

          this.localDescription = {
            type: description.type,
            sdp: description.sdp
          };
          switch (description.type) {
            case 'offer':
              this._updateSignalingState('have-local-offer');
              break;
            case 'answer':
              this._updateSignalingState('stable');
              break;
            default:
              throw new TypeError('unsupported type "' + description.type +
                  '"');
          }

          // If a success callback was provided, emit ICE candidates after it
          // has been executed. Otherwise, emit callback after the Promise is
          // resolved.
          var hasCallback = arguments.length > 1 &&
            typeof arguments[1] === 'function';
          if (hasCallback) {
            var cb = arguments[1];
            window.setTimeout(function() {
              cb();
              if (self.iceGatheringState === 'new') {
                self.iceGatheringState = 'gathering';
                self._emitGatheringStateChange();
              }
              self._emitBufferedCandidates();
            }, 0);
          }
          var p = Promise.resolve();
          p.then(function() {
            if (!hasCallback) {
              if (self.iceGatheringState === 'new') {
                self.iceGatheringState = 'gathering';
                self._emitGatheringStateChange();
              }
              // Usually candidates will be emitted earlier.
              window.setTimeout(self._emitBufferedCandidates.bind(self), 500);
            }
          });
          return p;
        };

    window.RTCPeerConnection.prototype.setRemoteDescription =
        function(description) {
          var self = this;
          var stream = new MediaStream();
          var receiverList = [];
          var sections = SDPUtils.splitSections(description.sdp);
          var sessionpart = sections.shift();
          var isIceLite = SDPUtils.matchPrefix(sessionpart,
              'a=ice-lite').length > 0;
          this.usingBundle = SDPUtils.matchPrefix(sessionpart,
              'a=group:BUNDLE ').length > 0;
          sections.forEach(function(mediaSection, sdpMLineIndex) {
            var lines = SDPUtils.splitLines(mediaSection);
            var mline = lines[0].substr(2).split(' ');
            var kind = mline[0];
            var rejected = mline[1] === '0';
            var direction = SDPUtils.getDirection(mediaSection, sessionpart);

            var mid = SDPUtils.matchPrefix(mediaSection, 'a=mid:');
            if (mid.length) {
              mid = mid[0].substr(6);
            } else {
              mid = SDPUtils.generateIdentifier();
            }

            // Reject datachannels which are not implemented yet.
            if (kind === 'application' && mline[2] === 'DTLS/SCTP') {
              self.transceivers[sdpMLineIndex] = {
                mid: mid,
                isDatachannel: true
              };
              return;
            }

            var transceiver;
            var iceGatherer;
            var iceTransport;
            var dtlsTransport;
            var rtpSender;
            var rtpReceiver;
            var sendEncodingParameters;
            var recvEncodingParameters;
            var localCapabilities;

            var track;
            // FIXME: ensure the mediaSection has rtcp-mux set.
            var remoteCapabilities = SDPUtils.parseRtpParameters(mediaSection);
            var remoteIceParameters;
            var remoteDtlsParameters;
            if (!rejected) {
              remoteIceParameters = SDPUtils.getIceParameters(mediaSection,
                  sessionpart);
              remoteDtlsParameters = SDPUtils.getDtlsParameters(mediaSection,
                  sessionpart);
              remoteDtlsParameters.role = 'client';
            }
            recvEncodingParameters =
                SDPUtils.parseRtpEncodingParameters(mediaSection);

            var cname;
            // Gets the first SSRC. Note that with RTX there might be multiple
            // SSRCs.
            var remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
                .map(function(line) {
                  return SDPUtils.parseSsrcMedia(line);
                })
                .filter(function(obj) {
                  return obj.attribute === 'cname';
                })[0];
            if (remoteSsrc) {
              cname = remoteSsrc.value;
            }

            var isComplete = SDPUtils.matchPrefix(mediaSection,
                'a=end-of-candidates', sessionpart).length > 0;
            var cands = SDPUtils.matchPrefix(mediaSection, 'a=candidate:')
                .map(function(cand) {
                  return SDPUtils.parseCandidate(cand);
                })
                .filter(function(cand) {
                  return cand.component === '1';
                });
            if (description.type === 'offer' && !rejected) {
              var transports = self.usingBundle && sdpMLineIndex > 0 ? {
                iceGatherer: self.transceivers[0].iceGatherer,
                iceTransport: self.transceivers[0].iceTransport,
                dtlsTransport: self.transceivers[0].dtlsTransport
              } : self._createIceAndDtlsTransports(mid, sdpMLineIndex);

              if (isComplete && (!self.usingBundle || sdpMLineIndex === 0)) {
                transports.iceTransport.setRemoteCandidates(cands);
              }

              localCapabilities = RTCRtpReceiver.getCapabilities(kind);

              // filter RTX until additional stuff needed for RTX is implemented
              // in adapter.js
              if (browserDetails.version < 15019) {
                localCapabilities.codecs = localCapabilities.codecs.filter(
                    function(codec) {
                      return codec.name !== 'rtx';
                    });
              }

              sendEncodingParameters = [{
                ssrc: (2 * sdpMLineIndex + 2) * 1001
              }];

              if (direction === 'sendrecv' || direction === 'sendonly') {
                rtpReceiver = new RTCRtpReceiver(transports.dtlsTransport,
                    kind);

                track = rtpReceiver.track;
                receiverList.push([track, rtpReceiver]);
                // FIXME: not correct when there are multiple streams but that
                // is not currently supported in this shim.
                stream.addTrack(track);
              }

              // FIXME: look at direction.
              if (self.localStreams.length > 0 &&
                  self.localStreams[0].getTracks().length >= sdpMLineIndex) {
                var localTrack;
                if (kind === 'audio') {
                  localTrack = self.localStreams[0].getAudioTracks()[0];
                } else if (kind === 'video') {
                  localTrack = self.localStreams[0].getVideoTracks()[0];
                }
                if (localTrack) {
                  // add RTX
                  if (browserDetails.version >= 15019 && kind === 'video') {
                    sendEncodingParameters[0].rtx = {
                      ssrc: (2 * sdpMLineIndex + 2) * 1001 + 1
                    };
                  }
                  rtpSender = new RTCRtpSender(localTrack,
                      transports.dtlsTransport);
                }
              }

              self.transceivers[sdpMLineIndex] = {
                iceGatherer: transports.iceGatherer,
                iceTransport: transports.iceTransport,
                dtlsTransport: transports.dtlsTransport,
                localCapabilities: localCapabilities,
                remoteCapabilities: remoteCapabilities,
                rtpSender: rtpSender,
                rtpReceiver: rtpReceiver,
                kind: kind,
                mid: mid,
                cname: cname,
                sendEncodingParameters: sendEncodingParameters,
                recvEncodingParameters: recvEncodingParameters
              };
              // Start the RTCRtpReceiver now. The RTPSender is started in
              // setLocalDescription.
              self._transceive(self.transceivers[sdpMLineIndex],
                  false,
                  direction === 'sendrecv' || direction === 'sendonly');
            } else if (description.type === 'answer' && !rejected) {
              transceiver = self.transceivers[sdpMLineIndex];
              iceGatherer = transceiver.iceGatherer;
              iceTransport = transceiver.iceTransport;
              dtlsTransport = transceiver.dtlsTransport;
              rtpSender = transceiver.rtpSender;
              rtpReceiver = transceiver.rtpReceiver;
              sendEncodingParameters = transceiver.sendEncodingParameters;
              localCapabilities = transceiver.localCapabilities;

              self.transceivers[sdpMLineIndex].recvEncodingParameters =
                  recvEncodingParameters;
              self.transceivers[sdpMLineIndex].remoteCapabilities =
                  remoteCapabilities;
              self.transceivers[sdpMLineIndex].cname = cname;

              if ((isIceLite || isComplete) && cands.length) {
                iceTransport.setRemoteCandidates(cands);
              }
              if (!self.usingBundle || sdpMLineIndex === 0) {
                iceTransport.start(iceGatherer, remoteIceParameters,
                    'controlling');
                dtlsTransport.start(remoteDtlsParameters);
              }

              self._transceive(transceiver,
                  direction === 'sendrecv' || direction === 'recvonly',
                  direction === 'sendrecv' || direction === 'sendonly');

              if (rtpReceiver &&
                  (direction === 'sendrecv' || direction === 'sendonly')) {
                track = rtpReceiver.track;
                receiverList.push([track, rtpReceiver]);
                stream.addTrack(track);
              } else {
                // FIXME: actually the receiver should be created later.
                delete transceiver.rtpReceiver;
              }
            }
          });

          this.remoteDescription = {
            type: description.type,
            sdp: description.sdp
          };
          switch (description.type) {
            case 'offer':
              this._updateSignalingState('have-remote-offer');
              break;
            case 'answer':
              this._updateSignalingState('stable');
              break;
            default:
              throw new TypeError('unsupported type "' + description.type +
                  '"');
          }
          if (stream.getTracks().length) {
            self.remoteStreams.push(stream);
            window.setTimeout(function() {
              var event = new Event('addstream');
              event.stream = stream;
              self.dispatchEvent(event);
              if (self.onaddstream !== null) {
                window.setTimeout(function() {
                  self.onaddstream(event);
                }, 0);
              }

              receiverList.forEach(function(item) {
                var track = item[0];
                var receiver = item[1];
                var trackEvent = new Event('track');
                trackEvent.track = track;
                trackEvent.receiver = receiver;
                trackEvent.streams = [stream];
                self.dispatchEvent(trackEvent);
                if (self.ontrack !== null) {
                  window.setTimeout(function() {
                    self.ontrack(trackEvent);
                  }, 0);
                }
              });
            }, 0);
          }
          if (arguments.length > 1 && typeof arguments[1] === 'function') {
            window.setTimeout(arguments[1], 0);
          }
          return Promise.resolve();
        };

    window.RTCPeerConnection.prototype.close = function() {
      this.transceivers.forEach(function(transceiver) {
        /* not yet
        if (transceiver.iceGatherer) {
          transceiver.iceGatherer.close();
        }
        */
        if (transceiver.iceTransport) {
          transceiver.iceTransport.stop();
        }
        if (transceiver.dtlsTransport) {
          transceiver.dtlsTransport.stop();
        }
        if (transceiver.rtpSender) {
          transceiver.rtpSender.stop();
        }
        if (transceiver.rtpReceiver) {
          transceiver.rtpReceiver.stop();
        }
      });
      // FIXME: clean up tracks, local streams, remote streams, etc
      this._updateSignalingState('closed');
    };

    // Update the signaling state.
    window.RTCPeerConnection.prototype._updateSignalingState =
        function(newState) {
          this.signalingState = newState;
          var event = new Event('signalingstatechange');
          this.dispatchEvent(event);
          if (this.onsignalingstatechange !== null) {
            this.onsignalingstatechange(event);
          }
        };

    // Determine whether to fire the negotiationneeded event.
    window.RTCPeerConnection.prototype._maybeFireNegotiationNeeded =
        function() {
          // Fire away (for now).
          var event = new Event('negotiationneeded');
          this.dispatchEvent(event);
          if (this.onnegotiationneeded !== null) {
            this.onnegotiationneeded(event);
          }
        };

    // Update the connection state.
    window.RTCPeerConnection.prototype._updateConnectionState = function() {
      var self = this;
      var newState;
      var states = {
        'new': 0,
        closed: 0,
        connecting: 0,
        checking: 0,
        connected: 0,
        completed: 0,
        failed: 0
      };
      this.transceivers.forEach(function(transceiver) {
        states[transceiver.iceTransport.state]++;
        states[transceiver.dtlsTransport.state]++;
      });
      // ICETransport.completed and connected are the same for this purpose.
      states.connected += states.completed;

      newState = 'new';
      if (states.failed > 0) {
        newState = 'failed';
      } else if (states.connecting > 0 || states.checking > 0) {
        newState = 'connecting';
      } else if (states.disconnected > 0) {
        newState = 'disconnected';
      } else if (states.new > 0) {
        newState = 'new';
      } else if (states.connected > 0 || states.completed > 0) {
        newState = 'connected';
      }

      if (newState !== self.iceConnectionState) {
        self.iceConnectionState = newState;
        var event = new Event('iceconnectionstatechange');
        this.dispatchEvent(event);
        if (this.oniceconnectionstatechange !== null) {
          this.oniceconnectionstatechange(event);
        }
      }
    };

    window.RTCPeerConnection.prototype.createOffer = function() {
      var self = this;
      if (this._pendingOffer) {
        throw new Error('createOffer called while there is a pending offer.');
      }
      var offerOptions;
      if (arguments.length === 1 && typeof arguments[0] !== 'function') {
        offerOptions = arguments[0];
      } else if (arguments.length === 3) {
        offerOptions = arguments[2];
      }

      var tracks = [];
      var numAudioTracks = 0;
      var numVideoTracks = 0;
      // Default to sendrecv.
      if (this.localStreams.length) {
        numAudioTracks = this.localStreams[0].getAudioTracks().length;
        numVideoTracks = this.localStreams[0].getVideoTracks().length;
      }
      // Determine number of audio and video tracks we need to send/recv.
      if (offerOptions) {
        // Reject Chrome legacy constraints.
        if (offerOptions.mandatory || offerOptions.optional) {
          throw new TypeError(
              'Legacy mandatory/optional constraints not supported.');
        }
        if (offerOptions.offerToReceiveAudio !== undefined) {
          numAudioTracks = offerOptions.offerToReceiveAudio;
        }
        if (offerOptions.offerToReceiveVideo !== undefined) {
          numVideoTracks = offerOptions.offerToReceiveVideo;
        }
      }
      if (this.localStreams.length) {
        // Push local streams.
        this.localStreams[0].getTracks().forEach(function(track) {
          tracks.push({
            kind: track.kind,
            track: track,
            wantReceive: track.kind === 'audio' ?
                numAudioTracks > 0 : numVideoTracks > 0
          });
          if (track.kind === 'audio') {
            numAudioTracks--;
          } else if (track.kind === 'video') {
            numVideoTracks--;
          }
        });
      }
      // Create M-lines for recvonly streams.
      while (numAudioTracks > 0 || numVideoTracks > 0) {
        if (numAudioTracks > 0) {
          tracks.push({
            kind: 'audio',
            wantReceive: true
          });
          numAudioTracks--;
        }
        if (numVideoTracks > 0) {
          tracks.push({
            kind: 'video',
            wantReceive: true
          });
          numVideoTracks--;
        }
      }
      // reorder tracks
      tracks = sortTracks(tracks);

      var sdp = SDPUtils.writeSessionBoilerplate();
      var transceivers = [];
      tracks.forEach(function(mline, sdpMLineIndex) {
        // For each track, create an ice gatherer, ice transport,
        // dtls transport, potentially rtpsender and rtpreceiver.
        var track = mline.track;
        var kind = mline.kind;
        var mid = SDPUtils.generateIdentifier();

        var transports = self.usingBundle && sdpMLineIndex > 0 ? {
          iceGatherer: transceivers[0].iceGatherer,
          iceTransport: transceivers[0].iceTransport,
          dtlsTransport: transceivers[0].dtlsTransport
        } : self._createIceAndDtlsTransports(mid, sdpMLineIndex);

        var localCapabilities = RTCRtpSender.getCapabilities(kind);
        // filter RTX until additional stuff needed for RTX is implemented
        // in adapter.js
        if (browserDetails.version < 15019) {
          localCapabilities.codecs = localCapabilities.codecs.filter(
              function(codec) {
                return codec.name !== 'rtx';
              });
        }
        localCapabilities.codecs.forEach(function(codec) {
          // work around https://bugs.chromium.org/p/webrtc/issues/detail?id=6552
          // by adding level-asymmetry-allowed=1
          if (codec.name === 'H264' &&
              codec.parameters['level-asymmetry-allowed'] === undefined) {
            codec.parameters['level-asymmetry-allowed'] = '1';
          }
        });

        var rtpSender;
        var rtpReceiver;

        // generate an ssrc now, to be used later in rtpSender.send
        var sendEncodingParameters = [{
          ssrc: (2 * sdpMLineIndex + 1) * 1001
        }];
        if (track) {
          // add RTX
          if (browserDetails.version >= 15019 && kind === 'video') {
            sendEncodingParameters[0].rtx = {
              ssrc: (2 * sdpMLineIndex + 1) * 1001 + 1
            };
          }
          rtpSender = new RTCRtpSender(track, transports.dtlsTransport);
        }

        if (mline.wantReceive) {
          rtpReceiver = new RTCRtpReceiver(transports.dtlsTransport, kind);
        }

        transceivers[sdpMLineIndex] = {
          iceGatherer: transports.iceGatherer,
          iceTransport: transports.iceTransport,
          dtlsTransport: transports.dtlsTransport,
          localCapabilities: localCapabilities,
          remoteCapabilities: null,
          rtpSender: rtpSender,
          rtpReceiver: rtpReceiver,
          kind: kind,
          mid: mid,
          sendEncodingParameters: sendEncodingParameters,
          recvEncodingParameters: null
        };
      });
      if (this.usingBundle) {
        sdp += 'a=group:BUNDLE ' + transceivers.map(function(t) {
          return t.mid;
        }).join(' ') + '\r\n';
      }
      tracks.forEach(function(mline, sdpMLineIndex) {
        var transceiver = transceivers[sdpMLineIndex];
        sdp += SDPUtils.writeMediaSection(transceiver,
            transceiver.localCapabilities, 'offer', self.localStreams[0]);
      });

      this._pendingOffer = transceivers;
      var desc = new RTCSessionDescription({
        type: 'offer',
        sdp: sdp
      });
      if (arguments.length && typeof arguments[0] === 'function') {
        window.setTimeout(arguments[0], 0, desc);
      }
      return Promise.resolve(desc);
    };

    window.RTCPeerConnection.prototype.createAnswer = function() {
      var self = this;

      var sdp = SDPUtils.writeSessionBoilerplate();
      if (this.usingBundle) {
        sdp += 'a=group:BUNDLE ' + this.transceivers.map(function(t) {
          return t.mid;
        }).join(' ') + '\r\n';
      }
      this.transceivers.forEach(function(transceiver) {
        if (transceiver.isDatachannel) {
          sdp += 'm=application 0 DTLS/SCTP 5000\r\n' +
              'c=IN IP4 0.0.0.0\r\n' +
              'a=mid:' + transceiver.mid + '\r\n';
          return;
        }
        // Calculate intersection of capabilities.
        var commonCapabilities = self._getCommonCapabilities(
            transceiver.localCapabilities,
            transceiver.remoteCapabilities);

        sdp += SDPUtils.writeMediaSection(transceiver, commonCapabilities,
            'answer', self.localStreams[0]);
      });

      var desc = new RTCSessionDescription({
        type: 'answer',
        sdp: sdp
      });
      if (arguments.length && typeof arguments[0] === 'function') {
        window.setTimeout(arguments[0], 0, desc);
      }
      return Promise.resolve(desc);
    };

    window.RTCPeerConnection.prototype.addIceCandidate = function(candidate) {
      if (!candidate) {
        for (var j = 0; j < this.transceivers.length; j++) {
          this.transceivers[j].iceTransport.addRemoteCandidate({});
          if (this.usingBundle) {
            return Promise.resolve();
          }
        }
      } else {
        var mLineIndex = candidate.sdpMLineIndex;
        if (candidate.sdpMid) {
          for (var i = 0; i < this.transceivers.length; i++) {
            if (this.transceivers[i].mid === candidate.sdpMid) {
              mLineIndex = i;
              break;
            }
          }
        }
        var transceiver = this.transceivers[mLineIndex];
        if (transceiver) {
          var cand = Object.keys(candidate.candidate).length > 0 ?
              SDPUtils.parseCandidate(candidate.candidate) : {};
          // Ignore Chrome's invalid candidates since Edge does not like them.
          if (cand.protocol === 'tcp' && (cand.port === 0 || cand.port === 9)) {
            return Promise.resolve();
          }
          // Ignore RTCP candidates, we assume RTCP-MUX.
          if (cand.component !== '1') {
            return Promise.resolve();
          }
          transceiver.iceTransport.addRemoteCandidate(cand);

          // update the remoteDescription.
          var sections = SDPUtils.splitSections(this.remoteDescription.sdp);
          sections[mLineIndex + 1] += (cand.type ? candidate.candidate.trim()
              : 'a=end-of-candidates') + '\r\n';
          this.remoteDescription.sdp = sections.join('');
        }
      }
      if (arguments.length > 1 && typeof arguments[1] === 'function') {
        window.setTimeout(arguments[1], 0);
      }
      return Promise.resolve();
    };

    window.RTCPeerConnection.prototype.getStats = function() {
      var promises = [];
      this.transceivers.forEach(function(transceiver) {
        ['rtpSender', 'rtpReceiver', 'iceGatherer', 'iceTransport',
            'dtlsTransport'].forEach(function(method) {
              if (transceiver[method]) {
                promises.push(transceiver[method].getStats());
              }
            });
      });
      var cb = arguments.length > 1 && typeof arguments[1] === 'function' &&
          arguments[1];
      var fixStatsType = function(stat) {
        return {
          inboundrtp: 'inbound-rtp',
          outboundrtp: 'outbound-rtp',
          candidatepair: 'candidate-pair',
          localcandidate: 'local-candidate',
          remotecandidate: 'remote-candidate'
        }[stat.type] || stat.type;
      };
      return new Promise(function(resolve) {
        // shim getStats with maplike support
        var results = new Map();
        Promise.all(promises).then(function(res) {
          res.forEach(function(result) {
            Object.keys(result).forEach(function(id) {
              result[id].type = fixStatsType(result[id]);
              results.set(id, result[id]);
            });
          });
          if (cb) {
            window.setTimeout(cb, 0, results);
          }
          resolve(results);
        });
      });
    };
  }
};

// Expose public methods.
module.exports = {
  shimPeerConnection: edgeShim.shimPeerConnection,
  shimGetUserMedia: __webpack_require__(55)
};


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */


// Expose public methods.
module.exports = function() {
  var shimError_ = function(e) {
    return {
      name: {PermissionDeniedError: 'NotAllowedError'}[e.name] || e.name,
      message: e.message,
      constraint: e.constraint,
      toString: function() {
        return this.name;
      }
    };
  };

  // getUserMedia error shim.
  var origGetUserMedia = navigator.mediaDevices.getUserMedia.
      bind(navigator.mediaDevices);
  navigator.mediaDevices.getUserMedia = function(c) {
    return origGetUserMedia(c).catch(function(e) {
      return Promise.reject(shimError_(e));
    });
  };
};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */


var browserDetails = __webpack_require__(1).browserDetails;

var firefoxShim = {
  shimOnTrack: function() {
    if (typeof window === 'object' && window.RTCPeerConnection && !('ontrack' in
        window.RTCPeerConnection.prototype)) {
      Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
        get: function() {
          return this._ontrack;
        },
        set: function(f) {
          if (this._ontrack) {
            this.removeEventListener('track', this._ontrack);
            this.removeEventListener('addstream', this._ontrackpoly);
          }
          this.addEventListener('track', this._ontrack = f);
          this.addEventListener('addstream', this._ontrackpoly = function(e) {
            e.stream.getTracks().forEach(function(track) {
              var event = new Event('track');
              event.track = track;
              event.receiver = {track: track};
              event.streams = [e.stream];
              this.dispatchEvent(event);
            }.bind(this));
          }.bind(this));
        }
      });
    }
  },

  shimSourceObject: function() {
    // Firefox has supported mozSrcObject since FF22, unprefixed in 42.
    if (typeof window === 'object') {
      if (window.HTMLMediaElement &&
        !('srcObject' in window.HTMLMediaElement.prototype)) {
        // Shim the srcObject property, once, when HTMLMediaElement is found.
        Object.defineProperty(window.HTMLMediaElement.prototype, 'srcObject', {
          get: function() {
            return this.mozSrcObject;
          },
          set: function(stream) {
            this.mozSrcObject = stream;
          }
        });
      }
    }
  },

  shimPeerConnection: function() {
    if (typeof window !== 'object' || !(window.RTCPeerConnection ||
        window.mozRTCPeerConnection)) {
      return; // probably media.peerconnection.enabled=false in about:config
    }
    // The RTCPeerConnection object.
    if (!window.RTCPeerConnection) {
      window.RTCPeerConnection = function(pcConfig, pcConstraints) {
        if (browserDetails.version < 38) {
          // .urls is not supported in FF < 38.
          // create RTCIceServers with a single url.
          if (pcConfig && pcConfig.iceServers) {
            var newIceServers = [];
            for (var i = 0; i < pcConfig.iceServers.length; i++) {
              var server = pcConfig.iceServers[i];
              if (server.hasOwnProperty('urls')) {
                for (var j = 0; j < server.urls.length; j++) {
                  var newServer = {
                    url: server.urls[j]
                  };
                  if (server.urls[j].indexOf('turn') === 0) {
                    newServer.username = server.username;
                    newServer.credential = server.credential;
                  }
                  newIceServers.push(newServer);
                }
              } else {
                newIceServers.push(pcConfig.iceServers[i]);
              }
            }
            pcConfig.iceServers = newIceServers;
          }
        }
        return new mozRTCPeerConnection(pcConfig, pcConstraints);
      };
      window.RTCPeerConnection.prototype = mozRTCPeerConnection.prototype;

      // wrap static methods. Currently just generateCertificate.
      if (mozRTCPeerConnection.generateCertificate) {
        Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
          get: function() {
            return mozRTCPeerConnection.generateCertificate;
          }
        });
      }

      window.RTCSessionDescription = mozRTCSessionDescription;
      window.RTCIceCandidate = mozRTCIceCandidate;
    }

    // shim away need for obsolete RTCIceCandidate/RTCSessionDescription.
    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
        .forEach(function(method) {
          var nativeMethod = RTCPeerConnection.prototype[method];
          RTCPeerConnection.prototype[method] = function() {
            arguments[0] = new ((method === 'addIceCandidate') ?
                RTCIceCandidate : RTCSessionDescription)(arguments[0]);
            return nativeMethod.apply(this, arguments);
          };
        });

    // support for addIceCandidate(null or undefined)
    var nativeAddIceCandidate =
        RTCPeerConnection.prototype.addIceCandidate;
    RTCPeerConnection.prototype.addIceCandidate = function() {
      if (!arguments[0]) {
        if (arguments[1]) {
          arguments[1].apply(null);
        }
        return Promise.resolve();
      }
      return nativeAddIceCandidate.apply(this, arguments);
    };

    // shim getStats with maplike support
    var makeMapStats = function(stats) {
      var map = new Map();
      Object.keys(stats).forEach(function(key) {
        map.set(key, stats[key]);
        map[key] = stats[key];
      });
      return map;
    };

    var modernStatsTypes = {
      inboundrtp: 'inbound-rtp',
      outboundrtp: 'outbound-rtp',
      candidatepair: 'candidate-pair',
      localcandidate: 'local-candidate',
      remotecandidate: 'remote-candidate'
    };

    var nativeGetStats = RTCPeerConnection.prototype.getStats;
    RTCPeerConnection.prototype.getStats = function(selector, onSucc, onErr) {
      return nativeGetStats.apply(this, [selector || null])
        .then(function(stats) {
          if (browserDetails.version < 48) {
            stats = makeMapStats(stats);
          }
          if (browserDetails.version < 53 && !onSucc) {
            // Shim only promise getStats with spec-hyphens in type names
            // Leave callback version alone; misc old uses of forEach before Map
            try {
              stats.forEach(function(stat) {
                stat.type = modernStatsTypes[stat.type] || stat.type;
              });
            } catch (e) {
              if (e.name !== 'TypeError') {
                throw e;
              }
              // Avoid TypeError: "type" is read-only, in old versions. 34-43ish
              stats.forEach(function(stat, i) {
                stats.set(i, Object.assign({}, stat, {
                  type: modernStatsTypes[stat.type] || stat.type
                }));
              });
            }
          }
          return stats;
        })
        .then(onSucc, onErr);
    };
  }
};

// Expose public methods.
module.exports = {
  shimOnTrack: firefoxShim.shimOnTrack,
  shimSourceObject: firefoxShim.shimSourceObject,
  shimPeerConnection: firefoxShim.shimPeerConnection,
  shimGetUserMedia: __webpack_require__(57)
};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */


var logging = __webpack_require__(1).log;
var browserDetails = __webpack_require__(1).browserDetails;

// Expose public methods.
module.exports = function() {
  var shimError_ = function(e) {
    return {
      name: {
        SecurityError: 'NotAllowedError',
        PermissionDeniedError: 'NotAllowedError'
      }[e.name] || e.name,
      message: {
        'The operation is insecure.': 'The request is not allowed by the ' +
        'user agent or the platform in the current context.'
      }[e.message] || e.message,
      constraint: e.constraint,
      toString: function() {
        return this.name + (this.message && ': ') + this.message;
      }
    };
  };

  // getUserMedia constraints shim.
  var getUserMedia_ = function(constraints, onSuccess, onError) {
    var constraintsToFF37_ = function(c) {
      if (typeof c !== 'object' || c.require) {
        return c;
      }
      var require = [];
      Object.keys(c).forEach(function(key) {
        if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
          return;
        }
        var r = c[key] = (typeof c[key] === 'object') ?
            c[key] : {ideal: c[key]};
        if (r.min !== undefined ||
            r.max !== undefined || r.exact !== undefined) {
          require.push(key);
        }
        if (r.exact !== undefined) {
          if (typeof r.exact === 'number') {
            r. min = r.max = r.exact;
          } else {
            c[key] = r.exact;
          }
          delete r.exact;
        }
        if (r.ideal !== undefined) {
          c.advanced = c.advanced || [];
          var oc = {};
          if (typeof r.ideal === 'number') {
            oc[key] = {min: r.ideal, max: r.ideal};
          } else {
            oc[key] = r.ideal;
          }
          c.advanced.push(oc);
          delete r.ideal;
          if (!Object.keys(r).length) {
            delete c[key];
          }
        }
      });
      if (require.length) {
        c.require = require;
      }
      return c;
    };
    constraints = JSON.parse(JSON.stringify(constraints));
    if (browserDetails.version < 38) {
      logging('spec: ' + JSON.stringify(constraints));
      if (constraints.audio) {
        constraints.audio = constraintsToFF37_(constraints.audio);
      }
      if (constraints.video) {
        constraints.video = constraintsToFF37_(constraints.video);
      }
      logging('ff37: ' + JSON.stringify(constraints));
    }
    return navigator.mozGetUserMedia(constraints, onSuccess, function(e) {
      onError(shimError_(e));
    });
  };

  // Returns the result of getUserMedia as a Promise.
  var getUserMediaPromise_ = function(constraints) {
    return new Promise(function(resolve, reject) {
      getUserMedia_(constraints, resolve, reject);
    });
  };

  // Shim for mediaDevices on older versions.
  if (!navigator.mediaDevices) {
    navigator.mediaDevices = {getUserMedia: getUserMediaPromise_,
      addEventListener: function() { },
      removeEventListener: function() { }
    };
  }
  navigator.mediaDevices.enumerateDevices =
      navigator.mediaDevices.enumerateDevices || function() {
        return new Promise(function(resolve) {
          var infos = [
            {kind: 'audioinput', deviceId: 'default', label: '', groupId: ''},
            {kind: 'videoinput', deviceId: 'default', label: '', groupId: ''}
          ];
          resolve(infos);
        });
      };

  if (browserDetails.version < 41) {
    // Work around http://bugzil.la/1169665
    var orgEnumerateDevices =
        navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);
    navigator.mediaDevices.enumerateDevices = function() {
      return orgEnumerateDevices().then(undefined, function(e) {
        if (e.name === 'NotFoundError') {
          return [];
        }
        throw e;
      });
    };
  }
  if (browserDetails.version < 49) {
    var origGetUserMedia = navigator.mediaDevices.getUserMedia.
        bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function(c) {
      return origGetUserMedia(c).then(function(stream) {
        // Work around https://bugzil.la/802326
        if (c.audio && !stream.getAudioTracks().length ||
            c.video && !stream.getVideoTracks().length) {
          stream.getTracks().forEach(function(track) {
            track.stop();
          });
          throw new DOMException('The object can not be found here.',
                                 'NotFoundError');
        }
        return stream;
      }, function(e) {
        return Promise.reject(shimError_(e));
      });
    };
  }
  navigator.getUserMedia = function(constraints, onSuccess, onError) {
    if (browserDetails.version < 44) {
      return getUserMedia_(constraints, onSuccess, onError);
    }
    // Replace Firefox 44+'s deprecation warning with unprefixed version.
    console.warn('navigator.getUserMedia has been replaced by ' +
                 'navigator.mediaDevices.getUserMedia');
    navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
  };
};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

var safariShim = {
  // TODO: DrAlex, should be here, double check against LayoutTests
  // shimOnTrack: function() { },

  // TODO: once the back-end for the mac port is done, add.
  // TODO: check for webkitGTK+
  // shimPeerConnection: function() { },

  shimGetUserMedia: function() {
    if (!navigator.getUserMedia) {
      if (navigator.webkitGetUserMedia) {
        navigator.getUserMedia = navigator.webkitGetUserMedia.bind(navigator);
      } else if (navigator.mediaDevices &&
          navigator.mediaDevices.getUserMedia) {
        navigator.getUserMedia = function(constraints, cb, errcb) {
          navigator.mediaDevices.getUserMedia(constraints)
          .then(cb, errcb);
        }.bind(navigator);
      }
    }
  }
};

// Expose public methods.
module.exports = {
  shimGetUserMedia: safariShim.shimGetUserMedia
  // TODO
  // shimOnTrack: safariShim.shimOnTrack,
  // shimPeerConnection: safariShim.shimPeerConnection
};


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

/*
 *
 *	The CeCILL-B License
 *	
 *	Copyright (c) {{ projectYear }}/{{ projectYearNow }} {{authorName}} | {{authorEmail}}
 *
 *
 *	This software is a computer program whose purpose is to [describe
 *	functionalities and technical features of your software].
 *
 *	This software is governed by the CeCILL-B license under French law and
 *	abiding by the rules of distribution of free software.  You can  use, 
 *	modify and/ or redistribute the software under the terms of the CeCILL-B
 *	license as circulated by CEA, CNRS and INRIA at the following URL
 *	"http://www.cecill.info". 
 *
 *	As a counterpart to the access to the source code and  rights to copy,
 *	modify and redistribute granted by the license, users are provided only
 *	with a limited warranty  and the software's author,  the holder of the
 *	economic rights,  and the successive licensors  have only  limited
 *	liability. 
 *
 *	In this respect, the user's attention is drawn to the risks associated
 *	with loading,  using,  modifying and/or developing or reproducing the
 *	software by the user in light of its specific status of free software,
 *	that may mean  that it is complicated to manipulate,  and  that  also
 *	therefore means  that it is reserved for developers  and  experienced
 *	professionals having in-depth computer knowledge. Users are therefore
 *	encouraged to load and test the software's suitability as regards their
 *	requirements in conditions enabling the security of their systems and/or 
 *	data to be ensured and,  more generally, to use and operate it in the 
 *	same conditions as regards security. 
 *
 *	The fact that you are presently reading this means that you have had
 *	knowledge of the CeCILL-B license and that you accept its terms.
 *
 */

// CORE
const stage = __webpack_require__(10)();
__webpack_require__(9)(stage);
__webpack_require__(38)(stage);

// TOOLS
__webpack_require__(39)(stage);
__webpack_require__(36)(stage);
__webpack_require__(37)(stage);

// CRYPTO
__webpack_require__(11)(stage);
__webpack_require__(12)(stage);

// IO
__webpack_require__(15)(stage);
__webpack_require__(13)(stage);
__webpack_require__(14)(stage);

// IO TRANSPORT
__webpack_require__(22)(stage);
__webpack_require__(23)(stage);
__webpack_require__(21)(stage);
__webpack_require__(20)(stage);

// IO PROTOCOLS
__webpack_require__(16)(stage);
__webpack_require__(17)(stage);
__webpack_require__(18)(stage);

// IO REALTIME
__webpack_require__(19)(stage);

// MEDIAS
__webpack_require__(34)(stage);
__webpack_require__(35)(stage);


// KERNEL STAGE ( nodefony )
__webpack_require__(32)(stage);
__webpack_require__(28)(stage);
__webpack_require__(24)(stage);
__webpack_require__(25)(stage);
__webpack_require__(26)(stage);
__webpack_require__(27)(stage);
__webpack_require__(29)(stage);
__webpack_require__(30)(stage);
__webpack_require__(31)(stage);
__webpack_require__(33)(stage);

// EXPORT
module.exports = stage ;


/***/ })
/******/ ]);
});
//# sourceMappingURL=stage6.js.map