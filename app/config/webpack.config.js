const path = require("path");
//const webpack = require('webpack');
const ExtractTextPluginCss = require('extract-text-webpack-plugin');
const public = path.resolve(__dirname, "..", "Resources", "public");
const bundleName = path.basename(path.resolve(__dirname, ".."));
const webpackMerge = require('webpack-merge');

let config = null;
if (kernel.environment === "dev") {
  config = require("./webpack/webpack.dev.config.js");
} else {
  config = require("./webpack/webpack.prod.config.js");
}

module.exports = webpackMerge(config, {
  context: public,
  target: "web",
  //watch: false,
  entry: {
    app: ["./js/app.js"]
  },
  output: {
    path: public,
    filename: "./assets/js/[name].js",
    library: "[name]",
    libraryTarget: "umd"
  },
  externals: {},
  resolve: {},
  module: {
    rules: [{
      // BABEL TRANSCODE
      test: new RegExp("\.es6$|\.js$"),
      exclude: new RegExp("node_modules"),
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['env']
        }
      }]
    }, {
      // CSS EXTRACT
      test: new RegExp("\.css$"),
      use: ExtractTextPluginCss.extract({
        use: 'css-loader'
      })
    }, {
      // SASS
      test: new RegExp(".scss$"),
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader'
      }, {
        loader: 'sass-loader'
      }]
    }, {
      test: new RegExp("\.less$"),
      use: ExtractTextPluginCss.extract({
        use: [
          "raw-loader",
          {
            loader: 'less-loader',
            options: {
              //strictMath: true,
              //noIeCompat: true
            }
          }
        ]
      })
    }, {
      // FONTS
      test: new RegExp("\.(eot|woff2?|svg|ttf)([\?]?.*)$"),
      use: 'file-loader?name=[name].[ext]&publicPath=/' + bundleName + '&outputPath=/assets/fonts/',
    }, {
      // IMAGES
      test: new RegExp("\.(jpg|png|gif)$"),
      use: 'file-loader?name=[name].[ext]&publicPath=/' + bundleName + '&outputPath=/assets/images/'
    }]
  },
  plugins: [
    new ExtractTextPluginCss({
      filename: "./assets/css/[name].css",
    })
  ]
});
