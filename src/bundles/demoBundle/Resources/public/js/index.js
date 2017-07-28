require("../clean/js/jquery.parallax-1.1.3.js");
require("../clean/js/jquery.sticky.js");

//css
require( '../clean/css/simple-line-icons.css');
require ('../clean/css/animate.css');

/**
 * * * * *
 * KERNEL *
 * * * * *
 */
module.exports = function (){
	//== overload Kernel logger
	stage.appKernel.prototype.initializeLog = function(settings){

		this.syslog.listenWithConditions(this,{
			severity:{
				data:"ERROR,INFO"
			}
		},function(pdu){
			if (pdu.payload.stack ){
					console.error( "SYSLOG " + pdu.severityName +" " + pdu.msgid + " "+new Date(pdu.timeStamp) + " " + pdu.msg+" : "+  pdu.payload.stack);
			}else{
				$.gritter.add({
					title: "NODEFONY " + pdu.severityName ,
					text: pdu.payload,
					image: '/frameworkBundle/images/nodefony-logo.png',
					class_name:"gritter-light"

				});
			}
		});

		this.syslog.listenWithConditions(this,{
			severity:{
				data:"CRITIC,WARNING,DEBUG "
			}
		},function(pdu){
			switch( pdu.severityName){
				case "CRITIC" :
					console.error( "SYSLOG " + pdu.severityName +" " + pdu.msgid + " "+new Date(pdu.timeStamp) + " " + pdu.msg+" : "+ pdu.payload);
				break;
				case "WARNING" :
					console.warn ("SYSLOG " + pdu.severityName +" " + pdu.msgid + " "+new Date(pdu.timeStamp) + " " + pdu.msg+" : "+ pdu.payload);
				break;
				case "DEBUG" :
					console.log( "SYSLOG " + pdu.severityName +" " + pdu.msgid + " "+new Date(pdu.timeStamp) + " " + pdu.msg+" : "+ pdu.payload);
				break;
			}
		});

		return this.syslog ;
	}

	window["appKernel"]  = new stage.appKernel( "dev", {
		debug: true,
	        router:false,
		location:false,
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

			var error = $("#error").html();
			if (error) {
				$("#error").remove();
				this.logger(error, "ERROR" ) ;
			}

			var adduser = $("#adduser").html();
			if (adduser) {
				$("#adduser").remove();
				this.logger(adduser, "INFO" ) ;
			}


			/* ---------------------------------------------- /*
		 	* Navbar
			/* ---------------------------------------------- */

			$('.header').sticky({
				topSpacing: 0
			});

			/*$('body').scrollspy({
				target: '.navbar-custom',
				offset: 70
			})*/


			/* ---------------------------------------------- /*
		 	* Smooth scroll / Scroll To Top
			/* ---------------------------------------------- */

			/*$('a[href*=#]').bind("click", function(e){

				var anchor = $(this);
				$('html, body').stop().animate({
					scrollTop: $(anchor.attr('href')).offset().top
				}, 1000);
				e.preventDefault();
			});*/

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
			
		}
	});

	return appKernel ;
};
