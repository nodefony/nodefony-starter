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
		
		frameworkController.prototype["404Action"] = function(message){
			return this.render('frameworkBundle::404.html.twig', nodefony.extend( {url:this.context.url}, message) );
		};

		frameworkController.prototype["401Action"] = function(error){
			var res = nodefony.extend( {url:this.context.url}, error);
			return this.render('frameworkBundle::401.html.twig', res );
		};

		frameworkController.prototype["403Action"] = function(error){
			var res = nodefony.extend( {url:this.context.url}, error);
			return this.render('frameworkBundle::403.html.twig', res );
		};
		
		frameworkController.prototype.exceptionsAction = function(exp){
			var ele = {
				title:"Exception",
				exception:util.inspect( exp.exception )
			}
			return this.render('frameworkBundle::exception.html.twig', nodefony.extend(ele, exp) );	
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
			if ( options ){
				nodefony.extend(obj, options);
				if (options.view) {
					if ( options.renderView ){
						return this.renderView(options.view, obj );
					}else{
						return this.render(options.view, obj );
					}
				}
				if (options.renderView){
					return this.renderView('frameworkBundle::system.html.twig',obj );	
				}
			}else{
				return this.render('frameworkBundle::system.html.twig',obj );
			}
		};

		frameworkController.prototype.readmeAction = function(){
			var kernel = this.container.get("kernel");
			var path = kernel.rootDir+'/README.md';
			var file = new nodefony.fileClass(path);
			var res = this.htmlMdParser(file.content(),{
				linkify: true,
				typographer: true	
			});
			return  this.render('frameworkBundle::md.html.twig',{
					html:res
				});
		}


		return frameworkController;
});
