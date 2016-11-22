/*
 *   New node file
 */

var http = require("http");

const assert = require('assert');

describe("SERVER WEB test", function(){

	//var assert = chai.assert;

	describe('Service HTTP HTTPS', function(){
	
		it("HTTP", function(done){
			
			var options = {
				hostname: '127.0.0.1',
				port: 5151,
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
	});

});

