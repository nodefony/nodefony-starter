stage.register("router",function(){
		
		

	var decode = function(str) {
		try {
			return decodeURIComponent(str);
		} catch(err) {
			return str;
		}
	};


	var Route = function(id, path, defaultParams){
		this.id = id ;
		this.path = path;
		this.template = null;	
		this.controller =null;
		this.defaults =  defaultParams;
		this.variables = [];
		this.pattern = this.compile();
	};

	Route.prototype.compile = function(){
		var pattern = this.path.replace(/(\/)?(\.)?\{([^}]+)\}(?:\(([^)]*)\))?(\?)?/g, function(match, slash, dot, key, capture, opt, offset) {
			var incl = (this.path[match.length+offset] || '/') === '/';
			this.variables.push(key);
			return (incl ? '(?:' : '')+(slash || '')+(incl ? '' : '(?:')+(dot || '')+'('+(capture || '[^/]+')+'))'+(opt || '');
		}.bind(this));
		pattern = pattern.replace(/([\/.])/g, '\\$1').replace(/\*/g, '(.+)');
		this.pattern = new RegExp('^'+pattern+'[\\/]?$', 'i');
		return this.pattern ;	
	};

	Route.prototype.match = function(url){
		var res = url.match(this.pattern);
		//console.log(res)
		if (!res) {
			return res;
		}
		var map = [];
		var tab = res.slice(1) ;
		for (var i = 0 ; i<tab.length; i++){
			var k = this.variables[i] || 'wildcard';
			var param = tab[i] && decode(tab[i]);
			//var index = map.push( map[k] ? [].concat(map[k]).concat(param) : param );
			var index = map.push( param )
			map[k] = map[index-1] ;

		}
		/*res.slice(1).forEach(function(param, i) {
			var k = this.variables[i] || 'wildcard';
			param = param && decode(param);
			//var index = map.push( map[k] ? [].concat(map[k]).concat(param) : param );
			var index = map.push( param )
			map[k] = map[index-1] ;
		}.bind(this));*/
		if ( map && map.wildcard) {
			map['*'] = map.wildcard;
		}
		return map;
	};


	var Resolver = function(container){
		this.container = container;
		this.resolve = false;
		this.kernel = this.container.get("kernel");
		this.defaultAction = null;
		this.defaultView = null;
		this.variables = new Array();
		this.router = this.container.get("router")
		this.browser = this.container.get("browser")
		//this.notificationsCenter = this.container.get("notificationsCenter") ;
	
	};

	Resolver.prototype.match = function(route, url){
		var match = route.match(url); 
		if ( match ){
			this.variables = match;
			this.url = url;
			this.route = route;
			this.parsePathernController(route.defaults.controller)
		}		
		return match;
	};


	var regModuleName = /^(.*)Module[\.js]{0,3}$/;
	Resolver.prototype.getModuleName = function(str){
		var ret = regModuleName.exec(str);
		if (ret)
			return  ret[1] ;
		else
			throw "BAD MODULE PATTERN ";
	};

	Resolver.prototype.getController = function(name){
		return this.module.controllers[name+"Controller"];
	};

	Resolver.prototype.getAction = function(name){
		var ele = name+"Action" ;
		if ( ele in this.controller ){
			return this.controller[ele]
		}
		return null;
	};

	Resolver.prototype.getDefaultView = function(controller, action){
		var res = this.module.name+"Module"+":"+controller+":"+action+".html.twig";
		return res ; 
	};


	Resolver.prototype.parsePathernController = function(pattern){
		if (typeof pattern !== "string"){
			throw new Error("Resolver : pattern : "+pattern +" MUST be a string");	
		}
		this.route = this.router.getRouteByPattern(pattern);
		var tab = pattern.split(":")
		try {
			this.module = this.kernel.getModule( this.getModuleName(tab[0]) );
		}catch(e){
			throw new Error("Resolver pattern error module :  " + pattern + " : " +e );
		}
		if ( this.module ){
			this.controller = this.getController(tab[1]);
			if ( this.controller ){
				if (tab[2]){
					this.action = this.getAction(tab[2]);
					if (! this.action ){
						throw new Error("Resolver :In CONTROLLER: "+ tab[1] +" ACTION  :"+tab[2] + " not exist");
					}
				}else{
					this.action = null;	
				}
			}else{
				throw new Error("Resolver :controller not exist :"+tab[1] );
			}
			this.defaultView = this.getDefaultView(tab[1], tab[2] );
			this.resolve = true;
		}else{
			//this.logger("Resolver : not exist :"+tab[0] , "ERROR")
			throw new Error("Resolver : module not exist :"+tab[0] );
		}
	};
	
	Resolver.prototype.callController = function(arg){
		try{
			var ret = this.action.apply(this.controller, arg || [])	
		}catch(e){
			this.controller.logger.call(this.controller, e, "ERROR");	
			throw e;
		}
		return ret;
	};



	/*
	 *	ROUTER
	 */

	var cacheState = function(){
		var cacheState = window.history.state === undefined ? null : window.history.state;	
		return cacheState ;
	}

	var nativeHistory = !!(window.history && window.history.pushState );

	var service = function(kernel, container){
		this.kernel = kernel ;
		this.container = container ;
		this.notificationsCenter = this.container.get("notificationsCenter");
		this.syslog = kernel.syslog ;	
		this.routes = {};
		this.routePattern = {};
		this.location = this.get("location");
		this.browser = this.get("browser");

		/*
 		 * Extend Twig js	
 		 */
		window.Twig.extendFunction("path", function(name, variables, host){
			try {
				if (host){
					return  this.generateUrl.apply(this, arguments);	
				}else{
					var generatedPath = this.generateUrl.apply(this, arguments);
					return generatedPath?"#"+generatedPath:"";
				}
			}catch(e){
				this.logger(e.error)
				throw e.error
			}
		}.bind(this));

		this.notificationsCenter.listen(this,"onUrlChange" , function(url, lastUrl, absUrl ,cache){
			try{
				var res = this.resolve(url);
				if(! res.resolve ){
					this.forward("appModule:app:404");
					return ;
				}
				var last = this.resolveRoute(lastUrl) 
				if (last){
					this.notificationsCenter.fire("onRouteChange",{id:res.route.id, route:res.route, args:res.variables} ,{id:last.route.id, route:last.route, args:last.variables});
				}
			}catch (e){
				this.logger(e, "ERROR");
			}
		});
	};

	service.prototype.createRoute = function(id, path, defaultParams){
		if (id in this.routes ){
			this.logger("CREATE ROUTE : "+ id + "Already exist ", "ERROR");	
		}
		var route  = new Route(id, path, defaultParams);
		this.routes[id] = route;
		this.routePattern[this.routes[id].defaults.controller] = {
			route:this.routes[id],
 		        path:path	
		}
		this.logger("CREATE ROUTE : "+ id, "DEBUG");
		return route ;
	};

	service.prototype.getRoute = function(name){
		if (this.routes[name])
			return this.routes[name];
		return null;
	};



	service.prototype.resolveRoute = function(url){
		var resolver = new Resolver(this.container);
		var res = [];
		for (var routes in this.routes){
			var route = this.routes[routes];
			try {
				res = resolver.match(route, url);
				if (res){
					return resolver ; 
				}
			}catch(e){
				continue ;
			}
		}
		return null;
	};
	
	var regSerch = /(.*)\?.*$/;
	service.prototype.resolve = function(url){
		//console.log("RESOLVE " +url)
		//console.log(regSerch.exec(url) );
		var test = regSerch.exec(url) ;
		if ( test )
			url = test[1] ;
		var resolver = new Resolver(this.container);
		var res = [];
		for (var routes in this.routes){
			var route = this.routes[routes];
			try {
				res = resolver.match(route, url);
				if (res){
					this.notificationsCenter.fire("onBeforeAction", url, resolver );
					var ret = resolver.callController( res)
					this.notificationsCenter.fire("onAfterAction", url, resolver, ret );
					break;
				}
			}catch(e){
				this.logger("RESOLVE URL : "+ url + " " + e,"ERROR")
				this.forward("appModule:app:500", [e]);
			}
		}
		return resolver;
	};

	service.prototype.getRouteByPattern = function(pattern, args){
		//console.log(pattern)
		//console.log(this.routePattern)
		if (pattern in this.routePattern){
			//console.log("FIND")
			var route = this.routePattern[pattern].route ;
			return route;
		}
			//console.log("NOT FIND")
		return null;
	};

	service.prototype.resolvePattern = function(pattern){
		var resolver = new Resolver(this.container);	
		var route = resolver.parsePathernController(pattern);
		return resolver;
	};

	service.prototype.forward = function(pattern, args){
		var resolver = this.resolvePattern(pattern);
		if (resolver.resolve){
			try {
				if (resolver.route){
					this.logger("FORWARD PATTERN : "+ pattern + "  FIND ROUTE ==> REDIRECT ","DEBUG")
					this.redirect(resolver.route.path);
					//this.location.url(resolver.route.path);
					//this.logger("FORWARD PATTERN : "+ pattern + " find ROUTE : "+resolver.route.path +" redirect to URL :" + this.location.absUrl(),"DEBUG")
					//this.browser.url(this.location.absUrl(), true);
				}else{
					this.logger("FORWARD PATTERN : "+ pattern + "  NO ROUTE FIND  ==> CALL CONTROLLER"  , "DEBUG")
					var ret = resolver.callController(args);	
				}
			}catch(e){
				this.logger("FORWARD "+ pattern +" CALL CONTROLER  "+ resolver.controller.name +" : "+e,"ERROR")
				this.forward("appModule:app:500", [e]);
			}
		}else{
			this.logger("Router Can't resolve : "+pattern ,"ERROR");
		}
		return false;	
	};
	
	service.prototype.redirect = function(url){
		this.location.url(url);
		this.logger("REDIRECT URL : "+ url  +" BROWSER  URL :" + this.location.absUrl(),"DEBUG")
		this.browser.url(this.location.absUrl() , true);
	};
		
	service.prototype.generateUrl = function(name, variables, host){
		var route =  this.getRoute(name) ;
		if (! route ){
			this.logger("no route to host  :"+ name, "WARNING")
			//throw {error:"no route to host  "+ name};
			return null ; 
		}
		var path = route.path;
		if ( route.variables.length ){
			if (! variables  ){
				var txt = "";
				for (var i= 0 ; i < route.variables.length ;i++ ){
					txt += "{"+route.variables[i]+"} ";
				}
				this.logger("router generate path route '"+ name + "' must have variable "+ txt, "ERROR")
				return null;
			}
			for (var ele in variables ){
				if (ele === "_keys") continue ;
				var index = route.variables.indexOf(ele);
				if ( index >= 0 ){
					path = path.replace("{"+ele+"}",  variables[ele]);
				}else{
					this.logger("router generate path route '"+ name + "' don't  have variable "+ ele, "WARNING")
					return null;
				}	
			}	
		}
		if (host)
			return host+"#"+path ;
		return path ;
	};


	service.prototype.logger = function(pci, severity, msgid,  msg){
		if (! msgid) msgid = "ROUTER "
		return this.syslog.logger(pci, severity, msgid,  msg);
	};

	service.prototype.listen = function(){
		return this.notificationsCenter.listen.apply(this.notificationsCenter, arguments);
	};

	service.prototype.fire = function(){
		return this.notificationsCenter.fire.apply(this.notificationsCenter, arguments);
	
	};

	
	service.prototype.set = function(name, value){
		return this.container.set(name, value);	
	};

	service.prototype.get = function(name, value){
		return this.container.get(name, value);	
	};

		
	service.prototype.setParameters =function(name, value){
		return this.container.setParameters(name, value);	
	};

	service.prototype.getParameters = function(name){
		return this.container.getParameters
	};

	return service;		
		
});
