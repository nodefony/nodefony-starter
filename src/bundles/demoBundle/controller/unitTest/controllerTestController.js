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
var blueBird = require("bluebird");


nodefony.registerController("controllerTest", function(){


	var controllerTest = class controllerTest extends nodefony.controller {

		constructor(container, context){
			super(container, context);
		}
		
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
 	 	*	requestAction 
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

		/**
 	 	 *
 	 	 *	promiseAction 
 	 	 *
 	 	 */
		promiseAction(action){
			switch( action ){
				case "promise":
					return  this.forward("demoBundle:controllerTest:promise1");
				break;
				case "promise1":
					return this.promise1Action();
				case "promise2":
					return this.promise2();
				break;
				case "promise3" :
					return  this.promise3();
				case "promise4" :
					return  this.promise4();
				default :
					return this.createNotFoundException("Promise action not found");	
			}
		}

		/**
 	 	 *
 	 	 *	promise  sync chain
 	 	 *
 	 	 */

		promise1Action(){
			var data =null ;
			var myFunc2 = () => {
				return new Promise ( (resolve, reject) =>{
					setTimeout( () =>{
						resolve({status:200, data:data});
					}, 500)
				})
			}
			var ele = new Promise ( (resolve, reject) =>{
				setTimeout(() =>{
					data = {foo:"bar"}
					resolve( myFunc2() );
				}, 500)
			}).then( (...args) => {
				return this.renderJson(...args);	
			})
		}

		/**
 	 	 *
 	 	 *	promise  
 	 	 *
 	 	 */
		promise2(){
			var ele = new Promise ( (resolve, reject) =>{
				setTimeout(() =>{
					resolve( {foo:"bar"} );
				}, 500)
			}).then( (ele) => {
				return new Promise ( (resolve, reject) =>{
					setTimeout( () =>{
						resolve({status:200, data:ele});
					}, 500)
				})	
			}).then( (ele) => {
				return this.renderJson(ele);	
			})
		}

		/**
 	 	 *
 	 	 *	promise json 
 	 	 *
 	 	 */
		promise3(){
			var myFunc = () => {
				return new Promise ( (resolve, reject) =>{
					setTimeout( () =>{
						resolve({status:200, time:"200"});
					}, 200)
				})
			}

			var myFunc2 = () => {
				return new Promise ( (resolve, reject) =>{
					setTimeout( () =>{
						resolve({status:200, time:"500"});
					}, 500)
				})
			}
		
			return Promise.all( [myFunc(), myFunc2()] ).then((data)=>{
				return this.renderJson(data)
			});
		}


		/**
 	 	 *
 	 	 *	promise json 
 	 	 *
 	 	 */
		promise4(){
			
			var myFunc = () => {
				return new Promise ( (resolve, reject) =>{
					setTimeout( () =>{
						resolve({status:200, time:"200"});
					}, 200)
				})
			}

			var myFunc2 = () => {
				return new Promise ( (resolve, reject) =>{
					setTimeout( () =>{
						resolve({status:200, time:"500"});
					}, 500)
				})
			}
		
			return Promise.all( [myFunc(), myFunc2()] ).then((data)=>{
				return this.renderResponse( JSON.stringify( data ) , 200 , {
					'Content-Type': "text/json ; charset="+ this.context.response.encoding
				} ) ;
			});
		}


		/**
 	 	 *
 	 	 *	promiseAction 
 	 	 *
 	 	 */
		exceptionAction(action){
			switch( action ){
				case "500":
					return  this.createException( new Error("My create Exception") );
				break;
				case "401":
					return this.createUnauthorizedException("My Unauthorized Exception");
				case "404":
					return this.createNotFoundException("My not found Exception");
				case "408":
					this.getResponse().setStatusCode(408);
					return this.notificationsCenter.fire("onError", this.container, "My Timeout Exception");
				case "error":
					varNotExit.defined.value ;
				case "notDefined":
					return this.notificationsCenter.fire("onError", this.container, null);
				case "fire" :
					return this.notificationsCenter.fire("onError", this.container, new Error("My Fire Exception"));
				default :
					throw new Error("Action not found")
			}
		}


	}	
	return controllerTest;
});
