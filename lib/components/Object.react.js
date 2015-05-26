"use strict";

var React = require('react');

var ObjectTest = React.createClass({
  propTypes: {
    data: React.PropTypes.object
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
          var value = JSON.stringify(this.props.data[key]);
          return(<tr key={key}><th>{key}</th><td>{value}</td></tr>);
        }) }
      </table>
    );
  }
});

module.exports = ObjectTest;
