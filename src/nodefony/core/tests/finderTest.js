/*
 *   New node file
 */


const assert = require('assert');

describe("NODEFONY CORE FINDER", function(){
	
	describe('CONTRUSTROR ', function(){

		it("LIB LOADED", function(done){
			assert.equal( typeof nodefony.finder, "function" );
			done();
		});

		it("NEW", function(done){
			assert.equal( typeof nodefony.finder, "function" );
			var finder = new nodefony.finder({
				path:"dslkdlsdks"	
			
			})
			//console.log(finder)
			done();
		});


	});


});

