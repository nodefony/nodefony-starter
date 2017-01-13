/*
 *
 *
 *
 *	CONTROLLER test unit
 *
 *
 *
 *
 */

nodefony.registerController("twig", function(){


	var twigController = class testController extends nodefony.controller {

		constructor(container, context){
			super(container, context);
		};

		renderAction (){
			var response = this.getResponse();
			var status = response.getStatus();
			switch (this.query.type ){
				case "render" : 
					return this.render("demoBundle:unitTest:rest.json.twig", {
						code:status.code,
						type:"",
						message:"",
						data:JSON.stringify(this.query)
					});
				case "renderSync" :
					return this.renderSync("demoBundle:unitTest:rest.json.twig", {
						code:status.code,
						type:"",
						message:"",
						data:JSON.stringify(this.query)
					});
				case "renderAsync" :
					this.renderAsync("demoBundle:unitTest:rest.json.twig", {
						code:status.code,
						type:"",
						message:"",
						data:JSON.stringify(this.query)
					});
					return null ;
				case "renderJson" :
					
				break;
				default :
					this.context.response.setTimeout(1000);
			}	
		}
	};
	
	return twigController;

});
