var React = require('react');

var BasicLoaderExamples = require('./examples/BasicLoaderExamples.react');
var DependentLoaderExample = require('./examples/DependentLoaderExample.react');
var FilteredLoaderExample = require('./examples/FilteredLoaderExample.react');


var App = React.createClass({
  getInitialState() {
    return {
      objectId: 1,
      mounted: true
    };
  },
  render() {
    return (
      <div>
        <button onClick={this.toggleExamples}>
          RELOAD
        </button>

        { this.renderExamples() }
      </div>
    );
  },
  toggleExamples() {
    this.setState({mounted: !this.state.mounted});
  },
  renderExamples() {
    if (!this.state.mounted) return(<div>Unmounted</div>);
    return(
      <div>
        <BasicLoaderExamples 
          handleSelect={this.handleSelect} 
          objectId={this.state.objectId}/>

        <DependentLoaderExample
          objectId={this.state.objectId}/>

        <FilteredLoaderExample/>

      </div>
    );
  },
  handleSelect(objectId) {
    console.log("Selected", objectId);
    this.setState({objectId});
  }
});

// Test function
window.renderApp = function() {
  React.render(<App/>, document.querySelector(".app"));
};
