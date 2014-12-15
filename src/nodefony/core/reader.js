/*
 *
 *
 *
 *
 *
 */

var fs = require('fs'),
    path = require('path'),
    yaml = require('js-yaml'),
    xmlParser = require('xml2js').Parser;



nodefony.register("Reader", function(){



	var pluginConfig = function(){
	
		var json = function(file, callback, parser){
			if (parser){
				file = this.render(file, parser.data, parser.options);	
			}
			try{
				var json = JSON.parse(file);
				if(callback) callback(json);	
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
				if(callback) callback(json);	
			} catch(e){
				throw(e);
			}
		};
		var xml = function(file, callback, parser){
			if (parser){
				file = this.render(file, parser.data, parser.options);	
			}
			this.xmlParser.parseString(file, function(error, node){
				if(error) throw(error);
				if( callback ) callback( this.xmlToJson(node) );	
			}.bind(this));
		};
		return {
			xml:xml,
			json:json,
			yml:yml,
			annotations:null
		};
	};

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
		ejs:{
			open:"%",
			close:"%"	
		},
		parse:false
	};

	var load = function(name, pathFile, callback){
		var mypath = pathFile ;
		var ext = path.extname(pathFile);
		var plug = this.plugins[name];
		Array.prototype.shift.call(arguments)
		var file = Array.prototype.shift.call(arguments);
		var txt = this.readFileSync(file);
		Array.prototype.unshift.call(arguments, txt);

		try{
			switch (ext){
				case ".xml":
					return plug.xml.apply(this, arguments);
				break;
				case ".json":
					return plug.json.apply(this, arguments);
				break;
				case ".yml":
				case ".yaml":
					return plug.yml.apply(this, arguments);
				break;
				case ".js":
					return plug.annotations.apply(this, arguments);
				break;
				default:
					this.logger("DROP FILE : "+mypath+" NO PLUGIN FIND", "WARNING")
			}
		} catch(e){
			throw {
				message: e,
				file: file
			};
		}
		return null;
	};


	var compile = function(str, options){
		var settings = nodefony.extend({}, this.settings.ejs , options);
		return this.engine.compile(str, settings);
	}

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
	var Reader = function(container, localSettings){
		this.settings = nodefony.extend(true, {}, defaultSetting, localSettings);
		this.plugins = {};
		this.container = container;
		this.xmlParser = new xmlParser( this.settings.parserXml );
		if ( this.container.has("ejs") )
			this.engine = this.container.get("ejs");
		else
			this.engine = require("ejs");
		/**
 		 * @method  readConfig
 		 *
 		 *
 		 */
		this.readConfig = this.loadPlugin("config", this.pluginConfig);
	};
	
	Reader.prototype.pluginConfig = pluginConfig();

	Reader.prototype.readFileSync = function(file, localSettings){
		try {
			return fs.readFileSync(file, nodefony.extend( {}, this.settings.readFile, localSettings));
		}catch(e){
			this.logger(e);
			throw e;
		}
	};

	/**
 	 *	@method render
 	 *
 	 */	
	Reader.prototype.render = function(str, data, options){
		var settings = nodefony.extend({}, this.settings.ejs , options);
		var Render = compile.call(this, str, settings);
		try {
			return Render(data);
		}catch(e){
			this.logger(e);
		}
	};

	/**
 	 *	@method loadPlugin
 	 *
 	 */
	Reader.prototype.loadPlugin = function(name, plugin){
		this.plugins[name] = plugin;
		var context = this;
		return function(){
			Array.prototype.unshift.call(arguments, name);
			return load.apply(context, arguments);
		};
	};
	
	/**
 	 *	@method logger
 	 *
 	 */
	Reader.prototype.logger = function(pci, severity, msgid,  msg){
		var syslog = this.container.get("syslog");
		if (! msgid) msgid = "READER ";
		return syslog.logger(pci, severity, msgid,  msg);
	};

	
	/**
 	 *	@method xmlToJson
 	 *
 	 */
	Reader.prototype.xmlToJson = function(node){
		var json = {};		
		if(node instanceof Array){	
				
			for(var key = 0 ; key < node.length; key++) {	
				
				if(node[key] instanceof Object){					
					if(node[key]['id']){						
						json[node[key]['id']] = {};						
						for(var param in node[key]){
							if(param != 'id'){
								if(node[key][param] instanceof Array){
									json[node[key]['id']][param] = node[key][param];
									for(var elm=0; elm < json[node[key]['id']][param].length; elm ++){
										if(json[node[key]['id']][param][elm]['key'] && json[node[key]['id']][param][elm]['_']){
											json[node[key]['id']][param][elm][json[node[key]['id']][param][elm]['key']] = json[node[key]['id']][param][elm]['_'];
											delete json[node[key]['id']][param][elm]['key'];
											delete json[node[key]['id']][param][elm]['_'];
										}
									}
								} else {
									json[node[key]['id']][param] = this.xmlToJson(node[key][param]);
								}
							}
						}
						
					} else if(node[key]['key'] && node[key]['_']){						
						json[node[key]['key']] = node[key]['_'];						
					} else if(node[key]['key'] && !node[key]['_']){						
						for(var param in node[key]){
							if(param != 'key'){
								json[node[key]['key']] = {};
								var res = this.xmlToJson(node[key][param]);
								json[node[key]['key']][param] = res;
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
				
			for(var key in node){
				json[key] = this.xmlToJson(node[key]);
			}			
			return json;			
		} else {
			return node;
		}
		return json;
	};

	return Reader;

});
