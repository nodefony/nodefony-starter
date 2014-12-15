/*
 *
 *
 *
 *
 *	 SESSION
 *
 *
 *
 */

nodefony.register( "session", function(){


	var defaultSession = {
	
	}


	var session = function(context, settings){
		this.context = 	context ;
		this.settings = nodefony.extend({}, defaultSession, settings);
		this.cookie = new nodefony.cookies.cookie("test", "", this.settings);

	}



	return session ;


});

