var webpack = require('webpack');

module.exports = {
  devtool: process.env.NODE_ENV !== 'production' ? 'eval' : null,

  output: {
    filename: 'dataloader.js',
  },
  
  node: {
    fs: "empty"
  },

  module: {
    loaders: [
      { test: /\.js$/, loader: 'jsx-loader?harmony' }
    ]
  }
};
