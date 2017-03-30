/*
 *
 *	ENTRY POINT WEBPACK DEMO BUNLDE
 *
 *
 *  Add your assets here with require  to an integration in webpack  bundle    
 *
 *  require('jquery');
 *  require('../css/mycss.css')
 *
 */
require("../css/webrtc.css");
require("../css/clean/style.css");
var mixer = require("../webaudio/js/mix2.js");

var kernel = require("../webrtc/kernel.js");

module.exports = function (){ 

	
	//window["mixer"] = mixer ;
		
	/*
 	 *	Class
	 *
	 *	Namespace webrtc client side 
 	 *
 	 */
	var webrtc = class webrtc {
	
		constructor() {
			this.kernel = kernel ;
			this.mixer = mixer ;
		}
	};

	return new webrtc();
}();
