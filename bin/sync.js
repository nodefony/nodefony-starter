#!/usr/local/bin/node

// AUTOLOADER 
var autoloader = require("../vendors/nodefony/core/autoloader");

var Promise = require('promise');
var async = require("async");
var less = require("less");
var sync = require('synchronize');
var Fiber = require('fibers');






var pwd = process.cwd() ;


var filePath = pwd+"/src/nodefony/bundles/monitoringBundle/Resources/public/less/style.less" ;

var file = new nodefony.fileClass( filePath );

var content = file.content() ;


console.log("BEGIN")


function processFile(file, done) {
  sync.fiber(function() {
	try {
		var data = sync.await( less.render( content, {
			paths: ['.', file.dirName, process.cwd() ],	// Specify search paths for @import directives
			filename: file.name ,		// Specify a filename, for better error messages
			
		}, sync.defer() ))
	} catch(e) {
		return done(e, null );
	}
	return done(null,data);
  }, done);
}


processFile(file, function(error, data){

	console.log(arguments)
})


console.log('back in main');






