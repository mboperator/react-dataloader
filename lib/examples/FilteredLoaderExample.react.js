var React = require('react');

var FilteredDatasource = require('../components/FilteredDatasource.react');
var Collection = require('../components/Collection.react');
var FilterPane = require('../components//FilterPane.react');

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
  render() {
    return (
      <div>
        <h2>FilteredDatasource</h2>
        <FilterPane/>
        <FilteredDatasource config={filterConfig} tag="filter">
          <Collection/>
        </FilteredDatasource>
      </div>
    );
  }
});

module.exports = FilteredLoaderExample;
