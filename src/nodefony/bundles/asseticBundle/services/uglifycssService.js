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

	uglifyjs2.prototype.filter = function(file ){
		switch (nodefony.typeOf( file.path ) ){
			
			case "string" :
				try {
					var path = [file.path];
					var result = this.engine.processFiles( path, { maxLineLen: 500, expandVars: true } );
					return result ;
				}catch(error){
					throw error  ;
				}
			break;
			default :
				reject(  new Error("Service  uglifycss FILTER bad path type  ") );
			
		}
	}


	return uglifyjs2 ;


});
