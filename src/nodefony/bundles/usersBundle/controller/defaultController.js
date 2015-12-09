
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


		defaultController.prototype.connectAction = function(login){
			return this.render('usersBundle::connect.html.twig',{
				security:this.context.user,
			        login:login ? true : false 
			});
		};

		defaultController.prototype["401Action"] = function(error){
			var res = nodefony.extend( {url:this.context.url}, error);
			return this.render('frameworkBundle::401.html.twig', res );
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
