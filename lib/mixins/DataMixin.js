"use strict";

var React = require('react');
var _ = require('underscore');
var DSManager = require('../services/DataStoreManager');

module.exports = {
  contextTypes: { router: React.PropTypes.func.isRequired },
  
  getInitialState() {
    return {
      data: this.props.data
    };
  },

  _buildProps() {
    var props = _.extend({}, this.props);
    delete props.children;
    delete props.config;

    var data = this.state.data;
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
    var children = this._cloneWithProps(this._buildProps());
    return(
      <div>
        {children}
      </div>
    );
  }
};
