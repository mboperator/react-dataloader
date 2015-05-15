var React = require('react');
var UtilityMixin = require('../mixins/UtilityMixin');

var Transformer = React.createClass({
  propTypes: {
    funk: React.PropTypes.func.isRequired,
    collection: React.PropTypes.array.isRequired
  },
  getDefaultProps() {
    return {
      collection: []
    };
  },
  mixins: [ UtilityMixin ],
  render() {
    var { collection, funk } = this.props;
    var children = this._cloneWithProps({collection: funk(collection)});
    return(
      <div>
        { children }
      </div>
    );
  }
});

module.exports = Transformer;
