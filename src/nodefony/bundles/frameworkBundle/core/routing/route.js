/*
 *
 *
 *
 *
 *
 */

var Url = require('url') ;

nodefony.register("Route", function(){



	var decode = function(str) {
		try {
			return decodeURIComponent(str);
		} catch(err) {
			return str;
		}
	};



	/*
 	 *	CLASS ROUTE
 	 *
 	 */
	var Route = function(name, obj){
		this.name = name ; 
		this.path  = null; 
		this.host= null;                     	
		this.defaults= {};     
            	this.requirements= {};
		//TODO 	
            	this.options= {};

		//TODO http | websocket
            	this.schemes= null;      
		//TODO with obj
		if ( obj ){
			this.setName(obj.id);
			this.setPattern(obj.pattern);
			this.compile();
		}
		this.variables = [];
		this.pattern = null;
	};

	Route.prototype.setName = function(name){
		this.name = name ;
	};

	Route.prototype.setPattern = function(pattern){
		this.path = pattern;
	};
	
	Route.prototype.setHostname = function(hostname){
		this.host = hostname;
	};
	
	Route.prototype.addDefault = function(key , value){
		this.defaults[key] = value;
	};	

	Route.prototype.addRequirement= function(key , value){
		this.requirements[key] = value;
	};

	Route.prototype.getRequirement= function(key){
		return this.requirements[key] ;
	};

	Route.prototype.hasRequirements = function(){
		return Object.keys( this.requirements ).length;
	};

	Route.prototype.addOptions = function(key , value){
		this.options[key] = value;
	};


	Route.prototype.setPath = function(){}
	Route.prototype.setRequirements = function(){}
	Route.prototype.setOptions = function(){}
	Route.prototype.setMethods = function(){}
	Route.prototype.setHost = function(){}
	Route.prototype.setSchemes = function(){}
	

	
	Route.prototype.compile = function(){
		var pattern = this.path.replace(/(\/)?(\.)?\{([^}]+)\}(?:\(([^)]*)\))?(\?)?/g, function(match, slash, dot, key, capture, opt, offset) {
			var incl = (this.path[match.length+offset] || '/') === '/';
			var index = this.variables.push(key);
			//this.variables[key] = this.variables[index-1]; 
			return (incl ? '(?:' : '')+(slash || '')+(incl ? '' : '(?:')+(dot || '')+'('+(capture || '[^/]+')+'))'+(opt || '');
		}.bind(this));
		pattern = pattern.replace(/([\/.])/g, '\\$1').replace(/\*/g, '(.+)');
		this.pattern = new RegExp('^'+pattern+'[\\/]?$', 'i');
		return this.pattern ;
	}

	Route.prototype.match = function(request){
		if ( request.url ){	
			if (typeof request.url == "string"){
				var url = Url.parse(request.url).pathname ;	
			}else{
				var url = request.url.pathname  ;
			}
		}else{
			if ( request.resourceURL &&  request.httpRequest ){
				var url = request.resourceURL.pathname;
				request.method = "WEBSOCKET";
			}
		}
		//console.log(request.url)
		//console.log(url)
		var res = url.match(this.pattern);
		//console.log(res)
		if (!res) {
			return res;
		}
		//check requierments
		if ( ! this.matchRequirements(request) ){
			return false;	
		}
		//check requierments
		if ( ! this.matchOptions(request) ){
			return false;
		}
		var map = [];
		res.slice(1).forEach(function(param, i) {
			var k = this.variables[i] || 'wildcard';
			param = param && decode(param);
			var req = this.getRequirement(k);
			if ( req ){
				if ( req instanceof RegExp){
					var result = req.test(param) ;
				}else{
					var result = new RegExp(req).test(param);
				}
				if( ! result ){
					map = false ;
					return;
				}
			}
			//var index = map.push( map[k] ? [].concat(map[k]).concat(param) : param );
			var index = map.push( param )
			map[k] = map[index-1] ;
		}.bind(this));
		if ( map && map.wildcard) {
			map['*'] = map.wildcard;
		}
		return map;
	}

	Route.prototype.matchRequirements = function(request){
		var testReq = true ;	
		if ( this.hasRequirements() ){
			for(var i  in this.requirements ){
				switch (i){
					case "method":
						var req = this.requirements[i].replace(" ","").toUpperCase();
						/*if (request.httpRequest)
							request.method = "WEBSOCKET";*/
						if (req.split(",").lastIndexOf(request.method) < 0){
							testReq = false;
						}
					break;
					case "domain":
						if (request.domain !== this.requirements[i]){
							testReq = false;
						}
					break;
				}
				if (!testReq)
					break;
			}
			return testReq;
		}
		return testReq;
	}

	Route.prototype.matchOptions = function(request){
		var testOpt = true ;	
		for(var i  in this.options ){
			
		}
		return testOpt;
	};

	return Route

});

