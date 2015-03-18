/*
 *
 *	HTTP BASIC  FACTORY	
 *
 *
 *
 */

nodefony.register.call(nodefony.security.factory, "http_basic",function(){

	var Factory = function(contextSecurity, settings){
		this.name = this.getKey();
		this.provider = contextSecurity.provider ;
	};

	Factory.prototype.getKey = function(){
		return "http_basic";
	};

	Factory.prototype.getPosition = function(){
		return "http";
	};

	Factory.prototype.handle = function(container, context, type){
	
	}

	return Factory ;

});

