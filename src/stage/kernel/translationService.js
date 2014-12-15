stage.register("i18n",function(){

	var translate = {};


	var translateDispo = {
		fr_FR:"français",
		en_EN:"english"
	};

	var regNavLang = /(..)-?.*/;

	var service = function(kernel, container){
		this.container = container;	
		this.syslog = this.container.get("syslog");
		this.logger("INITIALIZE I18N SERVICE", "DEBUG");
		this.kernel = kernel ;

		this.container.setParameters("translate", translate);
		this.defaultDomain = this.trans_default_domain();
		var locale = navigator.language || navigator.userLanguage ;
		var res = regNavLang.exec(locale);
		if (res){
			locale = res[1]
			this.defaultLocale  = locale+"_"+locale.toUpperCase();
			translate[this.defaultLocale] = {};
		}else{
			this.defaultLocale = "fr_FR";	
		}

		this.kernel.listen(this, "onBoot",function(){
			this.boot();
		}.bind(this))	
	};

	service.prototype.logger = function(pci, severity, msgid,  msg){
		if (! msgid) msgid = "SERVICE I18N "
		return this.syslog.logger(pci, severity, msgid,  msg);
	};


	

	service.prototype.boot = function(){
		//GET APP locale
		this.defaultLocale = this.container.getParameters("module.app").locale;
		if  ( ! translate[this.defaultLocale])
			translate[this.defaultLocale] = {};

		this.logger("DEFAULT LOCALE APPLICATION ==> " + this.defaultLocale ,"DEBUG");
		this.logger("//FIXME LOCALE getLang in controller etc ..." ,"WARNING");
		window.Twig.extendFunction("getLangs", this.getLangs.bind(this));
		window.Twig.extendFunction("trans_default_domain", this.trans_default_domain.bind(this));
		window.Twig.extendFilter("trans", this.translation.bind(this));
		window.Twig.extendFunction("trans", this.translation.bind(this));
		window.Twig.extendFilter("getLangs", this.getLangs.bind(this));

	};

	service.prototype.getLangs = function(locale, data){
		var obj = [];
		for ( var ele in translateDispo){
			obj.push({
				name:translateDispo[ele],
				value:ele
			})	
		}
		return obj;
	};


	service.prototype.registerI18n = function(name, locale, domain, data){
		if ( locale ){
			if( !translate[locale] )
				translate[locale] = stage.extend(true, {}, translate[this.defaultLocale]);	
		}
		if ( domain ){
			if( !translate[locale][domain] )
				translate[locale][domain] = stage.extend(true, {}, translate[this.defaultLocale][domain]);
			stage.extend(true, translate[locale][domain], data);		
		}else{
			stage.extend(true, translate[locale], data);	
		} 
	};




	service.prototype.trans_default_domain = function(domain){
		if ( ! domain ){
			return this.defaultDomain = "messages" ; 
		}
		return this.defaultDomain = domain ;
	};

	/*
 	 *
 	 *
 	 *
 	 *
 	 */
	service.prototype.translation = function(value, args){
		
		var defaulDomain = ( args && args[1] ) ? args[1] : this.defaultDomain ;
		var str = this.container.getParameters("translate."+this.defaultLocale+"."+defaulDomain+"."+value) || value;
		if (args){
			if (args[0]){
				for (var ele in args[0]){
					str = str.replace(ele, args[0][ele])
				}
			}
		}
		return str;
	};

	return service;


});
