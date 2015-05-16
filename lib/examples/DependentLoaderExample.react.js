var React = require('react');
var Datasource = require('../components/Datasource.react');
var DependentDatasource = require('../components/DependentDatasource.react');
var Collection = require('../components/Collection.react');

var exampleConfig = {
  name: "Parents",
  idAttr: "id",
  basePath: "http://localhost:8083/api/",
  endpoint: "sample",
  storeType: "shared"
};

var dependentConfig = {
  name: "Children",
  idAttr: "id",
  basePath: "http://localhost:8083/api/",
  endpoint: "children",
  storeType: "shared"
};

var DependentLoaderExample = React.createClass({
  propTypes: {
    objectId: React.PropTypes.string.isRequired
  },
  getDefaultProps: function() {
    return {
      objectId: 1
    };
  },
  render() {
    return (
      <div>
        <h2>DependentDatasource</h2>
        <Datasource {...exampleConfig} 
          objectId={this.props.objectId}>
          <DependentDatasource {...dependentConfig} tag="children">
            <Collection/>
          </DependentDatasource>
        </Datasource>
      </div>
    );
  }
});

module.exports = DependentLoaderExample;
