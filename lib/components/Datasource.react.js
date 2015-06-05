"use strict";

var React = require('react');
var Reflux = require('reflux');

var UtilityMixin = require('../mixins/UtilityMixin');
var DataMixin = require('../mixins/DataMixin');
var _ = require('underscore');

/**
 * Datasource
 */
var Datasource = React.createClass({
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
       * ID attr to query on
       */
      idAttr: React.PropTypes.string
    }),
    /**
     * Initial data
     */
    data: React.PropTypes.array
  },

  getDefaultProps() {
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

  _reloadCollection(props) {
    var data = this.dataSource.get(props.objectId);
    this.setState({ data });
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.name !== this.props.name) {
      this.stopListeningToAll();
      this._prepareDatasource(nextProps);
    } else if (nextProps.objectId !== this.props.objectId) {
      this._reloadCollection(nextProps);
    }
  },

  componentDidMount() {
    this._prepareDatasource(this.props.config);
    this._reloadCollection(this.props);
    // todo instead of id use fkAttr or something
    var object = this.props.objectId ? {id :this.props.objectId} : null;
    this.dataSource.listenables.populate(object);
  }
});

module.exports = Datasource;
