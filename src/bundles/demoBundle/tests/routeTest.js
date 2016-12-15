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
var WebSocketClient = require('websocket').client
var tunnel = require('tunnel');

const assert = require('assert');



describe("ROUTING", function(){

	before(function(){
			global.options = {
			hostname: kernel.settings.system.domain,
			port: kernel.settings.system.httpPort,
			//path: '/myroute/',
			method: 'GET'
		};
	})

	describe('DEFAULT_VALUE', function(){
			
		it("myroute/", function(done){
			global.options.path ='/myroute/';  
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 200);
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					var res = JSON.parse(chunk);
					assert.deepStrictEqual(res, {page:"13",element:"myRouteDefaultValue"});
					done();	
				});
			})
			request.end();
		});
		it("myroute", function(done){
			global.options.path ='/myroute';
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 200);
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					var res = JSON.parse(chunk);
					assert.deepStrictEqual(res, {page:"13",element:"myRouteDefaultValue"});
					done();	
				});
			})
			request.end();
		});

		it("myroute/51", function(done){
			global.options.path ='/myroute/51';
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 200);
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					var res = JSON.parse(chunk);
					assert.deepStrictEqual(res, {page:"51",element:"myRouteDefaultValue"});
					done();	
				});
			})
			request.end();
		});

		it("myroute/51/", function(done){
			global.options.path ='/myroute/51/';
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 200);
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					var res = JSON.parse(chunk);
					assert.deepStrictEqual(res, {page:"51",element:"myRouteDefaultValue"});
					done();	
				});
			})
			request.end();
		});

		it("myroute/51/foo", function(done){
			global.options.path ='/myroute/51/foo';
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 200);
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					var res = JSON.parse(chunk);
					assert.deepStrictEqual(res, {page:"51",element:"foo"});
					done();	
				});
			})
			request.end();
		});
		it("myroute/51/foo/", function(done){
			global.options.path ='/myroute/51/foo/';
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 200);
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					var res = JSON.parse(chunk);
					assert.deepStrictEqual(res, {page:"51",element:"foo"});
					done();	
				});
			})
			request.end();
		});
	});

	describe('REQUIEREMENTS REGEXP', function(){
		it("<requirement key='page'>^\d\d$</requirement>", function(done){
			global.options.path ='/myroute/515/foo/';
			var request = http.request(global.options,function(res) {
				assert.equal(res.statusCode, 500);
				res.setEncoding('utf8');
				res.on('data',  (chunk) => {
					done();	
				});
			})
			request.end();
		});
	});
});
