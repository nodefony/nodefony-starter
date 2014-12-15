/**
 * New node file
 */
(function($){
	
	var assert = chai.assert;
	
	describe('Tests unitaires de manipulation du dom avec jQuery', function(){
		
		before(function(){
			$('body').append($('<div id="domRender"></div>'));
		});

		describe('Test de la balise vidéo', function(){
			
			before(function(){
				$('#domRender').append($('<video id="videoInTest"></video>'));
			});
			
			it('Test de la méthode "load"', function(){
				assert.isDefined($('#videoInTest')[0].load, 'La méthode load n\'est definie sur la balise vidéo');
			});
			
			it('Test de la méthode "play"', function(){
				assert.isDefined($('#videoInTest')[0].play, 'La méthode play n\'est definie sur la balise vidéo');
			});
			
			it('Test de la méthode "pause"', function(){
				assert.isDefined($('#videoInTest')[0].pause, 'La méthode pause n\'est definie sur la balise vidéo');
			});
			
			it('Test de la méthode "start"', function(){
				assert.isUndefined($('#videoInTest')[0].start, 'La méthode start est pas definie sur la balise vidéo');
			});
			
			after(function(){
				$('#videoInTest').remove();
			});
		});
		
		describe('Test ', function(){
			
			var posLeft;
			
			before(function(){
				$('#domRender').append($('<div id="animateDiv" style="width: 50px; height: 50px; background-color: #CECECE; position: relative; left: 10px;"></div>'));
				posLeft = $('#animateDiv').position().left;
			});
			
			it('Déplacement de 50px Left + opacity à 0.25', function(done){
				
				$('#animateDiv').animate({
				    opacity: 0.25,
				    left: '+=50'
				  }, 1000, function() {
					  var left = $('#animateDiv').position().left;
					  assert.equal(left, posLeft + 50, 'Déplacement left problème : ' + left + ' aurais du être : ' + (posLeft + 50));
					  var op = $('#animateDiv').css('opacity');
					  assert.equal(op, 0.25, 'La balise a une opacité de ' + op + ' au lieu de 0.25');
					  done();  
				  });
			});
			
			after(function(){
				$('#animateDiv').remove();
			});

		});

		after(function(){
			$('#domRender').remove();
		});
		
	});
	
})(jQuery);