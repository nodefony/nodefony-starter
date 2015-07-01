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


nodefony.registerController("default", function(){

		/**
		 *	The class is a **`default` CONTROLLER** .
		 *	@module App
		 *	@main App
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


		/**
		 *
		 *	@method indexAction
		 *
		 */
		defaultController.prototype.indexAction = function(){
			// markdown read and parse readme.md
			try {
				var path =  this.get("kernel").rootDir+"/src/experimental//sequelizeBundle/readme.md";	
				var file = new nodefony.fileClass(path);
				var res = this.htmlMdParser(file.content(file.encoding),{
					linkify: true,
					typographer: true	
				});
				return this.render("sequelizeBundle::index.html.twig",{readme:res});
			}catch(e){
				return this.forward("frameworkBundle:default:system",{view: "sequelizeBundle::index.html.twig",bundle:this.getParameters("bundles.sequelize")});
			}
		};

		
		return defaultController;
});
