/*
 *
 *
 *	DEMO BUNDLE
 *
 *
 *
 */

module.exports = nodefony.registerBundle ("demo", function(){

	var demo = class demo extends nodefony.Bundle {

		constructor(name, kernel, container){
			super(name, kernel, container);
		}
	};

	return demo ;
});
