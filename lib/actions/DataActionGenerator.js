var Reflux = require('reflux');
var cached = {};

/**
 * DataActionGenerator - Generates Reflux Actions
 * @param {string} resourceName name of resource for memoization (optional)
 * @returns {RefluxActions} returns reflux actions
 */
var DataActionGenerator = function(resourceName) {
  if (cached[resourceName]) {
    return cached[resourceName];
  }

  var actions = Reflux.createActions([
    'add',
    'update',
    'destroy',
    'filter',
    'sort',
    'search',
    'registerView',
    'resetView',
    'reload',
    'populate',
    'destroyAll',
    'setObject',
    'setCollection',
    'onPopulateSuccess',
    'onPopulateFail',
  ]);

  if (resourceName) {
    cached[resourceName] = actions;
  }

  return actions;
};

module.exports = DataActionGenerator;
