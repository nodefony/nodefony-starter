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


console.log("pass1")

var myFunc = function(file, callback){
	var fiber = Fiber.current;
	less.render( content, {
			//async: false,
			//force:true,
			//fileAsync: false,
			paths: ['.', file.dirName, process.cwd() ],	// Specify search paths for @import directives
			filename: file.name ,		// Specify a filename, for better error messages
			
	}, function(e, data){
	
		fiber.run();
		callback(e, data)
	})
	Fiber.yield();
}

	



function sleep(ms) {
    var fiber = Fiber.current;
    setTimeout(function() {
        fiber.run();
    }, ms);
    Fiber.yield();
}

Fiber(function() {
    console.log('wait... ' + new Date);
    //myFunc(file,function(){
//	console.log("pass work")
  //  })
    sleep(1000);
    console.log('ok... ' + new Date);
}).run();
console.log('back in main');



//console.log(ele)

console.log("pass end")



