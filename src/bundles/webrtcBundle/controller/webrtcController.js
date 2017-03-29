nodefony.registerController("webrtc", function(){

	var getConfig = function(apiParams ){
		var api = null ;
		var server = apiParams.server ;
		switch ( server ){
			case "kamailio":
				api = {
					server:	server,
					user:	apiParams.user,
					webrtc: apiParams.config,
					sip:apiParams.serversSip[server]
				};
			break;
			case "nodefony":
				api = {
					server:	server,
					user:	apiParams.user,
					webrtc: apiParams.config,
					sip:apiParams.serversSip[server]
				};
			break;
			default:
				throw new Error ("API WEBRTC : " + apiParams.server + " not found check config file" );
		}
		var user = this.getUser();
		if ( user ){
			api.user.displayName = user.displayName ;
			api.user.publicIdentity = user.username ;
		}
		return api ;
	};

	var webrtcController = class webrtcController extends nodefony.controller {

		constructor(container, context){
			super(container, context);
		}

		configAction(){
			try {
				this.getSessionConfig( (error, api) => {
					if (error ){
						throw error ;
					}
					if (this.request.isAjax() ){
						this.context.session.set(api.server, api);
						return this.renderJsonAsync(api);
					}else{

						switch ( this.request.method ){
							case "GET" :
								this.context.session.set(api.server, api);
								return this.renderAsync("webrtcBundle:webrtc:config.html.twig", {api:api} );
							break;
							case "POST" :
								if (this.query.changeApi ){
									var api  = this.context.session.get(this.query.server);
									if ( ! api ){
										api = this.getParameters('bundles.demo.webrtc');	
										api.server  = this.query.server ; 
										api = getConfig.call(this, api ) ;
									}
									return this.renderAsync("webrtcBundle:webrtc:config.html.twig", {api:api} );	
								}else{
									this.context.session.set(this.query.server, this.query);
									return  this.redirect( this.generateUrl("webrtc-config") );	
								}
							break;
						}
					}
				});
			}catch(e){
				this.createNotFoundException( e.message );	
			}
		}

		getSessionConfig ( callback) {
			var apiParams = this.getParameters('bundles.demo.webrtc');
			if ( ! this.context.session ){
				return this.startSession( "default" ).then( (session) =>{ 	
					try {
						return callback(null,  getConfig.call(this, apiParams) );
					}catch(e){
						return callback(e,  null );
					}	
				});
			}
			var conf = this.context.session.get(apiParams.server);
			if ( conf ){
				return callback(null, this.context.session.get(apiParams.server) );
			}else{
				return callback(null, getConfig.call(this, apiParams) );	
			}
		}

		diagAction(){
			var apiParams = this.getParameters('bundles.demo.webrtc');
			var server = apiParams.server ;
			var api = null ;
			if ( this.context.session ){
				api  = this.context.session.get(server);
			}else{
				api  = 	getConfig.call(this, apiParams );
			}
			return this.render("webrtcBundle:webrtc:diag.html.twig", {api:api} );
		}

	};
	
	return webrtcController ; 
});
