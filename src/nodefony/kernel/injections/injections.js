/*
 *
 *
 *
 *
 *
 */

nodefony.register("injection", function(){
	
	// plugin Reader	
	var pluginReader = function(){
		
		var importXmlConfig = function(file, prefix, callback, parser){

			if (parser){
				file = this.render(file, parser.data, parser.options);
			}
			var services = [];
			var parameters;
			
			this.xmlParser.parseString(file, function(err, node){
				//console.log(require('util').inspect(node, {depth: null}));
				//console.log('\n\n');
				if(err) { this.logger("INJECTION xmlParser.parseString : " + err, 'WARNING') ;}
				if ( ! node ) { return node ;}
				for(var key in node){
					switch(key){
						case 'parameters' :
							parameters = this.xmlToJson.call(this, node[key][0].parameter);
							break;
							
						case 'services' :
							services = this.xmlToJson.call(this, node[key][0].service);
							break;
					}
				}
				
				if(callback) { nomarlizeXmlJson.call(this, services, parameters, callback);}
				
			}.bind(this));
		};
		
		var nomarlizeXmlJson = function(services, parameters, callback){
			for(let key in services){
				for(let param in services[key]){
					let values = null ;
					switch(param){
						case 'argument':
							values = [];
							for( let elm=0; elm < services[key][param].length; elm ++){
								if(services[key][param][elm].type && services[key][param][elm].id){
									if(services[key][param][elm].type == 'service'){
										values.push('@' + services[key][param][elm].id);
									}
								}
							}
							services[key]['arguments'] = values;
							delete services[key][param];
							break;
						case 'property':
							values = {};
							for(let elm=0; elm < services[key][param].length; elm ++){
								if(services[key][param][elm].type && services[key][param][elm].id && services[key][param][elm].name){
									if(services[key][param][elm].type == 'service'){
										values[services[key][param][elm].name] = '@' + services[key][param][elm].id;
									}
								}
							}
							services[key].properties = values;
							delete services[key][param];
							break;
							
						case 'call': 
							values = [];
							for(let elm=0; elm < services[key][param].length; elm ++){
								var tab = [];
								for(let sparam in services[key][param][elm]){
									switch(sparam){
										case 'method':
												tab[0] = services[key][param][elm][sparam];
											break;
										case 'argument':
											var args = [];
											for(let selem = 0; selem < services[key][param][elm][sparam].length; selem ++){
												if(services[key][param][elm][sparam][selem].type && services[key][param][elm][sparam][selem].id){
													if(services[key][param][elm][sparam][selem].type == 'service'){
														args.push('@' + services[key][param][elm][sparam][selem].id);
													}
												}
											}
											tab[1] = args;
											break;
									}
								}
								values.push(tab);
							}
							services[key].calls = values;
							delete services[key][param];
							break;
						case 'scope' :
						break;
					}
				}
			
			}
			if(callback) { renderParameters.call(this, callback, services, parameters);}
		};
		
		var renderParameters = function(callback, services, parameters){
			if(parameters && Object.keys(parameters).length > 0 && typeof(services) === 'object' && Object.keys(services).length > 0){
				services = JSON.parse(this.render(JSON.stringify(services), parameters));
			}
			callback(services);
		};
		
		var getServicesXML = function(file, callback, parser){
			importXmlConfig.call(this, file, '', callback, parser);
		};
			
		var getServicesJSON = function(file, callback, parser){
			if (parser) { file = this.render(file, parser.data, parser.options);}
			var json = JSON.parse(file);
			if(callback) { renderParameters.call(this, callback, json.services, json.parameters);}
		};
		
		var getServicesYML = function(file, callback, parser){
			if (parser) { file = this.render(file, parser.data, parser.options); }
			var json = yaml.load(file);
			if(callback) { renderParameters.call(this, callback, json.services, json.parameters);}
		};

		return {
			xml:getServicesXML,
			json:getServicesJSON,
			yml:getServicesYML,
			annotation:null
		};
	}();

	// tools exec
	var prepareExec = function(){

        	var getValues = function(){
            		var args = [];
   	        	for(var key in this) { args.push(this[key]);}
   	        	return args;
        	};

		var reg = /constructor\s*\((.*)\)/ ;
		var reg2 = /function\s*\((.*)\)/ ;
   	    	var getArguments = function() {
			var str = this.toString() ;
			var m = str.match(reg);
			if ( m ){
				// case class 
   	        		m = m[1].replace(/\s*/g, '');
   	        		return m.split(',');
			}else{
				// case function 
				m = str.match( reg2 ) ;
				if ( m ){
					m = m[1].replace(/\s*/g, '');
					return m.split(',');
				}else{
					throw new Error ("Service :"+this.name+" constructor not find");	
				}
			}
   	    	};

   	    	var sortArguments = function(func, obj, order){
   	       		var args = (order instanceof Array ? order : getArguments.call(func));
   	        	for (var i = 0 ; i< args.length ; i++){ 
   	            		args[i] = obj[args[i]];   
   	        	}
   	        	return args;
   	    	};

   	    	return {
   	        	"newWith": function(Class, obj, order){
   	        		order = order || false;
   	            		var tab = (order ? sortArguments(Class, obj, order) : getValues.call(obj));
   	            		Array.prototype.unshift.call(tab, Class);
				try {
					return new (Function.prototype.bind.apply(Class, tab));
				}catch(e){
					console.log("ERRROR SERVICE CLASS " + Class.name) ;
					throw e ;
				}
   	        	},
   	        	"callWith":function(func, tab){
   	            		func.apply(this, sortArguments(func, tab));
   	        	},
   	        	getArguments: getArguments

   	    	};
   	}();

	/*
 	 *
 	 *	CALSS INJECTION
 	 *
 	 *
 	 */
	const Injection = class Injection {
		constructor (container){
			
			this.container = container;
			this.kernel = this.container.get('kernel');
			this.reader = function(context){
				var func = context.container.get("reader").loadPlugin("injection", pluginReader);
				return function(result, parser){
					return func(result, context.nodeReader.bind(context), parser);
				};
			}(this);
		}
	
		nodeReader (jsonServices){
			var services = {};
			for(var lib in jsonServices){
				if(jsonServices[lib].class) {
					services[lib] = this.set(lib, jsonServices[lib]);
					this.startService(lib, services[lib] );
				}
			}
		}
		
		startService (name, service){
			var myOrder = service.orderArguments.toString();
			try{
				if(service.class){

					var context = prepareExec.newWith(
						service.class, 
						service.injections, 
						service.orderArguments
					);
					
					if(service.calls){
						for(var c=0; c < service.calls.length; c++){
							if(context[service.calls[c][0]]){
								prepareExec.callWith.call(context, context[service.calls[c][0]], this.findInjections(service.calls[c][1]));
							} else {
								this.logger('call Method ' + service.call[c][0] + ' in service ' + name + ' not found');
								return ;
							}
						}
					}
					if(service.properties){
						for(var p in service.properties){
							if(service.properties[p][0] === '@'){
								context[p] = this.container.get(service.properties[p].substring(1));
							}
						}
					}
					this.container.set( name, context );
					var funclog = name + ( myOrder !== "false" ? '( '+myOrder  +' )' : '()' );
					this.logger('START SERVICE ' +funclog, 'DEBUG');
				}
			} catch(e){
				this.logger(e, 'ERROR', 'INJECTION', 'START SERVICE '+ name + ' ERROR');
			}
		}
	
		findInjections (injections){
			var params = {};
			if(injections instanceof Array){
				for(var elm=0; elm < injections.length; elm ++){
					switch(injections[elm][0]){
						case '@':
							try{
								var name = injections[elm].substring(1);
								var service = this.container.get(name);
								params[name] = service;
							}catch(e) {
								//this.logger('Instance service (' + name + ') doesn\'t exist !!!');
							}
							break;
					}
				}
			}
			return params;
		}

		logger (pci, severity, msgid,  msg){
			var syslog = this.container.get("syslog");
			if (! msgid) { msgid = "SERVICE INJECTION";}
			return syslog.logger(pci, severity, msgid,  msg);
		}

		set (name, service){
			var Class = nodefony.services[service.class[0]];
			if (! Class) { throw new Error("Service Name "+ name +" class not found");}
			var order = prepareExec.getArguments.call(Class);
			if( order[0] === "" ) { order = false; }
			if(Class){
				Class.prototype.name = name;
				Class.prototype.container = this.container;
				Class.prototype.get = function(name){
					if (this.container){
						return this.container.get(name);
					}
					return null;
				};
				Class.prototype.set = function(name, obj){
					if (this.container){
						return this.container.set(name, obj);
					}
					return null;
				};
				return this.container.setParameters("services." + name, {
					class: Class,
					name:name,
					orderArguments: order,
					injections: this.findInjections(service.arguments),
					calls: service.calls,
					properties: service.properties,
					scope: service.scope ? service.scope : "container"
					//synthetic: /true/i.test(service.synthetic)
				});
			} else {
				this.logger(service.class + ' never registred');
			}
		}
	};
	
	return Injection;
	
});
