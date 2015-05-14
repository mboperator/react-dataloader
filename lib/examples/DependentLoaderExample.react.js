var React = require('react');
var ObjectLoader = require('../components/ObjectLoader.react');
var DependentCollectionLoader = require('../components/DependentCollectionLoader.react');
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
  render() {
    return (
      <div>
        <h2>DependentCollectionLoader</h2>
        <ObjectLoader {...exampleConfig} 
          objectId={this.props.objectId}>
          <DependentCollectionLoader {...dependentConfig} tag="children">
            <Collection/>
          </DependentCollectionLoader>
        </ObjectLoader>
      </div>
    );
  }
});

module.exports = DependentLoaderExample;
