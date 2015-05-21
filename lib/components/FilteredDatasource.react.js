"use strict";

var React = require('react');
var Reflux = require('reflux');

var UtilityMixin = require('../mixins/UtilityMixin');
var DataMixin = require('../mixins/DataMixin');

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
      config: {
        idAttr: "id",
        storeType: "unique"
      },
      data: []
    };
  },

  mixins: [
    Reflux.ListenerMixin,
    UtilityMixin,
    DataMixin
  ],

  _registerView(props) {
    var { tag } = props;
    var { sortBy, filter } = props.config;
    this.dataSource.listenables.registerView(tag, {sortBy, filter});
  },

  _reloadCollection(props) {
    var data = this.dataSource.getCollection(props.tag);
    this.setState({ data });
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
    this._prepareDatasource(this.props.config);
    this._registerView(this.props);
    this.dataSource.listenables.populate();
  }
});

module.exports = FilteredDatasource;
