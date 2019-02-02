const path = require("path");
const merge = require("webpack-merge");
const webpack = require("webpack");
const packagejson = require("../package.json");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;

const parts = require("./webpack.parts.config");

const phaserModule = path.resolve("node_modules/phaser-ce/");
const orangeGamesModule = path.resolve("node_modules/@orange-games/");

const paths = {
  base: path.resolve("src"),
  app: path.resolve("src/com/planet221b/example/Game.js"),
  dist: path.resolve("dist"),
  template: path.resolve("index.html"),
  pixi: path.join(phaserModule, "build/custom/pixi.js"),
  phaser: path.join(phaserModule, "build/custom/phaser-no-physics.js")
};

const commonConfig = merge([
  {
    target: "web",
    context: paths.base,
    entry: {
      app: paths.app
    },
    output: {
      filename: "[name].[chunkhash].js",
      chunkFilename: "[name].[chunkhash].js",
      publicPath: "",
      path: paths.dist
    },
    resolve: {
      extensions: [".js"],
      alias: {
        "phaser-ce": paths.phaser,
        phaser: paths.phaser,
        pixi: paths.pixi,
        "pure-mvc": "@planet221b/pure-mvc"
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: paths.template,
        title: packagejson.name,
        version: packagejson.version
      }),
      new CaseSensitivePathsPlugin(),
      new CopyWebpackPlugin([
        {
          from: "../assets",
          to: "assets"
        }
      ]),
      new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i })
    ]
  },

  parts.loadJs({
    babelOptions: {
      presets: [
        [
          "babel-preset-env",
          {
            modules: false,
            useBuiltIns: "entry",
            shippedProposals: true
          }
        ],
        "stage-2"
      ],
      plugins: []
    }
  }),

  parts.injectVersion(packagejson.version)
]);

const developmentConfig = merge([
  parts.sourceMaps("source-map"),

  parts.devServer({ host: process.env.HOST, port: process.env.PORT }),

  { plugins: [new webpack.NamedModulesPlugin()] },

  parts.envVar("development")
]);

const commonProductionConfig = envVar => {
  return merge([
    parts.cleanup([paths.dist]),

    parts.minifyJavaScript(),

    parts.envVar(envVar),

    parts.extractChunks([
      {
        name: "vendor",
        minChunks: parts.isVendor
      },
      {
        async: "async-common",
        children: true,
        deepChildren: true,
        minChunks: 2
      },
      {
        name: "manifest",
        minChunks: Infinity
      }
    ]),

    parts.scopeHoisting(),

    parts.attachRevision()
  ]);
};

const productionConfig = merge([commonProductionConfig("production")]);

const preProductionConfig = merge([
  commonProductionConfig("preproduction"),
  parts.sourceMaps("source-map")
]);

const analyzeConfig = merge([parts.analyze()]);

module.exports = env => {
  let envConfig = developmentConfig;
  switch (env) {
    case "production":
      envConfig = productionConfig;
      break;
    case "preproduction":
      envConfig = preProductionConfig;
      break;
  }
  const config = merge(commonConfig, envConfig);
  if (process.env.npm_config_analyze) {
    return merge(config, analyzeConfig);
  }

  return config;
};
