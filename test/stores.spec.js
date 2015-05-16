var LokiStore = require('../lib/stores/LokiStore');
var ImmutableStore = require('../lib/stores/ImmutableStore');

var Reflux = require("reflux");
var assert = require('assert');

var options = {
  name: "test",
  idAttr: "id"
};

function testSuite(inStore) {
  var store = Reflux.createStore(inStore);
  var stockObj = {id: 1, name: "marcus"};
  var stockObjTwo = {id: 2, name: "joe"};
  store.add(stockObjTwo);

  it('should respond to add', function() {
    store.add(stockObj);
    var objects = store.get();

    assert.equal(2, objects.length);
  });

  it('should respond to destroy', function() {
    store.destroy(stockObj.id);
    var objects = store.get();

    assert.equal(1, objects.length);
    assert.equal(objects[0].name, stockObjTwo.name);
  });

  it('should respond to get', function() {
    var queried = store.get(stockObjTwo.id);

    Object.keys(stockObjTwo).forEach((key) => {
      assert.equal(queried[key], stockObjTwo[key]);
    });
  });

  it('should respond to update', function() {
    var toUpdate = store.get(stockObjTwo.id);
    toUpdate.name = "george";

    store.update(toUpdate);
    assert.equal("george", store.get(stockObjTwo.id).name);
    assert.equal(stockObjTwo.id, store.get(stockObjTwo.id).id);
  });

  it('should query objects', function() {
    var objects = store.find({name: 'george'});

    assert.equal(1, objects.length);
  });

  it('should get all objects', function() {
    var objects = store.get();

    assert.equal(1, objects.length);
  });

  it('should destroyAll objects', function() {
    store.destroyAll();
    var objects = store.get();

    assert.equal(0, objects.length);
  });
}

describe('LokiStore', testSuite.bind(null, LokiStore(options)));
describe('ImmutableStore', testSuite.bind(null, ImmutableStore(options)));
