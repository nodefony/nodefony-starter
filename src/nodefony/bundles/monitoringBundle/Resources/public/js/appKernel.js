/**
 * * * * *
 * KERNEL *
 * * * * * 
 */

//== Kernel
var  environment= $(".environment").attr("value");
var  debug= $(".debug").attr("value");
appKernel = new stage.appKernel("/nodefony/app", environment, {
	debug: debug,
	location:{
		html5Mode:false
	},
	onBoot:function() {
		
	},
	onDomReady: function() {
		this.uiContainer = $(".debugContent").get(0) || $("body").get(0);
	},
	onReady: function() {
		this.router.redirect(this.router.generateUrl("index"));	
	},
	onGetConfigError:function(module) {
	}
});
