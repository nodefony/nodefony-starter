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

scope.setParameters( "config", myObect );


console.log( scope.getParameters("config") ) 


// GET PARAMETERS TREE
var foo = scope.getParameters("config.foo");
console.log(foo);


// NO GLOBAL
var foo = globalContainer.getParameters("config.foo");
console.log(foo);

globalContainer.leaveScope( scope );


console.log(globalContainer )

globalContainer.removeScope( "request" );

console.log(globalContainer )




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

//console.log( config )






// CREATE INSTANCE OF CONTAINER 
var globalContainer  = new nodefony.Container() ;
	  	
// CREATE SCOPE WITH NAME
globalContainer.addScope("request");

// enterScope CLONE  ;
var scope1 = globalContainer.enterScope("request");	

// enterScope CLONE
var scope2 = globalContainer.enterScope("request");

console.log( globalContainer )

// to  detach scope1 to  container 
globalContainer.removeScope("request")
console.log( globalContainer )

