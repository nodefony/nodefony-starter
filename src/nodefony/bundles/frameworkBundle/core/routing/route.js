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
	var Route = class Route {
		constructor (name, obj){
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
			this.bypassFirewall = false ;
			this.defaultLang = null ;
		};

		setName (name){
			this.name = name ;
		};

		setPattern (pattern){
			this.path = pattern;
		};
		
		setHostname (hostname){
			this.host = hostname;
		};
		
		addDefault (key , value){
			this.defaults[key] = value;
		};	

		addRequirement (key , value){
			this.requirements[key] = value;
		};

		getRequirement (key){
			return this.requirements[key] ;
		};

		hasRequirements (){
			return Object.keys( this.requirements ).length;
		};

		addOptions (key , value){
			this.options[key] = value;
		};


		/*setPath (){}
		setRequirements (){}
		setOptions (){}
		setMethods (){}
		setHost (){}
		setSchemes (){}*/
		

		
		compile (){
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

		match (context){
			
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

		setFirewallConfigRoute (obj){
			if ( ! obj ){
				return ;
			}
			if (obj.bypass){
				this.bypassFirewall = true ;
			}
		}


		matchHostname (context){
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

		matchRequirements (context){
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

		matchOptions (context){
			var testOpt = true ;	
			for(var i  in this.options ){
				
			}
			return testOpt;
		};
	};

	return Route
});
