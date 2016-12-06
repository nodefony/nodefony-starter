/*
 *
 *
 *
 *
 *
 */


nodefony.registerService("uglifycss", function(){


	var uglifyjs2 = class uglifyjs2 extends nodefony.Service {

		constructor (kernel, container){
			
			super( "uglifycss" ,container, container.get("notificationsCenter") );
			this.kernel = kernel ;
			this.engine = require("uglifycss") ;
		
		}

		filter (file  ,done){
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
	};


	return uglifyjs2 ;


});
