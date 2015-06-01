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
  registerStore: function (options, store, client) {
    this.store = store;
    this.idAttribute = options.idAttribute;
    this.client = client;
    this.listenTo(store, this.onStoreChange);
    this.listenTo(store.listenables.populate, this.populate);
  },

  /**
   * @public Persists store to remote when updated
   */
  onStoreChange: function(action, data) {
    // move me out
    var allowedActions = ['add', 'update', 'destroy'];
    if (_.contains(allowedActions, action)) {
      this[action](data);
    }
  },

  /**
   * @public Populates store from remote
   */
  populate: function(object) {
    this.client.getAll(object)
      .then( (objects) => {
        // @todo: find a better way to sync w/ remote
        // this.store.listenables.destroyAll();
        this.store.listenables.setCollection(objects);
      })
      .fail(err => {
        console.error(err);
      });
  },

  /**
   * @public Push store updates to remote
   */
  update: function(object) {
    this.client.update(object)
    .then( (object) => {

    })
    .fail(err => {
      console.error(err);
    });
  },

  /**
  * @public Push store deletions to remote
   */
   destroy: function(id) {
    this.client.destroy(id)
    .then( (result) => {

    })
    .fail(err => {
      console.error(err);
    });
  },

  /**
  * @public Push store additions to remote
   */
  add: function(object) {
    this.client.add(object)
    .then( (object) => {

    })
    .fail(err => {
      console.error(err);
    });
  }
};

module.exports = function(options, store, client) {
  var nsync = Reflux.createStore(Nsynchronizer);
  nsync.registerStore(options, store, client);
  return nsync;
};
