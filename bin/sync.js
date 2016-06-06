#!/usr/local/bin/node

// AUTOLOADER 
var autoloader = require("../vendors/nodefony/core/autoloader");

var Promise = require('promise');






const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // Fork workers.
  	for (var i = 0; i < numCPUs; i++) {
    		cluster.fork();

  	}


	Object.keys(cluster.workers).forEach(function(id){

		cluster.workers[id].on("message", function(msg){
			console.log(msg)
		})
	});


 	setTimeout(function(){
  		Object.keys(cluster.workers).forEach((id) => {
	  		console.log(id)
    			cluster.workers[id].send('vier');
  		});
	}, 2000 );

  
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
	process.send({
        type : 'logging', 
        data : {
        level : 2,
        msg : "dd"
        }
    });

		

  }).listen(8000);
}






