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
		if ( url ){
			this.loadModule(url,{
				async:false
			});
		}else{
			this.fire("onBoot", this);
		}
			
	}.herite(stage.kernel);

	return appKernel;
});

