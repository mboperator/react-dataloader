var webpack = require('webpack');

module.exports = {
  devtool: "source-map",

  output: {
    filename: 'dataloader.min.js',
  },
  
  node: {
    fs: "empty"
  },

  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({ minimize: true })
  ]
};
