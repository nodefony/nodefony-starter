/*
 *	The MIT License (MIT)
 *	
 *	Copyright (c) 2013/2014 cci | christophe.camensuli@nodefony.com
 *
 *	Permission is hereby granted, free of charge, to any person obtaining a copy
 *	of this software and associated documentation files (the 'Software'), to deal
 *	in the Software without restriction, including without limitation the rights
 *	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *	copies of the Software, and to permit persons to whom the Software is
 *	furnished to do so, subject to the following conditions:
 *
 *	The above copyright notice and this permission notice shall be included in
 *	all copies or substantial portions of the Software.
 *
 *	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *	THE SOFTWARE.
 */


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

	

	defaultController.prototype.indexAction = function(userName, message){
		switch( this.getRequest().method ){
			case "GET":
				return this.render("webRtcBundle::index.html.twig",{title:"WEBRTC",userName:userName});
			break;
			case "WEBSOCKET":
				var service = this.get("webrtc");
				var context = this.getContext();
				if ( message){
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
