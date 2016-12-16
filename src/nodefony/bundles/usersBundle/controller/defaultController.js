
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
	var defaultController = class defaultController extends nodefony.controller {

		constructor(container, context){
			super(container, context);
		}


		connectAction (login){
			return this.render('usersBundle::connect.html.twig',{
				security:this.context.user,
			        login:login ? true : false 
			});
		}

		["401Action"] (error){
			var res = nodefony.extend( {url:this.context.url}, error);
			this.getResponse().setStatusCode(401,"Unauthorized");
			return this.render('frameworkBundle::401.html.twig', res );
		}


		loginAction (){
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
					//this.getResponse().setStatusCode(401,"Unauthorized");
					this.renderAsync('usersBundle::login.html.twig',log);
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

				//this.context.session.clear();
				//this.getResponse().setStatusCode(401,"Unauthorized");
				return this.render('usersBundle::login.html.twig',log);
			}
		}

		logoutAction (){
			
			if ( this.context.session ){
				var security = this.context.session.getMetaBag("security") ;
				if ( ! security ){
					this.context.session.invalidate() ;
					return this.redirect( "/" );	
				}
				switch ( security.factory){
					case "passport-basic" :
					case "passport-digest":
					case "http_basic":
					case "http_Digest":
						this.getRequest().request.headers.authorization = "";
						this.get("security").getSecuredArea(security.firewall).factory.handle(this.context, () => {
							var formlogin = this.get("security").getSecuredArea(security.firewall).formLogin ;
							this.context.session.invalidate() ;
							if ( formlogin ){
								this.getRequest().setUrl(formlogin);
								this.getResponse().statusCode = 401 ;
								this.notificationsCenter.fire("onResponse", this.getResponse() , this.context);
								return ;
							}	
							return this.redirect( "/" );
						});
						return ;
				}
				try {
					var formlogin = this.get("security").getSecuredArea(security.firewall).formLogin ;
					this.context.session.invalidate() ;
					if ( formlogin ){
						return this.redirect( formlogin );
					}	
				}catch(e){
					this.context.session.invalidate() ;
					return this.redirect( "/" );	
				}
			}

			return this.redirect( "/" );
		}
	};

	return defaultController;
});
