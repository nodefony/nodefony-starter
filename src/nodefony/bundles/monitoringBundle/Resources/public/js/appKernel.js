/**
 * * * * *
 * KERNEL *
 * * * * * 
 */

//== Kernel
appKernel = new stage.appKernel("/monitoring/app", "dev", {
	debug: true,
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
