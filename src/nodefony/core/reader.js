/*
 *
 *
 *
 *
 *
 */

nodefony.register("Reader", function(){

	var defaultSetting = {
		parserXml:{
			//explicitCharkey: true,
			explicitArray: true,
			explicitRoot: false,
			mergeAttrs: true
		},
		readFile:{
			encoding: 'utf8'	
		},
		twig:{
			'twig options':{
				async: false,	
				cache:true
			},
			views:null	
		},
		parse:false
	};

	var load = function(name, pathFile ){
		var mypath = pathFile ;
		var ext = path.extname(pathFile);
		var plug = this.plugins[name];
		Array.prototype.shift.call(arguments);
		var file = Array.prototype.shift.call(arguments);
		var txt = this.readFileSync(file);
		Array.prototype.unshift.call(arguments, txt);

		try{
			switch (ext){
				case ".xml":
					return plug.xml.apply(this, arguments);
				case ".json":
					return plug.json.apply(this, arguments);
				case ".yml":
				case ".yaml":
					return plug.yml.apply(this, arguments);
				case ".js":
					return plug.annotations.apply(this, arguments);
				default:
					this.logger("DROP FILE : "+mypath+" NO PLUGIN FIND", "WARNING");
			}
		} catch(e){
			console.trace(e);
			throw {
				message: e,
				file: file
			};
		}
		return null;
	};

	/**
 	 *	Reader node js
 	 *
 	 *	@class Reader
 	 *	@constructor
 	 *
 	 *	@example 
 	 *		var container = new nodefony.Container();
	 *		var reader = new nodefony.Reader(container, settings);
 	 *
 	 */
	var Reader = class Reader {

		constructor (container, localSettings){
			this.settings = nodefony.extend(true, {}, defaultSetting, localSettings);
			this.plugins = {};
			this.container = container;
			this.xmlParser = new xmlParser( this.settings.parserXml );
			this.engine = require("twig") ; 
			/**
 		 	* @method  readConfig
 		 	*
 		 	*
 		 	*/
			this.readConfig = this.loadPlugin("config", this.pluginConfig);
			//this.pluginConfig = this.pluginConfig();
		}
	
		pluginConfig (){
	
			var json = function(file, callback, parser){
				if (parser){
					file = this.render(file, parser.data, parser.options);	
				}
				try{
					var json = JSON.parse(file);
					if(callback) {callback(json);}
				} catch(e){
					throw(e);
				}
			};
			var yml = function(file, callback, parser){
				if (parser){
					file = this.render(file, parser.data, parser.options);	
				}
				try{
					var json = yaml.load(file);
					if(callback) {callback(json);}	
				} catch(e){
					throw(e);
				}
			};
			var xml = function(file, callback, parser){
				if (parser){
					file = this.render(file, parser.data, parser.options);	
				}
				this.xmlParser.parseString(file, (error, node) => {
					if(error) {throw(error);}
					if( callback ) {callback( this.xmlToJson(node) );}	
				});
			};
			return {
				xml:xml,
				json:json,
				yml:yml,
				annotations:null
			};
		}

		readFileSync (file, localSettings){
			try {
				return fs.readFileSync(file, nodefony.extend( {}, this.settings.readFile, localSettings));
			}catch(e){
				this.logger(e);
				throw e;
			}
		}

		/**
 	 	*	@method render
 	 	*
 	 	*/	
		render (str, data){
			return this.engine.twig({data:str}).render(data);
		}

		/**
 	 	*	@method loadPlugin
 	 	*
 	 	*/
		loadPlugin (name, plugin){
			this.plugins[name] = plugin;
			var context = this;
			return function(){
				Array.prototype.unshift.call(arguments, name);
				return load.apply(context, arguments);
			};
		}
		
		/**
 	 	*	@method logger
 	 	*
 	 	*/
		logger (pci, severity, msgid,  msg){
			var syslog = this.container.get("syslog");
			if (! msgid) {msgid = "READER ";}
			return syslog.logger(pci, severity, msgid,  msg);
		}

		/**
 	 	*	@method xmlToJson
 	 	*
 	 	*/
		xmlToJson (node){
			var json = {};		
			if(node instanceof Array){	
					
				for(var key = 0 ; key < node.length; key++) {	
					var param = null ;	
					if(node[key] instanceof Object){					
						if(node[key].id){						
							json[node[key].id] = {};						
							for(param in node[key]){
								if(param !== 'id'){
									if(node[key][param] instanceof Array){
										json[node[key].id][param] = node[key][param];
										for(var elm=0; elm < json[node[key].id][param].length; elm ++){
											if(json[node[key].id][param][elm].key && json[node[key].id][param][elm]._){
												json[node[key].id][param][elm][json[node[key].id][param][elm].key] = json[node[key].id][param][elm]._;
												delete json[node[key].id][param][elm].key;
												delete json[node[key].id][param][elm]._;
											}
										}
									} else {
										json[node[key].id][param] = this.xmlToJson(node[key][param]);
									}
								}
							}
							
						} else if(node[key].key && node[key]._){						
							json[node[key].key] = node[key]._;						
						} else if(node[key].key && !node[key]._){						
							for(param in node[key]){
								if(param !== 'key'){
									json[node[key].key] = {};
									var res = this.xmlToJson(node[key][param]);
									json[node[key].key][param] = res;
								}
							}
						} else {
							return node;
						}					
					} else {
						return node;
					}
				}			
				return json;			
			} else if(node instanceof Object){		
					
				for(var mykey in node){
					json[mykey] = this.xmlToJson(node[mykey]);
				}			
				return json;			
			} else {
				return node;
			}
			return json;
		}

	};

	Reader.prototype.pluginConfig = Reader.prototype.pluginConfig();

	return Reader;

});
