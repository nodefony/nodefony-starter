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
			this.production = true;
			this.UglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
				compress: this.production // compress only in production build
			});

			try {
				this.compiler = webpack({
  					// Configuration Object
					context: this.kernel.rootDir ,
					devtool: this.kernel.debug ? "inline-sourcemap" : null,
					entry: "./app/appKernel.js",
					output: {
						path: this.kernel.rootDir + "/web/assets",
						//filename: "appKernel.min.js"
						filename: "[name].min.js",
					},
					plugins: [this.UglifyJsPlugin]
				});
			}catch(e){
				throw e;
			}

			/*this.compiler.run( (err, stats) => {
				if (err){
					throw err
				}
				const info = stats.toJson();
				var error = stats.hasErrors()
				if ( error ) {
					this.logger(info.errors ,"ERROR")
				}else{
					this.logger( stats.toString({
  						// Add console colors
  						colors: true
					}), "DEBUG");
					if (stats.hasWarnings()) {
						this.logger(info.warnings ,"WARNING")
					}
				}
			});*/
		}
	}

	return  webpackService ;
});
