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

  _onViewRegistered() {
    var {dataSource} = this.state;
    var {tag, autoPopulate} = this.props;
    var data = dataSource.getCollection(tag);
    _.isEmpty(data) && this._repopulate(this.props, this.state);
  },

  onStoreChange(type, payload) {
    if (type === 'viewRegistered' && payload === this.props.tag) {
      this._onViewRegistered();
    }
    this._reloadCollection(this.props, this.state);
  },
  render() {
    console.log("render dataamixin", this.constructor.displayName, this.state.data);
    var children = this._cloneWithProps(this._buildDataProps());
    var Wrapper = this.props.wrapper || "div";
    return (
      <Wrapper className={this.props.className}>
        {children}
      </Wrapper>
    );
  }
};
