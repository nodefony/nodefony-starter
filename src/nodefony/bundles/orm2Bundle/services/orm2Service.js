/*
 *
 *
 *	SERVICE ORM2 
 *
 *
 */

nodefony.registerService("ORM2", function(){

	/*
 	 *
 	 *	TODO ERROR SYSLOG SERVICE ORM  
 	 *
 	 */
	var error = function(err){
		
		if (this.state !== "DISCONNECTED"){
			this.orm.kernel.fire('onError', err, this);
		}
		this.logger(this.name + " : ERROR CONNECTION to database " + this.url +" "+err.message, "ERROR", "CONNECTION");
		if(err.code){
			switch(err.code){
				case 'PROTOCOL_CONNECTION_LOST':
				case "ECONNREFUSED":
					this.state = "DISCONNECTED";
					if (! this.intervalId )
						this.intervalId = setInterval(this.connect.bind(this), this.orm.timeReconnect || 30000);
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
	var connectionDB = function(name, type, url, orm){
		this.state = "DISCONNECTED";
		this.name = name;
		this.type = type;
		this.url = url;
		this.db = null;
		this.orm = orm;
		this.intervalId = null;
		this.connect();
	};	
	
	connectionDB.prototype.setConnection = function(db){
		if(! db){
			throw new Error("Cannot create class connection without db native");
		}
		//console.log(db.__proto__);
		this.db = db;
		/*this.db.use(this.orm.enginePaging);
		this.db.use(this.orm.engineTimestamp, {
	        	createdProperty: 'created_at',
	        	modifiedProperty: 'modified_at',
	        	dbtype: { type: 'date', time: true },
	        	now: function() { return new Date(); },
	        	persist: true
		});*/
		this.orm.notificationsCenter.fire("onConnect", this.name, this.db );
		this.state = "CONNECTED";
	};
	
	connectionDB.prototype.getConnection = function(db){
		return this.db;
	};
	
	connectionDB.prototype.connect = function(){
		try{
			var conn = this.orm.engine.connect(this.url);
			conn.Path = this.url;
			conn.on("connect", function(err, db){
				if(!err) {
					if ( this.intervalId ){
						clearInterval(this.intervalId);
						this.intervalId = null;
					}
					this.logger(this.name + " :  CONNECT to database "+ this.url, "INFO");
					this.setConnection(db);
				} else {
					error.call(this, err);
					this.orm.fire('onErrorConnection', this.name, conn, this.orm);
				}
			}.bind(this));
			conn.on("error", function(err){
				if(conn.Path == this.url){
					error.call(this, err);
				}
			}.bind(this));
		} catch(e){
			error.call(this, err);
		}
	};
		
	connectionDB.prototype.logger = function(pci, severity, msgid,  msg){
		if (! msgid) msgid = "SERVICE ORM2 CONNECTION";
		return this.orm.logger(pci, severity, msgid,  msg);
	};


	/*
	 * 
	 * CLASS SERVICE ORM2
	 * 
	 */
	var Orm = function(container, kernel, autoLoader){
	
		this.container = container ;	
		this.settings = container.getParameters("bundles.orm2");
		this.debug = this.settings.settings.debug ;
		this.timeReconnect = this.settings.settings.reconnect ;
		this.mother = this.$super;
		this.mother.constructor("ORM2", container, kernel, autoLoader);
		this.engine = require("orm");
		//this.enginePaging = require("orm-paging");
		//this.engineTimestamp = require("orm-timestamps");
		this.boot();

	}.herite(nodefony.orm);

	Orm.prototype.fire = function(ev){
		this.logger(ev, "DEBUG", "EVENT ORM2")
		return this.notificationsCenter.fire.apply(this.notificationsCenter, arguments);
	};


	Orm.prototype.boot = function(){
		this.mother.boot();	
		this.kernel.listen(this, 'onBoot', function(kernel){
			this.settings = this.container.getParameters("bundles.orm2");
			if ( Object.keys(this.settings.connectors).length ){
				for(var name in this.settings.connectors){
					//console.log("CONNECTION ===>> "+name);
					this.createConnection(name, this.settings.connectors[name]);
				}
			}else{
				process.nextTick(function () {
					this.fire('onOrmReady', this);
				}.bind(this));	
			}
		}.bind(this));	
	};

	Orm.prototype.createConnection = function(name, config){
		var url;
		
		switch(config.driver){
			case 'mysql':
				url = "mysql://" + config.user + ":" + config.password + "@" + config.host + ":" + config.port + "/" + config.database;
				break;
				
			case 'sqlite':
				url = "sqlite://" + process.cwd() + config.dbname;
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
		}
		return this.connections[name] = new connectionDB( name, config.driver, url, this );		
	};

	return Orm; 
});
