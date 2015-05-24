"use strict";

var React = require('react');
var _ = require('underscore');
var DSManager = require('../services/DataStoreManager');

module.exports = {

  getInitialState() {
    return {
      data: false
    };
  },

  _buildProps() {
    var props = _.extend({}, this.props);
    delete props.children;
    delete props.config;

    // Nil hack basically.
    var data = this.state.data || (this.props.objectId && {}) || [];

    var actions = this.dataSource && this.dataSource.listenables;
    return _.extend(props, { data, actions });
  },

  _prepareDatasource(config) {
    this.dataSource = DSManager.getStore( config );
    this.listenTo(this.dataSource, this.onStoreChange);
  },

  onStoreChange(type, payload) {
    this._reloadCollection(this.props);
  },
  render() {
    if (!this.state.data) { return null; }
    var children = this._cloneWithProps(this._buildProps());
    return(
      <div>
        {children}
      </div>
    );
  }
};
