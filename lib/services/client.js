var q = require('q');
var reqwest = require('reqwest');

/**
 * @class Client
 * @description REST Client for Dataloader
 */
class Client {
  /**
   * @constructor
   * @param  {object} options client config options
   * @param {string} options.basePath API basepath
   * @param {string} endpoint resource API endpoint
   */
  constructor(options) {
    this.basePath = options.basePath;
    this.endpoint = options.endpoint;
    this.headers = options.headers;
  }

/**
 * Generate resource URL
 * @return {string} resource API endpoint url
 */
  _getResourceUrl() {
    return `${this.basePath}${this.endpoint}`;
  }

/**
 * Generate single resource URL
 * @param  {number} id ID of resource
 * @return {string} resource API url
 */
  _getObjectUrl(id) {
    return `${this.basePath}${this.endpoint}/${id}`;
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

/**
 * Creates object on remote server
 * @param {object} object Object to create
 */
  add(object) {
    var deferred = q.defer();

    var params = {
      url: this._getResourceUrl(),
      method: 'post',
      data: object,
      headers: this.headers,
      error: this._error.bind(null, deferred),
      success: this._success.bind(null, deferred)
    };
    reqwest(params);

    return deferred.promise;
  }

/**
 * Destroys object on remote server
 * @param  {number} id ID of object to destroy on server
 * @return {promise}    promise
 */
  destroy(id) {
    var deferred = q.defer();

    var params = {
      url: this._getObjectUrl(id),
      method: 'del',
      headers: this.headers,
      error: this._error.bind(null, deferred),
      success: this._success.bind(null, deferred)
    };
    reqwest(params);

    return deferred.promise;
  }

/**
 * Updates object on remote server
 * @param  {object} object Object to update
 * @return {promise}        promise
 */
  update(object) {
    var deferred = q.defer();

    var params = {
      url: this._getObjectUrl(object.id),
      method: 'put',
      data: object,
      headers: this.headers,
      error: this._error.bind(null, deferred),
      success: this._success.bind(null, deferred)
    };
    reqwest(params);

    return deferred.promise;
  }

/**
 * Get an object from remote server
 * @param  {number} id ID of object to retrieve
 * @return {promise}    promise
 */
  get(id) {
    var deferred = q.defer();

    var params = {
      url: this._getObjectUrl(object.id),
      method: 'get',
      headers: this.headers,
      error: this._error.bind(null, deferred),
      success: this._success.bind(null, deferred)
    };
    reqwest(params);

    return deferred.promise;
  }

/**
 * Get collection from remote server
 * @return {promise} promise
 */
  getAll() {
    var deferred = q.defer();

    var params = {
      url: this._getResourceUrl(),
      method: 'get',
      headers: this.headers,
      error: this._error.bind(null, deferred),
      success: this._success.bind(null, deferred)
    };
    reqwest(params);

    return deferred.promise;
  }
}

module.exports = Client;
