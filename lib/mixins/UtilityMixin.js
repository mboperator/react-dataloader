"use strict";

var React = require('react');
var cloneWithProps = require('react/lib/cloneWithProps');

/**
 * @module UtilityMixin
 * @type {Object}
 */
var UtilityMixin = {

  _fetchViewConfig() {
    return this.props.config.viewConfig || {};
  },

  _fetchDataConfig() {
    var dataConfig = this.props.config.dataConfig || {};
    if (dataConfig === {} && !this.props.collection) {
      this._warn("No dataConfig or collection specified!");
    }
    return dataConfig;
  },

  /**
   * Clones children with given props
   * @param  {object} props Props to give to children
   * @return {array}       Array of child components with new props
   */
  _cloneWithProps(props) {
    return React.Children.map(this.props.children, (child) => {
      return cloneWithProps(child, props);
    });
  },

/**
 * Console warns with component display name
 * @param  {string} warning Warning message
 */
  _warn(warning) {
    console.warn(this.constructor.displayName, warning);
  },
};

module.exports = UtilityMixin;
