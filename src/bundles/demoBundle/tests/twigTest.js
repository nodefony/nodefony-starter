/*
 *   MODEFONY FRAMEWORK UNIT TEST
 *
 *   MOCHA STYLE
 *
 *   In the global context you can find : 
 *
 *	nodefony : namespace to get library  
 *	kernel :   instance of kernel who launch the test   
 *
 */

var http = require("http");
var https = require("https");
var WebSocketClient = require('websocket').client;
//var tunnel = require('tunnel');

const assert = require('assert');



describe("BUNDLE DEMO", function(){

	before(function(){
		global.options = {
			hostname: kernel.settings.system.domain,
			port: kernel.settings.system.httpPort,
			method: 'GET',
			urlws:'ws://'+kernel.settings.system.domain+':'+kernel.settings.system.httpPort
		};
	})

	describe('TWIG RENDER', function(){

		it("render-get", function(done){
			global.options.path ='/test/unit/twig/render';
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 408);
				done(); 
			})
			request.end();
		});
		
		it("render", function(done){
			global.options.path ='/test/unit/twig/render';     
			global.options.method ='POST';   
			var data = {
				type:"render",
			};
			var post_data = querystring.stringify(data);
			global.options.headers = {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(post_data)
			};
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 200);
				assert.equal(res.statusMessage, "OK");
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					var ret = JSON.parse(chunk);
					assert.deepStrictEqual(ret.response.data, data);
					done(); 
				});
			})
			request.write(post_data);
			request.end();
		});
		it("renderSync", function(done){
			global.options.path ='/test/unit/twig/render';     
			global.options.method ='POST';   
			var data = {
				type:"renderSync",
			};
			var post_data = querystring.stringify(data);
			global.options.headers = {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(post_data)
			};
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 200);
				assert.equal(res.statusMessage, "OK");
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					var ret = JSON.parse(chunk);
					assert.deepStrictEqual(ret.response.data, data);
					done(); 
				});
			})
			request.write(post_data);
			request.end();
		});
		it("renderAsync", function(done){
			global.options.path ='/test/unit/twig/render';     
			global.options.method ='POST';   
			var data = {
				type:"renderAsync",
			};
			var post_data = querystring.stringify(data);
			global.options.headers = {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(post_data)
			};
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 200);
				assert.equal(res.statusMessage, "OK");
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					var ret = JSON.parse(chunk);
					assert.deepStrictEqual(ret.response.data, data);
					done(); 
				});
			})
			request.write(post_data);
			request.end();
		});
		it("renderJson", function(done){
			global.options.path ='/test/unit/twig/render';     
			global.options.method ='POST';   
			var data = {
				type:"renderJson",
			};
			var post_data = querystring.stringify(data);
			global.options.headers = {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(post_data)
			};
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 200);
				assert.equal(res.statusMessage, "OK");
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					var ret = JSON.parse(chunk);
					assert.deepStrictEqual(ret.response.data, data);
					done(); 
				});
			})
			request.write(post_data);
			request.end();
		});
		it("renderJsonSync", function(done){
			global.options.path ='/test/unit/twig/render';     
			global.options.method ='POST';   
			var data = {
				type:"renderJsonSync",
			};
			var post_data = querystring.stringify(data);
			global.options.headers = {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(post_data)
			};
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 200);
				assert.equal(res.statusMessage, "OK");
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					var ret = JSON.parse(chunk);
					assert.deepStrictEqual(ret.response.data, data);
					done(); 
				});
			})
			request.write(post_data);
			request.end();
		});
		it("renderJsonAsync", function(done){
			global.options.path ='/test/unit/twig/render';     
			global.options.method ='POST';   
			var data = {
				type:"renderJsonAsync",
			};
			var post_data = querystring.stringify(data);
			global.options.headers = {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(post_data)
			};
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 200);
				assert.equal(res.statusMessage, "OK");
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					var ret = JSON.parse(chunk);
					assert.deepStrictEqual(ret.response.data, data);
					done(); 
				});
			})
			request.write(post_data);
			request.end();
		});
		it("renderJsonAsyncTimeOut", function(done){
			global.options.path ='/test/unit/twig/render';     
			global.options.method ='POST';   
			var data = {
				type:"renderJsonAsyncTimeOut",
			};
			var post_data = querystring.stringify(data);
			global.options.headers = {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(post_data)
			};
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 408);
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					done(); 
				});
			})
			request.write(post_data);
			request.end();
		});
		it("renderObject", function(done){
			global.options.path ='/test/unit/twig/render';     
			global.options.method ='POST';   
			var data = {
				type:"renderOject",
			};
			var post_data = querystring.stringify(data);
			global.options.headers = {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(post_data)
			};
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 200);
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					assert.deepStrictEqual(chunk, '"<h1>NODEFONY REQUEST :renderOject </h1>"\n\n');
					done(); 
				});
			})
			request.write(post_data);
			request.end();
		});
	});


	describe('TWIG EXTEND', function(){

		it("twig-extend-get", function(done){
			global.options.path ='/test/unit/twig/extend';
			global.options.method ='GET';
			global.options.headers = {};
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 500);
				done(); 
			})
			request.end();
		});

		var resultJson = function(type, message){
			if ( message ){
				return {
					response : {
 			       			code: 200,
						reason: { 
							type: type, 
							message: message 
						},
						data: { type: type } 
					}
				}	
			}
			return {
				response : {
 			       		code: 200,
					reason: { 
						type: type, 
						message: {
							response :{
								code: 200,
								reason: { 
									type: type, 
									message:""
								},
								data: { type: type }
							}
						}
					},
					data: { type: type } 
				}
			}
		}

		it("render", function(done){
			global.options.path ='/test/unit/twig/extend';     
			global.options.method ='POST';   
			var data = {
				type:"render",
			};
			var post_data = querystring.stringify(data);
			global.options.headers = {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(post_data)
			};
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 200);
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					var ret = JSON.parse(chunk);
					assert.deepStrictEqual(ret, resultJson("render"));
					done(); 
				});
			})
			request.write(post_data);
			request.end();
		});
		it("renderTorenderSync", function(done){
			global.options.path ='/test/unit/twig/extend';     
			global.options.method ='POST';   
			var data = {
				type:"renderTorenderSync",
			};
			var post_data = querystring.stringify(data);
			global.options.headers = {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(post_data)
			};
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 200);
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					var ret = JSON.parse(chunk);
					assert.deepStrictEqual(ret, resultJson("renderSync"));
					done(); 
				});
			})
			request.write(post_data);
			request.end();
		});

		it("renderSync", function(done){
			global.options.path ='/test/unit/twig/extend';     
			global.options.method ='POST';   
			var data = {
				type:"renderSync",
			};
			var post_data = querystring.stringify(data);
			global.options.headers = {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(post_data)
			};
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 200);
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					var ret = JSON.parse(chunk);
					assert.deepStrictEqual(ret, resultJson("renderSync"));
					done(); 
				});
			})
			request.write(post_data);
			request.end();
		});
		it("renderSyncTorender", function(done){
			global.options.path ='/test/unit/twig/extend';     
			global.options.method ='POST';   
			var data = {
				type:"renderSyncTorender",
			};
			var post_data = querystring.stringify(data);
			global.options.headers = {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(post_data)
			};
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 200);
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					var ret = JSON.parse(chunk);
					assert.deepStrictEqual(ret, resultJson("render"));
					done(); 
				});
			})
			request.write(post_data);
			request.end();
		});
		
		it("renderAsyncToSync", function(done){
			global.options.path ='/test/unit/twig/extend';     
			global.options.method ='POST';   
			var data = {
				type:"renderAsyncToSync",
			};
			var post_data = querystring.stringify(data);
			global.options.headers = {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(post_data)
			};
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 200);
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					var ret = JSON.parse(chunk);
					assert.deepStrictEqual(ret, resultJson("renderSync"));
					done(); 
				});
			})
			request.write(post_data);
			request.end();
		});

		it("renderAsyncToRender", function(done){
			global.options.path ='/test/unit/twig/extend';     
			global.options.method ='POST';   
			var data = {
				type:"renderAsyncToRender",
			};
			var post_data = querystring.stringify(data);
			global.options.headers = {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(post_data)
			};
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 200);
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					var ret = JSON.parse(chunk);
					assert.deepStrictEqual(ret, resultJson("render"));
					done(); 
				});
			})
			request.write(post_data);
			request.end();
		});

