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
      idAttr: React.PropTypes.string,
      /**
       * Determine if the store should populate himself initially
       */
       autoPopulate: React.PropTypes.bool,
    }),
    /**
     * Initial data
     */
    data: React.PropTypes.array
  },

  getDefaultProps() {
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

  _reloadCollection(props, state) {
    var id = props.objectId;
    var {onData} = this.props;
    var {dataSource} = state;
    if (dataSource) {
      var data = id ? dataSource.get(id) : dataSource.getCollection();
      onData && onData(data);
      this.setState({data});
    }
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.name !== this.props.name) {
      this.stopListeningToAll();
      this._prepareDatasource(nextProps);
    }
    else if (nextProps.objectId !== this.props.objectId) {
      this._populate(nextProps, this.state);
    }
  },

  componentWillUpdate(nextProps, nextState) {
    if(this.state.dataSource != nextState.dataSource) {
      this._populate(nextProps, nextState);
    }
    else {
      // this._reloadCollection(nextProps, nextState);
    }
  },

  _populate(props, state) {
    var {dataSource} = state;
    var object = props.objectId ? {id: props.objectId} : null;
    dataSource.listenables.populate(object);
  },


  componentDidMount() {
    this._prepareDatasource(this.props.config);
    this._reloadCollection(this.props, this.state);
    // todo instead of id use fkAttr or something

  }
});

module.exports = Datasource;
