"use strict";

var React = require('react');
var Reflux = require('reflux');
var _ = require('underscore');
var UtilityMixin = require('../mixins/UtilityMixin');
var DSManager = require('../services/DataStoreManager');

/**
 * CollectionLoader
 * @param  {object} config view and data configs (required)
 * @param  {array} collection array to populate initial state (optional)
 * @return {ReactComponent} children returns children with config and collection
 */
var CollectionLoader = React.createClass({
  propTypes: {
    config: React.PropTypes.object.isRequired,
    collection: React.PropTypes.array,
    parent: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      collection: [],
      parent: {}
    };
  },

  mixins: [
    Reflux.ListenerMixin,
    UtilityMixin
  ],
  
  _buildProps() {
    var props = this._fetchViewConfig();
    var collection = this.state.collection;
    var parent = this.props.parent;
    return _.extend(props, { collection, parent });
  },

  getInitialState() {
    return {
      collection: this.props.collection
    };
  },

  _prepareDatasource(newConfig) {
    this.dataSource = DSManager.instance().getStore(newConfig);
    this.listenTo(this.dataSource, this.onStoreChange);
    this.dataSource.listenables.populate();
  },

  _reloadCollection(parentId) {
    var collection = this.dataSource.getCollection(parentId || this.props.parent.id);
    this.setState({ collection });
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.config !== this.props.config) {
      this.stopListeningToAll();
      this._prepareDatasource(nextProps.config.dataConfig);
    } else if (nextProps.parent !== this.props.parent) {
      this._reloadCollection(nextProps.parent.id);
    }
  },

  componentDidMount() {
    this.dataSource = DSManager.instance().getStore(this._fetchDataConfig());
    this.listenTo(this.dataSource, this.onStoreChange);
    this.dataSource.listenables.populate();
  },

  onStoreChange(type, payload) {
    this._reloadCollection();
  },

  render() {
    var children = this._cloneWithProps(this._buildProps());
    return(
      <div>
        {children}
      </div>
    );
  }
});

module.exports = CollectionLoader;
