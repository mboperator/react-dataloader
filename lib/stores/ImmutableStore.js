/**
 * @module ImmutableStore
 */
var { List } = require('immutable');
/**
 * Generates Store
 * @param  {string} name name of resource
 * @return {object}      Immutable Store Template
 */
function generateStore(name) {
  return {
    name: name,

/**
 * Initializes store
 * @param  {Nsynchronizer} synchronizer Store synchronizer
 */
    init(synchronizer) {
      this.collection = List([]);
      this.synchronizer = synchronizer;
    },

/**
 * Sets collection
 * @param {array} collection Collection to set
 * @return {event} Triggers event
 */
    setCollection(collection) {
      this.collection = List(collection);
      this.trigger("add", this.getCollection());
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
      this.collection = this.collection.push(object);
      this.trigger("add", this.getCollection());
    },

/**
 * Destroys object
 * @param  {number} id ID of object to destroy
 * @return {event} Triggers event
 */
    destroy(id) {
      this.collection = this.collection.filter((object) => { return id !== object.id; });
      this.trigger("destroy", this.getCollection());
    },

/**
 * Destroys all objects in the store
 * @return {event} Triggers event
 */
    destroyAll() {
      this.collection = List();
      this.trigger("destroyAll", this.getCollection());
    },

/**
 * Updates an object in the store
 * @param  {object} object Object to update
 * @return {event} Triggers an event
 */
    update(updated) {
      this.collection = this.collection.filter((object) => { return updated.id !== object.id; });
      this.collection = this.collection.push(updated);
      this.trigger("update", this.getCollection());
    },

/**
 * Gets an object by ID
 * @param  {number} id ID of object to get
 * @return {object} Requested object
 */
    get(id) {
      return this.collection.find(object => { 
        return object.id === id; 
      }) || {};
    },

/**
 * Gets collection of objects
 * @param  {number} parentId ParentID of objects, for relational data (optional)
 * @return {array} Collection of objects
 */
    getCollection(parentId) {
      if (parentId) {
        return this.collection.toArray().filter(object => { return parentId !== object.parent_id; });
      } else {
        // Yeah we gotta figure this out
        return this.collection.toArray();
      }
    },
  };
}

module.exports = generateStore;
