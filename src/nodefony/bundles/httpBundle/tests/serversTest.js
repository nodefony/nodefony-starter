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

const request = require("request");


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
  				url:  "http://"+kernel.settings.system.domain + ":" +  kernel.settings.system.httpPort  ,
				headers: {
					'User-Agent': 'nodefony'
				}
			};

			request(options, (error, res, body) => {

				if (error){
					throw error ;
				}
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
				doneHttp();
				
			});


		});

		it("HTTPS-SERVICE", function(doneHttps){

			var service = kernel.get("httpsServer");
			var res = service.getCertificats() ;

			var options = {
				url:  "https://"+kernel.settings.system.domain + ":" +  kernel.settings.system.httpsPort  ,
				key: res.key,
				cert:res.cert,
				ca:res.ca,
			};
			
			request(options, (error, res, body) => {
				if (error){
					throw error ;
				}
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
				doneHttps();
				
			});

		});

	});

});

