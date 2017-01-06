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

nodefony.registerController("test", function(){


	var testController = class loginController extends nodefony.controller {

		constructor(container, context){
			super(container, context);
		};
		
		/**
 	 	*
 	 	*	Routing 
 	 	*
 	 	*/

		myrouteAction(page, ele){
			return this.renderJson({
				page:page,
				element:ele
			});
		}

		/**
 	 	*
 	 	*	response  status
 	 	*
 	 	*/
		responseStatusAction (statusRoute){

			var response = this.getResponse();
			response.setStatusCode(statusRoute);
			var status = response.getStatus();
			//console.log(status)
			return this.renderJson({
				code:status.code,
				message:status.message
			});
			
		}

		/**
 	 	*
 	 	*	response  message
 	 	*
 	 	*/
		responseMessageAction (statusRoute, messageRoute){

			var response = this.getResponse();
			if (messageRoute === "null"){
				response.setStatusCode(statusRoute);
				var generate = this.generateUrl("response-message",{st:statusRoute})
			}else{
				response.setStatusCode(statusRoute, messageRoute);
				var generate = this.generateUrl("response-message",{st:statusRoute,message:messageRoute})
			}
			var status = response.getStatus();
			//console.log(generate)
			return this.renderJson({
				code:status.code,
				message:status.message,
				generateUrl:generate
			});
			
		}
		
	};
	
	return testController;

});
