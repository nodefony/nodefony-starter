/*
 * 
 * 
 *    
 * 
 * 
 */
const webpack = require("webpack");


nodefony.registerService("webpack", function(){

	
	//https://webpack.js.org/api/node/
	var webpackService = class webpackService extends nodefony.Service {

		constructor(container){
			super ("webpack", container);

			try {
				this.compiler = webpack({
  					// Configuration Object
					context: this.kernel.rootDir ,
					devtool: this.kernel.debug ? "inline-sourcemap" : null,
					entry: ".web/js/scripts.js",
					output: {
						path: this.kernel.rootDir + "/web/assets",
						filename: "scripts.min.js"
					}
				}, (err, stats) => {
					console.log(stats.toString({
  						// ...
  						// Add console colors
  						colors: true
					}) )
  					//console.log(stats)
				});
			}catch(e){
				console.log(e)
				throw e;
			}

			console.log( this.compiler );
		}

	}



	return  webpackService ;

});
