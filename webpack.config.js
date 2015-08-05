var webpack = require('webpack');
var plugins = [
  new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
  new webpack.optimize.UglifyJsPlugin({minimize:true, sourceMap: true})
];

module.exports = {
  context: __dirname,

  entry: {
    app: './wrench.js',
    vendor: [
      'react',
      'react/addons',
      'react-router',
      'underscore',
      'q',
      'reflux',
      'moment'
    ]
  },

  output: {
    filename: '[name].bundle.js'
  },

  plugins: plugins,

  module: {
    loaders: [
      { test: /\.js$/, loaders: [ 'react-hot', 'babel-loader' ], exclude: /node_modules/ },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.gif$/, loader: 'url-loader?mimetype=image/png' },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&minetype=application/font-woff' },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader?name=[name].[ext]' },
    ]
  },

  resolve: {
    extensions: ['', '.js'],
    alias: {
      'react': __dirname + '/node_modules/react',
      'react/addons': __dirname + '/node_modules/react/addons'
    }
  }
};
