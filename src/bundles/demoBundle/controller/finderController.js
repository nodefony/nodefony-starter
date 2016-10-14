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
							this.renderAsync('demoBundle:finder:index.html.twig',{
								title:"Finder",
								files:files.json
							});
						}.bind(this)
					});
				break;
				case "File" :
					switch (file.mimeType) {
						case "text/plain":
							this.renderAsync('demoBundle:finder:files.html.twig',{
								content:file.content(file.encoding),
								mime:file.mimeType,
								encoding:file.encoding
							});	
						break;
						case "text/x-markdown":
							var res = this.htmlMdParser(file.content(file.encoding),{
								linkify: true,
								typographer: true	
							});
							this.renderAsync('demoBundle:finder:files.html.twig',{
								title:file.name,
								content:res,
								mime:file.mimeType,
								encoding:file.encoding
							});
						break;
						default:
							encode.call(this, file);	
					}
				break;
			}
			//if (! response ) throw new Error("Search File system Error")
			//return response ;
		}catch(e){
			throw e ;
		}
	};

	
	var encode = function(file){
		switch (true) {
			
			case /^image/.test(file.mimeType):
			case /^video/.test(file.mimeType):
			case /^audio/.test(file.mimeType):
			case /application\/pdf/.test(file.mimeType):
				try {
					this.renderMediaStream( file );
					
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
					this.renderFileDownload(file) ; 
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
			var path =  this.get("kernel").rootDir+"/src/bundles/demoBundle/Resources/images" ;
		else
			var path = query.get.path ;

		// secure path
		console.log( )
		//var securePath = this.get("kernel").rootDir ;
		var securePath = this.get("kernel").getBundles("demo").path ;
		var reg = new RegExp( "^"+securePath )
		if ( ! reg.test(path)){
			throw {
				status:401
			}
			//var path =  this.get("kernel").rootDir+"/src/bundles/demoBundle/Resources/images"	
		}

		try{ 
			search.call(this, path) ;
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

