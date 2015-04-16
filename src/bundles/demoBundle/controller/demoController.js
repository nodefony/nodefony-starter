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
				this.renderAsync('demoBundle:orm:artists.html.twig',{name:"Artists", orm: data});
			}.bind(this));
		}catch(e){
			throw e
		}
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
	
		var files = this.getParameters("query.files");
	
		for (var file in files){
			files[file].move("/tmp/");
			//console.log( files[file].getExtention() )
			//console.log( files[file].getMimeType() )
			//console.log( files[file].realName() )
		}
		if ( ! this.isAjax() ){
			return this.forward("demoBundle:demo:indexDownload","/tmp");
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

	return demoController;
});

