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



describe("NODEFONY BUNDLE HTTP", function(){
	
	describe('CONFIGURATIONS ', function(){

		/*it("KERNEL", function(done){
			console.log( kernel.settings.system.version );
			done();
		});*/

	});

	describe('WEB', function(){
			

		it("HTTP-SERVICE", function(doneHttp){
				
			var options = {
				hostname: kernel.settings.system.domain,
				port: kernel.settings.system.httpPort,
				path: '/',
				method: 'GET'
			};

			var request = http.request(options,function(res) {
				switch ( res.statusCode ){
					case "302" :
						var ret = 200 ;
					break;
					default :
						var ret = res.statusCode ;
				}
				assert.equal(res.statusCode, ret );
				assert.equal(res.headers.server, "nodefony");
				res.setEncoding('utf8');
				res.on('data', function (chunk) {
					doneHttp();	
				});
				
			})
			request.end();
		});

		/*it("HTTPS-SERVICE", function(doneHttps){

			var service = kernel.get("httpsServer");
			var res = service.getCertificats() ;

			var options = {
				hostname: kernel.settings.system.domain,
				port: kernel.settings.system.httpsPort,
				path: '/',
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
					doneHttps();	
				});
			})
			request.end();

		});*/

	});

});

