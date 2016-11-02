/*
 *
 *
 *
 *
 */
stage.register("appKernel",function(){

	var appKernel = function(url, environnement, settings){

		switch (arguments.length){
			case 0 :
				url = null ;
				environnement = "prod" ;
				settings = {} ;
			break;
			case 1 :
				environnement = url ;
				settings = {} ;
			break;
			case 2:
				settings = environnement;
				environnement = url;
				url = null ;
			break
		}
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

