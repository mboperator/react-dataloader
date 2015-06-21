var Reflux = require('reflux');
var cached = {};

var defaultActions = [
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
  'setCollection'
];

function memoizeActions(resourceName, actions) {
  if (resourceName) { cached[resourceName] = actions; }
}

/**
 * DataActionGenerator - Generates Reflux Actions
 * @param {string} resourceName name of resource for memoization (optional)
 * @returns {RefluxActions} returns reflux actions
 */
var DataActionGenerator = function(resourceName, customActions = []) {
  if (cached[resourceName]) { return cached[resourceName]; }

  var actions = Reflux.createActions(actions.concat(customActions));
  memoizeActions(resourceName, actions);
  return actions;
};

module.exports = DataActionGenerator;
