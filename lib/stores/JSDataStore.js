/**
 * @module JSDataStore
 */
var JSData = require('js-data');
var DSHttpAdapter = require("js-data-http");

/**
 * @class JSDataSource
 * @description Manages JSData datasource
 */
class JSDataSource {

  constructor() {
    this.dataSource = null;
    this.adapter = null;
    this.resources = {};
  }

/**
 * Initializes and returns a datasource
 * @return {object} JSData Datasource
 */
  getDS() {
    if (this.dataSource) {
      return this.dataSource;
    }
    this.dataSource = new JSData.DS();
    this.adapter = new DSHttpAdapter();
    this.dataSource.registerAdapter('http', this.adapter, { default: true });
    return this.dataSource;
  }

/**
 * Initializes and returns a resource
 * @param {object} options hash of options
 * @param {string} options.name name of resource
 * @param {string} options.idAttribute idAttribute of resource
 * @param {string} options.basePath basePath of resource
 * @param {string} options.endpoint endpoint of resource
 * @return {object} JSData Collection
 */
  getResource(options) {
    var resources = this.resources;
    if (resources[options.name]) {
      return resources[options.name];
    }

    var resource = this.getDS().defineResource(options);
    resources[options.name] = resource;

    return resource;
  }
}

var $ds = new JSDataSource();

/**
 * Generate Store
 * @param {string} name Name of resource
 * @param {object} options see getResource for more detailed options
 * @return {object} JSDataStore template
 */

function generateStore(name, options) {
  return {
    name: name,

/**
 * Initializes store
 * @param  {Nsynchronizer} synchronizer Store synchronizer
 */
    init(synchronizer) {
      this.collection = $ds.getResource(options);
    },

/**
 * Calls for synchronizer to populate
 */
    populate() {
      this.collection
        .findAll({})
        .then(objects => {
          this.trigger("add", objects);
        });
    },

/**
 * Adds an object to the store
 * @param {object} object Object to add
 * @return {event} Triggers event
 */
    add(object) {
      this.collection
        .create(object)
        .then((object) => {
          this.trigger("add", this.getCollection());
        });
    },

/**
 * Destroys object
 * @param  {number} id ID of object to destroy
 * @return {event} Triggers event
 */
    destroy(id) {
      this.collection
        .destroy(id)
        .then((id) => {
          this.trigger("destroy", this.getCollection());
        });
    },

/**
 * Updates an object in the store
 * @param  {object} object Object to update
 * @return {event} Triggers an event
 */
    update(object) {
      this.collection
        .update(object.id, object)
        .then((result) => {
          this.trigger("update", this.getCollection());
        });
    },

/**
 * Gets an object by ID
 * @param  {number} id ID of object to get
 * @return {object} Requested object
 */
    get(id) {
      return this.collection.get(id);
    },

/**
 * Gets collection of objects
 * @param  {number} parentId ParentID of objects, for relational data (optional)
 * @return {array} Collection of objects
 */
    getCollection(parentId) {
      var query = {};
      if (parentId) {
        query.parentId = parentId;
      }

      return this.collection.filter(query);
    }
  };
}

module.exports = generateStore;
