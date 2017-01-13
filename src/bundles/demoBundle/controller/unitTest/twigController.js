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
						type:this.query.type,
						message:"",
						data:JSON.stringify(this.query)
					});
				case "renderSync" :
					return this.renderSync("demoBundle:unitTest:rest.json.twig", {
						code:status.code,
						type:this.query.type,
						message:"",
						data:JSON.stringify(this.query)
					});
				case "renderAsync" :
					setTimeout (() => {
						this.renderAsync("demoBundle:unitTest:rest.json.twig", {
							code:status.code,
							type:this.query.type,
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
								type:this.query.type,
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
								type:this.query.type,
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
								type:this.query.type,
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
								type:this.query.type,
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

		extendAction (){
			var response = this.getResponse();
			var status = response.getStatus();
			switch ( this.query.type ){
				case "render" : 
					return this.render("demoBundle:unitTest:render.json.twig", {
						code:status.code,
						type:this.query.type,
						message:"",
						data:JSON.stringify(this.query)
					});
				case "renderTorenderSync" :
 				       this.query.type = "renderSync"	
					return this.render("demoBundle:unitTest:render.json.twig", {
						code:status.code,
						type:this.query.type,
						message:"",
						data:JSON.stringify(this.query)
					});
				case "renderSync" :
					return this.renderSync("demoBundle:unitTest:render.json.twig", {
						code:status.code,
						type:this.query.type,
						message:"",
						data:JSON.stringify(this.query)
					});
				case "renderSyncTorender" :
					this.query.type = "render"
					return this.renderSync("demoBundle:unitTest:render.json.twig", {
						code:status.code,
						type:this.query.type,
						message:"",
						data:JSON.stringify(this.query)
					});

				case "renderAsyncToSync" :
					this.query.type = "renderSync"
					setTimeout (() => {
						this.renderAsync("demoBundle:unitTest:render.json.twig", {
							code:status.code,
							type:this.query.type,
							message:"",
							data:JSON.stringify(this.query)
						});
					}, 1000);
					return null ;
				case "renderAsyncToRender" :
					this.query.type = "render"
					setTimeout (() => {
						this.renderAsync("demoBundle:unitTest:render.json.twig", {
							code:status.code,
							type:this.query.type,
							message:"",
							data:JSON.stringify(this.query)
						});
					}, 1000);
					return null ;
				case "renderSyncToAsync":
					this.query.type = "renderAsync"
					return this.renderSync("demoBundle:unitTest:render.json.twig", {
						code:status.code,
						type:this.query.type,
						message:"",
						data:JSON.stringify(this.query)
					});
				default :
					throw new Error("extend twig not exist");
			}
		}
	};
	
	return twigController;
});
