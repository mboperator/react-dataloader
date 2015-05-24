"use strict";

var React = require('react');
var Reflux = require('reflux');

var UtilityMixin = require('../mixins/UtilityMixin');
var DataMixin = require('../mixins/DataMixin');

var extend = require('underscore').extend;

/**
 * DependentDatasource
 */
var DependentDatasource = React.createClass({
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
       * ForeignKey attribute to query on
       */
      fkAttr: React.PropTypes.string
    }),
    /**
     * Parent object (we use this object's ID as the FK)
     */
    data: React.PropTypes.object,
    /**
     * Collection Tag
     */
    tag: React.PropTypes.string,
    /**
     * Scope requests to parentID?
     */
    scoped: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      config: {
        idAttr: "id",
        fkAttr: "parent_id",
        storeType: "unique"
      }
    };
  },

  mixins: [
    Reflux.ListenerMixin,
    UtilityMixin,
    DataMixin
  ],

  _updateDynamicView(props) {
    var data = props.data;
    var { idAttr, fkAttr } = props.config;

    if (data && data[idAttr]) {
      var query = {};
      query[fkAttr] = data[idAttr];
      this.dataSource.listenables.filter(props.tag, query);
    }
  },

  _reloadCollection(props) {
    var data = this.dataSource.getCollection(props.tag);
    this.setState({ data });
  },

  _repopulate(props) {
    if (!props.data) return;
    var { idAttr, fkAttr } = props.config;
    var query = {};
    query[fkAttr] = props.data[idAttr];
    query[fkAttr] && this.dataSource.listenables.populate(query);
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

    // Checks for parent changes
    if (!nextProps.data) { return; }
    else if (nextProps.data[idAttr] !== this.props.data[idAttr]) {
      this._updateDynamicView(nextProps);
      this._repopulate(nextProps);
    }
  },

  componentDidMount() {
    var config = extend({}, this.props.config);
    config.dependent = true;

    this._prepareDatasource(config);
    this._updateDynamicView(this.props);
    this._repopulate(this.props);
  }
});

module.exports = DependentDatasource;
