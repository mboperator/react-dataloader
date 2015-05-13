var Client = require('./client');

/**
 * @class Store Synchronizer
 */
export default class Nsynchronizer {
/**
 * @public Constructor
 * @param {object} options hash of options
 * @param {string} options.idAttribute idAttribute of resource
 * @param {string} options.basePath basePath of resource
 * @param {string} options.endpoint endpoint of resource
 *
 * @param {RefluxStore} store Store to synchronize
 */
  constructor(options, store) {

    // @todo: turn nsync into a store
    this.store = store;
    this.idAttribute = options.idAttribute;
    this.client = new Client(options);
  }
/**
 * @public Populates store from remote
 */
  populate() {
    this.client.getAll()
      .then(objects => {
        // @todo: find a better way to sync w/ remote
        this.store.destroyAll();
        this.store.setCollection(objects);
      })
      .fail(err => {
        console.error(err);
      });
  }
}
