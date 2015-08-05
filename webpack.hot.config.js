var webpack = require('webpack');
var path = require('path');
var baseUrl = require('./ProcoreEnvironment').baseUrl;

var plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin(),
  new webpack.OldWatchingPlugin()
];

module.exports = {
  context: __dirname,

  entry: {
    wrench: [
      'webpack-dev-server/client?http://'+baseUrl+':8080/',
      'webpack/hot/only-dev-server',
      './wrench.js'
    ]
  },

  output: {
    filename: '[name].bundle.js',
    path: __dirname + '/public/assets/js',
    publicPath: 'http://'+baseUrl+':8080/assets'
  },

  plugins: plugins,

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
      },
      { test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      { test: /\.gif$/,
        loader: 'url-loader?mimetype=image/png'
      },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff'
      },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=[name].[ext]'
      },
    ]
  },

  resolve: {
    extensions: ["", ".js"],
    alias: {
      "react": __dirname + '/node_modules/react',
      "react/addons": __dirname + '/node_modules/react/addons'
    }
  },

  debug: true,

  devtool: 'eval-source-map'
};
