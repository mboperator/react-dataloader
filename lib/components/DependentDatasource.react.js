"use strict";

var React = require('react/addons');
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
      idAttr: "id",
      fkAttr: "parent_id",
      data: { },
      storeType: "unique"
    };
  },

  mixins: [
    Reflux.ListenerMixin,
    UtilityMixin
  ],
  
  _buildProps() {
    var props = _.extend({}, this.props);
    delete props.children;
    delete props.name;
    delete props.basePath;
    delete props.endpoint;
    delete props.idAttr;
    delete props.fkAttr;
    delete props.data;
    delete props.storeType;
    delete props.tag;

    var data = this.state.collection;
    return _.extend(props, { data });
  },

  getInitialState() {
    return {
      collection: this.props.collection
    };
  },

  _prepareDatasource(props) {
    var { 
      name, 
      basePath, 
      endpoint, 
      storeType, 
      idAttr
    } = props;

    this.dataSource = DSManager.instance().getStore({name, basePath, endpoint, storeType, idAttr});
    this.listenTo(this.dataSource, this.onStoreChange);
  },

  _updateDynamicView(props) {
    var {
      data,
      idAttr,
      fkAttr
    } = props;

    if (data[idAttr]) {
      var query = {};
      query[fkAttr] = data[idAttr];
      this.dataSource.listenables.filter(this.props.tag, query);
    }
  },

  _reloadCollection(props) {
    var collection = this.dataSource.getCollection(props.tag);
    this.setState({ collection });
  },

  componentWillReceiveProps(nextProps) {
    var { idAttr } = nextProps;
    // Checks for data source switches
    if (nextProps.name !== this.props.name) {
      this.stopListeningToAll();
      this._prepareDatasource(nextProps);
    } 

    // Checks for endpoint changes
    else if (nextProps.endpoint !== this.props.endpoint) {
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
