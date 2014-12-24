/**
 * * * * *
 * KERNEL *
 * * * * * 
 */

//== Kernel
appKernel = new stage.appKernel("/monitoring/app", "dev", {
	debug: false,
	location:{
		html5Mode:false
	},
	onBoot:function() {
		
	},
	onDomLoad: function() {
		console.log($(".debugContent").get(0));
		this.uiContainer = $(".debugContent").get(0);
	},
	onReady: function() {
		this.router.redirect(this.router.generateUrl("index"));	
	},
	onGetConfigError:function(module) {
	}
});
