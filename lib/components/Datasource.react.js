"use strict";

var React = require('react');
var Reflux = require('reflux');
var _ = require('underscore');
var UtilityMixin = require('../mixins/UtilityMixin');
var DSManager = require('../services/DataStoreManager');

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
      },
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

    var data = this.state.data;
    var actions = this.dataSource && this.dataSource.listenables;
    return _.extend(props, { data, actions });
  },

  getInitialState() {
    return {
      data: this.props.data
    };
  },

  _prepareDatasource(props) {
    var { config } = props;
    this.dataSource = DSManager.instance().getStore(config);
    this.listenTo(this.dataSource, this.onStoreChange);
  },

  _reloadCollection(id) {
    var data = this.dataSource.get(id);

    this.setState({ data });
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.name !== this.props.name) {
      this.stopListeningToAll();
      this._prepareDatasource(nextProps);
    } else if (nextProps.objectId !== this.props.objectId) {
      this._reloadCollection(nextProps.objectId);
    }
  },

  componentDidMount() {
    this._prepareDatasource(this.props);
    this._reloadCollection(this.props.objectId);
  },

  onStoreChange(type, payload) {
    this._reloadCollection(this.props.objectId);
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

module.exports = Datasource;
