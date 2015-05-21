var Reflux = require('reflux');
var DataActionGenerator = require('../actions/DataActionGenerator');
var nsync = require('./nsynchronizer');
var client = require('./client');

var storeTemplates = {
  // Shared/persistent stores are Loki
  shared: require('../stores/LokiStore'),

  // Unique/ephemeral stores are Immutable
  unique: require('../stores/ImmutableStore')
};

var urlBuilders = {
  default: require('./defaultUrlBuilder'),
  dependent: require('./dependentUrlBuilder')
};

/**
 * @class DataStoreManager
 */
class DataStoreManager {

  constructor() {
    this.generatedStores = {};
    this.headers = {};
    this.synchronizer = nsync;
    this.client = client;
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
 * Sets headers for synchronizer requests
 * @param  {object} headers Request Headers
 */
  setHeaders(headers) {
    this.headers = headers;
  }

/**
 * @public
 * Sets synchronizer
 * @param  {object} synchronizer
 */
  setSynchronizer(synchronizer) {
    this.synchronizer = synchronizer;
  }

/**
 * @public
 * Sets client for synchronizer requests
 * @param  {object} client Client for synchronizer requests
 */
  setClient(client) {
    this.client = client;
  }

/**
 * @public
 * Generates a store
 * @param {object} options Store options
 */
  getStore(options) {
    var { name, storeType } = options;
    var memoized = this._getStore(name);

    if (memoized) { return memoized; }
    else if (this.headers !== {}) { options.headers = this.headers; }
    return this[storeType || "unique"](options);
  }

/**
 * @private
 * Generates a singleton store
 * @param  {object} options Store options
 * @return {RefluxStore} Generated store
 */
  shared(options) {
    var { name, dependent } = options;

    // This seems like a code smell ~
    var chosenStore = new storeTemplates.shared(options);
    chosenStore.listenables = DataActionGenerator(name);
    var store = Reflux.createStore(chosenStore);

    // Probably need to move this logic
    var urlBuilder = (dependent) ? urlBuilders.dependent : urlBuilders.default;
    var client = this.client.bind(null, urlBuilder);
    var synchronizer = this.synchronizer(options, store, client);

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

    // This seems like a code smell ~
    var chosenStore = new storeTemplates.shared(options);
    chosenStore.listenables = DataActionGenerator();
    var store = Reflux.createStore(chosenStore);

    // Probably need to move this logic
    var urlBuilder = (dependent) ? urlBuilders.dependent : urlBuilders.default;
    var client = this.client.bind(null, urlBuilder);
    var synchronizer = this.synchronizer(options, store, client);

    return store;
  }
}

/**
 * Retrieves store generator from the window
 * @return {object} DataStoreManager
 */
module.exports = window.DataStoreManager = new DataStoreManager();
