const path = require("path");
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {
  merge
} = require('webpack-merge');

// Default context <bundle base directory>
//const context = path.resolve(__dirname, "..", "public");
const public = path.resolve(__dirname, "..", "public", "assets");
const package = require(path.resolve("package.json"));

const bundleConfig = require(path.resolve(__dirname, "config.js"));
const bundleName = package.name;
const publicPath = `/${bundleName}-bundle/assets/`;

let config = null;
let dev = true;
const debug = kernel.debug ? "*" : false;
if (kernel.environment === "dev") {
  config = require("./webpack/webpack.dev.config.js");
} else {
  config = require("./webpack/webpack.prod.config.js");
  dev = false;
}


module.exports = merge(config, {
  //context: context,
  target: "web",
  entry: {
    users: ["./Resources/js/users.js"]
  },
  output: {
    path: public,
    publicPath: publicPath,
    filename: "./js/[name].js",
    hashFunction: "xxhash64",
    library: "[name]",
    libraryExport: "default"
  },
  externals: {},
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.css', '.mjs'],
    alias: {
      "@modules": path.join(__dirname, "..", "..", "node_modules")
    },
    fallback: {
      "path": false,
      "assert": false,
      buffer: require.resolve('buffer/')
    }
  },
  module: {
    rules: [{
        // BABEL TRANSCODE
        test: /\.(jsx|mjs|js|es6)$/,
        exclude: new RegExp("node_modules"),
        use: [{
          loader: 'babel-loader',
          options: {
            //presets: ['@babel/preset-env', '@babel/preset-react']
            presets: [
                 ['@babel/preset-env', {
                modules: false
              }],
                 '@babel/preset-react',
               ],
          }
        }]
      }, {
        type: 'javascript/auto',
        test: /\.mjs$/,
        use: [],
        include: /node_modules/,
      }, {
        test: require.resolve('jquery'),
        rules: [{
          loader: 'expose-loader',
          options: {
            //expose: ['$', 'jQuery'],
            exposes: [{
              globalName: '$',
              override: true,
                }, {
              globalName: 'jQuery',
              override: true,
            }]
          }
        }]
      }, {
        test: /\.(sa|sc|c)ss$/,
        use: [
          //'css-hot-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          }, {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      }, {
        test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        type: 'asset/inline'
      }, {
        test: /\.svg$/,
        use: [{
          loader: 'svg-inline-loader'
        }],
      }, {
        // IMAGES
        test: /\.(gif|png|jpe?g|svg)$/i,
        type: 'asset/resource',
        generator: {
           filename: "images/[name][ext][query]",
        }
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new MiniCssExtractPlugin({
      filename: "./css/[name].css"
    }),
    new webpack.DefinePlugin({
      'process':{
        platform:`'${process.platform}'`
      },
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        "NODE_DEBUG": JSON.stringify(debug),
        "GRAPHIQL": JSON.stringify(bundleConfig.graphiql),
        "SWAGGER": JSON.stringify(bundleConfig.swagger)
      }
    })
  ],
  devServer: {
    inline: true,
    hot: false
  }
});