//		it("renderSyncToAsync", function(done){
//			global.options.path ='/test/unit/twig/extend';     
//			global.options.method ='POST';   
//			var data = {
//				type:"renderSyncToAsync",
//			};
//			var post_data = querystring.stringify(data);
//			global.options.headers = {
//				'Content-Type': 'application/x-www-form-urlencoded',
//				'Content-Length': Buffer.byteLength(post_data)
//			};
//			var request = http.request(global.options,function(res) {
//				assert.equal(res.statusCode, 200);
//				res.setEncoding('utf8');
//				res.on('data',  (chunk) => {
//					assert.throws( ()=>{ JSON.parse(chunk)} )
//					done(); 
//				});
//			})
//			request.write(post_data);
//			request.end();
//		});

		it("renderToOject", function(done){
			global.options.path ='/test/unit/twig/extend';     
			global.options.method ='POST';   
			var data = {
				type:"renderToOject",
			};
			var post_data = querystring.stringify(data);
			global.options.headers = {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(post_data)
			};
			var request = http.request(global.options,function(res) {
				//assert.equal(res.statusCode, 200);
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					//console.log(chunk)
					var ret = JSON.parse(chunk);
					//console.log(ret)
					assert.deepStrictEqual(ret, resultJson("renderOject", "<h1>NODEFONY REQUEST :renderOject </h1>"));
					done(); 
				});
			})
			request.write(post_data);
			request.end();
		});
	});

	describe('TWIG WEBSOCKET', function(){

		it("WEBSOCKET", function(done){
			var url =  global.options.urlws ;	
			var options = nodefony.extend({}, global.options, {
				url:url+"/test/unit/twig/websocket"	
			});
			var client = new WebSocketClient();
			client.connect(options.url, null, "nodefony", null, {});
			client.on('connect', function(connection) { 
				assert(connection.connected);
				connection.on("message", (message) => {
					var res = JSON.parse(message.utf8Data) ;
					switch ( res.type ){
						case "START" :
							assert.deepStrictEqual(res.message, "CONNECTED");	
							connection.sendUTF( JSON.stringify({
								type:"TWIG-RENDER"	
							}) );
						break;
						case "TWIG-RENDER" :
							connection.sendUTF( JSON.stringify({
								type:"STOP"
							}) );
						break;
						case "STOP" :
							assert.deepStrictEqual(res.response.reason.message.type, "RENDER");	
							connection.close();
						break;
					}
				})
				connection.on('close', (reasonCode, description) =>  {
					done();
				});
			});
			client.on('connectFailed', function() {
				throw new Error( "websoket client error")
			});
		});


	})

});

