function getPath() {
  return Procore && Procore.Environment && Procore.Environment.checklistPath || "";
}

function procoreUrlBuilder(options) {
  var { fkAttr, parentResource } = options;
  return {
  /**
   * Generate resource URL
   * @param { object } object Object being operated upon
   * @return {string} resource API endpoint url
   */
    _getResourceUrl(object) {

      if (!parentResource) {
        return `${getPath()}/${object[fkAttr]}/${this.endpoint}`;
      }
      return `${getPath()}/${parentResource}/${object[fkAttr]}/${this.endpoint}`;
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

module.exports = procoreUrlBuilder;
