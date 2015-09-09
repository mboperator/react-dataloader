"use strict";

var Reflux = require('reflux');
var _ = require('underscore');

function defaultDeserializer(query=null, object) {
  return object;
}

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
  registerStore(options, store, client) {
    this.store = store;
    this.name = `${store.name}Synchronizer`;
    this.idAttribute = options.idAttribute;
    this.client = client;
    this.onError = options.onError;

    this.setDeserializer();
    this.listenTo(store, this.onStoreChange);
    this.listenTo(store.listenables.populate, this.populate);
  },

  /**
   * @public Persists store to remote when updated
   */
  onStoreChange(action, data, trigger=true) {
    // move me out
    var allowedActions = ['add', 'update', 'destroy'];
    if (trigger && _.contains(allowedActions, action)) {
      this[action](data);
    }
  },

  /**
   * @public Sets serializer
   */

  setSerializer(serializer) {
    this.serializer = serializer;
  },

  /**
   * @public Sets deserializer
   */

  setDeserializer(deserializer=defaultDeserializer) {
    this.deserializer = deserializer;
  },

  /**
   * @public Sets client
   */
  setClient(client) {
    this.client = client;
  },

  /**
   * Log errors
   */

  _logError(method, err) {
    this.onError && this.onError(this.name, method, err);
  },

  /**
   * @public Populates store from remote
   */
  populate(object, params) {
    this.client.getAll(object, params)
      .then((objects) => {
        // @todo: find a better way to sync w/ remote
        // this.store.listenables.destroyAll();
        var formatted;

        if (objects.constructor === Array) {
          formatted = objects.map(this.deserializer.bind(null, object));
        } else {
          formatted = this.deserializer(object, objects);
        }

        this.store.listenables.setCollection(formatted);
        this.trigger("populate", objects);
        setTimeout(this.store.listenables.onPopulateSuccess, 750);
      })
      .fail(err => {
        this._logError('populate', err);
        this.store.listenables.onPopulateFail();
        console.error(err);
      });
  },

  /**
  * @public Fetch Object from remote
   */
  reload(object) {
    this.client.get(object.id)
    .then((responseObject) => {
      this._updateSuccess(object, responseObject);
    })
    .fail(err => {
      this._logError('reload', err);
      console.error(err);
    });
  },

  /**
   * @public Push store updates to remote
   */
  update(object) {
    this.client.update(object, this.serializer)
    .then((responseObject) => {
      this._updateSuccess(object, responseObject);
      this.store.flushChanges();
    })
    .fail(err => {
      this._logError('update', err);
      console.error(err);
    });
  },

  _updateSuccess(stale, updated) {
    var object = _.extend({}, stale, updated);
    this.store.listenables.setObject(object);
    this.trigger("update", object);
  },

  /**
  * @public Push store deletions to remote
   */
   destroy(id) {
    this.client.destroy(id)
    .then((result) => {
      this.trigger("destroy", result);
      this.store.flushChanges();
    })
    .fail(err => {
      this._logError('destroy', err);
      console.error(err);
    });
  },

  /**
  * @public Push store additions to remote
   */
  add(addedObject) {
    var object = _.clone(addedObject);
    delete object.id;

    this.client.add(object, this.serializer)
    .then((responseObject) => {
      this.store.listenables.setObject(_.extend({}, object, responseObject));
      this.store.flushChanges();
      responseObject.oldId = addedObject.id;
      this.trigger("add", responseObject);
    })
    .fail(err => {
      this._logError('add', err);
      console.error(err);
    });
  },
};

module.exports = function(options, store, client) {
  var nsync = Reflux.createStore(Nsynchronizer);
  nsync.registerStore(options, store, client);
  return nsync;
};
