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
var querystring = require('querystring');
const assert = require('assert');


describe("BUNDLE DEMO", function(){

	before(function(){
		global.options = {
			hostname: kernel.settings.system.domain,
			port: kernel.settings.system.httpPort,
			method: 'GET'
		};
	})

	describe('REQUEST ', function(){

		it("request-get-query", function(done){
			global.options.path ='/test/unit/request?foo=bar&bar=foo';     
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 200);
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					var res = JSON.parse(chunk);
					assert.deepStrictEqual(res.query, {foo:"bar",bar:"foo"});
					done(); 
				});
			})
			request.end();
		});

		it("request-post-x-www-form-urlencoded", function(done){
			global.options.path ='/test/unit/request';     
			global.options.method ='POST';   
			var post_data = querystring.stringify(nodefony);
			global.options.headers = {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(post_data)
			};
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 200);
				assert.equal(res.statusMessage, "OK");
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					var res = JSON.parse(chunk);
					assert.deepStrictEqual(res.query, nodefony);
					done(); 
				});
			})
			request.write(post_data);
			request.end();
		});


		
	});
});
