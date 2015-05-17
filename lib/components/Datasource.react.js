"use strict";

var React = require('react/addons');
var Reflux = require('reflux');
var _ = require('underscore');
var UtilityMixin = require('../mixins/UtilityMixin');
var DSManager = require('../services/DataStoreManager');

/**
 * Datasource
 */
var Datasource = React.createClass({
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
     * Initial data
     */
    data: React.PropTypes.array
  },

  getDefaultProps: function() {
    return {
      idAttr: "id",
      storeType: "unique",
      data: []
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

    var data = this.state.data;
    var actions = this.dataSource.listenables;
    return _.extend(props, { data, actions });
  },

  getInitialState() {
    return {
      data: this.props.data
    };
  },

  _prepareDatasource(props) {
    var { name, basePath, endpoint, storeType, idAttr } = props;
    this.dataSource = DSManager.instance().getStore({name, basePath, endpoint, storeType, idAttr});
    this.listenTo(this.dataSource, this.onStoreChange);
  },

  _reloadCollection(id) {
    var data = this.dataSource.get(id);

    this.setState({ data });
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.name !== this.props.name) {
      this.stopListeningToAll();
      this._prepareDatasource(nextProps);
    } else if (nextProps.objectId !== this.props.objectId) {
      this._reloadCollection(this.props.objectId);
    }
  },

  componentDidMount() {
    this._prepareDatasource(this.props);
    this._reloadCollection(this.props.objectId);
  },

  onStoreChange(type, payload) {
    this._reloadCollection(this.props.objectId);
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

module.exports = Datasource;
