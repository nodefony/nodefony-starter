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
	onReady: function() {
		this.router.redirect(this.router.generateUrl("index"));	
	},
	onGetConfigError:function(module) {
	}
});
