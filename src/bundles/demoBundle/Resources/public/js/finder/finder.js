require("../../fancybox/jquery.fancybox.js");
require("../../flickity/flickity.pkgd.js");

require("../../flickity/flickity.css");
require("../../fancybox/jquery.fancybox.css");
require("../../css/finder/style.css");


module.exports = function (){

	$(document).ready(function () {
    		$('#slider').flickity({
		});

    		$('#slider').on('select.flickity', function (event, pointer) {
        		var preview = $('#slider .is-selected').attr("data-url");
        		var name = $('#slider .is-selected').attr("data-name");
        		var mine = $('#slider .is-selected').attr("data-mine");

        		$('#previews-container .name').empty();
        		$('#previews-container .name').text(name);

        		$('#previews-container .preview-container').empty();

			switch (true){
				case /^image/.test(mine) :
					$('#previews-container .preview-container').append('<img class="preview" src="'+preview+'">');
					break;
				case /^audio/.test(mine):
					var html = '<audio height="100%" controls="controls" prelaod="auto" >\n\
					<source src="'+preview+'" type="'+mine+'">\n\
                        		</audio>';

					$('#previews-container .preview-container').append(html);
				break;
				case /^video/.test(mine) :
					var html = '<video height="100%" controls prelaod="auto">\n\
					<source src="'+preview+'" type="'+mine+'">\n\
                			</video>';

					$('#previews-container .preview-container').append(html);
					/*var video = $(document.createElement("video"));
		  			$('#previews-container .preview-container').append(video);
		  			video.attr({
		  			type:mine,
		  			src:preview,
		  			height:"100%"
		  			});
		  			video.get(0).load();
		  			*/
				break;
				default:
					$('#previews-container .preview-container').append('<img class="preview" src="'+preview+'">');
			}
    		});

		$('#slider').flickity( 'select', 0 )

		/*$('.gallery-cell').hover(function() {
		 	var col = $(this).parent().children().index($(this));
		//setTimeout(function() {$('#slider').flickity( 'select', col )}, 500);

		});*/

 		$('tr').click(function () {
	 		//setTimeout(function() {
			//if ( dispo ){
			var col = $(this).parent().children().index($(this));
			$('#slider').flickity( 'select', col );
			//}
			//}.bind(this)
			//, 800);
         		//$('#slider').flickity( 'select', col )
		});

    		$(".image").fancybox({
          		helpers: {
              			title : {
                  			type : 'float'
              			}
          		}
      		});
	});
};
