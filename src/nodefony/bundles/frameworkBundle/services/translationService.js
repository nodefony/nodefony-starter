/*
 *
 *
 *
 *
 *
 *
 *
 */
nodefony.registerService("translation", function(){

	var translate = {
	
	
	};
	
	var translateDispo = {
		fr_fr:"français",
		en_en:"english"
	};

	/*
 	 *
 	 *
 	 *	PULGIN READER 
 	 *
 	 *
 	 */
	var pluginReader = function(){

		// TODO
		var getObjectTransXML = function(){};


		var getObjectTransJSON = function(file, callback, parser){
			if (parser){
				file = this.render(file, parser.data, parser.options);
			}
			if(callback) callback(JSON.parse(file)); 
		};
		
		var getObjectTransYml = function(file, callback, parser){
			if (parser){
				file = this.render(file, parser.data, parser.options);
			}
			if(callback) callback(yaml.load(file)); 
		};

		return {
			xml:getObjectTransXML,
			json:getObjectTransJSON,
			yml:getObjectTransYml,
			//TODO
			xliff:null,
		}	
	}();

	var i18n = function(container, type){
		this.container = container;
		this.kernel = this.container.get("kernel");
		
		if (this.container.has("translation") ){
			this.defaultLocale = this.container.get("translation").defaultLocale ;
		}
		this.requestType = type; 
		this.engineTemplate = this.container.get("templating");
		this.container.setParameters("translate", translate);
		this.defaultDomain = "messages"; 
		//console.log(this.container.parameters.__proto__);
		//console.log(this.container.getParameters("kernel"));
		this.reader = function(context){
			var func = context.container.get("reader").loadPlugin("translating", pluginReader);
			return function(result, locale, domain){
				return func(result, context.nodeReader.bind(context, locale, domain));
			};
		}(this);
	};

	i18n.prototype.boot = function(){
		this.defaultLocale = this.container.getParameters("kernel.system.locale"); 
		this.engineTemplate.extendFunction("getLangs", function(){
			var obj = [];
			for ( var ele in translateDispo){
				obj.push({
					name:translateDispo[ele],
					value:ele
				})	
			}
			return obj;
		}.bind(this));

		 this.kernel.listen(this, "onBoot", function(){
			var dl =  this.container.getParameters("bundles.App").App.locale;
			if (dl && dl !== this.defaultLocale ){
				this.defaultLocale = dl ; 
				this.getFileLocale(dl);
			}
			this.kernel.logger("default Local APPLICATION ==> " + this.defaultLocale ,"DEBUG");
		 }.bind(this));

		translate[this.defaultLocale] = {};
		
	};

	i18n.prototype.trans = function(value, args){
		var str = this.container.getParameters("translate."+this.defaultLocale+"."+this.defaultDomain+"."+value) || value;
		if (args){
			if (args[0]){
				for (var ele in args[0]){
					str = str.replace(ele, args[0][ele])
				}
			}
			var domain = args[1] ? this.trans_default_domain( args[1]) : null ;		
		}
		return str;
	};

	i18n.prototype.nodeReader = function(locale, domain, value){
		if ( locale ){
			if( !translate[locale] )
				translate[locale] = nodefony.extend(true, {}, translate[this.defaultLocale]);	
		}
		if ( domain ){
			if( !translate[locale][domain] )
				translate[locale][domain] = nodefony.extend(true, {}, translate[this.defaultLocale][domain]);
			nodefony.extend(true, translate[locale][domain], value);		
		}else{
			nodefony.extend(true, translate[locale], value);	
		}
	};

	i18n.prototype.getFileLocale= function(locale){
		for (var bundle in this.kernel.bundles){
			this.kernel.bundles[bundle].registerI18n(locale);	
		}
	};

	i18n.prototype.getLocale= function(locale){
		return this.defaultLocale;
	};

	i18n.prototype.trans_default_domain = function(domain){
		return this.defaultDomain = domain ;
	};

	i18n.prototype.getLang = function(context){
		if (context.type === "HTTP" || context.type === "HTTPS"){
			if ( ! context.session ){
				var Lang = this.container.getParameters("query.request").lang 
				if ( Lang ){
					this.defaultLocale = Lang;	
				}
			}else{
				if (context.user){
					var Lang  = context.user.lang
				}else{
					var Lang =  this.container.getParameters("query.request").lang || context.session.get("lang");
				}
				if ( Lang ){
					this.defaultLocale = Lang;	
				}
				context.session.set("lang",this.defaultLocale );
			}
			if ( ! this.container.getParameters("translate."+this.defaultLocale) || !  this.container.getParameters("translate."+this.defaultLocale[this.defaultDomain]) ){
				this.getFileLocale(this.defaultLocale);
			}
		}else{
				// TODO WEBSOCKET SPEC LANG
		}
	};

	i18n.prototype.getTransDefaultDomain = function(){
		return this.defaultDomain ;
	};


	i18n.prototype.handle = function( context){
		//this.engineTemplate.extendFunction("trans", this.trans.bind(this));
		//this.engineTemplate.extendFunction("getLocale", this.getLocale.bind(this));
		//this.engineTemplate.extendFunction("trans_default_domain", function(){
		//	this.trans_default_domain.apply(this,arguments);
		//}.bind(this));
		//this.engineTemplate.extendFunction("getTransDefaultDomain", function(){
		//	return this.defaultDomain
		//}.bind(this));
		this.engineTemplate.extendFilter("trans", this.trans.bind(this));
		this.getLang( context );
	};

	return i18n;
});


