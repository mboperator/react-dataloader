var React = require('react');

var ObjectLoader = require('./components/ObjectLoader.react');
var CollectionLoader = require('./components/CollectionLoader.react');
var Collection = require('./components/Collection.react');
var ObjectTest = require('./components/Object.react');

var exampleConfig = {
  name: "Test",
  idAttribute: "id",
  basePath: "http://localhost:8083/api/",
  endpoint: "sample",
  storeType: "shared"
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
        <h2>CollectionLoader</h2>
        <CollectionLoader {...exampleConfig}>
          <Collection/>
        </CollectionLoader>

        <h2>ObjectLoader</h2>
        <ObjectLoader {...exampleConfig}>
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
