var React = require('react');
var Datasource = require('./Datasource.react');
var Collection = require('./Collection.react');
var Transformer = require('./Transformer.react');

var _ = require('underscore');

function uniqueValuesForKey(key) {
  return function(array) {
    return _.chain(array)
            .map(element => { return element[key]; })
            .uniq()
            .compact()
            .value();
    };
}

var GenericSelect = React.createClass({
  render() {
    return(
      <select onChange={this._handleChange}>
        <option key={"default"} value={null}></option>
        { this.props.data.map((elem, i) => {
          return(<option key={elem} value={i}>{elem}</option>);
        }) }
      </select>
    );
  },
  _handleChange(e) {
    var value = this.props.data[e.target.value];
    this.props.onSelect(value);
  }
});

var FilterPane = React.createClass({
  propTypes: {
    tag: React.PropTypes.string.isRequired,
    data: React.PropTypes.array,
    actions: React.PropTypes.object
  },

  render() {
    var { actions, data, tag } = this.props;
    var resetFilters = actions && actions.resetView.bind(null, tag);
    return (
      <div>
        <label>Name</label>
        <Transformer data={data} funk={uniqueValuesForKey('name')}>
          <GenericSelect onSelect={this.setFilter.bind(null, 'name')}/>
        </Transformer>

        <label>Age</label>
        <Transformer data={data} funk={uniqueValuesForKey('age')}>
          <GenericSelect onSelect={this.setFilter.bind(null, 'age')}/>
        </Transformer>

        <button onClick={resetFilters}>Reset filters</button>
      </div>
    );
  },

  setFilter(key, value) {
    var { tag, actions } = this.props;
    var query = {};
    query[key] = value;

    actions.filter(tag, query);
  }
});

module.exports = FilterPane;
