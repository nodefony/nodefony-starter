var webrtcApi = require("./layerApi.js"); 

module.exports = function (){ 

	// closure private

	return function( urlConfig, environment, debug ){

		// KERNEL 
		return  new stage.appKernel(null, environment, {

			debug: debug,
			router:false,
			i18n:false,

			onLoad:function(kernel){
				kernel.logger("onLoad", "DEBUG");
			},
			onReady:function(kernel){
				kernel.logger("onReady","DEBUG");
			},

			onBoot:function(kernel){
				kernel.logger("onBoot", "DEBUG")
				$.ajax({
					url:urlConfig,
					method:"GET",
					success:(config) =>{
						try {
							this.api = new webrtcApi(kernel, config);
						}catch(e){
							this.logger(e, "ERROR");
						}
					},
					error:(error) =>{
						console.log( "SERVER CONFIG ERROR ");
						throw error;
					}
				});
			},

			onUnLoad:function(kernel){
				kernel.logger("onUnLoad", "DEBUG");
				if ( this.api ){
					this.api.close() ;
				}
			},
			onDomLoad:function(kernel){

			}
		});
	}
}();
