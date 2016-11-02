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


	var loginController = function(container, context){
		this.mother = this.$super;
		this.mother.constructor(container, context);
	};
	
	/**
 	 *
 	 *	DEMO login  
 	 *
 	 */
	loginController.prototype.loginAction= function(type){
		switch(type){
			case "passport-local":
				return this.render("demoBundle:login:login.html.twig",{type:type});
			break;
			default:
				return this.render("frameworkBundle::401.html.twig")
		}
	};



	/**
 	 *
 	 *	DEMO login sasl basic 
 	 *
 	 */
	loginController.prototype.loginSaslBasicAction= function(){
		return this.render("demoBundle:login:login");
	};


	/**
 	 *
 	 *	DEMO login SASL digest 
 	 *
 	 */
	loginController.prototype.loginSaslDigestAction= function(){
		return this.render("demoBundle:login:login");
	};


	/**
 	 *
 	 *	DEMO login passport basic 
 	 *
 	 */
	loginController.prototype.loginSaslBasicAction= function(){
		return this.render("demoBundle:login:login");
	};


	/**
 	 *
 	 *	DEMO login passport digest 
 	 *
 	 */
	loginController.prototype.loginSaslDigestAction= function(){
		return this.render("demoBundle:login:login");
	};

	
	return loginController;
});

