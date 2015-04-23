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
	
	var connectionNotification = 0;
	var connectionMonitor = function(name, db, orm){
		connectionNotification ++;
		if(Object.keys(orm.settings.connectors).length == connectionNotification){
			process.nextTick(function () {
				orm.fire('onOrmReady', orm);
			});
		}
	};

	
	var Orm = function(name, container, kernel, autoLoader){
		
		this.container = container;
		this.name = name ;
		this.notificationsCenter = nodefony.notificationsCenter.create();
		this.kernel = kernel;
		if (( this.kernel.debug === false && this.debug === true) || this.debug === undefined )
			this.debug = this.kernel.debug ;
		this.syslog = this.initializeLog();
		this.container.set("syslog.orm",this.syslog);
		this.entities = {};
		this.definitions = {};
		this.autoLoader = autoLoader;
		this.connections = {};

	};
	
	Orm.prototype.get = function(service){
		return this.container.get(service);
	};

	Orm.prototype.set = function(service, value){
		return this.container.set(service, value);
	};

	Orm.prototype.boot = function(){
		
		this.listen(this, "onReadyConnection", connectionMonitor);
		this.listen(this, "onErrorConnection", connectionMonitor);		
		
		this.kernel.listen(this, 'onBoot', function(kernel){
			for (var bundle in kernel.bundles){
				if ( Object.keys(kernel.bundles[bundle].entities).length  ){
					for (var entity in kernel.bundles[bundle].entities ){
						var ele = kernel.bundles[bundle].entities[entity] ;
						if (ele.type !== this.name)
							continue;
						if ( !  ( ele.connection in this.definitions ) ){
							this.definitions[ele.connection] = [];
						}
						var callback = function(enti, bundle, name,orm){
							var Enti = enti;
							var Name = name ;
							var context = orm;
							var Bundle = bundle ;
							return function(db){
								try {
									context.entities[Name] = Enti.entity.call(context, db, context);
									context.logger(context.name+" REGISTER ENTITY : "+Name+" PROVIDE BUNDLE : "+Bundle,"DEBUG")
									return Enti ;		
								}catch(e){
									context.logger(e);
								}
							}
						}(ele, bundle, entity, this);
						this.definitions[ele.connection].push(callback);
					}
				}
			}
		});

		this.listen(this, "onConnect" , function(name, db){
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
		}.bind(this));
	};
	

	Orm.prototype.initializeLog = function(){
		
		var red, blue, green, reset;
		red   = '\033[31m';
		blue  = '\033[34m';
		green = '\033[32m';
		reset = '\033[0m';
		
		var syslog =  new nodefony.syslog(settingsSyslog);
		
		// CRITIC ERROR
		syslog.listenWithConditions(this,{
			severity:{
				data:"CRITIC,ERROR"
			}		
		},function(pdu){
			var pay = pdu.payload.stack || pdu.payload;
			var date = new Date(pdu.timeStamp) ;
			console.error(date.toDateString() + " " +date.toLocaleTimeString()+ " " + red + pdu.severityName +" "+ reset + green  + pdu.msgid + reset  + " : "+ pay);
		});
			
		if (this.kernel.environment === "dev"){
			// INFO DEBUG
			var data ;
			this.debug ? data = "INFO,DEBUG" : data = "INFO" ;
			syslog.listenWithConditions(this,{
				severity:{
					data:data
				}		
			},function(pdu){
				var pay = pdu.payload.stack || pdu.payload;
				var date = new Date(pdu.timeStamp) ;
				console.log( date.toDateString() + " " +date.toLocaleTimeString()+ " " + blue + pdu.severityName +" "+ reset + green  + pdu.msgid + reset +" "+ " : "+ pay);

			});
		}else{
			syslog.listenWithConditions(this,{
				severity:{
					data:"INFO"
				}		
			},function(pdu){
				var pay = pdu.payload.stack || pdu.payload;
				var date = new Date(pdu.timeStamp) ;
				console.log( date.toDateString() + " " +date.toLocaleTimeString()+ " " + blue + pdu.severityName +" "+ reset + green  + pdu.msgid + reset +" "+ " : "+ pay);

			});
		}
		return syslog;
	};


	Orm.prototype.listen = function(){
		return this.notificationsCenter.listen.apply(this.notificationsCenter, arguments);
	};

	Orm.prototype.fire = function(ev){
		this.logger(ev, "DEBUG", "EVENT SERVICE "+this.name)
		return this.notificationsCenter.fire.apply(this.notificationsCenter, arguments);
	};

	Orm.prototype.logger = function(pci, severity, msgid,  msg){
		if (! msgid) msgid = "SERVICE "+this.name;
		return this.syslog.logger(pci, severity, msgid,  msg);
	};

	Orm.prototype.getConnection = function(name){
		if ( this.connections[name] )
			return this.connections[name].db;
		return null
	};
	
	Orm.prototype.getEntity = function(name){
		if (name)
			return this.entities[name];
		else
			return this.entities;
	};
	

	return Orm;
});
