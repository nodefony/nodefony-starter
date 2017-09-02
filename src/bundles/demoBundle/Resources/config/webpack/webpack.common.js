const path = require("path");
const webpack = require('webpack');
const ExtractTextPluginCss = require('extract-text-webpack-plugin');
const public = path.resolve(__dirname, "..", "..", "public");
const bundleName = path.basename( path.resolve( __dirname, "..", "..", "..") );

module.exports = {
  context     : public ,
  target      : "web",
  entry       : {
    layout    : "./js/layout.js" ,
    demo      : "./js/index.js",
    finder    : "./js/finder/finder.js",
    login     : "./js/login.js",
    audio     : "./webaudio/js/mix2.js"
  },
  output      : {
    path    : public,
    filename: "./assets/js/[name].js",
    library:  "[name]",
    libraryTarget: "umd"
  },
  externals:{
    "jquery": "jQuery"
  },
  module      : {
    rules: [{
      // BABEL TRANSCODE
      test: new RegExp("\.es6$"),
      exclude: new RegExp("node_modules"),
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['es2015']
          }
        }
      ]
    },{
      // CSS EXTRACT
      test: new RegExp("\.css$"),
      use: ExtractTextPluginCss.extract({
        use: 'css-loader'
      })
    },{
      // SASS
      test: new RegExp(".scss$"),
      use: [{
        loader: 'style-loader'
      },{
        loader: 'css-loader'
      },{
        loader: 'sass-loader'
      }
    ]
  },{
    test: new RegExp("\.less$"),
    use: ExtractTextPluginCss.extract({
      use: [
        "raw-loader",
        {
          loader:	'less-loader',
          options: {
            //strictMath: true,
            //noIeCompat: true
          }
        }]
      })
    },{
      // FONTS
      test: new RegExp("\.(eot|woff2?|svg|ttf)([\?]?.*)$"),
      use: 'file-loader?name=[name].[ext]&publicPath=/'+bundleName+'&outputPath=/assets/fonts/',
    },{
      // IMAGES
      test: new RegExp("\.(jpg|png|gif)$"),
      use: 'file-loader?name=[name].[ext]&publicPath=/'+bundleName+'&outputPath=/assets/images/'
    }]
  },
  plugins: [
    new ExtractTextPluginCss( {
      filename:"./assets/css/[name].css",
    })
  ]
};
