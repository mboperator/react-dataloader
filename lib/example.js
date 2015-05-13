var React = require('react');

var ObjectLoader = require('./components/ObjectLoader.react');
var CollectionLoader = require('./components/CollectionLoader.react');
var Collection = require('./components/Collection.react');
var ObjectTest = require('./components/Object.react');

var exampleConfig = {
  name: "shared",
  dataConfig: {
    name: "Test",
    idAttribute: "id",
    basePath: "http://localhost:8080/api/",
    endpoint: "sample.json",
    storeType: "shared"
  },
  viewConfig: {
    editable: ['edit', 'new'],
    deletable: ['edit']
  }
};

var App = React.createClass({
  getInitialState() {
    return {
      objectId: 1
    };
  },
  render() {
    return (
      <div>
        <CollectionLoader config={exampleConfig}>
          <Collection/>
        </CollectionLoader>

        <ObjectLoader config={exampleConfig} objectId={this.state.objectId}>
          <ObjectTest/>
        </ObjectLoader>
      </div>
    );
  }
});

// Test function
window.renderApp = function() {
  React.render(<App/>, document.querySelector(".app"));
};

module.exports = {
  CollectionLoader, ObjectLoader
};
