/*
 *
 *	ENTRY POINT WEBPACK DEMO BUNLDE
 *
 */

require('../clean/css/style.css');
var index = require("./index.js") 
var finder = require("./finder/finder.js") 

module.exports = function (){ 

	/*
 	 *
 	 *	Class demoBundle client side  
 	 *
 	 *
 	 */
	var demo = class demo {
	
		constructor(myindex, myfinder) {
			this.index = myindex ;
			this.finder = myfinder ;
		}
	};

	return new demo(index, finder);
}();
