const stage = require("nodefony-stage");
require("bootstrap");
require('bootstrap/dist/css/bootstrap.css');
require('font-awesome/css/font-awesome.css');

require("../plugins/gritter/js/jquery.gritter.js");

//css
require('../clean/css/style.css');
require( '../plugins/gritter/css/jquery.gritter.css');

module.exports = function (){
    // expose stage in gobal window object
	window["stage"] = stage ;
}();
