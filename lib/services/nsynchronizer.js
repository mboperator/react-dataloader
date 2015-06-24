"use strict";

var Reflux = require('reflux');
var _ = require('underscore');

/**
 * @class Store Synchronizer
 */

var Nsynchronizer = {

  /**
   * @public Initializer
   * @param {object} options hash of options
   * @param {string} options.idAttribute idAttribute of resource
   * @param {string} options.basePath basePath of resource
   * @param {string} options.endpoint endpoint of resource
   *
   * @param {RefluxStore} store Store to synchronize
   */
  registerStore: function(options, store, client) {
    this.store = store;
    this.name = `${store.name}Synchronizer`;
    this.idAttribute = options.idAttribute;
    this.client = client;
    this.listenTo(store, this.onStoreChange);
    this.listenTo(store.listenables.populate, this.populate);
  },

  /**
   * @public Persists store to remote when updated
   */
  onStoreChange: function(action, data, trigger=true) {
    // move me out
    var allowedActions = ['add', 'update', 'destroy'];
    if (trigger && _.contains(allowedActions, action)) {
      this[action](data);
    }
  },

  /**
   * @public Sets serializer
   */

  setSerializer: function(serializer) {
    this.serializer = serializer;
  },

  /**
   * @public Sets client
   */
  setClient: function(client) {
    this.client = client;
  },

  /**
   * @public Populates store from remote
   */
  populate: function(object) {
    this.client.getAll(object)
      .then((objects) => {
        // @todo: find a better way to sync w/ remote
        // this.store.listenables.destroyAll();
        if (objects.constructor === Array) {
          this.store.listenables.setCollection(objects);
        }
        else {
          this.store.listenables.setObject(objects);
        }
        this.trigger("populate", objects);
      })
      .fail(err => {
        console.error(err);
      });
  },

  /**
  * @public Fetch Object from remote
   */
  reload: function(object) {
    this.client.get(object.id)
    .then((responseObject) => {
      this._updateSuccess(object, responseObject);
    })
    .fail(err => {
      console.error(err);
    });
  },

  /**
   * @public Push store updates to remote
   */
  update: function(object) {
    this.client.update(object, this.serializer)
    .then((responseObject) => {
      this._updateSuccess(object, responseObject);
    })
    .fail(err => {
      console.error(err);
    });
  },

  _updateSuccess: function(stale, updated) {
    var object = _.extend({}, stale, updated);
    this.store.listenables.setObject(object);
    this.trigger("update", object);
  },

  /**
  * @public Push store deletions to remote
   */
   destroy: function(id) {
    this.client.destroy(id)
    .then((result) => {
      this.trigger("destroy", result);
    })
    .fail(err => {
      console.error(err);
    });
  },

  /**
  * @public Push store additions to remote
   */
  add: function(object) {
    this.client.add(object, this.serializer)
    .then((responseObject) => {
      this.store.listenables.setObject(_.extend({}, object, responseObject));
      this.trigger("add", responseObject);
    })
    .fail(err => {
      console.error(err);
    });
  },
};

module.exports = function(options, store, client) {
  var nsync = Reflux.createStore(Nsynchronizer);
  nsync.registerStore(options, store, client);
  return nsync;
};
