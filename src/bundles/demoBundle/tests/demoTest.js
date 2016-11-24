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



describe("BUNDLE DEMO", function(){
	
	describe('CONFIGURATIONS ', function(){

		it("KERNEL", function(done){
			//console.log( kernel.settings.system.version );
			done();
		});

	});

	describe('SERVER', function(){
			

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
			var service = kernel.get("httpsServer");
			var res = service.getCertificats() ;

			var options = {
				hostname: kernel.settings.system.domain,
				port: kernel.settings.system.httpsPort,
				path: '/json',
				method: 'GET',
				key: res.key,
				cert:res.cert,
				rejectUnauthorized: false,
				requestCert: false,
				agent: false
			};

			var request = https.request(options,function(res) {
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


		it("WEBSOCKET", function(done){

			var client = new WebSocketClient();
			var iter = 0 ;
			/* connect(url,requestedProtocols, [[[origin], headers] )*/
			var url = 'ws://'+kernel.settings.system.domain+':'+kernel.settings.system.httpPort+'/websoket'
			client.connect(url, null, "nodefony", null, {});
			client.on('connect', function(connection) { 
				console.log( "websoket connection ok on : " + url)	
				connection.on("message", function(message){
					//console.log(message)
					iter++	
				}.bind(this))
				//connection.close(); 
				connection.on('close', function(reasonCode, description) {
					assert.equal(iter, 9);
					assert.equal(reasonCode, 1000);
					assert.equal(description, "NODEFONY CONTROLLER CLOSE SOCKET");
					done();
				});
			
			});
			client.on('connectFailed', function() {
				throw new Error( "websoket client error")
			});
		});

		it("WEBSOCKET_SECURE", function(done){
			done()
		});


	});

});

