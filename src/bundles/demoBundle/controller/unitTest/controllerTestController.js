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
				case "promise5" :
					return  this.promise5();
				case "promise6" :
					return  this.promise6();
				case "promise7" :
					return  this.promise7();
				case "promise8" :
					return  this.promise8();
				case "promise88" :
					return  this.promise88();
				case "promise9" :
					return  this.promise9();
				case "promise10" :
					return  this.promise10();
				case "promise11" :
					return  this.promise11();
				case "promise12" :
					return  this.promise12();
				case "promise13" :
					return  this.promise13();
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
				return this.renderJsonAsync(...args);	
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
				return this.renderJsonAsync(ele);	
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
				return this.renderJson(data)
				/*return this.renderResponse( JSON.stringify( data ) , 200 , {
					'Content-Type': "text/json ; charset="+ this.context.response.encoding
				} ) ;*/
			})
		}

		/**
 	 	 *
 	 	 *	promise reject 
 	 	 *
 	 	 */
		promise5(){
			
			var myFunc = () => {
				return new Promise ( (resolve, reject) =>{
					setTimeout( () =>{
						reject({status:500, promise:"1"});
					}, 200)
				})
			}

			var myFunc2 = () => {
				return new Promise ( (resolve, reject) =>{
					setTimeout( () =>{
						resolve({status:200, promise:"2"});
					}, 500)
				})
			}
		
			return Promise.all( [myFunc(), myFunc2()] ).then((data)=>{
				return this.renderJson(data)
				/*return this.renderResponse( JSON.stringify( data ) , 200 , {
					'Content-Type': "text/json ; charset="+ this.context.response.encoding
				} ) ;*/
			}).catch((data) => {
				this.getResponse().setStatusCode(data.status);
				return this.renderJson(data)
			});
		}

		/**
 	 	 *
 	 	 *	promise reject 
 	 	 *
 	 	 */
		promise6(){
			var myFunc = () => {
				return new Promise ( (resolve, reject) =>{
					setTimeout( () =>{
						resolve({status:200, promise:"1"});
					}, 200)
				})
			}
			var myFunc2 = () => {
				return new Promise ( (resolve, reject) =>{
					setTimeout( () =>{
						reject({status:404, promise:"2"});
					}, 500)
				})
			}
			return Promise.all( [myFunc(), myFunc2()] ).then((data)=>{
				return this.renderJson(data)
			}).catch((data) => {
				this.getResponse().setStatusCode(data.status);
				return this.renderJson(data)
			});
		}

		/**
 	 	 *
 	 	 *	promise reject 
 	 	 *
 	 	 */
		promise7(){

			return new Promise ( (resolve, reject) =>{
				setTimeout(() =>{
					resolve( {foo:"bar"} );
				}, 500)
			}).then( (ele) => {
				return new Promise ( (resolve, reject) =>{
					setTimeout( () =>{
						reject({status:500, data:ele});
					}, 500)
				})	
			}).then( (ele) => {
				return this.renderJson(ele);	
			})
			.catch((data) => {
				this.getResponse().setStatusCode(data.status);
				return this.renderJson(data)
			});
		}

		/**
 	 	 *
 	 	 *	promise throw 
 	 	 *
 	 	 */
		promise8(){
			return new Promise ( (resolve, reject) =>{
				setTimeout(() =>{
					resolve( {status:500, data:{foo:"bar"} } );
				}, 500)
			}).then( (ele) => {
				throw ele;	
			}).then( (ele) => {
				return this.renderJson(ele);	
			})
			.catch((data) => {
				this.getResponse().setStatusCode(data.status);
				return this.renderJson(data)
			});
		}
		/**
 	 	 *
 	 	 *	promise throw 
 	 	 *
 	 	 */
		promise88(){
			return new Promise ( (resolve, reject) =>{
				setTimeout(() =>{
					resolve( {status:500, data:{foo:"bar"} } );
				}, 500)
			}).then( (ele) => {
				notDefinded;	
			}).then( (ele) => {
				return this.renderJson(ele);	
			})
			.catch((data) => {
				this.getResponse().setStatusCode(500);
				return this.renderJson({status:500,data:data.message})
			});
		}

		/**
 	 	 *
 	 	 *	promise sequelise 
 	 	 *
 	 	 */
		promise9(){
			var orm = this.getORM() ;
			var userEntity = orm.getEntity("user") ;
			return userEntity.findOne({
  				where: {
    					username: "admin"
  				}
			})
			.then( (ele) => {
				return this.renderJson({status:200,data:ele});	
			})
			.catch((data) => {
				this.getResponse().setStatusCode(500);
				return this.renderJson({status:500,data:data.message})
			});
		}

		/**
 	 	 *
 	 	 *	promise sequelise 
 	 	 *
 	 	 */
		promise10(){
			var orm = this.getORM() ;
			var userEntity = orm.getEntity("user") ;
			var sessionEntity = orm.getEntity("session") ;
			return userEntity.findOne({
  				where: {
    					username: "anonymous"
  				}
			})
			.then( (ele) => {
				return sessionEntity.findOne({
					/*include: [{
						model: userEntity,
						//where: { username: null }
					}],*/
					where: {
						//user_id: ele[0].id
						session_id:this.getSession() ? this.getSession().id : 0 
					}
				})	
			})
			.then( (ele) => {
				return this.renderJson(ele);	
			})
			.catch((data) => {
				this.getResponse().setStatusCode(500);
				return this.renderJson({status:500,data:data.message})
			});
		}

		/**
 	 	 *
 	 	 *	promise sequelise 
 	 	 *
 	 	 */
		promise11(){
			var orm = this.getORM() ;
			var userEntity = orm.getEntity("user") ;
			var sessionEntity = orm.getEntity("session") ;
			return userEntity.findOne({
  				where: {
    					username: "admin"
  				}
			})
			.then( (ele) => {
				return ele ;
			})
			.then( (ele) => {
				return this.renderJson({status:200,data:ele});
			})
			.catch((data) => {
				this.getResponse().setStatusCode(500);
				return this.renderJson({status:500,data:data.message})
			});
		}
		/**
 	 	 *
 	 	 *	promise sequelise 
 	 	 *
 	 	 */
		promise12(){
			var orm = this.getORM() ;
			var userEntity = orm.getEntity("user") ;
			var sessionEntity = orm.getEntity("session") ;
			return userEntity.findOne({
  				where: {
    					username: "admin"
  				}
			})
			.then( (ele) => {
				throw ele ;
			})
			.then( (ele) => {
				return this.renderJson({status:200,data:ele});
			})
			.catch((data) => {
				this.getResponse().setStatusCode(500);
				return this.renderJson({status:500,data:data})
			});
		}
		/**
 	 	 *
 	 	 *	promise sequelise 
 	 	 *
 	 	 */
		promise13(){
			var orm = this.getORM() ;
			var userEntity = orm.getEntity("user") ;
			var sessionEntity = orm.getEntity("session") ;
			return userEntity.findOne({
  				where: {
    					username: "admin"
  				}
			})
			.then( (ele) => {
				notDefinded ;
			})
			.then( (ele) => {
				return this.renderJson({status:200,data:ele});
			})
			.catch((data) => {
				this.getResponse().setStatusCode(500);
				return this.renderJson({status:500,data:data.message})
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
