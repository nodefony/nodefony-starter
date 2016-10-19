#!/usr/local/bin/node  


// AUTOLOADER 
var autoloader = require("../vendors/nodefony/core/autoloader");



// CREATE INSTANCE OF CONTAINER 
var globalContainer  = new nodefony.Container() ;

// YOU CAN REGISTER INSTANCE HERSELF HAS SERVICES
globalContainer.set("global", globalContainer);	



// CREATE SCOPE WITH NAME
globalContainer.addScope("request");

// CLONE  ;
var scope = globalContainer.enterScope("request");	

// now varaible scope is a clone of globalContainer 



var myObect = {

	foo:"bar",
	bar:"foo"
}

globalContainer.setParameters( "config", myObect );


console.log( globalContainer.getParameters("config") ) 


// GET PARAMETERS TREE
var foo = globalContainer.getParameters("config.foo");
console.log(foo);



var myClass = function(){
	this.settings = {
		foo:"bar"
	};
}

myClass.prototype.getConfig = function(){
	return this.settings ;
}



globalContainer.set( "myService", new myClass() );



var instance = globalContainer.get("myService") ;

var config = instance.getConfig();

console.log( config )

