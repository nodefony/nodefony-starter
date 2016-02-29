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

	uglifyjs2.prototype.filter = function(file ){
		var options = {};
		switch (nodefony.typeOf( file.path ) ){
			case "array" :
			case "string" :
				try {
					var result = this.engine.minify( file.path, options );
					return result.code ;
				}catch(error){
					throw  error ;
				}
			break;
			default :
				reject(  new Error("Service  uglifyjs2 FILTER bad path type  ") );
			
		}
	}


	return uglifyjs2 ;


});
