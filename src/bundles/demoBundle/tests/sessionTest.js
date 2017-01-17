
var http = require("http");
var https = require("https");
var WebSocketClient = require('websocket').client;
const request = require("request");
const assert = require('assert');

describe("BUNDLE DEMO", function(){

	before(function(){
		global.options = {
			url:"http://"+kernel.settings.system.domain + ":" +  kernel.settings.system.httpPort,
			urlws:'ws://'+kernel.settings.system.domain+':'+kernel.settings.system.httpPort
		};
		
		var serviceSession = kernel.get("sessions")
		global.startSesion = serviceSession.settings.start;
	})

	describe('SESSION START HTTP', function(){

		it("SESSION-NO-SESSION", function(done){
				
			if ( global.startSesion == false){ 
				var url =  global.options.url ;	
				var options = nodefony.extend({}, global.options, {
					url:url+"/test/unit/session"	
				})
				request(options, (error, res, body) => {
					if (error){
						throw error ;
					}
					if ( res.headers["set-cookie"] ){
						throw new Error ( "set-cookie exist !!!!" ) ;
					}
					done();
				});
			}else{
				done();
			}
		});

		it("SESSION-START", function(done){
			var url =  global.options.url ;	
			var options = nodefony.extend({}, global.options, {
				url:url+"/test/unit/session/start"	
			})
			request(options, (error, res, body) => {
				if (error){
					throw error ;
				}
				if ( res.headers["set-cookie"] ){
					try{ 
						var id = res.headers["set-cookie"][0].split(";")[0].split("=")[1] ;
					}catch(e){
						throw e ;
					}
				}
				var res = JSON.parse(body) ;
				assert.deepStrictEqual(res.id, id);
				assert.deepStrictEqual(res.name, "nodefony");
				assert.deepStrictEqual(res.strategy, "migrate");
				assert.deepStrictEqual(res.contextSession, "default");
				assert.deepStrictEqual(res.status, "active");
				done();
			});
		});
		it("SESSION-INVALIDATE", function(done){
			var url =  global.options.url ;	
			var options = nodefony.extend({}, global.options, {
				url:url+"/test/unit/session/invalidate"	
			})
			request(options, (error, res, body) => {
				if (error){
					throw error ;
				}
				if ( res.headers["set-cookie"] ){
					try{ 
						var id = res.headers["set-cookie"][0].split(";")[0].split("=")[1] ;
					}catch(e){
						throw e ;
					}
				}
				var res = JSON.parse(body) ;
				assert.deepStrictEqual(res.id, id);
				assert.notEqual(res.oldId, id);
				assert.deepStrictEqual(res.name, "nodefony");
				assert.deepStrictEqual(res.strategy, "migrate");
				assert.deepStrictEqual(res.contextSession, "default");
				assert.deepStrictEqual(res.status, "active");
				done();
			});
		});
		it("SESSION-MIGRATE", function(done){
			var url =  global.options.url ;	
			var options = nodefony.extend({}, global.options, {
				url:url+"/test/unit/session/migrate"	
			})
			request(options, (error, res, body) => {
				if (error){
					throw error ;
				}
				if ( res.headers["set-cookie"] ){
					try{ 
						var id = res.headers["set-cookie"][0].split(";")[0].split("=")[1] ;
					}catch(e){
						throw e ;
					}
				}
				var res = JSON.parse(body) ;
				assert.deepStrictEqual(res.id, id);
				assert.notEqual(res.oldId, id);
				assert.deepStrictEqual(res.name, "nodefony");
				assert.deepStrictEqual(res.strategy, "migrate");
				assert.deepStrictEqual(res.contextSession, "default");
				assert.deepStrictEqual(res.status, "active");
				done();
			});
		});
	});

	describe('SESSION START WEBSOCKET', function(){

		it("WEBSOCKET", function(done){
			var url =  global.options.urlws ;	
			var options = nodefony.extend({}, global.options, {
				url:url+"/test/unit/session"	
			})
			var client = new WebSocketClient();
			client.connect(options.url, null, "nodefony", null, {});
			client.on('connect', function(connection) { 
				connection.on("message", (message) => {
					var res = JSON.parse(message.utf8Data) ;
					//assert.deepStrictEqual(res.id, null);
					connection.close();
				})
				connection.on('close', (reasonCode, description) =>  {
					done();
				});
			});
			client.on('connectFailed', function() {
				throw new Error( "websoket client error")
			});
		});
		it("SESSION-START", function(done){
			var url =  global.options.urlws ;	
			var options = nodefony.extend({}, global.options, {
				url:url+"/test/unit/session/start"	
			});

			var client = new WebSocketClient();
			client.on('connect', function(connection) { 
				//console.log(connection)
				//FIXME try to get cookies with websocket client ????
				
				connection.on("message", (message) => {

					var res = JSON.parse( message.utf8Data ) ;
					if ( res.foo ){
						 return connection.close();	
					}
					//assert.deepStrictEqual(res.id, id);
					assert.deepStrictEqual(res.name, "nodefony");
					assert.deepStrictEqual(res.strategy, "migrate");
					assert.deepStrictEqual(res.contextSession, "default");
					assert.deepStrictEqual(res.status, "active");
					
				})
				connection.on('close', (reasonCode, description) =>  {
					done();
				});

				setTimeout(() =>{
					connection.sendUTF( JSON.stringify({foo:"bar"}) );
				}, 500);
			});
			client.on('connectFailed', function() {
				throw new Error( "websoket client error");
			});
			client.connect(options.url, null, "nodefony", null, {});
		});

		it("SESSION-INVALIDATE", function(done){
			var url =  global.options.urlws ;	
			var options = nodefony.extend({}, global.options, {
				url:url+"/test/unit/session/invalidate"	
			});
			var client = new WebSocketClient();
			client.on('connect', function(connection) { 
				//console.log(connection)
				//FIXME try to get cookies with websocket client ????
				
				connection.on("message", (message) => {

					var res = JSON.parse( message.utf8Data ) ;
					if ( res.foo ){
						 return connection.close();	
					}
					//assert.deepStrictEqual(res.id, id);
					//assert.notEqual(res.oldId, id);
					assert.deepStrictEqual(res.name, "nodefony");
					assert.deepStrictEqual(res.strategy, "migrate");
					assert.deepStrictEqual(res.contextSession, "default");
					assert.deepStrictEqual(res.status, "active");
					
				})
				connection.on('close', (reasonCode, description) =>  {
					done();
				});

				setTimeout(() =>{
					connection.sendUTF( JSON.stringify({foo:"bar"}) );
				}, 500);
			});
			client.on('connectFailed', function() {
				throw new Error( "websoket client error");
			});
			client.connect(options.url, null, "nodefony", null, {});
			
		});

		it("SESSION-MIGRATE", function(done){
			var url =  global.options.urlws ;	
			var options = nodefony.extend({}, global.options, {
				url:url+"/test/unit/session/migrate"	
			})
			var client = new WebSocketClient();
			client.on('connect', function(connection) { 
				//console.log(connection)
				//FIXME try to get cookies with websocket client ????
				
				connection.on("message", (message) => {

					var res = JSON.parse( message.utf8Data ) ;
					if ( res.foo ){
						 return connection.close();	
					}
					//assert.deepStrictEqual(res.id, id);
					//assert.notEqual(res.oldId, id);
					assert.deepStrictEqual(res.name, "nodefony");
					assert.deepStrictEqual(res.strategy, "migrate");
					assert.deepStrictEqual(res.contextSession, "default");
					assert.deepStrictEqual(res.status, "active");
					
				})
				connection.on('close', (reasonCode, description) =>  {
					done();
				});

				setTimeout(() =>{
					connection.sendUTF( JSON.stringify({foo:"bar"}) );
				}, 500);
			});
			client.on('connectFailed', function() {
				throw new Error( "websoket client error");
			});
			client.connect(options.url, null, "nodefony", null, {});
			
		});



	});
});

