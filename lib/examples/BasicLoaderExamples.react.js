var React = require('react');
var ObjectLoader = require('../components/ObjectLoader.react');
var CollectionLoader = require('../components/CollectionLoader.react');
var Collection = require('../components/Collection.react');
var ObjectTest = require('../components/Object.react');

var exampleConfig = {
  name: "Parents",
  idAttr: "id",
  basePath: "http://localhost:8083/api/",
  endpoint: "sample",
  storeType: "unique"
};

var BasicLoaderExamples = React.createClass({
  render() {
    return (
      <div>
        <h2>CollectionLoader</h2>
        <CollectionLoader {...exampleConfig}>
          <Collection handleSelect={this.props.handleSelect}/>
        </CollectionLoader>

        <h2>ObjectLoader</h2>
        <ObjectLoader {...exampleConfig} 
          objectId={this.props.objectId}>
          <ObjectTest/>
        </ObjectLoader>
      </div>
    );
  }
});

module.exports = BasicLoaderExamples;
