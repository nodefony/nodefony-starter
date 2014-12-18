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
		
	};

	/**
 	 *	@see renderView
 	 *	@see getResponse
 	 *
 	 */
	demoController.prototype.renderviewAction= function(name){
		var content = this.renderView('demoBundle:Default:index.html.twig',{name:"bgg"});
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
	demoController.prototype.userAction= function(name, message){
		var users = this.get('ORM2').getEntity('user');
		var user = users.find({ username: name },function(err, user){
			if (err)
				return this.render('demoBundle:Default:user.html.twig',{name:name,error:err});
			return this.render('demoBundle:Default:user.html.twig',{name:name,user:user});

		}.bind(this)) ;
	};

	/**
 	 *
 	 *	@see REST  usage 
 	 *	@see ORM2 usage
 	 *	@see ENTITY usage 
 	 *	@see SQLITE usage connection
 	 *
 	 */
	demoController.prototype.usersAction= function(name, message){
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
	};

	/**
 	 *
 	 *	@see ORM2 usage 
 	 *	@see MYSQL usage connection
 	 *	@see ORM2 execQuery usage
 	 *
 	 */
	demoController.prototype.getArticlesAction= function(name, message){
		var orm = this.get('ORM2').getConnection('conn2');
		if ( ! orm){
			throw {
				message:"conn2 is not available "
			}
		}
		orm.driver.execQuery('select * from article_translation', function(err, data){
			if (err){
				//this.logger(err);
				throw err;
			}
			return this.render('demoBundle:Default:index.html.twig',{name:name, orm: data});
		}.bind(this));
	};

	/**
 	 *
 	 *	@see render
 	 *
 	 */
	demoController.prototype.demoMobileAction= function(name){
		return this.render('demoBundle:Default:indexMobile.html.twig',{name:name});
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


	/*
 	 *
 	 *	For dev client
 	 *
 	 */
	demoController.prototype.devAction= function(name){

		return this.render('demoBundle::indexDev.html.twig');

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
			//this.notificationsCenter.fire("onResponse", "Hello");
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




	demoController.prototype.uploadAction = function(){
	
		//var req = this.get('context').request;
		console.log( this.getParameters("query.files") )
		/*if(nodefony.typeOf(req.queryFiles['fichier[]']) == 'array'){
			for(var i = 0; i < req.queryFiles['fichier[]'].length; i++){
				var file = req.queryFiles['fichier[]'][i];
				if(file.isValid()) file.move('/tmp/');
			}
		} else {
			var file = req.queryFiles['fichier[]'];
			if(file.isValid()) file.move('/tmp/');
		}*/
		return this.redirect(this.generateUrl("dev"));
	};




	return demoController;
});

