/**
 * 
 * BUNDLE DEMO 
 *  
 */
window.stage = require("../../../../../../vendors/stage/dist/stage6.js");

require("bootstrap");
require('bootstrap/dist/css/bootstrap.css');

require('../clean/assets/css/style.css');

var index = require("./index.js") 
var finder = require("./finder/finder.js") 

module.exports = function (){ 
	return {
		index:index,
		finder:finder
	}
}();
