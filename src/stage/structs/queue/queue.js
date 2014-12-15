/**
 * ===============================================================================
 *
 *  Copyright © 2010 CAMENSULI Christophe   | ccamensuli@gmail.com
 *
 * ===============================================================================
 *
 *  This file is part of StageBox Project .
 *
 *    StageBox is free software; you can redistribute it and/or modify
 *    it under the terms of the GNU Lesser General Public License as published by
 *    the Free Software Foundation; either version 2 of the License, or
 *    (at your option) any later version.
 *
 *    StageBox is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU Lesser General Public License for more details.
 *
 *    You should have received a copy of the GNU Leaser General Public License
 *    along with StageBox; if not, write to the Free Software
 *    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 *
 * ================================================================================
 *
 * created by cci
 *	
 *
 * Changes :
 * =========
 *
 * 2010-01-08 : creation of the file
 * ---------------------------------------------------------
 *
 *
 * File description :
 * ==================
 *
 * this file is the queue part. 
 *
 *  EVENTS QUEUE : 
 *	onQueued(queue) :	// fire when add value to queue
 *	onDeQueued(queue) :	// fire when add value to queue
 *	onRunStart:(queue)	// fire when begin to run along the queue
 *	onRunFinish:(queue)	// fire when finish to run along the queue
 *	onError(queue, error, errorCode):	// fire when an error 
 *
 *  ERROR CODES :
 *	0 : 	empty
 *	1 :	notFound
 *	2 :	stopped
 *
 *  SETTINGS : default
 *	type : "FIFO"  // "LIFO"
 *
 */

/* Depandances PROVIDE :
 * =====================
 */
stage.provide("structs.queues");
 /*
 * Depandances REQUIRE : 
 * =====================    
 */
stage.require("structs");



stage.register.call(stage.structs, "queues" , function(){

	var defaultSettings = {
		type:"FIFO",	
		active:true
	};


	var codeError = {
		empty:0,
		notFound:1,
		stopped:2
	}


	var struct = function(localSettings){
		// Manage settings
		this.settings = stage.extend( true, {}, defaultSettings, localSettings);
		this.data = [];
		this.error= null;
		this.eventsQueue = stage.createEventsManager();
	};

	struct.prototype.listen = function(context, eventName, callback){
		return this.eventsQueue.listen(context, eventName, callback);
	};
	
	// TODO LIFO
	struct.prototype.enqueue = function(value){
		if (this.settings.active){
			var ret = this.data.push(value);
			this.eventsQueue.fireEvent("onQueued",this);
			return ret;
		}else{
			this.error = new Error("QUEUE is stoped");
			this.eventsQueue.fireEvent("onError",this, this.error, codeError.stopped);
			return null;
		}
	};
	
	
	struct.prototype.remove = function(data){
		if (this.isEmpty()) {
			this.error = new Error("QUEUE is empty")
			this.eventsQueue.fireEvent("onError",this, this.error, codeError.empty);
			return null;
		}
		if (stage.array.contain(this.data, data) )
			return stage.array.remove(this.data, data)
		this.error = new Error(data+" Not found");
		this.eventsQueue.fireEvent("onError",this, this.error, codeError.notFound);
		return null;
	};

	// TODO LIFO
	struct.prototype.dequeue = function(){
		if (this.settings.active){
			if (this.isEmpty()) {
				this.error = new Error("QUEUE is empty")
				this.eventsQueue.fireEvent("onError",this, this.error, codeError.empty);
				return null;
			}
			var value = this.data[0];
			stage.array.removeIndexOf(this.data,0);
			this.eventsQueue.fireEvent("onDeQueued",this);
			return value;
		}else{
			this.error = new Error("QUEUE is stoped")
			this.eventsQueue.fireEvent("onError",this, this.error, codeError.stopped);
			return null;
		}
	};

	struct.prototype.peek = function(data){
		if (this.isEmpty()) {
			return null;
		}
		return this.data[0];
	};

	struct.prototype.purge = function(){
		this.data.length = 0;
	};

	struct.prototype.isEmpty = function(){
		return this.data.length === 0;
	};

	struct.prototype.count = function(){
		return this.data.length;
	};

	struct.prototype.getQueue = function() {
		return this.data;
	};

	struct.prototype.start= function() {
		this.settings.active = true;
	};
	struct.prototype.stop= function(){
		this.settings.active = false;
	};

	struct.prototype.run= function(callback) {
		if (this.settings.active){
			this.eventsQueue.fireEvent("onRunStart",this);
			stage.each(this.data,callback)
			this.eventsQueue.fireEvent("onRunFinish",this);
		}else{
			this.error = new Error("QUEUE is stoped")
			this.eventsQueue.fireEvent("onError",this, this.error, codeError.stopped);
			return null;
		}
	};

	var createStruct = function(localSettings){
		var Structs = new struct(localSettings);	
		Structs.eventsQueue.settingsToListen(localSettings)	
		if(Structs.error){			
			Structs.eventsQueue.fireEvent("onError", Structs, Structs.error);
			return Structs;
		}	
		return Structs;
	}

	return {
		
		struct:struct,

		local:{
			createQueue:function(localSettings){
				if (! localSettings)
					localSettings = {};
				return createStruct(localSettings)
			}
		}
	}

});

