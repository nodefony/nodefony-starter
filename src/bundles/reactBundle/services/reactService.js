/*
 * 
 * 
 *    
 * 
 * 
 */

var React = require('react');
var ReactDOMServer = require('react-dom/server');
var beautifyHTML = require('js-beautify').html;
var _escaperegexp = require('lodash.escaperegexp');

nodefony.registerService("react", function(){

	var DEFAULT_OPTIONS = {
  		doctype: '<!DOCTYPE html>',
		beautify: true,
		transformViews: true,
		babel: {
			presets:["react","es2015"],
			only:/views\/react/,
		}
	};

	var reactService = class reactService extends nodefony.Service {

		constructor(container){
			super ("React", container);
			this.registered = false;
			this.moduleDetectRegEx;

			//Expose renderFile to controller
			nodefony.controller.prototype.renderJsx = (filename, options , cb) => {
				/*if ( ! options ){
					options = {};
				}
				if ( ! options.settings ){
					options.settings = {};
					options.settings.views = /views\/react/ ;
					options.settings.extensions = [".es6", ".es", ".jsx", ".js"];
				}else{
					if ( ! options.settings.views ){
						options.settings.views = /views\/react/ ;	
					}
					options.settings.extensions = [".es6", ".es", ".jsx", ".js"];
				}*/
				return this.renderFile(filename, options , cb);
			}
			
			this.babelCore = require("babel-core") ;
			this.babelRegister = require('babel-register');

			this.kernel.listen(this, "onBoot", () => {
				var bundles = this.kernel.getBundles();
				this.reactBundle = bundles.react;
				if (this.reactBundle){
					this.engineOptions = nodefony.extend( {}, DEFAULT_OPTIONS, this.reactBundle.settings.engineOptions || {})
				}
				if ( this.engineOptions.transformViews ){
					this.core = this.babelCore.transform("code", this.engineOptions.babel ) ;
					console.log(this.core)
				}
				for (var bundle in bundles){
					if (bundles[bundle].views.react){
						//console.log(bundles[bundle].views.react)
					}
				}
			})
		}

		renderFile (filename, options, cb) {
    			// Defer babel registration until the first request so we can grab the view path.
    			if (!this.moduleDetectRegEx) {
      				// Path could contain regexp characters so escape it first.
      				//this.moduleDetectRegEx = new RegExp('^' + _escaperegexp(options.settings.views));
    			}
    			/*if (this.engineOptions.transformViews && !this.registered) {
      				// Passing a RegExp to Babel results in an issue on Windows so we'll just
      				// pass the view path.
      				this.babelRegister(
        				nodefony.extend( {}, {only: options.settings.views}, this.engineOptions.babel)
      				);
      				this.registered = true;
    			}*/

			var markup = "" ;
    			try {
      				var component = require(filename);
      				// Transpiled ES6 may export components as { default: Component }
      				component = component.default || component;
      				markup += ReactDOMServer.renderToStaticMarkup(
        				React.createElement(component, options)
      				);
    			} catch (e) {
      				return cb(e);
    			} finally {
      				if (this.kernel.environment === 'dev') {
        				// Remove all files from the module cache that are in the view folder.
        				Object.keys(require.cache).forEach((module) =>  {
          					if (this.engineOptions.babel.only.test(require.cache[module].filename)) {
							console.log(module)
            						delete require.cache[module];
          					}
        				});
      				}
    			}
    			if (this.engineOptions.beautify) {
      				// NOTE: This will screw up some things where whitespace is important, and be
      				// subtly different than prod.
      				markup = beautifyHTML(markup);
    			}
    			cb(null, markup);
  		}
	}

	return reactService ;

});
