/*
 *   New node file
 */

var http = require("http");


describe("Bundle security test cookies", function(){

	var assert = chai.assert;

	describe('Class cookie', function(){
	
		it("instance cookie", function(done){
			
			//console.log(this);
			var cookie = new nodefony.cookies.cookie("foo","bar",{
				maxAge:31*24*60*60*1000
			});
			var str = cookie.serialize();
			//console.log(str)
			//console.log(assert)

			//var http =  
			var options = {
				hostname: 'nodefony.com',
				port: 5151,
				path: '/cci',
				method: 'GET'
			};
			var request = http.request(options,function(res) {
				//console.log(res)
				console.log('STATUS: ' + res.statusCode)
				if ( res.statusCode )
				//console.log(res.headers )
				res.setEncoding('utf8');
				res.on('data', function (chunk) {
					//console.log(chunk)
				});
				res.on('headers', function (chunk) {
					console.log(arguments)
				});
				done();	
			})
			request.end();

				
		});
	});

});

