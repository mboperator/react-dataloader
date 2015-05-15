var React = require('react');

var FilteredCollectionLoader = require('../components/FilteredCollectionLoader.react');
var Collection = require('../components/Collection.react');

var filterConfig = {
  name: "Filtered",
  idAttr: "id",
  basePath: "http://localhost:8083/api/",
  endpoint: "children",
  storeType: "shared",
  filter: { age: { '$gt': 10 } },
  sortBy: { attribute: "age", isDescending: true }
};

var FilteredLoaderExample = React.createClass({
  render: function() {
    return (
      <div>
        <h2>FilteredCollectionLoader</h2>
        <FilteredCollectionLoader {...filterConfig} tag="filter">
          <Collection/>
        </FilteredCollectionLoader>
      </div>
    );
  }
});

module.exports = FilteredLoaderExample;
