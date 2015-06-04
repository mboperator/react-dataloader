"use strict";

var React = require('react');
var _ = require('underscore');
var DSManager = require('../services/DataStoreManager');

module.exports = {

  getInitialState() {
    return {
      data: []
    };
  },

  _buildProps() {
    var props = _.clone(this.props);
    delete props.children;
    delete props.config;

    // Nil hack basically.
    var data = this.state.data || (this.props.objectId && {}) || [];

    var actions = this.dataSource && this.dataSource.listenables;
    return _.extend(props, { data, actions });
  },

  _prepareDatasource(config) {
    this.dataSource = DSManager.getStore( config );
    this.actions = this.dataSource.listenables;
    this.listenTo(this.dataSource, this.onStoreChange);
  },

  onStoreChange(type, payload) {
    this._reloadCollection(this.props);
  },
  render() {
    console.log("render dataamixin", this.constructor.displayName, this.state.data);
    if (!this.state.data || this.state.data.length < 1 ) { return null; }
    var children = this._cloneWithProps(this._buildProps());
    return(
      <div className={this.props.className}>
        {children}
      </div>
    );
  }
};
