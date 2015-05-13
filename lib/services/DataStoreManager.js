var Reflux = require('reflux');
var DataActionGenerator = require('../actions/DataActionGenerator');
var nsync = require('./nsynchronizer');

var storeTemplates = {
  // Shared/persistent stores are Loki
  shared: require('../stores/LokiStore'),

  // Unique/ephemeral stores are Immutable
  unique: require('../stores/ImmutableStore')
};

/**
 * @class DataStoreManager
 */
class DataStoreManager {

  constructor() {
    this.generatedStores = {};
  }

/**
 * @private
 * Memoizes a store
 * @param  {RefluxStore} store Store to be memoized
 * @return {RefluxStore} Memoized Store
 */
  _memoizeStore(store) {
    if (!this.generatedStores[store.name]) {
      this.generatedStores[store.name] = store;
    }
    return this.generatedStores[store.name];
  }

/**
 * @private
 * Gets a memoized store
 * @param  {string} name Store name
 * @return {RefluxStore} MemoizedStore
 */
  _getStore(name) {
    return this.generatedStores[name];
  }

/**
 * @public
 * Generates a store
 * @param {object} options Store options
 */
  getStore(options) {
    var { name, storeType } = options;
    var memoized = this._getStore(name);

    if (memoized) {
      return memoized;
    }
    return this[storeType || "unique"](options);
  }

/**
 * @private
 * Generates a singleton store
 * @param  {object} options Store options
 * @return {RefluxStore} Generated store
 */
  shared(options) {
    var { name } = options;

    // This seems like a code smell ~
    var chosenStore = new storeTemplates.shared(name, options);
    chosenStore.listenables = DataActionGenerator(name);
    var store = Reflux.createStore(chosenStore);
    var synchronizer = new nsync(options, store);
    store.init(synchronizer);

    this._memoizeStore(store);

    return store;
  }

/**
 * @private
 * Generates an ephemeral store
 * @param  {object} options Store options
 * @return {RefluxStore} Generated store
 */
  unique(options) {
    var { name } = options;
    name = `${name}${Date.now()}`;

    // Something must be done
    var chosenStore = new storeTemplates.unique(name);
    chosenStore.listenables = DataActionGenerator();
    var store = Reflux.createStore(chosenStore);
    var synchronizer = new nsync(options, store);
    store.init(synchronizer);

    return store;
  }
}

module.exports = {
/**
 * Retrieves store generator from the window
 * @return {object} DataStoreManager
 */
  instance() {
    if (!window.DataStoreManager) {
      window.DataStoreManager = new DataStoreManager();
    }
    return window.DataStoreManager;
  }
};
