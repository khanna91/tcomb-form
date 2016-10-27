/* eslint-disable */
var webpack = require('webpack');
var path = require('path');
var library = 'TcombForm';

module.exports = [
  {
    devtool: 'source-map',
    entry: './lib/main.js',
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'tcomb-form.js',
      library: library,
      libraryTarget: 'umd'
    },
    externals: {
      'react': 'React'
    },
    module: {
      loaders: [
        {
          test: /\.js?$/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015', 'stage-0']
          },
          exclude: /(node_modules|bower_components)/
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('development') })
    ]
  },
  {
    devtool: 'source-map',
    entry: './lib/main.js',
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'tcomb-form.min.js',
      library: library,
      libraryTarget: 'umd'
    },
    externals: {
      'react': 'React'
    },
    module: {
      loaders: [
        {
          test: /\.js?$/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015', 'stage-0']
          },
          exclude: /(node_modules|bower_components)/
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
    ]
  }
];
