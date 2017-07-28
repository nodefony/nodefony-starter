const path = require("path");
const webpack = require('webpack');
const ExtractTextPluginCss = require('extract-text-webpack-plugin');
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const public = path.resolve(__dirname, "..", ".." ,"public");
const bundleName = path.basename( path.resolve( __dirname, "..", "..", "..") );
const commonConfig = require("./webpack.common.js");
const webpackDevClient = "webpack-dev-server/client?https://"+kernel.hostHttps+"/";

module.exports = webpackMerge( {
    //watch       : false,
    devtool     : "source-map",
    plugins     :[]
}, commonConfig );
