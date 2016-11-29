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

nodefony.registerController("login", function(){

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
	};
	
	return loginController;
});
