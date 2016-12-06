/*
 *
 *
 *
 *
 *
 */


nodefony.registerService("uglifyjs2", function(){


	var uglifyjs2 = class uglifyjs2 extends nodefony.Service {

		constructor (kernel, container){

			super( "uglifyjs2" ,container, container.get("notificationsCenter") )

			this.kernel = kernel ;
			this.engine = require("uglify-js") ;
		}

		filter (file , done){
			var options = {};
			switch (nodefony.typeOf( file.path ) ){
				case "array" :
				case "string" :
					try {
						var result = this.engine.minify( file.path, options );
						return done( null, result.code ) ;
					}catch(error){
						return done( error, null ) ;
					}
				break;
				default :
					return done(  new Error("Service  uglifyjs2 FILTER bad path type  ") , null);
				
			}
		}
	};


	return uglifyjs2 ;


});
