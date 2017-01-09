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

var querystring = require('querystring');


nodefony.registerController("controllerTest", function(){


	var controllerTest = class controllerTest extends nodefony.controller {

		constructor(container, context){
			super(container, context);
		};
		
		/**
 	 	*
 	 	*	redirectAction 
 	 	*
 	 	*/
		redirectAction(status){
			//console.log( this.query);
			var url = "/";
			var headers = {};
			if (this.queryPost ){
				if (this.queryPost.status){
					status = this.queryPost.status ;	
				}
				if (this.queryPost.url){
					var size = Object.keys(this.queryGet).length;
					if ( size ){
						url = this.queryPost.url+"?"+querystring.stringify(this.queryGet) ;
					}else{
						url = this.queryPost.url ;
					}
				}
				if (this.queryPost.headers){
					headers = this.queryPost.url
				}
			}
			return this.redirect(url, status, headers);
		}

		/**
 	 	*
 	 	*	redirectAction 
 	 	*
 	 	*/
		requestAction(){
		
			return this.renderJson({
				method:this.getMethod(),
				query:this.query,
				queryPost:this.queryPost,
				queryGet:this.queryGet,
			});
		}


	}	
	return controllerTest;
});
