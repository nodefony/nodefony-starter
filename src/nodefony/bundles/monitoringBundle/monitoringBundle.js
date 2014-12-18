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

nodefony.registerBundle ("monitoring", function(){

	/**
	 *	The class is a **`monitoring` BUNDLE** .
	 *	@module NODEFONY
	 *	@main NODEFONY
	 *	@class monitoring
	 *	@constructor
	 *	@param {class} kernel
	 *	@param {class} container
	 *	
	 */
	var monitoring = function(kernel, container){

		// load bundle library 
		//this.autoLoader.loadDirectory(this.path+"/core");

		this.mother = this.$super;
		this.mother.constructor(kernel, container);

		/*
		 *	If you want kernel wait monitoringBundle event <<onReady>> 
		 *
		 *      this.waitBundleReady = true ; 
		 */	
		
			this.kernel.listen(this, "onBoot", function(){
				if ( this.container.getParameters("bundles."+this.name).debugBar) {
					this.logger("ADD DEBUG BAR MONITORING", "WARNING")
					this.kernel.listen(this, "onRequest",function(context){
						context.listen(this, "onView", function(result, context){
							//context.response.body = context.response.body.replace("</body>","MONO VIER </body>") ;
							var View = this.container.get("httpKernel").getView("monitoringBundle::footerMonitoring.html.twig");
							this.get("templating").renderFile(View, {},function(error , result){
								context.response.body = context.response.body.replace("</body>",result+"\n </body>") ;
							})
						})
					})
				}
			}.bind(this));
	};

	return monitoring;
});
