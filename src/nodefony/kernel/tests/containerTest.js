/*
 *   MODEFONY FRAMEWORK
 *
 *   MOCHA UNIT TEST
 *
 *   nodefony add in context : 
 *	namespace nodefony
 *	instance  kernel console  
 *
 */


const assert = require('assert');

var myObject = {

	foo:"bar",
	bar:"foo"
}

var myObject2 = {
	foo:"bar2",
	bar:"foo2"
}

var myClass = function(){
	this.settings = {
		foo:"bar"
	};
	this.setting2 = {"crypto":{},"modules":{},"controllers":{},"browser":{"navigator":"Chrome","version":57,"Ie":false,"Gecko":false,"Webkit":true,"Opera":false,"platform":"mac"},"functions":{},"notificationsCenter":{},"io":{"nativeWebSocket":true,"protocols":{},"authentication":{"mechanisms":{}},"transports":{}},"xml":{}}; 
}

myClass.prototype.getConfig = function(){
	return this.settings ;
}

myClass.prototype.getConfig2 = function(){
	return this.setting2 ;
}




describe("NODEFONY KERNEL ", function(){

	describe('CONTAINER', function(){
			
		beforeEach(function(){
			if ( ! global.globalContainer ){
				global.globalContainer  = new nodefony.Container() ;
			}	
		})

		it("LIB LOADED", function(done){
			assert.equal( typeof nodefony.Container, "function" );
			done()
		});

		it("INSTANCE CONTAINER", function(done){
			
			// YOU CAN REGISTER INSTANCE HERSELF HAS SERVICES
			global.globalContainer.set("global", global.globalContainer);	
			var res= global.globalContainer.get("global")
			assert.deepStrictEqual(res, global.globalContainer);

			global.globalContainer.set("obj" , myObject) ;
			assert.deepStrictEqual( global.globalContainer.protoService.prototype.obj , myObject);
			var res= global.globalContainer.get("obj")
			assert.deepStrictEqual(res, myObject);
			
			var service = global.globalContainer.set( "myService", new myClass() );
			assert.deepEqual ( service.getConfig(), { foo:"bar"}) ;

			// parameters
			global.globalContainer.setParameters("config", service.getConfig() );

			assert.deepEqual( global.globalContainer.getParameters("config"), service.getConfig() )
			assert.equal( global.globalContainer.getParameters("config.foo"), "bar" )

			

			done();
		});

		it("SCOPE CONTAINER", function(done){

			// CREATE SCOPE WITH NAME
			global.globalContainer.addScope("request");
			assert.deepEqual( global.globalContainer.scope.request , {} );

			// CLONE  ;
			global.scope = global.globalContainer.enterScope( "request" );
			var id = global.scope.id ;
			assert( global.globalContainer.scope.request[id], "SCOPE  ID  ERROR" )
			assert.deepStrictEqual( global.globalContainer, global.scope.parent);
			assert.deepStrictEqual( global.globalContainer.scope.request[id], global.scope);

			assert.deepStrictEqual( global.scope.get("obj"), myObject );
			
			var res = global.scope.set("obj2", myObject2);
			assert.deepStrictEqual( global.scope.get("obj2"), myObject2 );


			var service = global.scope.get( "myService" );
			assert.deepEqual ( service.getConfig(), { foo:"bar"}) ;


			assert.equal(global.globalContainer.get("obj2"), null) ;

			// parameters
			assert.deepEqual( global.scope.getParameters("config"), service.getConfig() )
			assert.equal( global.scope.getParameters("config.foo"), "bar" )


			// parameters
			global.scope.setParameters("config2", service.getConfig2() );

			assert.equal( global.scope.getParameters("config2.browser.navigator"), "Chrome" );




			done();
		});

		it("EXTENDED SCOPE ALREADY SCOPED", function(done){

			global.scope.addScope("response");
			assert.deepEqual( global.scope.scope.response , {} );
			// CLONE  ;
			var scope = global.scope.enterScopeExtended( "response" );
			var id = scope.id ;
			assert( global.scope.scope.response[id], "SCOPE  ID  ERROR" )
			assert.deepStrictEqual( global.scope, scope.parent);
			assert.deepStrictEqual( global.scope.scope.response[id], scope);

			assert.deepStrictEqual( scope.get("obj"), null );

			assert.deepStrictEqual( scope.get("obj2"), myObject2 );

			var myObj = {bar:"foo"} ;
			var res = scope.set("myObj", myObj);
			assert.deepStrictEqual( scope.get("myObj"), myObj );

			assert.equal(global.scope.get("myObj"), null) ;

			// CHECK extended recursif	
			scope.addScope("websocket");
			//clone
			var scope2 = scope.enterScope( "websocket" );
			assert.deepStrictEqual( scope2.get("obj2"), myObject2 );


			scope.removeScope("websocket");


			// parameters
			assert.equal( scope.getParameters("config2.browser.navigator"), "Chrome" );
			scope.setParameters("config2.browser.navigator", "Firefox");

			assert.equal( global.scope.getParameters("config2.browser.navigator"), "Firefox" );
			scope.setParameters("config2.browser.navigator", "Chrome");

			scope.setParameters("config2.browser.nodefony", "1.0.1");
			assert.equal( scope.getParameters("config2.browser.nodefony"), "1.0.1" );

			assert.equal( global.scope.getParameters("config2.browser.nodefony"), "1.0.1" );


			
			done();
		});

		it("Leave and remove Scope ", function(done){

			global.scope.removeScope("response");
			assert.deepEqual( global.scope.scope.response , undefined );

			global.globalContainer.leaveScope(global.scope);
			assert.deepEqual( global.scope.scope.request , {} );
			

			global.globalContainer.removeScope("request");
			assert.deepEqual( global.globalContainer.scope.request , undefined );
			done();

		});

		it("After remove scope ", function(done){
			var service = global.globalContainer.get( "myService")
			assert.deepEqual ( service.getConfig(), { foo:"bar"}) ;

			assert.deepEqual( global.globalContainer.getParameters("config"), service.getConfig() )
			assert.equal( global.globalContainer.getParameters("config.foo"), "bar" );

			// parameters
			global.globalContainer.setParameters("config2", service.getConfig2() );
		
			assert.equal( global.globalContainer.getParameters("config2.browser.navigator"), "Chrome" );

			global.globalContainer.setParameters("config2.browser.navigator", "Firefox");
			assert.equal( global.globalContainer.getParameters("config2.browser.navigator"), "Firefox" );

			done();
		});

	});

});

