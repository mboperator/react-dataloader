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
    config: React.PropTypes.shape({
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
    }),
    /**
     * Initial data
     */
    data: React.PropTypes.array,
    /**
     * Collection Tag
     */
    tag: React.PropTypes.string
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
    delete props.config;

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
    var { config } = props;

    this.dataSource = DSManager.instance().getStore( config );
    this.listenTo(this.dataSource, this.onStoreChange);
  },

  _registerView(props) {
    var { tag } = props;
    var { sortBy, filter } = props.config;
    this.dataSource.listenables.registerView(tag, {sortBy, filter});
  },

  _reloadCollection(props) {
    var collection = this.dataSource.getCollection(props.tag);
    this.setState({ collection });
  },

  componentWillReceiveProps(nextProps) {
    // Checks for data source switches
    if (nextProps.config.name !== this.props.config.name) {
      this.stopListeningToAll();
      this._prepareDatasource(nextProps);
    } 

    // Checks for endpoint changes
    else if (nextProps.config.endpoint !== this.props.config.endpoint) {
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
