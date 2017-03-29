/*
 *
 *	ENTRY POINT WEBPACK APP
 *
 */
var stage = require("nodefony-stage");

require("bootstrap");
require('bootstrap/dist/css/bootstrap.css');
require('font-awesome/css/font-awesome.css');

module.exports = function (){ 

	// expose stage in gobal window object
	this["stage"] = stage ;

	/*
 	 *
 	 *	Class Bundle App client side  
 	 *
 	 *
 	 */
	var App = class App {
		
		constructor() {}
	
	};

	return new App();
}();
