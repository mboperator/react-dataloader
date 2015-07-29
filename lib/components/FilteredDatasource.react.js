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
      /**
       * Determine if the store should populate himself initially
       */
       autoPopulate: React.PropTypes.bool,
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
    tag: React.PropTypes.string.isRequired,
    /**
     * Optional Request Params
     */
    params: React.PropTypes.object,
  },

  getDefaultProps: function() {
    return {
      autoPopulate: true,
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
      query[fkAttr] = data[idAttr] || props.objectId || -1;
    }
    filters = _.extend(query, filters);

    return dataSource.listenables.registerView(tag, {sortBy, filters, search});
  },

  _reloadCollection(props, state) {
    var {dataSource} = state;
    var {onData} = this.props;
    var data = dataSource.getCollection(props.tag);

    onData && onData(data, dataSource.listenables);
    // this clone bug was absolutely insane. let's put this on our dev guide
    this.setState({ data: _.clone(data) });
  },

  _repopulate(props, state) {
    var {autoPopulate, params} = props;
    var {dataSource} = state;
    var { idAttr, fkAttr } = props.config;
    var query = {};

    if (props.autoPopulate) {
      if (props.rootId) { query.rootId = props.rootId; }
      if (props.loadId) { query.loadId = props.loadId; }
      if (props.data) { query[fkAttr] = props.data[idAttr]; }
      if (props.objectId) { query[fkAttr] = props.objectId; }

      dataSource.listenables.populate(query, params);
    }
  },

  didViewChange(nextProps) {
    return (
      !_.isEqual(nextProps.filters, this.props.filters) ||
      !_.isEqual(nextProps.search, this.props.search)
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

  didIdChange(nextProps) {
    var { idAttr } = nextProps.config;
    var id = (this.props.data && this.props.data[idAttr]) || this.props.objectId;
    var nextId = (nextProps.data && nextProps.data[idAttr]) || nextProps.objectId;

    var idChanged = nextId !== id;
    idChanged = idChanged || (nextProps.loadId !== this.props.loadId);

    return idChanged;
  },

  didParamsChange(nextProps) {
    if (!_.isEqual(nextProps.params, this.props.params)) {
      return true;
    }
    return false;
  },

  componentWillReceiveProps(nextProps) {
    var { idAttr, fkAttr, watchProps } = nextProps.config;
    var viewChanged = this.didViewChange(nextProps);
    var configChanged = this.didConfigChange(nextProps);
    var watchedPropsChanged = this.didWatchedPropsChange(nextProps, watchProps);
    var idChanged = this.didIdChange(nextProps);
    var queryChanged = this.didParamsChange(nextProps);

    if (configChanged) this._prepareDatasource(nextProps.config);

    if (this.state.dataSource && (viewChanged || idChanged) ) {
      this.state.dataSource.listenables.resetView(nextProps.tag, false);
      this._registerView(nextProps, this.state);
    }

    // Checks for parent changes
    if (this.state.dataSource) {
      if ( idChanged || queryChanged ) {
        this._repopulate(nextProps, this.state);
      }
    }

    //if watching parent then repopulate if props.data has changed
  },

  componentWillUpdate(nextProps, nextState) {
    if(this.state.dataSource != nextState.dataSource) {
      this._registerView(nextProps, nextState);
    }
  },

  shouldComponentUpdate(nextProps, nextState) {
    if (
      !_.isEqual(nextState, this.state) ||
      !_.isEqual(nextProps, this.props) ) {
      return true;
    }
    return false;
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
