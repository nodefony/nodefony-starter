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
const assert = require('assert');


describe("BUNDLE DEMO", function(){


	before(function(){
		global.options = {
			hostname: kernel.settings.system.domain,
			port: kernel.settings.system.httpPort,
			//path: '/myroute/',
			method: 'GET'
		};
	})

	describe('CONTROLLER PROMISE', function(){
		
		it("promise-natif", function(done){
			global.options.path ='/test/unit/promise/promise1';  
			var data  = { status: 200, data: { foo: 'bar' } } ;
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 200);
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					var res = JSON.parse(chunk);
					assert.deepStrictEqual(res, data);
					done();	
				});
			})
			request.end();
		});

		it("promise-natif-forward", function(done){
			global.options.path ='/test/unit/promise';  
			var data  = { status: 200, data: { foo: 'bar' } } ;
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 200);
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					var res = JSON.parse(chunk);
					assert.deepStrictEqual(res, data);
					done();	
				});
			})
			request.end();
		});

		it("promise-natif-2", function(done){
			global.options.path ='/test/unit/promise/promise2';  
			var data  = { status: 200, data: { foo: 'bar' } } ;
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 200);
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					var res = JSON.parse(chunk);
					assert.deepStrictEqual(res, data);
					done();	
				});
			})
			request.end();
		});
		
		it("promise-natif-all", function(done){
			global.options.path ='/test/unit/promise/promise3';  
			var data  = [{"status":200,"time":"200"},{"status":200,"time":"500"}] ;
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 200);
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					var res = JSON.parse(chunk);
					assert.deepStrictEqual(res, data);
					done();	
				});
			})
			request.end();
		});

		it("promise-natif-4", function(done){
			global.options.path ='/test/unit/promise/promise4';  
			var data  = [{"status":200,"time":"200"},{"status":200,"time":"500"}] ;
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 200);
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					var res = JSON.parse(chunk);
					assert.deepStrictEqual(res, data);
					done();	
				});
			})
			request.end();
		});
		
	});
});
