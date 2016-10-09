#!/usr/local/bin/node  

var toMarkdown = require('to-markdown');

// AUTOLOADER 
var autoloader = require("../vendors/nodefony/core/autoloader");

var Promise = require('promise');




var http = require("http");

var options = {
	hostname: 'nodefony.com',
	port: 5151,
	path: "/documentation/nodefony/Alpha/helloWord",
	method: 'GET'
};

var req = http.request(options, function( res) {
	console.log('STATUS: ' + res.statusCode);
	console.log('HEADERS: ' + JSON.stringify(res.headers));
	res.setEncoding('utf8');
	res.on('data', function (chunk) {
		var res = toMarkdown(chunk);
		console.log(res)
	}.bind(this));
}.bind(this));


req.on('error', function(e) {
	console.log('problem with request: ' + e.message);
});

req.end();







