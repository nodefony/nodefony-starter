/*
 *
 *
 *
 *
 *
 *
 */

nodefony.register.call(nodefony.io.protocol, "json-rpc",function(){

	var jsonrpc = function(rootName, settings){
	
		this.proto = this.$super;
		this.proto.constructor(null, {
			extention:"json"
		});

		this.request = {
			jsonrpc: "2.0",
			method:null,
			params:null,
			id:null
		};

		this.response = {
			jsonrpc: "2.0",
			result:null,
			error:null,
			id:null
		};
		
	}.herite(nodefony.io.protocol.reader);


	jsonrpc.prototype.methodError = function(error, id){
		var ele = nodefony.extend({}, this.response , {
			error:error,
			id:id
		});	
		return this.builderResponse(ele) ;
	};

	jsonrpc.prototype.methodSuccees = function(result, id){
		var ele = nodefony.extend({}, this.response , {
			result:result,
			id:id
		});	
		return this.builderResponse(ele) ;
	};


	jsonrpc.prototype.onMessage = function(message){
		switch (nodefony.typeOf(message) ) {
			case "string" :
				var ret = null ;	
				this.parser(message, function(err, mess){
					if (err)
						throw err ;
					ret = this.onMessage(mess) ;	
				}.bind(this));
				return ret ;
			break;
			case "object" :
				return message;
			break;
			default :
				throw new Error ("JSONRPC message bad format ");

		}
	};

	return jsonrpc ;
})
