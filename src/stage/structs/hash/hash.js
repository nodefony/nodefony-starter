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
 *  EVENTS HASH : 
 *
 *  ERROR CODES :
 *	0 : 	empty
 *	1 :	notFound
 *	2 :	stopped
 *
 *  SETTINGS : default
 *
 */

/* Depandances PROVIDE :
 * =====================
 */
stage.provide("structs.hash");
 /*
 * Depandances REQUIRE : 
 * =====================    
 */
stage.require("structs");


stage.register.call(stage.structs, "hash" , function(){


	var struct = function(data){
		this.data = stage.typeOf(data) === "object" ? stage.extend(true, {}, data) : {} ;
	};

	struct.prototype.get = function(key){
		if ((key === null) || (key === undefined))
			return this.data;
		if ( (key in this.data))
			return this.data[key];
		return false;
	};

	struct.prototype.set = function(key, value){
		if ((key !== null) || (key !== undefined))
			return this.data[key] = value;
		return false;
	};

	struct.prototype.unset = function(key){
		if (key in this.data){
			delete this.data[key];
			return true
		}
		return false;
	};

	struct.prototype.hasKey = function(key){
		if (key in this.data)
			return true;
		return false;
	};

	struct.prototype.clear = function(){
		this.data = {};
		return true;
	};
	
	struct.prototype.clone = function(){
		return stage.extend(true, {}, this.data);
	};

	//TODO
	struct.prototype.inspect = function(){
		
	};

	//TODO
	struct.prototype.keys = function(){
	};

	//TODO
	struct.prototype.values = function(){
	};

	struct.prototype.each = function(){
		if (stage.browser.Ie){
			return function(callback){
				var iterator = 0;
				for (var key in this.data) {
					//if ( ! Array.prototype[key] ){
					if ( this.data.hasOwnProperty(key) ){
						var value = this.data[key]; 
						var pair = [key, value];
						pair.key = key;
						pair.value = value;
						callback(pair, iterator);
					}
					iterator++;
				}
			}
		}else{
			return function(callback){
				var iterator = 0;
				for (var key in this.data) {
					var value = this.data[key]; 
					var pair = [key, value];
					pair.key = key;
					pair.value = value;
					callback(pair, iterator);
					iterator++;
				}
			}
		}
		
	}();

	//TODO
	struct.prototype.clone = function(){
		return  new struct(this.data);
	};

	struct.prototype.toObject = function(key){
		return stage.extend(true, {}, this.data) ;
	};


	//TODO
	struct.prototype.merge = function(hash){
		this.data = stage.extend(true, {}, this.data, hash) ;
	};

	//TODO
	struct.prototype.toJson = function(key){
		if (key)
			return stage.json.stringify(this.get(key));
		return stage.json.stringify(this.data);
	};

	//TODO
	struct.prototype.toQueryString = function(){

	};

	return {
		struct:struct,
		local:{
			createHash:function(data){
				return new struct(data);
			}
		}
	}
});


