//  with PROXY
//const webpackDevClient = "webpack-dev-server/client?https://" + kernel.hostname + "/";

const webpackDevClient = "webpack-dev-server/client?https://" + kernel.hostHttps + "/";
module.exports = {
  entry: {
    app: [webpackDevClient]
  },
  devtool: "source-map",
  plugins: []
};