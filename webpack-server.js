var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

var config = require('./webpack.hot.config');
module.exports = function() {
  var compiler = webpack(config);
  var server = new WebpackDevServer(compiler, {
      contentBase: 'http://localhost:8080',
      hot: true,
      quiet: false,
      noInfo: false,
      lazy: false,
      watchDelay: 20,
      publicPath: 'http://localhost:8080/assets',
      stats: { colors: true },
  });
  server.listen(8080, 'localhost', function() {});
};
