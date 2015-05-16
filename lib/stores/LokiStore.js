/**
 * @module LokiStore
 */
var loki = require('lokijs');

/**
 * @class LowkeySource
 * @description Manages Loki datasource
 */
class LowkeySource {
  constructor() {
    this.dataSource = null;
    this.resources = {};
  }

/**
 * Initializes and returns a datasource
 * @return {loki} loki datasource
 */
  getDS() {
    if (this.dataSource) {
      return this.dataSource;
    }
    this.dataSource = new loki();
    return this.dataSource;
  }

/**
 * Initializes and returns a resource
 * @param  {string} name name of resource
 * @return {object}      Loki Collection
 */
  getResource(name) {
    var resources = this.resources;
    if (resources[name]) {
      return resources[name];
    }

    var resource = this.getDS().addCollection(name);
    resources[name] = resource;

    return resource;
  }
}

var $ds = new LowkeySource();

/**
 * Generate Store
 * @param  {name} name name of resource
 * @return {object} Loki store template
 */
function generateStore(options) {
  var { name, idAttr, fk } = options;
  var collection = $ds.getResource(name);
  return {
    name: name,

    collection: collection,

    dynamicViews: {},

/**
 * Initializes store
 * @param  {Nsynchronizer} synchronizer Store synchronizer
 */
    init(synchronizer) {
      this.synchronizer = synchronizer;
    },

/**
 * Calls for synchronizer to populate
 */
    populate() {
      this.synchronizer.populate();
    },

/**
 * Adds an object to the store
 * @param {object} object Object to add
 * @return {event} Triggers event
 */
    add(object) {
      this.collection.insert(object);
      this.trigger("add", object);
    },

/**
 * Sets collection
 * @param {array} collection Collection to set
 * @return {event} Triggers event
 */
    setCollection(collection) {
      this.collection.insert(collection);
      this.trigger("setCollection", this.get());
    },

/**
 * Destroys object
 * @param  {number} id ID of object to destroy
 * @return {event} Triggers event
 */
    destroy(id) {
      this.collection.remove(this.get(id));
      this.trigger("destroy", id);
    },

/**
 * Gets an object by ID
 * @param  {number} id ID of object to get
 * @return {object} Requested object
 */
    get(id) {
      if (!id) { 
        return this.collection.find({}); 
      }
      var query = {};
      query[idAttr] = id;
      return this.collection.findOne(query) || {};
    },

/**
 * Updates an object in the store
 * @param  {object} object Object to update
 * @return {event} Triggers an event
 */
    update(object) {
      this.collection.update(object);
      this.trigger("update", object);
    },

    find(query) {
      return this.collection.find(query);
    },
/**
 * Gets collection of objects
 * @param  {number} parentId ParentID of objects, for relational data (optional)
 * @return {array} Collection of objects
 */
    getCollection(tag) {
      return this.collection.getDynamicView(tag).data();
    },

/**
 * Destroys all objects in the store
 * @return {event} Triggers event
 */
    destroyAll() {
      this.collection.removeDataOnly();
      this.trigger("destroyAll", this.get());
    },

/**
 * Creates a filter
 * @param {string} tag Tag of Collection to be filtered
 * @param {object} filterQuery filter query
 * @return {event} Triggers event
 */
    filter(tag, filterQuery) {
      if (!this.dynamicViews[tag]) { this.dynamicViews[tag] = {}; }
      else {
        this.collection.removeDynamicView(tag);
      }
      var viewParams = this.dynamicViews[tag];
      viewParams.filter = filterQuery;
      this.registerView(tag, viewParams);
    },
/**
 * Adds a sort parameter
 * @param {string} tag Tag of Collection to be filtered
 * @param {object} sortParam sort parameter
 * @return {event} Triggers event
 */
    sort(tag, sortBy) {
      if (!this.dynamicViews[tag]) { this.dynamicViews[tag] = {}; }
      else {
        this.collection.removeDynamicView(tag);
      }
      var viewParams = this.dynamicViews[tag];
      viewParams.sortBy = sortBy;
      this.registerView(tag, viewParams);
    },
/**
 * Generates new dynamic view
 * @param {string} tag Tag of Collection to be filtered
 * @param {object} sort and filter parameters
 * @return {event} Triggers event
 */
    registerView(tag, viewParams) {
      var view = this.collection.addDynamicView(tag);

      if (viewParams) {
        var { filter, sortBy } = viewParams;
        sortBy && view.applySimpleSort(sortBy.attribute, sortBy.isDescending);
        filter && view.applyFind(filter);
      }

      this.trigger("viewRegistered", tag);
    }
  };
}


module.exports = generateStore;
