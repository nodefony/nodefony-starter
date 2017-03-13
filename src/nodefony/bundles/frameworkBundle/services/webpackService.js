/*
 * 
 * 
 *    
 * 
 * 
 */
const webpack = require("webpack");
const webpackMerge = require('webpack-merge'); // used to merge webpack configs



nodefony.registerService("webpack", function(){

	var myRule = {
        	test: /\.jsx?$/,
        	include: [
			path.resolve(__dirname, "app")
        	],
        	exclude: [],

        	loader: "babel-loader",

        	options: {
          		presets: ["es2015"]
        	}
      	};


	var defaultConfig = function(){
		return {
			// Configuration Object
			context:	this.kernel.rootDir,
			target:		"web",
			watch:		true,
			devtool:	this.production ? false : 'source-map',
			output:		{
				path:	this.kernel.rootDir+"/web"
			},
			externals:	{},
			resolve:	{},
			plugins:	[],
			module: {
				rules:	[]
			}
		}
	};
	
	//https://webpack.js.org/api/node/
	const webpackService = class webpackService extends nodefony.Service {

		constructor(container){
			super ("WEBPACK", container);
			this.production = true;
			this.defaultConfig = defaultConfig.call(this);
						
			/*this.compiler.run( (err, stats) => {
				this.loggerStat(err, stats);	
			});*/
		}

		loggerStat (err, stats){

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
		}

		loadConfig( config , path ){
						
			var myConf = webpackMerge( this.defaultConfig, config ) ;
			if ( path ){
				myConf.context = path ;
				myConf.output.path = path ;
			}
			this.logger( "LOAD CONFIG entry :" + myConf.entry.main , "DEBUG" )

			try {
				var compiler =  webpack( myConf );
			}catch(e){
				throw e ;
			}
			if ( 	myConf.watch ){
				var watching = compiler.watch({
					/* watchOptions */
				}, (err, stats) => {
					this.loggerStat(err, stats);
				});
				this.kernel.listen(this ,"onTerminate", ( ) => {
					watching.close(() => {
						this.logger("Watching Ended :" + myConf.context +"/"+myConf.entry.main , "INFO");
					});
				});
			}
			return compiler ;
		}

		getUglifyJsPlugin( config ){
			try {
				return new webpack.optimize.UglifyJsPlugin( nodefony.extend(true, {}, {
					compress: this.production
				}, config) );
			}catch(e){
				throw e;
			}
		}

	}

	return  webpackService ;
});
