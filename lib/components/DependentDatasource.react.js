"use strict";

var React = require('react');
var Reflux = require('reflux');
var _ = require('underscore');
var UtilityMixin = require('../mixins/UtilityMixin');
var DSManager = require('../services/DataStoreManager');

/**
 * DependentDatasource
 */
var DependentDatasource = React.createClass({
  propTypes: {
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
    fkAttr: React.PropTypes.string,
    /**
     * Parent object (we use this object's ID as the FK)
     */
    data: React.PropTypes.object.isRequired,
    /**
     * Collection Tag
     */
    tag: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      config: {
        idAttr: "id",
        fkAttr: "parent_id",
        storeType: "unique"
      },
      data: { }
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

    this.dataSource = DSManager.instance().getStore(config);
    this.listenTo(this.dataSource, this.onStoreChange);
  },

  _updateDynamicView(props) {
    var data = props.data;
    var { idAttr, fkAttr } = props.config;

    if (data[idAttr]) {
      var query = {};
      query[fkAttr] = data[idAttr];
      this.dataSource.listenables.filter(props.tag, query);
    }
  },

  _reloadCollection(props) {
    var collection = this.dataSource.getCollection(props.tag);
    this.setState({ collection });
  },

  componentWillReceiveProps(nextProps) {
    var { idAttr } = nextProps.config;
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
    } 
  },

  componentDidMount() {
    this._prepareDatasource(this.props);
    this._updateDynamicView(this.props);
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

module.exports = DependentDatasource;
