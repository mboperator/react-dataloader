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

  _registerView(props, state) {
    var { tag, sortBy, filters, search, data, config } = props;
    var { idAttr, fkAttr } = config;
    var {dataSource} = state;
    var fk, query = {};
    if (data) {
      query[fkAttr] = data[idAttr] || 999;
    }
    filters = _.extend(query, filters);
    dataSource.listenables.registerView(tag, {sortBy, filters, search});
  },

  _reloadCollection(props, state) {
    var {dataSource} = state;
    var data = dataSource.getCollection(props.tag);
    this.setState({ data });
  },

  _repopulate(props, state) {
    var {dataSource} = state;
    if (!props.data) { return dataSource.listenables.populate(); }
    var { idAttr, fkAttr, idRootAttr, fkRootAttr } = props.config;
    var query = {};
    query[fkAttr] = props.data[idAttr];
    query.rootId = props.rootId;
    query[fkAttr] && dataSource.listenables.populate(query);
  },

  componentWillReceiveProps(nextProps) {
    var { idAttr, fkAttr } = nextProps.config;
    // Checks for data source switches
    if (nextProps.config.name !== this.props.config.name) {
      this.stopListeningToAll();
      this._prepareDatasource(nextProps);
    }

    // Checks for endpoint changes
    else if (nextProps.config.endpoint !== this.props.config.endpoint) {
      this._prepareDatasource(nextProps);
    }

    else if (this.state.dataSource && nextProps.filters !== this.props.filters) {
      this.state.dataSource.listenables.resetView(nextProps.tag, false);
      this._registerView(nextProps, this.state);
    }

    else if (this.state.dataSource && nextProps.search !== this.props.search) {
      this.state.dataSource.listenables.resetView(nextProps.tag, false);
      this._registerView(nextProps, this.state);
    }

    // Checks for parent changes
    if (!nextProps.data) { return; }
    else if (nextProps.data[idAttr] !== this.props.data[idAttr] && this.state.dataSource) {
      this.state.dataSource.listenables.resetView(this.props.tag, false);
      this._registerView(nextProps, this.state);
      this._repopulate(nextProps, this.state);
    }
  },

  componentWillUpdate(nextProps, nextState) {
    if(this.state.dataSource != nextState.dataSource) {
      this._registerView(nextProps, nextState);
      this._repopulate(nextProps, nextState);
    }
  },

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !_.isEqual(nextState, this.state) ||
      !_.isEqual(nextProps, this.props)
    );
  },

  componentDidMount() {
    var config = _.extend({}, this.props.config);
    var {data} = this.props;
    if (data && data[config.idAttr]) {
      config.dependent = true;
      config.rootId = this.props.rootId;
    }
    this._prepareDatasource(config);
  }
});

module.exports = FilteredDatasource;
