function getPath() {
  return Procore && Procore.Environment && Procore.Environment.checklistRoot || "";
}

function procoreUrlBuilder(options) {
  var { fkAttr, parentResource, rootResource, fkRootAttr } = options;
  return {
  /**
   * Generate resource URL
   * @param { object } object Object being operated upon
   * @return {string} resource API endpoint url
   */
    _getResourceUrl(object) {
      if (!object) {
        return `${getPath()}/${this.endpoint}`;
      }else if (object.rootId) {
        return `${getPath()}/${rootResource}/${object.rootId}/${this.endpoint}`;
      } else if (!parentResource) {
        return `${getPath()}/${object[fkAttr]}/${this.endpoint}`;
      } else {
        return `${getPath()}/${parentResource}/${object[fkAttr]}/${this.endpoint}`;
      }
    },

  /**
   * Generate single resource URL
   * @param  {number} id ID of resource
   * @return {string} resource API url
   */
    _getObjectUrl(id) {
      return `${this.basePath}/${this.endpoint}/${id}`;
    },

    _serialize(object) {
      var data = {};
      if (resource) {
        data[resource] = object;
      } else {
        data = object;
      }
      return data;
    }

  };
}

module.exports = procoreUrlBuilder;
