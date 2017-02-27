/*
 * 
 * 
 *    
 * 
 * 
 */
const webpack = require("webpack");


nodefony.registerService("webpack", function(){

	var myRule = {
        	test: /\.jsx?$/,
        	include: [
			path.resolve(__dirname, "app")
        	],
        	exclude: [
			path.resolve(__dirname, "app/demo-files")
        	]
        	// these are matching conditions, each accepting a regular expression or string
        	// test and include have the same behavior, both must be matched
        	// exclude must not be matched (takes preferrence over test and include)
        	// Best practices:
        	// - Use RegExp only in test and for filename matching
        	// - Use arrays of absolute paths in include and exclude
        	// - Try to avoid exclude and prefer include

        	//issuer: { test, include, exclude },
        	// conditions for the issuer (the origin of the import)

        	enforce: "pre",
        	enforce: "post",
        	// flags to apply these rules, even if they are overridden (advanced option)

        	loader: "babel-loader",
        	// the loader which should be applied, it'll be resolved relative to the context
        	// -loader suffix is no longer optional in webpack2 for clarity reasons
        	// see webpack 1 upgrade guide

        	options: {
          		presets: ["es2015"]
        	},
		// options for the loader
      	}

	
	//https://webpack.js.org/api/node/
	var webpackService = class webpackService extends nodefony.Service {

		constructor(container){
			super ("WEBPACK", container);
			this.production = true;
			try {
				this.UglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
					compress: this.production // compress only in production build
				});
			}catch(e){
				throw e;
			}
			try {
				this.compiler = webpack({
  					// Configuration Object
					context: this.kernel.rootDir ,
					devtool: this.kernel.debug ? "inline-sourcemap" : false,
					entry: "./app/appKernel.js",
					output: {
						path: this.kernel.rootDir + "/web/assets",
						//filename: "appKernel.min.js"
						filename: "[name].min.js",
					},
					plugins: [this.UglifyJsPlugin],
					loader: [
						"babel",
						"eslint"
					],
					module: {
						rules: []
					}
				});
			}catch(e){
				throw e;
			}

			this.compiler.run( (err, stats) => {
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
			});
		}
	}

	return  webpackService ;
});
