/*
 *
 *
 *
 *	CONTROLLER finder
 *
 *
 *
 *
 */

nodefony.registerController("finder", function(){


	var search = function(path){
		var response = null; 
		try {
			var file = new nodefony.fileClass(path);
			switch (file.type){
				case "symbolicLink" :
				case "Directory" :
					var finder = new nodefony.finder({
						path:path,
						json:true,
						followSymLink:true,
						//seeHidden:true,
						recurse:false,
						onDirectory:function(File, finder){
							File.link = file.type;
						},
						onFile:function(File, finder){
							switch(File.mimeType){
								case "text/plain":
									File.link = "Link";
								break;
								default:
									File.link = "Download";
							};
						},
						onFinish:function(error, files){
							//console.log(files.json);
							response = this.render('demoBundle:finder:index.html.twig',{
								files:files.json
							});
						}.bind(this)
					});
				break;
				case "File" :
					switch (file.mimeType) {
						case "text/plain":
							return this.render('demoBundle:demo:files.html.twig',{
								content:file.content(file.encoding),
								mime:file.mimeType,
								encoding:file.encoding
							});	
						break;
						default:
							return encode.call(this, file);	
					}
				break;
			}
			if (! response ) throw new Error("Search File system Error")
			return response ;
		}catch(e){
			throw e ;
		}
	};

	var renderFileSync = function(file){
		var response = this.getResponse();
		var request = this.getRequest().request;

		try {
			var img = fs.readFileSync(file.path);
			response.writeHead(200, {
				'Content-Type': file.mimeType ,
				'Content-Disposition:' : ' inline; filename="'+file.name+'"'
			});
			response.end(img, 'binary');
		}catch(e){
			throw e ;
		}	
	};

	var encode = function(file){
		switch (true) {
			// stream
			/*case /^image/.test(file.mimeType):
				try{
					return renderFileSync.call(this, file);
				}catch(e){
					throw e ;
				}
			break;*/
			case /^image/.test(file.mimeType):
			case /^video/.test(file.mimeType):
			case /^audio/.test(file.mimeType):
			case /application\/pdf/.test(file.mimeType):
				try {
					return this.renderMediaStream( file );
					
				}catch(error){
					switch (error.code){
						case "EISDIR":
							error.message = file.path +" : is Directory" ;
						break;
					}
					throw error ;
				}
			break;
			// download
			default:
				try {
					return this.renderFileDownload(file) ; 
				}catch(error){
					switch (error.code){
						case "EISDIR":
							error.message = file.path +" : is Directory" ;
						break;
					}
					throw error ;
				}
		}
	};



	var finderController = function(container, context){
		this.mother = this.$super;
		this.mother.constructor(container, context);
	};


	
	finderController.prototype.indexAction = function(){
		var query = this.getParameters("query");
		if (! query.get.path)
			var path =  "/Users/cci/repository/demo/images" ;
		else
			var path = query.get.path ;

		//TODO secure path

		try{ 
			return search.call(this, path) ;
		}catch(e){
			throw e ;
		}
	};

	finderController.prototype.downloadAction = function(path){
		var query = this.getParameters("query");
		if (! query.get.path)
			throw new Error("Download Not path to host")
		else
			var path = query.get.path ;
		var file = new nodefony.fileClass(path);

		try {
			return encode.call(this, file);
		}catch(e){
			throw e;		
		}
	};

	return finderController ;

});

