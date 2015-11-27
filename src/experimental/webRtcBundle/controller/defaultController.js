

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
					login:this.context.user.name + " " + this.context.user.surname,
					nodefony:kernel.settings.name + " " + kernel.settings.system.version
				});
			break;
			case "WEBSOCKET":
				var service = this.get("webrtc");
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

	defaultController.prototype.navAction = function(login){

		return this.render('webRtcBundle::navBar.html.twig',{
			security:this.context.user,
			login:login ? login : false, 
			
		});	
	}

	defaultController.prototype.indexAction = function(userName, message){
		switch( this.getRequest().method ){
			case "GET":
				return this.render("webRtcBundle::index.html.twig",{title:"WEBRTC",userName:userName});
			break;
			case "WEBSOCKET":
				var service = this.get("webrtc");
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
	};

	/**
	*
	*	@method demoAction
	*
	*/
	defaultController.prototype.demoAction = function(userName, message){
		//console.log(arguments)
		switch( this.getRequest().method ){
			case "GET":
				return this.render("webRtcBundle::demo.html.twig",{title:"WEBRTC",userName:userName});
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
