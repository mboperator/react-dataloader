# react-dataloader
We built the data loading layer so you don't have to.

## Why
The main purpose of this component library is to take care of data loading, store generation, and persistence so that you can focus on views instead of data fetching.

## What's included:
- ObjectLoader
- CollectionLoader
- DependentCollectionLoader
- FilteredCollectionLoader
- Examples

## Usage
```javascript
// Somewhere
var exampleConfig = {
  name: "Parents",
  idAttribute: "id",
  basePath: "http://localhost:8083/api/",
  endpoint: "sample",
  storeType: "shared"
};

// In your render function
<CollectionLoader {...exampleConfig}>
  <SomeViewComponent>
</CollectionLoader>
```
- SomeViewComponent should expect to receive `(array) collection` as well as any other props passed to CollectionLoader
