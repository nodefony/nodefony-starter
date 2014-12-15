/**
 * New node file
 */

depends('/mochaUnitBundle/js/demo/fifoTask.js');

describe("Test de la classe \"fifoTask\"", function(){
	
	var myFifo;
	
	before(function(){
		myFifo = (new fifoTask()).init();
    });
	
	it('Verification de l\'instentiation', function(){
		assert.isDefined(myFifo._fifo, "Param _fifo is defined"); 
		assert.isArray(myFifo._fifo, "Param _fifo is an array"); 
	});
	
	describe('Test de fonctionnement des méthodes', function(){
		
		it('fifoTask.add', function(done){
			this.timeout(5000);
			myFifo.add(function(){
				assert.equal(myFifo._fifo.length, 1, 'Bon nombre de callback');
				setTimeout(function(){
					myFifo.next();
				}, 2000);
			});
			myFifo.add(function(){
				assert.equal(myFifo._fifo.length, 1, 'Bon nombre de callback : 1 : ' + myFifo._fifo.length);
				setTimeout(function(){
					myFifo.next();
					done();
				}, 2000);
			});
		});
		
		it('Verification _fifo is empty', function(){
			assert.equal(myFifo._fifo.length, 0, 'Bon nombre de callback : 0 : ' + myFifo._fifo.length);
		});
	});

});