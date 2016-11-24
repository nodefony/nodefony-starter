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
 */



const assert = require('assert');

describe("NODEFONY CORE FINDER", function(){
	
	describe('CONTRUSTROR ', function(){


		beforeEach(function(){
		})
		
		before(function(){
			try {
				global.finder = new nodefony.finder({
					path:kernel.rootDir
				});
			}catch(e){
				throw e;
			}
		})



		it("LIB LOADED", function(done){
			assert.equal( typeof nodefony.finder, "function" );
			done();
		});

		it("NEW", function(done){
			assert.equal( typeof nodefony.finder, "function" );
			
			assert.throws( function(){
				var finder = new nodefony.finder({
					path:"path not found "	
				})
			} );

			var finder = new nodefony.finder({})
			assert.equal(finder instanceof nodefony.finder , true);
			done();

		});

		it("PARSE ROOTDIR", function(done){

			var res = finder.find({
				recurse:false,
				onFinish:function(error, result){
					console.log("RESULT length :" + result.length());
					done();
				}	
			});

		});

		it("RESULT JSON", function(done){
			var res = finder.find({
				recurse:false,
				json:true,
				onFinish:function(error, result){
					console.log("RESULT length :" + result.length());
					//console.log(result.json.nodefony.children.web)	
				}	
			});

			var finderJson = new nodefony.finder({
				path:kernel.rootDir,
				json:true,
				recurse:true,
				onFinish:function(error, result){
					console.log("RESULT length :" + result.length());
					//console.log(result.json.nodefony.children.web)
					done();
				}.bind(this)
			});

			//console.log(finderJson.)

		})	


	});

});

