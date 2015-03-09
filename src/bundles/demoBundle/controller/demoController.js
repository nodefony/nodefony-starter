/*
 *
 *
 *
 *	CONTROLLER default
 *
 *
 *
 *
 */



nodefony.registerController("demo", function(){

	var demoController = function(container, context){
		this.mother = this.$super;
		this.mother.constructor(container, context);
	};

	/**
 	 *
 	 *	DEMO index 
 	 *
 	 */
	demoController.prototype.indexAction= function(module){
		return this.forward("frameworkBundle:default:system");
		//return this.forward("demoBundle:demo:dev");
	};


	/**
 	 *	@see renderView
 	 *	@see getResponse
 	 *
 	 */
	demoController.prototype.renderviewAction= function(name){
		var content = this.renderView('demoBundle:Default:index.html.twig',{name:"render"});
		return this.getResponse(content)
	};

	/**
 	 *	@see getResponse() with content
 	 *
 	 */
	demoController.prototype.htmlAction= function(name){
		var name = "nodefony";
		return this.getResponse('<html><script>alert("'+name+'")</script></html>');
	};

	/**
 	 *
 	 *	@see forward
 	 */
	demoController.prototype.forwardAction= function(){
		return this.forward("frameworkBundle:default:index")
	};
	
	/**
 	 *
 	 *	@see redirect
 	 */
	demoController.prototype.redirectGoogleAction= function(){
		return this.redirect("http://google.com");
	};

	/**
 	 *
 	 *	@see redirect with variables 
 	 *	@see generateUrl 
 	 */
	demoController.prototype.generateUrlAction = function(){
		return this.redirect ( this.generateUrl("user", {name:"cci"},true) );	
	};

	/**
 	 *
 	 *	@see ORM2 usage
 	 *	@see ENTITY usage 
 	 *
 	 */
	/*demoController.prototype.userAction= function(name, message){
		var users = this.get('ORM2').getEntity('user');
		var user = users.find({ username: name },function(err, user){
			if (err)
				return this.render('demoBundle:Default:user.html.twig',{name:name,error:err});
			return this.render('demoBundle:Default:user.html.twig',{name:name,user:user});

		}.bind(this)) ;
	};*/

	/**
 	 *
 	 *	@see REST  usage 
 	 *	@see ORM2 usage
 	 *	@see ENTITY usage 
 	 *	@see SQLITE usage connection
 	 *
 	 */
	/*demoController.prototype.usersAction= function(name, message){
		var users = this.get('ORM2').getEntity('user');

		switch( this.getRequest().method ){
			case "POST" :
				var session = this.get('ORM2').getEntity('session');
				var query = this.container.getParameters("query");  
				var userObj = new users({username: query.post.firstname, password: query.post.pwd, email: null, state: 1});
				userObj.save(function(err){
					if(err){ 
						console.log(err);
					}else{
						var obj = new session({last_access: new Date(), user_id: userObj.id});
						obj.save(function(err, session){
							if(err){
								return this.render('demoBundle:Default:user.html.twig',{name:name,session:null,error:err});
							}
							return this.redirect("/users");
						}.bind(this));
					}
				}.bind(this));
			break;
			case "GET" :
				var user = users.find({ },function(err, user){
					if (err)
						return this.render('demoBundle:Default:user.html.twig',{name:name,error:err});
					return this.render('demoBundle:Default:user.html.twig',{name:name,user:user});
				}.bind(this));
			break;
			case "DELETE" :
			break;
		}
	};*/

	/**
 	 *
 	 *	@see ORM2 usage 
 	 *	@see sqlite usage connection
 	 *	@see ORM2 execQuery usage
 	 *
 	 */
	demoController.prototype.ormConnectionAction= function(){
		var orm = this.get('ORM2').getConnection('demo');
		if ( ! orm){
			throw {
				message:"Connection demo is not available "
			}
		}
		try{
			orm.driver.execQuery('select * from Artist', function(err, data){
				if (err){
					throw err;
				}
				//setTimeout(function(){

					this.renderAsync('demoBundle:orm:artists.html.twig',{name:"Artists", orm: data});
				//}.bind(this) , 4000)
			}.bind(this));
		}catch(e){
			throw e
		}
	};

	/**
 	 *
 	 *	@see cookie
 	 *
 	 */
	demoController.prototype.demoTestAction= function(name){
		var context = this.getContext();
		//console.log(context)
		var cookie = new nodefony.cookies.cookie("test","wef",{
			maxAge:50000,
			domain:context.domain
		})
		var cookie2 = new nodefony.cookies.cookie("session","121212121",{
			maxAge:500000
		})

		//console.log(cookie)
		context.setCookie(cookie);
		context.setCookie(cookie2);

		//console.log(nodefony.session)
		var session = new nodefony.session(context, {
		
		})
		//console.log(session)

		return this.render('demoBundle:Default:indexMobile.html.twig',{name:name});
	};

	/**
	 *
	 *	For poll client
	 *
	 */
	demoController.prototype.pollAction = function(){
		//console.log(this.getRequest().headers['content-type']);
		//return this.render('demoBundle::indexDev.html.twig');
		if(this.getParameters("query").request.closeWef){
			process.exit(0);
		}
		
		setTimeout(function(){
			//console.log(this.getParameters("query").get);
			var type = /application\/(.*);/.exec(this.getRequest().headers['content-type'])[1];
			if(type == 'json'){
				var response = this.getParameters("query")['request'];
			} else {
				var xml = require('xml2js');
				var response = new xml.Builder().buildObject(this.getParameters("query")['post']);
			}
		
			this.renderResponse(
				response, 
				200, 
				{'Content-Type': 'application/' + type + '; charset=utf-8'}
			);
		}.bind(this), 4000);
	};

	/**
	 *
	 *	@method indexRealTimeAction
	 *
	 */
	demoController.prototype.indexRealTimeAction = function(){
		return this.render("demoBundle:realTime:index.html.twig",{title:"realTime"});			
	};


	/*
 	 *
 	 *	UPLOAD
 	 *
 	 */
	demoController.prototype.indexUploadAction= function(name){
		return this.render('demoBundle:demo:upload.html.twig');
	};

	demoController.prototype.uploadAction = function(){
	
		//var req = this.get('context').request;
		var files = this.getParameters("query.files");
	
		for (var file in files){
			files[file].move("/tmp/");
			//console.log( files[file].getExtention() )
			//console.log( files[file].getMimeType() )
			//console.log( files[file].realName() )
		}
		if ( ! this.isAjax() ){
			return this.redirect(this.generateUrl("index"));
		}else{
			return this.renderResponse(
					JSON.stringify({
						res : "ok"
					}), 
				200, 
				{'Content-Type': 'application/json; charset=utf-8'}
			);
		}
	};

	var encode = function(file){
		switch (true) {
			// stream
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
							response = this.render('demoBundle:demo:finder.html.twig',{
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

	/*
 	 *
 	 *	DOWNLOAD
 	 *
 	 */
	demoController.prototype.indexDownloadAction= function(name){
		var query = this.getParameters("query");
		if (! query.get.path)
			var path =  "./" ;
		else
			var path = query.get.path ;

		//TODO secure path

		try{ 
			return search.call(this, path) ;
		}catch(e){
			throw e ;
		}
	};

	demoController.prototype.downloadAction = function(path){
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

	return demoController;
});

