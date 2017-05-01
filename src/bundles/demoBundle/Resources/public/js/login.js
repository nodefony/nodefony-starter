module.exports = function (){

	var handleLoginPageChangeBackground = function() {
		$('[data-click="change-bg"]').on('click', function() {
        		var targetImage = '[data-id="login-cover-image"]';
        		var targetImageSrc = $(this).find('img').attr('src');
        		var targetImageHtml = '<img src="'+ targetImageSrc +'" data-id="login-cover-image" />';

        		$('.login-cover-image').prepend(targetImageHtml);
        		$(targetImage).not('[src="'+ targetImageSrc +'"]').fadeOut('slow', function() {
            			$(this).remove();
        			});
        		$('[data-click="change-bg"]').closest('li').removeClass('active');
        		$(this).closest('li').addClass('active');
    		});
	};

	/* 05. Handle Page Load - Fade in
   	------------------------------------------------ */
	var handlePageContentView = function() {
    		"use strict";
    		$.when($('#page-loader').addClass('hide')).done(function() {
        		$('#page-container').addClass('in');
    		});
	};

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
					text: pdu.payload
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
	var kernel = new stage.appKernel("dev", {
		debug: true,
	        router:false,

		onBoot:function(kernel) {
			this.login = new stage.login(this, $("#login"));
		},
		onDomLoad: function() {
			try {
				handleLoginPageChangeBackground();
			}catch(e){
				console.log(e)
			}
		},
		onDomReady: function() {

			var error = $("#error");
			if (error.length) {
				var message = error.html();
				$("#error").remove();
				if ( message !== "Missing credentials" ){
					this.logger(message, "ERROR" ) ;
				}
			}

			var adduser = $("#adduser").html();
			if (adduser) {
				$("#adduser").remove();
				this.logger(adduser, "INFO" ) ;
			}

			switch(loginType){
				case "passport-local":
				break;
				case "nodefony-sasl":
					var path = $("#login").attr("action");
					$("#passwd").bind("focus", function(){
						this.login.request( path) ;
					}.bind(this));
					this.login.request( path) ;

					$("#login").bind("submit",function(e){

						var username = $("#email").val();
						var password = $("#passwd").val();
						if (! username || ! password)
							return false;
						if (this.login.authenticate){
							this.login.authenticate.register(username, password);
						}
						//e.preventDefault();
						//return false;
					}.bind(this))
				break;
				default:
					this.logger("FACTOY AUTHENTICATION : loginType NOT EXIST");

			}
			handlePageContentView()
		}
	});
	return kernel ;
}();
