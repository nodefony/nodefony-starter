/*
 *
 *
 *
 *	Response websocket
 *
 *
 *
 */




nodefony.register("wsResponse",function(){


	var Response = function(connection){
		this.connection = connection ;
		this.body = "";
		this.statusCode = this.connection.state;
		this.config = this.connection.config ;
		this.webSocketVersion = this.connection.webSocketVersion ;
	};

	
	Response.prototype.send = function(data){
		//console.log(data)
		this.connection.send(data);
		this.body = "";
	};

	Response.prototype.clean = function(){
		delete this.connection ;	
		delete this.body ;
	}



	return Response;

});
