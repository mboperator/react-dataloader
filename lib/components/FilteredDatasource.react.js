"use strict";

var React = require('react');
var Reflux = require('reflux');
var _ = require('underscore');
var UtilityMixin = require('../mixins/UtilityMixin');
var DSManager = require('../services/DataStoreManager');

/**
 * FilteredDatasource
 */
var FilteredDatasource = React.createClass({
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
     * ID attribute to query on
     */
    idAttr: React.PropTypes.string,
    /**
     * Initial collection
     */
    collection: React.PropTypes.array,
    /**
     * Collection Tag
     */
    tag: React.PropTypes.string,
    /**
     * Sort Parameters
     */
    sortBy: React.PropTypes.shape({
      attribute: React.PropTypes.string,
      isDescending: React.PropTypes.boolean
    }),
    /**
     * Filter Criteria (mongo style)
     */
    filter: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      idAttr: "id",
      storeType: "unique",
      collection: []
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
    delete props.tag;

    var data = this.state.collection;
    var actions = this.dataSource && this.dataSource.listenables;
    return _.extend(props, { data, actions });
  },

  getInitialState() {
    return {
      collection: this.props.collection
    };
  },

  _prepareDatasource(props) {
    var { 
      name, 
      basePath, 
      endpoint, 
      storeType, 
      idAttr
    } = props;

    this.dataSource = DSManager.instance().getStore({name, basePath, endpoint, storeType, idAttr});
    this.listenTo(this.dataSource, this.onStoreChange);
  },

  _registerView(props) {
    var { tag, sortBy, filter } = props;
    this.dataSource.listenables.registerView(tag, {sortBy, filter});
  },

  _reloadCollection(props) {
    var collection = this.dataSource.getCollection(props.tag);
    this.setState({ collection });
  },

  componentWillReceiveProps(nextProps) {
    // Checks for data source switches
    if (nextProps.name !== this.props.name) {
      this.stopListeningToAll();
      this._prepareDatasource(nextProps);
    } 

    // Checks for endpoint changes
    else if (nextProps.endpoint !== this.props.endpoint) {
      this._prepareDatasource(nextProps);
    } 
  },

  componentDidMount() {
    this._prepareDatasource(this.props);
    this._registerView(this.props);
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
});

module.exports = FilteredDatasource;
