/*
 *
 *
 *	DEMO BUNDLE
 *
 *
 *
 */

nodefony.registerBundle ("demo", function(){

	var demo = function(kernel, container){
		this.mother = this.$super;
		this.mother.constructor(kernel, container);
	}

	return demo
});
