#!/usr/local/bin/node

var http = require("http");

var options = {
	hostname: 'nodefony.com',
	port: 5151,
	path: null,
	method: 'GET'
};

var i = 0 ;
setInterval(function(){

if ( i % 2) 
		//options.path="/api/syslog";
		options.path="/demo/finder";
	else
		options.path="/nodefony";

	var req = http.request(options, function(it, res) {
	  	//console.log('STATUS: ' + res.statusCode);
	    	//console.log('HEADERS: ' + JSON.stringify(res.headers));
	      	res.setEncoding('utf8');
	        res.on('data', function (index,chunk) {
			//console.log('BODY: ' + chunk);
			console.log('BODY: ' + it);
		}.bind(this, i));
	}.bind(this,i));


	req.on('error', function(e) {
	  	console.log('problem with request: ' + e.message);
	});

	// write data to request body
	// req.write('data\n');
	// req.write('data\n');
	req.end();
	i++
}, 20)


/*for (var i = 0; i<100000;i++){
	if ( i % 2) 
		options.path="/api/syslog";
	else
		options.path="/api/routes";

	var req = http.request(options, function(it, res) {
	  	//console.log('STATUS: ' + res.statusCode);
	    	//console.log('HEADERS: ' + JSON.stringify(res.headers));
	      	res.setEncoding('utf8');
	        res.on('data', function (index,chunk) {
			//console.log('BODY: ' + chunk);
			console.log('BODY: ' + it);
		}.bind(this, i));
	}.bind(this,i));


	req.on('error', function(e) {
	  	console.log('problem with request: ' + e.message);
	});

	// write data to request body
	// req.write('data\n');
	// req.write('data\n');
	req.end();
}*/
