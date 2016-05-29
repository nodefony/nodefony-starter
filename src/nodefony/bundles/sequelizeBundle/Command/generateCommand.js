/*
 *
 *
 *
 */

var Sequelize =require("sequelize");
var Promise = require('promise');
//var async = require('async');

nodefony.registerCommand("Sequelize",function(){


	var sequelize = function(container, command, options){
		var arg = command[0].split(":");
		this.ormService = this.container.get("sequelize");
		switch ( arg[1] ){
			case "generate" : 
				switch( arg[2 ]){
					case "entities" :
						var force = false ;
						if (command[1] === "force"){
							force= true ;
						}
						var tab =[];
						this.ormService.listen(this, "onReadyConnection",function(connectionName, connection , service){
							tab.push( new Promise( function(resolve, reject){
									this.logger("DATABASE SYNC : "+connectionName);
									connection.sync({force: force,logging:this.logger,hooks:true}).then(function(db) {
										this.logger("DATABASE :" + db.config.database +" CONNECTION : "+connectionName+" CREATE ALL TABLES", "INFO");
										resolve(connectionName);
									}.bind(this)).catch(function(error) {
										this.logger("DATABASE :" + connection.config.database +" CONNECTION : "+connectionName+" : " + error, "ERROR");
										reject(error);
									}.bind(this))
								}.bind(this))
							);
						}.bind(this));
						this.ormService.listen(this, "onOrmReady",function(service){
							Promise.all(tab)
							.catch(function(e){
								this.logger(e,"ERROR");
							}.bind(this))
							.done(function(){
								this.terminate();
							}.bind(this))

						}.bind(this));
					break;
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
									for(var fixture in fixtures){
										if ( fixtures[fixture].type === "sequelize"){
											this.logger("LOAD FIXTURES BUNDLE : " + bundles[bundle].name, "INFO");
											var conn = service.getConnection( fixtures[fixture].connection );
											var entity = service.getEntity( fixtures[fixture].entity );
											var entityName = fixtures[fixture].entity ;
											var connectionName = fixtures[fixture].connection ;
											this.logger("LOAD FIXTURE ENTITY : " + entityName + " CONNECTIONS : "+connectionName , "INFO");
											var toPush = fixtures[fixture].fixture.bind(this.ormService) ;
												
											tabPromise.push( toPush );
										}
									}
								}

							}
							var actions = tabPromise.map(function(ele){
								return new Promise(ele);
							})
							Promise.all(actions)
								.catch(function(e){
									this.logger(e, "ERROR");	
									}.bind(this))
								.then(function(){
									this.logger("LOAD FIXTURE ENTITY : "+ entityName +" SUCCESS")		
									this.terminate();
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
			case "query" :
				this.ormService.listen(this, "onOrmReady",function(service){
					switch( arg[2 ]){
						case "sql":
							var db = command[1];	
							var conn = this.ormService.getConnection(db);
							if ( ! conn){
								this.logger("CONNECTION : "+db +" NOT FOUND" , "ERROR");
								this.terminate();
								return ;	
							}
							var sql = command[2];	
							this.logger("CONNECTION : " + db + " \nEXECUTE REQUEST  : "+sql , "INFO");
							conn.query(sql)
							.catch(function(error){
								this.logger(error, "ERROR");
								this.terminate();	
							}.bind(this))
							.then(function(result){
								//console.log(result[0])
								var ele =  JSON.stringify(result);
								console.log(ele)

							}.bind(this))
							.done(function(){
								this.terminate();
							}.bind(this))
						break;
						default:
							this.showHelp();
							this.terminate();
					}
				});
			break;
			case "entity" :
				this.ormService.listen(this, "onOrmReady",function(service){
					switch( arg[2 ]){
						case "findAll" :
							var entity = command[1];
							var conn = this.ormService.getEntity(entity);
							if ( ! conn){
								this.logger("ENTITY : "+entity +" NOT FOUND" , "ERROR");
								this.terminate();
								return ;	
							}
							this.logger( "ENTITY :"+ entity +" \nEXECUTE findAll   " , "INFO");
							conn.findAll()
							.catch(function(error){
								this.logger(error, "ERROR");
								this.terminate();	
							}.bind(this))
							.then(function(result){
								//var attribute = result[0].$options.attributes ;
								var ele =  JSON.stringify(result);
								console.log(ele)
								
							}.bind(this))
							.done(function(){
								this.terminate();
							}.bind(this))
						break;
						default:
							this.showHelp();
							this.terminate();
					}
				});
			break;
			default:
				this.showHelp();
				this.terminate();
		}
	}
	return {
		name:"Sequelize",
		commands:{
			fixtures:["Sequelize:fixtures:load" ,"Load data fixtures to your database"],
			//fixture:["Sequelize:fixture:load bundleName:fixtureName" ,"Load a specific data fixture to your database"],
			//entity:["Sequelize:generate:entity connectionName entityName" ,"Generate an Entity"],
			//entity2:["Sequelize:generate:bundleEntity bundleName:entityName" ,"Generate Bundle Entity"],
			entities:["Sequelize:generate:entities [force]" ,"Generate All Entities force to delete table if exist  example : ./console Sequelize:generate:entities force "],
			//create:["Sequelize:database:create" ,"Create a database"],
			//show:["Sequelize:entity:show" ,"show  Entities"],
			sql:["Sequelize:query:sql connectionName SQL" ,"query sql in database connection  example : ./console  Sequelize:query:sql nodefony  'select * from users'"],
			entity:["Sequelize:entity:findAll entity " ,"query findAll ENTITY"]
		},
		worker:sequelize

	
	} ;
});		

