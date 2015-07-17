var React = require('react');
var BasicDatasource = require('../components/BasicDatasource.react');
var Collection = require('../components/Collection.react');
var EditableObject = require('../components/EditableObject.react');

var exampleUrl = 'http://localhost:8083/api/sample';

var BasicDatasourceExample = React.createClass({
  render() {
    return (
      <div>
        <h2>Basic Datasource</h2>
        <BasicDatasource
          url={exampleUrl}
          queryParams={{page: 1, admin: true}}>
          <Collection/>
        </BasicDatasource>
      </div>
    );
  },
});

module.exports = BasicDatasourceExample;
