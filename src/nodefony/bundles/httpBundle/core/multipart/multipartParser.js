/*
 *
 *
 *
 *
 */

nodefony.register.call(nodefony.io, "MultipartParser",function(){


	// PHP LIKE
	var reg = /(.*)[\[][\]]$/


	var multiPartParser = function(request){
		this.post = {};
		this.file = {} ;
		this.error = null ;
		this.parse(request);
	};

	multiPartParser.prototype.parse = function(request){
	
		if ( !  request.rawContentType.boundary ){
			throw new Error('multiPartParser  : Bad content-type header, no multipart boundary');

		}
		var boundary = '\r\n--' + request.rawContentType.boundary.replace('"',"")
		//console.log(boundary)
		var isRaw = typeof(request.body) !== 'string';

		var s = null;
		if ( isRaw ) {
			s = request.body.toString('binary') ;	
		} else {
			s = body;
		}
		s = '\r\n' + s;

		var parts = s.split(new RegExp(boundary));
		var partsByName = {post: {}, file: {}};

		// loop boundaries  
		for (var i = 1; i < parts.length - 1; i++) {
			var obj = this.parseBoundary( parts[i], isRaw ) ;
			var name = obj.headers.filename ;
			if( obj.headers.filename ){
				this.file[name] = obj ;
	        	} else {
				this.post[name] = obj ;
	        	}
		}
	};

	var regHeaders = / |"/g;
	multiPartParser.prototype.parseBoundary = function(boundary, isRaw){
		var subparts = boundary.split('\r\n\r\n');
		var obj = {
			headers:{},
			data:null
		}

		//HEADERS
		var header = subparts[0];
		var headers = header.split('\r\n');
		//console.log(headers)
		for ( var i = 0 ; i<headers.length ;i++ ){
			if (headers[i]){
				var res = headers[i].split(";");
				for (var j = 0 ; j<res.length ; j++){
					var ret = res[j].split(/:|=/);
					obj.headers[ret[0].replace(regHeaders,"")] = ret[1].replace(regHeaders,"");
				}
			}
		}
		//DATA
		obj.data = subparts[1] ;
		return obj ;
	};

	 multiPartParser.prototype.rawStringToBuffer = function( str ) {
		var idx, len = str.length, arr = new Array( len );
		for ( idx = 0 ; idx < len ; ++idx ) {
			arr[ idx ] = str.charCodeAt(idx) & 0xFF;
		}
		return new Uint8Array( arr ).buffer;
	}

	 return multiPartParser ;

})
