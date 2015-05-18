"use strict";

var React = require('react');
var _ = require("underscore");
var ObjectTest = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired
  },
  getInitialState() {
    return {
      data: this.props.data
    };
  },
  componentWillUpdate: function(nextProps) {
    var nextData = nextProps.data;
    var prevData = this.state.data;
    if( nextData && !_.isEqual(nextData, prevData)) {
      this.setState({data: nextData});
    }
  },
  getDefaultProps() {
    return {
      data: {}
    };
  },
  render() {
    return (
      <table className="edit">
        { Object.keys(this.props.data).map(key => {
          return(
            <tr>
              <th>{key}</th>
              <td>{this.renderEditableCell(key, this.props.data[key])}</td>
            </tr>
          );
        }) }
      </table>
    );
  },
  update(key, e) {
    var input = this.refs[key];
    var value = input && input.getDOMNode().value;
    var data = _.extend({}, this.state.data, {[key]: value});
    this.setState({data});

    //try to persist the data on the backend
    this.props.actions.update(data);
  },
  renderEditableCell(key, value) {
    return (
      <td>
        <textarea ref={key} name={key}>{value}</textarea>
        <button onClick={this.update.bind(null, key)}>Update</button>
      </td>
    );
  }
});

module.exports = ObjectTest;
