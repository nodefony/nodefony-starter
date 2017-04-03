var webrtcApi = require("./layerApi.js"); 

module.exports = function (){ 

	// closure private
	$.fn.animateRotate = function(startAngle, endAngle, duration, easing, complete){
    		return this.each(function(){
        		var elem = $(this);
        		$({deg: startAngle}).animate({deg: endAngle}, {
            			duration: duration,
            			easing: easing,
            			step: function(now){
                			elem.css({
                  				'-moz-transform':'rotate('+now+'deg)',
                  				'-webkit-transform':'rotate('+now+'deg)',
                  				'-o-transform':'rotate('+now+'deg)',
                  				'-ms-transform':'rotate('+now+'deg)',
                  				'transform':'rotate('+now+'deg)'
                			});
            			},
            			complete: complete || $.noop
        		});
    		});
	};
	
	
	return function( urlConfig, environment, debug ){

		// KERNEL 
		return  new stage.appKernel(null, environment, {

			debug: debug,
			router:false,
			i18n:false,

			onLoad:function(kernel){
				$(".profile-img").finish()	
				kernel.logger("onLoad", "DEBUG");
				
			},
			onReady:function(kernel){
				kernel.logger("onReady","DEBUG");
				
			},

			onBoot:function(kernel){
				$(".profile-img").animateRotate(0, 360,10000,"linear", function(){
					console.log(this)
				})
				kernel.logger("onBoot", "DEBUG")
				$.ajax({
					url:urlConfig,
					method:"GET",
					success:(config) =>{
						try {
							this.api = new webrtcApi(kernel, config);
							this.api.listen(this, "onConnect" , function(transport, api){
								api.register("1000",1234);
							})
							this.api.listen(this, "onHandshake" , function(transport, api){
								$(".profile-img").animateRotate(90, {
  									duration: 1337,
  									easing: 'linear',
  									complete: function () {},
  									step: function () {}
								});
							})
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
				kernel.logger("onDomLoad","DEBUG");
			}
		});
	}
}();
