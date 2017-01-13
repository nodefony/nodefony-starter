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
					setTimeout (() => {
						this.renderAsync("demoBundle:unitTest:rest.json.twig", {
							code:status.code,
							type:"",
							message:"",
							data:JSON.stringify(this.query)
						});
					}, 1000);
					return null ;
				case "renderJson" :
					var str = {
						response:{
							code:status.code,
							reason:{
								type:"",
								message:""
							}, 	
							data:this.query
						}
					}
					return this.renderJson(str)
				case "renderJsonSync" :
					var str = {
						response:{
							code:status.code,
							reason:{
								type:"",
								message:""
							}, 	
							data:this.query
						}
					}
					return this.renderJsonSync(str)
				case "renderJsonAsync" :
					var str = {
						response:{
							code:status.code,
							reason:{
								type:"",
								message:""
							}, 	
							data:this.query
						}
					}
					setTimeout (() => {
						this.renderJsonAsync(str)
					}, 1000);
				break;
				case "renderJsonAsyncTimeOut" :
					this.context.response.setTimeout(1000);
					var str = {
						response:{
							code:status.code,
							reason:{
								type:"",
								message:""
							}, 	
							data:this.query
						}
					}
					setTimeout (() => {
						this.renderJsonAsync(str)
					}, 2000);
				break;
				default :
					this.context.response.setTimeout(1000);
			}	
		}
	};
	
	return twigController;

});
