const CleanWebpackPlugin = require('clean-webpack-plugin');
const public = path.resolve(__dirname, "..", "..", "Resources", "public");

module.exports = {
  mode: "development",
  devtool: "source-map",
  plugins: [
    new CleanWebpackPlugin(['assets'], {
      verbose: kernel.debug,
      root: public
    })
    //new webpack.NamedModulesPlugin(),
    //new webpack.HotModuleReplacementPlugin()
  ]
};