"use strict";

var React = require('react/addons');
var Reflux = require('reflux');
var _ = require('underscore');
var UtilityMixin = require('../mixins/UtilityMixin');
var DSManager = require('../services/DataStoreManager');

/**
 * CollectionLoader
 */
var CollectionLoader = React.createClass({
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
    collection: React.PropTypes.array
  },

  getDefaultProps: function() {
    return {
      idAttr: "id",
      fkAttr: "parent_id",
      parent: { id: 1 },
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
    var { name, basePath, endpoint, storeType, idAttr } = props;
    this.dataSource = DSManager.instance().getStore({name, basePath, endpoint, storeType, idAttr});
    this.listenTo(this.dataSource, this.onStoreChange);
    this.dataSource.listenables.populate();
  },

  _reloadCollection(props) {
    //TODO: Create LokiView
    var collection = [];
    var {fkAttr, parent } = props;

    if (parent.id) {
      var query = {};
      query[fkAttr] = parent.id;
      collection = this.dataSource.find(query);
    }

    this.setState({ collection });
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.name !== this.props.name) {
      this.stopListeningToAll();
      this._prepareDatasource(nextProps);
    } else if (nextProps.parent.id !== this.props.parent.id) {
      this._reloadCollection(nextProps);
    }
  },

  componentDidMount() {
    this._prepareDatasource(this.props);
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

module.exports = CollectionLoader;
