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
	demoController.prototype.indexAction= function(){
		var kernel = this.get("kernel") ;
		return this.render("demoBundle:Default:index.html.twig",{
			user: this.context.user,
			nodefony:kernel.settings.name + " " + kernel.settings.system.version
		});
	};

	/**
 	 *
 	 *	DEMO navbar 
 	 *
 	 */
	demoController.prototype.navAction = function(login){
		var webrtcBundle = this.get("kernel").getBundles("webRtc"); 
		return this.render('demoBundle:layouts:navBar.html.twig',{
			user: this.context.user,
			webrtc:webrtcBundle
		});	
	}

	/**
 	 *
 	 *	DEMO ORM ASYNC CALL WITH ENTITIES 
 	 *
 	 */
	demoController.prototype.sequelizeAction = function(){
		var orm = this.getORM() ;
		
		
		this.sessionEntity = orm.getEntity("session");
		this.userEntity = orm.getEntity("user");


		var sessions = null ; 
		var users = null ; 

		// SIMPLE ORM CALL RENDER WITH SEQUELIZE PROMISE
		/*this.sessionEntity.findAll()
		.then( function(results){
			sessions = results
		})
		.catch(function(error){
			throw error ;
		})
		.done(function(){
			return this.renderAsync('demoBundle:orm:artists.html.twig', {
				sessions:sessions,
			});
		}.bind(this))*/

		// MULTIPLE ORM CALL ASYNC RENDER WITH PROMISE 
		Promise.all([this.sessionEntity.findAll(), this.userEntity.findAll()] )
		.then(function(result){
			sessions = result[0];
			users = result[1];
		}).catch(function(error){
			throw error ;
		}).done(function(){
			this.renderAsync('demoBundle:orm:orm.html.twig', {
				sessions:sessions,
				users:users,
			});
		}.bind(this))

	}

	/**
 	 *
 	 *	DEMO ORM ASYNC CALL WITHOUT ENTITIES 
 	 *	SQL SELECT
 	 *
 	 */
	demoController.prototype.querySqlAction = function(){

		var orm = this.getORM() ;

		var nodefonyDb = orm.getConnection("nodefony") ;


		var users = null ;
		nodefonyDb.query('SELECT * FROM users')
		.then(function(result){
			users = result[0];
		}.bind(this))
		.done(function(){
			this.renderAsync('demoBundle:orm:orm.html.twig', {
				users:users,
			});
		}.bind(this))
	}

	/**
 	 *
 	 *	DEMO ORM ASYNC CALL WITHOUT ENTITIES 
 	 *	SQL WITH JOIN 
 	 *
 	 *
 	 */
	demoController.prototype.querySqlJoinAction = function(){

		var orm = this.getORM() ;

		var nodefonyDb = orm.getConnection("nodefony") ;

		var joins = null ;
		nodefonyDb.query('SELECT * FROM sessions S LEFT JOIN users U on U.id = S.user_id ')
		.then(function(result){
			joins = result[0];
			for (var i = 0 ; i < joins.length ; i++){
				joins[i].metaBag = JSON.parse( joins[i].metaBag )
			}
		}.bind(this))
		.done(function(){
			this.renderAsync('demoBundle:orm:orm.html.twig', {
				joins:joins,
			});
		}.bind(this))

	}

	/**
 	 *	@see renderView
 	 *	@see getResponse
 	 *
 	 */
	demoController.prototype.renderviewAction= function(name){
		var content = this.renderView('demoBundle:Default:index.html.twig',{name:"render"});
		return this.getResponse(content);
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
	demoController.prototype.indexUploadAction= function(){
		return this.render('demoBundle:demo:upload.html.twig');
	};

	demoController.prototype.uploadAction = function(){
	
		var files = this.getParameters("query.files");
		var path =  this.get("kernel").rootDir+"/src/bundles/demoBundle/Resources/images" ;	
		for (var file in files){
			if( files[file].error ){
				throw files[file].error ;
			}
			//files[file].move("/tmp/");
			files[file].move(path);
			//console.log( files[file].getExtention() )
			//console.log( files[file].getMimeType() )
			//console.log( files[file].realName() )
		}
		if ( ! this.isAjax() ){
			return this.forward("demoBundle:finder:index");
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

