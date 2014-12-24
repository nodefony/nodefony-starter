var monitoring = (function(jQuery){

	
	var monitoring = function(){
		this.debugContent = null ;
		this.debugBar = null ;
		$(document).ready(this.ready.bind(this));
		this.hide = true ;
	};



	monitoring.prototype.ready = function(){
		this.debugContent = $(".debugContent");	
		this.debugBar = $(".debugBar");	
		this.body = $("body")
		$("#monitorToggle").click(this.toggle.bind(this));
	};

	monitoring.prototype.toggle = function(){
		$(".debugContent").toggle();
		if ( this.hide){
			this.body.css("overflow-y","hidden")
			this.hide = false ;	
		}else{
			this.body.css("overflow-y","auto")
			this.hide = true ;	
		}

	};

	return new monitoring();
}(jQuery))
