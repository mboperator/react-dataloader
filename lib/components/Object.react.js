"use strict";

var React = require('react');

var ObjectTest = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired
  },
  getDefaultProps: function() {
    return {
      data: {}
    };
  },
  render() {
    return (
      <table className="edit">
        { this.props.data && Object.keys(this.props.data).map(key => {
          return(<tr><th>{key}</th><td>{this.props.data[key]}</td></tr>);
        }) }
      </table>
    );
  }
});

module.exports = ObjectTest;
