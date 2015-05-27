var React = require('react');

var Datasource = require('../components/Datasource.react');
var FilteredDatasource = require('../components/FilteredDatasource.react');
var Collection = require('../components/Collection.react');
var FilterPane = require('../components//FilterPane.react');

var filterConfig = {
  name: "Filtered",
  idAttr: "id",
  basePath: "http://localhost:8083/api",
  endpoint: "children",
  storeType: "shared"
};

var filter = { age: { '$gt': 10 } };
var sortBy = { attribute: "age", isDescending: true };

var FilteredLoaderExample = React.createClass({
  render() {
    return (
      <div>
        <h2>FilteredDatasource</h2>
        <Datasource config={filterConfig}>
          <FilterPane tag="filter"/>
        </Datasource>

        <FilteredDatasource 
          config={filterConfig} 
          tag="filter"
          filter={filter}
          sortBy={sortBy}>
          <Collection/>
        </FilteredDatasource>
      </div>
    );
  }
});

module.exports = FilteredLoaderExample;
