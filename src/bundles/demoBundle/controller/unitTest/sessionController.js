/*
 *
 *
 *
 *	CONTROLLER test unit
 *
 *
 *
 *
 */

var querystring = require('querystring');
var blueBird = require("bluebird");


nodefony.registerController("session", function(){


	var sessionTest = class sessionTest extends nodefony.controller {

		constructor(container, context){
			super(container, context);
			this.sessionService = this.get("sessions");
		}
		
		/**
 	 	*
 	 	*	redirectAction 
 	 	*
 	 	*/
		sessionAction(){
			console.log(this.sessionService)
			return this.renderResponse("sqldkmqsldk")	
		}
	};
	
	return sessionTest;
});
