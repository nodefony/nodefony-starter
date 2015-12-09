
nodefony.registerController("default", function(){

		/**
		 *	The class is a **`default` CONTROLLER** .
		 *	@module App
		 *	@main App
		 *	@class default
		 *	@constructor
		 *	@param {class} container   
		 *	@param {class} context
		 *	
		 */
		var defaultController = function(container, context){
			this.mother = this.$super;
			this.mother.constructor(container, context);
		};


		/**
		 *
		 *	@method indexAction
		 *
		 */
		defaultController.prototype.indexAction = function(){
			// markdown read and parse readme.md
			try {
				var path =  this.get("kernel").rootDir+"/src/nodefony/bundles/usersBundle/readme.md";	
				var file = new nodefony.fileClass(path);
				var res = this.htmlMdParser(file.content(file.encoding),{
					linkify: true,
					typographer: true	
				});
				return this.render("usersBundle::index.html.twig",{readme:res});
			}catch(e){
				return this.forward("frameworkBundle:default:system",{view: "usersBundle::index.html.twig",bundle:this.getParameters("bundles.users")});
			}
		};



		defaultController.prototype.connectAction = function(login){
			return this.render('usersBundle::connect.html.twig',{
				security:this.context.user,
			        login:login ? true : false 
			});
		};

		defaultController.prototype.loginAction = function(){
			if ( ! this.context.session ){
				this.startSession("default", function(error, session){
					if (error)
						throw error ;
					var log  = session.getFlashBag("session") ;
					if ( log )
						log["login"] = true ;
					else
						log = {login :true};
					this.renderAsync('usersBundle::login.html.twig',log);
				}.bind(this));
			}else{
				var log = this.context.session.getFlashBag("session") ;
				if ( log )
					log["login"] = true ;
				else
					log = {login :true};
				return this.render('usersBundle::login.html.twig',log);
			}
		};

		defaultController.prototype.logoutAction = function(){
			if (this.context.session)
				this.context.session.invalidate() ;
			return this.redirect("/login");
		};

		return defaultController;
});
