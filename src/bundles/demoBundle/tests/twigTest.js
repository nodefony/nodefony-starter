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
			method: 'GET'
		};
	})

	describe('TWIG ', function(){

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


	});

});

