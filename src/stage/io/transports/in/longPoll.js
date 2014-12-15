/*
 * 
 *  
 *   
 * 
 * 
 * 
 * 
 * 
 * 
 */ 
stage.provide("longPoll");


stage.register.call(stage.io.transports, "longPoll",function(){

	var defaultSettings = {
		delay: 0,
		async: false,
		
		ajax: {
			cache: true,
			dataType: 'json',
			type: 'GET',
			contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
		}
	};
	
	var pollAction = function(ajaxConfig){
		ajaxConfig.data = this.data.get();
		this.transport = jQuery.ajax(ajaxConfig);
	};
	
	var pollling = function(ajaxConfig){
		
		if(this.settings.delay){
			this.timer = setTimeout(pollAction.bind(this, ajaxConfig), this.settings.delay);	
		} else {
			pollAction.call(this, ajaxConfig);
		}		
	};
	
	var longPoll = function(url, settings){
		//this.mother = this.$super;
		this.$super.constructor(url, settings);
		this.settings = stage.extend(true, {}, defaultSettings, settings);
		
		return this;
		
	}.herite(stage.io.transports.poll);
	
	
	longPoll.prototype.start = function(){
		
		var ajaxConfig = this.buildAjaxSettings();
	
		this.transport = null;
		ajaxConfig.complete = function(xhr, status){
			//if(this.transport) this.transport = null;
			pollling.call(this, ajaxConfig);
		}.bind(this);
		pollling.call(this, ajaxConfig);
			
		
		return this;
	};
	
	
	longPoll.prototype.stop = function(){

		this.transport.abort();
		this.transport = null;
		
		if(this.timer){
			clearTimeout(this.timer);
		}
		
		this.connectState = false;
		
		this.fire('onStop', this);
		return this;
	};

	return longPoll;

});
