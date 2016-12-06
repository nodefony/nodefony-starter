/*
 *
 *
 *
 *
 *
 */



nodefony.register("templates", function(){

	// TODO wrapper engine
	var Template = class Template extends nodefony.Service {

		constructor (container, engine, options){
				
			super("templates", container , container.get("notificationsCenter") );

			this.settings = options;
			this.engine = engine;
		}
		
		getEngine (){
			return this.engine;
		};

		extendFunction (){
			this.logger("extendFunction You must redefine this function in engine templating")	
		};

		extendFilter (){
			this.logger("extendFilter You must redefine this function in engine templating")	
		};

		logger (pci, severity, msgid,  msg){
			//var syslog = this.container.get("syslog");
			if (! msgid) msgid = "TEMPLATE ";
			return this.syslog.logger(pci, severity, msgid,  msg);
		}
	};

	return Template;
});
