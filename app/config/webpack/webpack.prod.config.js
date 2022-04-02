// WEBPACK PROD CONFIGURATION
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: "production",
  watch: false,
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          warnings: true,
          compress: true
        },
        extractComments: true,
        parallel: true
      })
    ]
  },
  plugins: []
};
