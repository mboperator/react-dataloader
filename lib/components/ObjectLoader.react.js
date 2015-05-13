"use strict";

var React = require('react/addons');
var Reflux = require('reflux');
var _ = require('underscore');
var UtilityMixin = require('../mixins/UtilityMixin');
var DSManager = require('../services/DataStoreManager');

/**
 * ObjectLoader
 */
var ObjectLoader = React.createClass({
  propTypes: {
    /**
     * Resource Name
     */
    name: React.PropTypes.string,
    /**
     * Resource BasePath
     */
    basePath: React.PropTypes.string,
    /**
     * Resource endpoint
     */
    endpoint: React.PropTypes.string,
    /**
     * Type of store, enum: [shared, unique]
     */
    storeType: React.PropTypes.string.isRequired,
    /**
     * ID attr to query on
     */
    idAttr: React.PropTypes.string,
    /**
     * Initial parent object
     */
    parent: React.PropTypes.object,
    /**
     * ID of Object to Load
     */
    objectId: React.PropTypes.number.isRequired
  },

  getDefaultProps: function() {
    return {
      idAttr: "id",
      storeType: "unique",
      parent: {},
      objectId: 1
    };
  },

  mixins: [
    Reflux.ListenerMixin,
    UtilityMixin
  ],

  _buildProps() {
    var props = _.extend({}, this.props);
    delete props.children;
    delete props.name;
    delete props.basePath;
    delete props.endpoint;
    delete props.idAttr;
    delete props.storeType;

    var parent = this.state.parent;
    return _.extend(props, { parent });
  },

  getInitialState() {
    return {
      parent: this.props.parent
    };
  },

  _prepareDatasource(props) {
    var { name, basePath, endpoint, storeType, idAttr } = props;
    this.dataSource = DSManager.instance().getStore({name, basePath, endpoint, storeType, idAttr});
    this.listenTo(this.dataSource, this.onStoreChange);
    this.dataSource.listenables.populate();
  },

  _reloadSelf(objectId) {
    var parent = this.dataSource.get(objectId) || {};
    this.setState({ parent });
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.name !== this.props.name) {
      this.stopListeningToAll();
      this._prepareDatasource(nextProps);
    } else if (nextProps.objectId !== this.props.objectId) {
      this._reloadSelf(nextProps.objectId);
    }
  },

  componentDidMount() {
    this._prepareDatasource(this.props);
  },

  onStoreChange(type, payload) {
    this._reloadSelf(this.props.objectId);
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
