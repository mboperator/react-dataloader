var React = require('react');
var CollectionLoader = require('./components/CollectionLoader.react');

var filterConfig = {
  name: "Filtered",
  idAttr: "id",
  basePath: "http://localhost:8083/api/",
  endpoint: "children",
  storeType: "shared",
  filter: { age: { '$gt': 10 } },
  sortBy: { age: false }
};

var Transform = React.createClass({
  propTypes: {
    funk: React.PropTypes.func.isRequired
  },
  render() {
    return (
      <div>
        
      </div>
    );
  }
});

var FilterPane = React.createClass({
  propTypes: {
    tag: React.PropTypes.string.isRequired
  },

  render() {
    return (
      <div>
        <CollectionLoader {...filterConfig}>
          <Transform funk={someMapFunction}>
            <GenericSelectDropdown/>
          </Transform>

          <Transform funk={someMapFunction}>
            <GenericSelectDropdown/>
          </Transform>

          <Transform funk={someMapFunction}>
            <GenericSelectDropdown/>
          </Transform>

          <Transform funk={someMapFunction}>
            <GenericSelectDropdown/>
          </Transform>
        </CollectionLoader>

      </div>
    );
  }
});

module.exports = FilterPane;
