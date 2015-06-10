"use strict";

function getPath() {
  return Procore && Procore.Environment && Procore.Environment.checklistRoot || "";
}

function procoreUrlBuilder(options) {
  var { fkAttr, parentResource, rootResource, fkRootAttr, resource } = options;
  var postFix = '.json';
  return {
  /**
   * Generate resource URL
   * @param { object } object Object being operated upon
   * @return {string} resource API endpoint url
   */
    _getResourceUrl(object) {
      var object = object ? object : {};
      var url;
      var parentId = object && object[fkAttr];
      var {rootId, loadId} = !!object && object;

      if (rootId) {
        url = `${getPath()}/${rootResource}/${rootId}/${this.endpoint}`;
      }
      else if (parentResource && parentId) {
        url = `${getPath()}/${parentResource}/${parentId}/${this.endpoint}`;
      }
      else if (parentId) {
        url = `${getPath()}/${this.endpoint}/${parentId}`;
      }
      else if (loadId) {
        url = `${getPath()}/${this.endpoint}/${loadId}`;
      }
      else {
        url = `${getPath()}/${this.endpoint}`;
      }

      return `${url}${postFix}`;
    },

  /**
   * Generate single resource URL
   * @param  {number} id ID of resource
   * @return {string} resource API url
   */
    _getObjectUrl(id) {
      return `${getPath()}/${this.endpoint}/${id}${postFix}`;
    },

    _serialize(object) {
      var data = {};
      if (resource) {
        data[resource] = object;
      }
      else {
        data = object;
      }
      return data;
    }

  };
}

module.exports = procoreUrlBuilder;
