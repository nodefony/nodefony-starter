/**
 * * * * *
 * KERNEL *
 * * * * * 
 */

//== Kernel
appKernel = new stage.appKernel("/monitoring/app", "prod", {
	debug: false,
	location:{
		html5Mode:false
	},
	onBoot:function() {
		
	},
	onDomLoad: function() {
		this.uiContainer = $(".debugContent").get(0) || $("body").get(0);
	},
	onReady: function() {
		this.router.redirect(this.router.generateUrl("index"));	
	},
	onGetConfigError:function(module) {
	}
});
