

module.exports = nodefony.registerController("webAudio", function(){

		/**
		 *	The class is a **`default` CONTROLLER** .
		 *	@module
		 *	@main
		 *	@class default
		 *	@constructor
		 *	@param {class} container
		 *	@param {class} context
		 *
		 */
		var webAudio = class webAudio extends nodefony.controller {

			constructor (container, context){
				super(container, context);
			}

			/**
		 	*
		 	*	@method mixAction
		 	*
		 	*/
			mixAction (){
				return this.render("demoBundle:webAudio:mix2.html.twig");
			}
		};

		return webAudio;
});
