function defaultUrlBuilder(options) {
  return {
  /**
   * Generate resource URL
   * @return {string} resource API endpoint url
   */
    _getResourceUrl(object) {
      return `${this.basePath}/${this.endpoint}`;
    },

  /**
   * Generate single resource URL
   * @param  {number} id ID of resource
   * @return {string} resource API url
   */
    _getObjectUrl(id) {
      return `${this.basePath}/${this.endpoint}/${id}`;
    }
  };
}

module.exports = defaultUrlBuilder;
