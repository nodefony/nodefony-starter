/**
 * New node file
 */


fifoTask = function(){};

fifoTask.prototype.init = function() {
	this._fifo = [];
	this._lastCallback;
	return this;
};

fifoTask.prototype.add = function(callback_p) {
	this._fifo.push(callback_p);
	if(this._fifo.length == 1){
		this._fifo[0]();
	}
};

fifoTask.prototype.setEndCallback = function(callback_p) {
	this._lastCallback = callback_p;
};

fifoTask.prototype.next = function() {

	this._fifo.shift();
	if(this._fifo.length > 0){
		this._fifo[0]();
	} else {
		if(this._lastCallback){
			this._lastCallback();
			this._lastCallback = undefined;
		}
	}
};