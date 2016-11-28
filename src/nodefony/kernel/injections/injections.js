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
				file = this.render(file, parser.data, parser.options)	
			}
			var services = [];
			var parameters;
			
			this.xmlParser.parseString(file, function(err, node){
				//console.log(require('util').inspect(node, {depth: null}));
				//console.log('\n\n');
				if(err) this.logger("INJECTION xmlParser.parseString : " + err, 'WARNING');
				if ( ! node ) return node;
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
				
				if(callback) nomarlizeXmlJson.call(this, services, parameters, callback);
				
				
			}.bind(this));
		};
		
		var nomarlizeXmlJson = function(services, parameters, callback){
			for(var key in services){
				for(var param in services[key]){
					
					switch(param){
						case 'argument':
							var values = [];
							for(var elm=0; elm < services[key][param].length; elm ++){
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
							var values = {};
							for(var elm=0; elm < services[key][param].length; elm ++){
								if(services[key][param][elm].type && services[key][param][elm].id && services[key][param][elm].name){
									if(services[key][param][elm].type == 'service'){
										values[services[key][param][elm].name] = '@' + services[key][param][elm].id;
									}
								}
							}
							services[key]['properties'] = values;
							delete services[key][param];
							break;
							
						case 'call': 
							var values = [];
							for(var elm=0; elm < services[key][param].length; elm ++){
								var tab = [];
								for(var sparam in services[key][param][elm]){
									switch(sparam){
										case 'method':
												tab[0] = services[key][param][elm][sparam];
											break;
										case 'argument':
											var args = [];
											for(var selem=0; selem < services[key][param][elm][sparam].length; selem ++){
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
							services[key]['calls'] = values;
							delete services[key][param];
							break;
						case 'scope' :
						break;
					}
					
				}
			
			}
			if(callback) renderParameters.call(this, callback, services, parameters);
			//return services;
		};
		
		var renderParameters = function(callback, services, parameters){
			if(parameters && Object.keys(parameters).length > 0 && typeof(services) == 'object' && Object.keys(services).length > 0){
				services = JSON.parse(this.render(JSON.stringify(services), parameters));
			}
			callback(services);
		};
		
		var getServicesXML = function(file, callback, parser){
			importXmlConfig.call(this, file, '', callback, parser);
		};
			
		var getServicesJSON = function(file, callback, parser){
			if (parser) file = this.render(file, parser.data, parser.options);
			var json = JSON.parse(file);
			if(callback) renderParameters.call(this, callback, json.services, json.parameters);
		};
		
		var getServicesYML = function(file, callback, parser){
			if (parser) file = this.render(file, parser.data, parser.options);
			var json = yaml.load(file);
			if(callback) renderParameters.call(this, callback, json.services, json.parameters);
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
   	        	for(var key in this) args.push(this[key]);
   	        	return args;
        	};

   	    	var getArguments = function() {

   	        	var m = this.toString().match(/\((.*)\)/)[1];
   	        	m = m.replace(/\s*/g, '');
   	        	return m.split(',');
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
   	            		tab = (order ? sortArguments(Class, obj, order) : getValues.call(obj));
   	            		Array.prototype.unshift.call(tab, Class);
   	            		return new (Function.prototype.bind.apply(Class, tab));
   	        	},
   	        	"callWith":function(func, tab){
   	            		func.apply(this, sortArguments(func, tab));
   	        	},
   	        	getArguments: getArguments

   	    	}
   	}();
	
	/*
 	 *	ERROR CLASS
 	 *
 	 */
	var injectionError = function(){
		
	};
	

	var startService = function(name, services){
		this.startService(name, services, true);
	};

	var startServices = function(services){
		for(var lib in services){
			this.startService(lib, services[lib], true);
		}
	};

	/*
 	 *
 	 *	CALSS INJECTION
 	 *
 	 *
 	 */
	var Injection = class Injection {
		constructor (container){
			
			this.container = container;
			this.kernel = this.container.get('kernel');
			this.reader = function(context){
				var func = context.container.get("reader").loadPlugin("injection", pluginReader);
				return function(result, parser){
					return func(result, context.nodeReader.bind(context), parser);
				};
			}(this);
		};
	
		nodeReader (jsonServices){
			//console.log('\n\n');
			//console.log(require('util').inspect(jsonServices, {depth: null}));
			var services = {};
			for(var lib in jsonServices){
				if(jsonServices[lib].class) {
					services[lib] = this.set(lib, jsonServices[lib]);
					startService.call(this,lib, services[lib] )
				}
			}
			//startServices.call(this, services);
		};
	
		
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
							if(service.properties[p][0] == '@'){
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
		};
	
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
		};

		logger (pci, severity, msgid,  msg){
			var syslog = this.container.get("syslog");
			if (! msgid) msgid = "SERVICE INJECTION";
			return syslog.logger(pci, severity, msgid,  msg);
		};

		set (name, service){
			var Class = nodefony.services[service.class[0]];
			if (! Class) throw new Error("Service Name "+ name +" class not found");
			var order = prepareExec.getArguments.call(Class);
			if(order[0] == "") order = false;
			if(Class){
				Class.prototype.name = name;
				Class.prototype.container = this.container;
				Class.prototype.get = function(name){
					if (this.container)
						return this.container.get(name);
					return null;
				};

				Class.prototype.set = function(name, obj){
					if (this.container)
						return this.container.set(name, obj);
					return null;
				}
				//var func = Class.herite(nodefony.service);
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
		};
	};
	
	return Injection;
	
});
