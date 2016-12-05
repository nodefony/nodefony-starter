nodefony.registerService("sequelize", function(){


	var error = function(err){
		
		if (this.state !== "DISCONNECTED"){
			this.orm.kernel.fire('onError', err, this);
		}
		this.logger(this.name + " : ERROR CONNECTION to database " + this.name +" "+err.message, "ERROR", "CONNECTION");
		if(err.code){
			switch(err.code){
				case 'PROTOCOL_CONNECTION_LOST':
				case "ECONNREFUSED":
					this.state = "DISCONNECTED";
					return {
						status: 500,
						code: err.code,
						message: err.message
					};
				break;
				default:
					return err;
			}
		} else {
			return err;
		}
	};

	/*
	 * 
	 * CLASS LIBRARY CONNECTION
	 * 
	 */
	var connectionDB = class connectionDB {

		constructor (name, type, options, orm){
			this.state = "DISCONNECTED";
			this.name = name;
			this.type = type;
			this.db = null;
			this.orm = orm;
			this.intervalId = null;
			this.connect(type, options);
		}
		
		setConnection (db){
			if(! db){
				throw new Error("Cannot create class connection without db native");
			}
			this.db = db;
			
			this.orm.notificationsCenter.fire("onConnect", this.name, this.db );
			this.state = "CONNECTED";
		}
		
		getConnection (db){
			return this.db;
		}
		
		connect (type, config){
			if ( this.orm.debug ){
				config.options.logging = function(value){
					this.logger(value, "DEBUG")
				}.bind(this.orm);
			}else{
				config.options.logging = false;	
			}
			try {
				switch(type){
					case "sqlite" :
						config.options.storage = process.cwd() + config.dbname;
					break;
				
				}
				var conn = new this.orm.engine(config.dbname, config.username, config.password, config.options );	
				this.logger(this.name + " :  CONNECT to database "+ type+" : " +config.dbname, "DEBUG");
				process.nextTick( ()  => {
					this.setConnection(conn);
				});
			}catch(err){
				error.call(this, err);	
				this.orm.fire('onErrorConnection', this.name, conn, this.orm);
			}
		}
			
		logger (pci, severity, msgid,  msg){
			if (! msgid) msgid = "SERVICE sequelize CONNECTION";
			return this.orm.logger(pci, severity, msgid,  msg);
		}
	};

	/*
	 * 
	 * CLASS SERVICE sequelize
	 * 
	 */
	var sequelize = class sequelize extends nodefony.orm {

		constructor (container, kernel, autoLoader){
			super("sequelize", container, kernel, autoLoader )
			this.engine = require('sequelize');
			this.connections = {};
			this.boot();
		}

		boot (){
			super.boot();	
			this.kernel.listen(this, 'onBoot', (kernel) => {
				this.settings = this.container.getParameters("bundles.sequelize");
				this.debug = this.settings.debug ;
				if ( this.settings.connectors && Object.keys(this.settings.connectors).length ){
					for(var name in this.settings.connectors){
						this.createConnection(name, this.settings.connectors[name]);
					}
				}else{
					process.nextTick( () => {
						this.fire('onOrmReady', this);
					});	
				}
			});	
		}

		createConnection (name, config){
			//var url;
			// ORM2 CHECK 	
			/*switch(config.driver){
				case 'mysql':
					url = "mysql://" + config.user + ":" + config.password + "@" + config.host + ":" + config.port + "/" + config.database;
					break;
					
				case 'sqlite':
					url = config;
					//url = "sqlite://" + process.cwd() + config.dbname;
					break;
					
				case 'mongodb':
					url = "mongodb://" + (false ? '' : config.user + ":" + config.password) + '@' + config.host + ":" + config.port + "/" + config.database;
				break;
				
				case 'postgres':
					url = "postgres://" + config.user + ":" + config.password + "@" + config.host + "/" + config.database;
				break;
				
				default: 
					throw {
						message: "driver (" + config.driver + ") not exist"
					}
			}*/
			return this.connections[name] = new connectionDB( name, config.driver, config, this );		
		}
	};

	return sequelize ;

});

