

nodefony.register("Service", function(){

	var settingsSyslog = {
		//rateLimit:100,
		//burstLimit:10,
		moduleName:"SERVICE ",
		defaultSeverity:"INFO"
	};

	const Service = class Service {
	
		constructor(name, container, notificationsCenter, options ){

			this.name = name ;
			if ( container instanceof nodefony.Container  ){
				this.container = container ;
			}else{
				if ( container ){
					throw new Error ("Service nodefony container not valid must be instance of nodefony.Container");
				}
				this.container = new nodefony.Container(); 
			}
			this.syslog = this.container.get("syslog");
			if ( ! this.syslog ){
				this.settingsSyslog = nodefony.extend({}, settingsSyslog , {
					moduleName: this.name	
				},options.syslog || {} );
				this.syslog = new nodefony.syslog( this.settingsSyslog );	
				this.set("syslog", this.syslog);
			}else{
				this.settingsSyslog = this.syslog.settings ;	
			}
			if ( notificationsCenter instanceof nodefony.notificationsCenter.notification ){
				this.notificationsCenter = notificationsCenter ;
			}else{
				if ( notificationsCenter ){
					throw new Error ("Service nodefony notificationsCenter not valid must be instance of nodefony.notificationsCenter.notification");
				}
				this.notificationsCenter = nodefony.notificationsCenter.create(options, this);
				this.set("notificationsCenter", this.notificationsCenter);	
			}	
		}

		clean(){
			delete this.settingsSyslog ;
			delete this.syslog ;
			delete this.notificationsCenter;
			delete this.container
		}
	
		logger(pci, severity, msgid,  msg){
			var syslog = this.container.get("syslog");
			if (! msgid) { msgid = this.name + " "; }
			return syslog.logger(pci, severity, msgid,  msg);	
		}

		/**
	 	*	@method fire
	 	*	@param {String} event name 
	 	*	@param {Arguments} ... arguments to inject  
         	*/
		fire (){
			//this.logger(ev, "DEBUG", "EVENT KERNEL")
			return this.notificationsCenter.fire.apply(this.notificationsCenter, arguments);
		}

		/**
	 	*	@method listen
	 	*	@param {Oject} context
	 	*	@param {String} event
	 	*	@param {Function} callback
         	*/
		listen (){
			return this.notificationsCenter.listen.apply(this.notificationsCenter, arguments);
		}

		/**
	 	 *	@method get
	 	 *	@param {String} name of service
         	 */
		get (name){
			if (this.container)
				return this.container.get(name);
			return null;
		}

		/**
	 	*	@method set
	 	*	@param {String} name of service
	 	*	@param {Object} instance of service
         	*/
		set (name, obj){
			if (this.container)
				return this.container.set(name, obj);
			return null;
		}
	}

	return Service ;


});
