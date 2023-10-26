
// vue.config.js
const {
  defineConfig
} = require("@vue/cli-service");

const webpack = require("webpack");
const path = require("path");
const Package = require(path.resolve("package.json"));
const vueDir = path.dirname(require.resolve("vue"));
const packageVue = require(path.resolve(vueDir, "package.json"));
const outputDir = path.resolve("Resources", "public");
const indexPath = path.resolve("Resources", "views", "index.html.twig");
const publicPath = "/vue-bundle";
const template = path.resolve("public", "index.html");
const {
  CleanWebpackPlugin
} = require("clean-webpack-plugin");
// const title = Package.name;
const title = "Nodefony";
const htmlPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const bundleConfig = kernel.getBundle("vue").settings;
let dev = true;
let debug = false;
let watch = false;

try {
  if (kernel.environment !== "dev") {
    dev = false;
  } else {
    watch = true;
  }
  debug = kernel.debug ? "*" : false;
} catch (e) { }

const vuetifyDir = path.dirname(require.resolve("vuetify"));
const packageVuetify = require(path.resolve(vuetifyDir, "..", "package.json"));
// const nodeModule = path.resolve(process.cwd(), "node_modules");

process.env.VUE_APP_VERSION = Package.version;
process.env.VUE_APP_VUE_VERSION = packageVue.version;
process.env.VUE_APP_DEBUG = process.env.NODE_DEBUG;
process.env.VUE_APP_NODE_ENV = process.env.NODE_ENV;
process.env.VUE_APP_VUETIFY_VERSION = packageVuetify.version;
try {
  process.env.VUE_APP_DOMAIN = kernel.domain;
  process.env.VUE_APP_HTTP_PORT = kernel.httpPort;
  process.env.VUE_APP_HTTPS_PORT = kernel.httpsPort;
} catch (e) { }

module.exports = defineConfig({
  lintOnSave: false,
  publicPath,
  outputDir,
  indexPath,
  assetsDir: "assets",

  chainWebpack: (config) => {
    config
      .plugin("html")
      .tap((args) => {
        args[0].title = title;
        args[0].template = template;
        args[0].chunks = ["app"];
        return args;
      });
  },

  configureWebpack: {
    // context:process.cwd(),
    cache: true,
    infrastructureLogging: {
      // appendOnly: true,
      // level: 'verbose',
      // debug: true,
      // colors: true,
    },
    watchOptions: {
      aggregateTimeout: 1000,
      ignored: /node_modules|assets|dist|tmp|public|Entity/,
      followSymlinks: false
    },
    performance: {
      hints: false,
      maxEntrypointSize: 11000000,
      maxAssetSize: 11000000
    },
    optimization: {
      runtimeChunk: true,
      removeAvailableModules: false,
      removeEmptyChunks: false,
      splitChunks: false
      // emitOnErrors: true,
    },
    devtool: process.env.NODE_ENV === "development" ? "eval-cheap-module-source-map" : false,

    module: {

    },
    output: {
      hotUpdateChunkFilename: "hot/[id].[fullhash].hot-update.js",
      hotUpdateMainFilename: "hot/[runtime].[fullhash].hot-update.json"
    },
    resolve: {
      alias: {
        "@bundles": path.join(__dirname, ".."),
        "@app": path.join(__dirname, "..", "..", "..", "app"),
        "vue": path.resolve("./node_modules/vue"),
        "vue-router": path.resolve("./node_modules/vue-router")
      },
      extensions: [".js", ".json", ".css", ".mjs"],
      fallback: {
        "path": false,
        "assert": false
      }
      // modules: [nodeModule]
    },
    plugins: [

      /* new webpack.ProgressPlugin({
        entries: true,
        activeModules:true,
        handler(percentage, message, ...args) {
          console.info(percentage, message, ...args);
        },
        modules: true,
        //modulesCount: 5000,
        profile: true,
        dependencies: true,
        //dependenciesCount: 10000,
        percentBy:"entries"
      }),*/
      new MiniCssExtractPlugin({
        filename: "./assets/css/[name].css"
      }),
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        "process.env.NODE_DEBUG": JSON.stringify(debug)
      }),

      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [`${outputDir}/hot/*.hot-update.*`],
        dry: false,
        verbose: true,
        initialClean: true,
        cleanStaleWebpackAssets: true,
        protectWebpackAssets: true,
        cleanAfterEveryBuildPatterns: [],
        dangerouslyAllowCleanPatternsOutsideProject: true
      }),
      new htmlPlugin({
        filename: path.resolve("Resources", "views", "base.html.twig"),
        template: path.resolve("Resources", "templates", "base.html.twig"),
        title: bundleConfig.name,
        // favicon: dev ? "./Resources/public/images/app-logo.png" : false,
        cache: dev,
        minify: {
          collapseWhitespace: true,
          keepClosingSlash: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true
        },
        xhtml: true,
        chunks: ["swagger"],
        templateParameters: bundleConfig
      }),

    ]
  },
  // transpileDependencies: true,
  transpileDependencies: [
    "vuetify"
  ],

  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableLegacy: false,
      runtimeOnly: false,
      compositionOnly: false,
      fullInstall: true
    }
  },
  pwa: {
    name: "vue-bundle",
    // manifestPath:"",
    manifestOptions: {
      start_url: "./vue",
      id: "./vue-bundle",
      scope: "./vue"
    },
    workboxOptions: {
      chunks: ["app"],
      maximumFileSizeToCacheInBytes: 9000000
    }
  }
});

