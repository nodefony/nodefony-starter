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
 *
 *   	
 */

const assert = require('assert');

var http = require("http");

describe("BUNDLE react", function(){
	

	describe('CORE', function(){
	

		beforeEach(function(){
		})
		
		before(function(){
		})
		
		// EXAMPLE  NODEFONY 
		it("NAMESPACE LOADED", function(done){
			// check nodefony namespace
			assert.equal( typeof nodefony, "object" );
			// check instance kernel 
			assert.equal( kernel instanceof nodefony.kernel, true)
			done();
		});
	});
	
	describe('ROUTE', function(){


		beforeEach(function(){
		})
		
		before(function(){
		})

		
		it("ROUTE react ", function(done){
			var options = {
				hostname: kernel.settings.system.domain,
				port: kernel.settings.system.httpPort,
				path: "/react",
				method: 'GET'
			};

			var request = http.request(options,function(res) {
				assert.equal(res.statusCode, 200);
				assert.equal(res.headers.server, "nodefony");
				res.setEncoding('utf8');
				res.on('data', function (chunk) {
					done();	
				});
				
			})
			request.end();

		});


	});
});
