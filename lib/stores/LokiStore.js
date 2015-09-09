"use strict";

/**
 * @module LokiStore
 */
var loki = require('lokijs');
var _ = require("underscore");
var uuid = require('../utils/uuid');
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

    var resource = this.getDS().addCollection(name, { disableChangesApi: false });
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

    resetChanges() {
      var changes = this.collection.getChanges();
      changes.forEach(change=> {
        var {obj} = change;
        this.setObject(obj);
      });
    },

    flushChanges() {
      this.collection.flushChanges();
    },

    /**
     * Adds an object to the store
     * @param {object} object Object to add
     * @return {event} Triggers event
     */
    add(object, trigger=true) {
      var stale = this.getDatabaseEntity(object);

      if (stale) {
        console.warn("ProcoreReact: Trying to add an already existing element. Syncing instead");
        this.trigger("add", object, trigger);
      } else {

        // ===========================
        // TESTING TEMP IDS
        // ===========================

        if (!trigger && !object[idAttr]) {
          object[idAttr] = `temp${uuid.v4()}`;
        }

        this.collection.insert(object);
        this.trigger("add", object, trigger);
      }
    },

    /**
     * Sets collection
     * @param {array} collection Collection to set
     * @return {event} Triggers event
     */
    setCollection(collection) {
      if (collection.constructor !== Array) { collection = [collection] }

      _.map(collection, (object) => {
        var stale = this.getDatabaseEntity(object);
        if (stale) {
          this.collection.update(_.extend(stale, object));
        }else{
          this.collection.insert(object);
        }
      });
      this.flushChanges();
      this.trigger("setCollection", this.getCollection());
    },

    /**
     * Set object without triggering events
     * @param {object} object Object to insert or update
     */
    setObject(object) {
      var stale = this.getDatabaseEntity(object);
      if (stale) {
        this.update(object, false);
      }else{
        this.add(object, false);
      }
      this.flushChanges();
    },

    /**
     * Destroys object
     * @param  {number} id ID of object to destroy
     * @return {event} Triggers event
     */
    destroy(id, trigger=true) {
      this.collection.remove(this.get(id));
      this.trigger("destroy", id, trigger);
    },

    /**
     * Destroys all objects in the store
     * @return {event} Triggers event
     */
    destroyAll(trigger=true) {
      this.collection.removeDataOnly();
      this.trigger("destroyAll", this.getCollection(), trigger);
    },

    /**
     * Updates an object in the store
     * @param  {object} object Object to update
     * @return {event} Triggers an event
     */
    update(updates, trigger=true) {
      var stale = this.getDatabaseEntity(updates);
      if (!stale) {
        console.warn("ProcoreReact: Trying to update an inexisting element.");
      }else{
        let updated = _.extend({}, stale, updates);
        this.collection.update(updated);
        this.trigger("update", updated, trigger, stale);
      }
    },

    /**
     * Builds a query to fetch an object
     * @param  {number} object[idAttr] ID of requested object
     * @param {number} object.$loki LokiID of the requested object
     * @return {object} Requested object
     */
    getEntityQuery(object) {
      var query = {};
      if (object.$loki) {
        query.$loki = object.$loki;
      } else if (object[idAttr]) {
        query[idAttr] = object[idAttr];
      } else {
        query = null;
      }
      return query;
    },

    /**
     * Gets an object's equivalent from dataSource
     * @param  {number} id ID of requested object
     * @return {object} Requested object
     */
    getDatabaseEntity(object) {
      var query = this.getEntityQuery(object);
      return query ? this.collection.findOne(query) : null;
    },

    /**
     * Gets an object by ID
     * @param  {number} id ID of object to get
     * @return {object} Requested object
     */
    get(id) {
      var query = {};
      query[idAttr] = id;
      return this.getDatabaseEntity( query );
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
      var collection = [];
      if (tag) {
        var view = this.collection.getDynamicView(tag);
        collection = view ? view.data() : [];
        // Hack to get around stale dynamic view data
        collection = _.uniq(collection, (obj) => { return obj[idAttr]; });
      } else {
        collection = this.find();
      }
      return collection;
    },

    getViewFilters(tag) {
      if (!tag || !this.dynamicViews[tag]) { return {}; }
      return this.dynamicViews[tag].filters;
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
      this.collection.removeDynamicView(tag);
      var view = this.collection.addDynamicView(tag);
      if (!viewParams) { return this.trigger("viewRegistered", tag); }

      var { filters, sortBy, search } = viewParams;
      sortBy && view.applySimpleSort(sortBy.attribute, sortBy.isDescending);
      sortBy && view.applySort(caseInsensitiveSort(sortBy));
      filters && _applyViewFilters(view, filters);
      search && view.applyWhere(_buildSearch(search));


      this.trigger("viewRegistered", tag);
    }
  };
}

function caseInsensitiveSort(sortBy) {
  return function(a, b) {
    var aVal = a[sortBy.attribute] || '~';
    var bVal = b[sortBy.attribute] || '~';
    aVal = typeof aVal === "string" ? aVal.toLowerCase() : aVal;
    bVal = typeof bVal === "string" ? bVal.toLowerCase() : bVal;
    if (sortBy.isDescending) {
      return aVal < bVal ? 1 : -1;
    } else {
      return aVal > bVal ? 1 : -1;
    }
  };
}

function _buildSearch(query) {
  return function(object) {
    var match = false;
    Object.keys(object).forEach((key) => {
      if (!match) {
        match = JSON.stringify(object[key])
        .toLowerCase()
        .indexOf(query.toLowerCase()) !== -1;
      }
    });
    return match;
  };
}

function _buildFilter(key, value) {
  var formattedValue = String(value).toLowerCase();
  return function(object) {
    if (value === undefined) { return !object[key]; }
    return String(object[key])
      .toLowerCase()
      .indexOf(formattedValue) !== -1;
  };
}

function _applyViewFilters(view, filters) {
  Object.keys(filters).forEach((key) => {
    var query = null;
    switch(filters[key]) {
      case null:
        break;
      default:
        query = _buildFilter(key, filters[key]);
        break;
    }
    query && view.applyWhere(query);
  });
}

module.exports = generateStore;
