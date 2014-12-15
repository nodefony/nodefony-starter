/*
 *
 *
 *
 *
 */
stage.register("appKernel",function(){

	var appKernel = function(url, environnement, settings){

		var kernel = this.$super ;
		kernel.constructor(environnement, settings);
		this.loadModule(url,{
			async:false
		});
			
	}.herite(stage.kernel);

	return appKernel;
});

