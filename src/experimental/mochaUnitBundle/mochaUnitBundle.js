/*
 *
 *
 *	MOCHA UNIT BUNDLE
 *
 *
 *
 */

nodefony.registerBundle ("mochaUnit", function(){

	var mochaUnit = function(kernel, container){
		
		this.autoLoader.loadDirectory(this.path + "/core");
		
		this.mother = this.$super;
		this.mother.constructor(kernel, container);
		
	};

	return mochaUnit;
});
