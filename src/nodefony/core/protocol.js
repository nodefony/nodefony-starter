/*
 *
 *
 *
 *
 *
 */
var xml = require('xml2js');

nodefony.register.call( nodefony.io, "protocol",function(){

	var parser = function(type, settings){
		switch(type){
			case "xml" :
				var Parser = new xml.Parser( settings );
				return function(value, callback){
					return Parser.parseString(value, callback);
				}
			break;
			case "json":
				var Parser = JSON.parse ;
				var context = this;
				if (context.root){
					return function(value, callback){
						try {
							return callback(null, Parser(value)[context.root] );
						}catch(e){
							return callback(e, null );
						}
					}
				}else{
					return function(value, callback){
						try {
							return callback(null, Parser(value));
						}catch(e){
							return callback(e, null );
						}
					}	
				}
			break;
		};
	};

	var builder = function(method, type, settings){
		switch(type){
			case "xml" :
				var Builder = new xml.Builder({
					rootName:this.root
				});
				return function(obj){
					return Builder.buildObject(obj)
				}
			break;
			case "json":
				var Builder = JSON.stringify ;
				var context = this;
				if (context.root){
					return function(obj){
						var base = {};
						base[context.root] = nodefony.extend({}, context[method]);
						nodefony.extend(true, base[context.root],  obj);
						return Builder(base);	
					}	
				}else{
					return function(obj){
						var base = nodefony.extend({}, context[method]);
						nodefony.extend(true, base,  obj);	
						return Builder(base);	
					}	
				}
			break;
		}
		return null
	};

	var defaultSettingsProtocol = {
		extention : "json",
		xml : {}
	};

	var protocol = class protocol {

		constructor (rootName, settings){
			this.settings = nodefony.extend(true, {}, defaultSettingsProtocol, settings );
			this.root = rootName;
			this.extention = this.settings.extention;
			this.request = {};
			this.response = {};
			this.parser = parser.call(this, this.extention, this.settings.xml);
			this.builderResponse = builder.call(this, "response", this.extention, this.settings.xml);
			this.builderRequest = builder.call(this, "request", this.extention, this.settings.xml);

		};
	}

	return {
		reader: protocol
	};
});
