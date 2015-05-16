var React = require('react');
var UtilityMixin = require('../mixins/UtilityMixin');

var Transformer = React.createClass({
  propTypes: {
    funk: React.PropTypes.func.isRequired,
    data: React.PropTypes.array.isRequired
  },
  getDefaultProps() {
    return {
      data: []
    };
  },
  mixins: [ UtilityMixin ],
  render() {
    var { data, funk } = this.props;
    var children = this._cloneWithProps({data: funk(data)});
    return(
      <div>
        { children }
      </div>
    );
  }
});

module.exports = Transformer;
