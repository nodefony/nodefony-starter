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

	uglifyjs2.prototype.filter = function(file  ,done){
		switch (nodefony.typeOf( file.path ) ){
			
			case "string" :
				try {
					var path = [file.path];
					var result = this.engine.processFiles( path, { maxLineLen: 500, expandVars: true } );
					return done(null, result) ;
				}catch(error){
					 return done (error, null )  ;
				}
			break;
			default :
				return done(  new Error("Service  uglifycss FILTER bad path type  ") , null);
			
		}
	}


	return uglifyjs2 ;


});
