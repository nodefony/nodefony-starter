/**
 * New node file
 */


//mocha.setup('bdd');

depends('/mochaUnitBundle/js/demo/string.js');
depends('/mochaUnitBundle/js/demo/base64.js');
depends('/mochaUnitBundle/js/demo/md5.js');

describe("Prototypage de méthodes sur l'objet natif \"String\"", function(){

	var stringTest = 'couscous';
	
	describe('Test de présence des méthodes ajoutées', function(){
		
		beforeEach(function(){
			stringTest = 'couscous';
	    });
		
		it('#ucfirst', function(){
			assert.notTypeOf(stringTest.ucfirst, 'undefined', "ucfirst is not a method of class String");
		});
		
		it('#uniqueId', function(){
			assert.notTypeOf(stringTest.uniqueId, 'undefined', "uniqueId is not a method of class String");
		});
		
		it('#basename', function(){
			assert.notTypeOf(stringTest.basename, 'undefined', "basename is not a method of class String");
		});
		it('#dirname', function(){
			assert.notTypeOf(stringTest.dirname, 'undefined', "dirname is not a method of class String");
		});
		it('#pad', function(){
			assert.notTypeOf(stringTest.pad, 'undefined', "pad is not a method of class String");
		});
		it('#strToDate', function(){
			assert.notTypeOf(stringTest.strToDate, 'undefined', "strToDate is not a method of class String");
		});
		it('#dateStrToSql', function(){
			assert.notTypeOf(stringTest.dateStrToSql, 'undefined', "dateStrToSql is not a method of class String");
		});
	});
	
	describe('Test de fonctionnement des nouvelles méthodes', function(){
		it('#ucfirst', function(){
			assert.equal(stringTest.ucfirst().charAt(0), String(stringTest.charAt(0)).toUpperCase(), "ucfirst not work");
		});
	});
	
	describe('Test de chargement des dépendences', function(){
		
		it('#md5', function(){
			assert.equal(typeof md5, 'function', "md5 Librarie not loaded");
		});
		
		it('#base64', function(){
			assert.equal(typeof base64_decode, 'function', "base64_decode function doesn't exist");
			assert.equal(typeof base64_encode, 'function', "base64_encode function doesn't exist");
		});
	});

});
