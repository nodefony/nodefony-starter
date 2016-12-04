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
		var Parser = null ;
		switch(type){
			case "xml" :
				Parser = new xml.Parser( settings );
				return function(value, callback){
					return Parser.parseString(value, callback);
				};
			case "json":
				Parser = JSON.parse ;
				var context = this;
				if (context.root){
					return function(value, callback){
						try {
							return callback(null, Parser(value)[context.root] );
						}catch(e){
							return callback(e, null );
						}
					};
				}else{
					return function(value, callback){
						try {
							return callback(null, Parser(value));
						}catch(e){
							return callback(e, null );
						}
					};	
				}
		}
	};

	var builder = function(method, type){
		var Builder = null ;
		switch(type){
			case "xml" :
				Builder = new xml.Builder({
					rootName:this.root
				});
				return function(obj){
					return Builder.buildObject(obj);
				};
			case "json":
				Builder = JSON.stringify ;
				var context = this;
				if (context.root){
					return function(obj){
						var base = {};
						base[context.root] = nodefony.extend({}, context[method]);
						nodefony.extend(true, base[context.root],  obj);
						return Builder(base);	
					};
				}else{
					return function(obj){
						var base = nodefony.extend({}, context[method]);
						nodefony.extend(true, base,  obj);	
						return Builder(base);	
					};
				}
			break;
		}
		return null ;
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
		}
	};

	return {
		reader: protocol
	};
});
