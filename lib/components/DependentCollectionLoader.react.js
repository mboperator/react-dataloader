"use strict";

var React = require('react/addons');
var Reflux = require('reflux');
var _ = require('underscore');
var UtilityMixin = require('../mixins/UtilityMixin');
var DSManager = require('../services/DataStoreManager');

/**
 * DependentCollectionLoader
 */
var DependentCollectionLoader = React.createClass({
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
    parent: React.PropTypes.object.isRequired,
    /**
     * Initial collection
     */
    collection: React.PropTypes.array,
    /**
     * Collection Tag
     */
    tag: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      idAttr: "id",
      fkAttr: "parent_id",
      parent: { },
      storeType: "unique",
      collection: []
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
    delete props.storeType;

    var collection = this.state.collection;
    return _.extend(props, { collection });
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
      parent,
      idAttr,
      fkAttr
    } = props;

    if (parent[idAttr]) {
      var query = {};
      query[fkAttr] = parent[idAttr];
      this.dataSource.listenables.filter(this.props.tag, query);
    }
  },

  _reloadCollection(props) {
    var collection = this.dataSource.getCollection(props.tag);
    this.setState({ collection });
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.name !== this.props.name) {
      this.stopListeningToAll();
      this._prepareDatasource(nextProps);
    } else if (nextProps.parent.id !== this.props.parent.id) {
      this._updateDynamicView(nextProps);
    } else if (nextProps.endpoint !== this.props.endpoint) {
      this._prepareDatasource(nextProps);
    }
  },

  componentDidMount() {
    this._prepareDatasource(this.props);
    this.dataSource.listenables.populate();
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

module.exports = DependentCollectionLoader;
