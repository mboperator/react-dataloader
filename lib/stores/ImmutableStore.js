/**
 * @module ImmutableStore
 */
var { List } = require('immutable');
/**
 * Generates Store
 * @param  {string} name name of resource
 * @return {object}      Immutable Store Template
 */
function generateStore(options) {
  var { name, idAttr } = options;
  return {
    name: name,

    dynamicViews: {},

/**
 * Initializes store
 */
    init() {
      this.collection = List([]);
    },

/**
 * Adds an object to the store
 * @param {object} object Object to add
 * @return {event} Triggers event
 */
    add(object) {
      this.collection = this.collection.push(object);
      this.trigger("add", this.get());
    },

/**
 * Sets collection
 * @param {array} collection Collection to set
 * @return {event} Triggers event
 */
    setCollection(collection) {
      this.collection = List(collection);
      this.trigger("setCollection", this.get());
    },


/**
 * Destroys object
 * @param  {number} id ID of object to destroy
 * @return {event} Triggers event
 */
    destroy(id) {
      this.collection = this.collection.filter((object) => { return id !== object[idAttr]; });
      this.trigger("destroy", id);
    },

/**
 * Destroys all objects in the store
 * @return {event} Triggers event
 */
    destroyAll() {
      this.collection = List();
      this.trigger("destroyAll", this.get());
    },

/**
 * Updates an object in the store
 * @param  {object} object Object to update
 * @return {event} Triggers an event
 */
    update(updated) {
      this.collection = this.collection.filter((object) => { return updated[idAttr] !== object[idAttr]; });
      this.collection = this.collection.push(updated);
      this.trigger("update", updated);
    },

/**
 * Gets an object by ID
 * @param  {number} id ID of object to get
 * @return {object} Requested object
 */
    get(id) {
      if (!id) return this.collection.toArray();
  
      return this.collection.find(object => { 
        return object[idAttr] === id; 
      }) || {};
    },

/**
 * Gets collection of objects
 * @param  {number} parentId ParentID of objects, for relational data (optional)
 * @return {array} Collection of objects
 */
    getCollection(tag) {
      // TODO: Add dynamic view support
      return this.collection.toArray();
    }
  };
}

module.exports = generateStore;
