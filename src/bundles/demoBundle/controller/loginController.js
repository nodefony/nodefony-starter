/*
 *
 *
 *
 *	CONTROLLER login
 *
 *
 *
 *
 */

module.exports = nodefony.registerController("login", function(){

	var loginController = class loginController extends nodefony.controller {

		constructor(container, context){
			super(container, context);
		};

		/**
 	 	*
 	 	*	DEMO login
 	 	*
 	 	*/
		loginAction (type){
			var log = this.context.session.getFlashBag("session") ;
			if ( log ){
				log["login"] = true ;
			}else{
				log = {login :true};
			}
			var error  = this.context.session.getFlashBag("error") ;
			if (error){
				log["error"]=  error ;
			}

			if ( ! log ){
				log = {} ;
			}

			switch(type){
				case "nodefony-sasl":
					log.type= type ;
					return this.render("demoBundle:login:login.html.twig", log );
				break;
				case "passport-local":
					log.type= type ;
					return this.render("demoBundle:login:login.html.twig", log );
				break;
				default:
					return this.render("frameworkBundle::401.html.twig", log)
			}
		};

		subscribeAction (){
			if ( ! this.context.session ){
				this.startSession("default", (error, session) => {
					if (error){
						throw error ;
					}
					var log  = session.getFlashBag("session") ;

					if ( log ){
						log.login = true ;
					}else{
						log = {login :true};
					}
					error  = session.getFlashBag("error");
					if (error){
						log.error = error ;
					}
					var adduser  = session.getFlashBag("adduser");
					if ( adduser){
						log.adduser = adduser ;
					}
					this.renderAsync('demoBundle:login:subscribe.html.twig',log);
				});
			}else{
				var log = this.context.session.getFlashBag("session") ;
				if ( log ){
					log.login = true ;
				}else{
					log = {login :true};
				}
				var error  = this.context.session.getFlashBag("error") ;
				if (error){
					log.error=  error ;
				}
				var adduser  = this.context.session.getFlashBag("adduser") ;
				if ( adduser){
					log.adduser = adduser ;
				}
				return this.render('demoBundle:login:subscribe.html.twig',log);
			}
		}
	};

	return loginController;
});
