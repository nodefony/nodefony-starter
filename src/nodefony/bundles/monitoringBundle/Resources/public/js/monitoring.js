/*
 *
 *	ENTRY POINT WEBPACK APP
 *
 */

require("bootstrap");
require("../less/style.less");
require('font-awesome/css/font-awesome.css');
require("../vendors/jquery.timeago/jquery.timeago.js");
require("./json-view/jquery.jsonview.js");
const smoothie = require("./smoothie/smoothie.js");

require("../css/json-view/jquery.jsonview.css");


module.exports = function (){ 
	
	
	// expose  in gobal window object
	window["SmoothieChart"] = smoothie.SmoothieChart ;
	window["TimeSeries"] = smoothie.TimeSeries ;

	/*
 	 *
 	 *	Class Bundle App client side  
 	 *
 	 *
 	 */
	var monitoring = class monitoring {
		
		constructor() {
		
			/**
 			* * * * *
 			* KERNEL *
 			* * * * * 
 			*/

			//== Kernel
			var  environment= $(".environment").attr("value");
			var  debug= $(".debug").attr("value");
			this.kernel = new stage.appKernel("/nodefony/app", environment, {
				debug: debug,
				location:{
					html5Mode:false
				},
				onBoot:function() {
					
				},
				onDomReady: function() {
					this.uiContainer = $(".debugContent").get(0) || $("body").get(0);
				},
				onReady: function() {
					this.router.redirect(this.router.generateUrl("index"));	
				},
				onGetConfigError:function(module) {
				}
			});	
		}
	
	};

	return new monitoring();
}();
