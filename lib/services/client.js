var q = require('q');
var superagent = require('superagent');

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
 * Creates object on remote server
 * @param {object} object Object to create
 */
  add(object) {
    var deferred = q.defer();
    var url = this._getResourceUrl();

    superagent
      .post(url)
      .send(object)
      .end((err, res) => {
        if (err) {
          return deferred.reject(err);
        }
        else if (300 < res.status && res.status < 500) {
          console.warn("ClientError:", res.status, url);
        }
        return deferred.resolve(res.body);
      });
    return deferred.promise;
  }

/**
 * Destroys object on remote server
 * @param  {number} id ID of object to destroy on server
 * @return {promise}    promise
 */
  destroy(id) {
    var deferred = q.defer();
    var url = this._getObjectUrl(id);

    superagent
      .del(url)
      .end((err, res) => {
        if (err) {
          return deferred.reject(err);
        }
        else if (300 < res.status && res.status < 500) {
          console.warn("ClientError:", res.status, url);
        }
        return deferred.resolve(res.body);
      });
    return deferred.promise;
  }

/**
 * Updates object on remote server
 * @param  {object} object Object to update
 * @return {promise}        promise
 */
  update(object) {
    var deferred = q.defer();
    var url = this._getObjectUrl(object.id);

    superagent
      .put(url)
      .send(object)
      .end((err, res) => {
        if (err) {
          return deferred.reject(err);
        }
        else if (300 < res.status && res.status < 500) {
          console.warn("ClientError:", res.status, url);
        }
        return deferred.resolve(res.body);
      });
    return deferred.promise;
  }

/**
 * Get an object from remote server
 * @param  {number} id ID of object to retrieve
 * @return {promise}    promise
 */
  get(id) {
    var deferred = q.defer();
    var url = this._getObjectUrl(id);

    superagent
      .get(url)
      .end((err, res) => {
        if (err) {
          return deferred.reject(err);
        }
        else if (300 < res.status && res.status < 500) {
          console.warn("ClientError:", res.status, url);
        }
        return deferred.resolve(res.body);
      });
    return deferred.promise;
  }

/**
 * Get collection from remote server
 * @return {promise} promise
 */
  getAll() {
    var deferred = q.defer();
    var url = this._getResourceUrl();

    superagent
      .get(url)
      .end((err, res) => {
        if (err) {
          return deferred.reject(err);
        }
        else if (300 < res.status && res.status < 500) {
          console.warn("ClientError:", res.status, url);
        }
        return deferred.resolve(res.body);
      });
    return deferred.promise;
  }
}

module.exports = Client;
