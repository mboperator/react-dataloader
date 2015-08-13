"use strict";

var React = require('react');
var _ = require('underscore');
var DSManager = require('../services/DataStoreManager');

module.exports = {

  getInitialState() {
    return {
      data: null,
      dataSource: null,
      firstLoadComplete: false,
      loading: true,
    };
  },

  _buildDataProps() {
    var props = this._buildProps();
    // Nil hack basically.
    var {data, dataSource, loading, firstLoadComplete} = this.state;
    var actions = {};
    if (this.state.dataSource) {
      actions = this.state.dataSource && this.state.dataSource.listenables;
    }
    return _.extend(props, {
      data,
      actions,
      dataSource,
      firstLoadComplete,
      loading,
    });
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
    var children = this._cloneWithProps(this._buildDataProps());
    var Wrapper = this.props.wrapper || "div";
    return (
      <Wrapper className={this.props.className}>
        {children}
      </Wrapper>
    );
  }
};
