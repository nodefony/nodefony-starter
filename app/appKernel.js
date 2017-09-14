/*
 *
 *
 *
 *	ENTRY POINT FRAMEWORK APP KERNEL
 *
 *
 *
 *
 */
"use strict;"
module.exports = nodefony.register("appKernel",function(){

	const appKernel = class appKernel extends nodefony.kernel {

		constructor (type, environment, debug, settings){
			// kernel constructor
			try {
				super(environment, debug, type, settings);
			}catch(e){
				throw e ;
			}
		};
	};
	return appKernel;
})
