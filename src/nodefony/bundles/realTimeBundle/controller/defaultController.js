/*
 *
 *
 *
 *	CONTROLLER default
 *
 *
 *
 *
 **/

nodefony.registerController("default", function(){

	var realTimeController =  class realTimeController extends nodefony.controller {

		constructor (container, context){
			super(container, context);
		};

		/**
 		* 
 		*
 		**/
		indexAction (message){
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
	};

	return realTimeController ;
});
