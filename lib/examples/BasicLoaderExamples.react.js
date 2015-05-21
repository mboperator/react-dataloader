var React = require('react');
var Datasource = require('../components/Datasource.react');
var Collection = require('../components/Collection.react');
var EditableObject = require('../components/EditableObject.react');

var exampleConfig = {
  name: "Parents",
  idAttr: "id",
  basePath: "http://localhost:8083/api",
  endpoint: "sample",
  storeType: "shared"
};

var BasicLoaderExamples = React.createClass({
  render() {
    return (
      <div>
        <h2>Datasource</h2>
        <Datasource config={exampleConfig}>
          <Collection handleSelect={this.props.handleSelect}/>
        </Datasource>

        <h2>Datasource w/ ObjectId</h2>
        <Datasource config={exampleConfig}
          objectId={this.props.objectId}>
          <EditableObject onUpdate={this.onObjectUpdate}/>
        </Datasource>
      </div>
    );
  }
});

module.exports = BasicLoaderExamples;
