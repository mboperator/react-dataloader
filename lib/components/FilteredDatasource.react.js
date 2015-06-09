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
    var { idAttr, fkAttr } = props.config;
    var query = {};

    if (props.data) {
      query[fkAttr] = props.data[idAttr];
      query.rootId = props.rootId;
      query[fkAttr] && dataSource.listenables.populate(query);
    } else if (props.loadId) {
      query.loadId = props.loadId;
    }
    
    return dataSource.listenables.populate(query);
  },

  didViewChange(nextProps) {
    return (
      nextProps.filters !== this.props.filters ||
      nextProps.search !== this.props.search
    );
  },

  didConfigChange(nextProps) {
    return (
      nextProps.config.name !== this.props.config.name ||
      nextProps.config.endpoint !== this.props.config.endpoint
    );
  },

  didWatchedPropsChange(nextProps, watchProps) {
    return watchProps && _.every(watchProps, (prop) => {
      if (this.props.data[prop] !== nextProps.data[prop]) {return true;}
    });
  },

  componentWillReceiveProps(nextProps) {
    var { idAttr, fkAttr, watchProps } = nextProps.config;
    var viewChanged = this.didViewChange(nextProps);
    var configChanged = this.didConfigChange(nextProps);
    var watchedPropsChanged = this.didWatchedPropsChange(nextProps, watchProps);
    var idChanged = this.props.data && nextProps.data && nextProps.data[idAttr] !== this.props.data[idAttr];
    idChanged = idChanged || (nextProps.loadId !== this.props.loadId);

    if (configChanged) {
      this._prepareDatasource(nextProps);
    }

    if (this.state.dataSource && (viewChanged || idChanged) ) {
      this.state.dataSource.listenables.resetView(nextProps.tag, false);
      this._registerView(nextProps, this.state);
    }

    // Checks for parent changes
    if (this.state.dataSource) {
      if ( idChanged  /*|| watchedPropsChanged */) {
        this._repopulate(nextProps, this.state);
      }
    }

    //if watching parent then repopulate if props.data has changed
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
