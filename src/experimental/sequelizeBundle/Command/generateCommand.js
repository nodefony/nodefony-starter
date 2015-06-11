/*
 *
 *
 *
 */

var Sequelize =require("sequelize");
var Promise = require('promise');
var async = require('async');

nodefony.registerCommand("Sequelize",function(){


	var sequelize = function(container, command, options){
		var arg = command[0].split(":");
		this.ormService = this.container.get("sequelize");
		
		switch ( arg[1] ){
			case "generate" : 
				switch( arg[2 ]){
					case "entities" :
						var i = 0 ;
						var tab =[];
						this.ormService.listen(this, "onReadyConnection",function(connectionName, connection , service){
							tab.push( function(callback){
								connection.sync({force: true}).then(function(db) {
									this.logger("DATABASE :" + db.config.database +" CONNECTION : "+connectionName+" CREATE ALL TABLES", "INFO");
									i++;
									callback(i);
								}.bind(this)).catch(function(error) {
									console.log(arguments)
									this.logger("DATABASE :" + connection.config.database +" CONNECTION : "+connectionName+" : " + error, "ERROR");
									callback(-1);
								}.bind(this))
							}.bind(this));
						}.bind(this));
						this.ormService.listen(this, "onOrmReady",function(service){
							async.series(tab, function(count){
								var nbConnection = Object.keys(service.connections).length ;
								if (count === nbConnection )
									this.terminate();
								if ( count === -1 )
									this.terminate();
							}.bind(this));

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
											var toPush = new Promise(fixtures[fixture].fixture.bind(this.ormService) )
												.then(function(data){
													this.logger("LOAD FIXTURE ENTITY : "+ entityName +" SUCCESS")
												}.bind(this));
											tabPromise.push( toPush );
										}
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
			entities:["Sequelize:generate:entities" ,"Generate All Entities"],
			//create:["Sequelize:database:create" ,"Create a database"],
			//show:["Sequelize:entity:show" ,"show  Entities"],
			//connections:["Sequelize:connections:state" ,"view  connections states"]
		},
		worker:sequelize

	
	} ;
});		

