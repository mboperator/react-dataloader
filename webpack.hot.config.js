var webpack = require('webpack');
var path = require('path');
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

  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: [ 'jsx-loader?harmony', 'react-hot'],
        include: path.join(__dirname, 'lib/js')
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
