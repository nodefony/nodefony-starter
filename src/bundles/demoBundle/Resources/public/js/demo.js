/**
 * * * * *
 * KERNEL *
 * * * * * 
 */

//== Kernel
stage.appKernel.prototype.initializeLog = function(settings){
	var syslog =  new stage.syslog(settings);
	
	syslog.listenWithConditions(this,{
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

	syslog.listenWithConditions(this,{
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

	return syslog ;
}

var App = new stage.appKernel( "dev", {
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

