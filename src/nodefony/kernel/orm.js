/*
 *
 *
 *	ORM CLASS 
 *
 *
 */



nodefony.register("orm", function(){


	var settingsSyslog = {
		//rateLimit:100,
		//burstLimit:10,
		moduleName:"ORM",
		defaultSeverity:"ERROR"
	};
	
	//var connectionNotification = 0;
	var connectionMonitor = function(name, db, orm){
		this.connectionNotification ++;
		if(Object.keys(orm.settings.connectors).length === this.connectionNotification){
			process.nextTick(function () {
				orm.fire('onOrmReady', orm);
			});
		}
	};
	
	var Orm = class Orm  extends nodefony.Service {

		constructor (name, container, kernel, autoLoader){
			
			super( name, container );

			if (( this.kernel.debug === false && this.debug === true) || this.debug === undefined ){
				this.debug = this.kernel.debug ;
			}
			this.syslog = this.initializeLog();
			this.container.set("syslog.orm",this.syslog);
			this.entities = {};
			this.definitions = {};
			this.autoLoader = autoLoader;
			this.connections = {};
			this.connectionNotification = 0 ;
		}
		
		boot (){
			
			this.listen(this, "onReadyConnection", connectionMonitor);
			this.listen(this, "onErrorConnection", connectionMonitor);		
			
			this.kernel.listen(this, 'onBoot', (kernel) => {
				var callback = null ;
				for (var bundle in kernel.bundles){
					if ( Object.keys(kernel.bundles[bundle].entities).length  ){
						for (var entity in kernel.bundles[bundle].entities ){
							var ele = kernel.bundles[bundle].entities[entity] ;
							if (ele.type !== this.name){
								continue;
							}
							if ( !  ( ele.connection in this.definitions ) ){
								this.definitions[ele.connection] = [];
							}
							callback = (enti, bundle, name) => {
								var Enti = enti;
								var Name = name ;
								var Bundle = bundle ;
								return (db) => {
									try {
										this.entities[Name] = Enti.entity.call(this, db, this);
										this.logger(this.name+" REGISTER ENTITY : "+Name+" PROVIDE BUNDLE : "+Bundle,"DEBUG");
										return Enti ;		
									}catch(e){
										this.logger(e);
									}
								};
							};
							callback = callback(ele, bundle, entity);
							this.definitions[ele.connection].push(callback);
						}
					}
				}
			});

			this.listen(this, "onConnect" , (name, db) => {
				if (name in this.definitions){
					for( var i =0 ; i < this.definitions[name].length ; i++){
						this.definitions[name][i](db);
					}
				}
				try {
					this.fire("onReadyConnection", name, db, this);
				}catch(e){
					this.logger(e, "ERROR", this.name+" ENTITY");
				}
			});
		}

		initializeLog (){
			
			var red, blue, green, reset;
			red   = '\x1B[31m';
			blue  = '\x1B[34m';
			green = '\x1B[32m';
			reset = '\x1B[0m';
			
			var syslog =  new nodefony.syslog(settingsSyslog);
			
			// CRITIC ERROR
			syslog.listenWithConditions(this,{
				severity:{
					data:"CRITIC,ERROR"
				}		
			},(pdu) => {
				this.kernel.cli.normalizeLog(pdu);
			});
				
			if (this.kernel.environment === "dev"){
				// INFO DEBUG
				var data ="";
				if ( this.debug ) {
					data = "INFO,DEBUG" ;
				}else{
					data = "INFO";
				}
				syslog.listenWithConditions(this,{
					severity:{
						data:data
					}		
				},(pdu) =>{
					this.kernel.cli.normalizeLog(pdu);
				});
			}else{
				syslog.listenWithConditions(this,{
					severity:{
						data:"INFO"
					}		
				},(pdu) =>{
					this.kernel.cli.normalizeLog(pdu);
				});
			}
			return syslog;
		}

		getConnection (name){
			if ( this.connections[name] ){
				return this.connections[name].db;
			}
			return null;
		}
		
		getEntity (name){
			if (name){
				return this.entities[name];
			}else{
				return this.entities;
			}
		}
	};
	
	return Orm;
});
