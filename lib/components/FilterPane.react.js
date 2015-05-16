var React = require('react');
var Datasource = require('./Datasource.react');
var Collection = require('./Collection.react');
var Transformer = require('./Transformer.react');

var _ = require('underscore');

var filterConfig = {
  name: "Filtered",
  idAttr: "id",
  basePath: "http://localhost:8083/api/",
  endpoint: "children",
  storeType: "shared",
  filter: { age: { '$gt': 10 } },
  sortBy: { age: false }
};

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
      <select>
        { this.props.data.map(elem => {
          return(<option key={elem}>{elem}</option>);
        }) }
      </select>
    );
  }
});

var FilterPane = React.createClass({
  propTypes: {
    tag: React.PropTypes.string.isRequired
  },

  render() {
    return (
      <Datasource {...filterConfig}>

        <label>Name</label>
        <Transformer funk={uniqueValuesForKey('name')}>
          <GenericSelect/>
        </Transformer>

        <label>Age</label>
        <Transformer funk={uniqueValuesForKey('age')}>
          <GenericSelect/>
        </Transformer>

      </Datasource>
    );
  }
});

module.exports = FilterPane;
