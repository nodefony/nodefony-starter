/*
 *	The MIT License (MIT)
 *	
 *	Copyright (c) 2015/2015  | 
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

nodefony.registerBundle ("sequelize", function(){

	/**
	 *	The class is a **`sequelize` BUNDLE** .
	 *	@module App
	 *	@main App
	 *	@class sequelize
	 *	@constructor
	 *	@param {class} kernel
	 *	@param {class} container
	 *	
	 */
	var sequelize = class sequelize  extends nodefony.Bundle {

		constructor (name, kernel, container){

			super( name, kernel, container);
			// load bundle library 
			this.autoLoader.loadDirectory(this.path+"/core");
			
			/*
		 	*	If you want kernel wait sequelizeBundle event <<onReady>> 
		 	*
		 	*      this.waitBundleReady = true ; 
		 	*/	
			this.waitBundleReady = true ; 

			var service =  this.get("sequelize");
			service.listen(this, "onOrmReady",() => {
				this.fire("onReady", this, service);	
			});
		};
	};

	return sequelize;
});
