
var http = require("http");
var https = require("https");
var WebSocketClient = require('websocket').client;
const request = require("request");
const assert = require('assert');

describe("BUNDLE DEMO", function(){

	before(function(){
		global.options = {
			url:"http://"+kernel.settings.system.domain + ":" +  kernel.settings.system.httpPort
		};
		
		var serviceSession = kernel.get("sessions")
		global.startSesion = serviceSession.settings.start;
	})

	describe('SESSION START', function(){

		it("SESSION-HTTP-NO-SESSION", function(done){
				
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

		it("SESSION-HTTP-START", function(done){
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
		it("SESSION-HTTP-INVALIDATE", function(done){
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
		it("SESSION-HTTP-MIGRATE", function(done){
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
});

