/*
 *	The MIT License (MIT)
 *	
 *	Copyright (c) 2013/2014 cci | christophe.camensuli@nodefony.com
 *
 *	Permission is hereby granted, free of charge, to any person obtaining a copy
 *	of this software and associated documentation files (the 'Software'), to deal
 *	in the Software without restriction, including without limitation the rights
 *	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *	copies of the Software, and to permit persons to whom the Software is
 *	furnished to do so, subject to the following conditions:
 *
 *	The above copyright notice and this permission notice shall be included in
 *	all copies or substantial portions of the Software.
 *
 *	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *	THE SOFTWARE.
 */


nodefony.registerController("api", function(){

		/**
		 *	The class is a **`api` CONTROLLER** .
		 *	@module api
		 *	@main api
		 *	@class api
		 *	@constructor
		 *	@param {class} container   
		 *	@param {class} context
		 *	
		 */
		var apiController = function(container, context){
			this.mother = this.$super;
			this.mother.constructor(container, context);
		};



		apiController.prototype.renderRest = function(data){
		
			var context = this.getContext() ;
			var type = context.request.queryGet.format || context.request.headers["X-FORMAT"] || "" ;

			switch( type.toLowerCase() ){
				case "application/xml" : 
				case "text/xml" : 
				case "xml" : 
					this.getResponse().setHeader('Content-Type' , "application/xml"); 
					return this.render('monitoringBundle:api:api.xml.twig',data);
				break
				default:
					this.getResponse().setHeader('Content-Type' , "application/json"); 
					return this.render('monitoringBundle:api:api.json.twig',data);
			}

			
		};



		/**
		 *
		 *	@method routesAction
		 *
		 */
		apiController.prototype.routesAction = function(name){

			return this.renderRest({
				code:200,
			        type:"SUCCESS",
			        message:"Operation Réussi",
				data:JSON.stringify(this.get("router").routes)
			});
		};



		/**
		 *
		 *	@method servicesAction
		 *
		 */
		apiController.prototype.servicesAction = function(name){

			var services = {}
			for (var service in nodefony.services){
				var ele = this.container.getParameters("services."+service);
				services[service] = {};
				services[service]["name"] = service;
				if (ele){
					var inject = "";
					var i = 0;
					for (var inj in ele.injections){
						var esc = i === 0 ? "" : " , ";
						inject += esc+inj;
						i++;	
					}
					services[service]["run"] = "CONFIG"	
					services[service]["scope"] = ele.scope === "container" ? "Default container" :	ele.scope ;
					services[service]["calls"] = ele.calls	;
					services[service]["injections"] = inject;
					services[service]["properties"] = ele.properties;
					services[service]["orderInjections"] = ele.orderArguments ? true : false;
				}else{
					services[service]["run"] = "KERNEL"	
					services[service]["scope"] = "KERNEL container"	
				
				}		
			}

			return this.renderRest({
				code:200,
			        type:"SUCCESS",
			        message:"Operation Réussi",
				data:JSON.stringify(services)
			});
		};


		/**
		 *
		 *	@method syslogAction
		 *
		 */
		apiController.prototype.syslogAction = function(name){

			return this.renderRest({
				code:200,
			        type:"SUCCESS",
			        message:"Operation Réussi",
				data:JSON.stringify(this.get("syslog").ringStack)
			});
		};




		/**
		 *
		 *	@method realTimeAction
		 *
		 */
		apiController.prototype.realtimeAction = function(name){

			var service  = this.get("realTime")
			if ( ! service){
				return this.renderRest({
					code:404,
			        	type:"ERROR",
			        	message:"Service realtime not found",
				}); 
			}
			switch(name){
				case "connections":
					var obj ={connections:{}};
					for (var connect in service.connections.connections){
						var conn = service.connections.connections[connect]; 
							obj.connections[connect] = {
								remote:conn.remote,
								nbClients:Object.keys(conn.clients).length
							};
					}
					try {
						return this.renderRest({
							code:200,
							type:"SUCCESS",
							message:"Operation Réussi",
							data:JSON.stringify(obj) //JSON.stringify(service.connections)
						});

					}catch(e){
						this.logger(e, "ERROR");
						this.realtimeAction("error");
					}

				break;
				case "error" :
				default:
					return this.renderRest({
						code:404,
			        		type:"ERROR",
			        		message:"not found",
					});
			}
			
		};


		/**
		 *
		 *	@method websocketAction
		 *
		 */
		apiController.prototype.websocketAction = function(){
			

		}



		
		return apiController;
});
