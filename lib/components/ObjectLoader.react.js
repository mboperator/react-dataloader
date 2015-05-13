"use strict";

var React = require('react/addons');
var Reflux = require('reflux');
var _ = require('underscore');
var UtilityMixin = require('../mixins/UtilityMixin');
var DSManager = require('../services/DataStoreManager');

/**
 * ObjectLoader
 * @param  {object} config view and data configs (required)
 * @param  {object} parent object to populate initial state (optional)
 * @return {ReactComponent} children returns children with config and parent
 */
var ObjectLoader = React.createClass({
  propTypes: {
    config: React.PropTypes.object.isRequired,
    parent: React.PropTypes.object,
    objectId: React.PropTypes.number.isRequired
  },

  mixins: [
    Reflux.ListenerMixin,
    UtilityMixin
  ],

  _buildProps() {
    var props = this._fetchViewConfig();
    var parent = this.state.parent || {};
    var actions = this.dataSource && this.dataSource.listenables;
    return _.extend(props, { parent, actions });
  },

  getInitialState() {
    return {
      parent: this.props.parent || {}
    };
  },

  _prepareDatasource(newConfig) {
    this.dataSource = DSManager.instance().getStore(newConfig);
    this.listenTo(this.dataSource, this.onStoreChange);
    this.dataSource.listenables.populate();
  },

  _reloadSelf(objectId) {
    var parent = this.dataSource.get(objectId || this.props.objectId) || {};
    this.setState({ parent });
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.config !== this.props.config) {
      this.stopListeningToAll();
      this._prepareDatasource(nextProps.config.dataConfig);
    } else if (nextProps.objectId !== this.props.objectId) {
      this._reloadSelf(nextProps.objectId);
    }
  },

  componentDidMount() {
    this.dataSource = DSManager.instance().getStore(this._fetchDataConfig());
    this.listenTo(this.dataSource, this.onStoreChange);
    this.dataSource.listenables.populate();
  },

  onStoreChange(type, payload) {
    this._reloadSelf();
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

module.exports = ObjectLoader;
