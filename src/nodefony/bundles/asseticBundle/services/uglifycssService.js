/*
 *
 *
 *
 *
 *
 */


nodefony.registerService("uglifycss", function(){


	var uglifyjs2 = function(kernel, container){

		this.kernel = kernel ;
		this.container = container ;
		this.engine = require("uglifycss") ;
		this.name = "uglifycss";
	
	}

	uglifyjs2.prototype.filter = function(path , file){
		switch (nodefony.typeOf( path ) ){
			case "array" :
				try {
					var result = this.engine.processFiles( path, { maxLineLen: 500, expandVars: true } );
					return result ;
				}catch(error){
					throw error ;
				}
			break;
			case "string" :
				try {
					path = [path];
					var result = this.engine.processFiles( path, { maxLineLen: 500, expandVars: true } );
					return result ;
				}catch(error){
					throw error ;
				}
			break;
			default :
				throw  new Error("Service  uglifycss FILTER bad path type  ");
			
		}
	}


	return uglifyjs2 ;


});
