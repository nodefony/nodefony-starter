/*
 *
 *
 *
 *
 *
 */

var Querystring = require('querystring');

nodefony.registerService("router", function(){



	/*
 	 *
 	 *
 	 *	ROUTER
 	 *
 	 *
 	 */
	var pluginReader = function(){
		
		var importXmlConfig = function(xml, prefix, callback, parser){
			if (parser){
				xml = this.render(xml, parser.data, parser.options);
			}
			var routes = [];
			this.xmlParser.parseString(xml, (err, node) => {
				if(err) { this.logger("ROUTER xmlParser.parseString : " + err, 'WARNING');}
				if ( ! node ) { return node; }
				for(var key in node){
					switch(key){
						case 'route': 
							if(prefix){
								for( let skey in node[key]){
									node[key][skey].id = prefix.replace('/', '_') + '_' + node[key][skey].id;
									if ( node[key][skey].id.charAt(0) === '_'){
										node[key][skey].id = node[key][skey].id.slice(1);
									}
									node[key][skey].pattern = prefix + node[key][skey].pattern;
								}
							}
							routes = routes.concat(node[key]);
							break;
						case 'import':
							
							/*
							 * TODO PROBLEME DE LOAD DE FICHIER: path + getReaderFunc
							 */
							for( let skey in node[key]){
								routes = routes.concat(importXmlConfig.call(this, '/' + node[key][skey].resource, (node[key][skey].prefix ? node[key][skey].prefix : '')));
							}
							break;
					}
				}
			});
			if(callback) {
				normalizeXmlJson.call(this, this.xmlToJson.call(this, routes), callback);
			} else {
				return routes;
			}
		};
		
		var normalizeXmlJson = function(routes, callback){
			for(var route in routes){
				for(var param in routes[route]){

					if(['pattern', 'host'].indexOf(param) >= 0){
						routes[route][param] = routes[route][param][0];
					} else {

						if(routes[route][param] instanceof Array){
							var args = {};
							for(var elm=0; elm < routes[route][param].length; elm ++){
								//console.log(routes[route][param][elm])
								//console.log(route)
								for(var sparam in routes[route][param][elm]){
									//console.log(sparam)
									args[sparam] = routes[route][param][elm][sparam];								
								}
							}
							routes[route][param + 's'] = args;
							delete routes[route][param];
						}	
					}
				}
			}
			if(callback) { callback(routes); }
		};
		
		var getObjectRoutesXML = function(file, callback, parser){
			importXmlConfig.call(this, file, '', callback, parser);
		};
		
		var getObjectRoutesJSON = function(file, callback, parser){
			if (parser){
				file = this.render(file, parser.data, parser.options);
			}
			if(callback) { callback(JSON.parse(file)); }
		};
		
		var getObjectRoutesYml = function(file, callback, parser){
			if (parser){
				file = this.render(file, parser.data, parser.options);
			}
			if(callback) { callback(yaml.load(file)); }
		};

		return {
			xml:getObjectRoutesXML,
			json:getObjectRoutesJSON,
			yml:getObjectRoutesYml,
			annotation:null
		};
	}();


	/*
 	 *
 	 * CLASS RESOLVER
 	 *
 	 *
 	 */
	var regAction =/^(.+)Action$/; 
	nodefony.Resolver  = class Resolver extends nodefony.Service { 

		constructor (container, router){

			super("resolver" , container, container.get("notificationsCenter") ) ;
			//this.container = container;
			this.router = router ;
			this.resolve = false;
			this.kernel = this.container.get("kernel");
			this.defaultAction = null;
			this.defaultView = null;
			this.variables = [];
			//this.notificationsCenter = this.container.get("notificationsCenter") ;
			this.context = this.container.get("context") ;
			this.defaultLang= null ;
			this.bypassFirewall = false ;
			
		}

		match (route, context){
			try {
				var match = route.match(context); 
				if ( match ){
					this.variables = match;
					this.request = context.request.request;
					this.route = route;
					this.parsePathernController(route.defaults.controller);
					this.bypassFirewall = route.bypassFirewall ;
					this.defaultLang = route.defaultLang ;
					
				}		
				return match;
			}catch(e){
				throw e ;
			}
		}

		getRoute (){
			return this.route ;
		}

		getAction (name){
			var obj = Object.getOwnPropertyNames(this.controller.prototype) ; 
			for (var i= 0 ; i < obj.length ; i++ ){ //  func in obj ){
				if (typeof this.controller.prototype[obj[i]] === "function"){
					var res = regAction.exec(obj[i]);
					if (res){
						if ( res[1] === name){
							return this.controller.prototype[obj[i]];
						}
					}else{
					
					}
				}
			}
			return null;
		}

		parsePathernController (name){
			var tab = name.split(":");
			this.bundle = this.kernel.getBundle( this.kernel.getBundleName(tab[0]) );
			if ( this.bundle ){
				if (this.kernel.environment === "dev" && ! this.context.autoloadCache.bundles[this.bundle.name]){
					this.context.autoloadCache.bundles[this.bundle.name] = {
						controllers:{}	
					};
				}
				if (this.bundle.name !== "framework"){
					this.container.set("bundle", this.bundle);
				}
				this.controller = this.getController(tab[1]);
				if ( this.controller ){
					this.action = this.getAction(tab[2]);
					if (! this.action ){
						throw new Error("Resolver "+ name +" :In CONTROLLER: "+ tab[1] +" ACTION  :"+tab[2] + " not exist");
					}
				}else{
					throw new Error("Resolver "+ name +" : controller not exist :"+tab[1] );
				}
				this.defaultView = this.getDefaultView(tab[1], tab[2] );
				this.resolve = true;
			}else{
				throw new Error("Resolver "+ name +" :bundle not exist :"+tab[0] );
			}
		}
		
		getDefaultView (controller, action){
			//FIXME .html ???
			var res = this.bundle.name+"Bundle"+":"+controller+":"+action+".html."+this.container.get("templating").extention;
			return res ; 	
		}
		
		getController (name){
			if (this.kernel.environment === "dev" && ! this.context.autoloadCache.bundles[this.bundle.name].controllers[name]){
				this.context.autoloadCache.bundles[this.bundle.name].controllers[name] = true ;
				this.bundle.reloadController(name, this.container);
			}
			return this.bundle.controllers[name];
			
		}

		logger (pci, severity, msgid,  msg){
			if (! msgid) { msgid = "SERVICE RESOLVER"; }
			return this.syslog.logger(pci, severity, msgid,  msg);
		}

		callController (data){
			if (this.context.isRedirect){
				return ;
			}
			try {
				var controller = new this.controller( this.container, this.context );
				this.container.set("controller", controller );
				if ( data ){
					this.variables.push(data); 
				}
				var result =  this.action.apply(controller, this.variables);
				switch (true){
					case result instanceof nodefony.Response :
					case result instanceof nodefony.wsResponse :
						this.notificationsCenter.fire("onResponse", result, this.context);
					break ;
					case result instanceof Promise :
						return result;
					case nodefony.typeOf(result) === "object" :
						if ( this.defaultView ){
							result = controller.render(this.defaultView, result );
							this.notificationsCenter.fire("onResponse", result, this.context);
						}else{
							throw {
								status:500,
								message:"default view not exist"
							};
						}
					break;
					default:
						//this.logger("WAIT ASYNC RESPONSE FOR ROUTE : "+this.route.name ,"DEBUG")
						// CASE async controller wait fire onResponse by other entity
				}
				return result;
			}catch(e){
				throw e;
			}
		}
	};

	var generateQueryString = function(obj, name){
		if ( obj._keys ){delete obj._keys ;}
		var size = ( Object.keys(obj).length ) ;
		if ( ! size ) { return "" ; }
		var str = "?";
		if ( nodefony.typeOf(obj) !== "object" || obj === null){
			this.logger("BAD arguments queryString in route varaibles :" + name ,"WARNING");
			return "";
		}
		var iter = 0 ;
		for (let ele in obj){
			iter++ ;
			str += Querystring.escape( ele ) + "=" + Querystring.escape( obj[ele] )   ;
			if (size > iter ){
				str += "&";
			}
		}
		return str ; 
	};

	var Router = class Router extends nodefony.Service { 

		constructor (container){

			super("router", container , container.get("notificationsCenter"));
			this.routes = [];
			this.reader = function(context){
				var func = context.container.get("reader").loadPlugin("routing", pluginReader);
				return function(result){
					return func(result, context.nodeReader.bind(context));
				};
			}(this);
			this.engineTemplate = this.get("templating");
			this.engineTemplate.extendFunction("path", (name, variables, host) => {
				try {
					return this.generatePath( name, variables, host);
				}catch(e){
					this.logger(e.error, "ERROR");
					throw {
						status:500,
						error:e.error
					};
				}
			});
			//this.syslog = this.container.get("syslog"); 
		}
	
		generatePath (name, variables, host){
			var route =  this.getRoute(name) ;
			var queryString = variables ? variables.queryString : null ;
			if (! route ){
				throw {error:"no route to host  "+ name};
			}
			var path = route.path;
			if ( route.variables.length ){
				for ( var i = 0 ; i < route.variables.length ; i++){
					var ele = route.variables[i] ;
					if ( variables[ ele ]){
						path = path.replace("{"+ele+"}",  variables[ele]);
					}else{
						if ( route.defaults[ ele ] ){
							path = path.replace("{"+ele+"}",  route.defaults[ ele ] );
						}else{
							var txt = "";
							for (var i= 0 ; i < route.variables.length ;i++ ){
								txt += "{"+route.variables[i]+"} ";
							}
							throw {error:"router generate path route "+ name + " must have variable "+ txt};
							//throw {error:"router generate path route "+ name + " don't  have variable "+ ele};	
						}
					}
				}
			}
			if ( queryString ){
				path += generateQueryString.call(this, variables.queryString, name);
			}
			if (host){
				return host+path ;
			}
			return path ;

		}
			
		/*addRoute (name , route){
			if (route instanceof nodefony.Route){
				this.routes[name] = route;
			}else{
				var routeC = this.createRoute(route);
				this.routes[name] = routeC;
			}
			this.logger("ADD Route : "+route.path + "   ===> "+route.defaults.controller, "DEBUG");
		};*/

		getRoute (name){
			if (this.routes[name]){
				return this.routes[name];
			}
			this.logger("Route name: "+name +" not exist");
			return null ;
		}

		setRoute (name, route){
			var myroute = null ;
			if ( route instanceof nodefony.Route){
				myroute = route;
			}else{
				myroute = this.createRoute(route);
			}
			var index = this.routes.push(myroute);
			//var index = this.routes.unshift(myroute);
			if (this.routes[name]){
				this.logger("WARNING ROUTES HAS SAME NAME : "+myroute.path + "   ===> "+myroute.defaults.controller, "WARNING");
			}
			this.routes[name] = this.routes[index-1];
			this.logger("ADD Route : "+myroute.path + "   ===> "+myroute.defaults.controller, "DEBUG");
		}

		getRoutes (name){
			if (name){
				return this.routes[name];
			}
			return this.routes;
		}

		resolve (container, context){
			var resolver = new nodefony.Resolver(container, this);
			for (var i = 0; i<this.routes.length; i++){
				var route = this.routes[i];
				try {
					var res = resolver.match(route, context);
					if ( res ){
						break ;
					}
				}catch(e){
					throw e ;
				}
			}
			return resolver;
		}

		resolveName (container, name){
			try {
				var resolver = new nodefony.Resolver(container, this);	
				resolver.parsePathernController(name);
				return resolver;
			}catch(e){
				throw e ;
			}
		}

		createRoute (obj){
			return new nodefony.Route(obj);
		}

		logger (pci, severity, msgid,  msg){
			if (! msgid) { msgid = "SERVICE ROUTER";}
			return this.syslog.logger(pci, severity, msgid,  msg);
		}

		nodeReader (obj){
			//console.log(require('util').inspect(obj, {depth: null}));
			for (var route in obj){
				var name = route ;
				var newRoute = new nodefony.Route(route);
				for ( var ele in obj[route] ){
					var arg = obj[route][ele];
					switch ( ele ){
						case "pattern" :
							newRoute.setPattern(arg);
						break;
						case "host" :
							newRoute.setHostname(arg);
						break;					
						case "firewalls" :
							newRoute.setFirewallConfigRoute(arg);
						break;
						case "defaults" :
							for (let ob in arg){
								newRoute.addDefault(ob, arg[ob] );	
							}
						break;
						case "requirements" :
							for (let ob in arg){
								newRoute.addRequirement(ob, arg[ob] );	
							}
						break;
						case "options" :
							for (let ob in arg){
								newRoute.addOptions(ob, arg[ob] );	
							}
						break;
						default:
							this.logger(" Tag : "+ele+ " not exist in routings definition");
					}
				}
				newRoute.compile();
				//this.addRoute(name, newRoute);
				this.setRoute(name, newRoute);
			}
		}
	};	
	return Router;
});
