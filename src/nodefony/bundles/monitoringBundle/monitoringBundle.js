
nodefony.registerBundle ("monitoring", function(){

	/**
	 *	The class is a **`monitoring` BUNDLE** .
	 *	@module NODEFONY
	 *	@main NODEFONY
	 *	@class monitoring
	 *	@constructor
	 *	@param {class} kernel
	 *	@param {class} container
	 *	
	 */
	var monitoring = function(kernel, container){

		// load bundle library 
		//this.autoLoader.loadDirectory(this.path+"/core");

		this.mother = this.$super;
		this.mother.constructor(kernel, container);

		/*
		 *	If you want kernel wait monitoringBundle event <<onReady>> 
		 *
		 *      this.waitBundleReady = true ; 
		 */	
		
		this.kernel.listen(this, "onReady", function(){
			if ( this.container.getParameters("bundles."+this.name).debugBar) {
				this.logger("ADD DEBUG BAR MONITORING", "WARNING");
				var bundles = function(){
					var obj = {};
					for (var bundle in this.kernel.bundles ){
						obj[bundle] = {
							name:this.kernel.bundles[bundle].name,
							version:this.kernel.bundles[bundle].settings.version
						}	
					}
					return obj;
				}.call(this);
				var env = this.kernel.environment ;
				var app = this.getParameters("bundles.App").App ;
				var node = process.versions ;
				var upload = this.container.get("upload");
				var translation = this.container.get("translation");
				var domain =  translation.defaultDomain ;
				var nbServices = Object.keys(nodefony.services).length ;
				var service = {
					upload : {
						tmp_dir:upload.config.tmp_dir,
						max_size:upload.config.max_filesize
					},
					translation:{
						defaultLocale:translation.defaultLocale,
						defaultDomain: domain	
					}
				}; 
				var security = function(){
					var obj = {};
					var firewall = this.container.get("security")
					if (firewall){
						for (var area in firewall.securedAreas ){
							//console.log(firewall.securedAreas[area])
							obj[area] = {};
							obj[area]["pattern"] = firewall.securedAreas[area].regPartten;
							obj[area]["factory"] = firewall.securedAreas[area].factory ? firewall.securedAreas[area].factory.name : null ;
							obj[area]["provider"] = firewall.securedAreas[area].provider ? firewall.securedAreas[area].provider.name : null ;
						}
					}
					return obj ; 
				}.call(this);

				this.kernel.listen(this, "onServerRequest",function(request, response, logString, d){
					request.nodefony_time = new Date().getTime();	
				});
				this.kernel.listen(this, "onRequest",function(context){
					try {
						var trans = context.get("translation");
						//console.log(context.session)
						if ( context.resolver.resolve ){
							var obj = {
								bundle:context.resolver.bundle.name,
								bundles:bundles,
								node:node,
								services:service,
								nbServices:nbServices,
								security:security,
								route:{
									name:context.resolver.route.name,
									uri:context.resolver.route.path,
									variables:context.resolver.variables 
								},
								varialblesName:context.resolver.route.variables,
								kernelSettings:this.kernel.settings,
								environment:env,
								debug:this.kernel.debug,
								appSettings:app,
								request:{
									url:context.request.url.href,
									method:context.request.method,
									remoteAdress:context.request.remoteAdress,
									queryPost:context.request.queryPost,
									queryGet:context.request.queryGet,
									headers:context.request.headers,
									crossDomain:context.crossDomain
								},
								session:{
									id:context.session.id,
									name:context.session.name,
									storage:context.session.settings.handler,
									path:context.session.settings.save_path
								},
								locale:{
									default:trans.defaultLocale,
									domain:trans.defaultDomain
								}
							};
							//console.log(context.security)
							if ( context.security ){
								obj["context_secure"] = {
									name: context.security.name ,
									factory : context.security.factory.name,
									//token:context.security.token.name
									user:context.user
								}	
							}else{
								obj["context_secure"] = null ;	
							}
								
							if ( context.resolver.route.defaults ) {
								var tab = context.resolver.route.defaults.controller.split(":") ;
								obj["controllerName"] = ( tab[1] ? tab[1] : "default" ) ;
								obj["action"] = tab[2] ;
								obj["pattern"] = context.resolver.route.defaults.controller ;
								obj["controller"] = context.resolver.route.defaults.controller
							}

							context.listen(this, "onView", function(result, context){
								obj["timeRequest"] = (new Date().getTime() ) - (context.request.request.nodefony_time )+" ms";
								obj["session"] = nodefony.extend(obj["session"],{
									metas:context.session.metaBag(),
									attributes:context.session.attributes(),
									flashes:context.session.flashBags()
								});
								obj["response"] = {	
									statusCode:context.response.statusCode,
									message:context.response.response.statusMessage,
									size:context.response.body.length ,
									encoding:context.response.encoding,
									"content-type":context.response.response.getHeader('content-type')
								}
								if( !  context.request.isAjax() && obj.route.name !== "monitoring" ){
									var View = this.container.get("httpKernel").getView("monitoringBundle::debugBar.html.twig");
									if (typeof context.response.body === "string" && context.response.body.indexOf("</body>") > 0 ){
										this.get("templating").renderFile(View, obj,function(error , result){
											if (error){
												throw error ;
											}
											context.response.body = context.response.body.replace("</body>",result+"\n </body>") ;
										});
									}else{
										//context.setXjson(obj);
									}
								}else{
									//context.setXjson(obj);	
								}
							});
						}
					}catch(e){
						this.kernel.logger(e, "ERROR");
					}
				});
				
			}
		}.bind(this));
	};
	return monitoring;
});
