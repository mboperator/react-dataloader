var webpack = require('webpack');

var plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin(),
  new webpack.OldWatchingPlugin()
];

module.exports = {
  context: __dirname + '/lib',

  entry: {
    app: [
      'webpack-dev-server/client?http://localhost:8080/',
      'webpack/hot/only-dev-server',
      './example.js'
    ]
  },

  output: {
    filename: '[name].bundle.js',
    path: __dirname + '/public/assets/js',
    publicPath: 'http://localhost:8080/assets'
  },

  plugins: plugins,

  node: {
    fs: "empty"
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: [ 'react-hot', 'babel-loader' ],
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },

  resolve: {
    extensions: ["", ".js"]
  },

  debug: true,

  devtool: 'eval-source-map'
};
