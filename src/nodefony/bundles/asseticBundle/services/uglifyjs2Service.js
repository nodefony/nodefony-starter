/*
 *
 *
 *
 *
 *
 */


nodefony.registerService("uglifyjs2", function(){


	var uglifyjs2 = function(kernel, container){

		this.kernel = kernel ;
		this.container = container ;
		this.engine = require("uglify-js") ;
		this.name = "uglifyjs2";
	
	}

	uglifyjs2.prototype.filter = function(path ){
		var options = {};
		switch (nodefony.typeOf( path ) ){
			case "array" :
			case "string" :
				try {
					var result = this.engine.minify( path, options );
					return result.code ;
				}catch(error){
					throw error ;
				}
			break;
			default :
				throw  new Error("Service  uglifyjs2 FILTER bad path type  ");
			
		}
	}


	return uglifyjs2 ;


});
