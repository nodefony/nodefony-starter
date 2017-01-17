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
		it("promise-natif-5", function(done){
			global.options.path ='/test/unit/promise/promise5';  
			var data  = {"status":500,"promise":"1"} ;
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 500);
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					var res = JSON.parse(chunk);
					assert.deepStrictEqual(res, data);
					done();	
				});
			})
			request.end();
		});
		it("promise-natif-6", function(done){
			global.options.path ='/test/unit/promise/promise6';  
			var data  = {"status":404,"promise":"2"} ;
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 404);
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					var res = JSON.parse(chunk);
					assert.deepStrictEqual(res, data);
					done();	
				});
			})
			request.end();
		});
		it("promise-natif-7", function(done){
			global.options.path ='/test/unit/promise/promise7';  
			var data  = {"status":500,"data":{ foo: 'bar' }} ;
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 500);
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					var res = JSON.parse(chunk);
					assert.deepStrictEqual(res, data);
					done();	
				});
			})
			request.end();
		});
		it("promise-natif-8", function(done){
			global.options.path ='/test/unit/promise/promise8';  
			var data  = {"status":500,"data":{ foo: 'bar' }} ;
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 500);
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					var res = JSON.parse(chunk);
					assert.deepStrictEqual(res, data);
					done();	
				});
			})
			request.end();
		});
		it("promise-natif-88", function(done){
			global.options.path ='/test/unit/promise/promise88';  
			var data  = {"status":500,"data":"notDefinded is not defined"} ;
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 500);
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					var res = JSON.parse(chunk);
					assert.deepStrictEqual(res, data);
					done();	
				});
			})
			request.end();
		});
		it("promise-bluebird-9", function(done){
			global.options.path ='/test/unit/promise/promise9';  
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 200);
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					var res = JSON.parse(chunk);
					assert.deepStrictEqual(res.data.username, "admin");
					done();	
				});
			})
			request.end();
		});
		it("promise-bluebird-10", function(done){
			global.options.path ='/test/unit/promise/promise10';  
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 200);
				res.setEncoding('utf8');
				//var id = res.headers["set-cookie"][0].split(";")[0].split("=")[1] ;
				//console.log(id)
				res.on('data',  (chunk) => {
					var res = JSON.parse(chunk);
					//assert.deepStrictEqual(res, null);
					done();	
				});
			})
			request.end();
		});
		it("promise-bluebird-11", function(done){
			global.options.path ='/test/unit/promise/promise11';  
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 200);
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					var res = JSON.parse(chunk);
					assert.deepStrictEqual(res.data.username, "admin");
					done();	
				});
			})
			request.end();
		});
		it("promise-bluebird-12", function(done){
			global.options.path ='/test/unit/promise/promise12';  
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 500);
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					var res = JSON.parse(chunk);
					assert.deepStrictEqual(res.data.username, "admin");
					done();	
				});
			})
			request.end();
		});
		it("promise-bluebird-13", function(done){
			global.options.path ='/test/unit/promise/promise13';  
			var data  = {"status":500,"data":"notDefinded is not defined"} ;
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 500);
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
