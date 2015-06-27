let q = require('q');
let _ = require('underscore');
let reqwest = require('reqwest');


/**
 * @class Client
 * @description REST Client for Dataloader
 */
class Client {
  defaultSerializer(object) {
    let formatted = _.clone(object);
    let payload = {};
    delete formatted.$loki;
    delete formatted.meta;

    if(this.resource) { payload[this.resource] = formatted }
    else { payload = formatted }
    return JSON.stringify(payload);
  }
  /**
   * @constructor
   * @param  {object} urlBuilder functions for building URLs
   * @param  {object} options client config options
   * @param  {string} options.basePath API basepath
   * @param  {string} options.endpoint resource API endpoint
   * @param  {string} options.resource resource name
   * @param  {object} options.headers Headers for requests
   */
  constructor(urlBuilder, options) {
    this.basePath = options.basePath;
    this.endpoint = options.endpoint;
    this.resource = options.resource;
    this.headers = options.headers;
    this.name = options.name;

    Object.keys(urlBuilder).forEach(key => {
      this[key] = urlBuilder[key].bind(this);
    });
  }

/**
 * Generic success handler
 * @param  {object} deferred Promise to resolve on success
 * @return {string} resource API url
 */
  _success(deferred, res) {
    return deferred.resolve(res);
  }

/**
 * Generic failure handler
 * @param  {object} deferred Promise to resolve on success
 * @return {string} resource API url
 */
  _error(deferred, err) {
    return deferred.reject(err);
  }

  serialize(object) {
    return this._serialize ? this._serialize(object) : object;
  }


/**
 * Creates object on remote server
 * @param {object} object Object to create
 */
  add(object, serializer = this.defaultSerializer) {
    let deferred = q.defer();
    let params = {
      url: this._getResourceUrl(object),
      method: 'post',
      data: serializer.call(this, object),
      headers: this.headers(),
      error: this._error.bind(null, deferred),
      success: this._success.bind(null, deferred)
    };
    if (params.url) { reqwest(params); }

    return deferred.promise;
  }

/**
 * Destroys object on remote server
 * @param  {number} id ID of object to destroy on server
 * @return {promise}    promise
 */
  destroy(id) {
    let deferred = q.defer();

    let params = {
      url: this._getObjectUrl(id),
      method: 'delete',
      headers: this.headers(),
      error: this._error.bind(null, deferred),
      success: this._success.bind(null, deferred)
    };
    if (params.url) { reqwest(params); }

    return deferred.promise;
  }

/**
 * Updates object on remote server
 * @param  {object} object Object to update
 * @return {promise}        promise
 */
  update(object, serializer = this.defaultSerializer) {
    let deferred = q.defer();

    let params = {
      url: this._getObjectUrl(object.id),
      method: 'put',
      data: serializer.call(this, object),
      headers: this.headers(),
      error: this._error.bind(null, deferred),
      success: this._success.bind(null, deferred)
    };
    if (params.url) { reqwest(params); }

    return deferred.promise;
  }

/**
 * Get an object from remote server
 * @param  {number} id ID of object to retrieve
 * @return {promise}    promise
 */
  get(id) {
    let deferred = q.defer();

    let params = {
      url: this._getObjectUrl(id),
      method: 'get',
      headers: this.headers(),
      error: this._error.bind(null, deferred),
      success: this._success.bind(null, deferred)
    };
    if (params.url) { reqwest(params); }

    return deferred.promise;
  }

/**
 * Get collection from remote server
 * @return {promise} promise
 */
  getAll(object) {
    let deferred = q.defer();

    let params = {
      url: this._getResourceUrl(object),
      method: 'get',
      headers: this.headers(),
      error: this._error.bind(null, deferred),
      success: this._success.bind(null, deferred)
    };
    if (params.url) { reqwest(params); }

    return deferred.promise;
  }
}

module.exports = Client;
