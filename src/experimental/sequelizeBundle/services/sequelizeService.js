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
	var connectionDB = function(name, type, options, orm){
		this.state = "DISCONNECTED";
		this.name = name;
		this.type = type;
		this.db = null;
		this.orm = orm;
		this.intervalId = null;
		this.connect(type, options);
	};	
	
	connectionDB.prototype.setConnection = function(db){
		if(! db){
			throw new Error("Cannot create class connection without db native");
		}
		this.db = db;
		
		this.orm.notificationsCenter.fire("onConnect", this.name, this.db );
		this.state = "CONNECTED";
	};
	
	connectionDB.prototype.getConnection = function(db){
		return this.db;
	};
	
	connectionDB.prototype.connect = function(type, config){
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
			process.nextTick(function () {
				this.setConnection(conn);
			}.bind(this));
		}catch(err){
			error.call(this, err);	
			this.orm.fire('onErrorConnection', this.name, conn, this.orm);
		}
	};
		
	connectionDB.prototype.logger = function(pci, severity, msgid,  msg){
		if (! msgid) msgid = "SERVICE sequelize CONNECTION";
		return this.orm.logger(pci, severity, msgid,  msg);
	};







	/*
	 * 
	 * CLASS SERVICE sequelize
	 * 
	 */
	var sequelize = function(container, kernel, autoLoader){
	
		this.container = container ;	
		this.mother = this.$super;
		this.mother.constructor("sequelize", container, kernel, autoLoader);
		this.engine = require('sequelize');
		this.connections = {};
		this.boot();

	}.herite(nodefony.orm);

	sequelize.prototype.fire = function(ev){
		this.logger(ev, "DEBUG", "EVENT SEQUELIZE")
		return this.notificationsCenter.fire.apply(this.notificationsCenter, arguments);
	};


	sequelize.prototype.boot = function(){
		this.mother.boot();	
		this.kernel.listen(this, 'onBoot', function(kernel){
			this.settings = this.container.getParameters("bundles.sequelize");
			this.debug = this.settings.debug ;
			if ( this.settings.connectors && Object.keys(this.settings.connectors).length ){
				for(var name in this.settings.connectors){
					this.createConnection(name, this.settings.connectors[name]);
				}
			}else{
				process.nextTick(function () {
					this.fire('onOrmReady', this);
				}.bind(this));	
			}
		}.bind(this));	
	};

	sequelize.prototype.createConnection = function(name, config){
		//var url;
		
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
	};



	return sequelize ;

});

