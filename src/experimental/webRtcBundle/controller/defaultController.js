

nodefony.registerController("default", function(){

	/**
	*	The class is a **`default` CONTROLLER** .
	*	@module NODEFONY
	*	@main NODEFONY
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

	defaultController.prototype.webrtcAction = function(message){

		switch( this.getRequest().method ){
			case "GET":
				var url= this.getRequest().url.href ;
				var kernel = this.get("kernel") ;
				return this.render("webRtcBundle::webrtc.html.twig",{
					title:"DEMO WEBRTC", 
					url:url,
				        username:this.context.user.username,
					name:this.context.user.name + " " + this.context.user.surname,
					nodefony:kernel.settings.name + " " + kernel.settings.system.version,
					user:this.context.user
				});
			break;
			case "WEBSOCKET":
				var settings = this.getParameters("bundles.webRtc") ;
				switch ( settings.adapter.type ){
					case "redis" :
						var service = this.get("webrtcRedis");
					break;
					default:
						var service = this.get("webrtc");
						
				}
				
				var context = this.getContext();
				if ( message ){
					switch ( message.type ){
						case "utf8" :
							return service.handleMessage(message.utf8Data, context);
						break;
					}
				}else{
					return service.handleConnection(context);
				}
			break;
			default:
			break;
		}
	}
	
	/**
	*
	*	@method demoAction
	*
	*/
	defaultController.prototype.demoAction = function(userName, message){
		//console.log(arguments)
		var url= this.getRequest().url.href ;
				var kernel = this.get("kernel") ;
		switch( this.getRequest().method ){
			case "GET":
				return this.render("webRtcBundle::webrtcSip.html.twig",{
					title:"WEBRTC SIP DEMO",
					//userName:userName
					url:url,
				        username:this.context.user.username,
					name:this.context.user.name + " " + this.context.user.surname,
					nodefony:kernel.settings.name + " " + kernel.settings.system.version,
					user:this.context.user
				});
			break;
		}
	};

	/**
	*
	*	@method realTimeAction
	*
	*/
	defaultController.prototype.realTimeAction = function(message){
		var realtime = this.get("realTime");
		var context = this.getContext();
		switch( this.getRequest().method ){
			case "GET" :
				return this.getResponse("PING");
			break;
			case "POST" :
				return realtime.handleConnection(this.getParameters("query").request, context );	
			break;
			case "WEBSOCKET" :
				if (message){
					realtime.handleConnection(message.utf8Data, context );
				}
			break;
			default :
				throw new Error("REALTIME METHOD NOT ALLOWED")
		};
	};

		
	return defaultController;
});
