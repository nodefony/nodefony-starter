/**
 * * * * *
 * KERNEL *
 * * * * * 
 */

//== Kernel
var App = new stage.appKernel(null, "dev", {
	debug: true,
	location:{
		html5Mode:false
	},
	onLoad:function(){

		/* ---------------------------------------------- /*
		 *		Preloader
		/* ---------------------------------------------- */
		$('#status').fadeOut();
		$('#preloader').delay(300).fadeOut('slow');

	},

	onBoot:function() {
		
	},
	onReady: function() {
	},

	onDomLoad: function() {


		/* ---------------------------------------------- /*
		 * Navbar
		/* ---------------------------------------------- */

		$('.header').sticky({
			topSpacing: 0
		});

		$('body').scrollspy({
			target: '.navbar-custom',
			offset: 70
		})


		/* ---------------------------------------------- /*
		 * Smooth scroll / Scroll To Top
		/* ---------------------------------------------- */

		$('a[href*=#]').bind("click", function(e){
           
			var anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: $(anchor.attr('href')).offset().top
			}, 1000);
			e.preventDefault();
		});

		$(window).scroll(function() {
			if ($(this).scrollTop() > 100) {
				$('.scroll-up').fadeIn();
			} else {
				$('.scroll-up').fadeOut();
			}
		});

		/* ---------------------------------------------- /*
		 * Home BG
		/* ---------------------------------------------- */

		$(".screen-height").height($(window).height());

		$(window).resize(function(){
			$(".screen-height").height($(window).height());
		});

		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
			$('#home').css({'background-attachment': 'scroll'});
		} else {
			$('#home').parallax('50%', 0.1);
			//$('#demo').parallax('50%', 0.1);
		}

		/* ---------------------------------------------- /*
		 * WOW Animation When You Scroll
		/* ---------------------------------------------- */

		wow = new WOW({
			mobile: false
		});
		wow.init();

		/* ---------------------------------------------- /*
		 * LANG IN URL CHANGE
		/* ---------------------------------------------- */
		$("#langs").bind("change",function(){
			window.location.href = "?lang="+$(this).val();
		})

	}


});

