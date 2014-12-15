

/**
*	@namespace stage.io.rest
*/

stage.register.call(stage.io, "rest",function(){

	var requests = {};
	
	var onSuccess = function(data, statusText, xhr){
		console.log(arguments);
		this.fire("onMessage", data, stage.io.getHeaderJSON(xhr), xhr);
		this.logger(stage.io.getHeaderJSON(xhr),"DEBUG");
	};
	
	var onError = function(xhr, statusText, message){
		this.fire("onError", message, stage.io.getHeaderJSON(xhr), xhr);
		this.logger(stage.io.getHeaderJSON(xhr),"DEBUG");
	};
	
	var defaultOptions = {
		multiple: false
	};
	
	var ajaxOptions = {
		cache: false,
		dataType: "json"
	};
	
	var logSettings = {
		moduleName: "stage.io.rest",
		maxStack: 100,
		rateLimit: false, 
		burstLimit: 3,
		defaultSeverity: "DEBUG",
		checkConditions: "&&",
		async: false
	};
	
	/*
	200: 'OK',
	201: 'CREATED',
	202: 'ACCEPTED',
	204: 'NO CONTENT',
	400: 'BAD REQUEST',
	401: 'NOT AUTHORIZED',
	403: 'FORBIDDEN',
	404: 'NOT FOUND',
	405: 'METHOD NOT ALLOWED',
	409: 'CONFLICT',
	500: 'INTERNAL SERVER ERROR',
	501: 'NOT IMPLEMENTED',
	503: 'SERVICE UNAVAILABLE'
	*/
	
	var rest = function(resource, options){
		this.options = stage.extend({}, defaultOptions, options);
		this.mother = this.$super;
		this.mother.constructor(logSettings);
		
		this.ajaxOptions = stage.extend({
			success: onSuccess.bind(this),
			error: onError.bind(this)
		}, ajaxOptions, this.options.globals);
		
		this.settingsToListen(this.options, this);

		if (! resource ){
			this.resource = stage.io.urlToOject(window.location.href);
			//console.log("PASSAGE");
			this.logger("Resource not defined, get window.location.href", "DEBUG", logSettings.moduleName);
		} else {
			this.resource = stage.io.urlToOject(resource);
		}

	}.herite(stage.syslog);
	
	/**
	 * @see http://api.jquery.com/jQuery.ajax/
	 */
	/*rest.prototype.get = function(uri, data, options) {
		options = (options || {});
		options.type = 'GET';
		options.data = (data || {});
		
		return $.ajax(
			this.resource.href + (uri + (data ? '/' + data : '') || ""), 
			stage.extend({}, this.ajaxOptions, options)
		);
	};*/
	
	
	rest.prototype.getRequest = function(reqId){
		return requests[reqId];
	};
	
	rest.prototype.abort = function(reqId){
		var keys = (reqId ? [reqId] : Object.keys(requests));
		if(keys.length > 0){
			requests[keys[keys.length - 1]].abort();
		}
	};
	
	rest.prototype.abortPrevRequest = function(){
		var keys = Object.keys(requests);
		if(keys.length > 1){
			requests[keys[keys.length - 2]].abort();
		}
	};
	
	rest.prototype.abortAllRequest = function(){
		var keys = Object.keys(requests);
		for(var i = keys.length; i >= 0; i--){
			requests[keys[i]].abort();
		}
	};
	
	var send = function(type, uri, data, options){
		
		options = (options || {});
		options.type = type;
		options.data = (data || {});
		
		var url = this.resource.href + (uri ? '/' + uri : '');
		var ajaxOptions = stage.extend({}, this.ajaxOptions, options);
		
		var time = (new Date()).getTime();

		var req = $.ajax(url, ajaxOptions).always(function(id){
			
			requests[id] = null;
			delete requests[id];
			
		}.bind(this, time));
		
		requests[time] = req;
		return time;
	};
	
	rest.prototype.setCrossDomain = function() {
		
	};
	
	rest.prototype.get = function(uri, data, options) {
		return send.call(this, 'GET', uri, data, options);
	};
	
	rest.prototype.post = function(uri, data, options){
		return send.call(this, 'POST', uri, data, options);
	};
	
	rest.prototype.put = function(uri, data, options){
		return send.call(this, 'PUT', uri, data, options);
	};
	
	rest.prototype.delete = function(uri, data, options){
		return send.call(this, 'DELETE', uri, data, options);
	};
	
	return rest;	
});
