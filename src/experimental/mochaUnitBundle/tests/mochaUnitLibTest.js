/**
 * New node file
 */


describe("Test de la lib de test de Mocha", function(){

	var assert = chai.assert;
	
	describe('Test de présence', function(){
	
		it('#nodefony.mocha', function(){
			//console.log(kernel.get('ORM2'));
			//console.log(nodefony.mocha.libTest);
			//console.log(nodefony.mocha.libTest.decToBin);
			assert.equal(typeof(nodefony.mocha), 'object', "Error : nodefony.mocha is not an object (" + typeof(nodefony.mocha) + ")");
		});
		
		it('#nodefony.mocha.libTest', function(){
			assert.equal(typeof(nodefony.mocha.libTest), 'object', "Error : nodefony.mocha.libTest is not an object (" + typeof(nodefony.mocha.libTest) + ")");
		});
		
		it('#nodefony.mocha.libTest.decToBin', function(){
			assert.equal(typeof(nodefony.mocha.libTest.decToBin), 'function', "Error : nodefony.mocha.libTest.decToBin is not a function (" + typeof(nodefony.mocha.libTest.decToBin) + ")");
		});
		
		it('#nodefony.mocha.libTest.binToDec', function(){
			assert.equal(typeof(nodefony.mocha.libTest.binToDec), 'function', "Error : nodefony.mocha.libTest.binToDec is not a function (" + typeof(nodefony.mocha.libTest.binToDec) + ")");
		});
	
	});
	
	describe('Test d\'exécution', function(){
		
		it('#decToBin ', function(){
			var result = nodefony.mocha.libTest.decToBin(12);
			assert.equal(result, '1100', "Error : nodefony.mocha.libTest.decToBin does\'nt work : decToBin(12) = " + result + " in place of 1100");
		});
	
		it('#binToDec ', function(){
			var result = nodefony.mocha.libTest.binToDec('1100');
			assert.equal(result, '12', "Error : nodefony.mocha.libTest.binToDec does\'nt work : binToDec(1100) = " + result + " in place of 12");
		});
		
		/*it('#binToDec - Error ', function(){
			var result = nodefony.mocha.libTest.binToDec('1000');
			assert.equal(result, '12', "Error : nodefony.mocha.libTest.binToDec does\'nt work : binToDec(1000) = " + result + " in place of 12");
		});*/
	});
});

//console.log(this);
