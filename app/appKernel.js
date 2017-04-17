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
nodefony.register("appKernel",function(){

	var appKernel = class appKernel extends nodefony.kernel {

		constructor (type, environment, debug, loader, settings){
			// kernel constructor
			try {
				super(environment, debug, loader, type, settings)
			}catch(e){
				throw e ;
			}
		};
	};
	return appKernel;
})
