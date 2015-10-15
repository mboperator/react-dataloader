function defaultUrlBuilder(options) {
  return {
  /**
   * Generate resource URL
   * @return {string} resource API endpoint url
   */
    _getResourceUrl(object) {
      const {basePath, endpoint} = this;
      return (!basePath || !endpoint) ? null : `${basePath}/${endpoint}`;
    },

  /**
   * Generate single resource URL
   * @param  {number} id ID of resource
   * @return {string} resource API url
   */
    _getObjectUrl(id) {
      const {basePath, endpoint} = this;
      return `${basePath}/${endpoint}/${id}`;
    }
  };
}

module.exports = defaultUrlBuilder;
