"use strict";

var React = require('react');

var ObjectTest = React.createClass({
  propTypes: {
    parent: React.PropTypes.object.isRequired
  },
  render() {
    return(
      <table className="edit">
        { Object.keys(this.props.parent).map(key => {
          return(<tr><th>{key}</th><td>{this.props.parent[key]}</td></tr>);
        }) }
      </table>
    );
  }
});

module.exports = ObjectTest;
