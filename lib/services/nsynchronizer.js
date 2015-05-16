var Reflux = require('reflux');
var Client = require('./client');
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
  registerStore: function (options, store) {
    this.store = store;
    this.idAttribute = options.idAttribute;
    this.client = new Client(options);
    this.listenTo(store, this.onStoreChange);
  },

  /**
   * @public Persists store to remote when updated
   */
  onStoreChange: function(action, data) {
    // move me out
    var allowedActions = ['add', 'update', 'delete'];
    if (_.contains(allowedActions, action)) {
      this[action](data);
    }
  },

  /**
   * @public Populates store from remote
   */
  populate: function() {
    this.client.getAll()
      .then( (objects) => {
        // @todo: find a better way to sync w/ remote
        this.store.destroyAll();
        this.store.setCollection(objects);
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

module.exports = function(options, store) {
  var nsync = Reflux.createStore(Nsynchronizer);
  nsync.registerStore(options, store);
  return nsync;
};
