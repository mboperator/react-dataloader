"use strict";

var React = require('react/addons');
var _ = require('underscore');

/**
 * @module UtilityMixin
 * @type {Object}
 */
var UtilityMixin = {
  /**
   * Clones children with given props
   * @param  {object} props Props to give to children
   * @return {array}       Array of child components with new props
   */
  _cloneWithProps(props) {
    return React.Children.map(this.props.children, (child) => {
      if (!child) { return null; }
      return React.cloneElement(child, props);
    }, this.context);
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
