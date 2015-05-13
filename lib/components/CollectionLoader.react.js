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
     * ID attr to query on
     */
    idAttr: React.PropTypes.string,
    /**
     * Initial collection
     */
    collection: React.PropTypes.array
  },

  getDefaultProps: function() {
    return {
      idAttr: "id",
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

  _reloadCollection() {
    var collection = this.dataSource.getCollection();
    this.setState({ collection });
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.name !== this.props.name) {
      this.stopListeningToAll();
      this._prepareDatasource(nextProps);
    }
  },

  componentDidMount() {
    this._prepareDatasource(this.props);
  },

  onStoreChange(type, payload) {
    this._reloadCollection();
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
