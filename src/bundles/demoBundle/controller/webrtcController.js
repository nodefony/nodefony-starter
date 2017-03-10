nodefony.registerController("webrtc", function(){



	

	var webrtcController = class webrtcController extends nodefony.controller {

		constructor(container, context){
			super(container, context);
		}

		configAction(){
			var apiParams = this.getParameters('bundles.demo.webrtc');
			var server = apiParams.server ;
			var api = null ;
			switch ( server ){
				case "kamailio":
					var api = {
						server:	server,
						user:	apiParams.user,
						webrtc: apiParams.config,
						sip:apiParams.serversSip[server]
					};
				break;
				case "nodefony":
					var api = {
						server:	server,
						user:	apiParams.user,
						webrtc: apiParams.config,
						sip:apiParams.serversSip[server]
					};
				break;
				default:
					return this.createNotFoundException("API WEBRTC : " + apiParams.server + " not found check config file" );
			}
			var user = this.getUser();
			if ( user ){
				api.user.displayName = user.displayName ;
				api.user.publicIdentity = user.username ;
			}	
			if (this.request.isAjax() ){
				return this.renderJson(api);
			}else{
				return this.render("demoBundle:webrtc:config.html.twig", {api:api} );
			}
		}

		diagAction(){
			var apiParams = this.getParameters('bundles.demo.webrtc');
			var server = apiParams.server ;
			var api = null ;
			switch ( server ){
				case "kamailio":
					var api = {
						server:	server,
						user:	apiParams.user,
						webrtc: apiParams.config,
						sip:apiParams.serversSip[server]
					};
				break;
				case "nodefony":
					var api = {
						server:	server,
						user:	apiParams.user,
						webrtc: apiParams.config,
						sip:apiParams.serversSip[server]
					};
				break;
				default:
					return this.createNotFoundException("API WEBRTC : " + apiParams.server + " not found check config file" );
			}
			
			var user = this.getUser();
			if ( user ){
				api.user.displayName = user.displayName ;
				api.user.publicIdentity = user.username ;
			}
			return this.render("demoBundle:webrtc:diag.html.twig", {api:api} );
		}

	};
	
	return webrtcController ; 
});
