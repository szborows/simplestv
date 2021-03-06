var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var merge = require('webpack-merge');

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

var common = {
  entry: PATHS.app,
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: './dist',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
        include: PATHS.app
      },
      {
        test: /\.jpg$/,
        loaders: ['file-loader'],
        include: PATHS.app
      },
      {
        test: /\.png$/,
        loaders: ['file-loader'],
        include: PATHS.app
      },
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: PATHS.app
      }

    ]
  },
  plugins: [
    new HtmlwebpackPlugin({
      title: 'Simple STV'
    })
  ]
};

module.exports = merge(common, {
devtool: 'eval-source-map',
devServer: {
  historyApiFallback: true,
  hot: true,
  inline: true,
  progress: true,

  // display only errors to reduce the amount of output
  stats: 'errors-only',

  // parse host and port from env so this is easy
  // to customize
  host: process.env.HOST,
  port: process.env.PORT
},
plugins: [
  new webpack.HotModuleReplacementPlugin()
]
});
