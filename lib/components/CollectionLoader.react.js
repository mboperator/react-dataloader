"use strict";

var React = require('react/addons');
var Reflux = require('reflux');
var _ = require('underscore');
var UtilityMixin = require('../mixins/UtilityMixin');
var DSManager = require('../services/DataStoreManager');

/**
 * CollectionLoader
 * @param  {string} name
 * @param  {string} url
 * @param  {string} storeType - enum [shared, unique]
 * @param  {array} collection array to populate initial state (optional)
 * @return {ReactComponent} children returns children with collection
 */
var CollectionLoader = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
    url: React.PropTypes.string,
    storeType: React.PropTypes.string.isRequired,
    collection: React.PropTypes.array
  },

  getDefaultProps: function() {
    return {
      collection: [],
      parent: {}
    };
  },

  mixins: [
    Reflux.ListenerMixin,
    UtilityMixin
  ],
  
  _buildProps() {
    var props = this._fetchViewConfig();
    var collection = this.state.collection;
    return _.extend(props, { collection });
  },

  getInitialState() {
    return {
      collection: this.props.collection
    };
  },

  _prepareDatasource(props) {
    var { name, url, storeType } = props;
    this.dataSource = DSManager.instance().getStore({name, url, storeType});
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
