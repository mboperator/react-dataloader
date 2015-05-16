var React = require('react');
var ObjectLoader = require('../components/ObjectLoader.react');
var Datasource = require('../components/Datasource.react');
var Collection = require('../components/Collection.react');
var ObjectTest = require('../components/Object.react');

var exampleConfig = {
  name: "Parents",
  idAttr: "id",
  basePath: "http://localhost:8083/api/",
  endpoint: "sample",
  storeType: "shared"
};

var BasicLoaderExamples = React.createClass({
  render() {
    return (
      <div>
        <h2>Datasource</h2>
        <Datasource {...exampleConfig}>
          <Collection handleSelect={this.props.handleSelect}/>
        </Datasource>

        <h2>ObjectLoader</h2>
        <Datasource {...exampleConfig} 
          objectId={this.props.objectId}>
          <ObjectTest/>
        </Datasource>
      </div>
    );
  }
});

module.exports = BasicLoaderExamples;
