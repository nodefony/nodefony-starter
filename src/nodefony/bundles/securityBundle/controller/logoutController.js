

nodefony.registerController("logout", function(){

	var logoutController = class logoutController extends nodefony.controller {

		constructor(container, context){
			super(container, context);
		}

		logoutAction (){
			
			if ( this.context.session ){
				var security = this.context.session.getMetaBag("security") ;
				if ( ! security ){
					this.context.session.invalidate() ;
					return this.redirect( "/" , null, true);	
				}
				switch ( security.factory){
					case "passport-basic" :
					case "passport-digest":
					case "http_basic":
					case "http_Digest":
						this.getRequest().request.headers.authorization = "";
						this.getResponse().setHeader("WWW-Authenticate", "");
						this.get("security").getSecuredArea(security.firewall).factory.handle(this.context, () => {
							var formlogin = this.get("security").getSecuredArea(security.firewall).formLogin ;
							this.context.session.invalidate() ;
							if ( formlogin ){
								this.getRequest().setUrl(formlogin);
								this.getResponse().statusCode = 401 ;
								this.notificationsCenter.fire("onResponse", this.getResponse() , this.context);
								return ;
							}	
							return this.redirect( "/" , null, true);
							this.notificationsCenter.fire("onResponse", this.getResponse() , this.context);
						});
						return ;
				}
				try {
					var formlogin = this.get("security").getSecuredArea(security.firewall).formLogin ;
					this.context.session.invalidate() ;
					if ( formlogin ){
						return this.redirect( formlogin , null, true);
					}	
				}catch(e){
					this.logger(e,"ERROR");
					this.context.session.invalidate() ;
					return this.redirect( "/" , null, true);	
				}
			}

			return this.redirect( "/" );
		}
	}
	return logoutController ;
});
