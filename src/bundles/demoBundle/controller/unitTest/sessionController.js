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


nodefony.registerController("session", function(){


	var sessionTest = class sessionTest extends nodefony.controller {

		constructor(container, context){
			super(container, context);
			this.sessionService = this.get("sessions");
		}
		
		/**
 	 	*
 	 	*	redirectAction 
 	 	*
 	 	*/
		sessionAction(type){
			switch(type){
				case "start" :
					return this.sessionService.start(this.context).then( (session)=>{
						return this.renderJson({
							id:session.id,
							status:session.status,
							contextSession:session.contextSession,
							strategy:session.strategy,
							name:session.name
						})	
					}).catch( (e) =>{
						throw e ;
					});
				break;
				case "invalidate" :
					return this.sessionService.start(this.context).then( (session)=>{
						var oldId = session.id ;
						session.invalidate();
						return this.renderJson({
							id:session.id,
							oldId:oldId,
							status:session.status,
							contextSession:session.contextSession,
							strategy:session.strategy,
							name:session.name
						})	
					}).catch( (e) =>{
						throw e ;
					});
				break;
				case "migrate" :
					return this.sessionService.start(this.context).then( (session)=>{
						var oldId = session.id ;
						session.migrate();
						return this.renderJson({
							id:session.id,
							oldId:oldId,
							status:session.status,
							contextSession:session.contextSession,
							strategy:session.strategy,
							name:session.name
						})	
					}).catch( (e) =>{
						throw e ;
					});
				break;
				default:
					if ( this.context.session ){
						var id = this.context.session.id
					}
					return this.renderJson({
						id: id || null
					})	
							
			}
		}
	};
	
	return sessionTest;
});
