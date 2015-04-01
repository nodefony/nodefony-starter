/*
 *  
 *   
 *    
 *     	CONTROLLER default
 *      
 *      
 *        
 *         
 **/

nodefony.registerController("framework", function(){

		var frameworkController = function(container, context){
			this.mother = this.$super;
			this.mother.constructor(container, context);
		};

		frameworkController.prototype.indexAction = function(){
			return this.render('frameworkBundle::index.html.twig',{title:"WEB nodefony FRAMEWORK"});
		};
		frameworkController.prototype.connectAction = function(login){
			return this.renderView('frameworkBundle::connect.html.twig',{
				security:this.context.user,
			        login:login ? true : false 
			});
		};

		frameworkController.prototype.aboutAction= function(name){
			 return this.renderResponse('<html><body><h1>ABOUT</h1></body></html>');
		};

		frameworkController.prototype["404Action"] = function(error){
			return this.render('frameworkBundle::404.html.twig', nodefony.extend( {url:this.context.url}, error.exception) );
		};

		frameworkController.prototype["401Action"] = function(error){
			var res = nodefony.extend( {url:this.context.url}, error);
			return this.render('frameworkBundle::401.html.twig', res );
		};

		frameworkController.prototype["403Action"] = function(error){
			var res = nodefony.extend( {url:this.context.url}, error);
			return this.render('frameworkBundle::403.html.twig', res );
		};
		
		frameworkController.prototype.loginAction = function(){
			if ( ! this.context.session)
				this.startSession();
			var log = this.context.session.getFlashBag("session") ;
			if ( log )
				log["login"] = true ;
			else
				log = {login :true};
			//this.getResponse().setHeader('WWW-Authenticate',' Basic realm="My Realm"');
			//this.getResponse().setStatusCode(401);
			return this.render('frameworkBundle::login.html.twig',log);
		};

		frameworkController.prototype.logoutAction = function(){
			if (this.context.session)
				this.context.session.invalidate() ;
			return this.redirect("/login");
		};


		frameworkController.prototype.exceptionsAction = function(exp){
			var ele = {
				title:"Exception",
				exception:util.inspect( exp.exception )
			}
			return this.render('frameworkBundle::exception.html.twig', nodefony.extend(ele, exp) );	
		};

		frameworkController.prototype.docAction = function(){
			return this.render('frameworkBundle::documentation.html.twig',{} );
		};

		frameworkController.prototype.systemAction = function(options){
			var router = this.get("router");
			var kernel = this.get("kernel");
			var injection = this.get("injection");
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
			//console.log(services)
			var obj = {
				routes:router.routes,
				kernel:this.getParameters("kernel"),
				services:services
			};

			if (options && options.view){
				nodefony.extend(obj, options);
				return this.render(options.view, obj );
			}else{
				return this.render('frameworkBundle::system.html.twig',obj );
			}
		};


		return frameworkController;
});
