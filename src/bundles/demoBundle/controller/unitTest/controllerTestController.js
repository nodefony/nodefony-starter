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
			var myFunc2 = () => {
				return new Promise ( (resolve, reject) =>{
					setTimeout( () =>{
						resolve({status:200, data:"foo"});
					}, 1000)
				})
			}
			var ele = new Promise ( (resolve, reject) =>{
				setTimeout(() =>{
					resolve( myFunc2() );
				}, 2000)
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
				}, 2000)
			}).then( (ele) => {
				return new Promise ( (resolve, reject) =>{
					setTimeout( () =>{
						resolve({status:200, data:ele});
					}, 1000)
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
						resolve({status:200, time:"1000"});
					}, 1000)
				})
			}

			var myFunc2 = () => {
				return new Promise ( (resolve, reject) =>{
					setTimeout( () =>{
						resolve({status:200, time:"2000"});
					}, 2000)
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
						resolve({status:200, time:"1000"});
					}, 1000)
				})
			}

			var myFunc2 = () => {
				return new Promise ( (resolve, reject) =>{
					setTimeout( () =>{
						resolve({status:200, time:"2000"});
					}, 2000)
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
 	 	 *	promise 
 	 	 *
 	 	 */
		promise5(){
			
			this.getResponse().setHeaders({
				'Content-Type': "text/json ; charset="+ this.context.response.encoding
			})

			Promise.chain = function(tab){
				var ele = tab[0]()
				var res = null ;
				for ( var i = 1; i < tab.length; i++){
					res = ele.then(tab[i])
				}
				return res ;
			}

			var myFunc = () => {
				return new Promise ( (resolve, reject) =>{
					setTimeout( () =>{
						console.log("PASSSSS 1")
						resolve({status:200, time:"1000"});
					}, 1000)
				})
			}

			var myFunc2 = () => {
				return new Promise ( (resolve, reject) =>{
					setTimeout( () =>{
						console.log("PASSSSS 2")
						resolve({status:200, time:"2000"});
					}, 2000)
				})
			}

			return Promise.chain([myFunc, myFunc2]).then(function (ele)  {
				console.log(arguments)
				return JSON.stringify( ele ) ;
			});
		}

	}	
	return controllerTest;
});
