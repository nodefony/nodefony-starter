/*
 *   New node file
 */

var http = require("http");

const assert = require('assert');

describe("NODEFONY SERVER WEB", function(){

	
	describe('CONFIGURATIONS ', function(){

		it("KERNEL", function(done){
			console.log( kernel.settings.system.version );
			done();
		});

	});


	describe('Service', function(){
			

		it("HTTP", function(done){
				
			var options = {
				hostname: kernel.settings.system.domain,
				port: kernel.settings.system.httpPort,
				path: '/json',
				method: 'GET'
			};

			var request = http.request(options,function(res) {
				assert.equal(res.statusCode, 200);
				assert.equal(res.headers.server, "nodefony");
				res.setEncoding('utf8');
				res.on('data', function (chunk) {
					var res = JSON.parse(chunk);
					assert.deepStrictEqual(res, {foo:"bar",bar:"foo"});
					done();	
				});
				
			})
			request.end();
		});

		it("HTTPS", function(done){
			done()
		});


		it("WEBSOCKET", function(done){
			done()
		});

		it("WEBSOCKET_SECURE", function(done){
			done()
		});


	});

});

