var React = require('react');
var CollectionLoader = require('./components/CollectionLoader.react');
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

function uniqueValuesForKey(key, array) {
  return _.chain(array)
          .map(element => { return element[key]; })
          .uniq()
          .compact()
          .value();
}

var FilterPane = React.createClass({
  propTypes: {
    tag: React.PropTypes.string.isRequired
  },

  render() {
    return (
      <CollectionLoader {...filterConfig}>

        <Transformer mapFunction={uniqueValuesForKey().bind(null, 'name')}>
          <GenericSelectDropdown/>
        </Transformer>

        <Transformer mapFunction={uniqueValuesForKey().bind(null, 'age')}>
          <GenericSelectDropdown/>
        </Transformer>

      </CollectionLoader>
    );
  }
});

module.exports = FilterPane;
