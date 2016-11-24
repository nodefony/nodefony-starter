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
 *
 *   	
 */




const assert = require('assert');

describe("NODEFONY KERNEL", function(){
	
	describe('LIBRARY', function(){


		beforeEach(function(){
		})
		
		before(function(){
		
		})

		it("NAMESPACE LOADED", function(done){
			// check nodefony namespace
			assert.equal( typeof nodefony, "object" );
			done();
		});

		it("INSTANCE KERNEL LOADED", function(done){
			// check instance kernel 
			assert.equal( kernel instanceof nodefony.kernel, true)
			done();
		});


	});
});
