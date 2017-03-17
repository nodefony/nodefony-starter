/*
 * 
 * 
 *    
 * 
 * 
 */
const webpack = require("webpack");
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const ExtractTextPluginCss = require('extract-text-webpack-plugin');


nodefony.registerService("webpack", function(){


	var cssRule  = function(basename){
		return {
			test: /\.css$/,
			use: ExtractTextPluginCss.extract({
				use: 'css-loader'
			})
		};
	};


	var lessRule  = function(basename){
		return {
			test: /\.less$/,
			use: ExtractTextPluginCss.extract({
				use: ['style-loader', 'css-loader' ,{
					loader:	'less-loader',
					options: {
						strictMath: true,
						noIeCompat: true
					}
				}]
			})
		};
	};

	/*
 	 * File loader for supporting fonts, for example, in CSS files.
         */
	var fontsRule = function(basename){
		return {
			test: /\.(eot|woff2?|svg|ttf)([\?]?.*)$/,
			use: 'file-loader?name=[name].[ext]&publicPath=/'+basename+'/assets/fonts/&outputPath=/assets/fonts/',
		};
        };

	/* 
         * File loader for supporting images, for example, in CSS files.
         */
	var imagesRule = function(basename){ 
		return {
			test: /\.(jpg|png|gif)$/,
          		use: 'file-loader?name=[name].[ext]&publicPath=/'+basename+'/assets/images/&outputPath=/assets/images/'
		};
        };

	var defaultConfig = function(name, Path){
		if ( Path ){
			var basename = path.basename(Path); 
		}else{
			var basename ="assets";	
		}
		var public = Path + "/Resources/public";
		return {
			// Configuration Object
			context:	public,
			target:		"web",
			watch:		true,
			devtool:	this.production ? false : 'source-map',
			output:		{
				path:	public 
			},
			externals:	{},
			resolve:	{},
			module: {
				rules: [cssRule(basename), fontsRule(basename), imagesRule(basename), lessRule(basename)]
			},
			plugins: [
				new ExtractTextPluginCss( {
					 filename:"./assets/css/"+ name +".css", 
				}),
			]
		};
	};
	
	//https://webpack.js.org/api/node/
	const webpackService = class webpackService extends nodefony.Service {

		constructor(container){
			super ("WEBPACK", container);
			this.production = ( this.kernel.environment === "prod" ) ?  true :  false ;
			this.defaultConfig = defaultConfig.call(this);
		}

		loggerStat (err, stats, bundle , watcher){
			if (err){
				throw err
			}
			const info = stats.toJson();
			var error = stats.hasErrors();
			if ( error ) {
				this.logger(info.errors ,"ERROR")
			}else{
				if (bundle){
					if ( watcher ){
						this.logger( "WATCHING BUNDLE : " + bundle,"INFO"); 
					}else{
						this.logger( "COMPILE BUNDLE : " + bundle,"INFO");	
					}
				}
				this.logger( stats.toString({
  					// Add console colors
  					colors: true
				}), "INFO");
				if (stats.hasWarnings()) {
					this.logger(info.warnings ,"WARNING")
				}
			}
		}

		loadConfig( config , Path ){

			if ( this.production  && ( this.kernel.type !== "CONSOLE" ) ) {
				return null ;
			}
			var basename = path.basename(Path);
			var name = config.output ? config.output.library : "index" ;
						
			var myConf = webpackMerge( defaultConfig.call(this, name, Path), config ) ;
			
			this.logger( "LOAD CONFIG entry :" + myConf.entry.main , "DEBUG" )

			try {
				var compiler =  webpack( myConf );
				if ( this.kernel.type === "CONSOLE" ){
					return  compiler;
				}
			}catch(e){
				throw e ;
			}
			
			if ( myConf.watch ){
				var watching = compiler.watch({
					/* watchOptions */
				}, (err, stats) => {
					this.loggerStat(err, stats, basename, true);
				});
				this.kernel.listen(this ,"onTerminate", ( ) => {
					watching.close(() => {
						this.logger("Watching Ended :" + myConf.context +"/"+myConf.entry.main , "INFO");
					});
				});
			}else{
				this.runCompiler(compiler, basename);	
			}
			return compiler ;
		}

		runCompiler (compiler, bundle){
			return compiler.run( (err, stats) => {
				this.loggerStat(err, stats,  bundle);	
			});
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
