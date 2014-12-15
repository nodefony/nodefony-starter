/*
 *
 *
 *
 *
 *
 */



nodefony.register("templates", function(){

	// TODO wrapper engine
	var Template = function(container, engine, options){
		this.container = container;
		this.settings = options;
		this.engine = engine;
	}

	
	Template.prototype.getEngine = function(){
		return this.engine;
	};

	Template.prototype.extendFunction = function(){
		this.logger("extendFunction You must redefine this function in engine templating")	
	};

	Template.prototype.extendFilter = function(){
		this.logger("extendFilter You must redefine this function in engine templating")	
	};


	Template.prototype.logger = function(pci, severity, msgid,  msg){
		var syslog = this.container.get("syslog");
		if (! msgid) msgid = "TEMPLATE ";
		return syslog.logger(pci, severity, msgid,  msg);
	}



	return Template;
});
