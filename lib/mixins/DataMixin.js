"use strict";

var React = require('react');
var _ = require('underscore');
var DSManager = require('../services/DataStoreManager');

module.exports = {

  getInitialState() {
    return {
      data: [],
      dataSource: null
    };
  },

  _buildDataProps() {
    var props = this._buildProps();
    // Nil hack basically.
    var data = this.state.data || (this.props.objectId && {}) || [];
    var actions = {};
    if (this.state.dataSource) {
      actions = this.state.dataSource && this.state.dataSource.listenables;
    }
    return _.extend(props, {data, actions});
  },

  _prepareDatasource(config) {
    var dataSource = DSManager.getStore(config);
    this.listenTo(dataSource, this.onStoreChange);
    this.setState({dataSource});
  },

  onStoreChange(type, payload) {
    this._reloadCollection(this.props, this.state);
  },
  render() {
    console.log("render dataamixin", this.constructor.displayName, this.state.data);
    var children = this._cloneWithProps(this._buildDataProps());
    return (
      <div className={this.props.className}>
        {children}
      </div>
    );
  }
};
