var React = require('react');
var Datasource = require('../components/Datasource.react');
var FilteredDatasource = require('../components/FilteredDatasource.react');
var Collection = require('../components/Collection.react');

var exampleConfig = {
  name: "Parents",
  idAttr: "id",
  basePath: "http://localhost:8083/api",
  endpoint: "sample",
  storeType: "shared"
};

var dependentConfig = {
  name: "Children",
  idAttr: "id",
  basePath: "http://localhost:8083/api",
  endpoint: "children",
  storeType: "shared",
  fkAttr: "parent_id"
};

var DependentLoaderExample = React.createClass({
  propTypes: {
    objectId: React.PropTypes.number
  },
  getDefaultProps() {
    return {
      objectId: 1
    };
  },
  render() {
    return (
      <div>
        <h2>DependentDatasource</h2>
        <Datasource
          config={exampleConfig}
          objectId={this.props.objectId}>
          <FilteredDatasource config={dependentConfig} tag="children">
            <Collection/>
          </FilteredDatasource>
        </Datasource>
      </div>
    );
  }
});

module.exports = DependentLoaderExample;
