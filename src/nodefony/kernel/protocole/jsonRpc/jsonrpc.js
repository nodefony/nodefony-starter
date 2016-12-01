/*
 *
 *
 *
 *
 *
 *
 */

nodefony.register.call(nodefony.io.protocol, "json-rpc",function(){

	var jsonrpc = class extends nodefony.io.protocol.reader {

		constructor (rootName, settings){
		
			super(null, {
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
			
		};

		methodError (error, id){
			var ele = nodefony.extend({}, this.response , {
				error:error,
				id:id
			});	
			return this.builderResponse(ele) ;
		};

		methodSuccees (result, id){
			var ele = nodefony.extend({}, this.response , {
				result:result,
				id:id
			});	
			return this.builderResponse(ele) ;
		};

		onMessage (message){
			switch (nodefony.typeOf(message) ) {
				case "string" :
					var ret = null ;	
					this.parser(message, (err, mess) => {
						if (err)
							throw err ;
						ret = this.onMessage(mess) ;	
					});
					return ret ;
				break;
				case "object" :
					return message;
				break;
				default :
					throw new Error ("JSONRPC message bad format ");

			}
		};
	}

	return jsonrpc ;
})
