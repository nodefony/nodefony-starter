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

	var translate = {};
	
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
			if(callback) {callback(JSON.parse(file));}
		};
		
		var getObjectTransYml = function(file, callback, parser){
			if (parser){
				file = this.render(file, parser.data, parser.options);
			}
			if(callback) {callback(yaml.load(file)); }
		};

		return {
			xml:getObjectTransXML,
			json:getObjectTransJSON,
			yml:getObjectTransYml,
			xliff:null
		};
	}();

	var reader = function(context){
		var func = context.container.get("reader").loadPlugin("translating", pluginReader);
		return function(result, locale, domain){
			return func(result, context.nodeReader.bind(context, locale, domain));
		};	
	};

	var reg = /^(..){1}_?(..)?$/;

	var i18n = class i18n extends nodefony.Service {

		constructor ( container, type ){

			super("translation", container, container.get("notificationsCenter") );

			//this.container = container;
			this.kernel = this.get("kernel");
			
			this.defaultLocale = null ;
			if (this.has("translation") ){
				this.defaultLocale = this.get("translation").defaultLocale ;
			}
			this.requestType = type; 
			this.engineTemplate = this.get("templating");
			this.setParameters("translate", translate);
			this.defaultDomain = "messages"; 
			//console.log(this.container.parameters.__proto__);
			//console.log(this.container.getParameters("kernel"));
			this.reader = reader(this);
		}

		getLangs (){

			var obj = [];
			for ( var ele in translateDispo){
				obj.push({
					name:translateDispo[ele],
					value:ele
				});	
			}
			return obj;
		}

		boot (){
			this.defaultLocale = this.getParameters("kernel.system.locale"); 
			this.engineTemplate.extendFunction("getLangs", this.getLangs.bind(this));

		 	this.listen(this, "onBoot", () => {
				var dl =  this.getParameters("bundles.App").App.locale;
				if (dl  ){
				//if (dl && dl !== this.defaultLocale ){
					this.defaultLocale = dl ; 
				}
					this.getFileLocale(dl);
				this.logger("default Local APPLICATION ==> " + this.defaultLocale ,"DEBUG");
		 	});

			translate[this.defaultLocale] = {};
			
		}

		trans (value, args){
			var str = null ;
			try {
				str = this.getParameters("translate."+this.defaultLocale+"."+this.defaultDomain+"."+value) || value;
				//console.log("translate."+this.defaultLocale+"."+this.defaultDomain+"."+value);
				if (args){
					if (args[0]){
						for (var ele in args[0]){
							str = str.replace(ele, args[0][ele]);
						}
					}
					if ( args[1] ){
						this.trans_default_domain( args[1]);
					}
				}
			}catch (e){
				this.logger(e,"ERROR");
				return value ;
			}
			return str;
		}

		nodeReader (locale, domain, value){
			if ( locale ){
				if( !translate[locale] ){
					translate[locale] = {} ;//nodefony.extend(true, {}, translate[this.defaultLocale]);	
				}
			}
			if ( domain ){
				if( !translate[locale][domain] ){
					translate[locale][domain] = nodefony.extend(true, {}, translate[this.defaultLocale][domain]);
				}
				nodefony.extend(true, translate[locale][domain], value);		
			}else{
				nodefony.extend(true, translate[locale], value);	
			}
		}

		getFileLocale (locale){
			for (var bundle in this.kernel.bundles){
				this.kernel.bundles[bundle].registerI18n(locale);	
			}
		}

		getLocale (){
			return this.defaultLocale;
		}

		trans_default_domain (domain){
			return this.defaultDomain = domain ;
		}

		getLang (context){
			var Lang = null ;
			if ( ! context.session ){
				Lang = this.getParameters("query.request").lang;
				if ( Lang ){
					this.defaultLocale = Lang;	
				}
			}else{
				var queryGetlang = this.getParameters("query.request").lang ;
				if (context.user){
					if ( queryGetlang ){
						Lang  = queryGetlang ;
					}else{
						Lang  = context.user.lang;
					}
				}else{
					Lang =  queryGetlang || context.session.get("lang");
				}
				var res = reg.exec( Lang || this.defaultLocale ) ;
				if ( res ){
					if (res[2]){
						this.defaultLocale = res[0];	
					}else{
						this.defaultLocale = res[1]+"_"+res[1] ;	
					}
				}
				context.session.set("lang",this.defaultLocale );
			}
			if ( ! this.getParameters("translate."+this.defaultLocale)   ){
				this.getFileLocale(this.defaultLocale);
			}else{
				if ( ! this.getParameters("translate."+this.defaultLocale+"."+this.defaultDomain) ){
					this.getFileLocale(this.defaultLocale);	
				}
			}
		}

		getTransDefaultDomain (){
			return this.defaultDomain ;
		}

		handle ( context){
			this.engineTemplate.extendFilter("trans", this.trans.bind(this));
			this.getLang( context );
		}
	};

	return i18n;
});


