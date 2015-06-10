"use strict";

var React = require('react');
var _ = require('underscore');

/**
 * @module UtilityMixin
 * @type {Object}
 */
var UtilityMixin = {

  _buildProps() {
    var props = _.clone(this.props);
    delete props.children;
    delete props.className;
    delete props.tag;
    delete props.config;
    return props;
  },

  /**
   * Clones children with given props
   * @param  {object} props Props to give to children
   * @return {array}       Array of child components with new props
   */
  _cloneWithProps(props) {
    var children = React.Children.map(this.props.children, (child) => {
      if (!child) { return null; }
      return React.cloneElement(child, props);
    }, this.context);
    return children;
  },

/**
 * Console warns with component display name
 * @param  {string} warning Warning message
 */
  _warn(warning) {
    console.warn(this.constructor.displayName, warning);
  }
};

module.exports = UtilityMixin;
