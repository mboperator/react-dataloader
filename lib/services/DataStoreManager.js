"use strict";

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
    this.urlBuilders = urlBuilders;
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
 * Memoizes a store
 * @param  {RefluxStore} store Store to be memoized
 * @return {RefluxStore} Memoized Store
 */
  _memoizeClient(client) {
    if (!this.generatedClients[client.name]) {
      this.generatedClients[client.name] = client;
    }
    return this.generatedClients[client.name];
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
 * @DEPRECATED
 */
  setHeaders(headers) {
    console.warn("Deprecated Method, use setDefaultHeaders");
    this.setDefaultHeaders(headers);
  }

/**
 * @public
 * Sets headers for synchronizer requests
 * @param  {object} headers Request Headers
 */
  setDefaultHeaders(headers) {
    this.headers = headers;
  }


/**
 * @public
 * Gets headers for synchronizer requests
 * @param  {object} headers Request Headers
 */
  getHeaders() {
    return this.headers;
  }


/**
 * @public
 * Registers new url builder for synchronizers
 * @param  {string} name Name of builder
 * @param  {func} url builder
 */
  registerBuilder(name, builder) {
    this.urlBuilders[name] = builder;
  }

/**
 * @public
 * Sets synchronizer
 * @param  {object} synchronizer
 */
  setSynchronizer(storeName, synchronizer) {
    this.generatedStores[`${storeName}Synchronizer`] = synchronizer;
  }

/**
 * @public
 * Sets synchronizer
 * @param  {object} synchronizer
 */
  getSynchronizer(storeName) {
    return this.generatedStores[`${storeName}Synchronizer`];
  }

/**
 * @public
 * Used to dispatch actions to stores
 * @param Name of store
 * @param actionType name of action to listen for
 * @param func function to execute on event emit
 */
  on(storeName, actionType, func) {
    var options = {type: 'shared', name: storeName};
    var store = this.getStore(options);
    var dispatcherStore = this.getStore({type: 'shared', name: 'dispatcher'});

    dispatcherStore.listenTo(store,function(type, data){
      if (actionType === type)
      func(data);
    });
  }

/**
 * @public
 * Generates a store
 * @param {object} options Store options
 */
  getStore(options, overrides) {
    var { name, storeType } = options;
    var memoized = this._getStore(name);

    if (memoized) { return memoized; }
    else if (this.headers !== {}) { options.headers = this.getHeaders.bind(this); }
    return this[storeType || "unique"](options, overrides);
  }

/**
 * @private
 * Generates a singleton store
 * @param  {object} options Store options
 * @return {RefluxStore} Generated store
 */
  shared(options, overrides) {
    var { name, builder } = options;
    var { store = {}, synchronizer = null, client = null } = overrides;

    // STORE SETUP
    var customActions = Object.keys(store);
    var chosenStore = new storeTemplates.shared(options);
    _.extend(chosenStore, store);

    chosenStore.listenables = DataActionGenerator(name, customActions);
    var store = Reflux.createStore(chosenStore);

    // SYNCHRONIZER SETUP
    if (!synchronizer && !client) {
      var urlBuilder = new this.urlBuilders[builder || 'default'](options);
      client = new this.client(urlBuilder, options);
      synchronizer = this.synchronizer(options, store, client);
    }

    this._memoizeStore(synchronizer);
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
    var { name, builder } = options;
    name = `${name}${Date.now()}`;

    // This seems like a code smell ~
    var chosenStore = new storeTemplates.shared(options);
    chosenStore.listenables = DataActionGenerator();
    var store = Reflux.createStore(chosenStore);

    // Probably need to move this logic
    var urlBuilder = new this.urlBuilders[builder || 'default'](options);
    var client = new this.client(urlBuilder, options);
    var synchronizer = this.synchronizer(options, store, client);

    return store;
  }
}

/**
 * Retrieves store generator from the window
 * @return {object} DataStoreManager
 */
module.exports = window.DataStoreManager = new DataStoreManager();
