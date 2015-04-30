/*
 *
 *
 *
 */

var Promise = require('promise');
var async = require('async');


nodefony.registerCommand("ORM2",function(){

	var createDatabase = function(protocol, obj, dbName, charset, collate){
		switch(protocol){
			case 'mysql':
				obj.driver.execQuery('CREATE DATABASE ' + dbName + ' DEFAULT CHARACTER SET ' + charset + ' DEFAULT COLLATE ' + (collate || 'utf8_general_ci'));
				break;

			case 'postgresql':
				obj.driver.execQuery('CREATE DATABASE ' + dbName + ' ENCODING=' + charset);
				break;
		}
	}



	var Orm = function(container, command, options){

		var arg = command[0].split(":");
		this.ormService = this.container.get("ORM2");

		switch ( arg[1] ){
			case "generate" : 
				switch( arg[2 ]){
					case "entity" :
						if ( command[1] && command[2] ){

							this.ormService.listen(this, "onOrmReady",function(service){

								var connection = service.getConnection( command[1] );
								if ( ! connection ){
									this.logger(new Error("generate:entity  connectionName "+command[1] +" not exist"), "ERROR");
									this.showHelp();
									return ;		
								}
								var enti = service.getEntity( command[2] );
								if (enti){
									enti.drop(function (){
										this.logger(connection.driver_name +" CONNECTION : "+command[1] +" DROP TABLE :" + command[2] ,"INFO");
										enti.sync(function () {
											if (error){
												this.logger(connection.driver_name +" CONNECTION : "+command[1]+" ERROR : "+ error,"INFO");
												return ;
											}
											this.logger(connection.driver_name +" CONNECTION : "+command[1]+" CREATE TABLE : "+ command[2],"INFO");
										}.bind(this));
									}.bind(this));

								}else{
									this.logger(new Error("generate:entity  entityName "+command[2] +" not exist"), "ERROR");
									this.showHelp();	
								}
							});


						}else{
							this.logger(new Error("generate:entity must have connectionName entityName arguments"), "ERROR");
							this.showHelp();	
						}
						break;
					case "entities" :
						var i = 0 ;
						this.ormService.listen(this, "onReadyConnection",function(connectionName, connection , service){
							async.series([function(callback){
								connection.drop(function (){
									this.logger(connection.driver_name +" CONNECTION : "+connectionName+" DROP ALL TABLES","INFO");
									connection.sync(function (error) {
										if (error){
											this.logger(connection.driver_name +" CONNECTION : "+connectionName+" : " + error, "ERROR");
											callback(-1)
											return ;
										}
										this.logger(connection.driver_name +" CONNECTION : "+connectionName+" CREATE ALL TABLES", "INFO");
										i++
										callback(i)
									}.bind(this));
								}.bind(this));
							}.bind(this)], function(count){
								var nbConnection = Object.keys(service.connections).length ;
								if (count === nbConnection )
									this.terminate();
								if ( count === -1 )
									this.terminate();
							}.bind(this));
						});
						break;
					case "bundleEntity" : 
						var sp = command[1].split(":");
						if ( sp.length !== 2 ){
							this.logger(new Error("generate:bundleEntity   "+command[1] +" bad format"), "ERROR");
							this.showHelp();
							return ;
						}
						var bund = sp[0].replace("Bundle", "");
						if ( ! ( bund in this.ormService.kernel.bundles) ) {
							this.logger(new Error("generate:bundleEntity   bundle : "+sp[0] +" not exist"), "ERROR");
							this.showHelp();
							return;	
						}
						var bundle =  this.ormService.kernel.bundles[bund] ; 
						var entityDef = bundle.getEntity( sp[1] );
						if ( entityDef ){
							if (entityDef.type === "ORM2" ){
								this.ormService.listen(this, "onOrmReady",function(service){
									//if (entityDef.connection === connectionName ){
									var connection = service.getConnection( entityDef.connection );
									var enti = service.getEntity( sp[1] );
									enti.drop(function (){
										this.logger(connection.driver_name +" CONNECTION : "+entityDef.connection +" DROP TABLE :" +  sp[1] ,"INFO");
										enti.sync(function () {
											this.logger(connection.driver_name +" CONNECTION : "+entityDef.connection+" CREATE TABLE : "+  sp[1],"INFO");
										}.bind(this));
									}.bind(this));
									//}									
								});
							}
						}else{
							this.logger(new Error("generate:bundleEntity   Entity : "+sp[1] +" not exist in bundle "+ sp[0]), "ERROR");
							this.showHelp();
							return;	
						}	

						break;
					default:
						this.showHelp();
				}
				break;
			case "fixtures" : 
				switch( arg[2 ]){
					case 'load':
						this.ormService.listen(this, "onOrmReady",function(service){	
							var bundles = this.ormService.kernel.bundles;
							var tabPromise = [];
							for(var bundle in bundles){
								var fixtures = bundles[bundle].getFixtures();
								if (Object.keys(fixtures).length ){
									this.logger("LOAD FIXTURES BUNDLE : " + bundles[bundle].name, "INFO");
									for(var fixture in fixtures){
										var conn = service.getConnection( fixtures[fixture].connection );
										var entity = service.getEntity( fixtures[fixture].entity );
										var entityName = fixtures[fixture].entity ;
										var connectionName = fixtures[fixture].connection ;
										this.logger("LOAD FIXTURE ENTITY : " + entityName + " CONNECTIONS : "+connectionName , "INFO");
										var toPush = new Promise(fixtures[fixture].fixture.bind(this.ormService) )
											.then(function(data){
												this.logger("LOAD FIXTURE ENTITY : "+ entityName +" SUCCESS")
											}.bind(this));
										tabPromise.push( toPush );
									}
								}

							}
							Promise.all(tabPromise)
								.catch(function(e){
									this.logger(e, "ERROR");	
									}.bind(this))
								.done(function(){
									this.terminate();
								}.bind(this))
						}.bind(this));

						break;
					default:
						this.showHelp();
				}
				break;
			case "fixture" : 
				switch( arg[2 ]){
					case 'load':

						var sp = command[1].split(":");
						if ( sp.length !== 2 ){
							this.logger(new Error("fixture:load   "+command[1] +" bad format"), "ERROR");
							this.showHelp();
							return ;
						}
						var bund = sp[0].replace("Bundle", "");
						var bundle =  this.ormService.kernel.bundles[bund] ; 
						this.logger("LOAD FIXTURES BUNDLE : " + bundle.name, "INFO");

						var fixtureDef = bundle.getFixture( sp[1] );

						if ( fixtureDef ){
							this.ormService.listen(this, "onOrmReady",function(service){
								var conn = service.getConnection( fixtureDef.connection );
								var entity = service.getEntity( fixtureDef.entity );
								this.logger("FIXTURE ENTITY : " + fixtureDef.entity + " CONNECTIONS : "+fixtureDef.connection , "INFO");	
								try {
									new Promise(fixtureDef.fixture.bind(this.ormService) )
									.then(function(items){
										console.log(items);
										this.logger("LOAD FIXTURE ENTITY : "+ fixtureDef.entity +" SUCCESS")
									}.bind(this))
									.catch(function(e){
										this.logger(e, "ERROR");
									}.bind(this))
									.done(function(){
										this.terminate()
									}.bind(this))
								}catch(e){
									this.logger(e, "ERROR");
									this.terminate()	
								}
								
							}.bind(this));

						}else{
							this.logger(new Error("fixture:load   Fixture : "+sp[1] +" not exist in bundle "+ sp[0]), "ERROR");
							this.showHelp();
							return;	
						}
						break;
					default:
						this.showHelp();
				}
				break;
			case "database" : 
				break;
			case "entity" :
				switch( arg[2 ]){
					case "show" :						
						this.checkBundlesEntities();
						this.ormService.listen(this, 'onOrmReady',function(){
							console.log( this.table.render() );
							this.terminate();
						});
						break;
					default:
						this.showHelp();
						this.terminate();
				}
				break;
			case "connections" :
				switch( arg[2 ]){
					case "state" :
						this.checkConnections();
						this.ormService.listen(this, 'onOrmReady',function(){
							console.log( this.connectionsTable.render() );
							this.terminate();
						});
						break;
					default:
						this.showHelp();
						this.terminate();
				}
				break;
			default:
				this.showHelp();
				this.terminate();

		}

	};

	Orm.prototype.checkBundlesEntities = function(){
		this.table = new AsciiTable("ENTITIES ORM");	
		this.table.setHeading(
				"NAME",
				"TYPE",
				"BUNDLE",
				"CONNECTION",
				"ASSOCIATIONS"
				);
		var bundles =  this.ormService.kernel.bundles ;
		for (var bundle in bundles){
			var entities = bundles[bundle].getEntities();
			//console.log( bundle)
			//console.log( entities)
			if ( entities ){
				for (var entity in entities){
					this.table.addRow(
							entity,
							entities[entity].type,
							bundle,
							entities[entity].connection,
							util.inspect( entities[entity].association )			
							);
				}
			}
		}
	};



	Orm.prototype.checkConnections = function(){
		this.connections = {};
		this.connectionsTable = new AsciiTable("CONNECTIONS DATABASES");
		this.connectionsTable.setHeading(
				"NAME",
				"DRIVER",
				//"DATABASE",
				"LOCATION",
				"USER",
				"PASSWORD",
				"STATE"
				);

		this.ormService.listen(this, "onReadyConnection",function(connectionName, connection , service){
			this.connectionsTable.addRow(
				connectionName,
				connection.driver_name,
				//connection.driver.config.database,
				connection.driver.config.href,
				connection.driver.config.user,
				connection.driver.config.password,
				connection.driver_name == "mysql"? connection.driver.db.state : "authenticated"
				);	
		}.bind(this));

		this.ormService.listen(this, 'onErrorConnection',function(connectionName, connection, service){
			this.connectionsTable.addRow(
				connectionName,
				connection.driver_name,
				//connection.driver.config.database,
				connection.driver.config.href,
				connection.driver.config.user,
				connection.driver.config.password,
				connection.driver_name == "mysql"? connection.driver.db.state : "disconnected" 
				);
		});
	};


	return {
		name:"ORM2",
			commands:{
				fixtures:["ORM2:fixtures:load" ,"Load data fixtures to your database"],
				fixture:["ORM2:fixture:load bundleName:fixtureName" ,"Load a specific data fixture to your database"],
				entity:["ORM2:generate:entity connectionName entityName" ,"Generate an Entity"],
				entity2:["ORM2:generate:bundleEntity bundleName:entityName" ,"Generate Bundle Entity"],
				entities:["ORM2:generate:entities" ,"Generate All Entities"],
				create:["ORM2:database:create" ,"Create a database"],
				show:["ORM2:entity:show" ,"show  Entities"],
				connections:["ORM2:connections:state" ,"view  connections states"]
			},
			worker:Orm
	}
});
