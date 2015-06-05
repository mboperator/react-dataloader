/**
 * @module LokiStore
 */
var loki = require('lokijs');
var _ = require("underscore");

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
 */
    init() {
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
      _.map(collection, (object) => {
        var query = {id: object.id};
        var stale = this.collection.findOne(query);
        if (stale) {
          this.collection.update(_.extend(stale, object));
        }else{
          this.collection.insert(object);
        }
      });
      this.trigger("setCollection", this.get());
    },

/**
 * Set object
 * @param {array} collection Collection to set
 * @return {event} Triggers event
 */
    setObject(object) {
      this.collection.insert(object);
      this.trigger("setObject", this.get());
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
 * Destroys all objects in the store
 * @return {event} Triggers event
 */
    destroyAll() {
      this.collection.removeDataOnly();
      this.trigger("destroyAll", this.get());
    },

/**
 * Updates an object in the store
 * @param  {object} object Object to update
 * @return {event} Triggers an event
 */
    update(updated) {
      this.collection.update(updated);
      this.trigger("update", updated);
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
 * Queries store
 * @param  {object} query mongo-style query
 * @return {array} Array of reuslts
 */
    find(query) {
      return this.collection.find(query);
    },
/**
 * Gets collection of objects
 * @param  {number} parentId ParentID of objects, for relational data (optional)
 * @return {array} Collection of objects
 */
    getCollection(tag) {
      var view = this.collection.getDynamicView(tag);
      if (!view) { return []; }
      return view.data();
    },


/**
 * Creates a filter
 * @param {string} tag Tag of Collection to be filtered
 * @param {object} filterQuery filter query
 * @return {event} Triggers event
 */
    filter(tag, filterQuery) {
      if (!this.dynamicViews[tag]) {
        this.dynamicViews[tag] = { filters: {}, sortBy: {}, search: "" };
      }
      this.collection.removeDynamicView(tag);

      var viewParams = this.dynamicViews[tag];
      _.extend(viewParams.filters, filterQuery);
      this.registerView(tag, viewParams);

    },

/**
 * Creates a search
 * @param {string} tag Tag of Collection to be searched
 * @param {object} searchQuery search query
 * @return {event} Triggers event
 */
    search(tag, searchQuery) {
      if (!this.dynamicViews[tag]) {
        this.dynamicViews[tag] = { filters: {}, sortBy: {}, search: "" };
      }
      this.collection.removeDynamicView(tag);

      var viewParams = this.dynamicViews[tag];
      viewParams.search = searchQuery;

      this.registerView(tag, viewParams);

    },

/**
 * Adds a sort parameter
 * @param {string} tag Tag of Collection to be filtered
 * @param {object} sortParam sort parameter
 * @return {event} Triggers event
 */
    sort(tag, sortBy) {
      if (!this.dynamicViews[tag]) {
        this.dynamicViews[tag] = { filters: {}, sortBy: {}, search: "" };
      }
      this.collection.removeDynamicView(tag);

      var viewParams = this.dynamicViews[tag];
      viewParams.sortBy = sortBy;
      this.registerView(tag, viewParams);
    },

/**
 * Removes filter and sort parameters from view
 * @param {string} tag Tag of Collection to be reset
 * @return {event} Triggers event
 */
    resetView(tag, reregister) {
      this.collection.removeDynamicView(tag);
      if (reregister !== false) { this.registerView(tag); }
    },

/**
 * Generates new dynamic view
 * @param {string} tag Tag of Collection to be filtered
 * @param {object} sort and filter parameters
 * @return {event} Triggers event
 */
    registerView(tag, viewParams) {
      var view = this.collection.addDynamicView(tag);
      if (!viewParams) { return this.trigger("viewRegistered", tag); }

      var { filters, sortBy, search } = viewParams;
      sortBy && view.applySimpleSort(sortBy.attribute, sortBy.isDescending);
      filters && _applyViewFilters(view, filters);
      search && view.applyWhere(_buildSearch(search));


      this.trigger("viewRegistered", tag);
    }
  };
}

function _buildSearch(query) {
  return function(object) {
    var match = false;
    Object.keys(object).forEach((key) => {
      if (match) { return; }
      match = !!(JSON.stringify(object[key])
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) !== -1);
    });
    return match;
  };
}

function _applyViewFilters(view, filters) {
  Object.keys(filters).forEach((key) => {
    var query = null;
    switch(filters[key]) {
      case undefined:
        break;
      case null:
        break;
      default:
        query = {};
        query[key] = filters[key];
        break;
    }
    query && view.applyFind(query);
  });
}

module.exports = generateStore;
