"use strict";

var React = require('react');
var Reflux = require('reflux');

var UtilityMixin = require('../mixins/UtilityMixin');
var DataMixin = require('../mixins/DataMixin');

var _ = require('underscore');

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
    }),
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
    filters: React.PropTypes.object,
    /**
     * Optional parent object
     */
    data: React.PropTypes.object,
    /**
     * Collection Tag
     */
    tag: React.PropTypes.string.isRequired
  },

  getDefaultProps: function() {
    return {
      config: {
        idAttr: "id",
        storeType: "unique"
      }
    };
  },

  mixins: [
    Reflux.ListenerMixin,
    UtilityMixin,
    DataMixin
  ],

  _registerView(props) {
    var { tag, sortBy, filters, search, data, config } = props;
    var { idAttr, fkAttr } = config;

    if (data && data[idAttr]) {
      var query = {};
      query[fkAttr] = data[idAttr];
      filters = _.extend(query, filters);
    }
    debugger;
    this.dataSource.listenables.registerView(tag, {sortBy, filters, search});
  },

  _reloadCollection(props) {
    var data = this.dataSource.getCollection(props.tag);
    this.setState({ data });
  },

  _repopulate(props) {
    if (!props.data) { return this.dataSource.listenables.populate(); }
    var { idAttr, fkAttr, idRootAttr, fkRootAttr } = props.config;
    var query = {};
    query[fkAttr] = props.data[idAttr];
    query.rootId = props.rootId;
    query[fkAttr] && this.dataSource.listenables.populate(query);
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

    else if (nextProps.filters !== this.props.filters) {
      this.dataSource.listenables.resetView(nextProps.tag, false);
      this._registerView(nextProps);
    }

    else if (nextProps.search !== this.props.search) {
      this.dataSource.listenables.resetView(nextProps.tag, false);
      this._registerView(nextProps);
    }
  },

  componentDidMount() {
    var config = _.extend({}, this.props.config);
    var {data} = this.props;
    if (data && data[config.idAttr]) {
      config.dependent = true;
      config.rootId = this.props.rootId;
    }
    this._prepareDatasource(config);
    this._registerView(this.props);
    this._repopulate(this.props);
  }
});

module.exports = FilteredDatasource;
