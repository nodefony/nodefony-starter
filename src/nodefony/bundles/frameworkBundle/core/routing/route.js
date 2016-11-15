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

	Route.prototype.match = function(context){
		
		var url = context.request.url.pathname ;
		var res = url.match(this.pattern);
		//console.log(res)
		if (!res) {
			return res;
		}

		//check requierments
		try {
			this.matchRequirements(context) ;	
		}catch(e){
			throw  e  ;
		}
		//check Hostname
		try {
			this.matchHostname(context) ;	
		}catch(e){
			throw  e  ;
		}

		//check options
		try {
			this.matchOptions(context) ;	
		}catch(e){
			throw  e  ;
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


	Route.prototype.matchHostname = function(context){
		if ( this.host !== null ){
			if ( this.host === context.domain){
				return true;
			}
			throw {
				message:	"Domain "+ context.domain +" Unauthorized",
				status:		401
			};
		}
		return true ;
	}

	Route.prototype.matchRequirements = function(context){
		if ( this.hasRequirements() ){
			for(var i  in this.requirements ){
				switch (i){
					case "method":
						var req = this.requirements[i].replace(" ","").toUpperCase();
						if (req.split(",").lastIndexOf(context.method) < 0){
							throw {
								message:	"Method "+ context.method +" Unauthorized",
								status:		401	
							}
						}
					break;
					case "domain":
						if (context.domain !== this.requirements[i]){
							throw {
								message:	"Domain "+ context.domain +" Unauthorized",
								status:		401
							};
						}
					break;
				}
			}
		}
		return true;
	}

	Route.prototype.matchOptions = function(context){
		var testOpt = true ;	
		for(var i  in this.options ){
			
		}
		return testOpt;
	};

	return Route

});

